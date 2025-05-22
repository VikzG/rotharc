import { Product } from '../types';

export const products: Product[] = [
  {
    id: "neuro-link-pro",
    name: "NeuroLink Pro",
    category: "Neural",
    subCategory: "Interface",
    price: 4999,
    description: "Le NeuroLink Pro est notre interface neurale de pointe, permettant une connexion directe entre votre cerveau et les systèmes numériques. Avec une bande passante de 10 Tbps et une latence inférieure à 0,5 ms, cette amélioration vous permet de naviguer dans les données, de contrôler des appareils et d'accéder à l'information à la vitesse de la pensée. L'installation est minimalement invasive et réalisée par nos chirurgiens certifiés.",
    shortDescription: "Interface neurale haute performance pour une connexion directe cerveau-machine.",
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.8,
    reviewCount: 124,
    features: [
      "Connexion neurale directe",
      "Bande passante de 10 Tbps",
      "Latence inférieure à 0,5 ms",
      "Filtres de confidentialité intégrés",
      "Mise à jour sans fil",
      "Garantie à vie"
    ],
    compatibility: ["Tous systèmes d'exploitation", "Réalité augmentée", "Réalité virtuelle"],
    isNew: true,
    isFeatured: true
  },
  {
    id: "ocular-x2",
    name: "Ocular X2",
    category: "Sensoriel",
    subCategory: "Vision",
    price: 3499,
    description: "Les implants Ocular X2 remplacent ou augmentent vos yeux naturels avec une technologie de pointe offrant une vision 20 fois supérieure à la normale. Capables de voir dans le spectre infrarouge et ultraviolet, avec zoom optique 50x et enregistrement vidéo 16K. L'interface utilisateur intégrée vous permet de contrôler les paramètres visuels par simple pensée.",
    shortDescription: "Implants oculaires avancés avec vision améliorée et fonctionnalités étendues.",
    imageUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    reviewCount: 208,
    features: [
      "Vision 20x supérieure",
      "Spectre infrarouge et ultraviolet",
      "Zoom optique 50x",
      "Enregistrement vidéo 16K",
      "Interface de contrôle neural",
      "Résistant à l'eau et aux chocs"
    ],
    compatibility: ["NeuroLink Pro", "Systèmes de réalité augmentée"],
    isNew: false,
    isFeatured: true
  },
  {
    id: "derma-shield",
    name: "DermaShield",
    category: "Défense",
    subCategory: "Peau",
    price: 2899,
    description: "DermaShield est un remplacement dermique avancé qui renforce votre peau naturelle avec une couche de nano-fibres de carbone et de polymères réactifs. Offrant une résistance accrue aux coupures, brûlures et impacts, tout en conservant la sensation tactile naturelle. La version premium inclut une régulation thermique active et une capacité d'auto-réparation pour les dommages mineurs.",
    shortDescription: "Remplacement dermique offrant protection et résistance tout en préservant le toucher naturel.",
    imageUrl: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.6,
    reviewCount: 87,
    features: [
      "Résistance aux coupures et impacts",
      "Protection contre les brûlures",
      "Sensation tactile préservée",
      "Régulation thermique",
      "Auto-réparation des dommages mineurs",
      "Personnalisation esthétique disponible"
    ],
    compatibility: ["Tous types corporels", "Compatible avec autres améliorations"],
    isNew: false,
    isFeatured: false
  },
  {
    id: "reflex-boost",
    name: "Reflex Boost",
    category: "Performance",
    subCategory: "Réflexes",
    price: 5999,
    description: "Reflex Boost est notre amélioration neuromusculaire phare, augmentant vos temps de réaction jusqu'à 300%. Cette modification reconfigure les connexions entre votre système nerveux et vos muscles, permettant des mouvements plus rapides et plus précis que jamais. Idéal pour les athlètes, les forces de sécurité ou toute personne souhaitant des capacités physiques surhumaines.",
    shortDescription: "Amélioration neuromusculaire réduisant drastiquement votre temps de réaction.",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.7,
    reviewCount: 156,
    features: [
      "Temps de réaction réduit de 300%",
      "Précision de mouvement accrue",
      "Modes d'activation personnalisables",
      "Système anti-fatigue intégré",
      "Compatibilité avec implants musculaires",
      "Garantie de performance"
    ],
    compatibility: ["NeuroLink Pro", "Implants musculaires", "Systèmes d'endurance"],
    isNew: true,
    isFeatured: true
  },
  {
    id: "memory-matrix",
    name: "Memory Matrix",
    category: "Cognitif",
    subCategory: "Mémoire",
    price: 7999,
    description: "Memory Matrix est une amélioration cognitive révolutionnaire qui étend votre capacité mémorielle de façon exponentielle. Grâce à un réseau de nano-processeurs neuraux, vous pouvez stocker, organiser et récupérer des informations avec une précision parfaite. Idéal pour les professionnels, chercheurs ou étudiants, cet implant vous permet également de sauvegarder vos souvenirs et de les revivre avec une clarté cristalline.",
    shortDescription: "Extension mémorielle permettant un stockage et une récupération parfaite des informations.",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    reviewCount: 92,
    features: [
      "Capacité mémorielle quasi-illimitée",
      "Récupération instantanée des informations",
      "Organisation automatique des souvenirs",
      "Sauvegarde sécurisée des données",
      "Partage de mémoire (avec consentement)",
      "Protection contre la dégénérescence neurale"
    ],
    compatibility: ["NeuroLink Pro", "Systèmes cognitifs avancés"],
    isNew: true,
    isFeatured: true
  },
  {
    id: "cardio-prime",
    name: "Cardio Prime",
    category: "Organique",
    subCategory: "Cardiovasculaire",
    price: 8999,
    description: "Cardio Prime est un remplacement cardiaque synthétique de dernière génération, offrant des performances supérieures au cœur humain naturel. Fabriqué à partir de tissus cultivés et de composants synthétiques, ce cœur amélioré pompe le sang plus efficacement, régule automatiquement son rythme selon vos besoins et résiste aux maladies cardiovasculaires. Sa durée de vie estimée dépasse 150 ans avec un entretien minimal.",
    shortDescription: "Cœur synthétique avancé offrant performances supérieures et longévité exceptionnelle.",
    imageUrl: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.6,
    reviewCount: 64,
    features: [
      "Efficacité de pompage 200%",
      "Auto-régulation selon l'activité",
      "Résistance aux maladies cardiovasculaires",
      "Monitoring continu de la santé",
      "Durée de vie estimée: 150+ ans",
      "Maintenance minimale requise"
    ],
    compatibility: ["Systèmes sanguins améliorés", "Implants pulmonaires"],
    isNew: false,
    isFeatured: false
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isFeatured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.isNew);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};