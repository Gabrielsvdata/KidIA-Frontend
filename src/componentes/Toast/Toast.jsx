// ===========================================
// KIDIA - COMPONENTE DE TOAST/NOTIFICAÇÃO
// ===========================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import './Toast.scss';

// Contexto para o Toast
const ToastContext = createContext(null);

// Hook para usar o toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

// Provider do Toast
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removerToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const adicionarToast = useCallback((mensagem, tipo = 'info', duracao = 4000) => {
    const id = Date.now() + Math.random();
    
    setToasts(prev => [...prev, { id, mensagem, tipo }]);

    // Remove automaticamente após a duração
    if (duracao > 0) {
      setTimeout(() => {
        removerToast(id);
      }, duracao);
    }

    return id;
  }, [removerToast]);

  // Funções de conveniência
  const sucesso = useCallback((mensagem, duracao) => {
    return adicionarToast(mensagem, 'sucesso', duracao);
  }, [adicionarToast]);

  const erro = useCallback((mensagem, duracao) => {
    return adicionarToast(mensagem, 'erro', duracao);
  }, [adicionarToast]);

  const info = useCallback((mensagem, duracao) => {
    return adicionarToast(mensagem, 'info', duracao);
  }, [adicionarToast]);

  const aviso = useCallback((mensagem, duracao) => {
    return adicionarToast(mensagem, 'aviso', duracao);
  }, [adicionarToast]);

  return (
    <ToastContext.Provider value={{ adicionarToast, removerToast, sucesso, erro, info, aviso }}>
      {children}
      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </ToastContext.Provider>
  );
};

// Container que renderiza os toasts
const ToastContainer = ({ toasts, onRemover }) => {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemover={onRemover} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Componente individual de toast
const ToastItem = ({ toast, onRemover }) => {
  const icones = {
    sucesso: <FiCheckCircle />,
    erro: <FiXCircle />,
    info: <FiInfo />,
    aviso: <FiAlertTriangle />,
  };

  return (
    <motion.div
      className={`toast toast--${toast.tipo}`}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      layout
    >
      <span className="toast__icone">
        {icones[toast.tipo] || icones.info}
      </span>
      <span className="toast__mensagem">{toast.mensagem}</span>
      <button 
        className="toast__fechar" 
        onClick={() => onRemover(toast.id)}
        aria-label="Fechar notificação"
      >
        <FiX />
      </button>
    </motion.div>
  );
};

export default ToastProvider;
