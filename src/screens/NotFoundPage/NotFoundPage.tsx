import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] bg-[#d9d9d9] rounded-[25px] p-8 text-center shadow-[20px_20px_60px_#989898,-20px_-20px_60px_#ffffff]"
      >
        <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#d9d9d9] flex items-center justify-center shadow-[inset_5px_5px_10px_#989898,inset_-5px_-5px_10px_#ffffff]">
          <span className="text-[#2C8DB0] text-2xl font-bold">!</span>
        </div>

        <h1 className="text-6xl font-bold mb-4 text-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]">
          404
        </h1>
        
        <h2 className="text-2xl font-medium mb-2 text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
          Page non trouvée
        </h2>
        
        <p className="text-[#443f3f] mb-8 [font-family:'Montserrat_Alternates',Helvetica]">
          Désolé, la page que vous recherchez n'existe pas.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="px-6 bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_10px_#989898,-5px_-5px_10px_#ffffff] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
          >
            Retour
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="px-6 bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
          >
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};