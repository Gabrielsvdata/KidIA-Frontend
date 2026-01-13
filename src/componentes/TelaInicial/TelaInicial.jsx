import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PersonagemPixel from '../PersonagemPixel/PersonagemPixel';
import './TelaInicial.scss';

const TelaInicial = ({ aoIniciar, aoLogin, modoConvidado }) => {
  const [nome, setNome] = useState('');
  const [mostrarInputNome, setMostrarInputNome] = useState(false);

  const handleClicarIniciar = () => {
    setMostrarInputNome(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim()) {
      aoIniciar(nome.trim());
    }
  };

  return (
    <div className="tela-inicial">
      <div className="tela-inicial__conteudo">
        <motion.div
          className="tela-inicial__logo"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 className="tela-inicial__logo-texto">
            <span className="tela-inicial__logo-kid">Kid</span>
            <span className="tela-inicial__logo-ia">IA</span>
          </h1>
          <div className="tela-inicial__logo-subtitulo">Seu amiguinho virtual!</div>
        </motion.div>

        <motion.div
          className="tela-inicial__personagem"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <PersonagemPixel tipo="robo" tamanho="grande" animado />
        </motion.div>

        <motion.div
          className="tela-inicial__mensagem"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="tela-inicial__texto">
            Olá! Eu sou o <strong>Kiko</strong>, seu amigo robô!
          </p>
          <p className="tela-inicial__texto">
            Vamos conversar, brincar e aprender juntos?
          </p>
        </motion.div>

        {!mostrarInputNome ? (
          <motion.div
            className="tela-inicial__botoes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="tela-inicial__botao-iniciar"
              onClick={handleClicarIniciar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tela-inicial__botao-icone">🚀</span>
              Brincar Agora!
            </motion.button>
            
            {aoLogin && (
              <motion.button
                className="tela-inicial__botao-login"
                onClick={aoLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tela-inicial__botao-icone">👨‍👩‍👧</span>
                Área do Responsável
              </motion.button>
            )}
            
            {modoConvidado && (
              <p className="tela-inicial__modo-convidado">
                Modo convidado - funcionalidades limitadas
              </p>
            )}
          </motion.div>
        ) : (
          <motion.form
            className="tela-inicial__formulario"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="tela-inicial__label">
              <span className="tela-inicial__label-icone">✨</span>
              Qual é o seu nome?
            </label>
            <div className="tela-inicial__input-container">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome aqui..."
                className="tela-inicial__input"
                autoFocus
                maxLength={20}
              />
              <motion.button
                type="submit"
                className="tela-inicial__botao-entrar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!nome.trim()}
              >
                <span>Entrar</span>
                <span className="tela-inicial__botao-seta">→</span>
              </motion.button>
            </div>
            <button
              type="button"
              className="tela-inicial__botao-voltar"
              onClick={() => setMostrarInputNome(false)}
            >
              ← Voltar
            </button>
          </motion.form>
        )}

        <div className="tela-inicial__decoracao">
          <span className="tela-inicial__deco-estrela">⭐</span>
          <span className="tela-inicial__deco-coracao">💜</span>
          <span className="tela-inicial__deco-brilho">✨</span>
        </div>
      </div>
    </div>
  );
};

export default TelaInicial;
