using Microsoft.Web.WebView2.Core;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Windows;
using System.Windows.Threading;

namespace PDV.Desktop;

public partial class MainWindow : Window
{
    private readonly IHost _host;
    private readonly ILogger<MainWindow> _logger;
    private readonly DispatcherTimer _timer;

    public MainWindow(IHost host, ILogger<MainWindow> logger)
    {
        InitializeComponent();
        _host = host;
        _logger = logger;

        // Configurar timer para atualizar data/hora
        _timer = new DispatcherTimer
        {
            Interval = TimeSpan.FromSeconds(1)
        };
        _timer.Tick += Timer_Tick;
        _timer.Start();

        // Inicializar WebView2
        InitializeWebViewAsync();
    }

    private async void InitializeWebViewAsync()
    {
        try
        {
            txtStatus.Text = "Inicializando WebView2...";
            
            // Inicializar WebView2
            await webView.EnsureCoreWebView2Async();

            // Configurar WebView2
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.CoreWebView2.Settings.AreDevToolsEnabled = false;

            // Navegar para a API local
            var apiUrl = "http://localhost:5000";
            webView.CoreWebView2.Navigate(apiUrl);

            txtStatus.Text = "Conectando ao servidor...";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao inicializar WebView2");
            MessageBox.Show($"Erro ao inicializar o sistema: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void WebView_NavigationStarting(object sender, CoreWebView2NavigationStartingEventArgs e)
    {
        loadingOverlay.Visibility = Visibility.Visible;
        txtStatus.Text = "Carregando...";
    }

    private void WebView_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        loadingOverlay.Visibility = Visibility.Collapsed;
        
        if (e.IsSuccess)
        {
            txtStatus.Text = "Sistema pronto";
        }
        else
        {
            txtStatus.Text = "Erro ao carregar";
            _logger.LogError("Erro na navegação: {WebViewStatus}", e.WebViewStatus);
        }
    }

    private void Timer_Tick(object? sender, EventArgs e)
    {
        txtDataHora.Text = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
    }

    protected override void OnClosed(EventArgs e)
    {
        _timer.Stop();
        _host.StopAsync();
        base.OnClosed(e);
    }
} 