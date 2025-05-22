import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { products } from '../../../data/products';

interface StepOneProps {
  selectedProduct: string | null;
  onSelectProduct: (productId: string) => void;
  onNext: () => void;
}

export const StepOne = ({ selectedProduct, onSelectProduct, onNext }: StepOneProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
        Sélectionnez votre amélioration
      </h2>
      
      <div className="space-y-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-[#d9d9d9] rounded-[15px] p-4 cursor-pointer transition-all duration-300
              ${selectedProduct === product.id 
                ? 'shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] border-2 border-[#2C8DB0]'
                : 'shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)]'
              }`}
            onClick={() => onSelectProduct(product.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                  {product.name}
                </h3>
                <p className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                  {product.shortDescription}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xl font-semibold text-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]">
                  {product.price.toLocaleString()} €
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <Button
          disabled={!selectedProduct}
          onClick={onNext}
          className="px-8 py-2 bg-[#2C8DB0] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};