import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { getProductById } from '../../lib/products';
import { ArrowLeft, Star, Shield } from 'lucide-react';
import { Product } from '../../types';

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('description');

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-[#2C8DB0] fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center">
        <p className="text-[#2C3E50] text-xl [font-family:'Montserrat_Alternates',Helvetica]">
          Chargement du produit...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#2C3E50] text-xl mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
            Produit non trouvé
          </p>
          <Link to="/catalogue">
            <Button className="bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90">
              Retour au catalogue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <Navigation isNavVisible={true} toggleNav={() => {}} />

      <main className="pt-32 px-8 max-w-[1368px] mx-auto">
        <div className="mb-8">
          <Link
            to="/catalogue"
            className="inline-flex items-center text-[#2C3E50] hover:text-[#2C8DB0] transition-colors [font-family:'Montserrat_Alternates',Helvetica]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-[25px] overflow-hidden shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-[#2C3E50] mb-1 [font-family:'Montserrat_Alternates',Helvetica]">
                    {product.category} / {product.sub_category}
                  </p>
                  <h1 className="text-4xl font-semibold [font-family:'Montserrat_Alternates',Helvetica]">
                    {product.name}
                  </h1>
                </div>
                {product.is_new && (
                  <span className="bg-[#2C8DB0] text-white px-3 py-1 rounded-full text-sm [font-family:'Montserrat_Alternates',Helvetica]">
                    Nouveau
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mb-4">
                {renderStars(product.rating)}
                <span className="ml-2 text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                  ({product.review_count} avis)
                </span>
              </div>

              <p className="text-3xl font-semibold text-[#2C8DB0] mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
                {product.price.toLocaleString()} €
              </p>

              <p className="text-lg text-[#443f3f] mb-8 [font-family:'Montserrat_Alternates',Helvetica]">
                {product.short_description}
              </p>
            </div>

            <Button className="w-full h-12 text-lg bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]">
              Se faire augmenter
            </Button>

            <div className="bg-[#d9d9d9] rounded-[15px] p-4 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6]">
              <div className="flex items-center gap-3 text-[#2C3E50]">
                <Shield className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold [font-family:'Montserrat_Alternates',Helvetica]">
                    Garantie premium
                  </h3>
                  <p className="text-sm [font-family:'Montserrat_Alternates',Helvetica]">
                    Cette amélioration inclut une garantie à vie et un suivi médical permanent.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex gap-4 border-b border-[#2C3E50]/20 mb-8">
            {['description', 'caractéristiques', 'compatibilité'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-lg capitalize [font-family:'Montserrat_Alternates',Helvetica] transition-colors
                  ${activeTab === tab
                    ? 'text-[#2C8DB0] border-b-2 border-[#2C8DB0]'
                    : 'text-[#2C3E50] hover:text-[#2C8DB0]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[200px] p-4">
            {activeTab === 'description' && (
              <p className="text-lg text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                {product.description}
              </p>
            )}
            {activeTab === 'caractéristiques' && (
              <ul className="list-disc list-inside space-y-2">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-lg text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'compatibilité' && (
              <ul className="list-disc list-inside space-y-2">
                {product.compatibility.map((item, index) => (
                  <li
                    key={index}
                    className="text-lg text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};