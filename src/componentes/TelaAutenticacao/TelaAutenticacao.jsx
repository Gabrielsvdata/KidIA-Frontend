// ===========================================
// KIDIA - TELA DE AUTENTICAÇÃO
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonagemPixel from '../PersonagemPixel/PersonagemPixel';
import { useAutenticacao } from '../../contextos/AutenticacaoContexto';
import { useToast } from '../Toast/Toast';
import { useRateLimiter } from '../../hooks/useRateLimiter';
import { sanitizarTexto, limitarTamanho } from '../../utils/seguranca';
import './TelaAutenticacao.scss';

const TelaAutenticacao = ({ aoSucesso, aoPular }) => {
  const { login, registrar, carregando } = useAutenticacao();
  const toast = useToast();
  // Rate limiter: 1s entre tentativas, máx 5 tentativas, reset após 60s
  const rateLimiter = useRateLimiter(1000, 5, 60000);
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
    // Sanitiza e limita tamanho da entrada
    const valorSeguro = name === 'senha' || name === 'confirmarSenha' 
      ? limitarTamanho(value, 128) // Senhas podem ter caracteres especiais
      : limitarTamanho(sanitizarTexto(value), 100);
    setFormData(prev => ({ ...prev, [name]: valorSeguro }));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Verifica rate limiting
    if (rateLimiter.bloqueado) {
      toast.erro(`Muitas tentativas. Aguarde ${rateLimiter.tempoRestante}s`);
      return;
    }

    if (!rateLimiter.verificarPermissao()) {
      toast.aviso('Aguarde um momento antes de tentar novamente');
      return;
    }

    // Registra tentativa
    rateLimiter.registrarTentativa();

    try {
      if (modo === 'registro') {
        // Validações de registro
        if (formData.senha !== formData.confirmarSenha) {
          toast.erro('As senhas não coincidem');
          setErro('As senhas não coincidem');
          return;
        }

        const resultado = await registrar(formData.nome, formData.email, formData.senha);
        
        // Exibe toast de sucesso com mensagem da API
        const mensagemSucesso = resultado?.message || 'Cadastro realizado com sucesso!';
        toast.sucesso(mensagemSucesso);
        setSucesso('Conta criada com sucesso! Faça login para continuar.');
        setModo('login');
        setFormData(prev => ({ ...prev, senha: '', confirmarSenha: '' }));
        rateLimiter.resetar(); // Reseta rate limiter após sucesso
      } else {
        // Login
        const resultado = await login(formData.email, formData.senha);
        if (resultado.success) {
          // Exibe toast de sucesso com mensagem da API
          const mensagemSucesso = resultado?.message || 'Login realizado com sucesso!';
          toast.sucesso(mensagemSucesso);
          rateLimiter.resetar(); // Reseta rate limiter após sucesso
          
          // Pequeno delay para o usuário ver o toast antes de redirecionar
          setTimeout(() => {
            aoSucesso && aoSucesso();
          }, 800);
        }
      }
    } catch (error) {
      // Exibe toast de erro com mensagem da API
      const mensagemErro = error.message || 'Ocorreu um erro. Tente novamente.';
      toast.erro(mensagemErro);
      setErro(mensagemErro);
    }
  };

  const alternarModo = () => {
    setModo(modo === 'login' ? 'registro' : 'login');
    setErro('');
    setSucesso('');
    rateLimiter.resetar(); // Reseta rate limiter ao trocar de modo
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
            className={`tela-autenticacao__botao-principal ${rateLimiter.bloqueado ? 'tela-autenticacao__botao-principal--bloqueado' : ''}`}
            disabled={carregando || rateLimiter.bloqueado}
            whileHover={{ scale: carregando || rateLimiter.bloqueado ? 1 : 1.02 }}
            whileTap={{ scale: carregando || rateLimiter.bloqueado ? 1 : 0.98 }}
          >
            {carregando 
              ? 'Aguarde...' 
              : rateLimiter.bloqueado 
                ? `Bloqueado (${rateLimiter.tempoRestante}s)`
                : modo === 'login' 
                  ? 'Entrar' 
                  : 'Criar Conta'}
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
