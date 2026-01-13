// ===========================================
// KIDIA - SERVIÇO DE CRIANÇAS
// ===========================================

import { apiRequest, saveSelectedChild, getSelectedChild } from './api';

/**
 * Avatares disponíveis
 */
const AVATARES_DISPONIVEIS = [
  { id: 'avatar1', emoji: '🦁', nome: 'Leão' },
  { id: 'avatar2', emoji: '🐰', nome: 'Coelho' },
  { id: 'avatar3', emoji: '🦊', nome: 'Raposa' },
  { id: 'avatar4', emoji: '🐻', nome: 'Urso' },
  { id: 'avatar5', emoji: '🐼', nome: 'Panda' },
  { id: 'avatar6', emoji: '🦄', nome: 'Unicórnio' },
  { id: 'avatar7', emoji: '🐸', nome: 'Sapo' },
  { id: 'avatar8', emoji: '🦋', nome: 'Borboleta' },
  { id: 'avatar9', emoji: '🐱', nome: 'Gato' },
  { id: 'avatar10', emoji: '🐶', nome: 'Cachorro' },
  { id: 'avatar11', emoji: '🦖', nome: 'Dinossauro' },
  { id: 'avatar12', emoji: '🐙', nome: 'Polvo' },
];

const criancasService = {
  /**
   * Listar todas as crianças do responsável
   */
  async listarCriancas() {
    const data = await apiRequest('/auth/children', {
      method: 'GET',
      authenticated: true,
    });

    return data.children || [];
  },

  /**
   * Obter perfil de uma criança específica
   */
  async obterCrianca(childId) {
    const data = await apiRequest(`/auth/children/${childId}`, {
      method: 'GET',
      authenticated: true,
    });

    return data.profile || data.child;
  },

  /**
   * Adicionar nova criança
   */
  async adicionarCrianca(nome, idade, avatar) {
    // Validações
    if (!nome || nome.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (idade < 4 || idade > 12) {
      throw new Error('A idade deve ser entre 4 e 12 anos');
    }

    const data = await apiRequest('/auth/children', {
      method: 'POST',
      authenticated: true,
      body: {
        name: nome.trim(),
        age: parseInt(idade),
        avatar: avatar || 'avatar1',
      },
    });

    return data.profile || data;
  },

  /**
   * Selecionar criança para usar o chat
   */
  selecionarCrianca(crianca) {
    saveSelectedChild(crianca);
  },

  /**
   * Obter criança selecionada
   */
  obterCriancaSelecionada() {
    return getSelectedChild();
  },

  /**
   * Limpar seleção de criança
   */
  limparSelecao() {
    saveSelectedChild(null);
  },

  /**
   * Obter lista de avatares disponíveis
   */
  obterAvatares() {
    return AVATARES_DISPONIVEIS;
  },

  /**
   * Obter emoji do avatar pelo ID
   */
  obterEmojiAvatar(avatarId) {
    const avatar = AVATARES_DISPONIVEIS.find(a => a.id === avatarId);
    return avatar ? avatar.emoji : '😊';
  },
};

export default criancasService;
