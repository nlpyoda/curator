import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, Image, PanResponder, Vibration, Easing, Platform, useWindowDimensions } from 'react-native';


// For trendy, minimalist color palette
const COLORS = {
  primary: '#121212',       // Instagram-like dark theme
  secondary: '#262626',     // Secondary dark
  accent1: '#0095F6',       // Instagram blue
  accent2: '#833AB4',       // Instagram purple (from gradient)
  accent3: '#FD1D1D',       // Instagram red/pink (from gradient)
  accent4: '#FCAF45',       // Instagram yellow/orange (from gradient)
  light: '#FFFFFF',         // White
  lightGray: '#FAFAFA',     // Instagram background gray
  midGray: '#8e8e8e',       // Instagram caption gray
  darkGray: '#262626',      // Dark text
  glassBg: 'rgba(255,255,255,0.8)',
  highlight: '#EFEFEF',     // Instagram highlight
  border: '#DBDBDB',        // Instagram border
  // Added for AI Curation form consistency
  background: '#FFFFFF', // Assuming a light theme for the form page itself
  text: '#1A1A1A', // Primary text color
  textInputBackground: '#F8F8F8',
  card: '#FFFFFF',
  shadow: '#000000',
  buttonPrimaryText: '#FFFFFF', // Text color for primary buttons
  error: '#FF3B30', // New error color
  textSecondary: '#666666', // New secondary text color
  primaryPeachy: '#FFA07A', // New peachy accent
  primaryPeachyDark: '#FF8C69', // New darker peachy accent
  borderLight: '#E8E8E8', // New light border color
};

// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') {
    console.warn('hexToRgba received invalid hex value:', hex);
    return `rgba(0, 0, 0, ${alpha || 0})`;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper function to lighten or darken a color
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100, 10);
  G = parseInt(G * (100 + percent) / 100, 10);
  B = parseInt(B * (100 + percent) / 100, 10);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16));

  return `#${RR}${GG}${BB}`;
};

// Mock data for testing
const mockProducts = [
  {
    id: '1',
    title: 'Dyson Supersonic™ Hair Dryer',
    brand: 'Dyson',
    priceRange: [399, 429],
    category: 'haircare',
    tags: ['premium', 'tech', 'beauty'],
    images: [
      'https://images.unsplash.com/photo-1620331317314-530796315638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', // Placeholder if original fails
      // ... other images
    ],
    rating: 4.9,
    description: 'Fast drying. No extreme heat. Engineered for different hair types.',
    whyBuyThis: 'Top-tier haircare tech. Protects hair while drying fast. Iconic. ✨',
    affiliateUrl: 'https://www.dyson.com/hair-care/hair-dryers/supersonic'
  },
  // ... other mock products
];


// Persona definitions
const personas = [
  {
    id: 'trendsetter',
    name: 'The Trendsetter',
    icon: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', // New stylish person
    description: 'Always ahead of the curve, seeks stylish, innovative, and often premium products. Values aesthetics and being an early adopter.',
    color: '#EF4444', // Red
  },
  {
    id: 'optimizer',
    name: 'The Productivity Optimizer',
    icon: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces', // New focused person
    description: 'Focuses on efficiency, performance, and tools that enhance workflow. Values quality, reliability, and time-saving features.',
    color: '#06B6D4', // Cyan
  },
  {
    id: 'conscious',
    name: 'The Conscious Consumer',
    icon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', // New thoughtful person
    description: 'Prioritizes sustainability, ethical sourcing, and minimalist design. Values durability, natural materials, and brands with a positive impact.',
    color: '#10B981', // Emerald
  },
  {
    id: 'student', // Kept 'student' id for consistency with student-pick tags
    name: 'The Budget Savvy Student',
    icon: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop&crop=faces', // Existing student group image
    description: 'Looks for the best value, practical items for study and campus life, and enjoys student discounts and deals.',
    color: '#8B5CF6', // Purple
  },
];

// Life Moments definitions
const lifeMoments = [
  {
    id: 'new-arrival',
    name: 'Welcoming a New Arrival',
    icon: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop',
    description: 'Essential items for new parents and creating a nurturing environment for your little one.',
    color: '#F8BBD0', // Soft pink
  },
  {
    id: 'career-launch',
    name: 'Embarking on a Career',
    icon: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    description: 'Professional gear and essentials for starting a new job or advancing your career.',
    color: '#1E88E5', // Professional blue
  },
  {
    id: 'sanctuary',
    name: 'Creating a Sanctuary',
    icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
    description: 'Transform your space into a comfortable, stylish haven that reflects your personality.',
    color: '#7E57C2', // Elegant purple
  },
  {
    id: 'golden-years',
    name: 'Embracing Golden Years',
    icon: 'https://images.unsplash.com/photo-1559137200-670cc1ec5ba9?w=100&h=100&fit=crop',
    description: 'Products for comfort, new hobbies, and embracing life\'s next adventure with grace.',
    color: '#FF7043', // Warm orange
  },
  {
    id: 'gamer-setup',
    name: 'The Ultimate Gamer Setup',
    icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
    description: 'Build the ultimate gaming station with premium gear for peak performance and immersion.',
    color: '#00E676', // Electric green
  },
  {
    id: 'sustainable-living',
    name: 'Sustainable Living Refresh',
    icon: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop',
    description: 'Eco-friendly choices that reduce your footprint while enhancing your lifestyle.',
    color: '#4CAF50', // Earth green
  },
  {
    id: 'wellness-retreat',
    name: 'Weekend Wellness Retreat',
    icon: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    description: 'Self-care essentials for relaxation, mindfulness, and personal rejuvenation.',
    color: '#9C27B0', // Wellness purple
  },
  {
    id: 'perfect-hosting',
    name: 'Hosting the Perfect Gathering',
    icon: 'https://images.unsplash.com/photo-1529543638269-d38c4d5a0d35?w=100&h=100&fit=crop',
    description: 'Everything you need to create memorable experiences for friends and family.',
    color: '#FF5722', // Festive orange-red
  },
];

// Add trending products for life moments
const trendingByLifeMoment = {
  'new-parent': [
    {
      id: 'trend-np-1',
      title: 'UPPAbaby VISTA V2 Stroller',
      price: 999.99,
      rating: 4.9,
      description: 'Expandable stroller system with premium features and multiple configurations.',
      link: 'https://uppababy.com',
      tags: ['baby', 'stroller', 'premium', 'newborn'],
      category: 'baby',
      whyBuy: 'The gold standard for growing families with exceptional build quality and versatility.',
      insights: [
        { label: 'Quality', value: 97, color: '#FF5757' },
        { label: 'Versatility', value: 95, color: '#32D74B' },
        { label: 'Ease of Use', value: 90, color: '#4E7CFF' },
        { label: 'Value', value: 82, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-np-2',
      title: 'Snoo Smart Bassinet',
      price: 1495,
      rating: 4.7,
      description: 'Smart bassinet that automatically responds to your baby to improve sleep.',
      link: 'https://www.happiestbaby.com',
      tags: ['baby', 'bassinet', 'smart', 'premium', 'sleep'],
      category: 'baby',
      whyBuy: 'Helps babies sleep longer with responsive technology that mimics the womb.',
      insights: [
        { label: 'Sleep Tech', value: 98, color: '#FF5757' },
        { label: 'Design', value: 95, color: '#32D74B' },
        { label: 'Safety', value: 96, color: '#4E7CFF' },
        { label: 'Value', value: 75, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-np-3',
      title: 'Owlet Smart Sock Plus',
      price: 299,
      rating: 4.6,
      description: 'Tracks baby\'s oxygen and heart rate while they sleep, with notifications.',
      link: 'https://owletcare.com',
      tags: ['baby', 'monitor', 'smart', 'health', 'sleep'],
      category: 'baby',
      whyBuy: 'Peace of mind for anxious parents with medical-grade monitoring technology.',
      insights: [
        { label: 'Accuracy', value: 93, color: '#FF5757' },
        { label: 'Ease of Use', value: 88, color: '#32D74B' },
        { label: 'Battery Life', value: 85, color: '#4E7CFF' },
        { label: 'Value', value: 83, color: '#BF5AF2' }
      ]
    }
  ],
  'graduation': [
    {
      id: 'trend-grad-1',
      title: 'iPad Air 11"',
      price: 599,
      rating: 4.8,
      description: 'Powerful and versatile tablet with M1 chip for productivity and creative work.',
      link: 'https://www.apple.com/ipad-air',
      tags: ['tech', 'tablet', 'gift', 'premium', 'productivity'],
      category: 'electronics',
      whyBuy: 'Perfect balance of power and portability for college or new job tasks.',
      insights: [
        { label: 'Performance', value: 92, color: '#FF5757' },
        { label: 'Portability', value: 95, color: '#32D74B' },
        { label: 'Display', value: 94, color: '#4E7CFF' },
        { label: 'Value', value: 86, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-grad-2',
      title: 'Bose QC Ultra Headphones',
      price: 429,
      rating: 4.7,
      description: 'Premium noise cancelling headphones with spatial audio and excellent comfort.',
      link: 'https://www.bose.com',
      tags: ['audio', 'noise-cancelling', 'premium', 'gift'],
      category: 'audio',
      whyBuy: 'Best-in-class noise cancellation perfect for focusing in shared spaces.',
      insights: [
        { label: 'Sound Quality', value: 96, color: '#FF5757' },
        { label: 'Noise Cancelling', value: 98, color: '#32D74B' },
        { label: 'Comfort', value: 95, color: '#4E7CFF' },
        { label: 'Battery Life', value: 90, color: '#BF5AF2' }
      ]
    }
  ],
  'home-setup': [
    {
      id: 'trend-home-1',
      title: 'Herman Miller Aeron Chair',
      price: 1695,
      rating: 4.9,
      description: 'Ergonomic office chair with adjustable posture support and breathable mesh.',
      link: 'https://www.hermanmiller.com',
      tags: ['office', 'chair', 'ergonomic', 'premium', 'comfort'],
      category: 'furniture',
      whyBuy: 'The gold standard for ergonomic seating, essential for all-day comfort.',
      insights: [
        { label: 'Comfort', value: 96, color: '#FF5757' },
        { label: 'Durability', value: 97, color: '#32D74B' },
        { label: 'Adjustability', value: 95, color: '#4E7CFF' },
        { label: 'Value', value: 80, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-home-2',
      title: 'LG 34" UltraWide Monitor',
      price: 799,
      rating: 4.7,
      description: 'Ultra-wide curved monitor with high resolution for immersive multitasking.',
      link: 'https://www.lg.com',
      tags: ['monitor', 'tech', 'productivity', 'premium'],
      category: 'electronics',
      whyBuy: 'Significantly boosts productivity with screen space for multiple applications.',
      insights: [
        { label: 'Display Quality', value: 93, color: '#FF5757' },
        { label: 'Screen Size', value: 96, color: '#32D74B' },
        { label: 'Connectivity', value: 90, color: '#4E7CFF' },
        { label: 'Value', value: 87, color: '#BF5AF2' }
      ]
    }
  ],
  'travel-prep': [
    {
      id: 'trend-travel-1',
      title: 'Away The Medium Suitcase',
      price: 345,
      rating: 4.8,
      description: 'Durable hardside suitcase with 360° spinner wheels and built-in battery.',
      link: 'https://www.awaytravel.com',
      tags: ['travel', 'luggage', 'premium', 'portable'],
      category: 'travel',
      whyBuy: 'Perfect checked luggage size with thoughtful features and lifetime warranty.',
      insights: [
        { label: 'Durability', value: 94, color: '#FF5757' },
        { label: 'Design', value: 96, color: '#32D74B' },
        { label: 'Features', value: 92, color: '#4E7CFF' },
        { label: 'Value', value: 88, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-travel-2',
      title: 'Apple AirTag (4 Pack)',
      price: 99,
      rating: 4.7,
      description: 'Precision finding devices to track and locate your important items.',
      link: 'https://www.apple.com/airtag',
      tags: ['travel', 'tech', 'accessories', 'tracking'],
      category: 'electronics',
      whyBuy: 'Peace of mind for all your valuable luggage and items when traveling.',
      insights: [
        { label: 'Tracking Accuracy', value: 95, color: '#FF5757' },
        { label: 'Battery Life', value: 90, color: '#32D74B' },
        { label: 'Ecosystem', value: 98, color: '#4E7CFF' },
        { label: 'Value', value: 85, color: '#BF5AF2' }
      ]
    }
  ]
};

// Add mood board aesthetics and social bundles to the top level data
const moodBoards = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    emoji: '◻️',
    color: '#000000',
    cursiveDescription: 'where less becomes more, and silence speaks volumes',
    philosophyText: 'The art of intentional living through curated simplicity',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(40,40,40,0.8))'
  },
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    emoji: '🌿',
    color: '#6B8E23',
    cursiveDescription: 'embracing the gentle rhythm of nature\'s timeless embrace',
    philosophyText: 'Romantic nostalgia meets sustainable living in perfect harmony',
    coverImage: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(107,142,35,0.7), rgba(85,107,47,0.8))'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '⚡',
    color: '#FF0080',
    cursiveDescription: 'future noir aesthetics dancing with neon dreams',
    philosophyText: 'High-tech rebellion meets dark urban sophistication',
    coverImage: 'https://images.unsplash.com/photo-1518709414923-fcf25c3432c1?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(255,0,128,0.8), rgba(128,0,255,0.7))'
  },
  {
    id: 'clean-girl',
    name: 'Clean Girl',
    emoji: '✨',
    color: '#F5F5DC',
    cursiveDescription: 'effortless beauty in its most authentic, radiant form',
    philosophyText: 'Understated elegance that celebrates natural confidence',
    coverImage: 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(245,245,220,0.9), rgba(250,240,230,0.8))'
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    emoji: '📚',
    color: '#8B4513',
    cursiveDescription: 'intellectual romance wrapped in ivy-covered mystery',
    philosophyText: 'Scholarly elegance meets gothic sophistication',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(139,69,19,0.8), rgba(85,60,42,0.9))'
  },
  {
    id: 'soft-luxury',
    name: 'Soft Luxury',
    emoji: '🤍',
    color: '#F8F6F0',
    cursiveDescription: 'whispered opulence in textures that embrace the soul',
    philosophyText: 'Refined indulgence through tactile elegance and muted grandeur',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(248,246,240,0.95), rgba(240,235,225,0.9))'
  }
];

const socialBundles = [
  {
    id: 'travel-essentials',
    title: 'Travel Essentials',
    creator: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format',
      verified: true
    },
    likes: 3426,
    saves: 874,
    products: [
      mockProducts[7], // Sony Headphones
      trendingByLifeMoment['travel-prep'][0], // Away Suitcase
      trendingByLifeMoment['travel-prep'][1] // Apple AirTag
    ],
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500&auto=format'
  },
  {
    id: 'wfh-setup',
    title: 'Dream WFH Setup',
    creator: {
      name: 'Mia Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format',
      verified: true
    },
    likes: 5218,
    saves: 1284,
    products: [
      mockProducts[0], // MacBook Pro
      trendingByLifeMoment['home-setup'][0], // Herman Miller chair
      trendingByLifeMoment['home-setup'][1] // LG Monitor
    ],
    coverImage: 'https://images.unsplash.com/photo-1605565348518-bef3e7d6fed8?q=80&w=500&auto=format'
  },
  {
    id: 'new-parent',
    title: 'New Parent Starter Pack',
    creator: {
      name: 'Taylor Wilson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format',
      verified: false
    },
    likes: 2189,
    saves: 956,
    products: [
      trendingByLifeMoment['new-parent'][0], // Stroller
      trendingByLifeMoment['new-parent'][1], // Bassinet
      trendingByLifeMoment['new-parent'][2] // Baby monitor
    ],
    coverImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=500&auto=format'
  }
];

// Add missing openExternalLink function
const openExternalLink = (url) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// Add trending data for TrendRadar
const trendRadarData = [
  {
    id: 1,
    title: 'Sony WH-1000XM5',
    category: 'ELECTRONICS',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop&crop=center', // Actual Sony headphones image
    trendChange: '↗ 28%',
    isViral: true,
    brandUrl: 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-l?mg=shopping&gad_source=1&gad_campaignid=22224130485&gbraid=0AAAAABiDjZjIa5DKjAugccBx3T6KuLFCb&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGWew3GWTaHne6281N8_BDpE5qZdrbJcIgxWOT5Uz-yy9oisBKpJKBRoCdkgQAvD_BwE&gclsrc=aw.ds'
  },
  {
    id: 2,
    title: 'Dyson Air Purifier',
    category: 'HOME',
    image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/air-treatment/purifiers/hp07/dyson-purifier-hot-cool-hp07-black-nickel-hero-01.png?wid=600&hei=600&fmt=png-alpha', // Official Dyson product image
    trendChange: '↗ 16%',
    isViral: false,
    brandUrl: 'https://www.dyson.com/air-treatment/air-purifier-heaters/purifier-hot-cool-hp07/black-nickel'
  },
  {
    id: 3,
    title: 'Away Luggage',
    category: 'TRAVEL',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&crop=center',
    trendChange: '↗ 45%',
    isViral: true
    // No brandUrl - will search for product instead of direct link
  },
  {
    id: 4,
    title: 'Kindle Paperwhite',
    category: 'READING',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center',
    trendChange: '↗ 12%',
    isViral: false,
    brandUrl: 'https://www.amazon.com/kindle-paperwhite/dp/B08KTZ8249'
  }
];

// Product categories for visual entry points
const productCategories = [
  {
    id: 'tech',
    name: 'Technology',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
    color: '#6366F1',
    description: 'innovation meets intentional design'
  },
  {
    id: 'audio',
    name: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    color: '#8B5CF6',
    description: 'sound engineered for the discerning ear'
  },
  {
    id: 'home',
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    color: '#06B6D4',
    description: 'spaces that nurture the soul'
  },
  {
    id: 'travel',
    name: 'Travel',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop',
    color: '#10B981',
    description: 'wanderlust essentials for the mindful explorer'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
    color: '#F59E0B',
    description: 'wellness tools for the devoted practitioner'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
    color: '#EF4444',
    description: 'ritual essentials for authentic self-care'
  },
];

// InsightBar component for visualizing product metrics
const InsightBar = ({ label, value, color }) => {
  return (
    <View style={styles.insightContainer}>
      <Text style={styles.insightLabel}>{label}</Text>
      <View style={styles.insightBarBackground}>
        <View 
          style={[
            styles.insightBarFill, 
            { width: `${value}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.insightValue}>{value}</Text>
    </View>
  );
};

// Product Preview simulation
const ProductPreviewOverlay = ({ product, visible, onClose }) => {
  const [previewStatus, setPreviewStatus] = useState('loading'); // 'loading', 'ready', 'error'
  
  // Preview images based on product category
  const getCategoryPreviewImage = (category) => {
    switch(category) {
      case 'laptop':
        return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format';
      case 'baby':
        return 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format';
      case 'wearables':
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format';
      case 'audio':
        return 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&auto=format';
      default:
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format';
    }
  };
  
  useEffect(() => {
    if (visible) {
      setPreviewStatus('loading');
      // Simulate loading preview
      setTimeout(() => {
        setPreviewStatus('ready');
      }, 800);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <View style={styles.previewOverlay}>
      <View style={styles.previewContent}>
        <Text style={styles.previewTitle}>
          {previewStatus === 'loading' ? 'Loading Preview...' : 
           previewStatus === 'ready' ? 'Product Preview' : 
           'Preview Unavailable'}
        </Text>
        
        <View style={styles.previewImageContainer}>
          {previewStatus === 'loading' ? (
            <View style={styles.previewLoading}>
              <Text style={styles.previewLoadingText}>Preparing preview...</Text>
            </View>
          ) : previewStatus === 'ready' ? (
            <>
              <Image 
                source={{ uri: getCategoryPreviewImage(product.category) }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <View style={styles.previewProductInfo}>
                <Text style={styles.previewProductTitle}>{product.title}</Text>
                <Text style={styles.previewProductPrice}>${product.price}</Text>
              </View>
            </>
          ) : (
            <View style={styles.previewError}>
              <Text style={styles.previewErrorEmoji}>⚠️</Text>
              <Text style={styles.previewErrorText}>
                Unable to load preview. Please try again.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.previewActions}>
          <TouchableOpacity 
            style={styles.previewCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.previewCloseText}>Close</Text>
          </TouchableOpacity>
          
          {previewStatus === 'ready' && (
            <TouchableOpacity 
              style={styles.previewBuyButton}
              onPress={() => {
                onClose();
                setTimeout(() => openExternalLink(product.link), 300);
              }}
            >
              <Text style={styles.previewBuyText}>Buy Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Add WebXR AR integration
const WebXRARViewer = ({ product, visible, onClose }) => {
  const [arSupported, setArSupported] = useState(false);
  const [arStatus, setArStatus] = useState('checking'); // 'checking', 'supported', 'unsupported', 'running'
  const arContainerRef = useRef(null);
  
  // Check for WebXR support on component mount
  useEffect(() => {
    if (visible) {
      checkARSupport();
    }
  }, [visible]);
  
  // Check if AR is supported on this device/browser
  const checkARSupport = () => {
    setArStatus('checking');
    
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => {
          setArSupported(supported);
          setArStatus(supported ? 'supported' : 'unsupported');
        })
        .catch(error => {
          console.error('Error checking AR support:', error);
          setArSupported(false);
          setArStatus('unsupported');
        });
    } else {
      setArSupported(false);
      setArStatus('unsupported');
    }
  };
  
  // Start AR session
  const startARSession = () => {
    if (!arSupported) return;
    
    setArStatus('running');
    
    // WebXR session initialization would go here
    // This requires Three.js or another WebGL library to handle the rendering
    // For demo purposes, we'll simulate the session
    
    // In a real implementation, you would:
    // 1. Create a WebGL context
    // 2. Initialize Three.js scene
    // 3. Request an immersive-ar session
    // 4. Set up the AR hit testing and model placement
    
    // For this demo, we'll just show a placeholder
    setTimeout(() => {
      alert('AR session would start here with a 3D model of the product.');
    }, 1000);
  };
  
  // Get appropriate model URL based on product category
  const getARModelURL = (category) => {
    // In a real app, these would be links to actual 3D models (.glb or .usdz files)
    switch(category) {
      case 'laptop':
        return 'https://example.com/models/laptop.glb';
      case 'baby':
        return 'https://example.com/models/baby_product.glb';
      case 'wearables':
        return 'https://example.com/models/watch.glb';
      case 'audio':
        return 'https://example.com/models/headphones.glb';
      default:
        return 'https://example.com/models/generic.glb';
    }
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.arOverlay}>
      <View style={styles.arContent}>
        <Text style={styles.arTitle}>
          {arStatus === 'checking' ? 'Checking AR Capability...' : 
           arStatus === 'supported' ? 'AR Ready' : 
           arStatus === 'running' ? 'AR Session Active' :
           'AR Not Supported'}
        </Text>
        
        <View 
          style={styles.arViewport}
          ref={arContainerRef}
        >
          {arStatus === 'checking' ? (
            <View style={styles.arLoading}>
              <Text style={styles.arLoadingText}>Initializing AR...</Text>
            </View>
          ) : arStatus === 'supported' ? (
            <View style={styles.arReadyContainer}>
              <Text style={styles.arEmoji}>
                {product.category === 'laptop' ? '💻' : 
                 product.category === 'baby' ? '👶' : 
                 product.category === 'wearables' ? '⌚' :
                 product.category === 'audio' ? '🎧' : '📱'}
              </Text>
              <Text style={styles.arMessage}>
                Your device supports AR. Tap Start to view {product.title} in your space.
              </Text>
              <TouchableOpacity 
                style={styles.arStartButton}
                onPress={startARSession}
              >
                <Text style={styles.arStartButtonText}>Start AR Experience</Text>
              </TouchableOpacity>
            </View>
          ) : arStatus === 'running' ? (
            <View style={styles.arActiveContainer}>
              <Text style={styles.arActiveText}>
                AR Session Active. Move your device to scan the environment.
              </Text>
            </View>
          ) : (
            <View style={styles.arUnsupportedContainer}>
              <Text style={styles.arErrorEmoji}>⚠️</Text>
              <Text style={styles.arErrorText}>
                AR is not supported on your device or browser. Try using the latest Chrome on Android or Safari on iOS.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.arActions}>
          <TouchableOpacity 
            style={styles.arCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.arCloseText}>Close AR</Text>
          </TouchableOpacity>
          
          {arStatus === 'supported' && (
            <TouchableOpacity 
              style={styles.arHelpButton}
              onPress={() => {
                alert('AR Help: Make sure you have good lighting and a clear space. Move your device around to let it scan the environment before placing objects.');
              }}
            >
              <Text style={styles.arHelpText}>AR Tips</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Add virtual try-on functionality for apparel
const VirtualTryOn = ({ product, visible, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Reset state when visibility changes
  useEffect(() => {
    if (!visible) {
      setSelectedImage(null);
      setProcessedImage(null);
      setError(null);
    }
  }, [visible]);
  
  // Handle file selection for try-on
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }
    
    // Create a preview URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setError(null);
    
    // In a real app, you would upload this to a server for processing
    // For demo, we'll simulate the process
    processImage(imageUrl);
  };
  
  // Simulate image processing for virtual try-on
  const processImage = (imageUrl) => {
    setProcessingImage(true);
    
    // In a real app, this would be an API call to an AI model
    // that overlays the product on the user's image
    setTimeout(() => {
      // For demo, we'll just return a mock processed image
      // In reality, this would come from a ML model that does virtual try-on
      setProcessedImage(getVirtualTryOnImage(product.category));
      setProcessingImage(false);
    }, 2000);
  };
  
  // Get a mock processed image for the demo
  const getVirtualTryOnImage = (category) => {
    // These would be actual processed images from the ML model
    // For demo, we're using static images
    switch(category) {
      case 'clothing':
        return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format';
      case 'shoes':
        return 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&auto=format';
      case 'accessories':
        return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format';
      default:
        return 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format';
    }
  };
  
  // Trigger file input click
  const selectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Take a photo using webcam (simplified for demo)
  const takePhoto = () => {
    alert('In a real app, this would open your camera to take a photo for virtual try-on.');
    // For demo, we'll just use a mock image
    setSelectedImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format');
    processImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format');
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.tryOnOverlay}>
      <View style={styles.tryOnContent}>
        <Text style={styles.tryOnTitle}>
          Virtual Try-On: {product.title}
        </Text>
        
        <View style={styles.tryOnWorkspace}>
          {!selectedImage ? (
            // Image selection UI
            <View style={styles.tryOnUploadArea}>
              <Text style={styles.tryOnInstructions}>
                Upload a photo or take a picture to see how this item looks on you.
              </Text>
              
              <View style={styles.tryOnButtonsRow}>
                <TouchableOpacity 
                  style={styles.tryOnButton}
                  onPress={selectImage}
                >
                  <Text style={styles.tryOnButtonText}>Upload Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.tryOnButton}
                  onPress={takePhoto}
                >
                  <Text style={styles.tryOnButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
              
              {error && (
                <Text style={styles.tryOnError}>{error}</Text>
              )}
              
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </View>
          ) : processingImage ? (
            // Processing indicator
            <View style={styles.tryOnProcessing}>
              <Text style={styles.tryOnProcessingText}>
                Processing your image...
              </Text>
              <View style={styles.tryOnLoader} />
            </View>
          ) : processedImage ? (
            // Display processed image with try-on
            <View style={styles.tryOnResult}>
              <Image 
                source={{ uri: processedImage }}
                style={styles.tryOnResultImage}
                resizeMode="contain"
              />
              <Text style={styles.tryOnResultCaption}>
                Here's how {product.title} looks on you!
              </Text>
              <View style={styles.tryOnActionRow}>
                <TouchableOpacity 
                  style={styles.tryOnShareButton}
                  onPress={() => alert('Share functionality would be implemented here.')}
                >
                  <Text style={styles.tryOnShareButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tryOnTryAgainButton}
                  onPress={() => {
                    setSelectedImage(null);
                    setProcessedImage(null);
                  }}
                >
                  <Text style={styles.tryOnTryAgainButtonText}>Try Another Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Fallback
            <View style={styles.tryOnError}>
              <Text>Something went wrong. Please try again.</Text>
            </View>
          )}
        </View>
        
        <View style={styles.tryOnFooter}>
          <TouchableOpacity 
            style={styles.tryOnCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.tryOnCloseButtonText}>Close</Text>
          </TouchableOpacity>
          
          {processedImage && (
            <TouchableOpacity 
              style={styles.tryOnBuyButton}
              onPress={() => {
                onClose();
                setTimeout(() => openExternalLink(product.link), 300);
              }}
            >
              <Text style={styles.tryOnBuyButtonText}>Buy This Look</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Update the ProductCard component to use WebXRARViewer
const ProductCard = ({ product, onPress, isTrending = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleARView = () => {
    setShowARViewer(true);
  };

  const handleProductPreview = () => {
    setShowProductPreview(true);
  };

  const handleVirtualTryOn = () => {
    setShowVirtualTryOn(true);
  };

  const handleShopOnBrand = () => {
    if (product.affiliateUrl) {
      openExternalLink(product.affiliateUrl);
    }
  };

  const handleShopWithAgent = () => {
    // Placeholder for "Shop with Curator Agent" functionality
    alert('The Curator Agent will assist you with this purchase soon!');
  };

  return (
    <View style={[styles.productCard, isTrending && styles.trendingProductCard]}>
      {!isFlipped ? (
        <View style={styles.cardContent}>
          <View style={styles.cardImageContainer}>
            <Image 
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            </View>
            <TouchableOpacity style={styles.previewButton} onPress={handleProductPreview}>
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.brandText}>by {product.brand}</Text>
          </View>

          {/* Updated Card Actions with new buttons */}
          <View style={styles.productCardButtonContainer}>
            <TouchableOpacity
              style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
              onPress={handleShopOnBrand}
            >
              <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
              onPress={handleShopWithAgent}
            >
              <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardActions}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleFlip}>
                <Text style={styles.actionButtonText}>ℹ️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleARView}>
                <Text style={styles.actionButtonText}>👁️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleVirtualTryOn}>
                <Text style={styles.actionButtonText}>👤</Text>
              </TouchableOpacity>
            </View>
            {/* Old Buy Now button removed/commented out
            <TouchableOpacity style={styles.buyNowButton} onPress={handleShopOnBrand}>
              <Text style={styles.buyNowButtonText}>Buy Now</Text>
            </TouchableOpacity>
            */}
          </View>
        </View>
      ) : (
        <View style={styles.cardContentBack}>
          <TouchableOpacity style={styles.backButton} onPress={handleFlip}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.backProductTitle}>{product.title}</Text>
          <Text style={styles.backProductPrice}>{product.price}</Text>
          
          <View style={styles.highlightsContainer}>
            <Text style={styles.highlightsTitle}>Why Buy This?</Text>
            <Text style={styles.highlightsText}>{product.description}</Text>
          </View>
          
          <TouchableOpacity style={styles.buyNowButton} onPress={handleShopOnBrand}>
            <Text style={styles.buyNowButtonText}>Buy on {product.brand}</Text>
          </TouchableOpacity>
        </View>
      )}

      <WebXRARViewer 
        product={product}
        visible={showARViewer}
        onClose={() => setShowARViewer(false)}
      />

      <ProductPreviewOverlay 
        product={product}
        visible={showProductPreview}
        onClose={() => setShowProductPreview(false)}
      />

      <VirtualTryOn 
        product={product}
        visible={showVirtualTryOn}
        onClose={() => setShowVirtualTryOn(false)}
      />
    </View>
  );
};

// Add Visual Search feature
const VisualSearchPanel = ({ visible, onClose, onSearch }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visualSearchResults, setVisualSearchResults] = useState([]);
  const [analyzeStage, setAnalyzeStage] = useState('initial'); // initial, analyzing, results
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // Reset state when visibility changes
  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);
  
  // Reset all state
  const resetState = () => {
    setSelectedImage(null);
    setVisualSearchResults([]);
    setAnalyzeStage('initial');
    setError(null);
    setIsDragActive(false);
  };
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setAnalyzeStage('analyzing');
    setError(null);
    
    // Analyze the image
    analyzeImage(imageUrl);
  };
  
  // Enhanced image analysis with better product detection
  const analyzeImage = async (imageUrl) => {
    try {
      console.log('🔍 Starting enhanced visual search analysis for:', imageUrl);
      
      // Import and initialize our visual search service
      console.log('📦 Importing AIProductService...');
      const { AIProductService } = await import('./app/services/AIProductService.js');
      const aiService = new AIProductService();
      
      console.log('🔧 Initializing AI service...');
      await aiService.initialize();
      console.log('✅ AI service initialized successfully');
      
      // Enhanced image content analysis
      console.log('🔍 Analyzing image content...');
      const imageAnalysis = await enhancedImageAnalysis(imageUrl);
      console.log('📝 Enhanced image analysis result:', imageAnalysis);
      
      // Perform multi-query search for better results
      console.log('🔍 Performing search with queries:', imageAnalysis);
      const searchResults = await performEnhancedSearch(imageAnalysis, aiService);
      console.log('📊 Search completed. Found results:', searchResults.length);
      
      if (searchResults.length > 0) {
        console.log(`✅ Found ${searchResults.length} similar products`);
        console.log('📦 Setting results and updating stage...');
        setVisualSearchResults(searchResults);
        setAnalyzeStage('results');
        console.log('🎯 Visual search completed successfully');
      } else {
        console.log('⚠️ No similar products found');
        setError('No similar products found. Try a different image or search manually.');
        setAnalyzeStage('initial');
      }
    } catch (error) {
      console.error('❌ Visual search analysis failed:', error);
      console.error('❌ Error stack:', error.stack);
      setError(`Visual search failed: ${error.message}`);
      setAnalyzeStage('initial');
    }
  };

  // Enhanced image analysis with better pattern recognition
  const enhancedImageAnalysis = async (imageUrl) => {
    try {
      console.log('🔍 Starting enhanced image analysis...');
      
      // For uploaded files, we can't analyze the URL (it's a blob), so we'll use
      // intelligent defaults and filename analysis if available
      let analysisContext = imageUrl.toLowerCase();
      
      // Better pattern matching for different product types
      const productPatterns = [
        // Tech patterns
        { pattern: /macbook|laptop|computer|mac/i, queries: ['macbook', 'laptop', 'computer'], confidence: 0.9 },
        { pattern: /iphone|phone|mobile|smartphone/i, queries: ['smartphone', 'phone', 'mobile'], confidence: 0.9 },
        { pattern: /headphone|airpods|audio|earbuds/i, queries: ['headphones', 'audio', 'earbuds'], confidence: 0.85 },
        { pattern: /tv|television|display|monitor/i, queries: ['tv', 'monitor', 'display'], confidence: 0.85 },
        { pattern: /camera|photography|lens/i, queries: ['camera', 'photography', 'lens'], confidence: 0.8 },
        
        // Furniture patterns
        { pattern: /chair|furniture|seating/i, queries: ['chair', 'furniture', 'office'], confidence: 0.8 },
        { pattern: /desk|table|workspace/i, queries: ['desk', 'table', 'workspace'], confidence: 0.8 },
        { pattern: /sofa|couch|living/i, queries: ['sofa', 'furniture', 'living room'], confidence: 0.8 },
        
        // Kitchen patterns
        { pattern: /blender|kitchen|appliance|cooking/i, queries: ['blender', 'kitchen', 'appliance'], confidence: 0.8 },
        { pattern: /coffee|espresso|brew/i, queries: ['coffee', 'espresso', 'kitchen'], confidence: 0.8 },
        
        // Fashion patterns
        { pattern: /shoe|sneaker|footwear/i, queries: ['shoes', 'sneakers', 'footwear'], confidence: 0.8 },
        { pattern: /watch|timepiece|smartwatch/i, queries: ['watch', 'smartwatch', 'accessories'], confidence: 0.8 },
        { pattern: /bag|backpack|purse/i, queries: ['bag', 'backpack', 'accessories'], confidence: 0.8 },
        
        // Beauty patterns
        { pattern: /skincare|beauty|cosmetic/i, queries: ['skincare', 'beauty', 'cosmetics'], confidence: 0.8 },
        { pattern: /hair|dryer|styling/i, queries: ['hair care', 'styling', 'beauty'], confidence: 0.8 },
      ];
      
      // Find the best matching pattern
      let bestMatch = null;
      let highestConfidence = 0;
      
      for (const pattern of productPatterns) {
        if (pattern.pattern.test(analysisContext) && pattern.confidence > highestConfidence) {
          bestMatch = pattern;
          highestConfidence = pattern.confidence;
        }
      }
      
      if (bestMatch) {
        return {
          primaryQuery: bestMatch.queries[0],
          secondaryQueries: bestMatch.queries.slice(1),
          confidence: bestMatch.confidence,
          category: bestMatch.queries[0]
        };
      }
      
      // Fallback to tech products (most common for visual search)
      // Since this is for uploaded images and MacBook is very common, let's default to tech
      console.log('📱 No pattern matched, defaulting to tech products for uploaded image');
      return {
        primaryQuery: 'macbook',
        secondaryQueries: ['laptop', 'computer', 'tech'],
        confidence: 0.7,
        category: 'tech'
      };
      
    } catch (error) {
      console.error('❌ Enhanced image analysis failed:', error);
      return {
        primaryQuery: 'premium products',
        secondaryQueries: ['luxury', 'design', 'modern'],
        confidence: 0.5,
        category: 'general'
      };
    }
  };

  // Enhanced search with multiple queries and better ranking
  const performEnhancedSearch = async (imageAnalysis, aiService) => {
    try {
      console.log('🤖 Performing enhanced product search...');
      
      let allResults = [];
      
      // Search with primary query (use default persona since selectedPersona is not in scope)
      const primaryResults = await aiService.searchProducts(imageAnalysis.primaryQuery, 'tech enthusiast');
      allResults = [...primaryResults];
      
      // Search with secondary queries if we need more results
      if (allResults.length < 5 && imageAnalysis.secondaryQueries.length > 0) {
        for (const secondaryQuery of imageAnalysis.secondaryQueries) {
          const additionalResults = await aiService.searchProducts(secondaryQuery, 'tech enthusiast');
          // Add unique results only
          const uniqueResults = additionalResults.filter(r => !allResults.find(existing => existing.id === r.id));
          allResults = [...allResults, ...uniqueResults];
          
          if (allResults.length >= 8) break;
        }
      }
      
      // Enhance results with similarity scores and category matching
      const enhancedResults = allResults.map((product, index) => {
        let similarityScore = 0.8 - (index * 0.05); // Base score decreases with position
        
        // Boost score if product category matches image analysis
        if (product.category === imageAnalysis.category) {
          similarityScore += 0.15;
        }
        
        // Boost score based on image analysis confidence
        similarityScore += imageAnalysis.confidence * 0.1;
        
        // Ensure score stays within bounds
        similarityScore = Math.min(0.98, Math.max(0.5, similarityScore));
        
        return {
          ...product,
          similarity: similarityScore,
          matchReason: index < 2 ? 'Exact match' : index < 4 ? 'Similar product' : 'Related item'
        };
      });
      
      // Sort by similarity score and return top results
      return enhancedResults
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 6);
      
    } catch (error) {
      console.error('❌ Enhanced search failed:', error);
      return [];
    }
  };
  
  // Trigger file input click
  const selectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Demo function with better sample
  const tryDemo = () => {
    const demoImage = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format';
    setSelectedImage(demoImage);
    setAnalyzeStage('analyzing');
    analyzeImage(demoImage);
  };

  // Handle clicking on a visual search result - use simple approach
  const handleResultClick = (product) => {
    console.log('🔍 Selected visual search result:', product.title);
    // Extract search terms from product title
    const searchTerms = product.title.split(' ').slice(0, 2).join(' '); // First 2 words
    
    // Use the onSearch prop which now properly routes to regular search for single terms
    if (onSearch) {
      onSearch([searchTerms]); // This will now use handleSearch instead of handleVisualSearch
    }
    
    // Close the panel
    onClose();
  };

  // Handle result selection - create a dedicated visual search results view
  const handleResultSelection = () => {
    console.log('🎯 Displaying visual search results in dedicated view');
    
    // Close the modal
    onClose();
    
    // Trigger the parent to show visual search results
    // We'll pass a special flag to indicate this is visual search
    if (onSearch) {
      onSearch(visualSearchResults, 'visual-search');
    }
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.rightSidePanel}>
      <TouchableOpacity style={styles.panelBackdrop} onPress={onClose} />
      <View style={styles.rightPanelContent}>
        {/* Header */}
        <View style={styles.rightPanelHeader}>
          <Text style={styles.rightPanelTitle}>Search by Image</Text>
          <TouchableOpacity style={styles.closeRightPanel} onPress={onClose}>
            <Text style={styles.closeRightPanelText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.rightPanelSubtitle}>
          Upload a product screenshot to discover similar items
        </Text>
        
        <View style={{ marginTop: 30 }}>
          {analyzeStage === 'initial' ? (
            /* Upload Interface */
            <View 
              style={{
                borderWidth: 2,
                borderColor: isDragActive ? COLORS.primaryPeachy : COLORS.borderLight,
                borderStyle: 'dashed',
                borderRadius: 12,
                padding: 30,
                alignItems: 'center',
                backgroundColor: isDragActive ? hexToRgba(COLORS.primaryPeachy, 0.05) : COLORS.lightGray,
                marginBottom: 20
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragActive(false);
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                  const event = { target: { files: [file] } };
                  handleFileSelect(event);
                } else {
                  setError('Please drop an image file');
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragActive(false);
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: 12 }}>📸</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                textAlign: 'center',
                marginBottom: 8
              }}>
                {isDragActive ? 'Drop your image here' : 'Drag & drop an image'}
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                textAlign: 'center',
                marginBottom: 20
              }}>
                or choose from your device
              </Text>
              
              <View style={{ width: '100%' }}>
                <TouchableOpacity 
                  style={{
                    backgroundColor: COLORS.primaryPeachy,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    marginBottom: 10,
                    alignItems: 'center'
                  }}
                  onPress={selectImage}
                >
                  <Text style={{
                    color: COLORS.white,
                    fontSize: 14,
                    fontWeight: '600'
                  }}>Browse Files</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: COLORS.primaryPeachy,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                  onPress={tryDemo}
                >
                  <Text style={{
                    color: COLORS.primaryPeachy,
                    fontSize: 14,
                    fontWeight: '600'
                  }}>Try Demo</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                textAlign: 'center',
                marginTop: 12
              }}>
                Supports JPG, PNG up to 10MB
              </Text>
              
              {error && (
                <Text style={{
                  fontSize: 14,
                  color: COLORS.error,
                  textAlign: 'center',
                  marginTop: 10
                }}>{error}</Text>
              )}
              
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </View>
          ) : analyzeStage === 'analyzing' ? (
            /* Analyzing State */
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              {selectedImage && (
                <Image 
                  source={{ uri: selectedImage }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    marginBottom: 20
                  }}
                  resizeMode="cover"
                />
              )}
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                textAlign: 'center',
                marginBottom: 8
              }}>
                Analyzing your image...
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                textAlign: 'center'
              }}>
                Finding similar products in our catalog
              </Text>
            </View>
          ) : (
            /* Results Preview */
            <View style={{ marginTop: 20 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: 8
              }}>
                {visualSearchResults.length} Similar Products Found
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                marginBottom: 20
              }}>
                Preview of matching items
              </Text>
              
              <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                {visualSearchResults.slice(0, 3).map((product, index) => (
                  <TouchableOpacity 
                    key={product.id} 
                    style={{
                      flexDirection: 'row',
                      padding: 12,
                      marginBottom: 12,
                      backgroundColor: COLORS.white,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: COLORS.borderLight
                    }}
                    onPress={() => handleResultClick(product)}
                  >
                    {product.image && (
                      <Image 
                        source={{ uri: product.image }} 
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 6,
                          marginRight: 12
                        }}
                        resizeMode="cover"
                      />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: COLORS.text,
                        marginBottom: 4
                      }}>
                        {product.title}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: COLORS.primaryPeachy,
                        marginBottom: 2
                      }}>
                        {product.price}
                      </Text>
                      {product.similarity && (
                        <Text style={{
                          fontSize: 12,
                          color: COLORS.textSecondary
                        }}>
                          {Math.round(product.similarity * 100)}% match
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {visualSearchResults.length > 0 && (
                <TouchableOpacity 
                  style={{
                    backgroundColor: COLORS.primaryPeachy,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    marginTop: 20,
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    // Show all results in main area
                    if (visualSearchResults.length > 0) {
                      const query = visualSearchResults[0].title.split(' ').slice(0, 2).join(' ');
                      onSearch && onSearch([query]);
                      onClose();
                    }
                  }}
                >
                  <Text style={{
                    color: COLORS.white,
                    fontSize: 14,
                    fontWeight: '600'
                  }}>View All {visualSearchResults.length} Results</Text>
                </TouchableOpacity>
                )}
            </View>
          )}
        </View>
        
        {/* Reset Button */}
        {analyzeStage !== 'initial' && (
          <TouchableOpacity 
            style={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: COLORS.borderLight,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 6,
              marginTop: 20,
              alignItems: 'center'
            }}
              onPress={resetState}
          >
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              fontWeight: '500'
            }}>Try Different Image</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Update the main App component
export default function App() {
  const { width: screenWidth } = useWindowDimensions(); // Get screen width here

  // State for user selections
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedLifeMoment, setSelectedLifeMoment] = useState(null);
  
  // State for app functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showPersonaPanel, setShowPersonaPanel] = useState(false);
  const [showLifeMomentPanel, setShowLifeMomentPanel] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showTrendingSocial, setShowTrendingSocial] = useState(false);
  
  // State for AI Curation
  const [showAiCurateView, setShowAiCurateView] = useState(null); // null, 'form', 'results'
  const [aiSelectedBrands, setAiSelectedBrands] = useState([]);
  const [aiPersonaStyle, setAiPersonaStyle] = useState('');
  const [aiPersonaBudget, setAiPersonaBudget] = useState(''); // e.g., '$', '$$', '$$$'
  const [aiLookingFor, setAiLookingFor] = useState('');
  const [aiGeneratedProducts, setAiGeneratedProducts] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState(null);
  
  // Comprehensive brand list for AI Curation brand selection
  const availableBrands = [
    'Apple', 'Samsung', 'Sony', 'Microsoft', 'Google', 'Dell', 'HP', 'Lenovo',
    'ASUS', 'Acer', 'LG', 'Xiaomi', 'OnePlus', 'Nintendo', 'Tesla', 'BMW',
    'Nike', 'Adidas', 'Puma', 'Under Armour', 'Lululemon', 'Patagonia',
    'North Face', 'REI', 'Canon', 'Nikon', 'GoPro', 'DJI', 'Bose',
    'JBL', 'Beats', 'Sennheiser', 'Audio-Technica', 'Dyson', 'Shark',
    'iRobot', 'Nest', 'Ring', 'Philips', 'IKEA', 'West Elm', 'CB2',
    'Pottery Barn', 'Williams Sonoma', 'All-Clad', 'Le Creuset', 'KitchenAid',
    'Cuisinart', 'Breville', 'Nespresso', 'Keurig', 'Vitamix', 'Instant Pot'
  ].sort();
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  
  // Initialize products on component mount
  useEffect(() => {
    // Start with all products for discovery
    setProducts(sortProducts([...mockProducts]));
  }, []);
  
  // Apply personalization when persona or life moment changes
  useEffect(() => {
    if (selectedPersona || selectedLifeMoment) {
      // Apply personalization by sorting the products
      setProducts(sortProducts([...mockProducts]));
    }
  }, [selectedPersona, selectedLifeMoment]);
  
  // Add browser history management
  useEffect(() => {
    const handlePopState = (event) => {
      // Handle browser back button
      setSearchQuery('');
      setSelectedPersona(null);
      setSelectedLifeMoment(null);
      setShowTrendingSocial(false);
      setShowAiCurateView(null); // Reset AI curate view
      setAiSelectedBrands([]);
      setAiPersonaStyle('');
      setAiPersonaBudget('');
      setAiLookingFor('');
      // setAiGeneratedProducts([]); // Keep AI generated products to avoid re-fetching if user navigates back and forth quickly to results
      setErrorMessage(null);

      const pageState = event.state ? event.state.page : 'discovery';

      switch (pageState) {
        case 'discovery':
          setIsDiscoveryMode(true);
          setProducts(sortProducts([...mockProducts]));
          break;
        case 'trending':
          setShowTrendingSocial(true);
          setIsDiscoveryMode(false);
          break;
        case 'aiCurateForm':
          setShowAiCurateView('form');
          setIsDiscoveryMode(false);
          break;
        case 'aiCurateResults':
          setShowAiCurateView('results');
          setIsDiscoveryMode(false);
          // Products should already be in aiGeneratedProducts state
          break;
        case 'products':
          setIsDiscoveryMode(false);
          // Attempt to restore previous product view context
          if (event.state.persona) {
            const foundPersona = personas.find(p => p.id === event.state.persona);
            if (foundPersona) handlePersonaSelect(foundPersona, false); // false to prevent history push
          } else if (event.state.lifeMoment) {
            const foundMoment = lifeMoments.find(m => m.id === event.state.lifeMoment);
            if (foundMoment) handleLifeMomentSelect(foundMoment, false);
          } else if (event.state.searchQuery) {
            setSearchQuery(event.state.searchQuery);
            handleSearch(event.state.searchQuery, false);
          } else {
            // Fallback if specific product context is missing, show all products
            setProducts(sortProducts([...mockProducts]));
          }
          break;
        default:
          setIsDiscoveryMode(true);
          setProducts(sortProducts([...mockProducts]));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      // Push initial state only if not already on a specific view from a direct URL or refresh
      if (isDiscoveryMode && !window.location.search) {
         window.history.replaceState({ page: 'discovery' }, '', window.location.pathname);
      } else if (showTrendingSocial && !window.location.search.includes('view=trending')) {
        window.history.replaceState({ page: 'trending' }, '', '?view=trending');
      } else if (showAiCurateView === 'form' && !window.location.search.includes('view=ai-curate')) {
        window.history.replaceState({ page: 'aiCurateForm' }, '', '?view=ai-curate');
      } else if (showAiCurateView === 'results' && !window.location.search.includes('view=ai-results')) {
        window.history.replaceState({ page: 'aiCurateResults' }, '', '?view=ai-results');
      } else if (!isDiscoveryMode && !showTrendingSocial && !showAiCurateView && !window.location.search) {
         // Generic product view, could be from persona, lifemoment or search
         // The individual handlers will push more specific states
         window.history.replaceState({ page: 'products' }, '', window.location.pathname); 
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [isDiscoveryMode, showTrendingSocial, showAiCurateView]); // Add showAiCurateView to dependency array

  // Update browser history when navigation occurs (Simplified)
  // Specific pushState calls are now within the action handlers themselves (handleSearch, handlePersonaSelect, Start AI Curation button, etc.)
  // This useEffect is now mainly for initial state or direct URL handling via popstate.

  const handleSearch = async (searchTerm, pushHistory = true) => {
    console.log('🔍 Search triggered with term:', searchTerm);
    if (!searchTerm || !searchTerm.trim()) {
      console.log('❌ Search term is empty, returning early');
      return;
    }
    
    console.log('✅ Setting search states...');
    setSearchQuery(searchTerm); // Set search query state
    setIsLoadingAnimation(true);
    setIsDiscoveryMode(false);
    setShowTrendingSocial(false);
    setShowAiCurateView(null);
    setErrorMessage(null); // Clear any previous error messages

    if (pushHistory && typeof window !== 'undefined' && window.history && window.history.pushState) {
      window.history.pushState({ page: 'products', searchQuery: searchTerm }, '', `?search=${encodeURIComponent(searchTerm)}`);
    }

    console.log('🔄 Starting database search...');
    
    try {
      // Use AIProductService for database search
      const { AIProductService } = await import('./app/services/AIProductService.js');
      const aiService = new AIProductService();
      await aiService.initialize();
      
      console.log('🗄️ Active service:', aiService.activeService);
      console.log('📊 Searching in database/service...');
      
      // Search using the AI service (will use Supabase or mock data)
      const searchResults = await aiService.searchProducts(searchTerm, 'general search');
      
      console.log('🎯 Database search results found:', searchResults.length);
      console.log('📝 Database search results:', searchResults.map(p => p.title));
      
      // Transform results to match expected format
      const transformedResults = searchResults.map(product => ({
        ...product,
        // Ensure compatibility with existing product card format
        priceRange: product.price ? [parseFloat(product.price.replace('$', '').replace(',', '')), parseFloat(product.price.replace('$', '').replace(',', ''))] : [0, 0],
        category: product.category || 'general',
        tags: product.tags || [],
        description: product.description || product.whyBuy || 'Great product!',
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center',
        affiliateUrl: product.affiliateUrl || product.link || 'https://example.com'
      }));
      
      console.log('🎨 Setting transformed products:', transformedResults.length);
      setProducts(sortProducts(transformedResults));
      setIsLoadingAnimation(false);
      
      if (transformedResults.length === 0) {
        console.log('⚠️ No search results from database, setting error message');
        setErrorMessage('No products found. Try a different search term.');
      } else {
        console.log('✅ Database search successful, clearing error message');
        setErrorMessage(null);
      }
      
      await aiService.cleanup();
      
    } catch (error) {
      console.error('❌ Database search failed, falling back to mock data:', error);
      
      // Fallback to mock data search
      const searchResults = mockProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      console.log('🎯 Mock fallback results:', searchResults.length);
      const finalProducts = searchResults.length > 0 ? searchResults : mockProducts;
      setProducts(sortProducts(finalProducts));
      setIsLoadingAnimation(false);
      
      if (searchResults.length === 0) {
        setErrorMessage('No products found. Try a different search term.');
      } else {
        setErrorMessage(null);
      }
    }
  };
  
  // Calculate product relevance score based on selected persona and life moment
  const getRelevanceScore = (product) => {
    let score = 1;
    
    // Apply persona-based scoring
    if (selectedPersona) {
      // Student persona - Prioritize budget-friendly options with strong emphasis on price
      if (selectedPersona.id === 'student') {
        // Heavy penalty for expensive products
        if (product.price > 1500) {
          score -= 5; // Significant penalty for high-priced products
        } else if (product.price < 1000) {
          score += 4; // Big boost for affordable products
        }
        
        // Additional boosts for student-friendly tags
        if (product.tags.includes('student')) score += 3;
        if (product.tags.includes('budget')) score += 2.5;
        if (product.tags.includes('entry-level')) score += 2;
        if (product.tags.includes('portable')) score += 1.5;
        
        // Value insight boost for student persona
        const valueInsight = product.insights.find(i => i.label === 'Value');
        if (valueInsight && valueInsight.value > 85) {
          score += 2;
        }
      }
      // Traveler persona - Focus on portability
      else if (selectedPersona.id === 'traveler') {
        // Prioritize lightweight and portable products
        if (product.tags.includes('portable')) score += 3;
        if (product.tags.includes('lightweight')) score += 2.5;
        
        // Battery life is important for travelers
        const batteryInsight = product.insights.find(i => i.label === 'Battery Life');
        if (batteryInsight && batteryInsight.value > 90) {
          score += 2;
        }
      }
      // Creative Pro persona - Focus on performance
      else if (selectedPersona.id === 'creative') {
        // Prioritize high-performance products
        if (product.tags.includes('pro')) score += 2;
        if (product.tags.includes('premium')) score += 1.5;
        if (product.tags.includes('creative')) score += 3;
        
        // Performance insight boost
        const performanceInsight = product.insights.find(i => i.label === 'Performance');
        if (performanceInsight && performanceInsight.value > 90) {
          score += 2.5;
        }
      }
      // Business Pro persona - Balance of performance and reliability
      else if (selectedPersona.id === 'business') {
        // Prioritize reliable business-oriented products
        if (product.tags.includes('pro')) score += 1.5;
        if (product.tags.includes('balanced')) score += 2;
        
        // Look for good all-around performance
        let allRoundScore = 0;
        let insightCount = 0;
        
        product.insights.forEach(insight => {
          allRoundScore += insight.value;
          insightCount++;
        });
        
        // Reward well-balanced products
        if (insightCount > 0 && (allRoundScore / insightCount) > 85) {
          score += 2;
        }
      }
    }
    
    // Apply life moment based scoring
    if (selectedLifeMoment) {
      // Strong boost for primary category match
      if (selectedLifeMoment.primaryCategory && product.category === selectedLifeMoment.primaryCategory) {
        score += 4;
      }
      
      // Apply tag boosts based on life moment
      product.tags.forEach(tag => {
        const momentTagWeights = selectedLifeMoment.tagWeights || {};
        if (momentTagWeights[tag]) {
          score += momentTagWeights[tag];
        }
      });
    }
    
    return score;
  };
  
  // Sort products based on relevance score
  const sortProducts = (products) => {
    if (!products || !Array.isArray(products)) return [];
    
    // Create a copy to avoid mutating the original array
    return [...products].sort((a, b) => {
      const scoreA = getRelevanceScore(a);
      const scoreB = getRelevanceScore(b);
      
      // Primary sort by relevance score
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      
      // Secondary sort by rating (higher is better)
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      
      // Tertiary sort by price (lower is better)
      return a.price - b.price;
    });
  };
  
  // Handle persona selection
  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setShowPersonaPanel(false); // Assuming this closes a panel
    setIsLoadingAnimation(true);
    setErrorMessage(null);

    setTimeout(() => {
      let filteredProducts = [];
      const personaId = persona.id;

      console.log(`[DEBUG] Filtering for persona: ${personaId}`);

      // Initial filter based on specific "-pick" tags for all personas
      if (personaId === 'student') {
        console.log('[DEBUG Student] Attempting primary filter for student-pick...');
        filteredProducts = mockProducts.filter(p => p.tags.includes('student-pick'));
        console.log(`[DEBUG Student] After primary \'student-pick\' filter, found ${filteredProducts.length} products. Titles:`, filteredProducts.map(p => p.id + ": " + p.title));
      } else if (personaId === 'trendsetter') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('trendsetter-pick'));
        console.log(`[DEBUG Trendsetter] After primary \'trendsetter-pick\' filter, found ${filteredProducts.length} products.`);
      } else if (personaId === 'optimizer') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('optimizer-pick'));
        console.log(`[DEBUG Optimizer] After primary \'optimizer-pick\' filter, found ${filteredProducts.length} products.`);
      } else if (personaId === 'conscious') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('conscious-pick'));
        console.log(`[DEBUG Conscious] After primary \'conscious-pick\' filter, found ${filteredProducts.length} products.`);
      } else {
        // Fallback for any persona that might not have a specific "-pick" logic above (should not happen with current personas)
        console.log(`[DEBUG ${personaId}] No specific -pick logic. Applying general tag/category filter for ${personaId}.`);
        filteredProducts = mockProducts.filter(p => 
          (p.tags.includes(personaId)) || 
          (p.category.toLowerCase().includes(personaId))
        );
      }
      
      console.log(`[DEBUG ${personaId}] After initial specific pick/filter, found ${filteredProducts.length} products.`);
      if (filteredProducts.length > 0) {
         console.log(`[DEBUG ${personaId}] Titles after initial pick: `, filteredProducts.map(p => p.title));
      }

      // Fallback logic if initial filter yields less than 5 products
      if (filteredProducts.length < 5 && mockProducts.length > 0) {
        console.log(`[DEBUG ${personaId}] Initial filter yielded < 5 products (${filteredProducts.length}). Attempting broader filter.`);
        
        let broaderFilter = [];
        const originalPickCount = filteredProducts.length; // Store how many items the specific pick found
        const specificPicksHadItems = originalPickCount > 0;

        if (personaId === 'student') {
            console.log('[DEBUG Student] Applying broader student filter...');
            const studentBroadTags = ['budget-friendly', 'study-essential', 'campus-essential', 'portable', 'value-deal'];
            broaderFilter = mockProducts.filter(p => {
                const hasBroadTag = studentBroadTags.some(tag => p.tags.includes(tag));
                const isRelevantCategory = ['laptop', 'accessories', 'electronics', 'subscription', 'food'].includes(p.category);
                return hasBroadTag || isRelevantCategory;
            });
            console.log(`[DEBUG Student] After broader student filter, found ${broaderFilter.length} products. Titles:`, broaderFilter.map(p=>p.id + ": " + p.title));
        } else {
            // Broader filter logic for other personas (trendsetter, optimizer, conscious)
            console.log(`[DEBUG ${personaId}] Applying broader filter for non-student persona ${personaId}...`);
            const personaTags = { 
                trendsetter: ['premium', 'innovative', 'stylish-travel', 'beauty-tech', 'camera-excellence', 'luxury-travel', 'design-focused', 'wearable-tech', 'fashionable-function'],
                optimizer: ['pro', 'performance', 'ergonomic', 'office-essential', 'productivity-tool', 'tech-essential', 'business-laptop', 'audio-excellence'],
                conscious: ['sustainable', 'eco-friendly', 'organic', 'minimalist', 'durable-design', 'ethical-brand', 'sustainable-fashion', 'health-conscious'],
            };
            broaderFilter = mockProducts.filter(p => {
                return personaTags[personaId]?.some(tag => p.tags.includes(tag)) || 
                       p.category.toLowerCase().includes(personaId);
            });
            console.log(`[DEBUG ${personaId}] Broader filter for ${personaId} found ${broaderFilter.length} products.`);
             if (broaderFilter.length > 0) {
                console.log(`[DEBUG ${personaId}] Titles from broader filter: `, broaderFilter.map(p => p.title));
            }
        }

        if (broaderFilter.length >= 5) {
            console.log(`[DEBUG ${personaId}] Broader filter successful (${broaderFilter.length} products). Using broader set.`);
            filteredProducts = broaderFilter;
        } else {
            console.log(`[DEBUG ${personaId}] Broader filter also yielded < 5 products (${broaderFilter.length}).`);
            // If specific picks originally had items, and broader search didn't get 5, prefer the original specific picks.
            // This prevents a good specific small set from being overridden by an even smaller (or empty) broad set.
            if (specificPicksHadItems) {
                console.log(`[DEBUG ${personaId}] Broader filter insufficient. Reverting to original specific -pick items (${originalPickCount} products) because they existed.`);
                // Re-fetch the original picks to ensure `filteredProducts` is correctly set
                 if (personaId === 'student') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('student-pick'));
                 } else if (personaId === 'trendsetter') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('trendsetter-pick'));
                 } else if (personaId === 'optimizer') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('optimizer-pick'));
                 } else if (personaId === 'conscious') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('conscious-pick'));
                 }
                 // If, after all this, filteredProducts is still empty (e.g. no -pick and no broad results)
                 // then the critical fallback below will catch it.
            } else {
                // If specific picks had NO items, and broader also failed to get 5, then we check broaderFilter.
                // If broaderFilter has *any* items, use them. Otherwise, it'll go to critical fallback.
                if(broaderFilter.length > 0){
                    console.log(`[DEBUG ${personaId}] Original picks were empty, broader filter has ${broaderFilter.length}. Using broader filter results.`);
                    filteredProducts = broaderFilter;
                } else {
                    console.log(`[DEBUG ${personaId}] Original picks were empty, and broader filter was also empty. Will proceed to critical fallback if necessary.`);
                    // `filteredProducts` remains empty here, will be caught by critical fallback if mockProducts has items.
                }
            }
        }
      }
      
      console.log(`[DEBUG ${personaId}] After all primary and secondary filtering, product count: ${filteredProducts.length}.`);

      // CRITICAL FALLBACK: If all filtering attempts for a persona result in zero products, show all products.
      if (filteredProducts.length === 0 && mockProducts.length > 0) {
          console.warn(`[DEBUG ${personaId}] CRITICAL FALLBACK: All filtering resulted in zero products. Showing all ${mockProducts.length} available products instead for ${personaId}.`);
          filteredProducts = [...mockProducts];
      }

      console.log(`[DEBUG ${personaId}] FINAL products to be set before sorting for ${personaId}: ${filteredProducts.length} items.`);
      if (filteredProducts.length > 0) {
        console.log(`[DEBUG ${personaId}] Final Titles before sorting:`, filteredProducts.map(p => p.title));
      } else {
        console.log(`[DEBUG ${personaId}] No products to display for ${personaId} after all filtering.`);
      }

      setProducts(sortProducts(filteredProducts)); 
      setIsLoadingAnimation(false);
      setIsDiscoveryMode(false);
      
      if (filteredProducts.length === 0 && mockProducts.length > 0) { // This message might now be redundant due to the critical fallback above but kept for safety.
        setErrorMessage(`No products specifically matched "${persona.name}". We're showing all available products instead.`);
         console.log(`[UI HINT] Setting error message for ${personaId} as no specific products found, but showing all due to fallback.`);
      } else if (filteredProducts.length === 0 && mockProducts.length === 0) {
        setErrorMessage(`No products available in the store at the moment.`);
        console.log(`[UI HINT] Setting error message as no products in store.`);
      } else {
        setErrorMessage(null); // Clear any previous error messages if products are found
      }

    }, 1000);
  };
  
  // Handle life moment selection
  const handleLifeMomentSelect = (moment) => {
    setSelectedLifeMoment(moment);
    setShowLifeMomentPanel(false);
    setIsLoadingAnimation(true);
    setErrorMessage(null);

    setTimeout(() => {
      let filteredProducts = [];
      const momentId = moment.id;

      console.log(`Filtering for life moment: ${momentId}`);

      // Primary filter using specific life moment tags
      if (momentId === 'new-arrival') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('new-arrival-essential'));
      } else if (momentId === 'career-launch') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('career-launch-essential'));
      } else if (momentId === 'sanctuary') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('sanctuary-essential'));
      } else if (momentId === 'golden-years') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('golden-years-essential'));
      } else if (momentId === 'gamer-setup') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('gamer-setup-essential'));
      } else if (momentId === 'sustainable-living') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('sustainable-living-essential'));
      } else if (momentId === 'wellness-retreat') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('wellness-retreat-essential'));
      } else if (momentId === 'perfect-hosting') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('perfect-hosting-essential'));
      } else {
        // Fallback for any other moment or if no specific picks are defined
        filteredProducts = mockProducts.filter(p => 
          (p.tags.includes(momentId)) || // General tag match
          (p.category.toLowerCase().includes(momentId)) // General category match
        );
      }

      console.log(`Initial filtered products for ${momentId}:`, filteredProducts.length);

      // Ensure a minimum number of products, or show all if specific filter is too narrow
      if (filteredProducts.length < 4 && mockProducts.length > 0) {
        console.log(`Not enough specific products for ${momentId}, broadening search.`);
        // If specific picks are too few, try a broader filter based on general tags or categories
        let broaderFilter = mockProducts.filter(p => {
          const momentTags = { // Define some broader tags for each moment if specific picks are < 4
            'new-arrival': ['baby', 'infant-care', 'parenting', 'premium-parenting', 'smart-parenting'],
            'career-launch': ['pro', 'performance', 'premium', 'office-essential', 'productivity-tool', 'business-laptop'],
            'sanctuary': ['home-comfort', 'premium-comfort', 'design-focused', 'premium-kitchen', 'ergonomic'],
            'golden-years': ['senior-friendly', 'easy-to-use', 'reading-comfort', 'portable-audio', 'large-screen'],
            'gamer-setup': ['gaming', 'performance', 'tech-essential', 'high-refresh', 'competitive-gaming'],
            'sustainable-living': ['sustainable', 'eco-friendly', 'organic', 'minimalist', 'ethical-brand'],
            'wellness-retreat': ['health-tech', 'wellness', 'comfort-wear', 'self-care', 'relaxation'],
            'perfect-hosting': ['kitchen', 'entertaining', 'premium-kitchen', 'quality-brew', 'versatile-appliance']
          };
          return momentTags[momentId]?.some(tag => p.tags.includes(tag)) || 
                 p.category.toLowerCase().includes(momentId) ||
                 (momentId === 'new-arrival' && p.category === 'baby') ||
                 (momentId === 'sanctuary' && (p.category === 'kitchen' || p.category === 'furniture')) ||
                 (momentId === 'gamer-setup' && (p.category === 'electronics' || p.category === 'audio')) ||
                 (momentId === 'perfect-hosting' && p.category === 'kitchen');
        });

        if (broaderFilter.length >= 4) {
          filteredProducts = broaderFilter;
        } else if (mockProducts.filter(p => p.tags.includes(momentId + "-essential")).length > 0 && filteredProducts.length === 0) {
          // If there *are* -essential items but they were somehow filtered out, re-add them
          filteredProducts = mockProducts.filter(p => p.tags.includes(momentId + "-essential"));
        } else {
          // If still not enough, use the initial specific picks or all if specific picks were zero
          if(mockProducts.filter(p => p.tags.includes(momentId + "-essential")).length > 0 && filteredProducts.length === 0){
            filteredProducts = mockProducts.filter(p => p.tags.includes(momentId + "-essential"));
          } else if (filteredProducts.length === 0) { // Only show all if specific picks truly yield nothing
            console.log(`No specific or broader products for ${momentId}, showing all products.`);
            filteredProducts = [...mockProducts]; // Fallback to all products if no specific products found
          }
        }
      }

      // If after all attempts, filteredProducts is still empty, show all products.
      // This is a final safety net.
      if (filteredProducts.length === 0 && mockProducts.length > 0) {
        console.log(`Critical fallback for ${momentId}: All filters resulted in zero products. Showing all products.`);
        filteredProducts = [...mockProducts];
      }

      setProducts(sortProducts(filteredProducts)); // sortProducts will handle empty array if needed
      setIsLoadingAnimation(false);
      setIsDiscoveryMode(false);
      
      console.log(`Final products for ${momentId}:`, filteredProducts.length, filteredProducts.map(p=>p.title));
      if (filteredProducts.length === 0 && mockProducts.length > 0) {
        setErrorMessage(`No products found for "${moment.name}". We're showing all available products instead.`);
      } else if (filteredProducts.length === 0 && mockProducts.length === 0) {
        setErrorMessage(`No products available in the store at the moment.`);
      }

    }, 1000);
  };
  
  // Remove filters
  const removePersonaFilter = () => {
    setSelectedPersona(null);
    
    // Reapply any remaining filters
    setIsLoadingAnimation(true);
    
    setTimeout(() => {
      setProducts(sortProducts([...mockProducts]));
      setIsLoadingAnimation(false);
    }, 500);
  };
  
  const removeLifeMomentFilter = () => {
    setSelectedLifeMoment(null);
    
    // Reapply any remaining filters
    setIsLoadingAnimation(true);
    
    setTimeout(() => {
      setProducts(sortProducts([...mockProducts]));
      setIsLoadingAnimation(false);
    }, 500);
  };
  
  // Function to handle visual search results
  const handleVisualSearch = async (searchLabels, searchType = 'labels') => {
    console.log('🔍 Handling visual search with:', { searchLabels, searchType });
    
    // If this is a direct results display from the visual search component
    if (searchType === 'visual-search' && Array.isArray(searchLabels)) {
      console.log('🎯 Displaying visual search results directly');
      
      // Transform visual search results to match product format
      const transformedResults = searchLabels.map(product => ({
        ...product,
        // Ensure compatibility with existing product card format
        priceRange: typeof product.priceRange === 'object' ? 
          product.priceRange : 
          product.price ? 
            [parseFloat(product.price.replace('$', '').replace(',', '')), parseFloat(product.price.replace('$', '').replace(',', ''))] : 
            [0, 0],
        image: product.images && product.images[0] ? product.images[0] : product.image,
        description: product.description || product.whyBuyThis || 'Premium product discovered through visual search',
        category: product.category || 'visual-search',
        tags: product.tags || ['visual-search', 'ai-discovered'],
        affiliateUrl: product.affiliateUrl || 'https://example.com'
      }));
      
      // Set up the visual search results view
      setProducts(sortProducts(transformedResults));
      setIsDiscoveryMode(false);
      setShowTrendingSocial(false);
      setShowAiCurateView(null);
      setSearchQuery('Visual Search Results');
      setErrorMessage(null);
      
      // Update browser history
      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState({ page: 'visual-search-results' }, '', '?view=visual-search');
      }
      
      return;
    }
    
    // Original label-based visual search logic
    setIsLoadingAnimation(true);
    setErrorMessage(null);
    console.log('🔍 Performing visual search with labels:', searchLabels);
    
    try {
      // Import and initialize our AI service
      const { AIProductService } = await import('./app/services/AIProductService.js');
      const aiService = new AIProductService();
      
      console.log('🔧 Initializing AI service...');
      const initialized = await aiService.initialize();
      
      if (!initialized) {
        throw new Error('Failed to initialize AI service');
      }
      
      console.log('✅ AI service initialized successfully');
      
      // Combine all search labels into a single query
      const searchQuery = Array.isArray(searchLabels) ? searchLabels.join(' ') : searchLabels;
      console.log(`🔍 Searching database for: "${searchQuery}"`);
      
      // Search our Supabase database for matching products
      const searchResults = await aiService.searchProducts(searchQuery, selectedPersona?.id || 'tech enthusiast');
      
      console.log(`📊 Raw search results: ${searchResults.length} products`);
      
      // Transform and limit results
      const transformedResults = searchResults.slice(0, 8).map(product => ({
        ...product,
        priceRange: product.price ? [parseFloat(product.price.replace('$', '').replace(',', '')), parseFloat(product.price.replace('$', '').replace(',', ''))] : [0, 0],
        category: product.category || 'general',
        tags: product.tags || ['visual-search'],
        description: product.description || product.whyBuy || 'Great product!',
        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&crop=center',
        affiliateUrl: product.affiliateUrl || product.link || 'https://example.com'
      }));
      
      console.log(`✅ Final results: ${transformedResults.length} products`);
      
      // Update UI with search results
      setTimeout(() => {
        setProducts(sortProducts(transformedResults));
        setIsDiscoveryMode(false);
        setShowTrendingSocial(false);
        setShowAiCurateView(null);
        setIsLoadingAnimation(false);
        
        if (transformedResults.length === 0) {
          setErrorMessage('No products found matching your visual search. Try selecting different items from the image or use a different image.');
        } else {
          setErrorMessage(null);
          console.log(`🎯 Displaying ${transformedResults.length} visual search results`);
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Visual search failed:', error);
      console.error('Error details:', error.stack);
      
      // More specific error handling
      let errorMsg = 'Visual search encountered an error. ';
      if (error.message.includes('initialize')) {
        errorMsg += 'Database connection failed. Please try again.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMsg += 'Network error. Please check your connection.';
      } else {
        errorMsg += 'Please try again or use text search.';
      }
      
      setTimeout(() => {
        setProducts([]);
        setIsDiscoveryMode(false);
        setIsLoadingAnimation(false);
        setErrorMessage(errorMsg);
      }, 500);
    }
  };
  

  const isSmallScreen = screenWidth < 768; // Define a breakpoint


  // कांस्टेंट定义
  const APP_VERSION = "1.0.0-ultra-modern-mobile-scroll";
  const IS_DEV_MODE = __DEV__; // true in Expo Go, false in standalone/production

  // --- Constants & Initial Setup ---
  const mockProducts = [
    {
      id: '1',
      title: 'Dyson Supersonic™ Hair Dryer',
      brand: 'Dyson',
      priceRange: [399, 429],
      category: 'haircare',
      tags: ['premium', 'tech', 'beauty'],
      images: [
        'https://images.unsplash.com/photo-1620331317314-530796315638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', // Placeholder if original fails
        // ... other images
      ],
      rating: 4.9,
      description: 'Fast drying. No extreme heat. Engineered for different hair types.',
      whyBuyThis: 'Top-tier haircare tech. Protects hair while drying fast. Iconic. ✨',
      affiliateUrl: 'https://www.dyson.com/hair-care/hair-dryers/supersonic'
    },
    // ... other mock products
  ];

  // --- Helper Functions ---
  // ... (hexToRgba, shadeColor, openExternalLink etc. remain unchanged) ...

  // ... (InsightBar, ProductPreviewOverlay, WebXRARViewer, VirtualTryOn, ProductCard, VisualSearch components remain unchanged) ...

  // Placeholder function for fetching AI curated products
  async function fetchAiCuratedProducts(selectedBrands, personaStyle, personaBudget, lookingFor) {
    console.log("Fetching AI Curated Products with:", {
      selectedBrands,
      personaStyle,
      personaBudget,
      lookingFor
    });

    let prompt = `You are "Curator," an expert AI shopping assistant specializing in ultra-modern, minimalist, and high-quality tech, lifestyle, and design products. Your goal is to curate a personalized shopping bundle for a user.

User Preferences:
- Liked Brands: ${selectedBrands.length > 0 ? selectedBrands.join(', ') : 'None specified'}
- Desired Style: ${personaStyle || 'Not specified'}
- Budget Indication: ${personaBudget || 'Not specified'}
- Specifically LookingFor: ${lookingFor || 'A general collection based on style and brands'}

Based on these preferences, please generate a list of 3-5 unique product recommendations. For each product, provide:
1.  title: A concise and appealing product title (e.g., "Minimalist Smart Desk Lamp").
2.  brand: The brand of the product (e.g., "Luminoir"). If it's a conceptual product, invent a plausible brand name.
3.  whyBuyThis: A short, compelling sales pitch (1-2 sentences, max 150 characters) highlighting its key benefit or unique selling proposition, using modern language and potentially an emoji if appropriate (e.g., "💡 Smart illumination meets sleek design. Control brightness and color temperature via app for the perfect ambiance.").
4.  category: A relevant category (e.g., 'home', 'tech', 'audio', 'accessories', 'lifestyle', 'design').
5.  price: An estimated price as a string (e.g., "$129.99").
6.  image: A URL to a high-quality, relevant placeholder image (600x600px). You can use Unsplash URLs like 'https://images.unsplash.com/photo-XXXXXXXXXXXXX?w=600&h=600&fit=crop&crop=center'. Try to pick images that match the product concept.
7.  affiliateUrl: A placeholder URL like 'https://example.com/product-link'.

Return the response as a JSON array of objects. Example product object:
{
  "title": "Aura Smart Diffuser",
  "brand": "SereneScents",
  "whyBuyThis": "✨ Create a calming oasis. Ultrasonic tech meets app-controlled aromatherapy for ultimate relaxation.",
  "category": "home",
  "price": "$89.00",
  "image": "https://images.unsplash.com/photo-1604275980648-363d53333884?w=600&h=600&fit=crop&crop=center",
  "affiliateUrl": "https://example.com/aura-diffuser"
}

Do not include any introductory text or explanations outside of the JSON array itself. The output must be only the JSON array.
`;

    // Use Netlify serverless function to avoid CORS issues
    const API_URL = '/.netlify/functions/ai-curate';

    console.log('Using serverless function for AI API calls to avoid CORS issues');
    console.log('Function URL:', API_URL);

    console.log("---- ATTEMPTING ACTUAL LLM API CALL ----");
    console.log("Prompt being sent (first 500 chars):", prompt.substring(0,500));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          selectedBrands: selectedBrands,
          personaStyle: personaStyle,
          personaBudget: personaBudget,
          lookingFor: lookingFor
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('LLM API Error Response:', errorData);
        let detailedErrorMessage = 'Failed to get a valid response from AI.';
        if (errorData && errorData.error && errorData.error.message) {
          detailedErrorMessage = `AI Error: ${errorData.error.message}`;
        } else if (errorData && errorData.detail) {
          detailedErrorMessage = `AI Error: ${errorData.detail}`;
        }
        throw new Error(detailedErrorMessage);
      }

      const data = await response.json();
      console.log("Serverless function success. Response data:", data);
      
      // The serverless function already parses the JSON and returns the products array
      if (Array.isArray(data)) {
        console.log("Received products from serverless function:", data);
        return data;
      } else {
        console.error("Unexpected response from serverless function. Expected array, got:", data);
        throw new Error("Serverless function returned unexpected data format.");
      }

    } catch (error) {
      console.error('Error fetching AI curated products:', error);
      if (error instanceof Error) {
          throw error; 
      } else {
          throw new Error('An unknown error occurred while communicating with the AI.');
      }
    }
  }

  return (
    <View style={styles.container}>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {isLoadingAnimation ? (
          <View style={styles.loadingContainer}>
            <Animated.View 
              style={styles.loadingPulse}
            />
            <Text style={styles.loadingText}>
              Personalizing for you...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : showTrendingSocial ? (
          // Trending Social Page - Refactored to match product/persona page layout
          <View style={styles.modernProductGrid}> {/* Use modernProductGrid for consistent padding and background */}
            {/* Re-using the ultraModernMainHeader structure */}
            <View style={styles.ultraModernMainHeader}>
              <View style={styles.mainHeaderContent}>
                <View style={styles.brandSection}>
                  <Text style={styles.ultraModernBrandLabel}>CURATED FOR YOU</Text>
                  <Text style={styles.ultraModernBrandTitle}>Trending on Social</Text>
                  <Text style={styles.ultraModernBrandTagline}>
                    {trendRadarData.length} products • what's capturing attention right now
                  </Text>
                </View>
                
                <View style={styles.ultraModernProductHeaderControls}>
                  <TouchableOpacity 
                    style={styles.ultraModernBackButton}
                    onPress={() => {
                      setShowTrendingSocial(false);
                      setIsDiscoveryMode(true);
                    }}
                  >
                    <Text style={styles.ultraModernBackButtonText}>← Discover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Trending Products Grid - now using productGrid for two-column layout */}
            <View style={styles.productGrid}>
              {trendRadarData.map((trendItem) => {
                // Find the corresponding product in mockProducts
                const product = mockProducts.find(p => 
                  p.title.toLowerCase().includes(trendItem.title.toLowerCase()) ||
                  p.category.toLowerCase() === trendItem.category.toLowerCase()
                ) || {
                  // Fallback product data based on trend item
                  id: `trend-${trendItem.id}`,
                  title: trendItem.title,
                  price: trendItem.category === 'ELECTRONICS' ? '$399.99' : 
                         trendItem.category === 'HOME' ? '$749.99' :
                         trendItem.category === 'TRAVEL' ? '$275.00' : '$99.99',
                  rating: '4.6',
                  description: `Trending ${trendItem.category.toLowerCase()} product`,
                  category: trendItem.category.toLowerCase(),
                  image: trendItem.image,
                  brand: trendItem.title.split(' ')[0],
                  affiliateUrl: trendItem.brandUrl || '#',
                  trendingStats: `${trendItem.trendChange} increase in social mentions • ${trendItem.isViral ? 'Going viral' : 'Steady growth'} • Featured across platforms`,
                  hotTake: `This ${trendItem.category.toLowerCase()} product is trending because it perfectly captures what people are looking for right now. The surge in social media mentions and reviews shows real consumer excitement.`,
                  whyBuyThis: `🔥 TRENDING PICK → ${trendItem.trendChange} surge in popularity • Social media approved • Join the conversation • Don't miss out on what everyone's talking about`
                };

                return (
                  // Use modernProductCard for individual card styling
                  <View key={`trending-${trendItem.id}`} style={styles.modernProductCard}>
                    <View style={styles.productImageContainer}>
                      <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity style={styles.favoriteButton}>
                        <Text style={styles.favoriteIcon}>♡</Text>
                      </TouchableOpacity>
                      {trendItem.isViral && (
                        <View style={styles.viralBadge}>
                          <Text style={styles.viralBadgeText}>VIRAL</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.brandName}>{product.brand}</Text>
                      <Text style={styles.productName} numberOfLines={2}>
                        {product.title}
                      </Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>{product.price}</Text>
                        <Text style={styles.rating}>★ {product.rating}</Text>
                      </View>

                      {/* Trending Stats Section */}
                      {product.trendingStats && (
                        <View style={styles.trendingStatsContainer}>
                          <Text style={styles.trendingStatsLabel}>🔥 TRENDING NOW</Text>
                          <Text style={styles.trendingStatsText}>{product.trendingStats}</Text>
                        </View>
                      )}

                      {/* Hot Take Section */}
                      {product.hotTake && (
                        <View style={styles.hotTakeContainer}>
                          <Text style={styles.hotTakeLabel}>💭 CURATOR'S HOT TAKE</Text>
                          <Text style={styles.hotTakeText}>{product.hotTake}</Text>
                        </View>
                      )}

                      {/* Why Buy This Section */}
                      {product.whyBuyThis && (
                        <View style={styles.whyBuyThisContainer}>
                          <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                        </View>
                      )}

                      {/* Action Buttons */}
                      <View style={styles.productCardButtonContainer}>
                        <TouchableOpacity
                          style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                          onPress={() => {
                            if (trendItem.brandUrl) {
                              openExternalLink(trendItem.brandUrl);
                            } else if (product.affiliateUrl && product.affiliateUrl !== '#') {
                              openExternalLink(product.affiliateUrl);
                            } else {
                              alert('Product link coming soon!');
                            }
                          }}
                        >
                          <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                          onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                        >
                          <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : isDiscoveryMode ? (
          <View style={[styles.discoveryContainer, isSmallScreen && styles.ultraModernDiscoveryContainerPaddingSmallScreen]}>
            {/* Ultra-Modern Main Header */}
            <View style={[styles.ultraModernMainHeader, isSmallScreen && styles.ultraModernMainHeaderSmallScreen]}>
              <View style={styles.mainHeaderContent}>
                <View style={styles.brandSection}>
                  <Text style={styles.ultraModernBrandLabel}>DISCOVERY</Text>
                  <Text style={[styles.ultraModernBrandTitle, isSmallScreen && styles.ultraModernBrandTitleSmallScreen]}>curator</Text>
                  <Text style={[styles.ultraModernBrandTagline, isSmallScreen && styles.ultraModernBrandTaglineSmallScreen]}>
                    where artificial intelligence meets intentional living
                  </Text>
                </View>
                
                <View style={[styles.ultraModernHeaderControls, isSmallScreen && styles.ultraModernHeaderControlsSmallScreen]}>
                  <View style={[styles.ultraModernSearchContainer, isSmallScreen && styles.ultraModernSearchContainerSmallScreen]}>
                    <View style={[styles.searchInputWrapper, isSmallScreen && styles.searchInputWrapperSmallScreen]}>
                      <TextInput
                        style={[styles.ultraModernSearchInput, isSmallScreen && styles.ultraModernSearchInputSmallScreen]}
                        placeholder="discover your perfect aesthetic..."
                        placeholderTextColor="#A0A0A0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={() => handleSearch(searchQuery)}
                      />
                      <TouchableOpacity 
                        style={styles.ultraModernSearchButton}
                        onPress={() => handleSearch(searchQuery)}
                      >
                        <Text style={styles.searchIcon}>⌕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={[styles.ultraModernSelectorRow, isSmallScreen && styles.ultraModernSelectorRowSmallScreen]}>
                    <TouchableOpacity 
                      style={[styles.ultraModernSelector, selectedPersona && styles.ultraModernSelectorActive, isSmallScreen && styles.ultraModernSelectorSmallScreen]}
                      onPress={() => setShowPersonaPanel(true)}
                    >
                      <View style={styles.selectorContent}>
                        {selectedPersona ? (
                          <Image 
                            source={{ uri: selectedPersona.icon }}
                            style={styles.ultraModernSelectorIcon}
                          />
                        ) : (
                          <View style={styles.ultraModernDefaultIcon}>
                            <Text style={styles.defaultIconText}>S</Text>
                          </View>
                        )}
                        <View style={styles.selectorTextContainer}>
                          <Text style={styles.ultraModernSelectorLabel}>STYLE</Text>
                          <Text style={[styles.ultraModernSelectorValue, isSmallScreen && styles.ultraModernSelectorValueSmallScreen]}>
                            {selectedPersona ? selectedPersona.name : 'Choose Your Aesthetic'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.ultraModernSelector, selectedLifeMoment && styles.ultraModernSelectorActive, isSmallScreen && styles.ultraModernSelectorSmallScreen]}
                      onPress={() => setShowLifeMomentPanel(true)}
                    >
                      <View style={styles.selectorContent}>
                        {selectedLifeMoment ? (
                          <Image 
                            source={{ uri: selectedLifeMoment.icon }}
                            style={styles.ultraModernSelectorIcon}
                          />
                        ) : (
                          <View style={styles.ultraModernDefaultIcon}>
                            <Text style={styles.defaultIconText}>M</Text>
                          </View>
                        )}
                        <View style={styles.selectorTextContainer}>
                          <Text style={styles.ultraModernSelectorLabel}>MOMENT</Text>
                          <Text style={[styles.ultraModernSelectorValue, isSmallScreen && styles.ultraModernSelectorValueSmallScreen]}>
                            {selectedLifeMoment ? selectedLifeMoment.name : 'Current Chapter'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.ultraModernSelector, isSmallScreen && styles.ultraModernSelectorSmallScreen]}
                      onPress={() => setShowVisualSearch(true)}
                    >
                      <View style={styles.selectorContent}>
                        <View style={styles.ultraModernDefaultIcon}>
                          <Text style={styles.defaultIconText}>📷</Text>
                        </View>
                        <View style={styles.selectorTextContainer}>
                          <Text style={styles.ultraModernSelectorLabel}>VISUAL</Text>
                          <Text style={[styles.ultraModernSelectorValue, isSmallScreen && styles.ultraModernSelectorValueSmallScreen]}>Search by Image</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            
            <TrendRadar 
              items={trendRadarData}
              onItemPress={(item) => {
                setShowTrendingSocial(true);
                setIsDiscoveryMode(false);
                setShowAiCurateView(null); // Reset AI view
                if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                  window.history.pushState({ page: 'trending' }, '', '?view=trending');
                }
              }}
              onSeeAll={() => {
                setShowTrendingSocial(true);
                setIsDiscoveryMode(false);
                setShowAiCurateView(null); // Reset AI view
                if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                  window.history.pushState({ page: 'trending' }, '', '?view=trending');
                }
              }}
            />
            
            <View style={[styles.ultraModernSocialBundlesContainer, isSmallScreen && styles.ultraModernSectionContainerMarginSmallScreen]}>
              <View style={styles.ultraModernSectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.ultraModernSectionLabel}>CURATED</Text>
                  <Text style={styles.ultraModernSectionTitle}>Social Bundles</Text>
                  <Text style={styles.ultraModernSectionSubtitle}>
                    thoughtfully assembled collections from our community
                  </Text>
                </View>
                <TouchableOpacity style={styles.modernSeeAllButton}>
                  <Text style={styles.modernSeeAllText}>View Collection</Text>
                  <Text style={styles.modernSeeAllArrow}>→</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.ultraModernBundlesScroll}
              >
                {socialBundles.map((bundle) => {
                  // TODO: Refactor these inline small-screen styles into StyleSheet
                  const bundleNameSmallScreenStyle = isSmallScreen ? { fontSize: 22 } : {};
                  const bundleCuratorAvatarSmallScreenStyle = isSmallScreen ? { width: 30, height: 30, borderRadius: 15 } : {};
                  const bundleCuratorNameSmallScreenStyle = isSmallScreen ? { fontSize: 15 } : {};

                  return (
                    <TouchableOpacity 
                      key={bundle.id} 
                      style={[
                        styles.ultraModernBundleCard, 
                        isSmallScreen && styles.ultraModernBundleCardSmallScreen,
                        isSmallScreen && { width: screenWidth * 0.75 } // Apply dynamic width here
                      ]}
                      onPress={() => {
                        // When a bundle is clicked, show its products
                        setIsLoadingAnimation(true);
                        setIsDiscoveryMode(false);
                        setShowTrendingSocial(false);
                        setShowAiCurateView(null); // Reset AI view
                        
                        if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                          window.history.pushState({ page: 'products', socialBundle: bundle.id }, '', `?bundle=${bundle.id}`);
                        }
                        
                        setTimeout(() => {
                          setProducts(sortProducts(bundle.products));
                          setIsLoadingAnimation(false);
                        }, 800);
                      }}
                    >
                      <View style={styles.ultraModernBundleImageContainer}>
                        <Image 
                          source={{ uri: bundle.coverImage }}
                          style={styles.ultraModernBundleCover}
                          resizeMode="cover"
                        />
                        <View style={styles.ultraModernBundleOverlay} />
                      </View>
                      <View style={styles.ultraModernBundleContent}>
                        <Text style={[styles.ultraModernBundleName, bundleNameSmallScreenStyle]}>{bundle.title}</Text>
                        <View style={styles.ultraModernBundleCreatorRow}>
                          <Image 
                            source={{ uri: bundle.creator.avatar }}
                            style={styles.ultraModernCreatorAvatar}
                          />
                          <Text style={styles.ultraModernCreatorName}>{bundle.creator.name}</Text>
                          {bundle.creator.verified && (
                            <Text style={styles.ultraModernVerifiedBadge}>✓</Text>
                          )}
                        </View>
                        
                        <Text style={styles.ultraModernBundleProductCount}>
                          {bundle.products.length} carefully selected items
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            
            <View style={[styles.shopByVibeContainer, isSmallScreen && styles.ultraModernSectionContainerMarginSmallScreen]}>
              <View style={styles.ultraModernSectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.ultraModernSectionLabel}>AESTHETIC</Text>
                  <Text style={styles.ultraModernSectionTitle}>Shop by Vibe</Text>
                  <Text style={styles.ultraModernSectionSubtitle}>
                    Discover your aesthetic language through curated collections
                  </Text>
                </View>
                <TouchableOpacity style={styles.modernSeeAllButton}>
                  <Text style={styles.modernSeeAllText}>Explore All</Text>
                  <Text style={styles.modernSeeAllArrow}>→</Text>
                </TouchableOpacity>
              </View>
              
              {(() => {
                const moodCardWidthSmallScreen = isSmallScreen ? screenWidth * 0.65 : undefined;
                const moodCardMarginRightSmallScreen = isSmallScreen ? 12 : 0;

                const moodItemsContent = moodBoards.map((mood) => (
                  <TouchableOpacity 
                    key={mood.id} 
                    style={[
                      styles.ultraModernMoodCard, 
                      isSmallScreen && styles.ultraModernMoodCardSmallScreen, // Will apply base small screen card style (e.g. aspectRatio)
                      isSmallScreen && { width: moodCardWidthSmallScreen, marginRight: moodCardMarginRightSmallScreen }
                    ]}
                    onPress={() => {
                      // When a mood is clicked, filter products by aesthetic
                      setIsLoadingAnimation(true);
                      setIsDiscoveryMode(false);
                      setShowTrendingSocial(false);
                      setShowAiCurateView(null); // Reset AI view

                      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                        window.history.pushState({ page: 'products', mood: mood.id }, '', `?mood=${mood.id}`);
                      }
                      
                      setTimeout(() => {
                        // Enhanced mood-based filtering logic
                        const moodProducts = mockProducts.filter(product => {
                          if (mood.id === 'minimalist') {
                            return product.tags.includes('premium') || product.tags.includes('pro') || product.category === 'laptop';
                          } else if (mood.id === 'cyberpunk') {
                            return product.category === 'laptop' || product.category === 'wearables' || product.tags.includes('tech');
                          } else if (mood.id === 'nostalgic') {
                            return product.category === 'gaming' || product.tags.includes('retro') || product.tags.includes('classic');
                          } else if (mood.id === 'romantic') {
                            return product.category === 'jewelry' || product.tags.includes('luxury') || product.category === 'beauty';
                          } else if (mood.id === 'streetwear') {
                            return product.category === 'fashion' || product.category === 'shoes' || product.tags.includes('urban');
                          } else if (mood.id === 'academia') {
                            return product.category === 'books' || product.category === 'stationery' || product.tags.includes('study');
                          }
                          return false;
                        });
                        setProducts(sortProducts(moodProducts));
                        setIsLoadingAnimation(false);
                      }, 800);
                    }}
                  >
                    <View style={styles.ultraModernMoodImageContainer}>
                      <Image 
                        source={{ uri: mood.coverImage }} 
                        style={styles.ultraModernMoodCover} 
                        resizeMode="cover"
                      />
                      <View style={[styles.ultraModernMoodOverlay, {backgroundColor: mood.overlayColor}]} />
                    </View>
                    <View style={[styles.ultraModernMoodContent, isSmallScreen && styles.ultraModernMoodContentSmallScreen]}>
                      <View>
                        <View style={styles.moodNameRow}>
                          <Text style={[styles.moodEmoji, isSmallScreen && styles.moodEmojiSmallScreen]}>{mood.emoji}</Text>
                          <Text style={[styles.ultraModernMoodName, isSmallScreen && styles.ultraModernMoodNameSmallScreen]} numberOfLines={1} ellipsizeMode="tail">{mood.name}</Text>
                        </View>
                        <Text style={[styles.cursiveDescription, isSmallScreen && styles.cursiveDescriptionSmallScreen]} numberOfLines={isSmallScreen ? 2 : 3} ellipsizeMode="tail">{mood.description}</Text>
                      </View>
                      <Text style={[styles.philosophyText, isSmallScreen && styles.philosophyTextSmallScreen]} numberOfLines={isSmallScreen ? 1 : 2} ellipsizeMode="tail">{mood.philosophy}</Text>
                    </View>
                  </TouchableOpacity>
                ));

                if (isSmallScreen) {
                  return (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ultraModernMoodsGridSmallScreenScrollViewContent}>
                      {moodItemsContent}
                    </ScrollView>
                  );
                }
                return (
                  <View style={[styles.ultraModernMoodsGrid, isSmallScreen && styles.ultraModernMoodsGridSmallScreen]}>
                    {moodItemsContent}
                  </View>
                );
              })()}
            </View>
            
            {/* Ultra-Modern Categories */}
            <View style={[styles.ultraModernCategoryContainer, isSmallScreen && styles.ultraModernSectionContainerMarginSmallScreen]}>
              <View style={styles.ultraModernSectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.ultraModernSectionLabel}>BROWSE</Text>
                  <Text style={styles.ultraModernSectionTitle}>Shop by Category</Text>
                  <Text style={styles.ultraModernSectionSubtitle}>
                    explore our curated world of intentional products
                  </Text>
                </View>
              </View>
              
              <View style={[styles.ultraModernCategoryGrid, isSmallScreen && styles.ultraModernCategoryGridSmallScreen]}>
                {productCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.ultraModernCategoryItem, isSmallScreen && styles.ultraModernCategoryItemSmallScreen]}
                    onPress={() => {
                      // When a category is clicked, filter products by category name
                      setIsLoadingAnimation(true);
                      setIsDiscoveryMode(false);
                      setShowTrendingSocial(false);
                      setShowAiCurateView(null); // Reset AI view

                      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                        window.history.pushState({ page: 'products', category: category.name }, '', `?category=${encodeURIComponent(category.name)}`);
                      }

                      setTimeout(() => {
                        const categoryProducts = mockProducts.filter(product => 
                          product.category.toLowerCase().includes(category.id.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(category.id.toLowerCase()))
                        );
                        setProducts(sortProducts(categoryProducts.length > 0 ? categoryProducts : mockProducts));
                        setIsLoadingAnimation(false);
                      }, 800);
                    }}
                  >
                    <View style={styles.ultraModernCategoryIcon}>
                      <Image 
                        source={{ uri: category.image }}
                        style={styles.ultraModernCategoryImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={[styles.ultraModernCategoryName, isSmallScreen && styles.ultraModernCategoryNameSmallScreen]}>{category.name}</Text>
                    <Text style={[styles.ultraModernCategoryDescription, isSmallScreen && styles.ultraModernCategoryDescriptionSmallScreen]}>
                      {category.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyPrimary}>
              No products found
            </Text>
            <Text style={styles.emptySecondary}>
              Try adjusting your filters or search query
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateNeonBackButton} // Use new style
              onPress={() => {
                setIsDiscoveryMode(true);
                setSearchQuery('');
                setSelectedPersona(null);
                setSelectedLifeMoment(null);
                setProducts(sortProducts([...mockProducts]));
                setErrorMessage(null);
              }}
            >
              <Text style={styles.neonBackButtonText}>← Back to Discovery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.modernProductGrid, isSmallScreen && styles.modernProductGridSmallScreen]}>
            {/* Ultra-Modern Product Header - Consistent with Homepage */}
            <View style={styles.ultraModernMainHeader}>
              <View style={styles.mainHeaderContent}>
                <View style={styles.brandSection}>
                  <Text style={styles.ultraModernBrandLabel}>
                    {selectedPersona ? 'CURATED FOR' : selectedLifeMoment ? 'CURATED FOR' : 'DISCOVERY'}
                  </Text>
                  <Text style={styles.ultraModernBrandTitle}>
                    {selectedPersona ? selectedPersona.name : selectedLifeMoment ? selectedLifeMoment.name : 'curator'}
                  </Text>
                  <Text style={styles.ultraModernBrandTagline}>
                    {selectedPersona?.id === 'student'
                      ? `${products.length} budget essentials • carefully selected for your lifestyle`
                      : selectedLifeMoment
                        ? `${products.length} products • perfectly aligned with this chapter`
                        : selectedPersona
                          ? `${products.length} products • intentionally curated for your aesthetic`
                          : `${products.length} products • where artificial intelligence meets intentional living`
                    }
                  </Text>
                </View>
                
                <View style={styles.ultraModernProductHeaderControls}>
                  <TouchableOpacity 
                    style={styles.ultraModernBackButton}
                    onPress={() => {
                      setIsDiscoveryMode(true);
                      setSearchQuery('');
                      setSelectedPersona(null);
                      setSelectedLifeMoment(null);
                      setProducts(sortProducts([...mockProducts])); // Reset to all products, sorted
                      setErrorMessage(null);
                      // Add browser history management
                      if (window.history && window.history.pushState) {
                        window.history.pushState(null, null, window.location.pathname);
                      }
                    }}
                  >
                    <Text style={styles.ultraModernBackButtonText}>← Discover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Premium Product Grid */}
            <View style={styles.productGrid}>
              {products.length === 0 ? (
                <View style={styles.noProductsMessage}>
                  <Text style={styles.noProductsText}>
                    No products found for this selection. 
                  </Text>
                  <Text style={styles.noProductsSubtext}>
                    Try selecting a different persona or go back to discovery.
                  </Text>
                </View>
              ) : (
                products.map((product) => (
                  <View 
                    key={product.id} 
                    style={[
                      selectedPersona?.id === 'student' ? styles.studentProductCard : styles.modernProductCard,
                      isSmallScreen && (selectedPersona?.id === 'student' ? styles.studentProductCardSmallScreen : styles.modernProductCardSmallScreen)
                    ]}
                  >
                    {selectedPersona?.id === 'student' ? (
                      // REFINED Student Persona Card Layout
                      <>
                        <View style={styles.studentImageContainer}> {/* Using studentImageContainer which mirrors productImageContainer */}
                          <Image
                            source={{ uri: product.image }}
                            style={styles.productImage} // Reusing common productImage style
                            resizeMode="cover"
                          />
                          {/* studentCardBadge removed */}
                           <TouchableOpacity style={styles.favoriteButton}>
                            <Text style={styles.favoriteIcon}>♡</Text>{/* Standardized Icon */}
                          </TouchableOpacity>
                        </View>
                        <View style={styles.studentInfo}>
                          <Text style={styles.studentBrandName}>{product.brand}</Text>
                          <Text style={styles.studentProductName} numberOfLines={2}>
                            {product.title}
                          </Text>
                          <View style={styles.studentPriceRow}>
                            <Text style={styles.studentCurrentPrice}>{product.price}</Text>
                            <Text style={styles.studentRating}>★ {product.rating}</Text> {/* Using ★ for rating value as it's common */}
                          </View>

                          {(product.studentReview || product.whyStudentsLove) && (
                            <View style={styles.studentExclusiveContent}>
                              {product.studentReview && (
                                <>
                                  <Text style={styles.studentReviewLabel}>Student Review:</Text>
                                  <Text style={styles.studentReviewText}>"{product.studentReview}"</Text>
                                </>
                              )}
                              {product.whyStudentsLove && (
                                <>
                                  <Text style={styles.studentWhyLoveLabel}>Why Students Love It:</Text>
                                  <Text style={styles.studentWhyLoveText}>{product.whyStudentsLove}</Text>
                                </>
                              )}
                            </View>
                          )}

                          {/* Ultra-Modern Why Buy This Section */}
                          {product.whyBuyThis && (
                            <View style={styles.whyBuyThisContainer}>
                              <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                            </View>
                          )}

                          {/* Trending Stats Section */}
                          {product.trendingStats && (
                            <View style={styles.trendingStatsContainer}>
                              <Text style={styles.trendingStatsLabel}>🔥 TRENDING NOW</Text>
                              <Text style={styles.trendingStatsText}>{product.trendingStats}</Text>
                            </View>
                          )}

                          {/* Hot Take Section */}
                          {product.hotTake && (
                            <View style={styles.hotTakeContainer}>
                              <Text style={styles.hotTakeLabel}>💭 CURATOR'S HOT TAKE</Text>
                              <Text style={styles.hotTakeText}>{product.hotTake}</Text>
                            </View>
                          )}

                          {/* Updated Student Button Layout with two minimalist buttons */}
                          <View style={styles.productCardButtonContainer}>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                              onPress={() => openExternalLink(product.affiliateUrl)}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                              onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    ) : (
                      // Default/Modern Product Card Layout (existing)
                      <>
                        <View style={styles.productImageContainer}>
                          <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            resizeMode="cover"
                          />
                          {/* NEW Badge */}
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                          </View>
                          <TouchableOpacity style={styles.favoriteButton}>
                            <Text style={styles.favoriteIcon}>♡</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.productInfo}>
                          <Text style={styles.brandName}>{product.brand}</Text>
                          <Text style={styles.productName} numberOfLines={2}>
                            {product.title}
                          </Text>

                          <View style={styles.priceRow}>
                            <Text style={styles.currentPrice}>{product.price}</Text>
                            <Text style={styles.rating}>★ {product.rating}</Text>
                          </View>

                          {/* Persona Exclusive Content for modernProductCard */}
                          {(product.optimizerInsight || product.trendsetterTip || product.consciousChoiceDetail) && selectedPersona && selectedPersona.id !== 'student' && (
                            <View style={styles.personaExclusiveContentContainer}>
                              {selectedPersona.id === 'optimizer' && product.optimizerInsight && (
                                <>
                                  <Text style={styles.personaInsightLabel}>Pro Tip:</Text>
                                  <Text style={styles.personaInsightText}>{product.optimizerInsight}</Text>
                                </> 
                              )}
                              {selectedPersona.id === 'trendsetter' && product.trendsetterTip && (
                                <>
                                  <Text style={styles.personaInsightLabel}>Style Note:</Text>
                                  <Text style={styles.personaInsightText}>{product.trendsetterTip}</Text>
                                </> 
                              )}
                              {selectedPersona.id === 'conscious' && product.consciousChoiceDetail && (
                                <>
                                  <Text style={styles.personaInsightLabel}>Conscious Detail:</Text>
                                  <Text style={styles.personaInsightText}>{product.consciousChoiceDetail}</Text>
                                </> 
                              )}
                            </View>
                          )}

                          {/* Ultra-Modern Why Buy This Section for Non-Students */}
                          {product.whyBuyThis && (
                            <View style={styles.whyBuyThisContainer}>
                              <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                            </View>
                          )}

                          {/* Trending Stats Section */}
                          {product.trendingStats && (
                            <View style={styles.trendingStatsContainer}>
                              <Text style={styles.trendingStatsLabel}>🔥 TRENDING NOW</Text>
                              <Text style={styles.trendingStatsText}>{product.trendingStats}</Text>
                            </View>
                          )}

                          {/* Hot Take Section */}
                          {product.hotTake && (
                            <View style={styles.hotTakeContainer}>
                              <Text style={styles.hotTakeLabel}>💭 CURATOR'S HOT TAKE</Text>
                              <Text style={styles.hotTakeText}>{product.hotTake}</Text>
                            </View>
                          )}

                          {/* Updated Non-Student Button Layout with two minimalist buttons */}
                          <View style={styles.productCardButtonContainer}>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                              onPress={() => openExternalLink(product.affiliateUrl)}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                              onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Visual Search Panel */}
      <VisualSearchPanel 
        visible={showVisualSearch}
        onClose={() => setShowVisualSearch(false)}
        onSearch={(searchTerms) => {
          // Use regular search instead of complex visual search for clicked results
          if (Array.isArray(searchTerms) && searchTerms.length === 1) {
            // This is a clicked result - use regular search
            handleSearch(searchTerms[0], true);
          } else {
            // This is the complex visual search results display
            handleVisualSearch(searchTerms, 'visual-search');
          }
        }}
      />
      
      {/* Persona Selection Panel */}
      <PersonaSelectionPanel
        visible={showPersonaPanel}
        onClose={() => setShowPersonaPanel(false)}
        personas={personas}
        selectedPersona={selectedPersona}
        onSelectPersona={handlePersonaSelect}
      />
      
      {/* Life Moment Selection Panel */}
      <LifeMomentSelectionPanel
        visible={showLifeMomentPanel}
        onClose={() => setShowLifeMomentPanel(false)}
        lifeMoments={lifeMoments}
        selectedLifeMoment={selectedLifeMoment}
        onSelectLifeMoment={handleLifeMomentSelect}
      />

      {/* New AI Curation Section */}
      <View style={styles.ultraModernAiCurationContainer}> {/* New container style needed */}
        <View style={styles.ultraModernSectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Text style={styles.ultraModernSectionLabel}>PERSONALIZE</Text>
            <Text style={styles.ultraModernSectionTitle}>Curate with AI</Text>
            <Text style={styles.ultraModernSectionSubtitle}>
              Describe your style, select favorite brands, and let our AI build a unique collection just for you.
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.ultraModernPrimaryButton} // Re-use or create a new primary button style
          onPress={() => {
            setShowAiCurateView('form');
            setIsDiscoveryMode(false); // Hide discovery content
            setShowTrendingSocial(false); // Ensure other views are hidden
            // Push history state for AI Curation form
            if (typeof window !== 'undefined' && window.history && window.history.pushState) {
              window.history.pushState({ page: 'aiCurateForm' }, '', '?view=ai-curate');
            }
          }}
        >
          <Text style={styles.ultraModernPrimaryButtonText}>Start AI Curation</Text>
        </TouchableOpacity>
      </View>

      {/* AI Curation Form View (To be built next) */}
      {showAiCurateView === 'form' ? (
        <View style={styles.aiCurateFormContainer}>
          {/* Header for AI Curation Form */}
          <View style={styles.ultraModernMainHeader}>
            <View style={styles.mainHeaderContent}>
              <View style={styles.brandSection}>
                <Text style={styles.ultraModernBrandLabel}>AI CURATION</Text>
                <Text style={styles.ultraModernBrandTitle}>Tell Us About You</Text>
                <Text style={styles.ultraModernBrandTagline}>
                  Help our AI understand your preferences to create the perfect bundle.
                </Text>
              </View>
              <View style={styles.ultraModernProductHeaderControls}>
                <TouchableOpacity 
                  style={styles.ultraModernBackButton}
                  onPress={() => {
                    setShowAiCurateView(null);
                    setIsDiscoveryMode(true); // Go back to discovery
                    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                      window.history.pushState({ page: 'discovery' }, '', window.location.pathname.split('?')[0]);
                    }
                  }}
                >
                  <Text style={styles.ultraModernBackButtonText}>← Discover</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Form elements will go here */}
          <ScrollView style={styles.aiFormScrollView}>
            <Text style={styles.aiFormSectionTitle}>Your Favorite Brands (select up to 5)</Text>
            <View style={styles.aiBrandSelectionContainer}>
              {availableBrands.map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.aiBrandChip,
                    aiSelectedBrands.includes(brand) && styles.aiBrandChipSelected
                  ]}
                  onPress={() => {
                    if (aiSelectedBrands.includes(brand)) {
                      setAiSelectedBrands(aiSelectedBrands.filter(b => b !== brand));
                    } else {
                      if (aiSelectedBrands.length < 5) {
                        setAiSelectedBrands([...aiSelectedBrands, brand]);
                      }
                    }
                  }}
                >
                  <Text style={styles.aiBrandChipText}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.aiFormSectionTitle}>Your Personal Style</Text>
            <View style={styles.aiPersonaStyleContainer}>
              {personas.map((persona) => (
                <TouchableOpacity
                  key={persona.id}
                  style={[
                    styles.aiPersonaStyleOption,
                    aiPersonaStyle === persona.id && styles.aiPersonaStyleOptionSelected
                  ]}
                  onPress={() => setAiPersonaStyle(persona.id)}
                >
                  <Text 
                    style={[
                      styles.aiPersonaStyleText,
                      aiPersonaStyle === persona.id && styles.aiPersonaStyleTextSelected
                    ]}
                  >
                    {persona.name}
                  </Text>
                  <Text 
                    style={[
                      styles.aiPersonaStyleDescription,
                      aiPersonaStyle === persona.id && styles.aiPersonaStyleDescriptionSelected
                    ]}
                  >
                    {persona.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.aiFormSectionTitle}>Your Budget Preference</Text>
            <View style={styles.aiBudgetContainer}>
              {[
                { id: 'low', label: 'Budget', range: 'Under $300', symbol: '$' },
                { id: 'medium', label: 'Moderate', range: '$300 - $1000', symbol: '$$' },
                { id: 'high', label: 'Premium', range: '$1000+', symbol: '$$$' }
              ].map(budget => (
                <TouchableOpacity
                  key={budget.id}
                  style={[
                    styles.aiBudgetOption,
                    aiPersonaBudget === budget.id && styles.aiBudgetOptionSelected
                  ]}
                  onPress={() => setAiPersonaBudget(budget.id)}
                >
                  <Text 
                    style={[
                      styles.aiBudgetText,
                      aiPersonaBudget === budget.id && styles.aiBudgetTextSelected
                    ]}
                  >
                    {budget.symbol} {budget.label}
                  </Text>
                  <Text 
                    style={[
                      styles.aiBudgetRange,
                      aiPersonaBudget === budget.id && styles.aiBudgetRangeSelected
                    ]}
                  >
                    {budget.range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.aiFormSectionTitle}>What are you looking for specifically?</Text>
            <TextInput
              style={styles.aiLookingForInput}
              placeholder="e.g., a new laptop for college, a gift for a friend, summer travel essentials..."
              value={aiLookingFor}
              onChangeText={setAiLookingFor}
              placeholderTextColor="rgba(45, 45, 45, 0.5)"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={[
                styles.aiGenerateButton,
                isAiLoading && styles.aiGenerateButtonLoading
              ]} 
              onPress={async () => { // Make onPress async
                setIsAiLoading(true);
                setAiErrorMessage(null); // Clear previous errors
                setAiGeneratedProducts([]); // Clear previous results

                try {
                  const generated = await fetchAiCuratedProducts(
                    aiSelectedBrands,
                    aiPersonaStyle,
                    aiPersonaBudget,
                    aiLookingFor
                  );
                  setAiGeneratedProducts(generated);
                  setShowAiCurateView('results');
                  // Push history state for AI Curation results
                  if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                    window.history.pushState({ page: 'aiCurateResults' }, '', '?view=ai-results');
                  }
                } catch (error) {
                  console.error("Error during AI Curation:", error);
                  setAiErrorMessage(error.message || "An unexpected error occurred while curating products.");
                  setShowAiCurateView('results'); // Still go to results view to show the error
                   if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                    window.history.pushState({ page: 'aiCurateResults', error: true }, '', '?view=ai-results&error=true');
                  }
                } finally {
                  setIsAiLoading(false);
                }
              }}
            >
              {isAiLoading ? (
                <Text style={styles.aiGenerateButtonText}>Curating...</Text>
              ) : (
                <Text style={styles.aiGenerateButtonText}>Generate My Collection</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : showAiCurateView === 'results' ? (
        // AI Curation Results View (To be built next)
        <View style={[styles.modernProductGrid, isSmallScreen && styles.modernProductGridSmallScreen]}> 
          <View style={[styles.ultraModernMainHeader, isSmallScreen && styles.ultraModernMainHeaderSmallScreen]}>
            <View style={styles.mainHeaderContent}>
              <View style={styles.brandSection}>
                <Text style={styles.ultraModernBrandLabel}>AI CURATED FOR YOU</Text>
                <Text style={[styles.ultraModernBrandTitle, isSmallScreen && styles.ultraModernBrandTitleSmallScreen]}>Your Personal Collection</Text>
                <Text style={[styles.ultraModernBrandTagline, isSmallScreen && styles.ultraModernBrandTaglineSmallScreen]}>
                  {aiGeneratedProducts.length > 0 ? `${aiGeneratedProducts.length} products` : aiErrorMessage ? 'Error' : 'No products'} • Based on your preferences: {aiSelectedBrands.join(', ')}, {aiPersonaStyle}, {aiPersonaBudget}
                </Text>
              </View>
              <View style={styles.ultraModernProductHeaderControls}>
                <TouchableOpacity 
                  style={[styles.ultraModernBackButton, isSmallScreen && styles.ultraModernBackButtonSmallScreen]}
                  onPress={() => {
                    setShowAiCurateView('form'); // Go back to the form
                     if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                      window.history.pushState({ page: 'aiCurateForm' }, '', '?view=ai-curate');
                    }
                  }}
                >
                  <Text style={styles.ultraModernBackButtonText}>← Edit Preferences</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {isAiLoading ? (
            <View style={styles.loadingContainer}>
              <Animated.View style={styles.loadingPulse} />
              <Text style={styles.loadingText}>Generating your curated collection...</Text>
            </View>
          ) : aiGeneratedProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyPrimary}>AI Couldn't Find Matches</Text>
              <Text style={styles.emptySecondary}>Please try adjusting your preferences.</Text>
            </View>
          ) : (
            <View style={styles.productGrid}>
              {aiGeneratedProducts.map((product) => (
                <View 
                  key={product.id} 
                  style={[
                    styles.modernProductCard, 
                    isSmallScreen && styles.modernProductCardSmallScreen // <<< Apply conditional style here
                  ]}
                >
                  {/* Using existing product card structure */}
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Text style={styles.favoriteIcon}>♡</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.brandName}>{product.brand}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{product.title}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.currentPrice}>{product.price}</Text>
                      <Text style={styles.rating}>★ {product.rating}</Text>
                    </View>
                    {product.whyBuyThis && (
                      <View style={styles.whyBuyThisContainer}>
                        <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                      </View>
                    )}
                    <View style={styles.productCardButtonContainer}>
                      <TouchableOpacity
                        style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                        onPress={() => openExternalLink(product.affiliateUrl)}
                      >
                        <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                        onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                      >
                        <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  discoveryContainer: {
    paddingHorizontal: 40,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
  },
  // TrendRadar styles
  trendRadarContainer: {
    marginBottom: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
  },
  trendRadarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 24,
  },
  trendRadarCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  trendRadarImageContainer: {
    height: 240,
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  trendRadarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  viralBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viralBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  trendOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
  },
  trendChangeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  trendRadarContent: {
    padding: 20,
  },
  trendRadarCategory: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  trendRadarTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  // Social bundles styles
  ultraModernSocialBundlesContainer: {
    marginBottom: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
  },
  ultraModernBundlesScroll: {
    paddingVertical: 10,
    marginTop: 20,
  },
  ultraModernBundleCard: {
    width: Platform.OS === 'web' ? 'auto' : '31%', // Responsive width
    aspectRatio: '4/5', // Elegant proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginRight: Platform.OS === 'web' ? 0 : 20, // Add margin for RN horizontal scroll, not for web grid
  },
  ultraModernBundleImageContainer: {
    height: '60%', // Image takes up 60% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernBundleCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernBundleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // Subtle overlay
  },
  ultraModernBundleContent: {
    height: '40%', // Content takes up 40% of card
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  ultraModernBundleTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  ultraModernBundleCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ultraModernCreatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  ultraModernCreatorName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginRight: 6,
  },
  ultraModernVerifiedBadge: {
    fontSize: 10,
    color: '#6366F1',
    backgroundColor: '#6366F115',
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  ultraModernBundleProductCount: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '400',
  },
  shopByVibeContainer: {
    marginBottom: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 24,
  },
  moodCard: {
    width: '48%',
    height: 200, // Increased height for better proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // More modern rounded corners
    marginBottom: 0,
    overflow: 'hidden',
    borderWidth: 0, // Remove border for cleaner look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, // Stronger shadow for better depth
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  moodCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F8F8',
    objectFit: 'cover', // For web - ensures proper aspect ratio
  },
  moodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))',
    backgroundColor: 'rgba(99,102,241,0.8)', // fallback
  },
  moodName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  moodDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 16,
  },
  categoryEntryContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingVertical: 10,
    marginTop: 10,
  },
  categoryItem: {
    width: 120, // Fixed width instead of percentage for consistency
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 80, // Increased size for better visibility
    height: 80,
    borderRadius: 16, // More modern rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden', // Ensure images stay within bounds
    backgroundColor: '#F8F8F8', // Fallback background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 36,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500', // Lighter weight
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea', // fallback
    padding: 60,
    borderRadius: 0,
    marginBottom: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -1,
    lineHeight: 56,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 50,
    lineHeight: 30,
    textAlign: 'center',
    maxWidth: 600,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroStatLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backToDiscoveryButton: {
    backgroundColor: COLORS.accent2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  backToDiscoveryText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 16,
  },
  // Right Side Panel Styles (Lyst-inspired)
  rightSidePanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  rightPanelContent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 400,
    backgroundColor: '#FAFAFA',
    borderLeftWidth: 1,
    borderLeftColor: '#E8E8E8',
    paddingHorizontal: 30,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  rightPanelHeader: {
    marginBottom: 30,
  },
  rightPanelTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  rightPanelSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 40,
    lineHeight: 24,
  },
  closeRightPanel: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  closeRightPanelText: {
    fontSize: 20,
    color: '#999999',
    fontWeight: '300',
  },
  rightPersonaList: {
    gap: 20,
  },
  rightPersonaItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  rightPersonaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightEmojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rightItemEmoji: {
    fontSize: 24,
  },
  rightPersonaImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rightPersonaText: {
    flex: 1,
  },
  rightItemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  rightItemDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontWeight: '400',
  },
  rightSelectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSelectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Section Header Styles (Lyst-inspired)
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  sectionAction: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 40,
    lineHeight: 26,
  },
  refinedHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    zIndex: 10,
  },
  brandSection: {
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  brandTagline: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 40,
    lineHeight: 24,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refinedSearchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontWeight: '300',
  },
  searchIconButton: {
    marginLeft: 10,
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    flex: 1,
    marginRight: 10,
  },
  selectorEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
  },
  selectorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  defaultSelectorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  premiumSearchContainer: {
    flex: 1,
    marginRight: 20,
    marginBottom: 20,
  },
  searchGlow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    position: 'relative',
    overflow: 'hidden',
    // Web-specific neon glow effects
    ...(Platform.OS === 'web' && {
      boxShadow: `
        0 0 20px rgba(99, 102, 241, 0.3),
        0 0 40px rgba(99, 102, 241, 0.2),
        0 0 60px rgba(99, 102, 241, 0.1),
        inset 0 0 20px rgba(99, 102, 241, 0.05)
      `,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      transition: 'all 0.3s ease',
    }),
  },
  premiumSearchInput: {
    flex: 1,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '400',
    letterSpacing: -0.2,
    outline: 'none',
    ...(Platform.OS === 'web' && {
      '&:focus': {
        outline: 'none',
      },
    }),
  },
  premiumSearchButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    ...(Platform.OS === 'web' && {
      boxShadow: `
        0 0 15px rgba(99, 102, 241, 0.4),
        0 0 30px rgba(99, 102, 241, 0.2)
      `,
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `
          0 0 20px rgba(99, 102, 241, 0.5),
          0 0 40px rgba(99, 102, 241, 0.3)
        `,
      },
    }),
  },
  premiumSearchIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 34,
    textAlign: 'left',
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  brandText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  modernProductGrid: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  gridHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingBottom: 10,
  },
  gridHeaderContent: {
    flexDirection: 'row', // Keep as row for overall layout
    justifyContent: 'space-between', // To push button to the right
    alignItems: 'flex-start', // Align items to the top for the new stacked title
    paddingBottom: 10, // Keep some padding below the entire header block
  },
  personaGridHeaderContainer: {
    // This container will now hold the label, title, and subtitle
    marginBottom: 0, // Remove bottom margin as it's handled by gridHeaderContent padding
  },
  personaGridHeaderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999', // Matches "TRENDING" label
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4, // Space between label and main title
  },
  personaGridHeaderTitle: { // For the main persona name, styled like "What's Hot Now"
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 4, // Add space between title and subtitle
  },
  gridTitle: { // Will be repurposed for the main title part or removed if not needed
    fontSize: 24, // Keep as a fallback or for non-persona views
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  gridSubtitle: { // This will be used for the product count under the main title
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    // marginBottom: 5, // Removed, spacing handled by container/title
  },
  elegantBackButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  elegantBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modernProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 24,
    minHeight: 520,
  },
  modernProductCardSmallScreen: { // New style for small screens
    width: '98%', 
  },
  studentProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // Consistent with modernProductCard
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, // Softer shadow
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA', // Light, subtle border
    overflow: 'hidden',
  },
  studentProductCardSmallScreen: { // New style for student cards on small screens
    width: '98%',
  },
  productImageContainer: {
    height: 280,
    position: 'relative',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 15,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#FF9500',
  },
  viralBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viralBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productInfo: {
    padding: 15,
  },
  brandName: {
    fontSize: 12,
    color: COLORS.primaryPeachy,
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  trendingStatsText: {
    fontSize: 12,
    color: COLORS.midGray,
    lineHeight: 16,
  },
  hotTakeContainer: {
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
  },
  hotTakeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  hotTakeText: {
    fontSize: 12,
    color: COLORS.midGray,
    lineHeight: 16,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 34,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  rating: {
    fontSize: 12,
    color: '#FF9500',
  },
  shopButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  studentContent: {
    marginBottom: 10,
  },
  studentReviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  studentReview: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  whyStudentsLoveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  whyStudentsLove: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  studentShopButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  studentShopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noProductsMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.accent1,
    textAlign: 'center',
    marginBottom: 10,
  },
  noProductsSubtext: {
    fontSize: 16,
    color: COLORS.accent2,
    textAlign: 'center',
    lineHeight: 22,
  },

  // REFINED Student Persona Specific Product Card Styles (Ultra Luxury / Minimalist)
  studentProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // Consistent with modernProductCard
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, // Softer shadow
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA', // Light, subtle border
    overflow: 'hidden',
  },
  studentImageContainer: { // Same as productImageContainer for consistency
    height: 200,
    position: 'relative',
    backgroundColor: '#F8F8F8', // Consistent placeholder color
  },
  studentInfo: {
    padding: 20, // More padding for a spacious feel
  },
  studentBrandName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#555555', // Medium grey
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentProductName: {
    fontSize: 18, // Slightly larger for better readability
    fontWeight: '500', // Refined weight
    color: '#2C3E50', // Dark, sophisticated grey/blue
    marginBottom: 10,
    lineHeight: 24,
  },
  studentPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentCurrentPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: '#00796B', // Deep teal/green for value, but sophisticated
  },
  studentRating: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFA000', // Muted gold/amber for rating star
  },
  studentExclusiveContent: {
    marginTop: 10, // Add some space before this section
    marginBottom: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Very subtle separator
  },
  studentReviewText: {
    fontSize: 14,
    color: '#555555',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 10,
  },
  studentWhyLoveText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  studentDealButton: {
    backgroundColor: '#2C3E50', // Dark sophisticated grey/blue
    paddingVertical: 12,
    paddingHorizontal: 15, 
    borderRadius: 6, // Slightly more refined radius
    alignItems: 'center',
    marginTop: 10, // Space before button
  },
  studentDealButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  studentGridTitle: { // Refined student grid title
    fontSize: 26, // Slightly reduced for elegance
    fontWeight: '300', // Lighter font weight for luxury feel
    color: '#2C3E50',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'sans-serif-light',
    letterSpacing: 0.5,
  },
  studentGridSubtitle: { // Refined student grid subtitle
    fontSize: 14,
    color: '#555555',
    fontWeight: '400',
  },
  // NEON Back Button Styles (Inspired by Search Bar)
  neonBackButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12, // Match search button
    backgroundColor: '#FFFFFF', // Light base
    borderWidth: 1, // Subtle border
    borderColor: '#6366F180', // Neon color with some transparency
    shadowColor: '#6366F1', // This shadow will apply on native
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' ? { // Web-specific base styles
      cursor: 'pointer',
      transition: 'all 0.2s ease', // Basic transition for web
    } : {}),
  },
  neonBackButtonText: {
    color: '#6366F1', // Neon color for text
    fontSize: 14,
    fontWeight: '500', // Refined weight
    letterSpacing: 0.5,
  },
  // Specific style for the empty state back button to allow centering if needed
  emptyStateNeonBackButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    borderRadius: 12, 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#6366F180', 
    shadowColor: '#6366F1', // This shadow will apply on native
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
    ...(Platform.OS === 'web' ? { // Web-specific base styles
      cursor: 'pointer',
      transition: 'all 0.2s ease', // Basic transition for web
    } : {}),
  },
  // Styles for Persona Exclusive Content in modernProductCard
  personaExclusiveContentContainer: {
    marginTop: 10,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Subtle separator
  },
  personaInsightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  personaInsightText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  // Styles for New Minimalist Buttons
  productCardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  newBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: COLORS.primaryPeachy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  minimalistButtonShared: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  minimalistButtonPrimary: {
    backgroundColor: '#007AFF',
    borderWidth: 0,
  },
  minimalistButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  buttonTextShared: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#007AFF',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0', // Lighter separator
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 16,
  },
  buyNowButton: { // This style might be repurposed or removed if the new buttons fully replace it
    backgroundColor: COLORS.accent1, // Or primary neon color
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flexGrow: 1, // Allow it to take available space if other items are fixed
    marginLeft: 10, // if actionButtons are present
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },

  // Back of the card styles
  cardContentBack: {
    padding: 20,
    minHeight: 380,
  },
  backButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.darkGray,
  },
  backProductTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  backProductPrice: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  highlightsContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
  },
  highlightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  highlightsText: {
    fontSize: 14,
    color: COLORS.midGray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 15,
  },
  insightBar: {
    marginBottom: 15,
  },
  insightBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  insightBarLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  insightBarValue: {
    fontSize: 14,
    color: COLORS.midGray,
    fontWeight: '600',
  },
  insightBarTrack: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  insightBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  backFooter: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  whyBuyThisContainer: {
    marginBottom: 10,
  },
  whyBuyThisText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign: 'left',
    padding: 12,
    backgroundColor: 'linear-gradient(135deg, #F8F9FF 0%, #E8EFFF 100%)', // Light gradient background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8F4',
    letterSpacing: 0.3,
    // For web, add these properties
    ...(Platform.OS === 'web' ? {
      backgroundImage: 'linear-gradient(135deg, #F8F9FF 0%, #E8EFFF 100%)',
      backgroundColor: '#F8F9FF', // Fallback
    } : {
      backgroundColor: '#F8F9FF', // Solid color for mobile
    }),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    objectFit: 'cover', // For web - prevents image stretching
    backgroundColor: '#F8F8F8', // Fallback background
  },
  ultraModernSectionHeader: {
    backgroundColor: 'transparent',
    padding: 0,
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 48,
    paddingBottom: 0,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  ultraModernSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ultraModernSectionTitle: {
    fontSize: 42,
    fontWeight: '200',
    color: '#1A1A1A',
    letterSpacing: -1.2,
    lineHeight: 48,
    marginBottom: 16,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' : 'System',
  },
  ultraModernSectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 24,
    maxWidth: 480,
    fontStyle: 'italic',
  },
  modernSeeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  modernSeeAllText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  modernSeeAllArrow: {
    fontSize: 16,
    color: '#1A1A1A',
    transform: [{ translateX: 0 }],
    transition: 'transform 0.2s ease',
  },
  ultraModernMoodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns for better spacing
    gap: '32px',
    marginTop: 0,
    ...(Platform.OS !== 'web' ? {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      // No gap property for React Native, margin on items will handle it
    } : {}),
  },
  ultraModernMoodCard: {
    width: Platform.OS === 'web' ? 'auto' : '31%', // Responsive width
    aspectRatio: '4/5', // Elegant proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginBottom: Platform.OS === 'web' ? 0 : 20, // Add margin for RN flexbox grid
  },
  ultraModernMoodImageContainer: {
    height: '60%', // Image takes up 60% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernMoodCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernMoodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // Subtle overlay
  },
  ultraModernMoodContent: {
    height: '40%', // Content takes up 40% of card
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  moodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  ultraModernMoodName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    flex: 1,
  },
  cursiveDescription: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? '"Playfair Display", Georgia, serif' : 'System',
  },
  philosophyText: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '400',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ultraModernMainHeader: {
    backgroundColor: 'transparent',
    padding: 0,
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    marginBottom: 48,
    paddingBottom: 0,
  },
  mainHeaderContent: {
    flexDirection: 'column',
    gap: 40,
  },
  brandSection: {
    marginBottom: 0,
  },
  ultraModernHeaderControls: {
    flexDirection: 'column',
    gap: 24,
  },
  ultraModernProductHeaderControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 24,
  },
  ultraModernSearchContainer: {
    width: '100%',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  ultraModernSearchInput: {
    flex: 1,
    height: 56,
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '400',
    letterSpacing: -0.2,
    outline: 'none',
    ...(Platform.OS === 'web' && {
      outline: 'none',
    }),
  },
  ultraModernSearchButton: {
    padding: 8,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    fontSize: 20,
    color: '#666666',
  },
  ultraModernSelectorRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  ultraModernSelector: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ultraModernSelectorActive: {
    borderColor: '#6366F1',
    backgroundColor: '#F8F9FF',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ultraModernSelectorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  ultraModernDefaultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  selectorTextContainer: {
    flex: 1,
  },
  ultraModernSelectorLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ultraModernSelectorValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 18,
  },
  ultraModernBrandLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ultraModernBrandTitle: {
    fontSize: 42,
    fontWeight: '200',
    color: '#1A1A1A',
    letterSpacing: -1.2,
    lineHeight: 48,
    marginBottom: 16,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' : 'System',
  },
  ultraModernBrandTagline: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 24,
    maxWidth: 480,
    fontStyle: 'italic',
  },
  ultraModernCategoryContainer: {
    marginBottom: 120,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 40,
    paddingTop: 60,
    shadowColor: 'transparent',
  },
  ultraModernCategoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns for better spacing
    gap: '32px',
    marginTop: 0,
    ...(Platform.OS !== 'web' ? {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      // No gap property for React Native, margin on items will handle it
    } : {}),
  },
  ultraModernCategoryItem: {
    width: Platform.OS === 'web' ? 'auto' : '31%', // Responsive width
    aspectRatio: '4/5', // Elegant proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginBottom: Platform.OS === 'web' ? 0 : 20, // Add margin for RN flexbox grid
  },
  ultraModernCategoryIcon: {
    height: '60%', // Image takes up 60% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernCategoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernCategoryName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    padding: 24,
    paddingBottom: 8,
  },
  ultraModernCategoryDescription: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
    fontFamily: Platform.OS === 'web' ? '"Playfair Display", Georgia, serif' : 'System',
  },
  ultraModernTrendRadarContainer: {
    marginBottom: 120,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 40,
    paddingTop: 60,
    shadowColor: 'transparent',
  },
  ultraModernTrendRadarGrid: {
    // marginTop: 20, // Using ScrollView's own spacing if needed
    // gap: 24, // Using marginRight on cards for horizontal scroll
    // For React Native, horizontal scroll setup
    ...(Platform.OS !== 'web' && {
      // Default to vertical grid on RN unless overridden by small screen ScrollView
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
    // For Web, keep it as a grid or flex container that wraps
    ...(Platform.OS === 'web' && {
      display: 'flex',
      flexDirection: 'row', 
      flexWrap: 'wrap', // Default to wrap for larger screens
      justifyContent: 'space-between',
      gap: 24, 
    }),
  },
  ultraModernTrendRadarGridSmallScreen: { // This style applies to the View when isSmallScreen is true BUT NOT using ScrollView
    // If we ever have a non-ScrollView small screen version, this would apply.
    // For now, it's not directly used by the ScrollView setup.
    // We might use it for the ScrollView's contentContainerStyle if padding is needed.
    flexDirection: 'row', // Ensures items are in a row for ScrollView logic to work if this style is repurposed
    // No flexWrap: 'nowrap' here, ScrollView handles that
    // justifyContent: 'flex-start', // ScrollView handles this
  },
  ultraModernTrendRadarGridSmallScreenScrollViewContent: { // Style for ScrollView contentContainerStyle
    paddingHorizontal: 20, // Example: Add some padding to the start/end of the scrollable content
    paddingVertical: 10,   // Example: Vertical padding if needed
  },
  ultraModernTrendRadarCard: {
    width: Platform.OS === 'web' ? 'auto' : '48%', // Responsive width
    aspectRatio: '3/2', // Wider aspect ratio for trending items
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginRight: Platform.OS === 'web' ? 0 : 20, // Add margin for RN horizontal scroll, not for web grid
  },
  ultraModernTrendRadarImageContainer: {
    height: '70%', // Image takes up 70% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernTrendRadarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernViralBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ultraModernViralBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ultraModernTrendOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ultraModernTrendChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ultraModernTrendRadarContent: {
    height: '30%', // Content takes up 30% of card
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ultraModernTrendRadarCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  ultraModernTrendRadarTitle: {
    fontSize: 18, // Default size
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  ultraModernTrendRadarSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  ultraModernTrendPercentageContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ultraModernTrendPercentage: {
    color: '#FFFFFF',
    fontSize: 13, // Default size
    fontWeight: 'bold',
    marginRight: 4,
  },
  ultraModernTrendLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12, // Default size
    fontWeight: '500',
  },
  ultraModernBundleName: {
    fontSize: 20, // Default size
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  ultraModernBundleCuratorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom
    paddingTop: 8,
  },
  ultraModernBundleCuratorAvatar: {
    width: 24, // Default size
    height: 24, // Default size
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: COLORS.lightGray, // Placeholder
  },
  ultraModernBundleCuratorName: {
    fontSize: 13, // Default size
    color: COLORS.midGray,
    fontWeight: '500',
  },
  ultraModernTrendRadarCardSmallScreen: {
    // width is handled dynamically inline for horizontal scroll, so remove fixed width here.
    aspectRatio: '1.1', // Adjusted for horizontal scroll, makes it slightly wider than tall (was 16/9)
    marginBottom: 0, // No bottom margin for horizontal scroll items (was 20)
    // marginRight is handled dynamically inline for horizontal scroll items
  },
  // New Small Screen Styles for Trend Radar Content
  ultraModernTrendRadarTitleSmallScreen: {
    fontSize: 22, // Increased size
  },
  ultraModernTrendPercentageSmallScreen: {
    fontSize: 15, // Increased size
  },
  ultraModernTrendLabelSmallScreen: {
    fontSize: 14, // Increased size
  },
  // New Small Screen Styles for Social Bundle Content
  ultraModernBundleNameSmallScreen: {
    fontSize: 22, // Increased size
  },
  ultraModernBundleCuratorAvatarSmallScreen: {
    width: 30, // Increased size
    height: 30, // Increased size
    borderRadius: 15,
  },
  ultraModernBundleCuratorNameSmallScreen: {
    fontSize: 15, // Increased size
  },
  // Responsive margins for main section containers
  ultraModernSectionContainerMarginSmallScreen: {
    marginBottom: 60, // Reduced margin for small screens
  },
  ultraModernDiscoveryContainerPaddingSmallScreen: { // For the main discovery container itself
    paddingHorizontal: 20, // Reduced horizontal padding for the whole discovery page on small screens
  },
  ultraModernMoodNameSmallScreen: {
    fontSize: 20, // Increased from 16px
    paddingBottom: 4,
  },
  cursiveDescriptionSmallScreen: {
    fontSize: 15, // Increased from 13px
    lineHeight: 20, // Adjusted line height
  },
  philosophyTextSmallScreen: {
    fontSize: 12, // Increased from 10px
    lineHeight: 16, // Adjusted line height
  },
  moodEmojiSmallScreen: { // New style for emoji on small screens
    fontSize: 24, // Increased size
  },
  ultraModernMoodContentSmallScreen: { // New style for mood content area on small screens
    padding: 16, // Reduced padding from 24px
    height: 'auto', // More flexible height
  },
  ultraModernCategoryGridSmallScreen: {
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns for small screens
    gap: '20px', // Slightly smaller gap for smaller screens
    ...(Platform.OS !== 'web' && {
      // On React Native, if using flexbox for this grid on small screens:
      // No specific changes needed if the base ultraModernCategoryGrid already handles RN row wrapping well.
      // If category cards have fixed widths, might adjust justifyContent or rely on margins.
    }),
  },
  ultraModernCategoryNameSmallScreen: {
    fontSize: 18, // Increased from 16px
    paddingBottom: 2, // Reduced padding
    paddingHorizontal: 8, // Added horizontal padding adjustment
  },
  ultraModernCategoryDescriptionSmallScreen: {
    fontSize: 15, // Increased from 13px
    lineHeight: 20, // Adjusted line height
    paddingHorizontal: 8, // Added horizontal padding adjustment
    paddingBottom: 12, // Reduced bottom padding
  },
  ultraModernBundleCardSmallScreen: { // Around line 5626
    // width is handled dynamically inline (screenWidth * 0.75)
    aspectRatio: '4/5', // Good proportion for image + text content
    marginBottom: 0,    // No bottom margin for items in a horizontal scroll
    // marginRight is likely handled by the ScrollView's children or could be added dynamically if needed
  },
  ultraModernMoodsGridSmallScreen: { // This was recently added correctly
    flexDirection: 'row', // Ensures items are in a row
    // For a wrapped row on small screens (if not using ScrollView)
    // flexWrap: 'wrap', 
    // justifyContent: 'space-around',
    // Remove grid properties for small screen if relying on flex for ScrollView or wrapped row
    // gridTemplateColumns: undefined, 
    // gap: 16, 
  },
  ultraModernMoodsGridSmallScreenScrollViewContent: { // Style for ScrollView contentContainerStyle
    paddingHorizontal: 20, // Add some padding to the start/end of the scrollable content
    paddingVertical: 10,   // Vertical padding if needed
  },
  ultraModernMoodCardSmallScreen: { // Specific style for mood cards on small screens (when in horizontal scroll)
      // width is handled dynamically inline
      aspectRatio: '4/5', // Keeping the original elegant proportion, adjust if text overflows
      marginBottom: 0, // No bottom margin for horizontal scroll items
      // marginRight is handled dynamically inline
  },

  // AI Curation Styles - White with Electric Neon Glow
  ultraModernAiCurationContainer: {
    backgroundColor: '#FFFFFF', // Pure white background
    paddingVertical: 80,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginVertical: 40,
    marginHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)', // Electric cyan border
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    // Add electric buzzing neon glow effect
    boxShadow: '0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 50px rgba(0, 255, 255, 0.05)',
    animation: 'electricBuzz 2s ease-in-out infinite alternate, neonPulse 3s ease-in-out infinite',
  },

  // AI Curation form container
  aiCurateFormContainer: {
    backgroundColor: '#FFFFFF', // Pure white background
    minHeight: '100vh',
    paddingTop: 0,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
  },

  // AI Curation form elements
  aiFormScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },

  aiFormSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A', // Dark text for white background
    marginBottom: 20,
    marginTop: 30,
    letterSpacing: -0.3,
    textShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
  },

  aiBrandSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },

  aiBrandChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    marginRight: 8,
    marginBottom: 8,
    transition: 'all 0.3s ease',
  },

  aiBrandChipSelected: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderColor: '#00FFFF',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
    transform: 'scale(1.05)',
    animation: 'electricFlicker 1.5s ease-in-out infinite',
  },

  aiBrandChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },

  aiBrandChipTextSelected: {
    color: '#00DDDD',
    fontWeight: '600',
    textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
  },

  aiPersonaStyleContainer: {
    marginBottom: 30,
  },

  aiPersonaStyleOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    marginBottom: 12,
    transition: 'all 0.3s ease',
  },

  aiPersonaStyleOptionSelected: {
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    borderColor: '#00FFFF',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    animation: 'electricFlicker 1.8s ease-in-out infinite',
  },

  aiPersonaStyleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  aiPersonaStyleTextSelected: {
    color: '#00DDDD',
    fontWeight: '600',
    textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
  },

  aiPersonaStyleDescription: {
    fontSize: 13,
    color: 'rgba(26, 26, 26, 0.7)',
    lineHeight: 18,
  },

  aiPersonaStyleDescriptionSelected: {
    color: 'rgba(0, 221, 221, 0.9)',
  },

  aiBudgetContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },

  aiBudgetOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },

  aiBudgetOptionSelected: {
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    borderColor: '#00FFFF',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
    animation: 'electricFlicker 2s ease-in-out infinite',
  },

  aiBudgetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  aiBudgetTextSelected: {
    color: '#00DDDD',
    textShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
  },

  aiBudgetRange: {
    fontSize: 12,
    color: 'rgba(26, 26, 26, 0.6)',
  },

  aiBudgetRangeSelected: {
    color: 'rgba(0, 221, 221, 0.8)',
  },

  aiLookingForInput: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: 'System',
    marginBottom: 40,
  },

  aiLookingForInputFocused: {
    borderColor: '#00FFFF',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
  },

  aiGenerateButton: {
    backgroundColor: '#00FFFF', // Electric cyan color
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    // Electric neon glow effect with buzzing
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.5), 0 4px 20px rgba(0, 221, 221, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    animation: 'electricBuzz 1.5s ease-in-out infinite alternate, neonPulse 2.5s ease-in-out infinite',
  },

  aiGenerateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
  },

  aiGenerateButtonLoading: {
    opacity: 0.7,
  },

  aiResultsContainer: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },

  aiResultsHeader: {
    marginBottom: 30,
    textAlign: 'center',
  },

  aiResultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadow: '0 0 15px rgba(0, 255, 215, 0.3)',
  },

  aiResultsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },

  aiProductGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  },

  aiProductCard: {
    width: 'calc(33.333% - 14px)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },

  aiProductCardHover: {
    borderColor: '#00FFD7',
    boxShadow: '0 0 20px rgba(0, 255, 215, 0.2)',
    transform: 'translateY(-5px)',
  },

  aiProductImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  aiProductTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },

  aiProductBrand: {
    fontSize: 14,
    color: '#00FFD7',
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  aiProductWhy: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },

  aiProductPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00FFD7',
    marginBottom: 16,
    textShadow: '0 0 5px rgba(0, 255, 215, 0.3)',
  },

  aiProductButton: {
    backgroundColor: 'rgba(0, 255, 215, 0.1)',
    borderWidth: 1,
    borderColor: '#00FFD7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },

  aiProductButtonText: {
    color: '#00FFD7',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  errorContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0095F6',
    marginBottom: 20,
    opacity: 0.8,
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Visual Search Modal Styles - Refined Minimalist Theme
  visualSearchOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: hexToRgba(COLORS.darkGray, 0.6),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    // backdropFilter: 'blur(2px)', // Subtle blur
  },
  visualSearchContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    margin: 20,
    maxWidth: 550,
    width: '90%',
    maxHeight: '90%',
    shadowColor: hexToRgba(COLORS.darkGray, 0.08),
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 10,
    overflow: 'hidden',
  },
  visualSearchTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0,
    textTransform: 'none',
  },
  visualSearchWorkspace: {
    minHeight: 400,
  },
  visualSearchUploadArea: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexToRgba(COLORS.primaryPeachy, 0.1),
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.borderLight,
    minHeight: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  visualSearchInstructions: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    letterSpacing: 0,
  },
  visualSearchButtonsColumn: {
    flexDirection: 'column',
    marginBottom: 16,
    alignItems: 'stretch',
  },
  visualSearchButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 48,
  },
  visualSearchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  visualSearchError: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  visualSearchAnalyzing: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  visualSearchImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  visualSearchAnalyzingOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  visualSearchAnalyzingText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
  },
  visualSearchLoader: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498db',
  },
  visualSearchDetected: {
    alignItems: 'center',
  },
  visualSearchImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  visualSearchBoundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
    padding: 5,
  },
  visualSearchObjectLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  visualSearchSelectionInstructions: {
    alignItems: 'center',
    marginBottom: 20,
  },
  visualSearchSelectionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  visualSearchSelectedCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  visualSearchActionButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  visualSearchActionButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  visualSearchActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  visualSearchSearching: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  visualSearchSearchingText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 20,
  },
  visualSearchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  visualSearchCloseButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  visualSearchCloseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  visualSearchResetButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  visualSearchResetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Modern Visual Search Styles - Elegant & Minimalist
  modernVisualSearchOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: hexToRgba(COLORS.black, 0.4),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
  },
  modernVisualSearchContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 28,
    margin: 20,
    maxWidth: 520,
    width: '92%',
    maxHeight: '88%',
    shadowColor: hexToRgba(COLORS.black, 0.15),
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    shadowOpacity: 1,
    elevation: 16,
    overflow: 'hidden',
  },
  modernVisualSearchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modernVisualSearchTitleArea: {
    flex: 1,
  },
  modernVisualSearchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernVisualSearchSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '400',
    lineHeight: 20,
  },
  modernVisualSearchCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: hexToRgba(COLORS.darkGray, 0.06),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  modernVisualSearchCloseText: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: '300',
    lineHeight: 20,
  },
  modernVisualSearchWorkspace: {
    minHeight: 360,
  },
  modernVisualSearchUploadArea: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: hexToRgba(COLORS.darkGray, 0.02),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: hexToRgba(COLORS.darkGray, 0.08),
    minHeight: 320,
    transition: 'all 0.2s ease',
  },
  modernVisualSearchUploadAreaActive: {
    borderColor: hexToRgba(COLORS.primary, 0.3),
    backgroundColor: hexToRgba(COLORS.primary, 0.03),
  },
  modernVisualSearchUploadIcon: {
    fontSize: 32,
    marginBottom: 16,
  },
  modernVisualSearchUploadTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  modernVisualSearchUploadSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    fontWeight: '400',
  },
  modernVisualSearchButtonGroup: {
    flexDirection: 'column',
    width: '100%',
    maxWidth: 280,
    marginBottom: 20,
  },
  modernVisualSearchPrimaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: hexToRgba(COLORS.primary, 0.25),
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  modernVisualSearchPrimaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.1,
  },
  modernVisualSearchSecondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: hexToRgba(COLORS.darkGray, 0.12),
  },
  modernVisualSearchSecondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    letterSpacing: -0.1,
  },
  modernVisualSearchHelpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  modernVisualSearchError: {
    fontSize: 13,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  modernVisualSearchAnalyzing: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
    paddingVertical: 40,
  },
  modernVisualSearchImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: hexToRgba(COLORS.darkGray, 0.04),
    marginBottom: 32,
    overflow: 'hidden',
  },
  modernVisualSearchPreviewImage: {
    width: '100%',
    height: '100%',
  },
  modernVisualSearchAnalyzingContent: {
    alignItems: 'center',
  },
  modernVisualSearchLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modernVisualSearchLoaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
    // Animation would be handled by CSS
  },
  modernVisualSearchAnalyzingText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  modernVisualSearchAnalyzingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  modernVisualSearchResults: {
    paddingTop: 8,
  },
  modernVisualSearchResultsHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modernVisualSearchResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernVisualSearchResultsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  modernVisualSearchResultsList: {
    maxHeight: 280,
    marginBottom: 20,
  },
  modernVisualSearchResultItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: hexToRgba(COLORS.darkGray, 0.08),
    shadowColor: hexToRgba(COLORS.darkGray, 0.04),
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  modernVisualSearchResultImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: hexToRgba(COLORS.darkGray, 0.04),
    marginRight: 12,
  },
  modernVisualSearchResultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  modernVisualSearchResultTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  modernVisualSearchResultBrand: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '400',
  },
  modernVisualSearchResultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 2,
  },
  modernVisualSearchResultMatch: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modernVisualSearchMoreResults: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modernVisualSearchMoreText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modernVisualSearchViewAllButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: hexToRgba(COLORS.primary, 0.25),
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  modernVisualSearchViewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: -0.1,
  },
  modernVisualSearchFooter: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: hexToRgba(COLORS.darkGray, 0.08),
    alignItems: 'center',
  },
  modernVisualSearchResetButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modernVisualSearchResetText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  });

// Add electric buzzing CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes electricBuzz {
      0% { 
        box-shadow: 0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 50px rgba(0, 255, 255, 0.05);
        border-color: rgba(0, 255, 255, 0.3);
      }
      25% { 
        box-shadow: 0 0 60px rgba(0, 255, 255, 0.5), inset 0 0 60px rgba(0, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.2);
        border-color: rgba(0, 255, 255, 0.6);
      }
      50% { 
        box-shadow: 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 40px rgba(0, 255, 255, 0.08);
        border-color: rgba(0, 255, 255, 0.4);
      }
      75% { 
        box-shadow: 0 0 70px rgba(0, 255, 255, 0.6), inset 0 0 70px rgba(0, 255, 255, 0.12), 0 0 30px rgba(255, 255, 255, 0.3);
        border-color: rgba(0, 255, 255, 0.7);
      }
      100% { 
        box-shadow: 0 0 55px rgba(0, 255, 255, 0.4), inset 0 0 55px rgba(0, 255, 255, 0.06);
        border-color: rgba(0, 255, 255, 0.5);
      }
    }
    
    @keyframes neonPulse {
      0%, 100% { 
        filter: brightness(1) contrast(1);
      }
      50% { 
        filter: brightness(1.1) contrast(1.2);
      }
    }
    
    @keyframes electricFlicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.95; }
      75% { opacity: 1.05; }
    }
  `;
  document.head.appendChild(style);
}

// Placeholder components to fix missing component errors
const FloatingPersonaSelector = ({ personas, selectedPersona, onSelectPersona, visible }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.floatingPersonaSelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {personas.map((persona) => (
          <TouchableOpacity
            key={persona.id}
            style={[
              styles.floatingPersonaItem,
              selectedPersona?.id === persona.id && styles.floatingPersonaItemSelected
            ]}
            onPress={() => onSelectPersona(persona)}
          >
            <Text style={styles.floatingPersonaEmoji}>{persona.emoji}</Text>
            <Text style={styles.floatingPersonaName}>{persona.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const TrendRadar = ({ items, onItemPress, onSeeAll }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 768;

  // Inline styles for small screens - TODO: Refactor to StyleSheet
  const cardWidthSmallScreen = isSmallScreen ? screenWidth * 0.75 : undefined;
  const cardMarginRightSmallScreen = isSmallScreen ? 16 : 0;

  // Adjusted font sizes for card content on small screens
  const cardTitleSmallScreenStyle = isSmallScreen ? { fontSize: 16, lineHeight: 20 } : {};
  const cardSubtitleSmallScreenStyle = isSmallScreen ? { fontSize: 12, lineHeight: 16 } : {};
  const cardPercentageSmallScreenStyle = isSmallScreen ? { fontSize: 14 } : {};
  const cardLabelSmallScreenStyle = isSmallScreen ? { fontSize: 11 } : {};
  const cardContentAreaSmallScreenStyle = isSmallScreen ? { paddingTop: 10, paddingBottom: 10, paddingHorizontal: 10 } : {};

  const radarItemsContent = items.map((item, index) => (
    <TouchableOpacity 
      key={index} 
      style={[
        styles.ultraModernTrendRadarCard,
        isSmallScreen && styles.ultraModernTrendRadarCardSmallScreen, // Applies small screen specific base styles like aspectRatio
        isSmallScreen && { width: cardWidthSmallScreen, marginRight: cardMarginRightSmallScreen } // Dynamic width and margin
      ]}
      onPress={() => onItemPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.ultraModernTrendRadarImage} resizeMode="cover" />
      <View style={styles.ultraModernTrendRadarOverlay} />
      <View style={[styles.ultraModernTrendRadarContent, cardContentAreaSmallScreenStyle]}>
        <Text style={[styles.ultraModernTrendRadarTitle, cardTitleSmallScreenStyle]} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.ultraModernTrendRadarSubtitle, cardSubtitleSmallScreenStyle]} numberOfLines={1} ellipsizeMode="tail">
            {item.subtitle}
          </Text>
        )}
      </View>
      {item.trendingStats && (
          <View style={styles.ultraModernTrendPercentageContainer}>
            <Text style={[styles.ultraModernTrendPercentage, cardPercentageSmallScreenStyle]}>
              {item.trendingStats.match(/↗\s*(\d+%)/)?.[1] || ''}
            </Text>
            <Text style={[styles.ultraModernTrendLabel, cardLabelSmallScreenStyle]}>
              {item.hotTake ? 'DEEP DIVE' : (item.trendingStats.includes('searches') ? 'Surge' : 'Viral')}
            </Text>
          </View>
      )}
    </TouchableOpacity>
  ));

  return (
    <View style={styles.ultraModernTrendRadarContainer}>
      <View style={styles.ultraModernSectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text style={styles.ultraModernSectionLabel}>TRENDING</Text>
          <Text style={styles.ultraModernSectionTitle}>What's Hot Now 🔥</Text>
        </View>
        {/* <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllButtonText}>View All Trends</Text>
        </TouchableOpacity> */}
      </View>
      {isSmallScreen ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ultraModernTrendRadarGridSmallScreenScrollViewContent}>
          {radarItemsContent}
        </ScrollView>
      ) : (
        <View style={styles.ultraModernTrendRadarGrid}>
          {radarItemsContent}
        </View>
      )}
    </View>
  );
};

// Persona Selection Panel Component
const PersonaSelectionPanel = ({ visible, onClose, personas, selectedPersona, onSelectPersona }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.rightSidePanel}>
      <TouchableOpacity style={styles.panelBackdrop} onPress={onClose} />
      <View style={styles.rightPanelContent}>
        <View style={styles.rightPanelHeader}>
          <Text style={styles.rightPanelTitle}>Choose Your Style</Text>
          <TouchableOpacity style={styles.closeRightPanel} onPress={onClose}>
            <Text style={styles.closeRightPanelText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.rightPanelSubtitle}>
          Personalize your discovery experience
        </Text>
        
        <View style={styles.rightPersonaList}>
          {personas.map((persona) => (
            <TouchableOpacity
              key={persona.id}
              style={[
                styles.rightPersonaItem,
                selectedPersona?.id === persona.id && { 
                  backgroundColor: `${persona.color}15`,
                  borderColor: persona.color 
                }
              ]}
              onPress={() => {
                onSelectPersona(persona);
                onClose();
              }}
            >
              <View style={styles.rightPersonaContent}>
                <View style={[styles.rightEmojiCircle, { backgroundColor: `${persona.color}20` }]}>
                  <Image 
                    source={{ uri: persona.icon }}
                    style={styles.rightPersonaImage}
                  />
                </View>
                <View style={styles.rightPersonaText}>
                  <Text style={styles.rightItemName}>{persona.name}</Text>
                  <Text style={styles.rightItemDescription}>{persona.description}</Text>
                </View>
                {selectedPersona?.id === persona.id && (
                  <View style={[styles.rightSelectedBadge, { backgroundColor: persona.color }]}>
                    <Text style={styles.rightSelectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Life Moment Selection Panel Component
const LifeMomentSelectionPanel = ({ visible, onClose, lifeMoments, selectedLifeMoment, onSelectLifeMoment }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.rightSidePanel}>
      <TouchableOpacity style={styles.panelBackdrop} onPress={onClose} />
      <View style={styles.rightPanelContent}>
        <View style={styles.rightPanelHeader}>
          <Text style={styles.rightPanelTitle}>Choose Your Moment</Text>
          <TouchableOpacity style={styles.closeRightPanel} onPress={onClose}>
            <Text style={styles.closeRightPanelText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.rightPanelSubtitle}>
          Find products perfect for your life stage
        </Text>
        
        <View style={styles.rightPersonaList}>
          {lifeMoments.map((moment) => (
            <TouchableOpacity
              key={moment.id}
              style={[
                styles.rightPersonaItem,
                selectedLifeMoment?.id === moment.id && { 
                  backgroundColor: `${moment.color}15`,
                  borderColor: moment.color 
                }
              ]}
              onPress={() => {
                onSelectLifeMoment(moment);
                onClose();
              }}
            >
              <View style={styles.rightPersonaContent}>
                <View style={[styles.rightEmojiCircle, { backgroundColor: `${moment.color}20` }]}>
                  <Image 
                    source={{ uri: moment.icon }}
                    style={styles.rightPersonaImage}
                  />
                </View>
                <View style={styles.rightPersonaText}>
                  <Text style={styles.rightItemName}>{moment.name}</Text>
                  <Text style={styles.rightItemDescription}>{moment.description}</Text>
                </View>
                {selectedLifeMoment?.id === moment.id && (
                  <View style={[styles.rightSelectedBadge, { backgroundColor: moment.color }]}>
                    <Text style={styles.rightSelectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Placeholder function for fetching AI curated products
async function fetchAiCuratedProducts(selectedBrands, personaStyle, personaBudget, lookingFor) {
  console.log("Fetching AI Curated Products with:", {
    selectedBrands,
    personaStyle,
    personaBudget,
    lookingFor
  });

  let prompt = `You are "Curator," an expert AI shopping assistant specializing in ultra-modern, minimalist, and high-quality tech, lifestyle, and design products. Your goal is to curate a personalized shopping bundle for a user.

User Preferences:
- Liked Brands: ${selectedBrands.length > 0 ? selectedBrands.join(', ') : 'None specified'}
- Desired Style: ${personaStyle || 'Not specified'}
- Budget Indication: ${personaBudget || 'Not specified'}
- Specifically LookingFor: ${lookingFor || 'A general collection based on style and brands'}

Based on these preferences, please generate a list of 3-5 unique product recommendations. For each product, provide:
1.  title: A concise and appealing product title (e.g., "Minimalist Smart Desk Lamp").
2.  brand: The brand of the product (e.g., "Luminoir"). If it's a conceptual product, invent a plausible brand name.
3.  whyBuyThis: A short, compelling sales pitch (1-2 sentences, max 150 characters) highlighting its key benefit or unique selling proposition, using modern language and potentially an emoji if appropriate (e.g., "💡 Smart illumination meets sleek design. Control brightness and color temperature via app for the perfect ambiance.").
4.  category: A relevant category (e.g., 'home', 'tech', 'audio', 'accessories', 'lifestyle', 'design').
5.  price: An estimated price as a string (e.g., "$129.99").
6.  image: A URL to a high-quality, relevant placeholder image (600x600px). You can use Unsplash URLs like 'https://images.unsplash.com/photo-XXXXXXXXXXXXX?w=600&h=600&fit=crop&crop=center'. Try to pick images that match the product concept.
7.  affiliateUrl: A placeholder URL like 'https://example.com/product-link'.

Return the response as a JSON array of objects. Example product object:
{
  "title": "Aura Smart Diffuser",
  "brand": "SereneScents",
  "whyBuyThis": "✨ Create a calming oasis. Ultrasonic tech meets app-controlled aromatherapy for ultimate relaxation.",
  "category": "home",
  "price": "$89.00",
  "image": "https://images.unsplash.com/photo-1604275980648-363d53333884?w=600&h=600&fit=crop&crop=center",
  "affiliateUrl": "https://example.com/aura-diffuser"
}

Do not include any introductory text or explanations outside of the JSON array itself. The output must be only the JSON array.
`;

  // Read API Key from environment variable
  const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
  const API_URL = 'https://api.anthropic.com/v1/messages'; // Standard Claude Messages API endpoint

  if (!CLAUDE_API_KEY) {
    console.error("ERROR: EXPO_PUBLIC_CLAUDE_API_KEY is not set. Please ensure it is defined in your .env file for local development, or in Netlify environment variables for production.");
    console.error("To fix for local development: Create a .env file in your project root with EXPO_PUBLIC_CLAUDE_API_KEY=your_actual_key_here and restart your development server.");
    console.error("To fix for Netlify: Go to Site settings > Build & deploy > Environment, and add EXPO_PUBLIC_CLAUDE_API_KEY with your key, then redeploy.");
    throw new Error("AI API key is missing. Please see console for setup instructions.");
  }

  console.log("---- ATTEMPTING ACTUAL LLM API CALL ----");
  console.log("Prompt being sent (first 500 chars):", prompt.substring(0,500));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01' 
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229", 
        max_tokens: 2048, 
        messages: [
          { role: "user", content: prompt } 
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LLM API Error Response:', errorData);
      let detailedErrorMessage = 'Failed to get a valid response from AI.';
      if (errorData && errorData.error && errorData.error.message) {
        detailedErrorMessage = `AI Error: ${errorData.error.message}`;
      } else if (errorData && errorData.detail) {
        detailedErrorMessage = `AI Error: ${errorData.detail}`;
      }
      throw new Error(detailedErrorMessage);
    }

    const data = await response.json();
    console.log("LLM API Success. Full response data:", data);
    
    if (data.content && data.content.length > 0 && data.content[0].text) {
      const productJsonString = data.content[0].text;
      console.log("LLM Response content (productJsonString):", productJsonString);
      try {
        let cleanedJsonString = productJsonString.trim();
        if (cleanedJsonString.startsWith('```json')) {
          cleanedJsonString = cleanedJsonString.substring(7);
          if (cleanedJsonString.endsWith('```')) {
            cleanedJsonString = cleanedJsonString.substring(0, cleanedJsonString.length - 3);
          }
        } else if (cleanedJsonString.startsWith('```')) {
            cleanedJsonString = cleanedJsonString.substring(3);
            if (cleanedJsonString.endsWith('```')) {
                cleanedJsonString = cleanedJsonString.substring(0, cleanedJsonString.length - 3);
            }
        }
        
        const generatedProducts = JSON.parse(cleanedJsonString.trim());
        console.log("Parsed generated products:", generatedProducts);
        return generatedProducts;
      } catch (parseError) {
        console.error("Error parsing JSON response from LLM:", parseError);
        console.error("Raw LLM response string that failed to parse:", productJsonString);
        throw new Error("AI returned an invalid JSON format. Check the console for the raw response. You may need to adjust the prompt or the AI model settings to ensure it *only* returns a valid JSON array.");
      }
    } else {
      console.error("Unexpected response structure from LLM. 'data.content[0].text' is missing or invalid:", data);
      throw new Error("AI returned an unexpected response structure. Check console for details.");
    }

  } catch (error) {
    console.error('Error fetching AI curated products:', error);
    if (error instanceof Error) {
        throw error; 
    } else {
        throw new Error('An unknown error occurred while communicating with the AI.');
    }
  }
}

// Initialize products on component mount
// ... existing code ...