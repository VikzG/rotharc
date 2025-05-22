import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  minDuration?: number;
}

export const Loader: React.FC<LoaderProps> = ({ minDuration = 3500 }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, minDuration);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [minDuration]);
  
  const formattedProgress = Math.floor(progress);
  
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1,y:0 }}
          exit={{ opacity: 1,y:"-100%" }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#d9d9d9]"
        >
          <div className="w-full max-w-md px-4">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center justify-center mb-12"
            >
              <div className="relative">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-[#2C3E50] [font-family:'Mars',Helvetica] mb-2">
                    Rotharc
                  </h1>
                  <p className="text-xl text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                    technologies
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Loading text */}
            <div className="mb-8 text-center">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica] text-lg mb-2"
              >
                Initialisation des systèmes cybernétiques
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica] text-base"
              >
                {formattedProgress === 100 ? '- CONNEXION ÉTABLIE -' : 'CHARGEMENT...'}
              </motion.p>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-4 bg-[#d9d9d9] rounded-[15px] shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] mb-4 relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#2C8DB0] rounded-[15px]"
                style={{
                  boxShadow: '0 0 20px rgba(44, 141, 176, 0.3)'
                }}
              />
              
              {/* Scan effect */}
              <motion.div 
                className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  left: ['-10%', '110%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'linear'
                }}
              />
            </div>
            
            {/* Percentage */}
            <div className="flex justify-between text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              <span>{formattedProgress}%</span>
              <span>100%</span>
            </div>
            
            {/* Decorative elements */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                  className="h-2 bg-[#d9d9d9] rounded-[15px] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6]"
                />
              ))}
            </div>
            
            {/* Status messages */}
            <div className="mt-8 overflow-hidden h-32 bg-[#d9d9d9] rounded-[15px] shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] p-4">
              <motion.div
                animate={{ y: [-400, 0] }}
                transition={{ delay: 1, duration: 1 }}
                className="[font-family:'Montserrat_Alternates',Helvetica] text-sm leading-tight text-[#443f3f] grid grid-cols-1 gap-y-2"
              >
                {[
                  "Initialisation des systèmes...",
                  "Vérification des améliorations...",
                  "Calibration des interfaces neurales...",
                  "Synchronisation des données...",
                  "Configuration des protocoles de sécurité...",
                  "Optimisation des performances..."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[#2C8DB0]">&gt;</span>
                    <span>{text}</span>
                    <span className="text-[#2C8DB0] ml-auto">
                      {progress > (i + 1) * 15 ? '[OK]' : '...'}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};