// ===========================================
// KIDIA - HOOK DE RATE LIMITING
// ===========================================

import { useState, useCallback, useRef } from 'react';

/**
 * Hook para prevenir spam de submissões
 * @param {number} tempoEspera - Tempo mínimo entre submissões (ms)
 * @param {number} maxTentativas - Número máximo de tentativas no período
 * @param {number} periodoReset - Período para resetar contador (ms)
 */
export const useRateLimiter = (
  tempoEspera = 1000, 
  maxTentativas = 5, 
  periodoReset = 60000
) => {
  const [bloqueado, setBloqueado] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const ultimaTentativaRef = useRef(0);
  const timerRef = useRef(null);

  const verificarPermissao = useCallback(() => {
    const agora = Date.now();
    const tempoDesdeUltima = agora - ultimaTentativaRef.current;

    // Verifica se passou tempo suficiente desde última tentativa
    if (tempoDesdeUltima < tempoEspera) {
      return false;
    }

    // Verifica se excedeu número máximo de tentativas
    if (tentativas >= maxTentativas) {
      return false;
    }

    return true;
  }, [tempoEspera, maxTentativas, tentativas]);

  const registrarTentativa = useCallback(() => {
    const agora = Date.now();
    ultimaTentativaRef.current = agora;
    
    setTentativas(prev => {
      const novoValor = prev + 1;
      
      // Se atingiu o máximo, bloqueia por um período
      if (novoValor >= maxTentativas) {
        setBloqueado(true);
        setTempoRestante(periodoReset / 1000);
        
        // Inicia countdown
        timerRef.current = setInterval(() => {
          setTempoRestante(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setBloqueado(false);
              setTentativas(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      
      return novoValor;
    });
  }, [maxTentativas, periodoReset]);

  const resetar = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setBloqueado(false);
    setTentativas(0);
    setTempoRestante(0);
    ultimaTentativaRef.current = 0;
  }, []);

  return {
    bloqueado,
    tentativas,
    tempoRestante,
    verificarPermissao,
    registrarTentativa,
    resetar,
  };
};

/**
 * Hook simples de debounce para inputs
 * @param {number} delay - Delay em ms
 */
export const useDebounce = (delay = 300) => {
  const timeoutRef = useRef(null);

  const debounce = useCallback((callback) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(callback, delay);
  }, [delay]);

  const cancelar = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { debounce, cancelar };
};

export default useRateLimiter;
