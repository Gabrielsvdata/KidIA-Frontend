// ===========================================
// KIDIA - CONFIGURAÇÃO BASE DA API
// ===========================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://kidia-backend.onrender.com';

// Chaves para localStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'kidia_access_token',
  REFRESH_TOKEN: 'kidia_refresh_token',
  USER: 'kidia_user',
  SELECTED_CHILD: 'kidia_selected_child',
};

/**
 * Obtém o token de acesso do localStorage
 */
const getAccessToken = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

/**
 * Obtém o refresh token do localStorage
 */
const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

/**
 * Salva os tokens no localStorage
 */
const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * Remove os tokens do localStorage
 */
const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_CHILD);
};

/**
 * Salva dados do usuário no localStorage
 */
const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Obtém dados do usuário do localStorage
 */
const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
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
  const child = localStorage.getItem(STORAGE_KEYS.SELECTED_CHILD);
  return child ? JSON.parse(child) : null;
};

/**
 * Função para renovar o token automaticamente
 */
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Sem refresh token disponível');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const data = await response.json();
  saveTokens(data.access_token, null);
  return data.access_token;
};

/**
 * Função principal para fazer requisições à API
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    authenticated = false,
    isFormData = false,
  } = options;

  const headers = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (authenticated) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Se o token expirou (401), tenta renovar
    if (response.status === 401 && authenticated) {
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);
          
          // Refaz a requisição com o novo token
          headers['Authorization'] = `Bearer ${newToken}`;
          config.headers = headers;
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } catch (refreshError) {
          isRefreshing = false;
          clearTokens();
          throw refreshError;
        }
      } else {
        // Espera o token ser renovado
        return new Promise((resolve) => {
          subscribeTokenRefresh(async (newToken) => {
            headers['Authorization'] = `Bearer ${newToken}`;
            config.headers = headers;
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
            resolve(retryResponse.json());
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
    console.error(`Erro na requisição ${endpoint}:`, error);
    throw error;
  }
};

// Função para verificar saúde da API
const verificarSaude = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Função para verificar se usuário está autenticado
const estaAutenticado = () => {
  const token = getAccessToken();
  return !!token;
};

// Função para obter dados do usuário atual
const obterUsuarioAtual = async () => {
  try {
    return await apiRequest('/auth/me');
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
};

export {
  API_BASE_URL,
  STORAGE_KEYS,
  apiRequest,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  saveUser,
  getUser,
  saveSelectedChild,
  getSelectedChild,
  verificarSaude,
  estaAutenticado,
  obterUsuarioAtual,
};
