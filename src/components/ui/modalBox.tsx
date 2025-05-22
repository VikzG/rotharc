import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import My3DScene from "./My3DScene";
import { Canvas } from "@react-three/fiber";

export interface EnhancementModalProps {
  title: string;
  description: string;
  modelPath: string;
  sceneProps: {
    scale: [number, number, number];
    position: [number, number, number];
    rotation: [number, number, number];
  };
  onClose: () => void;
  isOpen: boolean;
}

export const ModalBox: React.FC<EnhancementModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  modelPath,
  sceneProps, // Destructure sceneProps here
}) => {
  const { scale, position, rotation } = sceneProps;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-opacity-80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-3xl rounded-2xl p-8 text-cyan-100">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-black hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* 3D Model */}
                <div className="w-full md:w-1/2">
                  {/* Ajout du Canvas pour encapsuler la scène 3D */}
                  <Canvas>
                    <My3DScene
                      path={modelPath}
                      scale={scale}
                      position={position}
                      rotation={rotation}
                    />
                  </Canvas>
                </div>

                {/* Text content */}
                <div className="md:w-1/2 text-left">
                  <h2 className="text-3xl font-extrabold text-black mb-4 tracking-wide">
                    {title}
                  </h2>
                  <p className="text-lg text-black leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
