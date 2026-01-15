// ===========================================
// KIDIA - CONTEXTO DE AUTENTICAÇÃO (COOKIES httpOnly)
// ===========================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import autenticacaoService from '../servicos/autenticacao';
import criancasService from '../servicos/criancas';
import { 
  inicializarCsrf, 
  verificarAutenticacao, 
  clearLocalData,
  saveUser 
} from '../servicos/api';

const AutenticacaoContexto = createContext(null);

export const AutenticacaoProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [criancas, setCriancas] = useState([]);
  const [criancaSelecionada, setCriancaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [csrfPronto, setCsrfPronto] = useState(false);

  // Inicialização: CSRF primeiro, depois verificação de autenticação
  useEffect(() => {
    const inicializar = async () => {
      try {
        // 1. Inicializa CSRF token
        await inicializarCsrf();
        setCsrfPronto(true);
        
        // 2. Verifica se está autenticado consultando o backend
        const usuarioAutenticado = await verificarAutenticacao();
        
        if (usuarioAutenticado) {
          setUsuario(usuarioAutenticado);
          setAutenticado(true);
          saveUser(usuarioAutenticado);
          
          // 3. Carrega crianças
          try {
            const listaCriancas = await criancasService.listarCriancas();
            setCriancas(listaCriancas);
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Erro ao carregar crianças:', err);
            }
          }
          
          // 4. Verifica se há criança selecionada no cache
          const criancaAtual = criancasService.obterCriancaSelecionada();
          if (criancaAtual) {
            setCriancaSelecionada(criancaAtual);
          }
        } else {
          // Não autenticado - limpa dados locais
          clearLocalData();
          setAutenticado(false);
          setUsuario(null);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro ao inicializar autenticação:', error);
        }
        // Se der erro, limpa tudo
        clearLocalData();
        setAutenticado(false);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    inicializar();
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
        try {
          const listaCriancas = await criancasService.listarCriancas();
          setCriancas(listaCriancas);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao carregar crianças após login:', err);
          }
        }
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

  // Logout - agora é async pois chama o backend
  const logout = useCallback(async () => {
    setCarregando(true);
    try {
      await autenticacaoService.logout();
    } finally {
      setUsuario(null);
      setCriancas([]);
      setCriancaSelecionada(null);
      setAutenticado(false);
      setCarregando(false);
    }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao atualizar crianças:', error);
      }
    }
  }, []);

  // Revalidar sessão (útil para verificar se ainda está logado)
  const revalidarSessao = useCallback(async () => {
    try {
      const usuarioAtual = await verificarAutenticacao();
      if (usuarioAtual) {
        setUsuario(usuarioAtual);
        setAutenticado(true);
        saveUser(usuarioAtual);
        return true;
      } else {
        clearLocalData();
        setAutenticado(false);
        setUsuario(null);
        return false;
      }
    } catch (error) {
      clearLocalData();
      setAutenticado(false);
      setUsuario(null);
      return false;
    }
  }, []);

  const valor = {
    // Estado
    usuario,
    criancas,
    criancaSelecionada,
    carregando,
    autenticado,
    csrfPronto,
    
    // Ações
    login,
    registrar,
    logout,
    adicionarCrianca,
    selecionarCrianca,
    limparSelecaoCrianca,
    atualizarCriancas,
    revalidarSessao,
    
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
