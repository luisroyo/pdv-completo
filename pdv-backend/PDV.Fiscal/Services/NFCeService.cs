using System.Security.Cryptography.X509Certificates;
using System.Xml;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using PDV.Core.Entities;

namespace PDV.Fiscal.Services;

public class NFCeService
{
    private readonly ILogger<NFCeService> _logger;
    private readonly Dictionary<string, string> _urlsSEFAZ;

    public NFCeService(ILogger<NFCeService> logger)
    {
        _logger = logger;
        _urlsSEFAZ = new Dictionary<string, string>
        {
            {"SP", "https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx"},
            {"RJ", "https://nfe.fazenda.rj.gov.br/ws/nfeautorizacao4.asmx"},
            {"MG", "https://nfe.fazenda.mg.gov.br/nfe2/services/NfeAutorizacao4"},
            {"RS", "https://nfe.sefaz.rs.gov.br/ws/nfeautorizacao4.asmx"},
            {"PR", "https://nfe.fazenda.pr.gov.br/nfe/NFeAutorizacao4"},
            {"SC", "https://nfe.svrs.rs.gov.br/ws/nfeautorizacao4.asmx"},
            {"GO", "https://nfe.fazenda.go.gov.br/nfe2/services/NfeAutorizacao4"},
            {"MT", "https://nfe.sefaz.mt.gov.br/nfews/services/NfeAutorizacao4"},
            {"MS", "https://nfe.fazenda.ms.gov.br/producao/services2/NfeAutorizacao4"},
            {"TO", "https://nfe.sefaz.to.gov.br/nfe/services/NfeAutorizacao4"},
            {"BA", "https://nfe.sefaz.ba.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx"},
            {"CE", "https://nfe.sefaz.ce.gov.br/nfe2/services/NfeAutorizacao4"},
            {"PE", "https://nfe.sefaz.pe.gov.br/nfe-service/services/NfeAutorizacao4"},
            {"AL", "https://nfe.sefaz.al.gov.br/NFE/ws/services/NfeAutorizacao4"},
            {"PB", "https://nfe.sefaz.pb.gov.br/nfe4/services/NfeAutorizacao4"},
            {"RN", "https://nfe.set.rn.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx"},
            {"PI", "https://nfe.sefaz.pi.gov.br/nfe/services/NfeAutorizacao4"},
            {"MA", "https://nfe.sefaz.ma.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx"},
            {"PA", "https://nfe.sefaz.pa.gov.br/nfe/ASP/AAE_ROOT/NFE/SAT-WEB-NFE-COM_2.asp"},
            {"AP", "https://nfe.sefaz.ap.gov.br/nfe/services/NfeAutorizacao4"},
            {"RO", "https://nfe.sefaz.ro.gov.br/nfe/services/NfeAutorizacao4"},
            {"AC", "https://nfe.sefaz.ac.gov.br/nfe/services/NfeAutorizacao4"},
            {"AM", "https://nfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4"},
            {"RR", "https://nfe.sefaz.rr.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx"},
            {"DF", "https://dec.fazenda.df.gov.br/nfe2/services/NfeAutorizacao4"},
            {"ES", "https://nfe.fazenda.es.gov.br/ws/nfeautorizacao4.asmx"},
            {"SE", "https://nfe.sefaz.se.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx"}
        };
    }

    public async Task<ResultadoNFCe> EmitirNFCeAsync(Venda venda, Empresa empresa)
    {
        try
        {
            _logger.LogInformation("Iniciando emissão de NFC-e para venda {NumeroVenda}", venda.NumeroVenda);

            // Validar dados da empresa
            if (string.IsNullOrEmpty(empresa.CNPJ) || string.IsNullOrEmpty(empresa.NumeroSerieNFCe))
            {
                throw new InvalidOperationException("Dados fiscais da empresa incompletos");
            }

            // Gerar XML da NFC-e
            var xmlNFCe = await GerarXMLNFCeAsync(venda, empresa);

            // Assinar XML
            var xmlAssinado = await AssinarXMLAsync(xmlNFCe, empresa);

            // Enviar para SEFAZ
            var resultado = await EnviarParaSEFAZAsync(xmlAssinado, empresa.UF);

            if (resultado.Sucesso)
            {
                venda.StatusNFCe = StatusNFCe.Emitida;
                venda.NumeroNFCe = resultado.NumeroProtocolo;
                venda.ChaveAcessoNFCe = resultado.ChaveAcesso;
                venda.ProtocoloNFCe = resultado.NumeroProtocolo;
                venda.DataEmissaoNFCe = DateTime.Now;
                venda.XMLNFCe = xmlAssinado.ToString();
                venda.DANFENFCe = await GerarDANFEAsync(venda, empresa);

                _logger.LogInformation("NFC-e emitida com sucesso: {ChaveAcesso}", resultado.ChaveAcesso);
            }
            else
            {
                venda.StatusNFCe = StatusNFCe.Erro;
                _logger.LogError("Erro na emissão da NFC-e: {Mensagem}", resultado.MensagemErro);
            }

            return resultado;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao emitir NFC-e");
            venda.StatusNFCe = StatusNFCe.Erro;
            throw;
        }
    }

    public async Task<ResultadoNFCe> CancelarNFCeAsync(Venda venda, Empresa empresa, string justificativa)
    {
        try
        {
            _logger.LogInformation("Iniciando cancelamento de NFC-e: {ChaveAcesso}", venda.ChaveAcessoNFCe);

            if (string.IsNullOrEmpty(venda.ChaveAcessoNFCe))
                throw new InvalidOperationException("NFC-e não possui chave de acesso");

            // Gerar XML de cancelamento
            var xmlCancelamento = await GerarXMLCancelamentoAsync(venda, empresa, justificativa);

            // Assinar XML
            var xmlAssinado = await AssinarXMLAsync(xmlCancelamento, empresa);

            // Enviar cancelamento para SEFAZ
            var resultado = await EnviarCancelamentoParaSEFAZAsync(xmlAssinado, empresa.UF);

            if (resultado.Sucesso)
            {
                venda.StatusNFCe = StatusNFCe.Cancelada;
                _logger.LogInformation("NFC-e cancelada com sucesso");
            }
            else
            {
                _logger.LogError("Erro no cancelamento da NFC-e: {Mensagem}", resultado.MensagemErro);
            }

            return resultado;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar NFC-e");
            throw;
        }
    }

    private async Task<XDocument> GerarXMLNFCeAsync(Venda venda, Empresa empresa)
    {
        var xml = new XDocument(
            new XDeclaration("1.0", "UTF-8", null),
            new XElement("nfeProc",
                new XAttribute("versao", "4.00"),
                new XAttribute("xmlns", "http://www.portalfiscal.inf.br/nfe"),
                new XElement("NFe",
                    new XElement("infNFe",
                        new XAttribute("Id", $"NFe{venda.ChaveAcessoNFCe}"),
                        new XAttribute("versao", "4.00"),
                        
                        // Identificação da NF-e
                        new XElement("ide",
                            new XElement("cUF", ObterCodigoUF(empresa.UF)),
                            new XElement("cNF", venda.NumeroVenda),
                            new XElement("natOp", "VENDA"),
                            new XElement("mod", "65"), // NFC-e
                            new XElement("serie", empresa.NumeroSerieNFCe),
                            new XElement("nNF", venda.NumeroVenda),
                            new XElement("dhEmi", venda.DataVenda.ToString("yyyy-MM-ddTHH:mm:sszzz")),
                            new XElement("tpNF", "1"), // Saída
                            new XElement("idDest", "1"), // Interna
                            new XElement("cMunFG", ObterCodigoMunicipio(empresa.Cidade, empresa.UF)),
                            new XElement("tpImp", "4"), // NFC-e
                            new XElement("tpEmis", "1"), // Normal
                            new XElement("cDV", venda.ChaveAcessoNFCe?.Substring(43, 1) ?? "0"),
                            new XElement("tpAmb", "2"), // Homologação
                            new XElement("finNFe", "4"), // NFC-e
                            new XElement("indFinal", "1"), // Consumidor final
                            new XElement("indPres", "1"), // Operação presencial
                            new XElement("procEmi", "0"), // Aplicativo do contribuinte
                            new XElement("verProc", "PDV-1.0")
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
                            new XElement("CNAE", "4751201") // CNAE para comércio varejista
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
                                new XElement("vProd", item.PrecoTotal.ToString("F2")),
                                new XElement("indTot", "1")
                            ),
                            new XElement("imposto",
                                new XElement("ICMS",
                                    new XElement("ICMS00",
                                        new XElement("orig", "0"),
                                        new XElement("CST", item.CST),
                                        new XElement("modBC", "0"),
                                        new XElement("vBC", "0"),
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
                            new XElement("ICMSTot",
                                new XElement("vBC", "0"),
                                new XElement("vICMS", "0"),
                                new XElement("vProd", venda.SubTotal.ToString("F2")),
                                new XElement("vFrete", "0"),
                                new XElement("vSeg", "0"),
                                new XElement("vDesc", venda.Desconto.ToString("F2")),
                                new XElement("vII", "0"),
                                new XElement("vIPI", "0"),
                                new XElement("vPIS", "0"),
                                new XElement("vCOFINS", "0"),
                                new XElement("vOutro", "0"),
                                new XElement("vNF", venda.Total.ToString("F2"))
                            )
                        ),

                        // Transporte
                        new XElement("transp",
                            new XElement("modFrete", "9") // Sem frete
                        ),

                        // Pagamento
                        new XElement("pag",
                            new XElement("detPag",
                                new XElement("indPag", "0"), // Pagamento à vista
                                new XElement("tPag", "01"), // Dinheiro
                                new XElement("vPag", venda.Total.ToString("F2"))
                            )
                        ),

                        // Informações adicionais
                        new XElement("infAdic",
                            new XElement("infAdFisco", "NFC-e emitida em ambiente de homologação"),
                            new XElement("infCpl", $"Venda: {venda.NumeroVenda}")
                        )
                    )
                )
            )
        );

        return xml;
    }

    private async Task<XDocument> AssinarXMLAsync(XDocument xml, Empresa empresa)
    {
        // Implementar assinatura digital com certificado
        // Esta é uma implementação simplificada
        _logger.LogInformation("Assinando XML da NFC-e");
        
        // Em produção, usar certificado digital real
        return xml;
    }

    private async Task<ResultadoNFCe> EnviarParaSEFAZAsync(XDocument xml, string uf)
    {
        try
        {
            if (!_urlsSEFAZ.ContainsKey(uf))
                throw new InvalidOperationException($"UF {uf} não suportada");

            var url = _urlsSEFAZ[uf];
            _logger.LogInformation("Enviando NFC-e para SEFAZ {UF}: {URL}", uf, url);

            // Implementar envio real para SEFAZ
            // Esta é uma implementação simulada
            await Task.Delay(2000); // Simular tempo de resposta

            // Simular resposta de sucesso
            return new ResultadoNFCe
            {
                Sucesso = true,
                ChaveAcesso = "35241234567890123456789012345678901234567890",
                NumeroProtocolo = "123456789012345",
                MensagemErro = null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar NFC-e para SEFAZ");
            return new ResultadoNFCe
            {
                Sucesso = false,
                MensagemErro = ex.Message
            };
        }
    }

    private async Task<XDocument> GerarXMLCancelamentoAsync(Venda venda, Empresa empresa, string justificativa)
    {
        // Implementar geração do XML de cancelamento
        return new XDocument();
    }

    private async Task<ResultadoNFCe> EnviarCancelamentoParaSEFAZAsync(XDocument xml, string uf)
    {
        // Implementar envio de cancelamento
        return new ResultadoNFCe { Sucesso = true };
    }

    private async Task<string> GerarDANFEAsync(Venda venda, Empresa empresa)
    {
        // Implementar geração do DANFE em HTML
        return "<html><body>DANFE NFC-e</body></html>";
    }

    private string ObterCodigoUF(string uf)
    {
        var codigos = new Dictionary<string, string>
        {
            {"AC", "12"}, {"AL", "27"}, {"AP", "16"}, {"AM", "13"}, {"BA", "29"},
            {"CE", "23"}, {"DF", "53"}, {"ES", "32"}, {"GO", "52"}, {"MA", "21"},
            {"MT", "51"}, {"MS", "50"}, {"MG", "31"}, {"PA", "15"}, {"PB", "25"},
            {"PR", "41"}, {"PE", "26"}, {"PI", "22"}, {"RJ", "33"}, {"RN", "24"},
            {"RS", "43"}, {"RO", "11"}, {"RR", "14"}, {"SC", "42"}, {"SP", "35"},
            {"SE", "28"}, {"TO", "17"}
        };

        return codigos.GetValueOrDefault(uf, "35");
    }

    private string ObterCodigoMunicipio(string cidade, string uf)
    {
        // Implementar busca do código do município
        return "3550308"; // São Paulo como exemplo
    }
}

public class ResultadoNFCe
{
    public bool Sucesso { get; set; }
    public string? ChaveAcesso { get; set; }
    public string? NumeroProtocolo { get; set; }
    public string? MensagemErro { get; set; }
} 