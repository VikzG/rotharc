import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';

export const ContactPage = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#d9d9d9]">
      <Navigation isNavVisible={isNavVisible} toggleNav={() => setIsNavVisible(!isNavVisible)} />

      <main className="pt-32 px-8 max-w-[1368px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-semibold text-center mb-4 [font-family:'Montserrat_Alternates',Helvetica]">
            Contactez Rotharc
          </h1>
          <p className="text-lg text-center text-[#443f3f] mb-12 [font-family:'Montserrat_Alternates',Helvetica]">
            Pour toute question concernant nos services ou pour planifier une consultation,
            n'hésitez pas à nous contacter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#d9d9d9] rounded-[25px] p-8 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6,15px_-15px_30px_#98989833,-15px_15px_30px_#98989833]"
          >
            <h2 className="text-2xl font-semibold mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
              Informations de contact
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#2C8DB0] mt-1" />
                <div>
                  <h3 className="font-medium mb-1 [font-family:'Montserrat_Alternates',Helvetica]">Adresse</h3>
                  <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                    123 Rue de l'Innovation<br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#2C8DB0] mt-1" />
                <div>
                  <h3 className="font-medium mb-1 [font-family:'Montserrat_Alternates',Helvetica]">Téléphone</h3>
                  <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">+33 1 23 45 67 89</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#2C8DB0] mt-1" />
                <div>
                  <h3 className="font-medium mb-1 [font-family:'Montserrat_Alternates',Helvetica]">Email</h3>
                  <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">contact@rotharc.com</p>
                </div>
              </div>
              
              <div className="border-t border-[#2C3E50]/20 pt-6">
                <h3 className="font-medium mb-2 [font-family:'Montserrat_Alternates',Helvetica]">Horaires d'ouverture</h3>
                <p className="text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                  Lundi - Vendredi: 9h - 18h<br />
                  Samedi: 10h - 16h
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 bg-[#d9d9d9] rounded-[25px] p-8 shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6,15px_-15px_30px_#98989833,-15px_15px_30px_#98989833]"
          >
            <h2 className="text-2xl font-semibold mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]"
                  placeholder="Sujet de votre message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#2C3E50] mb-2 [font-family:'Montserrat_Alternates',Helvetica]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 bg-[#d9d9d9] rounded-[15px] text-[#2C3E50] placeholder-[#2C3E50]/50 shadow-[inset_5px_5px_13px_#a3a3a3e6,inset_-5px_-5px_10px_#ffffffe6] focus:outline-none focus:ring-2 focus:ring-[#2C8DB0] [font-family:'Montserrat_Alternates',Helvetica]"
                  placeholder="Votre message"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-1/3 h-12 text-lg bg-[#2C8DB0] text-white hover:bg-[#2C8DB0]/90 shadow-[0_0_20px_rgba(44,141,176,0.3)] transition-all duration-300 [font-family:'Montserrat_Alternates',Helvetica]"
                >
                  Envoyer
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
            Nous Trouver
          </h2>
          <div className="bg-[#d9d9d9] rounded-[25px] overflow-hidden shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6,15px_-15px_30px_#98989833,-15px_15px_30px_#98989833]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937604!2d2.292292615509614!3d48.858370079287466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1647874587201!5m2!1sfr!2sfr"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};