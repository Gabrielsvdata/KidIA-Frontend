import React from 'react';
import { motion } from 'framer-motion';
import './BalaoMensagem.scss';

const BalaoMensagem = ({ mensagem, nomeUsuario }) => {
  const ehBot = mensagem.remetente === 'bot';
  
  const formatarHora = (data) => {
    return new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className={`balao-mensagem-container ${ehBot ? 'bot' : 'usuario'}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {ehBot && (
        <div className="balao-mensagem__avatar">
          <span className="balao-mensagem__avatar-emoji">🤖</span>
        </div>
      )}
      
      <div className={`balao-mensagem ${ehBot ? 'balao-bot' : 'balao-usuario'}`}>
        <p className="balao-mensagem__texto">{mensagem.texto}</p>
        <span className="balao-mensagem__hora">{formatarHora(mensagem.timestamp)}</span>
      </div>
      
      {!ehBot && (
        <div className="balao-mensagem__avatar balao-mensagem__avatar--usuario">
          <span className="balao-mensagem__avatar-emoji">😊</span>
        </div>
      )}
    </motion.div>
  );
};

export default BalaoMensagem;
