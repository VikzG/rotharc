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

export const EnhancementModal = ({
  isOpen,
  onClose,
  title,
  description,
  videoUrl
}: EnhancementModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#222222] rounded-[25px] overflow-hidden"
            style={{ height: '75vh' }} // Réduit à 75% de la hauteur de la fenêtre
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="h-full flex flex-col">
              <div className="relative h-1/2">
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
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#222222] pointer-events-none" />
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-4 text-white [font-family:'Montserrat_Alternates',Helvetica]">
                  {title}
                </h2>
                <p className="text-gray-300 text-lg [font-family:'Montserrat_Alternates',Helvetica]">
                  {description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};