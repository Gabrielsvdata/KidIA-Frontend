// ===========================================
// KIDIA - UTILITÁRIOS DE SEGURANÇA
// ===========================================

/**
 * Sanitiza texto de entrada removendo caracteres potencialmente perigosos
 * Previne XSS básico no frontend (backend deve ter validação mais robusta)
 */
export const sanitizarTexto = (texto) => {
  if (!texto || typeof texto !== 'string') return '';
  
  return texto
    .replace(/[<>]/g, '') // Remove < e > para prevenir HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers como onclick=
    .trim();
};

/**
 * Sanitiza entrada para exibição segura (escapa HTML)
 */
export const escaparHTML = (texto) => {
  if (!texto || typeof texto !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return texto.replace(/[&<>"']/g, char => map[char]);
};

/**
 * Valida se é um email válido
 */
export const validarEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.toLowerCase().trim());
};

/**
 * Remove dados sensíveis antes de logar (para debug seguro)
 */
export const logSeguro = (mensagem, dados = {}) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  // Lista de campos sensíveis para ocultar
  const camposSensiveis = ['password', 'senha', 'token', 'access_token', 'refresh_token', 'secret'];
  
  const dadosSeguros = { ...dados };
  
  Object.keys(dadosSeguros).forEach(key => {
    if (camposSensiveis.some(campo => key.toLowerCase().includes(campo))) {
      dadosSeguros[key] = '[OCULTO]';
    }
  });
  
  console.log(`[KIDIA Debug] ${mensagem}`, dadosSeguros);
};

/**
 * Verifica se o ambiente é de produção
 */
export const isProducao = () => process.env.NODE_ENV === 'production';

/**
 * Verifica se o ambiente é de desenvolvimento
 */
export const isDesenvolvimento = () => process.env.NODE_ENV === 'development';

/**
 * Gera um ID único para uso em forms (previne ataques de replay)
 */
export const gerarIdUnico = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Limita tamanho de texto (previne ataques de payload grande)
 */
export const limitarTamanho = (texto, maxLength = 1000) => {
  if (!texto || typeof texto !== 'string') return '';
  return texto.slice(0, maxLength);
};

const segurancaUtils = {
  sanitizarTexto,
  escaparHTML,
  validarEmail,
  logSeguro,
  isProducao,
  isDesenvolvimento,
  gerarIdUnico,
  limitarTamanho,
};

export default segurancaUtils;
