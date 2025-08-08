using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using PDV.Core.Entities;

namespace PDV.Fiscal.Services;

public class SATService
{
    private readonly ILogger<SATService> _logger;
    private readonly string _portaSAT;
    private readonly string _codigoAtivacao;

    public SATService(ILogger<SATService> logger)
    {
        _logger = logger;
        _portaSAT = "COM1"; // Configurável
        _codigoAtivacao = "123456"; // Configurável
    }

    public async Task<ResultadoSAT> EmitirCFeAsync(Venda venda, Empresa empresa)
    {
        try
        {
            _logger.LogInformation("Iniciando emissão de CFe-SAT para venda {NumeroVenda}", venda.NumeroVenda);

            // Validar dados da empresa
            if (string.IsNullOrEmpty(empresa.CNPJ) || string.IsNullOrEmpty(empresa.NumeroSerieSAT))
            {
                throw new InvalidOperationException("Dados fiscais da empresa incompletos");
            }

            // Gerar XML do CFe
            var xmlCFe = await GerarXMLCFeAsync(venda, empresa);

            // Enviar para SAT
            var resultado = await EnviarParaSATAsync(xmlCFe);

            if (resultado.Sucesso)
            {
                venda.StatusSAT = StatusSAT.Emitido;
                venda.NumeroSAT = resultado.NumeroCFe;
                venda.ChaveAcessoSAT = resultado.ChaveAcesso;
                venda.ProtocoloSAT = resultado.Protocolo;
                venda.DataEmissaoSAT = DateTime.Now;
                venda.XMLSAT = xmlCFe.ToString();
                venda.DANFESAT = await GerarDANFESATAsync(venda, empresa);

                _logger.LogInformation("CFe-SAT emitido com sucesso: {ChaveAcesso}", resultado.ChaveAcesso);
            }
            else
            {
                venda.StatusSAT = StatusSAT.Erro;
                _logger.LogError("Erro na emissão do CFe-SAT: {Mensagem}", resultado.MensagemErro);
            }

            return resultado;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao emitir CFe-SAT");
            venda.StatusSAT = StatusSAT.Erro;
            throw;
        }
    }

    public async Task<ResultadoSAT> CancelarCFeAsync(Venda venda, Empresa empresa, string justificativa)
    {
        try
        {
            _logger.LogInformation("Iniciando cancelamento de CFe-SAT: {ChaveAcesso}", venda.ChaveAcessoSAT);

            if (string.IsNullOrEmpty(venda.ChaveAcessoSAT))
                throw new InvalidOperationException("CFe-SAT não possui chave de acesso");

            // Gerar XML de cancelamento
            var xmlCancelamento = await GerarXMLCancelamentoSATAsync(venda, empresa, justificativa);

            // Enviar cancelamento para SAT
            var resultado = await EnviarCancelamentoParaSATAsync(xmlCancelamento);

            if (resultado.Sucesso)
            {
                venda.StatusSAT = StatusSAT.Cancelado;
                _logger.LogInformation("CFe-SAT cancelado com sucesso");
            }
            else
            {
                _logger.LogError("Erro no cancelamento do CFe-SAT: {Mensagem}", resultado.MensagemErro);
            }

            return resultado;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar CFe-SAT");
            throw;
        }
    }

    public async Task<StatusSAT> VerificarStatusSATAsync()
    {
        try
        {
            _logger.LogInformation("Verificando status do SAT");

            // Comando para verificar status
            var comando = "{\"cmd\":\"status\"}";
            var resposta = await EnviarComandoSATAsync(comando);

            if (resposta.Contains("OK"))
                return StatusSAT.Disponivel;
            else if (resposta.Contains("ERRO"))
                return StatusSAT.Erro;
            else
                return StatusSAT.Indisponivel;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar status do SAT");
            return StatusSAT.Erro;
        }
    }

    public async Task<ResultadoSAT> ConsultarSATAsync(string chaveAcesso)
    {
        try
        {
            _logger.LogInformation("Consultando CFe-SAT: {ChaveAcesso}", chaveAcesso);

            var comando = $"{{\"cmd\":\"consultar\",\"chave\":\"{chaveAcesso}\"}}";
            var resposta = await EnviarComandoSATAsync(comando);

            // Processar resposta
            if (resposta.Contains("OK"))
            {
                return new ResultadoSAT
                {
                    Sucesso = true,
                    ChaveAcesso = chaveAcesso,
                    NumeroCFe = ExtrairNumeroCFe(resposta),
                    Protocolo = ExtrairProtocolo(resposta)
                };
            }
            else
            {
                return new ResultadoSAT
                {
                    Sucesso = false,
                    MensagemErro = "CFe não encontrado"
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao consultar CFe-SAT");
            return new ResultadoSAT
            {
                Sucesso = false,
                MensagemErro = ex.Message
            };
        }
    }

    private async Task<XDocument> GerarXMLCFeAsync(Venda venda, Empresa empresa)
    {
        var xml = new XDocument(
            new XDeclaration("1.0", "UTF-8", null),
            new XElement("CFe",
                new XAttribute("versao", "0.08"),
                new XAttribute("xmlns", "http://www.portalfiscal.inf.br/nfe"),
                
                // Cabeçalho
                new XElement("infCFe",
                    new XAttribute("Id", $"CFe{venda.ChaveAcessoSAT}"),
                    new XAttribute("versaoDadosEnt", "0.08"),
                    
                    // Identificação do CFe
                    new XElement("ide",
                        new XElement("CNPJ", empresa.CNPJ.Replace(".", "").Replace("/", "").Replace("-", "")),
                        new XElement("signAC", "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"),
                        new XElement("numeroCaixa", "001"),
                        new XElement("cNF", venda.NumeroVenda.ToString("D9")),
                        new XElement("cDV", "1"),
                        new XElement("mod", "59"), // SAT
                        new XElement("nserieSAT", empresa.NumeroSerieSAT),
                        new XElement("dEmi", venda.DataVenda.ToString("yyyyMMdd")),
                        new XElement("hEmi", venda.DataVenda.ToString("HHmmss")),
                        new XElement("vCFe", venda.Total.ToString("F2").Replace(",", ".")),
                        new XElement("tpAmb", "2"), // Homologação
                        new XElement("CNPJSh", "16716114000172"), // CNPJ do Software House
                        new XElement("signACS", "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"),
                        new XElement("numeroCaixa", "001")
                    ),

                    // Emitente
                    new XElement("emit",
                        new XElement("CNPJ", empresa.CNPJ.Replace(".", "").Replace("/", "").Replace("-", "")),
                        new XElement("xNome", empresa.RazaoSocial),
                        new XElement("xFant", empresa.NomeFantasia),
                        new XElement("enderEmit",
                            new XElement("xLgr", empresa.Endereco),
                            new XElement("nro", empresa.Numero),
                            new XElement("xBairro", empresa.Bairro),
                            new XElement("xMun", empresa.Cidade),
                            new XElement("UF", empresa.UF),
                            new XElement("CEP", empresa.CEP.Replace("-", "")),
                            new XElement("cPais", "1058"),
                            new XElement("xPais", "BRASIL")
                        ),
                        new XElement("IE", empresa.InscricaoEstadual ?? "ISENTO"),
                        new XElement("IM", empresa.InscricaoMunicipal ?? ""),
                        new XElement("cRegTrib", "3") // Simples Nacional
                    ),

                    // Destinatário
                    new XElement("dest",
                        new XElement("CNPJ", "00000000000000"),
                        new XElement("xNome", "CONSUMIDOR FINAL"),
                        new XElement("indIEDest", "9") // Não contribuinte
                    ),

                    // Itens
                    new XElement("det", venda.Itens.Select(item => 
                        new XElement("prod",
                            new XElement("cProd", item.CodigoProduto),
                            new XElement("xProd", item.NomeProduto),
                            new XElement("NCM", item.NCM),
                            new XElement("CFOP", item.CFOP),
                            new XElement("uCom", "UN"),
                            new XElement("qCom", item.Quantidade.ToString("F3")),
                            new XElement("vUnCom", item.PrecoUnitario.ToString("F2")),
                            new XElement("indRegra", "A"),
                            new XElement("vItem", item.PrecoTotal.ToString("F2"))
                        ),
                        new XElement("imposto",
                            new XElement("vItem12741", "0"),
                            new XElement("ICMS",
                                new XElement("ICMS00",
                                    new XElement("Orig", "0"),
                                    new XElement("CST", item.CST),
                                    new XElement("pICMS", "0"),
                                    new XElement("vICMS", "0")
                                )
                            ),
                            new XElement("PIS",
                                new XElement("CST", "01"),
                                new XElement("vBC", "0"),
                                new XElement("pPIS", "0"),
                                new XElement("vPIS", "0")
                            ),
                            new XElement("COFINS",
                                new XElement("CST", "01"),
                                new XElement("vBC", "0"),
                                new XElement("pCOFINS", "0"),
                                new XElement("vCOFINS", "0")
                            )
                        )
                    )),

                    // Totais
                    new XElement("total",
                        new XElement("vCFe", venda.Total.ToString("F2")),
                        new XElement("vDesc", venda.Desconto.ToString("F2")),
                        new XElement("vAcres", "0"),
                        new XElement("vAcresSub", "0"),
                        new XElement("vCFeLei12741", "0")
                    ),

                    // Pagamento
                    new XElement("pgto",
                        new XElement("MP",
                            new XElement("cMP", "01"), // Dinheiro
                            new XElement("vMP", venda.Total.ToString("F2"))
                        )
                    ),

                    // Informações adicionais
                    new XElement("infAdic",
                        new XElement("infCpl", $"Venda: {venda.NumeroVenda}")
                    )
                )
            )
        );

        return xml;
    }

    private async Task<ResultadoSAT> EnviarParaSATAsync(XDocument xml)
    {
        try
        {
            _logger.LogInformation("Enviando CFe para SAT");

            // Converter XML para string
            var xmlString = xml.ToString();

            // Comando para enviar CFe
            var comando = $"{{\"cmd\":\"enviar\",\"xml\":\"{xmlString}\"}}";
            var resposta = await EnviarComandoSATAsync(comando);

            // Processar resposta
            if (resposta.Contains("OK"))
            {
                return new ResultadoSAT
                {
                    Sucesso = true,
                    ChaveAcesso = ExtrairChaveAcesso(resposta),
                    NumeroCFe = ExtrairNumeroCFe(resposta),
                    Protocolo = ExtrairProtocolo(resposta)
                };
            }
            else
            {
                return new ResultadoSAT
                {
                    Sucesso = false,
                    MensagemErro = "Erro na comunicação com SAT"
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar CFe para SAT");
            return new ResultadoSAT
            {
                Sucesso = false,
                MensagemErro = ex.Message
            };
        }
    }

    private async Task<XDocument> GerarXMLCancelamentoSATAsync(Venda venda, Empresa empresa, string justificativa)
    {
        var xml = new XDocument(
            new XDeclaration("1.0", "UTF-8", null),
            new XElement("CFeCanc",
                new XAttribute("versao", "0.08"),
                new XAttribute("xmlns", "http://www.portalfiscal.inf.br/nfe"),
                
                new XElement("infCFeCanc",
                    new XAttribute("Id", $"CFe{venda.ChaveAcessoSAT}"),
                    new XAttribute("versaoDadosEnt", "0.08"),
                    
                    new XElement("ide",
                        new XElement("CNPJ", empresa.CNPJ.Replace(".", "").Replace("/", "").Replace("-", "")),
                        new XElement("dEmi", venda.DataVenda.ToString("yyyyMMdd")),
                        new XElement("hEmi", venda.DataVenda.ToString("HHmmss")),
                        new XElement("cNF", venda.NumeroVenda.ToString("D9")),
                        new XElement("cDV", "1"),
                        new XElement("mod", "59"),
                        new XElement("nserieSAT", empresa.NumeroSerieSAT),
                        new XElement("nCFe", venda.NumeroSAT),
                        new XElement("dEmi", venda.DataVenda.ToString("yyyyMMdd")),
                        new XElement("hEmi", venda.DataVenda.ToString("HHmmss")),
                        new XElement("vCFe", venda.Total.ToString("F2").Replace(",", ".")),
                        new XElement("tpAmb", "2"),
                        new XElement("CNPJSh", "16716114000172"),
                        new XElement("signACS", "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"),
                        new XElement("numeroCaixa", "001")
                    ),
                    
                    new XElement("dadosCanc",
                        new XElement("xJust", justificativa),
                        new XElement("CNPJ", empresa.CNPJ.Replace(".", "").Replace("/", "").Replace("-", "")),
                        new XElement("signAC", "SGR-SAT SISTEMA DE GESTAO E RETAGUARDA DO SAT"),
                        new XElement("numeroCaixa", "001")
                    )
                )
            )
        );

        return xml;
    }

    private async Task<ResultadoSAT> EnviarCancelamentoParaSATAsync(XDocument xml)
    {
        try
        {
            _logger.LogInformation("Enviando cancelamento para SAT");

            var xmlString = xml.ToString();
            var comando = $"{{\"cmd\":\"cancelar\",\"xml\":\"{xmlString}\"}}";
            var resposta = await EnviarComandoSATAsync(comando);

            if (resposta.Contains("OK"))
            {
                return new ResultadoSAT
                {
                    Sucesso = true,
                    Protocolo = ExtrairProtocolo(resposta)
                };
            }
            else
            {
                return new ResultadoSAT
                {
                    Sucesso = false,
                    MensagemErro = "Erro no cancelamento"
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar cancelamento para SAT");
            return new ResultadoSAT
            {
                Sucesso = false,
                MensagemErro = ex.Message
            };
        }
    }

    private async Task<string> EnviarComandoSATAsync(string comando)
    {
        try
        {
            _logger.LogInformation("Enviando comando para SAT: {Comando}", comando);

            // Simular comunicação com SAT
            // Em produção, implementar comunicação serial real
            await Task.Delay(1000);

            // Simular resposta de sucesso
            return "OK|35241234567890123456789012345678901234567890|123456789|123456789012345";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro na comunicação com SAT");
            return "ERRO|Falha na comunicação";
        }
    }

    private async Task<string> GerarDANFESATAsync(Venda venda, Empresa empresa)
    {
        // Implementar geração do DANFE SAT em HTML
        var html = $@"
            <html>
            <head>
                <title>DANFE SAT - CFe {venda.NumeroSAT}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                    .header {{ text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }}
                    .info {{ margin: 10px 0; }}
                    .items {{ margin: 20px 0; }}
                    .total {{ border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }}
                    .footer {{ margin-top: 20px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class='header'>
                    <h2>DANFE SAT</h2>
                    <p>CFe {venda.NumeroSAT}</p>
                    <p>Chave: {venda.ChaveAcessoSAT}</p>
                </div>
                
                <div class='info'>
                    <p><strong>Emitente:</strong> {empresa.RazaoSocial}</p>
                    <p><strong>CNPJ:</strong> {empresa.CNPJ}</p>
                    <p><strong>Data:</strong> {venda.DataVenda:dd/MM/yyyy HH:mm}</p>
                </div>
                
                <div class='items'>
                    <h3>Itens:</h3>
                    {venda.Itens.Select(item => $@"
                        <div>
                            <p>{item.NomeProduto} - Qtd: {item.Quantidade} x R$ {item.PrecoUnitario:F2} = R$ {item.PrecoTotal:F2}</p>
                        </div>
                    ").Join("")}
                </div>
                
                <div class='total'>
                    <p><strong>Total:</strong> R$ {venda.Total:F2}</p>
                </div>
                
                <div class='footer'>
                    <p>Documento emitido em ambiente de homologação</p>
                    <p>Protocolo: {venda.ProtocoloSAT}</p>
                </div>
            </body>
            </html>";

        return html;
    }

    private string ExtrairChaveAcesso(string resposta)
    {
        // Extrair chave de acesso da resposta do SAT
        var partes = resposta.Split('|');
        return partes.Length > 1 ? partes[1] : "";
    }

    private string ExtrairNumeroCFe(string resposta)
    {
        // Extrair número do CFe da resposta do SAT
        var partes = resposta.Split('|');
        return partes.Length > 2 ? partes[2] : "";
    }

    private string ExtrairProtocolo(string resposta)
    {
        // Extrair protocolo da resposta do SAT
        var partes = resposta.Split('|');
        return partes.Length > 3 ? partes[3] : "";
    }
}

public class ResultadoSAT
{
    public bool Sucesso { get; set; }
    public string? ChaveAcesso { get; set; }
    public string? NumeroCFe { get; set; }
    public string? Protocolo { get; set; }
    public string? MensagemErro { get; set; }
}

public enum StatusSAT
{
    Disponivel,
    Indisponivel,
    Erro,
    Emitido,
    Cancelado
} 