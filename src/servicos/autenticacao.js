// ===========================================
// KIDIA - SERVIÇO DE AUTENTICAÇÃO
// ===========================================

import {
  apiRequest,
  saveTokens,
  clearTokens,
  saveUser,
  getUser,
} from './api';

/**
 * Validações de senha
 */
const validarSenha = (senha) => {
  const erros = [];
  
  if (senha.length < 8) {
    erros.push('A senha deve ter no mínimo 8 caracteres');
  }
  if (!/[A-Z]/.test(senha)) {
    erros.push('A senha deve ter pelo menos 1 letra maiúscula');
  }
  if (!/[a-z]/.test(senha)) {
    erros.push('A senha deve ter pelo menos 1 letra minúscula');
  }
  if (!/[0-9]/.test(senha)) {
    erros.push('A senha deve ter pelo menos 1 número');
  }
  
  return erros;
};

/**
 * Validação de email
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const autenticacaoService = {
  /**
   * Registrar novo responsável
   */
  async registrar(nome, email, senha) {
    // Validações
    if (!nome || nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!validarEmail(email)) {
      throw new Error('Email inválido');
    }
    
    const errosSenha = validarSenha(senha);
    if (errosSenha.length > 0) {
      throw new Error(errosSenha.join('. '));
    }

    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        name: nome.trim(),
        email: email.toLowerCase().trim(),
        password: senha,
      },
    });

    return data;
  },

  /**
   * Fazer login
   */
  async login(email, senha) {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }

    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: {
        email: email.toLowerCase().trim(),
        password: senha,
      },
    });

    if (data.success) {
      saveTokens(data.access_token, data.refresh_token);
      saveUser(data.user);
    }

    return data;
  },

  /**
   * Fazer logout
   */
  logout() {
    clearTokens();
  },

  /**
   * Obter dados do usuário logado
   */
  async obterUsuarioAtual() {
    try {
      const data = await apiRequest('/auth/me', {
        method: 'GET',
        authenticated: true,
      });
      
      if (data.success) {
        saveUser(data.user);
      }
      
      return data.user;
    } catch (error) {
      // Se falhar, tenta usar dados em cache
      const cachedUser = getUser();
      if (cachedUser) {
        return cachedUser;
      }
      throw error;
    }
  },

  /**
   * Verificar se está logado
   */
  estaLogado() {
    return !!getUser();
  },

  /**
   * Obter usuário do cache
   */
  obterUsuarioCache() {
    return getUser();
  },

  /**
   * Validar senha (exporta para uso em formulários)
   */
  validarSenha,
  validarEmail,
};

export default autenticacaoService;
