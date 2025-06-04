import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { getProducts } from '../../lib/products';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

const categories = [
  "Tous",
  "Neural",
  "Sensoriel",
  "Défense",
  "Performance",
  "Cognitif",
  "Organique"
];

export const CataloguePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const filteredProducts = selectedCategory === "Tous"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center">
        <p className="text-[#2C3E50] text-xl [font-family:'Montserrat_Alternates',Helvetica]">
          Chargement des produits...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <Navigation isNavVisible={isNavVisible} toggleNav={toggleNav} />

      <main className="pt-32 px-8 max-w-[1368px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-semibold mb-4 text-center [font-family:'Montserrat_Alternates',Helvetica]">
            Catalogue d'Améliorations
          </h1>
          <p className="text-lg text-center text-[#443f3f] mb-12 [font-family:'Montserrat_Alternates',Helvetica]">
            Explorez notre gamme complète d'améliorations cybernétiques conçues pour repousser vos limites humaines.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-lg text-lg [font-family:'Montserrat_Alternates',Helvetica] transition-all duration-300 min-w-[140px]
                ${selectedCategory === category
                  ? 'bg-[#2C8DB0] text-white shadow-[0_0_20px_rgba(44,141,176,0.3)]'
                  : 'bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6,5px_-5px_10px_#a3a3a333,-5px_5px_10px_#a3a3a333] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] hover:bg-[#d9d9d9] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#2C8DB0] hover:via-[#66AEDD] hover:to-[#003366]'
                }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                layoutId={product.id}
              >
                <Card className="overflow-hidden bg-[#d9d9d9] rounded-[25px] shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6,15px_-15px_30px_#98989833,-15px_15px_30px_#98989833]">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.is_new && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-[#2C8DB0] via-[#66AEDD] to-[#003366] text-white px-3 py-1 rounded-full text-sm [font-family:'Montserrat_Alternates',Helvetica]">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1 [font-family:'Montserrat_Alternates',Helvetica]">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                          {product.category} - {product.sub_category}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-[#2C8DB0] fill-current" />
                        <span className="ml-1 text-sm text-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#443f3f] mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
                      {product.short_description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-semibold text-transparent bg-gradient-to-r from-[#2C8DB0] via-[#66AEDD] to-[#003366] bg-clip-text [font-family:'Montserrat_Alternates',Helvetica]">
                        {product.price.toLocaleString()} €
                      </span>
                      <Link to={`/produit/${product.id}`}>
                        <Button className="bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6,5px_-5px_10px_#a3a3a333,-5px_5px_10px_#a3a3a333] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] hover:bg-[#d9d9d9] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#2C8DB0] hover:via-[#66AEDD] hover:to-[#003366] transition-all duration-300">
                          Explorer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};