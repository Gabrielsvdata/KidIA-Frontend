// ===========================================
// KIDIA - CONTEXTO DE AUTENTICAÇÃO
// ===========================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import autenticacaoService from '../servicos/autenticacao';
import criancasService from '../servicos/criancas';
import { estaAutenticado, getUser, clearTokens } from '../servicos/api';

const AutenticacaoContexto = createContext(null);

export const AutenticacaoProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [criancas, setCriancas] = useState([]);
  const [criancaSelecionada, setCriancaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  // Verifica autenticação inicial
  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        if (estaAutenticado()) {
          const usuarioSalvo = getUser();
          setUsuario(usuarioSalvo);
          setAutenticado(true);
          
          // Carrega crianças
          const listaCriancas = await criancasService.listarCriancas();
          setCriancas(listaCriancas);
          
          // Verifica se há criança selecionada
          const criancaAtual = criancasService.obterCriancaSelecionada();
          if (criancaAtual) {
            setCriancaSelecionada(criancaAtual);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Se der erro, limpa tudo
        clearTokens();
        setAutenticado(false);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();
  }, []);

  // Login
  const login = useCallback(async (email, senha) => {
    setCarregando(true);
    try {
      const resultado = await autenticacaoService.login(email, senha);
      
      if (resultado.success) {
        setUsuario(resultado.user);
        setAutenticado(true);
        
        // Carrega crianças após login
        const listaCriancas = await criancasService.listarCriancas();
        setCriancas(listaCriancas);
      }
      
      return resultado;
    } catch (error) {
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  // Registrar
  const registrar = useCallback(async (nome, email, senha) => {
    setCarregando(true);
    try {
      const resultado = await autenticacaoService.registrar(nome, email, senha);
      return resultado;
    } catch (error) {
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    autenticacaoService.logout();
    setUsuario(null);
    setCriancas([]);
    setCriancaSelecionada(null);
    setAutenticado(false);
  }, []);

  // Adicionar criança
  const adicionarCrianca = useCallback(async (nome, idade, avatar) => {
    try {
      const novaCrianca = await criancasService.adicionarCrianca(nome, idade, avatar);
      setCriancas(prev => [...prev, novaCrianca]);
      return novaCrianca;
    } catch (error) {
      throw error;
    }
  }, []);

  // Selecionar criança
  const selecionarCrianca = useCallback((crianca) => {
    criancasService.selecionarCrianca(crianca);
    setCriancaSelecionada(crianca);
  }, []);

  // Limpar seleção de criança
  const limparSelecaoCrianca = useCallback(() => {
    criancasService.limparSelecao();
    setCriancaSelecionada(null);
  }, []);

  // Atualizar lista de crianças
  const atualizarCriancas = useCallback(async () => {
    try {
      const listaCriancas = await criancasService.listarCriancas();
      setCriancas(listaCriancas);
    } catch (error) {
      console.error('Erro ao atualizar crianças:', error);
    }
  }, []);

  const valor = {
    // Estado
    usuario,
    criancas,
    criancaSelecionada,
    carregando,
    autenticado,
    
    // Ações
    login,
    registrar,
    logout,
    adicionarCrianca,
    selecionarCrianca,
    limparSelecaoCrianca,
    atualizarCriancas,
    
    // Helpers
    obterAvatares: criancasService.obterAvatares,
  };

  return (
    <AutenticacaoContexto.Provider value={valor}>
      {children}
    </AutenticacaoContexto.Provider>
  );
};

// Hook para usar o contexto
export const useAutenticacao = () => {
  const contexto = useContext(AutenticacaoContexto);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de um AutenticacaoProvider');
  }
  return contexto;
};

export default AutenticacaoContexto;
