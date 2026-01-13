import React from 'react';
import { motion } from 'framer-motion';
import './ElementosFlutuantes.scss';

const ElementosFlutuantes = () => {
  const elementos = [
    { emoji: '⭐', atraso: 0 },
    { emoji: '🌈', atraso: 0.5 },
    { emoji: '💜', atraso: 1 },
    { emoji: '✨', atraso: 1.5 },
    { emoji: '🎈', atraso: 2 },
    { emoji: '🦋', atraso: 2.5 },
    { emoji: '🌟', atraso: 3 },
    { emoji: '💫', atraso: 3.5 },
  ];

  return (
    <div className="elementos-flutuantes">
      {elementos.map((el, indice) => (
        <motion.span
          key={indice}
          className={`elementos-flutuantes__elemento el-${indice}`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + indice,
            repeat: Infinity,
            delay: el.atraso,
            ease: "easeInOut"
          }}
        >
          {el.emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default ElementosFlutuantes;
