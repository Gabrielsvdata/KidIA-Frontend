import React from 'react';
import { motion } from 'framer-motion';
import './RespostasRapidas.scss';

const RespostasRapidas = ({ respostas, aoSelecionar }) => {
  return (
    <motion.div
      className="respostas-rapidas"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <p className="respostas-rapidas__label">💡 Sugestões rápidas:</p>
      <div className="respostas-rapidas__lista">
        {respostas.map((resposta, indice) => (
          <motion.button
            key={indice}
            className="respostas-rapidas__botao"
            onClick={() => aoSelecionar(resposta)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * indice }}
          >
            <span className="respostas-rapidas__icone">{resposta.icone}</span>
            <span className="respostas-rapidas__texto">{resposta.texto}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RespostasRapidas;
