import {
  BrainCircuit,
  ScanEye,
  Zap,
  ShieldPlus,
  Heart,
  Dna,
} from "lucide-react";
import { useState, useEffect, useRef, useTransition } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { SparklesPreview } from "../../components/SparklesPreview";
import { InfiniteMovingCards } from "../../components/ui/infinite-moving-cards";
import { Link } from "react-router-dom";
import { getTestimonials } from "../../lib/testimonials";
import { EnhancementModal } from "../../components/ui/enhancement-modal";

const enhancementCards = [
  {
    title: "Améliorations Neurales",
    description: "Augmentez vos capacités cognitives avec notre interface neurale de pointe. Connectez votre cerveau directement aux systèmes numériques pour une expérience sans précédent. Traitez l'information à la vitesse de la pensée et exploitez pleinement votre potentiel cognitif.",
    videoUrl: "https://player.vimeo.com/external/451837085.sd.mp4?s=beee37bfea495d2ec2bb31c54c81f57822f7f35f&profile_id=164&oauth2_token_id=57447761",
    icon: <BrainCircuit className="w-[90px] h-[90px] card-icon stroke-[0.5px] relative z-10" />,
  },
  {
    title: "Vision Augmentée",
    description: "Découvrez une nouvelle dimension de la vision avec nos implants oculaires avancés. Voyez au-delà du spectre visible, zoomez à volonté et enregistrez chaque instant en haute définition. Une révolution visuelle qui transformera votre perception du monde.",
    videoUrl: "https://player.vimeo.com/external/477721941.sd.mp4?s=e4e6e3c133d96a11679f6ab1e0528d0a68f6b8e9&profile_id=164&oauth2_token_id=57447761",
    icon: <ScanEye className="w-[90px] h-[90px] card-icon stroke-[0.5px] relative z-10" />,
  },
  {
    title: "Performance Physique",
    description: "Transcendez vos limites physiques grâce à nos améliorations biomécaniques. Augmentez votre force, votre endurance et vos réflexes au-delà des capacités humaines normales. Devenez la meilleure version de vous-même.",
    videoUrl: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761",
    icon: <Zap className="w-[90px] h-[90px] card-icon stroke-[0.5px] relative z-10" />,
  },
  {
    title: "Protection Avancée",
    description: "Assurez votre sécurité avec notre système de défense dermique révolutionnaire. Une protection invisible mais impénétrable contre les menaces physiques, tout en préservant votre sensibilité tactile naturelle.",
    videoUrl: "https://player.vimeo.com/external/438453069.sd.mp4?s=f42f4b0be0037b2b9f3c1c95b2c37876dd517f75&profile_id=164&oauth2_token_id=57447761",
    icon: <ShieldPlus className="w-[90px] h-[90px] card-icon stroke-[0.5px] relative z-10" />,
  },
  {
    title: "Améliorations Organiques",
    description: "Optimisez vos organes vitaux avec nos implants bioniques de dernière génération. Améliorez l'efficacité de votre système cardiovasculaire, respiratoire et digestif pour une santé et des performances optimales.",
    videoUrl: "https://player.vimeo.com/external/370467553.sd.mp4?s=96de8b923370fb7fa8616d4e0b74ee9c4ba5576f&profile_id=164&oauth2_token_id=57447761",
    icon: <Heart className="w-[90px] h-[90px] card-icon stroke-[0.5px] relative z-10" />,
  },
  {
    title: "Évolution Génétique",
    description: "Prenez le contrôle de votre code génétique avec notre technologie d'édition génomique avancée. Corrigez les imperfections, renforcez votre immunité et débloquez votre véritable potentiel génétique.",
    videoUrl: "https://player.vimeo.com/external/449253665.sd.mp4?s=d2a3339cd6145b8672b02ab6ea43817f22e606b2&profile_id=164&oauth2_token_id=57447761",
    icon: <Dna className="w-[90px] h-[90px] card-icon stroke-[0.5px] relative z-10" />,
  },
];

export const LandingPage = (): JSX.Element => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const cardsRef = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -150]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { success, testimonials: fetchedTestimonials } = await getTestimonials();
      if (success && fetchedTestimonials) {
        setTestimonials(fetchedTestimonials);
      }
    };

    fetchTestimonials();
  }, []);

  const handleCardClick = (index: number) => {
    startTransition(() => {
      setSelected(index);
    });
  };

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardsRef.current.findIndex(
            (ref) => ref === entry.target
          );
          if (entry.isIntersecting && !visibleCards.includes(index)) {
            setVisibleCards((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const cardVariants = {
    hidden: {
      opacity: 0,
      boxShadow:
        "0px 0px 0px rgba(152, 152, 152, 0.9), 0px 0px 0px rgba(255, 255, 255, 0.9)",
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      boxShadow:
        "15px 15px 38px rgba(152, 152, 152, 0.9), -15px -15px 30px rgba(255, 255, 255, 0.9), 15px -15px 30px rgba(152, 152, 152, 0.2), -15px 15px 30px rgba(152, 152, 152, 0.2)",
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="bg-[#d9d9d9] flex flex-row justify-center w-full">
      <div className="bg-[#d9d9d9] overflow-hidden w-full relative">
        <Navigation isNavVisible={!isNavVisible} toggleNav={toggleNav} />

        <div className="w-full h-screen bg-black">
          <motion.div
            ref={heroRef}
            className="w-full h-full relative overflow-hidden"
            style={{ y }}
          >
            <SparklesPreview />
            <video
              className="absolute brightness-75 top-0 left-0 w-full h-full object-cover z-0"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/video_header.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>

        <section className="flex flex-col py-32 bg-[#f0eded]">
          <motion.h2
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto text-5xl font-semibold [font-family:'Montserrat_Alternates',Helvetica] text-transparent bg-clip-text bg-gradient-to-r from-[#2C8DB0] via-[#66AEDD] to-[#003366] mb-6"
          >
            Nos Améliorations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-lg mx-auto text-[#443f3f] font-normal [font-family:'Montserrat_Alternates',Helvetica] max-w-[688px]"
          >
            Explorez nos différentes catégories d&apos;améliorations
            cybernétiques pour transcender vos limites humaines
          </motion.p>
        </section>

        <section className="px-8 bg-[#f0eded]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1173px] mx-auto">
            {enhancementCards.map((card, index) => (
              <motion.button
                key={index}
                ref={(el) =>
                  (cardsRef.current[index] = el as HTMLButtonElement)
                }
                onClick={() => handleCardClick(index)}
                onMouseMove={handleMouseMove}
                variants={cardVariants}
                initial="hidden"
                animate={visibleCards.includes(index) ? "visible" : "hidden"}
                className="cursor-glow h-[418px] bg-[#222222] rounded-[25px] cursor-pointer overflow-hidden transition-shadow duration-300"
              >
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate={visibleCards.includes(index) ? "visible" : "hidden"}
                  className="flex items-center justify-center h-full p-8"
                >
                  {card.icon}
                </motion.div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mt-32 px-8 overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center text-5xl font-semibold [font-family:'Montserrat_Alternates',Helvetica] text-transparent bg-clip-text bg-gradient-to-r from-[#2C8DB0] via-[#66AEDD] to-[#003366] mb-6"
          >
            Les Avis de nos clients
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-lg text-[#443f3f] font-normal [font-family:'Montserrat_Alternates',Helvetica] max-w-[688px] mx-auto mb-16"
          >
            Découvrez les expériences de ceux qui ont déja franchi le pas vers
            l&apos;humanité augmentée
          </motion.p>

          <div className="relative">
            <InfiniteMovingCards
              items={testimonials.map((t) => ({
                quote: t.quote,
                name: t.name,
                title: t.title,
              }))}
              direction="left"
              speed="slow"
            />
          </div>
        </section>

        <section className="mt-32 px-8 mb-32">
          <Card className="max-w-[1173px] mx-auto bg-[#d9d9d9] rounded-[25px] shadow-[15px_15px_38px_#989898e6,-15px_-15px_30px_#ffffffe6,15px_-15px_30px_#98989833,-15px_15px_30px_#98989833,inset_-1px_-1px_2px_#98989880,inset_1px_1px_2px_#ffffff4c]">
            <CardContent className="p-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                  <h2 className="text-4xl font-semibold mb-6 [font-family:'Montserrat_Alternates',Helvetica]">
                    Prêt à transcander vos{" "}
                    <span className="text-[#2C8DB0]">Limites Humaines</span> ?
                  </h2>
                  <p className="text-xl text-[#443f3f] [font-family:'Montserrat_Alternates',Helvetica]">
                    Réservez une consultation gratuite avec nos experts pour
                    découvrir les améliorations adaptées à vos besoins.
                  </p>
                </div>
                <Link to="/reservation">
                  <Button className="w-[250px] h-[60px] text-xl font-normal [font-family:'Montserrat_Alternates',Helvetica] bg-[#d9d9d9] text-[#2C3E50] shadow-[5px_5px_13px_#a3a3a3e6,-5px_-5px_10px_#ffffffe6,5px_-5px_10px_#a3a3a333,-5px_5px_10px_#a3a3a333] hover:shadow-[0_0_20px_rgba(44,141,176,0.3)] hover:bg-[#d9d9d9] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#2C8DB0] hover:via-[#66AEDD] hover:to-[#003366] transition-all duration-300">
                    Réserver maintenant
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {selected !== null && (
          <EnhancementModal
            isOpen={selected !== null}
            onClose={() => setSelected(null)}
            title={enhancementCards[selected].title}
            description={enhancementCards[selected].description}
            videoUrl={enhancementCards[selected].videoUrl}
          />
        )}

        <Footer />
      </div>
    </div>
  );
};