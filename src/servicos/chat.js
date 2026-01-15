// ===========================================
// KIDIA - SERVIÇO DE CHAT
// ===========================================

import { apiRequest } from './api';
import criancasService from './criancas';

const chatService = {
  /**
   * Verificar saúde da API
   */
  async verificarConexao() {
    try {
      const data = await apiRequest('/health', { method: 'GET' });
      return data.status === 'healthy' || data.success;
    } catch (error) {
      return false;
    }
  },

  /**
   * Obter sugestões de perguntas
   */
  async obterSugestoes() {
    try {
      const data = await apiRequest('/chat/suggestions', { method: 'GET' });
      return data.suggestions || [];
    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      // Retorna sugestões padrão em caso de erro
      return [
        { emoji: '📖', text: 'Conta uma história!' },
        { emoji: '🎮', text: 'Vamos brincar!' },
        { emoji: '😄', text: 'Me conta uma piada!' },
        { emoji: '🤔', text: 'O que você sabe fazer?' },
      ];
    }
  },

  /**
   * Enviar mensagem rápida (sem autenticação)
   */
  async enviarMensagemRapida(mensagem) {
    if (!mensagem || !mensagem.trim()) {
      throw new Error('Mensagem não pode estar vazia');
    }

    const data = await apiRequest('/chat/quick-message', {
      method: 'POST',
      body: { message: mensagem.trim() },
    });

    return {
      resposta: data.response,
      filtrado: data.filtered,
    };
  },

  /**
   * Enviar mensagem autenticada
   */
  async enviarMensagem(mensagem, historico = []) {
    if (!mensagem || !mensagem.trim()) {
      throw new Error('Mensagem não pode estar vazia');
    }

    const criancaSelecionada = criancasService.obterCriancaSelecionada();

    // Formata o histórico para o formato esperado pela API
    const historicoFormatado = historico.map(msg => ({
      role: msg.remetente === 'bot' ? 'assistant' : 'user',
      content: msg.texto,
    }));

    const body = {
      message: mensagem.trim(),
      conversation_history: historicoFormatado,
    };

    // Adiciona child_id se houver criança selecionada
    if (criancaSelecionada?.id) {
      body.child_id = criancaSelecionada.id;
    }

    const data = await apiRequest('/chat/message', {
      method: 'POST',
      authenticated: true,
      body,
    });

    return {
      resposta: data.response,
      filtrado: data.filtered,
    };
  },

  /**
   * Enviar mensagem (tenta autenticada, fallback para rápida)
   */
  async enviar(mensagem, historico = [], estaAutenticado = false) {
    try {
      if (estaAutenticado) {
        return await this.enviarMensagem(mensagem, historico);
      } else {
        return await this.enviarMensagemRapida(mensagem);
      }
    } catch (error) {
      // Se falhar autenticada, tenta rápida como fallback
      if (estaAutenticado) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Falha na mensagem autenticada, tentando modo rápido...');
        }
        try {
          return await this.enviarMensagemRapida(mensagem);
        } catch (fallbackError) {
          throw error; // Retorna o erro original
        }
      }
      throw error;
    }
  },
};

export default chatService;
