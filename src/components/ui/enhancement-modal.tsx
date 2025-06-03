import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  videoUrl: string;
}

export const EnhancementModal: React.FC<EnhancementModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  videoUrl,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-50 w-full max-w-4xl bg-[#d9d9d9] rounded-[25px] overflow-hidden shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#d9d9d9] text-[#2C3E50] hover:text-[#2C8DB0] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
              {title}
            </h2>

            <div className="relative w-full h-[400px] rounded-[15px] overflow-hidden mb-6 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <p className="text-lg text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
              {description}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};