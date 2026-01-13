import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AutenticacaoProvider, useAutenticacao } from './contextos/AutenticacaoContexto';
import TelaInicial from './componentes/TelaInicial/TelaInicial';
import TelaChat from './componentes/TelaChat/TelaChat';
import TelaAutenticacao from './componentes/TelaAutenticacao/TelaAutenticacao';
import TelaSelecionarPerfil from './componentes/TelaSelecionarPerfil/TelaSelecionarPerfil';
import ElementosFlutuantes from './componentes/ElementosFlutuantes/ElementosFlutuantes';
import './styles/App.scss';

// Componente interno que usa o contexto de autenticação
const AppContent = () => {
  const { autenticado, criancaSelecionada, carregando, limparSelecaoCrianca } = useAutenticacao();
  
  // Telas: 'inicial', 'login', 'selecionar-perfil', 'chat'
  const [telaAtual, setTelaAtual] = useState('inicial');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [modoConvidado, setModoConvidado] = useState(false);

  // Atualiza nome quando criança é selecionada
  useEffect(() => {
    if (criancaSelecionada) {
      setNomeUsuario(criancaSelecionada.name);
    }
  }, [criancaSelecionada]);

  // Se estiver carregando, mostra tela de loading
  if (carregando) {
    return (
      <div className="app app--carregando">
        <ElementosFlutuantes />
        <div className="app__loading">
          <span className="app__loading-emoji">🤖</span>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Handler para início (tela inicial sem login)
  const handleIniciarConvidado = (nome) => {
    setNomeUsuario(nome);
    setModoConvidado(true);
    setTelaAtual('chat');
  };

  // Handler para ir para login
  const handleIrParaLogin = () => {
    setTelaAtual('login');
  };

  // Handler para login com sucesso
  const handleLoginSucesso = () => {
    setTelaAtual('selecionar-perfil');
  };

  // Handler para pular login (modo convidado)
  const handlePularLogin = () => {
    setTelaAtual('inicial');
    setModoConvidado(true);
  };

  // Handler para selecionar perfil da criança
  const handleSelecionarPerfil = (crianca) => {
    setNomeUsuario(crianca.name);
    setTelaAtual('chat');
  };

  // Handler para voltar
  const handleVoltarInicio = () => {
    if (autenticado && !modoConvidado) {
      limparSelecaoCrianca();
      setTelaAtual('selecionar-perfil');
    } else {
      setTelaAtual('inicial');
      setModoConvidado(false);
    }
  };

  // Handler para voltar do login
  const handleVoltarDoLogin = () => {
    setTelaAtual('inicial');
  };

  return (
    <div className="app">
      <ElementosFlutuantes />
      <AnimatePresence mode="wait">
        {/* Tela Inicial */}
        {telaAtual === 'inicial' && (
          <motion.div
            key="inicial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <TelaInicial 
              aoIniciar={handleIniciarConvidado} 
              aoLogin={handleIrParaLogin}
              modoConvidado={modoConvidado}
            />
          </motion.div>
        )}

        {/* Tela de Login/Registro */}
        {telaAtual === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <TelaAutenticacao 
              aoSucesso={handleLoginSucesso}
              aoPular={handlePularLogin}
            />
          </motion.div>
        )}

        {/* Tela de Seleção de Perfil */}
        {telaAtual === 'selecionar-perfil' && (
          <motion.div
            key="selecionar-perfil"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <TelaSelecionarPerfil 
              aoSelecionar={handleSelecionarPerfil}
              aoVoltar={handleVoltarDoLogin}
            />
          </motion.div>
        )}

        {/* Tela de Chat */}
        {telaAtual === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <TelaChat 
              nomeUsuario={nomeUsuario} 
              aoVoltar={handleVoltarInicio} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente App principal com Provider
function App() {
  return (
    <AutenticacaoProvider>
      <AppContent />
    </AutenticacaoProvider>
  );
}

export default App;
