/**
 * Gerenciador PWA (Progressive Web App)
 * Configura funcionalidades offline e cache da aplicação
 */

import { registerSW } from 'virtual:pwa-register'

class PWAManager {
  constructor() {
    this.updateSW = null;
    this.needRefresh = false;
    this.offlineReady = false;
  }

  /**
   * Inicializa o gerenciador PWA
   */
  init() {
    // Registra o service worker
    this.updateSW = registerSW({
      onNeedRefresh() {
        this.needRefresh = true;
        this.showUpdateNotification();
      },
      onOfflineReady() {
        this.offlineReady = true;
        this.showOfflineNotification();
      },
      onRegistered(swRegistration) {
        console.log('Service Worker registrado:', swRegistration);
      },
      onRegisterError(error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    });

    // Configura listeners para eventos online/offline
    this.setupNetworkListeners();
    
    // Configura cache de dados offline
    this.setupOfflineCache();
  }

  /**
   * Configura listeners para mudanças de conectividade
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.handleOffline();
    });
  }

  /**
   * Configura cache offline para dados importantes
   */
  setupOfflineCache() {
    // Cache de produtos
    if ('caches' in window) {
      caches.open('pdv-data').then(cache => {
        console.log('Cache de dados PDV configurado');
      });
    }
  }

  /**
   * Manipula quando a conexão volta
   */
  handleOnline() {
    console.log('Conexão restaurada');
    this.showNotification('Conexão restaurada', 'success');
    
    // Sincroniza dados offline
    this.syncOfflineData();
  }

  /**
   * Manipula quando a conexão cai
   */
  handleOffline() {
    console.log('Conexão perdida - Modo offline ativado');
    this.showNotification('Modo offline ativado', 'warning');
  }

  /**
   * Sincroniza dados salvos offline
   */
  async syncOfflineData() {
    try {
      // Aqui você implementaria a sincronização com o backend
      // Por exemplo, enviar vendas salvas offline
      console.log('Sincronizando dados offline...');
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }

  /**
   * Mostra notificação de atualização disponível
   */
  showUpdateNotification() {
    if (this.needRefresh) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>Nova versão disponível</span>
          <button onclick="window.location.reload()" class="bg-white text-primary px-2 py-1 rounded text-sm">
            Atualizar
          </button>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Remove após 10 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 10000);
    }
  }

  /**
   * Mostra notificação de modo offline
   */
  showOfflineNotification() {
    if (this.offlineReady) {
      this.showNotification('Aplicação disponível offline', 'success');
    }
  }

  /**
   * Mostra notificação genérica
   * @param {string} message - Mensagem da notificação
   * @param {string} type - Tipo da notificação (success, warning, error)
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-slide-up`;
    
    // Cores baseadas no tipo
    const colors = {
      success: 'bg-success text-white',
      warning: 'bg-warning text-white',
      error: 'bg-error text-white',
      info: 'bg-primary text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  /**
   * Força atualização da aplicação
   */
  updateApp() {
    if (this.updateSW) {
      this.updateSW();
    }
  }

  /**
   * Verifica se a aplicação está em modo offline
   * @returns {boolean}
   */
  isOffline() {
    return !navigator.onLine;
  }

  /**
   * Verifica se há atualização disponível
   * @returns {boolean}
   */
  hasUpdate() {
    return this.needRefresh;
  }

  /**
   * Verifica se a aplicação está pronta para offline
   * @returns {boolean}
   */
  isOfflineReady() {
    return this.offlineReady;
  }
}

// Cria instância global do gerenciador PWA
const pwaManager = new PWAManager();

// Inicializa automaticamente
pwaManager.init();

// Exporta para uso em outros módulos
export default pwaManager; 