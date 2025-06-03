import { useState, useEffect } from 'react';
import { HomeIcon, LogOutIcon, MailIcon, MenuIcon, UserIcon, CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { signOut } from '../lib/auth';

interface NavigationProps {
  isNavVisible: boolean;
  toggleNav: () => void;
}

export const Navigation = ({ isNavVisible, toggleNav }: NavigationProps) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, loading } = useAuth();

  const isActiveRoute = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;
      const isAtTop = currentScrollPos < 10;
      
      if (!hasScrolled && currentScrollPos > 0) {
        setHasScrolled(true);
      }
      
      setVisible(isScrollingUp || isAtTop);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, hasScrolled]);

  const navItems = [
    { path: '/', icon: <HomeIcon className="w-4 h-4 " />, label: 'Accueil' },
    { path: '/catalogue', icon: <img className="w-[23px] h-[23px]" alt="Catalogue" src="/general-massage-area.png" />, label: 'Catalogue' },
    { path: '/reservation', icon: <CalendarIcon className="w-4 h-4" />, label: 'Réservation' },
    { path: '/contact', icon: <MailIcon className="w-4 h-4" />, label: 'Contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-5 right-5 z-50 bg-gradient-to-r from-[#1a1a1a] via-[#2C8DB0]/20 to-[#1a1a1a] backdrop-blur-sm rounded-full mx-auto shadow-[0_0_20px_rgba(44,141,176,0.3)] border border-[#2C8DB0]/30"
    >
      <div className="flex justify-between items-center px-4 md:px-8 relative">
        <Link to="/">
          <motion.div className="mx-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="-50 -50 650 200">
              <text fontFamily="Mars" fontSize="86.667" fill="#ffffff" x="246" y="38" textAnchor="middle">Rotharc</text>
              <text fontFamily="Rajdhani" fontSize="53.333" fill="#2C8DB0" x="400" y="120" textAnchor="middle">technologies</text>
            </svg>
          </motion.div>
        </Link>

        <div className="flex items-center">
          <AnimatePresence>
            {isNavVisible && !isMobile && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto'}}
                exit={{ opacity: 0, width: 0}}
                transition={{ duration: 0.3}}
                className="flex items-center gap-2 md:gap-4 pr-4"
              >
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`relative group ${
                          isActiveRoute(item.path) 
                            ? 'bg-[#2C8DB0]/20 text-white' 
                            : 'bg-transparent text-white hover:bg-[#2C8DB0]/10'
                        } rounded-full w-10 h-10 shadow-[inset_0_0_10px_rgba(44,141,176,0.3)] hover:shadow-[0_0_20px_rgba(44,141,176,0.5)] transition-all duration-300 flex items-center justify-center border border-[#2C8DB0]/30`}
                      >
                        <div className="flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-white [font-family:'Montserrat_Alternates',Helvetica]">
                          {item.label}
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                ))}

                {!loading && (
                  <>
                    {user ? (
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="relative group bg-transparent text-white hover:bg-[#2C8DB0]/10 rounded-full w-10 h-10 shadow-[inset_0_0_10px_rgba(44,141,176,0.3)] hover:shadow-[0_0_20px_rgba(44,141,176,0.5)] transition-all duration-300 flex items-center justify-center border border-[#2C8DB0]/30 overflow-hidden"
                          >
                            {profile?.avatar_url ? (
                              <img 
                                src={profile.avatar_url} 
                                alt="Avatar" 
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <UserIcon className="w-4 h-4" />
                            )}
                            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-white [font-family:'Montserrat_Alternates',Helvetica]">
                              Mon Compte
                            </span>
                          </Button>
                          {isUserMenuOpen && <UserMenu onClose={() => setIsUserMenuOpen(false)} />}
                        </motion.div>
                      </div>
                    ) : (
                      <Link to="/login">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="relative group bg-transparent text-white hover:bg-[#2C8DB0]/10 rounded-full w-10 h-10 shadow-[inset_0_0_10px_rgba(44,141,176,0.3)] hover:shadow-[0_0_20px_rgba(44,141,176,0.5)] transition-all duration-300 flex items-center justify-center border border-[#2C8DB0]/30"
                          >
                            <UserIcon className="w-4 h-4" />
                            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-white [font-family:'Montserrat_Alternates',Helvetica]">
                              Connexion
                            </span>
                          </Button>
                        </motion.div>
                      </Link>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNav}
              className="w-[50px] h-[50px] rounded-full bg-transparent text-white hover:bg-[#2C8DB0]/10 shadow-[inset_0_0_10px_rgba(44,141,176,0.3)] hover:shadow-[0_0_20px_rgba(44,141,176,0.5)] transition-all duration-300 flex items-center justify-center border border-[#2C8DB0]/30"
            >
              <MenuIcon className={`w-6 h-6 transition-transform duration-300 ${isNavVisible ? 'rotate-90' : 'rotate-0'}`} />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobile && (
        <AnimatePresence>
          {isNavVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-gradient-to-b from-[#1a1a1a] to-[#2C8DB0]/20 backdrop-blur-sm shadow-lg py-4 rounded-[25px] mt-4 border border-[#2C8DB0]/30"
            >
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className={`flex items-center gap-3 px-6 py-3 ${
                      isActiveRoute(item.path) 
                        ? 'text-white bg-[#2C8DB0]/20' 
                        : 'text-white hover:bg-[#2C8DB0]/10'
                    }`}
                  >
                    {item.icon}
                    <span className="[font-family:'Montserrat_Alternates',Helvetica]">{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link to="/profile">
                        <motion.div
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3 px-6 py-3 text-white hover:bg-[#2C8DB0]/10"
                        >
                          {profile?.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt="Avatar" 
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-4 h-4" />
                          )}
                          <span className="[font-family:'Montserrat_Alternates',Helvetica]">Mon Profil</span>
                        </motion.div>
                      </Link>
                      <Link to="/mes-reservations">
                        <motion.div
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3 px-6 py-3 text-white hover:bg-[#2C8DB0]/10"
                        >
                          <CalendarIcon className="w-4 h-4" />
                          <span className="[font-family:'Montserrat_Alternates',Helvetica]">Mes Réservations</span>
                        </motion.div>
                      </Link>
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-3 px-6 py-3 text-white hover:bg-[#2C8DB0]/10 cursor-pointer"
                        onClick={handleSignOut}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        <span className="[font-family:'Montserrat_Alternates',Helvetica]">Déconnexion</span>
                      </motion.div>
                    </>
                  ) : (
                    <Link to="/login">
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-3 px-6 py-3 text-white hover:bg-[#2C8DB0]/10"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span className="[font-family:'Montserrat_Alternates',Helvetica]">Connexion</span>
                      </motion.div>
                    </Link>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  );
};