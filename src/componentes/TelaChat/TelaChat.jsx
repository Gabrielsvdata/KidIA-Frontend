import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonagemPixel from '../PersonagemPixel/PersonagemPixel';
import BalaoMensagem from '../BalaoMensagem/BalaoMensagem';
import RespostasRapidas from '../RespostasRapidas/RespostasRapidas';
import chatService from '../../servicos/chat';
import { estaAutenticado } from '../../servicos/api';
import './TelaChat.scss';

const TelaChat = ({ nomeUsuario, aoVoltar }) => {
  const [mensagens, setMensagens] = useState([]);
  const [textoInput, setTextoInput] = useState('');
  const [estaDigitando, setEstaDigitando] = useState(false);
  const [erroConexao, setErroConexao] = useState(false);
  const [respostasRapidas, setRespostasRapidas] = useState([]);
  const fimMensagensRef = useRef(null);
  const inputRef = useRef(null);

  // Carrega sugestões da API
  useEffect(() => {
    const carregarSugestoes = async () => {
      const sugestoes = await chatService.obterSugestoes();
      setRespostasRapidas(sugestoes.map(s => ({
        texto: s.text,
        icone: s.emoji
      })));
    };
    carregarSugestoes();
  }, []);

  // Mensagem inicial do Kiko
  useEffect(() => {
    const carregarBoasVindas = async () => {
      setEstaDigitando(true);
      
      try {
        // Verifica se está conectado à API
        const conectado = await chatService.verificarConexao();
        
        if (conectado) {
          // Usa mensagem rápida para boas-vindas
          const resultado = await chatService.enviarMensagemRapida(
            `Olá! Meu nome é ${nomeUsuario}, acabei de chegar aqui!`
          );
          
          const mensagemInicial = {
            id: Date.now(),
            texto: resultado.resposta,
            remetente: 'bot',
            timestamp: new Date(),
          };
          
          setMensagens([mensagemInicial]);
          setErroConexao(false);
        } else {
          throw new Error('API não disponível');
        }
      } catch (error) {
        console.error('Erro ao carregar boas-vindas:', error);
        // Mensagem padrão se API não estiver disponível
        const mensagemPadrao = {
          id: Date.now(),
          texto: `Oi ${nomeUsuario}! Que legal te conhecer! Eu sou o Kiko, seu amigo robô! O que você quer fazer hoje? Posso contar histórias, brincar de adivinha, ou a gente pode só conversar!`,
          remetente: 'bot',
          timestamp: new Date(),
        };
        
        setMensagens([mensagemPadrao]);
        setErroConexao(true);
      } finally {
        setEstaDigitando(false);
      }
    };

    carregarBoasVindas();
  }, [nomeUsuario]);

  // Auto scroll para última mensagem
  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Enviar mensagem
  const handleEnviarMensagem = async (texto = textoInput) => {
    if (!texto.trim()) return;

    const mensagemUsuario = {
      id: Date.now(),
      texto: texto.trim(),
      remetente: 'usuario',
      timestamp: new Date(),
    };

    setMensagens(prev => [...prev, mensagemUsuario]);
    setTextoInput('');
    setEstaDigitando(true);

    try {
      // Prepara histórico para contexto
      const historico = mensagens.map(m => ({
        remetente: m.remetente,
        texto: m.texto
      }));

      // Usa o serviço de chat (tenta autenticado, fallback para rápido)
      const resultado = await chatService.enviar(
        texto.trim(),
        historico,
        estaAutenticado()
      );

      const respostaBot = {
        id: Date.now() + 1,
        texto: resultado.resposta,
        remetente: 'bot',
        timestamp: new Date(),
      };
      
      setMensagens(prev => [...prev, respostaBot]);
      setErroConexao(false);
    } catch (error) {
      console.error('Erro ao obter resposta:', error);
      
      // Mensagem de erro amigável
      const mensagemErro = {
        id: Date.now() + 1,
        texto: `Ops ${nomeUsuario}, parece que estou com um probleminha para pensar agora! Pode tentar de novo daqui a pouquinho?`,
        remetente: 'bot',
        timestamp: new Date(),
      };
      
      setMensagens(prev => [...prev, mensagemErro]);
      setErroConexao(true);
    } finally {
      setEstaDigitando(false);
    }
  };

  const handleRespostaRapida = (resposta) => {
    handleEnviarMensagem(resposta.texto);
  };

  const handleTeclaPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  return (
    <div className="tela-chat">
      {/* Cabeçalho */}
      <header className="tela-chat__cabecalho">
        <motion.button
          className="tela-chat__botao-voltar"
          onClick={aoVoltar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="tela-chat__seta-voltar">←</span>
        </motion.button>
        
        <div className="tela-chat__cabecalho-personagem">
          <PersonagemPixel tipo="robo" tamanho="pequeno" />
        </div>
        
        <div className="tela-chat__cabecalho-info">
          <h2 className="tela-chat__cabecalho-titulo">Kiko</h2>
          <span className="tela-chat__cabecalho-status">
            <span className={`tela-chat__status-ponto ${erroConexao ? 'offline' : ''}`}></span>
            {erroConexao ? 'Modo offline' : 'Online'}
          </span>
        </div>
        
        <div className="tela-chat__cabecalho-decoracao">
          <span>🌟</span>
        </div>
      </header>

      {/* Área de Mensagens */}
      <div className="tela-chat__mensagens-container">
        <div className="tela-chat__mensagens-lista">
          <AnimatePresence>
            {mensagens.map((mensagem) => (
              <BalaoMensagem
                key={mensagem.id}
                mensagem={mensagem}
                nomeUsuario={nomeUsuario}
              />
            ))}
          </AnimatePresence>
          
          {estaDigitando && (
            <motion.div
              className="tela-chat__indicador-digitando"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PersonagemPixel tipo="robo" tamanho="minusculo" />
              <div className="tela-chat__pontos-digitando">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="tela-chat__texto-digitando">Kiko está pensando...</span>
            </motion.div>
          )}
          
          <div ref={fimMensagensRef} />
        </div>

        {/* Respostas Rápidas */}
        {mensagens.length <= 2 && (
          <RespostasRapidas respostas={respostasRapidas} aoSelecionar={handleRespostaRapida} />
        )}
      </div>

      {/* Área de Input */}
      <div className="tela-chat__area-input">
        <div className="tela-chat__input-container">
          <input
            ref={inputRef}
            type="text"
            value={textoInput}
            onChange={(e) => setTextoInput(e.target.value)}
            onKeyPress={handleTeclaPress}
            placeholder="Digite sua mensagem..."
            className="tela-chat__input-mensagem"
            maxLength={200}
          />
          
          <motion.button
            className="tela-chat__botao-enviar"
            onClick={() => handleEnviarMensagem()}
            disabled={!textoInput.trim()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="tela-chat__icone-enviar">📤</span>
          </motion.button>
        </div>
        
        <p className="tela-chat__nota-seguranca">
          🔒 Conversa segura e divertida!
        </p>
      </div>
    </div>
  );
};

export default TelaChat;
