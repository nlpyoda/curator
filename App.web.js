import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, Image, PanResponder, Vibration, Easing } from 'react-native';

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
};

// Mock data for testing
const mockProducts = [
  {
    id: '1',
    title: 'MacBook Pro 16"',
    price: 2499,
    rating: 4.8,
    description: 'Latest MacBook Pro with M3 Pro chip, 16GB RAM, and 512GB SSD.',
    link: 'https://www.apple.com/macbook-pro',
    tags: ['pro', 'premium', 'power-user', 'creative'],
    category: 'laptop',
    whyBuy: 'Industry-leading performance for demanding creative tasks with the M3 Pro chip.',
    insights: [
      { label: 'Performance', value: 98, color: '#FF5757' },
      { label: 'Battery Life', value: 92, color: '#32D74B' },
      { label: 'Portability', value: 75, color: '#4E7CFF' },
      { label: 'Value', value: 70, color: '#BF5AF2' }
    ]
  },
  {
    id: '2',
    title: 'MacBook Air M2',
    price: 1199,
    rating: 4.7,
    description: 'Ultra-thin and lightweight MacBook Air with M2 chip.',
    link: 'https://www.apple.com/macbook-air',
    tags: ['lightweight', 'portable', 'student', 'casual'],
    category: 'laptop',
    whyBuy: 'Perfect balance of performance and portability for everyday tasks and light creative work.',
    insights: [
      { label: 'Performance', value: 82, color: '#FF5757' },
      { label: 'Battery Life', value: 95, color: '#32D74B' },
      { label: 'Portability', value: 96, color: '#4E7CFF' },
      { label: 'Value', value: 85, color: '#BF5AF2' }
    ]
  },
  {
    id: '3',
    title: 'MacBook Pro 14"',
    price: 1999,
    rating: 4.9,
    description: 'Powerful yet portable MacBook Pro with M3 chip.',
    link: 'https://www.apple.com/macbook-pro',
    tags: ['pro', 'premium', 'power-user', 'balanced'],
    category: 'laptop',
    whyBuy: 'Ideal for professionals who need performance without sacrificing portability.',
    insights: [
      { label: 'Performance', value: 95, color: '#FF5757' },
      { label: 'Battery Life', value: 90, color: '#32D74B' },
      { label: 'Portability', value: 85, color: '#4E7CFF' },
      { label: 'Value', value: 78, color: '#BF5AF2' }
    ]
  },
  {
    id: '4',
    title: 'MacBook Air M1',
    price: 999,
    rating: 4.6,
    description: 'Affordable MacBook Air with the efficient M1 chip.',
    link: 'https://www.apple.com/macbook-air',
    tags: ['budget', 'student', 'casual', 'entry-level'],
    category: 'laptop',
    whyBuy: 'Best value MacBook with exceptional battery life and solid performance for students.',
    insights: [
      { label: 'Performance', value: 75, color: '#FF5757' },
      { label: 'Battery Life', value: 96, color: '#32D74B' },
      { label: 'Portability', value: 93, color: '#4E7CFF' },
      { label: 'Value', value: 95, color: '#BF5AF2' }
    ]
  },
  // Baby Products
  {
    id: '5',
    title: 'Ergobaby Omni 360 Carrier',
    price: 179,
    rating: 4.8,
    description: 'All-in-one ergonomic baby carrier with 4 carrying positions for newborns to toddlers.',
    link: 'https://ergobaby.com',
    tags: ['newborn', 'baby', 'carrier', 'premium', 'ergonomic'],
    category: 'baby',
    whyBuy: 'Exceptionally comfortable with lumbar support for parents and ergonomic positioning for baby.',
    insights: [
      { label: 'Comfort', value: 95, color: '#FF5757' },
      { label: 'Durability', value: 92, color: '#32D74B' },
      { label: 'Versatility', value: 98, color: '#4E7CFF' },
      { label: 'Value', value: 85, color: '#BF5AF2' }
    ]
  },
  {
    id: '6',
    title: 'Nanit Pro Smart Baby Monitor',
    price: 299,
    rating: 4.7,
    description: 'Smart baby monitor with breathing monitoring, sleep tracking and HD video.',
    link: 'https://www.nanit.com',
    tags: ['baby', 'monitor', 'smart-home', 'premium', 'tech'],
    category: 'baby',
    whyBuy: 'Best sleep insights with breathing monitoring for peace of mind and sleep coaching.',
    insights: [
      { label: 'Video Quality', value: 96, color: '#FF5757' },
      { label: 'Smart Features', value: 98, color: '#32D74B' },
      { label: 'Ease of Use', value: 92, color: '#4E7CFF' },
      { label: 'Value', value: 78, color: '#BF5AF2' }
    ]
  },
  // Graduation Gifts
  {
    id: '7',
    title: 'Apple Watch Series 9',
    price: 399,
    rating: 4.9,
    description: 'Advanced health monitoring and productivity in a sleek wearable.',
    link: 'https://www.apple.com/apple-watch-series-9',
    tags: ['smartwatch', 'fitness', 'tech', 'gift', 'premium'],
    category: 'wearables',
    whyBuy: 'Perfect graduation gift combining style, fitness tracking and productivity features.',
    insights: [
      { label: 'Features', value: 94, color: '#FF5757' },
      { label: 'Battery Life', value: 85, color: '#32D74B' },
      { label: 'Design', value: 96, color: '#4E7CFF' },
      { label: 'Value', value: 82, color: '#BF5AF2' }
    ]
  },
  {
    id: '8',
    title: 'Sony WH-1000XM5 Headphones',
    price: 349,
    rating: 4.8,
    description: 'Industry-leading noise cancellation with exceptional audio quality.',
    link: 'https://www.sony.com/headphones',
    tags: ['audio', 'noise-cancelling', 'premium', 'gift', 'travel'],
    category: 'audio',
    whyBuy: 'Best-in-class noise cancellation with premium comfort for study, work or travel.',
    insights: [
      { label: 'Sound Quality', value: 96, color: '#FF5757' },
      { label: 'Noise Cancelling', value: 98, color: '#32D74B' },
      { label: 'Comfort', value: 95, color: '#4E7CFF' },
      { label: 'Battery Life', value: 93, color: '#BF5AF2' }
    ]
  }
];

// Persona definitions
const personas = [
  {
    id: 'creative',
    name: 'Creative Pro',
    emoji: '🎨',
    description: 'For designers, video editors & creators',
    tagWeights: { premium: 2, pro: 2, creative: 3, power: 1.5 },
    color: '#FF5757',
    insights: ['Performance', 'Display Quality']
  },
  {
    id: 'student',
    name: 'Student',
    emoji: '🎓',
    description: 'Budget-friendly options + portability',
    tagWeights: { student: 2, budget: 1.5, portable: 1.5, entry: 1.2 },
    color: '#4E7CFF',
    insights: ['Battery Life', 'Value']
  },
  {
    id: 'business',
    name: 'Business Pro',
    emoji: '💼',
    description: 'Reliable performance, balance oriented',
    tagWeights: { premium: 1.5, balanced: 1.8, pro: 1.3 },
    color: '#32D74B',
    insights: ['Reliability', 'Performance']
  },
  {
    id: 'traveler',
    name: 'Digital Nomad',
    emoji: '✈️',
    description: 'Ultra-portable for on-the-go productivity',
    tagWeights: { portable: 2, lightweight: 2, balanced: 1.5 },
    color: '#BF5AF2',
    insights: ['Portability', 'Battery Life']
  }
];

// Life Moments definitions
const lifeMoments = [
  {
    id: 'new-parent',
    name: 'New Parent',
    emoji: '👶',
    description: 'Essential products for baby & parents',
    primaryCategory: 'baby',
    tagWeights: { baby: 3, newborn: 2.5, ergonomic: 1.8, monitor: 2, safety: 2.5 },
    color: '#FF9500',
    insights: ['Safety', 'Ease of Use']
  },
  {
    id: 'graduation',
    name: 'Recent Graduate',
    emoji: '🎓',
    description: 'Gifts & tools for the next chapter',
    primaryCategory: null,
    tagWeights: { gift: 2, premium: 1.5, tech: 2, portable: 1.5, productivity: 2 },
    color: '#5856D6',
    insights: ['Value', 'Features']
  },
  {
    id: 'home-setup',
    name: 'Home Office Setup',
    emoji: '🏠',
    description: 'Create an ideal WFH environment',
    primaryCategory: null,
    tagWeights: { ergonomic: 2, productivity: 2.5, comfort: 2, premium: 1.5 },
    color: '#2CB9B0',
    insights: ['Comfort', 'Productivity']
  },
  {
    id: 'travel-prep',
    name: 'Travel Preparation',
    emoji: '🧳',
    description: 'Must-haves for your next adventure',
    primaryCategory: null,
    tagWeights: { portable: 3, travel: 2.5, lightweight: 2, noise: 1.8, battery: 2 },
    color: '#FF2D55',
    insights: ['Portability', 'Durability']
  }
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
    color: '#1D1D1F',
    description: 'Clean lines, neutral colors, clutter-free design',
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=500&auto=format'
  },
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    emoji: '🌿',
    color: '#8A9A5B',
    description: 'Cozy, rustic aesthetic inspired by romanticized rural life',
    coverImage: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?q=80&w=500&auto=format'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '⚡',
    color: '#FF00FF',
    description: 'Futuristic, neon-lit tech aesthetic with dystopian flair',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500&auto=format'
  },
  {
    id: 'clean-girl',
    name: 'Clean Girl',
    emoji: '✨',
    color: '#E8C4C4',
    description: 'Effortless, minimal, polished aesthetic with neutral tones',
    coverImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=500&auto=format'
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

// Add trending data for TrendRadar
const trendRadarData = [
  {
    id: 'tr-1',
    title: 'Sony WH-1000XM5',
    category: 'Electronics',
    percentageChange: 28,
    status: 'rising',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format'
  },
  {
    id: 'tr-2',
    title: 'Dyson Air Purifier',
    category: 'Home',
    percentageChange: 16,
    status: 'rising',
    image: 'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=200&auto=format'
  },
  {
    id: 'tr-3',
    title: 'Away Luggage',
    category: 'Travel',
    percentageChange: 45,
    status: 'viral',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=200&auto=format'
  },
  {
    id: 'tr-4',
    title: 'Kindle Paperwhite',
    category: 'Reading',
    percentageChange: 12,
    status: 'rising',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&auto=format'
  }
];

// Product categories for visual entry points
const productCategories = [
  { id: 'tech', name: 'Tech', emoji: '📱', color: '#007AFF' },
  { id: 'audio', name: 'Audio', emoji: '🎧', color: '#FF2D55' },
  { id: 'home', name: 'Home', emoji: '🏠', color: '#5856D6' },
  { id: 'travel', name: 'Travel', emoji: '✈️', color: '#FF9500' },
  { id: 'fitness', name: 'Fitness', emoji: '💪', color: '#32D74B' },
  { id: 'beauty', name: 'Beauty', emoji: '✨', color: '#AF52DE' }
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
  const [showARView, setShowARView] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const { title, price, rating, description, whyBuy, insights } = product;
  
  // Check if product is apparel and can be tried on
  const isApparel = product.category === 'clothing' || 
                   product.category === 'shoes' || 
                   product.category === 'accessories';
  
  // Calculate dynamic theme color based on product
  const themeColor = insights && insights.length > 0 
    ? insights[0].color 
    : COLORS.accent1;
  
  // Configure pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      // Swipe left to flip
      if (gestureState.dx < -50) {
        handleFlip();
        try { Vibration.vibrate(10); } catch (e) {}
      }
      // Swipe up to show AR view
      else if (gestureState.dy < -50) {
        if (isApparel) {
          handleVirtualTryOn();
        } else {
          handleARView();
        }
        try { Vibration.vibrate(15); } catch (e) {}
      }
    },
  });
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      onPress && onPress(product);
    }
  };
  
  const handleARView = () => {
    setShowARView(true);
    try { Vibration.vibrate(10); } catch (e) {}
  };
  
  const handleProductPreview = () => {
    setShowProductPreview(true);
    try { Vibration.vibrate(10); } catch (e) {}
  };
  
  const handleVirtualTryOn = () => {
    setShowVirtualTryOn(true);
    try { Vibration.vibrate(10); } catch (e) {}
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        isTrending ? styles.trendingProductCard : null,
        { borderColor: `${themeColor}30` } 
      ]}
      onPress={handleFlip}
      activeOpacity={0.9}
      {...panResponder.panHandlers}
    >
      {!isFlipped ? (
        // Front of card
        <View style={styles.cardContent}>
          <View style={styles.cardImageContainer}>
            <View style={[styles.cardImagePlaceholder, {backgroundColor: `${themeColor}10`}]}>
              <Text style={styles.cardImageEmoji}>
                {product.category === 'laptop' ? '💻' : 
                 product.category === 'baby' ? '👶' : 
                 product.category === 'wearables' ? '⌚' :
                 product.category === 'audio' ? '🎧' :
                 product.category === 'clothing' ? '👕' :
                 product.category === 'shoes' ? '👟' :
                 product.category === 'accessories' ? '👜' : '📱'}
              </Text>
            </View>
            
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>★ {rating}</Text>
            </View>
            
            <View style={[styles.priceTag, {backgroundColor: themeColor}]}>
              <Text style={styles.priceTagText}>${price.toLocaleString()}</Text>
            </View>
            
            {/* Show either AR or Try-On button based on product type */}
            {isApparel ? (
              <TouchableOpacity 
                style={styles.tryOnButton}
                onPress={handleVirtualTryOn}
              >
                <Text style={styles.tryOnButtonText}>Try On</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.arButton}
                onPress={handleARView}
              >
                <Text style={styles.arButtonText}>AR View</Text>
              </TouchableOpacity>
            )}
            
            {/* Preview button */}
            <TouchableOpacity 
              style={[
                styles.previewButton,
                isApparel && { right: 70 } // Adjust position if Try On button is present
              ]}
              onPress={handleProductPreview}
            >
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>
          
          {/* Rest of the front card content remains the same */}
          <View style={styles.uniqloStyleHeader}>
            <Text style={styles.uniqloStyleCategory}>{product.category.toUpperCase()}</Text>
            <Text style={styles.productTitle}>{title}</Text>
          </View>
          
          <View style={styles.cardBody}>
            <Text style={styles.productDescription} numberOfLines={2}>
              {description}
            </Text>
            
            <View style={styles.insightPreview}>
              {insights.slice(0, 2).map((insight, index) => (
                <View key={index} style={styles.insightPreviewItem}>
                  <View 
                    style={[
                      styles.insightDot, 
                      { backgroundColor: insight.color }
                    ]} 
                  />
                  <Text style={styles.insightPreviewText}>
                    {insight.label}: {insight.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.cardActions}>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  try { Vibration.vibrate(5); } catch (e) {}
                }}
              >
                <Text style={styles.actionButtonText}>♥</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  try { Vibration.vibrate(5); } catch (e) {}
                }}
              >
                <Text style={styles.actionButtonText}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  try { Vibration.vibrate(5); } catch (e) {}
                }}
              >
                <Text style={styles.actionButtonText}>✈</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.gestureHint}>
              <Text style={styles.gestureHintText}>← Swipe for details</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => {
                try { Vibration.vibrate(5); } catch (e) {}
              }}
            >
              <Text style={styles.saveButtonText}>🔖</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.likesRow}>
            <Text style={styles.likesText}>
              Liked by <Text style={styles.boldText}>128 people</Text>
            </Text>
          </View>
          
          <TouchableOpacity onPress={handleFlip}>
            <Text style={styles.viewCommentsText}>View product details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Back of card content
        <View style={styles.cardContentBack}>
          {/* Back card content remains the same */}
          <View style={[styles.backHeader, {backgroundColor: `${themeColor}15`}]}>
            <View style={styles.backHeaderContent}>
              <TouchableOpacity onPress={handleFlip}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.backHeaderTitle}>Product Details</Text>
            </View>
          </View>
          
          <ScrollView style={styles.backScrollContent}>
            <Text style={styles.backProductTitle}>{title}</Text>
            <Text style={[styles.backProductPrice, {color: themeColor}]}>
              ${price.toLocaleString()}
            </Text>
            
            <View style={styles.specsContainer}>
              <Text style={styles.specsTitle}>Specifications</Text>
              <View style={styles.specsList}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Category</Text>
                  <Text style={styles.specValue}>{product.category}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Rating</Text>
                  <Text style={styles.specValue}>★ {rating}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Tags</Text>
                  <Text style={styles.specValue}>{product.tags.join(', ')}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.highlightsContainer}>
              <Text style={styles.highlightsTitle}>Why People Love It</Text>
              <Text style={styles.highlightsText}>{whyBuy}</Text>
            </View>
            
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Key Insights</Text>
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightBar}>
                  <View style={styles.insightBarHeader}>
                    <Text style={styles.insightBarLabel}>{insight.label}</Text>
                    <Text style={styles.insightBarValue}>{insight.value}/100</Text>
                  </View>
                  <View style={styles.insightBarTrack}>
                    <View 
                      style={[
                        styles.insightBarFill, 
                        { width: `${insight.value}%`, backgroundColor: insight.color }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.gestureHintContainer}>
              <Text style={styles.gestureHintText}>
                Swipe up for {isApparel ? 'virtual try-on' : 'AR view'}
              </Text>
            </View>
          </ScrollView>
          
          <View style={[styles.backFooter, {borderTopColor: `${themeColor}30`}]}>
            <TouchableOpacity
              style={[styles.buyNowButton, {backgroundColor: themeColor}]}
              onPress={() => {
                try { Vibration.vibrate(20); } catch (e) {}
                openExternalLink(product.link);
              }}
            >
              <Text style={styles.buyNowButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* AR Viewer Overlay */}
      <WebXRARViewer 
        product={product}
        visible={showARView}
        onClose={() => setShowARView(false)}
      />
      
      {/* Product Preview Overlay */}
      <ProductPreviewOverlay 
        product={product}
        visible={showProductPreview}
        onClose={() => setShowProductPreview(false)}
      />
      
      {/* Virtual Try-On Overlay */}
      <VirtualTryOn 
        product={product}
        visible={showVirtualTryOn}
        onClose={() => setShowVirtualTryOn(false)}
      />
    </TouchableOpacity>
  );
};

// Add Visual Search feature
const VisualSearch = ({ visible, onClose, onSearch }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [analyzeStage, setAnalyzeStage] = useState('initial'); // initial, analyzing, detected, searching
  const [error, setError] = useState(null);
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
    setDetectedObjects([]);
    setSelectedObjects([]);
    setAnalyzeStage('initial');
    setError(null);
  };
  
  // Handle file selection for visual search
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
    setAnalyzeStage('analyzing');
    setError(null);
    
    // In a real app, you would upload this to a server for object detection
    // For demo, we'll simulate the process
    analyzeImage(imageUrl);
  };
  
  // Simulate image analysis for object detection
  const analyzeImage = (imageUrl) => {
    // In a real app, this would be an API call to an AI model
    // that detects objects in the image
    setTimeout(() => {
      // Simulate detected objects
      const mockObjects = [
        { id: '1', label: 'Shirt', confidence: 0.92, boundingBox: { x: 120, y: 80, width: 200, height: 220 } },
        { id: '2', label: 'Jeans', confidence: 0.88, boundingBox: { x: 130, y: 320, width: 180, height: 250 } },
        { id: '3', label: 'Shoes', confidence: 0.85, boundingBox: { x: 150, y: 580, width: 140, height: 90 } },
        { id: '4', label: 'Watch', confidence: 0.78, boundingBox: { x: 350, y: 180, width: 60, height: 60 } }
      ];
      setDetectedObjects(mockObjects);
      setAnalyzeStage('detected');
    }, 2000);
  };
  
  // Handle object selection toggle
  const toggleObjectSelection = (objectId) => {
    if (selectedObjects.includes(objectId)) {
      setSelectedObjects(selectedObjects.filter(id => id !== objectId));
    } else {
      setSelectedObjects([...selectedObjects, objectId]);
    }
  };
  
  // Trigger file input click
  const selectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Take a screenshot
  const takeScreenshot = () => {
    alert('In a real app, this would capture a screenshot of your current screen.');
    // For demo, we'll just use a mock image
    setSelectedImage('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format');
    setAnalyzeStage('analyzing');
    analyzeImage('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format');
  };
  
  // Perform search with selected objects
  const performSearch = () => {
    if (selectedObjects.length === 0) {
      alert('Please select at least one item to search for.');
      return;
    }
    
    setAnalyzeStage('searching');
    
    // Get selected object labels
    const selectedLabels = detectedObjects
      .filter(obj => selectedObjects.includes(obj.id))
      .map(obj => obj.label);
    
    // In a real app, this would trigger a search with the selected objects
    setTimeout(() => {
      // Call the search callback with the selected objects
      onSearch && onSearch(selectedLabels);
      onClose();
    }, 1000);
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.visualSearchOverlay}>
      <View style={styles.visualSearchContent}>
        <Text style={styles.visualSearchTitle}>
          Visual Search
        </Text>
        
        <View style={styles.visualSearchWorkspace}>
          {analyzeStage === 'initial' ? (
            // Image selection UI
            <View style={styles.visualSearchUploadArea}>
              <Text style={styles.visualSearchInstructions}>
                Upload a photo or take a screenshot to search for similar items.
              </Text>
              
              <View style={styles.visualSearchButtonsRow}>
                <TouchableOpacity 
                  style={styles.visualSearchButton}
                  onPress={selectImage}
                >
                  <Text style={styles.visualSearchButtonText}>Upload Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.visualSearchButton}
                  onPress={takeScreenshot}
                >
                  <Text style={styles.visualSearchButtonText}>Take Screenshot</Text>
                </TouchableOpacity>
              </View>
              
              {error && (
                <Text style={styles.visualSearchError}>{error}</Text>
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
            // Analyzing state
            <View style={styles.visualSearchAnalyzing}>
              {selectedImage && (
                <Image 
                  source={{ uri: selectedImage }}
                  style={styles.visualSearchImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.visualSearchAnalyzingOverlay}>
                <Text style={styles.visualSearchAnalyzingText}>
                  Analyzing image...
                </Text>
                <View style={styles.visualSearchLoader} />
              </View>
            </View>
          ) : analyzeStage === 'detected' ? (
            // Object selection state
            <View style={styles.visualSearchDetected}>
              <View style={styles.visualSearchImageContainer}>
                {selectedImage && (
                  <Image 
                    source={{ uri: selectedImage }}
                    style={styles.visualSearchImage}
                    resizeMode="contain"
                  />
                )}
                
                {/* Object bounding boxes */}
                {detectedObjects.map(obj => (
                  <TouchableOpacity
                    key={obj.id}
                    style={[
                      styles.visualSearchBoundingBox,
                      {
                        left: obj.boundingBox.x,
                        top: obj.boundingBox.y,
                        width: obj.boundingBox.width,
                        height: obj.boundingBox.height,
                        borderColor: selectedObjects.includes(obj.id) ? '#4CAF50' : '#FF9800',
                        backgroundColor: selectedObjects.includes(obj.id) ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'
                      }
                    ]}
                    onPress={() => toggleObjectSelection(obj.id)}
                  >
                    <Text style={styles.visualSearchObjectLabel}>
                      {obj.label} ({Math.round(obj.confidence * 100)}%)
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.visualSearchSelectionInstructions}>
                <Text style={styles.visualSearchSelectionText}>
                  Tap on the items you want to search for
                </Text>
                <Text style={styles.visualSearchSelectedCount}>
                  {selectedObjects.length} item(s) selected
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.visualSearchActionButton,
                  selectedObjects.length === 0 && styles.visualSearchActionButtonDisabled
                ]}
                onPress={performSearch}
                disabled={selectedObjects.length === 0}
              >
                <Text style={styles.visualSearchActionButtonText}>
                  Search for Selected Items
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Searching state
            <View style={styles.visualSearchSearching}>
              <Text style={styles.visualSearchSearchingText}>
                Searching for similar products...
              </Text>
              <View style={styles.visualSearchLoader} />
            </View>
          )}
        </View>
        
        <View style={styles.visualSearchFooter}>
          <TouchableOpacity 
            style={styles.visualSearchCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.visualSearchCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {analyzeStage !== 'initial' && analyzeStage !== 'searching' && (
            <TouchableOpacity 
              style={styles.visualSearchResetButton}
              onPress={resetState}
            >
              <Text style={styles.visualSearchResetButtonText}>Start Over</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Update the main App component
export default function App() {
  // State for user selections
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedLifeMoment, setSelectedLifeMoment] = useState(null);
  
  // State for app functionality
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPersonaPanel, setShowPersonaPanel] = useState(false);
  const [showLifeMomentPanel, setShowLifeMomentPanel] = useState(false);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(true);
  const [products, setProducts] = useState([]);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  
  // Animation values for header
  const scrollY = useState(new Animated.Value(0))[0];
  const headerHeight = 300;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight / 3],
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
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoadingAnimation(true);
    setIsSearching(true);
    setErrorMessage(null);
    
    // Simulate search delay
    setTimeout(() => {
      // Search through products (case insensitive)
      const query = searchQuery.toLowerCase();
      const searchResults = mockProducts.filter(product => {
        // Check if the search query is in title, description, or tags
        return (
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
      
      if (searchResults.length === 0) {
        setErrorMessage('No products found matching your search. Try another query.');
      }
      
      // Apply persona preferences to search results
      setProducts(sortProducts(searchResults));
      setIsDiscoveryMode(false);
      setIsLoadingAnimation(false);
      setIsSearching(false);
    }, 1500);
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
    setShowPersonaPanel(false);
    
    // Apply persona-based personalization
    setIsLoadingAnimation(true);
    
    setTimeout(() => {
      setProducts(sortProducts([...mockProducts]));
      setIsLoadingAnimation(false);
      setIsDiscoveryMode(false);
    }, 1000);
  };
  
  // Handle life moment selection
  const handleLifeMomentSelect = (moment) => {
    setSelectedLifeMoment(moment);
    setShowLifeMomentPanel(false);
    
    // Apply life moment-based personalization
    setIsLoadingAnimation(true);
    
    setTimeout(() => {
      // Get trending products for this life moment if available
      if (moment && trendingByLifeMoment[moment.id]) {
        const trendingForMoment = trendingByLifeMoment[moment.id];
        
        // Combine trending items with regular products and sort
        const combinedProducts = [...trendingForMoment, ...mockProducts];
        setProducts(sortProducts(combinedProducts));
      } else {
        setProducts(sortProducts([...mockProducts]));
      }
      
      setIsLoadingAnimation(false);
      setIsDiscoveryMode(false);
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
  const handleVisualSearch = (searchLabels) => {
    setIsLoadingAnimation(true);
    
    // In a real app, this would query your product database with the detected objects
    // For demo, we'll filter the mock products to simulate a search
    
    // Simple filter by matched categories or tags
    const matchedProducts = mockProducts.filter(product => {
      // Check if product category matches any of the search labels
      if (searchLabels.some(label => product.category.toLowerCase().includes(label.toLowerCase()))) {
        return true;
      }
      
      // Check if any product tags match the search labels
      if (product.tags.some(tag => 
        searchLabels.some(label => tag.toLowerCase().includes(label.toLowerCase()))
      )) {
        return true;
      }
      
      // Check title and description for matches
      if (searchLabels.some(label => 
        product.title.toLowerCase().includes(label.toLowerCase()) ||
        product.description.toLowerCase().includes(label.toLowerCase())
      )) {
        return true;
      }
      
      return false;
    });
    
    // Update UI with search results
    setTimeout(() => {
      // Apply any persona/life moment personalization to the results
      setProducts(sortProducts(matchedProducts));
      setIsDiscoveryMode(false);
      setIsLoadingAnimation(false);
      
      if (matchedProducts.length === 0) {
        setErrorMessage('No products found matching your visual search. Try another image or select different items.');
      }
    }, 1000);
  };
  
  return (
    <View style={[
      styles.container,
      darkMode && styles.containerDark
    ]}>
      <Animated.View 
        style={[
          styles.header, 
          darkMode && styles.headerDark,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <Text style={[styles.appTitle, darkMode && styles.appTitleDark]}>curator</Text>
            <View style={styles.headerActions}>
              {/* Visual Search button */}
              <TouchableOpacity 
                onPress={() => setShowVisualSearch(true)} 
                style={styles.visualSearchButton}
              >
                <Text style={styles.visualSearchButtonIcon}>🔍📷</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeToggle}>
                <Text style={styles.darkModeIcon}>{darkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.appSubtitle, darkMode && styles.appSubtitleDark]}>
            AI-driven product discovery
          </Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={[
                styles.searchBar, 
                darkMode && styles.searchBarDark,
                isSearching && styles.searchInputLoading
              ]}
              placeholder="Search products..."
              placeholderTextColor={darkMode ? '#999' : '#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity 
              style={[
                styles.searchButton,
                isSearching && styles.searchButtonLoading
              ]} 
              onPress={handleSearch}
              disabled={isSearching}
            >
              <Text style={styles.searchButtonText}>
                {isSearching ? '...' : 'Search'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.selectionControls}>
          <TouchableOpacity 
            style={styles.selectionButton} 
            onPress={() => setShowPersonaPanel(true)}
          >
            <Text style={styles.selectionButtonText}>
              {selectedPersona ? selectedPersona.name : 'Select Persona'}
            </Text>
            <Text style={styles.selectionEmoji}>
              {selectedPersona ? selectedPersona.emoji : '👤'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.lifeMomentButton} 
            onPress={() => setShowLifeMomentPanel(true)}
          >
            <Text style={styles.lifeMomentButtonText}>
              {selectedLifeMoment ? selectedLifeMoment.name : 'Life Moment'}
            </Text>
            <Text style={styles.selectionEmoji}>
              {selectedLifeMoment ? selectedLifeMoment.emoji : '🔍'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Active Filters */}
        {(selectedPersona || selectedLifeMoment) && (
          <View style={styles.activeFiltersContainer}>
            {selectedPersona && (
              <View style={[styles.filterTag, { backgroundColor: selectedPersona.color }]}>
                <Text style={styles.filterTagEmoji}>{selectedPersona.emoji}</Text>
                <Text style={styles.filterTagText}>{selectedPersona.name}</Text>
                <TouchableOpacity 
                  style={styles.removeFilterButton} 
                  onPress={removePersonaFilter}
                >
                  <Text style={styles.removeFilterText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {selectedLifeMoment && (
              <View style={[styles.filterTag, { backgroundColor: selectedLifeMoment.color }]}>
                <Text style={styles.filterTagEmoji}>{selectedLifeMoment.emoji}</Text>
                <Text style={styles.filterTagText}>{selectedLifeMoment.name}</Text>
                <TouchableOpacity 
                  style={styles.removeFilterButton} 
                  onPress={removeLifeMomentFilter}
                >
                  <Text style={styles.removeFilterText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </Animated.View>
      
      {/* Floating Persona Selector for quick filtering */}
      <FloatingPersonaSelector 
        personas={personas}
        selectedPersona={selectedPersona}
        onSelectPersona={handlePersonaSelect}
        visible={!isDiscoveryMode && products.length > 0 && !showPersonaPanel && !showLifeMomentPanel}
      />
      
      {/* Content */}
      <ScrollView 
        style={[
          styles.content, 
          darkMode && styles.contentDark
        ]}
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
            <Text style={[
              styles.loadingText,
              darkMode && styles.loadingTextDark
            ]}>
              Personalizing for you...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={[styles.errorContainer, darkMode && styles.errorContainerDark]}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : isDiscoveryMode ? (
          <View style={styles.discoveryContainer}>
            <TrendRadar 
              items={trendRadarData}
              onItemPress={(item) => {
                console.log('Trend item pressed:', item);
              }}
            />
            
            <View style={styles.socialBundlesContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionIcon}>👥</Text>
                  <Text style={styles.sectionTitle}>Social Bundles</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.sectionAction}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.sectionSubtitle}>
                Curated collections from our community
              </Text>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.bundlesScroll}
              >
                {socialBundles.map((bundle) => (
                  <TouchableOpacity 
                    key={bundle.id} 
                    style={styles.bundleCard}
                  >
                    <Image 
                      source={{ uri: bundle.coverImage }}
                      style={styles.bundleCover}
                      resizeMode="cover"
                    />
                    <View style={styles.bundleContent}>
                      <Text style={styles.bundleTitle}>{bundle.title}</Text>
                      
                      <View style={styles.bundleCreatorRow}>
                        <Image 
                          source={{ uri: bundle.creator.avatar }}
                          style={styles.creatorAvatar}
                        />
                        <Text style={styles.creatorName}>{bundle.creator.name}</Text>
                        {bundle.creator.verified && (
                          <Text style={styles.verifiedBadge}>✓</Text>
                        )}
                      </View>
                      
                      <View style={styles.bundleStats}>
                        <Text style={styles.bundleStat}>♥ {bundle.likes}</Text>
                        <Text style={styles.bundleStat}>🔖 {bundle.saves}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.shopByVibeContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionIcon}>✨</Text>
                  <Text style={styles.sectionTitle}>Shop by Vibe</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.sectionAction}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.sectionSubtitle}>
                Discover products that match your aesthetic
              </Text>
              
              <View style={styles.moodsGrid}>
                {moodBoards.map((mood) => (
                  <TouchableOpacity 
                    key={mood.id} 
                    style={styles.moodCard}
                  >
                    <Image 
                      source={{ uri: mood.coverImage }}
                      style={styles.moodCover}
                      resizeMode="cover"
                    />
                    <View style={[
                      styles.moodOverlay,
                      { backgroundColor: `${mood.color}80` }
                    ]}>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodName}>{mood.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Visual Categories */}
            <View style={styles.categoryEntryContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {productCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryItem}
                  >
                    <View 
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: `${category.color}15` }
                      ]}
                    >
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ) : products.length === 0 ? (
          <View style={[styles.emptyContainer, darkMode && styles.emptyContainerDark]}>
            <Text style={[styles.emptyPrimary, darkMode && styles.emptyPrimaryDark]}>
              No products found
            </Text>
            <Text style={[styles.emptySecondary, darkMode && styles.emptySecondaryDark]}>
              Try adjusting your filters or search query
            </Text>
          </View>
        ) : (
          <View style={styles.productList}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      {/* Visual Search Modal */}
      <VisualSearch 
        visible={showVisualSearch}
        onClose={() => setShowVisualSearch(false)}
        onSearch={handleVisualSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  
  // Update ticker styles for luxury look
  tickerContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 5,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    zIndex: 2,
    borderWidth: 1,
    borderColor: COLORS.highlight,
  },
  tickerProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  tickerProgressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.highlight,
    marginHorizontal: 3,
  },
  tickerProgressDotActive: {
    backgroundColor: COLORS.primary,
  },
  tickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tickerIconContainer: {
    marginRight: 12,
  },
  tickerIcon: {
    fontSize: 18,
    color: COLORS.primary,
  },
  tickerTextContainer: {
    flex: 1,
  },
  tickerLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 4,
    color: COLORS.accent2,
  },
  tickerText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    lineHeight: 18,
  },
  tickerDark: {
    backgroundColor: COLORS.darkGray,
    borderColor: '#333',
  },
  tickerTextDark: {
    color: COLORS.light,
  },
  
  header: {
    backgroundColor: COLORS.light,
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    zIndex: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '300', // More elegant thin font
    color: COLORS.primary,
    letterSpacing: 1, // More spacing for luxury look
    textTransform: 'lowercase', // Luxury brands often use lowercase
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: COLORS.accent2,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4, // Even more subtle radius
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontWeight: '300', // Thinner text for luxury
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  
  // Social proof header
  socialProofHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  socialProofText: {
    color: COLORS.light,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Selection Controls
  selectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
  },
  lifeMomentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
    flex: 1,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.light,
    flex: 1,
    letterSpacing: 0.3,
  },
  lifeMomentButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.light,
    flex: 1,
    letterSpacing: 0.3,
  },
  selectionEmoji: {
    fontSize: 16,
    marginLeft: 8,
  },
  
  // Selection Panel Styles
  selectionPanel: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  panelBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panelContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  panelHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closePanel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePanelText: {
    fontSize: 24,
    color: COLORS.midGray,
    lineHeight: 30,
  },
  panelSections: {
    marginBottom: 20,
  },
  panelSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  personaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  momentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  personaItem: {
    backgroundColor: COLORS.light,
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
    alignItems: 'center',
  },
  emojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  panelFooter: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 25,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Active filters
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  filterTagEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  filterTagText: {
    color: COLORS.light,
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeFilterButton: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFilterText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  
  // Content
  content: {
    flex: 1,
    padding: 20,
  },
  productList: {
    gap: 25,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.midGray,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: COLORS.accent1,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyPrimary: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySecondary: {
    fontSize: 16,
    color: COLORS.accent2,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Product card styles
  productCard: {
    backgroundColor: COLORS.light,
    borderRadius: 4,
    marginBottom: 25,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trendingProductCard: {
    height: 200,
  },
  cardContent: {
    padding: 20,
  },
  cardContentBack: {
    padding: 20,
    minHeight: 380,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeaderTextContainer: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.primary,
    marginBottom: 5,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    marginRight: 10,
  },
  ratingContainer: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.midGray,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#eaeaea',
    marginVertical: 10,
  },
  description: {
    fontSize: 15,
    color: COLORS.midGray,
    lineHeight: 22,
    marginBottom: 16,
  },
  socialProofSection: {
    marginBottom: 15,
  },
  whyBuyContainer: {
    marginBottom: 10,
  },
  whyBuyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  whyBuyText: {
    fontSize: 14,
    color: COLORS.midGray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  insightPreview: {
    marginTop: 10,
  },
  insightPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  insightPreviewText: {
    fontSize: 13,
    color: COLORS.midGray,
  },
  insightPreviewMore: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  viewButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  viewButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Card back styles
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.midGray,
    fontWeight: 'bold',
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    marginTop: 10,
  },
  insightCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  insightCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  insightCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  insightCardLabel: {
    fontSize: 14,
    color: COLORS.midGray,
    textAlign: 'center',
  },
  verdictSection: {
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 12,
  },
  detailsSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  verdictText: {
    fontSize: 15,
    color: COLORS.midGray,
    lineHeight: 22,
  },
  socialActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  socialActionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 5,
  },
  buyButton: {
    backgroundColor: COLORS.accent2,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buyButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Trending section styles
  trendingSection: {
    marginBottom: 25,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 10,
  },
  trendingBadgeText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  trendingSubtitle: {
    fontSize: 15,
    color: COLORS.midGray,
    marginBottom: 15,
  },
  trendingScroll: {
    paddingBottom: 5,
  },
  trendingCard: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    width: 220,
  },
  trendingCardContent: {
    padding: 15,
  },
  trendingImagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingEmoji: {
    fontSize: 50,
  },
  trendingProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    height: 40,
  },
  trendingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trendingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  trendingRatingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.midGray,
  },
  trendingSocialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingAvatarGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },
  trendingAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  trendingSocialText: {
    fontSize: 12,
    color: COLORS.midGray,
  },
  trendingViewButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  trendingViewButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Visual Category Entry Points
  categoryEntryContainer: {
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryScroll: {
    paddingHorizontal: 15,
  },
  categoryStory: {
    alignItems: 'center',
    marginRight: 16,
    width: 75,
  },
  categoryStoryRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 2,
    backgroundColor: COLORS.light,
    backgroundImage: 'linear-gradient(45deg, #833AB4, #FD1D1D, #FCAF45)',
  },
  categoryStoryInner: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryStoryEmoji: {
    fontSize: 30,
  },
  categoryStoryName: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // TrendRadar
  trendRadarContainer: {
    marginBottom: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: COLORS.accent1,
  },
  trendRadarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trendRadarItem: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.light,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  trendRadarImageContainer: {
    height: 160,
  },
  trendRadarImage: {
    width: '100%',
    height: '100%',
  },
  trendRadarContent: {
    padding: 16,
  },
  trendRadarCategory: {
    fontSize: 13,
    color: COLORS.accent1,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  trendRadarTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 8,
  },
  trendRadarChange: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    backgroundColor: COLORS.highlight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  // Social Bundles
  socialBundlesContainer: {
    marginBottom: 25,
  },
  bundlesScroll: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  bundleCard: {
    width: 220,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bundleCover: {
    width: '100%',
    height: 220,
  },
  bundleCreatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  bundleCreatorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  bundleTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  bundleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  bundleCreatorName: {
    fontSize: 12,
    color: COLORS.midGray,
  },
  
  // Shop by Vibe
  shopByVibeContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.light,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: '48%',
    height: 150,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  moodCover: {
    width: '100%',
    height: '100%',
  },
  moodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  moodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.light,
    textAlign: 'center',
  },
  
  // Enhanced Hero
  enhancedHeroContainer: {
    marginBottom: 25,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 0,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1, // Add this line to ensure proper layering
  },
  heroImageStrip: {
    height: 180,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
  },
  heroImage: {
    width: '20%',
    height: '100%',
  },
  heroContent: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.light,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    maxWidth: 300,
  },
  getStartedButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
  },
  closeHeroButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeHeroText: {
    fontSize: 20,
    color: COLORS.light,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  
  // Dark mode
  containerDark: {
    backgroundColor: COLORS.darkGray,
  },
  headerDark: {
    backgroundColor: COLORS.darkGray,
  },
  appTitleDark: {
    color: COLORS.light,
  },
  appSubtitleDark: {
    color: COLORS.midGray,
  },
  searchInputLoading: {
    borderColor: COLORS.accent2,
  },
  searchBarDark: {
    backgroundColor: COLORS.darkGray,
    borderColor: '#eaeaea',
  },
  contentDark: {
    backgroundColor: COLORS.darkGray,
  },
  loadingTextDark: {
    color: COLORS.light,
  },
  errorContainerDark: {
    backgroundColor: COLORS.darkGray,
    borderColor: '#ffcccc',
  },
  emptyPrimaryDark: {
    color: COLORS.light,
  },
  emptySecondaryDark: {
    color: COLORS.midGray,
  },
  
  // Discovery Container
  discoveryContainer: {
    marginBottom: 20,
  },
  
  // Header
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  darkModeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModeIcon: {
    fontSize: 18,
  },
  
  // Search Animation
  searchInputLoading: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: 12,
  },
  searchButtonLoading: {
    backgroundColor: COLORS.accent2,
  },
  
  // Loading Animation 
  loadingPulse: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    marginBottom: 15,
    opacity: 0.7,
  },
  
  // Category styles
  categoryEntryContainer: {
    marginBottom: 30,
  },
  categoryScroll: {
    paddingVertical: 10,
  },
  categoryItem: {
    padding: 15,
    borderRadius: 16,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
    width: 100,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  
  // TrendRadar styles
  trendRadarContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.light,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sectionAction: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: COLORS.midGray,
    marginBottom: 20,
  },
  trendRadarList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trendRadarItem: {
    width: '48%',
    backgroundColor: COLORS.light,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  trendRadarImageContainer: {
    height: 120,
    position: 'relative',
  },
  trendRadarImage: {
    width: '100%',
    height: '100%',
  },
  viralBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.accent1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  viralBadgeText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  trendRadarContent: {
    padding: 12,
  },
  trendRadarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  trendRadarCategory: {
    fontSize: 14,
    color: COLORS.midGray,
    marginBottom: 6,
  },
  trendRadarStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendRadarChange: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  highChangeText: {
    color: COLORS.accent2,
  },
  normalChangeText: {
    color: COLORS.secondary,
  },
  trendRadarPeriod: {
    fontSize: 12,
    color: COLORS.midGray,
  },
  
  // Shop by Vibe styles
  shopByVibeContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.light,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodCard: {
    width: '48%',
    height: 150,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  moodCover: {
    width: '100%',
    height: '100%',
  },
  moodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  moodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.light,
    textAlign: 'center',
  },
  
  // Social bundles styles
  socialBundlesContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.light,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  bundlesScroll: {
    paddingVertical: 10,
  },
  bundleCard: {
    width: 250,
    backgroundColor: COLORS.light,
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  bundleCover: {
    width: '100%',
    height: 140,
  },
  bundleContent: {
    padding: 15,
  },
  bundleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  bundleCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginRight: 5,
  },
  verifiedBadge: {
    fontSize: 12,
    color: COLORS.secondary,
    backgroundColor: `${COLORS.secondary}20`,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  bundleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bundleStat: {
    fontSize: 12,
    color: COLORS.midGray,
  },
  
  // Dark mode enhancements
  containerDark: {
    backgroundColor: '#121212',
  },
  headerDark: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: '#333',
  },
  contentDark: {
    backgroundColor: '#121212',
  },
  appTitleDark: {
    color: COLORS.light,
  },
  appSubtitleDark: {
    color: '#BBBBBB',
  },
  searchBarDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
    color: COLORS.light,
  },
  loadingTextDark: {
    color: '#BBBBBB',
  },
  errorContainerDark: {
    backgroundColor: '#2A2A2A',
    borderColor: COLORS.accent1 + '40',
  },
  emptyContainerDark: {
    backgroundColor: '#1A1A1A',
  },
  emptyPrimaryDark: {
    color: COLORS.light,
  },
  emptySecondaryDark: {
    color: '#BBBBBB',
  },
  
  // Add styles for vertical persona cycler
  personaCyclerContainer: {
    position: 'fixed',
    right: 0,
    top: 120,
    bottom: 20,
    width: 280,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    zIndex: 100,
    shadowColor: COLORS.primary,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRightWidth: 0,
  },
  personaCyclerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  personaCyclerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  closeCyclerButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeCyclerText: {
    fontSize: 18,
    color: COLORS.accent2,
    lineHeight: 22,
  },
  personaList: {
    flex: 1,
  },
  personaCyclerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  personaCyclerEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  personaCyclerEmojiText: {
    fontSize: 20,
  },
  personaCyclerInfo: {
    flex: 1,
  },
  personaCyclerName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  personaCyclerDesc: {
    fontSize: 12,
    color: COLORS.accent2,
    lineHeight: 16,
  },
  personaSelectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personaSelectedText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cycleThroughButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  cycleThroughText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  
  // New moment cycler container
  momentCyclerContainer: {
    position: 'fixed',
    right: 0,
    top: 120,
    bottom: 20,
    width: 280,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    zIndex: 100,
    shadowColor: COLORS.primary,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRightWidth: 0,
  },
  
  // Unified cycler component styles
  cyclerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  cyclerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  cyclerList: {
    flex: 1,
  },
  cyclerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  cyclerEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cyclerEmojiText: {
    fontSize: 20,
  },
  cyclerInfo: {
    flex: 1,
  },
  cyclerName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  cyclerDesc: {
    fontSize: 12,
    color: COLORS.accent2,
    lineHeight: 16,
  },
  cyclerSelectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cyclerSelectedText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Uniqlo-inspired styles
  uniqloHeader: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  uniqloHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.darkGray,
  },
  uniqloStyleHeader: {
    padding: 12,
    paddingBottom: 4,
  },
  uniqloStyleCategory: {
    fontSize: 11,
    color: COLORS.midGray,
    marginBottom: 4,
    letterSpacing: 1,
  },
  
  // AR button style
  arButton: {
    position: 'absolute',
    top: 12,
    right: 70, // Position next to Preview button
    backgroundColor: 'rgba(255,69,0,0.8)', // Orange-red for AR
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  arButtonText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // WebXR AR Viewer styles
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  arContent: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  arTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    color: COLORS.darkGray,
  },
  arViewport: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  arLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arLoadingText: {
    color: COLORS.midGray,
    marginBottom: 10,
  },
  arReadyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  arEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  arMessage: {
    textAlign: 'center',
    color: COLORS.darkGray,
    marginBottom: 25,
    lineHeight: 22,
  },
  arStartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  arStartButtonText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 16,
  },
  arActiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  arActiveText: {
    color: COLORS.light,
    textAlign: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  arUnsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  arErrorEmoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  arErrorText: {
    textAlign: 'center',
    color: '#D32F2F',
    lineHeight: 22,
  },
  arActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  arCloseButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 10,
  },
  arCloseText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  arHelpButton: {
    flex: 1,
    backgroundColor: COLORS.accent1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  arHelpText: {
    color: COLORS.light,
    fontWeight: '600',
  },
  
  // Clean price tag (Uniqlo style)
  priceTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  priceTagText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Gesture hint styles
  gestureHint: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  gestureHintText: {
    fontSize: 12,
    color: COLORS.midGray,
    fontStyle: 'italic',
  },
  gestureHintContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  // Specifications container styles
  specsContainer: {
    marginBottom: 24,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 15,
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  specsList: {
    gap: 10,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: COLORS.midGray,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  
  // Pagination styles
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.accent1,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  swipeNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
  },
  swipeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  swipeButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeIndicator: {
    alignItems: 'center',
  },
  swipeIndicatorText: {
    fontSize: 13,
    color: COLORS.midGray,
    fontStyle: 'italic',
  },
  
  // Update TrendRadar container
  trendRadarContainer: {
    marginBottom: 25,
    paddingVertical: 15,
  },
  
  // Update SocialBundles container
  socialBundlesContainer: {
    marginBottom: 25,
    paddingTop: 10,
  },
  
  // Update exploreInfo for cleaner look
  exploreInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 8,
  },
  exploreCategory: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.midGray,
    marginBottom: 3,
  },
  exploreTitle: {
    color: COLORS.darkGray,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 3,
  },
  exploreChange: {
    color: '#4CD964',
    fontWeight: '500',
    fontSize: 12,
  },
  
  // Voice navigation styles
  voiceNavContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.accent1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  voiceButtonActive: {
    backgroundColor: COLORS.accent3,
  },
  voiceButtonIcon: {
    fontSize: 24,
    color: COLORS.light,
  },
  listeningIndicator: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  listeningText: {
    color: COLORS.light,
    fontSize: 14,
  },
  transcriptContainer: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    backgroundColor: COLORS.light,
    padding: 10,
    borderRadius: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  transcriptText: {
    color: COLORS.darkGray,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    minWidth: 200,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  
  // Enhanced AR styles
  arLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  arLoadingText: {
    color: COLORS.midGray,
    marginBottom: 8,
  },
  arError: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  arErrorEmoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  arErrorText: {
    textAlign: 'center',
    color: '#D32F2F',
    lineHeight: 20,
  },
  arRetryButton: {
    backgroundColor: '#4CAF50',
  },
  arHelpButton: {
    marginTop: 10,
  },
  arHelpText: {
    color: COLORS.accent1,
    fontSize: 14,
  },
  
  // Floating persona selector styles
  floatingPersonaContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 900,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  floatingPersonaContent: {
    padding: 15,
  },
  floatingPersonaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  floatingPersonaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  floatingPersonaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  floatingPersonaEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  floatingPersonaLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
  },
  
  // Updated styles for TrendRadar
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exploreItem: {
    width: '48%',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exploreImage: {
    width: '100%',
    height: 100,
  },
  swipeNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  swipeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  swipeButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Replace AR button styles with Preview button styles
  previewButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  previewButtonText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Replace AR overlay styles with Product Preview styles
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  previewContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    color: COLORS.darkGray,
  },
  previewImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewProductInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  previewProductTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.light,
    marginBottom: 4,
  },
  previewProductPrice: {
    fontSize: 14,
    color: COLORS.light,
  },
  previewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewLoadingText: {
    color: COLORS.midGray,
    marginBottom: 10,
  },
  previewError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewErrorEmoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  previewErrorText: {
    textAlign: 'center',
    color: '#D32F2F',
    lineHeight: 20,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  previewCloseButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 10,
  },
  previewCloseText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  previewBuyButton: {
    flex: 2,
    backgroundColor: COLORS.accent1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  previewBuyText: {
    color: COLORS.light,
    fontWeight: '600',
  },
  
  // Virtual Try-On button styles
  tryOnButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(159,43,104,0.8)', // Purple for Try-On
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tryOnButtonText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Virtual Try-On overlay styles
  tryOnOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tryOnContent: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  tryOnTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    color: COLORS.darkGray,
  },
  tryOnWorkspace: {
    width: '100%',
    height: 450,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  tryOnUploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tryOnInstructions: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  tryOnButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tryOnButton: {
    backgroundColor: COLORS.accent1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  tryOnButtonText: {
    color: COLORS.light,
    fontWeight: '600',
  },
  tryOnError: {
    color: '#D32F2F',
    marginTop: 15,
  },
  tryOnProcessing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryOnProcessingText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  tryOnLoader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.accent1,
    borderTopColor: 'transparent',
    animationName: 'spin',
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  tryOnResult: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  tryOnResultImage: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
  },
  tryOnResultCaption: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginVertical: 10,
  },
  tryOnActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tryOnShareButton: {
    backgroundColor: COLORS.accent2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  tryOnShareButtonText: {
    color: COLORS.light,
    fontWeight: '600',
  },
  tryOnTryAgainButton: {
    backgroundColor: COLORS.accent1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  tryOnTryAgainButtonText: {
    color: COLORS.light,
    fontWeight: '600',
  },
  tryOnFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tryOnCloseButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: processedImage ? 10 : 0,
  },
  tryOnCloseButtonText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  tryOnBuyButton: {
    flex: 2,
    backgroundColor: COLORS.accent1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tryOnBuyButtonText: {
    color: COLORS.light,
    fontWeight: '600',
  },
  
  // Visual Search styles
  visualSearchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  visualSearchContent: {
    width: '90%',
    maxWidth: 650,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  visualSearchTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: COLORS.darkGray,
  },
  visualSearchWorkspace: {
    width: '100%',
    height: 500,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  visualSearchUploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  visualSearchInstructions: {
    fontSize: 18,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: '80%',
  },
  visualSearchButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  visualSearchButton: {
    backgroundColor: COLORS.accent1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  visualSearchButtonText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 16,
  },
  visualSearchError: {
    color: '#D32F2F',
    marginTop: 15,
    fontSize: 16,
  },
  visualSearchAnalyzing: {
    flex: 1,
    position: 'relative',
  },
  visualSearchImage: {
    width: '100%',
    height: '100%',
  },
  visualSearchAnalyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualSearchAnalyzingText: {
    color: COLORS.light,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  visualSearchLoader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.accent1,
    borderTopColor: 'transparent',
    animationName: 'spin',
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  visualSearchDetected: {
    flex: 1,
    position: 'relative',
    padding: 10,
  },
  visualSearchImageContainer: {
    width: '100%',
    height: '75%',
    position: 'relative',
    marginBottom: 10,
  },
  visualSearchBoundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'solid',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  visualSearchObjectLabel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: COLORS.light,
    fontSize: 12,
    padding: 4,
    borderRadius: 4,
    marginBottom: -25,
  },
  visualSearchSelectionInstructions: {
    marginBottom: 15,
    alignItems: 'center',
  },
  visualSearchSelectionText: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  visualSearchSelectedCount: {
    fontSize: 14,
    color: COLORS.accent1,
    fontWeight: '600',
  },
  visualSearchActionButton: {
    backgroundColor: COLORS.accent1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
  },
  visualSearchActionButtonDisabled: {
    backgroundColor: COLORS.midGray,
    opacity: 0.7,
  },
  visualSearchActionButtonText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 16,
  },
  visualSearchSearching: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualSearchSearchingText: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  visualSearchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  visualSearchCloseButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 10,
  },
  visualSearchCloseButtonText: {
    color: COLORS.darkGray,
    fontWeight: '600',
  },
  visualSearchResetButton: {
    flex: 1,
    backgroundColor: COLORS.accent2,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  visualSearchResetButtonText: {
    color: COLORS.light,
    fontWeight: '600',
  },
}); 