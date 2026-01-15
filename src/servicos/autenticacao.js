// ===========================================
// KIDIA - SERVIÇO DE AUTENTICAÇÃO (COOKIES httpOnly)
// ===========================================

import {
  apiRequest,
  saveUser,
  getUser,
  clearLocalData,
  verificarAutenticacao,
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
   * Os tokens JWT são setados automaticamente via cookies httpOnly
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

    if (data.success && data.user) {
      // Salva apenas dados não-sensíveis do usuário
      saveUser(data.user);
    }

    return data;
  },

  /**
   * Fazer logout
   * Chama o backend para limpar os cookies httpOnly
   */
  async logout() {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        authenticated: true,
      });
    } catch (error) {
      // Mesmo se falhar no backend, limpa dados locais
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao fazer logout no servidor:', error);
      }
    } finally {
      // Sempre limpa dados locais
      clearLocalData();
    }
  },

  /**
   * Obter dados do usuário logado
   * Consulta o backend para validar a sessão
   */
  async obterUsuarioAtual() {
    const user = await verificarAutenticacao();
    
    if (user) {
      saveUser(user);
      return user;
    }
    
    // Se não conseguiu do backend, tenta cache local
    const cachedUser = getUser();
    if (cachedUser) {
      return cachedUser;
    }
    
    throw new Error('Usuário não autenticado');
  },

  /**
   * Verificar se está logado (consulta backend)
   */
  async estaLogado() {
    const user = await verificarAutenticacao();
    return !!user;
  },

  /**
   * Obter usuário do cache local (não valida sessão)
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
