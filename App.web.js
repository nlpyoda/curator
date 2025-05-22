import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';

// For trendy, minimalist color palette
const COLORS = {
  primary: '#0F0F0F',       // Near black
  secondary: '#007AFF',     // Bright blue
  accent1: '#FF375F',       // Hot pink
  accent2: '#53D769',       // Mint green
  accent3: '#AF52DE',       // Purple
  accent4: '#FF9500',       // Orange
  light: '#FFFFFF',         // White
  lightGray: '#F5F5F7',     // Ultra light gray
  midGray: '#86868B',       // Mid gray
  darkGray: '#1D1D1F',      // Dark gray
  glassBg: 'rgba(255,255,255,0.85)' // Glass effect background
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

// Flippable product card component with front/back views
const ProductCard = ({ product, onPress, isTrending = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { title, price, rating, description, whyBuy, insights } = product;
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        isTrending ? styles.trendingProductCard : null
      ]}
      onPress={handleFlip}
      activeOpacity={0.9}
    >
      {!isFlipped ? (
        // Front of card - more minimal, social-focused
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTextContainer}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {title}
              </Text>
              <View style={styles.priceRatingContainer}>
                <Text style={styles.price}>${price.toLocaleString()}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>★ {rating}</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.cardDivider} />
          
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
          
          <View style={styles.socialProofSection}>
            <View style={styles.whyBuyContainer}>
              <Text style={styles.whyBuyLabel}>Why People Love It</Text>
              <Text style={styles.whyBuyText} numberOfLines={2}>
                {whyBuy}
              </Text>
            </View>
            
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
              <Text style={styles.insightPreviewMore}>+ more</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={handleFlip}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Back of card - more detailed view
        <View style={styles.cardContentBack}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleFlip}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.detailsTitle}>{title}</Text>
          
          <View style={styles.insightCardsContainer}>
            {insights.map((insight, index) => (
              <View key={index} style={[styles.insightCard, { borderColor: insight.color }]}>
                <Text style={[styles.insightCardValue, { color: insight.color }]}>{insight.value}</Text>
                <Text style={styles.insightCardLabel}>{insight.label}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.verdictSection}>
            <Text style={styles.detailsSubtitle}>Expert Take</Text>
            <Text style={styles.verdictText}>{whyBuy}</Text>
          </View>
          
          <View style={styles.socialActions}>
            <TouchableOpacity style={styles.socialActionButton}>
              <Text style={styles.socialActionText}>♥ Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialActionButton}>
              <Text style={styles.socialActionText}>↗ Share</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => window.open(product.link, '_blank')}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Selection Panel Component
const SelectionPanel = ({ 
  personas, 
  lifeMoments, 
  selectedPersona, 
  selectedMoment,
  onSelectPersona,
  onSelectMoment,
  onClose,
  isOpen 
}) => {
  
  return (
    <Animated.View 
      style={[
        styles.selectionPanel,
        { 
          height: isOpen ? '100%' : 0, 
          opacity: isOpen ? 1 : 0,
          transform: [{ 
            translateY: isOpen ? 0 : 20 
          }]
        }
      ]}
    >
      <View style={styles.panelBackdrop} />
      <View style={styles.panelContent}>
        <View style={styles.panelHandle} />
        
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Your Vibe</Text>
          <TouchableOpacity style={styles.closePanel} onPress={onClose}>
            <Text style={styles.closePanelText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.panelSections}>
          {/* Personas Section */}
          <View style={styles.panelSection}>
            <Text style={styles.sectionTitle}>Who are you?</Text>
            
            <View style={styles.personaGrid}>
              {personas.map(persona => (
                <TouchableOpacity
                  key={persona.id}
                  style={[
                    styles.personaItem,
                    selectedPersona?.id === persona.id && { 
                      borderColor: persona.color,
                      borderWidth: 2,
                      backgroundColor: `${persona.color}15`,
                    }
                  ]}
                  onPress={() => onSelectPersona(persona)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.emojiCircle, {backgroundColor: `${persona.color}20`}]}>
                    <Text style={styles.itemEmoji}>{persona.emoji}</Text>
                  </View>
                  <Text style={styles.itemName}>{persona.name}</Text>
                  
                  {selectedPersona?.id === persona.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: persona.color }]}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Life Moments Section */}
          <View style={styles.panelSection}>
            <Text style={styles.sectionTitle}>Life moment?</Text>
            
            <View style={styles.momentGrid}>
              {lifeMoments.map(moment => (
                <TouchableOpacity
                  key={moment.id}
                  style={[
                    styles.momentItem,
                    selectedMoment?.id === moment.id && { 
                      borderColor: moment.color,
                      borderWidth: 2,
                      backgroundColor: `${moment.color}15`,
                    }
                  ]}
                  onPress={() => onSelectMoment(moment)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.emojiCircle, {backgroundColor: `${moment.color}20`}]}>
                    <Text style={styles.itemEmoji}>{moment.emoji}</Text>
                  </View>
                  <Text style={styles.itemName}>{moment.name}</Text>
                  
                  {selectedMoment?.id === moment.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: moment.color }]}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.panelFooter}>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={onClose}
          >
            <Text style={styles.applyButtonText}>Find My Perfect Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Trending products section component
const TrendingSection = ({ lifeMoment, onProductSelect }) => {
  if (!lifeMoment || !trendingByLifeMoment[lifeMoment.id]) return null;
  
  const trendingProducts = trendingByLifeMoment[lifeMoment.id];
  
  return (
    <View style={styles.trendingSection}>
      <View style={styles.trendingHeader}>
        <View style={[styles.trendingBadge, { backgroundColor: lifeMoment.color }]}>
          <Text style={styles.trendingBadgeText}>#trending</Text>
        </View>
        <Text style={styles.trendingTitle}>For {lifeMoment.name}s</Text>
      </View>
      
      <Text style={styles.trendingSubtitle}>
        What others in your situation are buying right now
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        {trendingProducts.map(product => (
          <TouchableOpacity 
            key={product.id}
            style={styles.trendingCard}
            onPress={() => onProductSelect(product)}
            activeOpacity={0.8}
          >
            <View style={styles.trendingCardContent}>
              <View style={styles.trendingImagePlaceholder}>
                <Text style={styles.trendingEmoji}>
                  {product.category === 'baby' ? '👶' : 
                   product.category === 'electronics' ? '📱' :
                   product.category === 'audio' ? '🎧' :
                   product.category === 'furniture' ? '🪑' :
                   product.category === 'travel' ? '✈️' : '🛍️'}
                </Text>
              </View>
              
              <Text style={styles.trendingProductTitle} numberOfLines={2}>
                {product.title}
              </Text>
              
              <View style={styles.trendingPriceRow}>
                <Text style={styles.trendingPrice}>
                  ${product.price.toLocaleString()}
                </Text>
                <Text style={styles.trendingRatingText}>★ {product.rating}</Text>
              </View>
              
              <View style={styles.trendingSocialProof}>
                <View style={styles.trendingAvatarGroup}>
                  <View style={[styles.trendingAvatar, {backgroundColor: COLORS.accent1}]} />
                  <View style={[styles.trendingAvatar, {backgroundColor: COLORS.accent2, marginLeft: -8}]} />
                  <View style={[styles.trendingAvatar, {backgroundColor: COLORS.accent3, marginLeft: -8}]} />
                </View>
                <Text style={styles.trendingSocialText}>+149 bought recently</Text>
              </View>
              
              <TouchableOpacity style={styles.trendingViewButton}>
                <Text style={styles.trendingViewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [selectedTrendingProduct, setSelectedTrendingProduct] = useState(null);

  // Calculate product relevance score based on selected persona and life moment
  const getRelevanceScore = (product) => {
    let score = 1;
    
    // Apply persona-based scoring
    if (selectedPersona) {
      product.tags.forEach(tag => {
        Object.entries(selectedPersona.tagWeights).forEach(([weightTag, weight]) => {
          if (tag.toLowerCase().includes(weightTag.toLowerCase())) {
            score += weight;
          }
        });
      });
    }
    
    // Apply life moment scoring
    if (selectedMoment) {
      // Boost products in the primary category for the selected life moment
      if (selectedMoment.primaryCategory && product.category === selectedMoment.primaryCategory) {
        score += 3;
      }
      
      // Apply tag-based scoring
      product.tags.forEach(tag => {
        Object.entries(selectedMoment.tagWeights).forEach(([weightTag, weight]) => {
          if (tag.toLowerCase().includes(weightTag.toLowerCase())) {
            score += weight;
          }
        });
      });
    }
    
    return score;
  };

  // Search immediately when persona or life moment changes
  useEffect(() => {
    if (selectedPersona || selectedMoment) {
      handleSearch();
    }
  }, [selectedPersona, selectedMoment]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedPersona && !selectedMoment) {
      setErrorMessage('Please enter a search query or select a persona/life moment.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter products based on search query
      let filteredProducts = mockProducts;
      
      if (searchQuery.trim()) {
        filteredProducts = filteredProducts.filter(product => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply persona and life moment based ranking
      if (selectedPersona || selectedMoment) {
        filteredProducts = filteredProducts.map(product => ({
          ...product,
          relevanceScore: getRelevanceScore(product)
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
      }
      
      setProducts(filteredProducts);
      
      if (filteredProducts.length === 0) {
        setErrorMessage('No products found matching your criteria.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setErrorMessage('Search failed. Please try again.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSelections = () => {
    setSelectedPersona(null);
    setSelectedMoment(null);
  };

  // Header opacity animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.98],
    extrapolate: 'clamp',
  });
  
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  // Add this function to handle selecting a trending product
  const handleTrendingProductSelect = (product) => {
    // Add the product to the products list if it's not already there
    if (!products.some(p => p.id === product.id)) {
      setProducts(prevProducts => [product, ...prevProducts]);
    }
    
    // Scroll to the product section
    setTimeout(() => {
      // This would ideally scroll to the product
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header, 
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>curator</Text>
          <Text style={styles.appSubtitle}>AI-driven product discovery</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="What are you looking for?"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholderTextColor={COLORS.midGray}
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.selectionControls}>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setIsPanelOpen(true)}
          >
            <Text style={styles.selectionButtonText}>
              Personalize
            </Text>
            {(selectedPersona || selectedMoment) && (
              <View style={styles.selectionCountBadge}>
                <Text style={styles.selectionCountText}>
                  {(selectedPersona ? 1 : 0) + (selectedMoment ? 1 : 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          {(selectedPersona || selectedMoment) && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearSelections}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <SelectionPanel
          personas={personas}
          lifeMoments={lifeMoments}
          selectedPersona={selectedPersona}
          selectedMoment={selectedMoment}
          onSelectPersona={(persona) => {
            setSelectedPersona(selectedPersona?.id === persona.id ? null : persona);
          }}
          onSelectMoment={(moment) => {
            setSelectedMoment(selectedMoment?.id === moment.id ? null : moment);
          }}
          onClose={() => setIsPanelOpen(false)}
          isOpen={isPanelOpen}
        />
      </Animated.View>

      <Animated.ScrollView 
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Social proof header for viral appeal */}
        <View style={styles.socialProofHeader}>
          <Text style={styles.socialProofText}>
            Join 10,000+ others finding their perfect products
          </Text>
        </View>
        
        {/* Life moment trending products section */}
        {selectedMoment && !isLoading && (
          <TrendingSection 
            lifeMoment={selectedMoment}
            onProductSelect={handleTrendingProductSelect}
          />
        )}

        {/* Active filters display with modern design */}
        {(selectedPersona || selectedMoment) && !isLoading && (
          <View style={styles.activeFiltersContainer}>
            {selectedPersona && (
              <View style={[styles.filterTag, { backgroundColor: selectedPersona.color }]}>
                <Text style={styles.filterTagEmoji}>{selectedPersona.emoji}</Text>
                <Text style={styles.filterTagText}>{selectedPersona.name}</Text>
                <TouchableOpacity 
                  style={styles.removeFilterButton}
                  onPress={() => setSelectedPersona(null)}
                >
                  <Text style={styles.removeFilterText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {selectedMoment && (
              <View style={[styles.filterTag, { backgroundColor: selectedMoment.color }]}>
                <Text style={styles.filterTagEmoji}>{selectedMoment.emoji}</Text>
                <Text style={styles.filterTagText}>{selectedMoment.name}</Text>
                <TouchableOpacity 
                  style={styles.removeFilterButton}
                  onPress={() => setSelectedMoment(null)}
                >
                  <Text style={styles.removeFilterText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Finding your perfect match...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : products.length > 0 ? (
          <View style={styles.productList}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyPrimary}>
              {searchQuery.trim() || selectedPersona || selectedMoment ? 
                'No matching products found' : 'Ready to discover'}
            </Text>
            <Text style={styles.emptySecondary}>
              {searchQuery.trim() || selectedPersona || selectedMoment
                ? 'Try broadening your search or changing your persona/life moment' 
                : 'Select a persona or life moment to see tailored recommendations'}
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.light,
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    zIndex: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.midGray,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.primary,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
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
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  selectionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.light,
  },
  selectionCountBadge: {
    backgroundColor: COLORS.light,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectionCountText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 14,
    color: COLORS.accent1,
    fontWeight: '600',
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
    color: COLORS.midGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Product card styles
  productCard: {
    backgroundColor: COLORS.light,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
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
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 5,
    lineHeight: 26,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
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
}); 