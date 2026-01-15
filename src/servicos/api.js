// ===========================================
// KIDIA - CONFIGURAÇÃO BASE DA API (COOKIES httpOnly)
// ===========================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://kidia-backend.onrender.com';

// Chaves para localStorage (apenas dados não-sensíveis)
const STORAGE_KEYS = {
  USER: 'kidia_user',
  SELECTED_CHILD: 'kidia_selected_child',
};

// ===========================================
// GERENCIAMENTO DE CSRF
// ===========================================

/**
 * Obtém o token CSRF do cookie
 */
const getCsrfToken = () => {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
};

/**
 * Inicializa o token CSRF fazendo requisição ao backend
 */
const inicializarCsrf = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Falha ao obter token CSRF');
    }
    
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao inicializar CSRF:', error);
    }
    return false;
  }
};

// ===========================================
// GERENCIAMENTO DE USUÁRIO (localStorage seguro)
// ===========================================

/**
 * Salva dados do usuário no localStorage (dados não-sensíveis)
 */
const saveUser = (user) => {
  if (user) {
    // Remove dados sensíveis antes de salvar
    const userSeguro = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userSeguro));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

/**
 * Obtém dados do usuário do localStorage
 */
const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Salva a criança selecionada
 */
const saveSelectedChild = (child) => {
  if (child) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CHILD, JSON.stringify(child));
  } else {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CHILD);
  }
};

/**
 * Obtém a criança selecionada
 */
const getSelectedChild = () => {
  try {
    const child = localStorage.getItem(STORAGE_KEYS.SELECTED_CHILD);
    return child ? JSON.parse(child) : null;
  } catch {
    return null;
  }
};

/**
 * Limpa todos os dados do localStorage
 */
const clearLocalData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_CHILD);
};

// ===========================================
// CONTROLE DE REFRESH TOKEN
// ===========================================

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach(callback => callback());
  refreshSubscribers = [];
};

const onRefreshFailed = (error) => {
  refreshSubscribers.forEach(callback => callback(error));
  refreshSubscribers = [];
};

/**
 * Tenta renovar o token de acesso via cookies
 */
const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken() || '',
    },
  });

  if (!response.ok) {
    clearLocalData();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  return true;
};

// ===========================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÕES
// ===========================================

/**
 * Função principal para fazer requisições à API
 * Agora usa cookies httpOnly para autenticação
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    authenticated = false,
    isFormData = false,
    skipCsrf = false,
  } = options;

  const headers = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // Adiciona CSRF token para métodos que modificam dados
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase()) && !skipCsrf) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  const config = {
    method,
    headers,
    credentials: 'include', // IMPORTANTE: Sempre enviar cookies
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Se o token expirou (401) e é requisição autenticada, tenta renovar
    if (response.status === 401 && authenticated) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed();
          
          // Refaz a requisição original
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshFailed(refreshError);
          clearLocalData();
          throw refreshError;
        }
      } else {
        // Espera o refresh terminar e tenta novamente
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async (error) => {
            if (error) {
              reject(error);
              return;
            }
            try {
              const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
              const data = await retryResponse.json();
              if (!retryResponse.ok) {
                throw new Error(data.error || data.message || `Erro ${retryResponse.status}`);
              }
              resolve(data);
            } catch (retryError) {
              reject(retryError);
            }
          });
        });
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `Erro ${response.status}`);
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Erro na requisição ${endpoint}:`, error);
    }
    throw error;
  }
};

// ===========================================
// FUNÇÕES UTILITÁRIAS
// ===========================================

/**
 * Verifica saúde da API
 */
const verificarSaude = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Verifica se o usuário está autenticado consultando o backend
 */
const verificarAutenticacao = async () => {
  try {
    const data = await apiRequest('/auth/me', {
      method: 'GET',
      authenticated: true,
    });
    return data.success ? data.user : null;
  } catch (error) {
    return null;
  }
};

/**
 * Verifica se há dados de usuário no cache local
 * (Não significa que está autenticado, apenas que tem cache)
 */
const temCacheUsuario = () => {
  return !!getUser();
};

export {
  API_BASE_URL,
  STORAGE_KEYS,
  apiRequest,
  inicializarCsrf,
  getCsrfToken,
  saveUser,
  getUser,
  saveSelectedChild,
  getSelectedChild,
  clearLocalData,
  verificarSaude,
  verificarAutenticacao,
  temCacheUsuario,
};
