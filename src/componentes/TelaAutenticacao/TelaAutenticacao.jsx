// ===========================================
// KIDIA - TELA DE AUTENTICAÇÃO
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonagemPixel from '../PersonagemPixel/PersonagemPixel';
import { useAutenticacao } from '../../contextos/AutenticacaoContexto';
import './TelaAutenticacao.scss';

const TelaAutenticacao = ({ aoSucesso, aoPular }) => {
  const { login, registrar, carregando } = useAutenticacao();
  const [modo, setModo] = useState('login'); // 'login' ou 'registro'
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      if (modo === 'registro') {
        // Validações de registro
        if (formData.senha !== formData.confirmarSenha) {
          setErro('As senhas não coincidem');
          return;
        }

        await registrar(formData.nome, formData.email, formData.senha);
        setSucesso('Conta criada com sucesso! Faça login para continuar.');
        setModo('login');
        setFormData(prev => ({ ...prev, senha: '', confirmarSenha: '' }));
      } else {
        // Login
        const resultado = await login(formData.email, formData.senha);
        if (resultado.success) {
          aoSucesso && aoSucesso();
        }
      }
    } catch (error) {
      setErro(error.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  const alternarModo = () => {
    setModo(modo === 'login' ? 'registro' : 'login');
    setErro('');
    setSucesso('');
    setFormData({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    });
  };

  return (
    <div className="tela-autenticacao">
      <div className="tela-autenticacao__container">
        {/* Cabeçalho */}
        <motion.div
          className="tela-autenticacao__cabecalho"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <PersonagemPixel tipo="robo" tamanho="medio" />
          <h1 className="tela-autenticacao__titulo">
            {modo === 'login' ? 'Área do Responsável' : 'Criar Conta'}
          </h1>
          <p className="tela-autenticacao__subtitulo">
            {modo === 'login' 
              ? 'Entre para gerenciar os perfis das crianças'
              : 'Cadastre-se para criar perfis personalizados'}
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.form
          className="tela-autenticacao__formulario"
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {modo === 'registro' && (
              <motion.div
                className="tela-autenticacao__campo"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label htmlFor="nome" className="tela-autenticacao__label">
                  Seu Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome"
                  className="tela-autenticacao__input"
                  required
                  minLength={2}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="tela-autenticacao__campo">
            <label htmlFor="email" className="tela-autenticacao__label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              className="tela-autenticacao__input"
              required
            />
          </div>

          <div className="tela-autenticacao__campo">
            <label htmlFor="senha" className="tela-autenticacao__label">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              className="tela-autenticacao__input"
              required
              minLength={8}
            />
          </div>

          <AnimatePresence mode="wait">
            {modo === 'registro' && (
              <motion.div
                className="tela-autenticacao__campo"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label htmlFor="confirmarSenha" className="tela-autenticacao__label">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  placeholder="Digite a senha novamente"
                  className="tela-autenticacao__input"
                  required
                  minLength={8}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensagens */}
          <AnimatePresence>
            {erro && (
              <motion.div
                className="tela-autenticacao__mensagem tela-autenticacao__mensagem--erro"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {erro}
              </motion.div>
            )}
            {sucesso && (
              <motion.div
                className="tela-autenticacao__mensagem tela-autenticacao__mensagem--sucesso"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {sucesso}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dicas de senha */}
          {modo === 'registro' && (
            <div className="tela-autenticacao__dicas">
              <p>A senha deve ter:</p>
              <ul>
                <li>Mínimo 8 caracteres</li>
                <li>1 letra maiúscula</li>
                <li>1 letra minúscula</li>
                <li>1 número</li>
              </ul>
            </div>
          )}

          <motion.button
            type="submit"
            className="tela-autenticacao__botao-principal"
            disabled={carregando}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar Conta'}
          </motion.button>
        </motion.form>

        {/* Links */}
        <div className="tela-autenticacao__links">
          <button
            type="button"
            className="tela-autenticacao__link"
            onClick={alternarModo}
          >
            {modo === 'login' 
              ? 'Não tem conta? Criar agora' 
              : 'Já tem conta? Fazer login'}
          </button>
          
          {aoPular && (
            <button
              type="button"
              className="tela-autenticacao__link tela-autenticacao__link--pular"
              onClick={aoPular}
            >
              Continuar sem login (modo limitado)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelaAutenticacao;
