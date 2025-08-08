/**
 * Gerenciador de Temas Dinâmicos
 * Permite aplicar temas personalizados baseados em arquivos JSON
 * sem modificar o código core do sistema
 */

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.defaultTheme = {
      name: 'PDV Padrão',
      logo: '/logos/pdv-default.png',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      textColor: '#1e293b',
      textSecondaryColor: '#64748b',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      fontFamily: 'Inter',
      iconPack: 'default'
    };
  }

  /**
   * Carrega um tema a partir de um arquivo JSON
   * @param {string} themePath - Caminho para o arquivo JSON do tema
   */
  async loadTheme(themePath) {
    try {
      const response = await fetch(themePath);
      if (!response.ok) {
        throw new Error(`Erro ao carregar tema: ${response.status}`);
      }
      
      const theme = await response.json();
      this.applyTheme(theme);
      this.currentTheme = theme;
      
      // Salva o tema no localStorage
      localStorage.setItem('pdv-theme', JSON.stringify(theme));
      
      console.log(`Tema "${theme.name}" carregado com sucesso`);
      return theme;
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      this.applyTheme(this.defaultTheme);
      return this.defaultTheme;
    }
  }

  /**
   * Aplica um tema às variáveis CSS
   * @param {Object} theme - Objeto com configurações do tema
   */
  applyTheme(theme) {
    const root = document.documentElement;
    
    // Aplica cores
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-surface', theme.surfaceColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-text-secondary', theme.textSecondaryColor);
    root.style.setProperty('--color-success', theme.successColor);
    root.style.setProperty('--color-warning', theme.warningColor);
    root.style.setProperty('--color-error', theme.errorColor);
    
    // Aplica fonte
    root.style.setProperty('--font-family', theme.fontFamily);
    
    // Atualiza o logo se especificado
    if (theme.logo) {
      this.updateLogo(theme.logo);
    }
    
    // Aplica pacote de ícones se especificado
    if (theme.iconPack) {
      this.updateIconPack(theme.iconPack);
    }
    
    // Dispara evento de mudança de tema
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  }

  /**
   * Atualiza o logo da aplicação
   * @param {string} logoPath - Caminho para o logo
   */
  updateLogo(logoPath) {
    const logoElements = document.querySelectorAll('[data-theme-logo]');
    logoElements.forEach(element => {
      if (element.tagName === 'IMG') {
        element.src = logoPath;
      } else {
        element.style.backgroundImage = `url(${logoPath})`;
      }
    });
  }

  /**
   * Atualiza o pacote de ícones
   * @param {string} iconPack - Nome do pacote de ícones
   */
  updateIconPack(iconPack) {
    // Remove classes de ícones anteriores
    document.body.classList.remove('icon-pack-default', 'icon-pack-food', 'icon-pack-retail', 'icon-pack-pharmacy');
    
    // Adiciona nova classe de ícones
    document.body.classList.add(`icon-pack-${iconPack}`);
  }

  /**
   * Carrega o tema salvo no localStorage
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem('pdv-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        this.applyTheme(theme);
        this.currentTheme = theme;
        return theme;
      } catch (error) {
        console.error('Erro ao carregar tema salvo:', error);
        this.applyTheme(this.defaultTheme);
        return this.defaultTheme;
      }
    }
    
    this.applyTheme(this.defaultTheme);
    return this.defaultTheme;
  }

  /**
   * Obtém o tema atual
   * @returns {Object} Tema atual
   */
  getCurrentTheme() {
    return this.currentTheme || this.defaultTheme;
  }

  /**
   * Reseta para o tema padrão
   */
  resetToDefault() {
    this.applyTheme(this.defaultTheme);
    this.currentTheme = this.defaultTheme;
    localStorage.removeItem('pdv-theme');
  }

  /**
   * Alterna entre tema claro e escuro
   */
  toggleDarkMode() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pdv-dark-mode', 'false');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pdv-dark-mode', 'true');
    }
  }

  /**
   * Inicializa o gerenciador de temas
   */
  init() {
    // Carrega tema salvo ou padrão
    this.loadSavedTheme();
    
    // Carrega preferência de modo escuro
    const darkMode = localStorage.getItem('pdv-dark-mode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Detecta mudanças de tema do sistema
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (localStorage.getItem('pdv-dark-mode') === null) {
          if (e.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      });
    }
  }
}

// Cria instância global do gerenciador de temas
const themeManager = new ThemeManager();

// Inicializa automaticamente
themeManager.init();

// Exporta para uso em outros módulos
export default themeManager; 