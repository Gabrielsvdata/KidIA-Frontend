// ===========================================
// KIDIA - TELA DE SELEÇÃO DE PERFIL
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonagemPixel from '../PersonagemPixel/PersonagemPixel';
import { useAutenticacao } from '../../contextos/AutenticacaoContexto';
import './TelaSelecionarPerfil.scss';

const TelaSelecionarPerfil = ({ aoSelecionar, aoVoltar }) => {
  const { 
    usuario, 
    criancas, 
    selecionarCrianca, 
    adicionarCrianca, 
    logout,
    obterAvatares,
    carregando 
  } = useAutenticacao();
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoPerfilData, setNovoPerfilData] = useState({
    nome: '',
    idade: 6,
    avatar: 'avatar1',
  });
  const [erro, setErro] = useState('');

  const avatares = obterAvatares();

  const handleSelecionarPerfil = (crianca) => {
    selecionarCrianca(crianca);
    aoSelecionar && aoSelecionar(crianca);
  };

  const handleAdicionarPerfil = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const novaCrianca = await adicionarCrianca(
        novoPerfilData.nome,
        novoPerfilData.idade,
        novoPerfilData.avatar
      );
      
      setMostrarFormulario(false);
      setNovoPerfilData({ nome: '', idade: 6, avatar: 'avatar1' });
      
      // Seleciona automaticamente o novo perfil
      handleSelecionarPerfil(novaCrianca);
    } catch (error) {
      setErro(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoPerfilData(prev => ({
      ...prev,
      [name]: name === 'idade' ? parseInt(value) : value
    }));
    setErro('');
  };

  const handleLogout = () => {
    logout();
    aoVoltar && aoVoltar();
  };

  return (
    <div className="tela-selecionar-perfil">
      <div className="tela-selecionar-perfil__container">
        {/* Cabeçalho */}
        <motion.div
          className="tela-selecionar-perfil__cabecalho"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <PersonagemPixel tipo="robo" tamanho="medio" />
          <h1 className="tela-selecionar-perfil__titulo">
            Quem vai brincar?
          </h1>
          <p className="tela-selecionar-perfil__subtitulo">
            Olá, {usuario?.name || 'Responsável'}! Escolha o perfil da criança.
          </p>
        </motion.div>

        {/* Lista de Perfis */}
        <AnimatePresence mode="wait">
          {!mostrarFormulario ? (
            <motion.div
              key="lista"
              className="tela-selecionar-perfil__lista"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {criancas.map((crianca, index) => {
                const avatarInfo = avatares.find(a => a.id === crianca.avatar) || avatares[0];
                
                return (
                  <motion.button
                    key={crianca.id}
                    className="tela-selecionar-perfil__perfil-card"
                    onClick={() => handleSelecionarPerfil(crianca)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="tela-selecionar-perfil__perfil-avatar">
                      {avatarInfo.emoji}
                    </span>
                    <span className="tela-selecionar-perfil__perfil-nome">
                      {crianca.name}
                    </span>
                    <span className="tela-selecionar-perfil__perfil-idade">
                      {crianca.age} anos
                    </span>
                  </motion.button>
                );
              })}

              {/* Botão para adicionar novo perfil */}
              <motion.button
                className="tela-selecionar-perfil__adicionar-card"
                onClick={() => setMostrarFormulario(true)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: criancas.length * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tela-selecionar-perfil__adicionar-icone">+</span>
                <span className="tela-selecionar-perfil__adicionar-texto">
                  Adicionar Criança
                </span>
              </motion.button>

              {criancas.length === 0 && (
                <motion.p
                  className="tela-selecionar-perfil__vazio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Nenhum perfil cadastrado ainda. Adicione o primeiro!
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="formulario"
              className="tela-selecionar-perfil__formulario"
              onSubmit={handleAdicionarPerfil}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="tela-selecionar-perfil__form-titulo">
                Novo Perfil
              </h2>

              <div className="tela-selecionar-perfil__campo">
                <label className="tela-selecionar-perfil__label">
                  Nome da Criança
                </label>
                <input
                  type="text"
                  name="nome"
                  value={novoPerfilData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o nome"
                  className="tela-selecionar-perfil__input"
                  required
                  minLength={2}
                />
              </div>

              <div className="tela-selecionar-perfil__campo">
                <label className="tela-selecionar-perfil__label">
                  Idade: {novoPerfilData.idade} anos
                </label>
                <input
                  type="range"
                  name="idade"
                  value={novoPerfilData.idade}
                  onChange={handleInputChange}
                  min="4"
                  max="12"
                  className="tela-selecionar-perfil__slider"
                />
                <div className="tela-selecionar-perfil__slider-labels">
                  <span>4</span>
                  <span>12</span>
                </div>
              </div>

              <div className="tela-selecionar-perfil__campo">
                <label className="tela-selecionar-perfil__label">
                  Escolha um Avatar
                </label>
                <div className="tela-selecionar-perfil__avatares">
                  {avatares.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      className={`tela-selecionar-perfil__avatar-btn ${
                        novoPerfilData.avatar === avatar.id ? 'selecionado' : ''
                      }`}
                      onClick={() => setNovoPerfilData(prev => ({
                        ...prev,
                        avatar: avatar.id
                      }))}
                      title={avatar.nome}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {erro && (
                <motion.div
                  className="tela-selecionar-perfil__erro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {erro}
                </motion.div>
              )}

              <div className="tela-selecionar-perfil__form-botoes">
                <button
                  type="button"
                  className="tela-selecionar-perfil__botao-cancelar"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setErro('');
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tela-selecionar-perfil__botao-criar"
                  disabled={carregando}
                >
                  {carregando ? 'Criando...' : 'Criar Perfil'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Rodapé */}
        <div className="tela-selecionar-perfil__rodape">
          <button
            type="button"
            className="tela-selecionar-perfil__link-sair"
            onClick={handleLogout}
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelaSelecionarPerfil;
