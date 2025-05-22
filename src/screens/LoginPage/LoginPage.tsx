import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { UserIcon, KeyIcon, HomeIcon } from 'lucide-react';
import { signIn } from '../../lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const result = await signIn({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center px-4">
      <Link
        to="/"
        className="fixed top-8 left-8 p-2 bg-[#d9d9d9] rounded-full shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300"
      >
        <HomeIcon className="w-6 h-6 text-[#2C3E50] hover:text-[#2C8DB0] transition-colors" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: [
            "20px 20px 30px #989898e6, -20px -20px 30px #ffffffe6",
            "-20px 20px 30px #989898e6, 20px -20px 30px #ffffffe6",
            "-20px -20px 30px #989898e6, 20px 20px 30px #ffffffe6",
            "20px -20px 30px #989898e6, -20px 20px 30px #ffffffe6",
            "20px 20px 30px #989898e6, -20px -20px 30px #ffffffe6"
          ]
        }}
        transition={{ 
          duration: 0.5,
          boxShadow: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.25, 0.5, 0.75, 1]
          }
        }}
        className="w-full max-w-[400px] bg-[#d9d9d9] rounded-[25px] p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
            Connexion
          </h1>
          <p className="text-sm text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
            Veuillez vous connecter pour accéder à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-[#2C3E50]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica] ${
                    errors.email ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="votreemail@exemple.fr"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-[#2C3E50]" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica] ${
                    errors.password ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-[#2C3E50] text-[#2C8DB0] focus:ring-[#2C8DB0]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
                Se souvenir de moi
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-[#2C8DB0] hover:text-[#2C8DB0]/80 [font-family:'Montserrat_Alternates',Helvetica]"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <p className="text-center text-sm text-[#2C3E50] [font-family:'Montserrat_Alternates',Helvetica]">
            Pas de compte ?{' '}
            <Link
              to="/register"
              className="text-[#2C8DB0] hover:text-[#2C8DB0]/80 font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};