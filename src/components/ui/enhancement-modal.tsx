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
  videoUrl
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#222222] rounded-[25px] overflow-hidden max-w-4xl w-full relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[300px] object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#222222] to-transparent" />
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white [font-family:'Montserrat_Alternates',Helvetica]">
              {title}
            </h2>
            <p className="text-gray-300 [font-family:'Montserrat_Alternates',Helvetica]">
              {description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};