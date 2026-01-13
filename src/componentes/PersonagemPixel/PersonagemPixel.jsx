import React from 'react';
import { motion } from 'framer-motion';
import './PersonagemPixel.scss';

const PersonagemPixel = ({ tipo = 'robo', tamanho = 'medio', animado = false }) => {
  const getClasseTamanho = () => {
    switch (tamanho) {
      case 'minusculo': return 'pixel-minusculo';
      case 'pequeno': return 'pixel-pequeno';
      case 'grande': return 'pixel-grande';
      default: return 'pixel-medio';
    }
  };

  const personagemRobo = (
    <div className={`personagem-pixel robo ${getClasseTamanho()}`}>
      {/* Antenas */}
      <div className="antena antena-esquerda">
        <div className="antena-bola"></div>
      </div>
      <div className="antena antena-direita">
        <div className="antena-bola"></div>
      </div>
      
      {/* Cabeça */}
      <div className="robo-cabeca">
        {/* Olhos */}
        <div className="olhos">
          <div className="olho olho-esquerdo">
            <div className="pupila"></div>
          </div>
          <div className="olho olho-direito">
            <div className="pupila"></div>
          </div>
        </div>
        
        {/* Bochechas */}
        <div className="bochechas">
          <div className="bochecha bochecha-esquerda"></div>
          <div className="bochecha bochecha-direita"></div>
        </div>
        
        {/* Boca */}
        <div className="boca"></div>
      </div>
      
      {/* Corpo */}
      <div className="robo-corpo">
        <div className="corpo-tela">
          <div className="icone-coracao">💜</div>
        </div>
        <div className="corpo-botoes">
          <span className="corpo-botao vermelho"></span>
          <span className="corpo-botao amarelo"></span>
          <span className="corpo-botao verde"></span>
        </div>
      </div>
      
      {/* Braços */}
      <div className="bracos">
        <div className="braco braco-esquerdo"></div>
        <div className="braco braco-direito"></div>
      </div>
      
      {/* Pernas */}
      <div className="pernas">
        <div className="perna perna-esquerda"></div>
        <div className="perna perna-direita"></div>
      </div>
    </div>
  );

  if (animado) {
    return (
      <motion.div
        className="pixel-wrapper"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {personagemRobo}
      </motion.div>
    );
  }

  return <div className="pixel-wrapper">{personagemRobo}</div>;
};

export default PersonagemPixel;
