import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';

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
const ProductCard = ({ product, onPress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { title, price, rating, description, whyBuy, insights } = product;
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={handleFlip}
      activeOpacity={0.9}
    >
      {!isFlipped ? (
        // Front of card
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {rating}</Text>
            </View>
          </View>

          <Text style={styles.price}>${price.toLocaleString()}</Text>
          
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
          
          <Text style={styles.whyBuyLabel}>Why Buy</Text>
          <Text style={styles.whyBuyText} numberOfLines={2}>
            {whyBuy}
          </Text>

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
        // Back of card (details view)
        <View style={styles.cardContentBack}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleFlip}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.detailsTitle}>{title}</Text>
          
          <Text style={styles.detailsSubtitle}>Insight Analysis</Text>
          
          <View style={styles.insightsContainer}>
            {insights.map((insight, index) => (
              <InsightBar 
                key={index}
                label={insight.label} 
                value={insight.value} 
                color={insight.color}
              />
            ))}
          </View>
          
          <Text style={styles.detailsSubtitle}>Final Verdict</Text>
          <Text style={styles.verdictText}>{whyBuy}</Text>
          
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
        { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }
      ]}
    >
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Personalize Your Experience</Text>
        <TouchableOpacity style={styles.closePanel} onPress={onClose}>
          <Text style={styles.closePanelText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.panelSections}>
        {/* Personas Section */}
        <View style={styles.panelSection}>
          <Text style={styles.sectionTitle}>Who are you?</Text>
          <Text style={styles.sectionSubtitle}>Select your shopping persona</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsScroll}
          >
            {personas.map(persona => (
              <TouchableOpacity
                key={persona.id}
                style={[
                  styles.personaItem,
                  selectedPersona?.id === persona.id && { 
                    borderColor: persona.color,
                    borderWidth: 3,
                    backgroundColor: `${persona.color}15`,
                  }
                ]}
                onPress={() => onSelectPersona(persona)}
                activeOpacity={0.7}
              >
                <Text style={styles.itemEmoji}>{persona.emoji}</Text>
                <Text style={styles.itemName}>{persona.name}</Text>
                
                {selectedPersona?.id === persona.id && (
                  <View style={[styles.selectedBadge, { backgroundColor: persona.color }]}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Life Moments Section */}
        <View style={styles.panelSection}>
          <Text style={styles.sectionTitle}>What's your moment?</Text>
          <Text style={styles.sectionSubtitle}>Shopping for a specific life event</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsScroll}
          >
            {lifeMoments.map(moment => (
              <TouchableOpacity
                key={moment.id}
                style={[
                  styles.momentItem,
                  selectedMoment?.id === moment.id && { 
                    borderColor: moment.color,
                    borderWidth: 3,
                    backgroundColor: `${moment.color}15`,
                  }
                ]}
                onPress={() => onSelectMoment(moment)}
                activeOpacity={0.7}
              >
                <Text style={styles.itemEmoji}>{moment.emoji}</Text>
                <Text style={styles.itemName}>{moment.name}</Text>
                
                {selectedMoment?.id === moment.id && (
                  <View style={[styles.selectedBadge, { backgroundColor: moment.color }]}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <View style={styles.panelFooter}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={onClose}
        >
          <Text style={styles.applyButtonText}>Apply & See Results</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
          <Text style={styles.appTitle}>CuratorApp</Text>
          <Text style={styles.appSubtitle}>AI-Powered Shopping</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholderTextColor="#8C8C8C"
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
              Personalize Results
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
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <SelectionPanel
          personas={personas}
          lifeMoments={lifeMoments}
          selectedPersona={selectedPersona}
          selectedMoment={selectedMoment}
          onSelectPersona={(persona) => {
            // Toggle selection if clicking the same persona
            setSelectedPersona(selectedPersona?.id === persona.id ? null : persona);
          }}
          onSelectMoment={(moment) => {
            // Toggle selection if clicking the same moment
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
        {/* Active filters display */}
        {(selectedPersona || selectedMoment) && !isLoading && products.length > 0 && (
          <View style={styles.activeFiltersContainer}>
            {selectedPersona && (
              <View style={[styles.filterTag, { backgroundColor: selectedPersona.color }]}>
                <Text style={styles.filterTagText}>
                  {selectedPersona.emoji} {selectedPersona.name}
                </Text>
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
                <Text style={styles.filterTagText}>
                  {selectedMoment.emoji} {selectedMoment.name}
                </Text>
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
            <Text style={styles.loadingText}>Finding the perfect products...</Text>
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
                'No matching products found' : 'Ready for product discovery'}
            </Text>
            <Text style={styles.emptySecondary}>
              {searchQuery.trim() || selectedPersona || selectedMoment
                ? 'Try broadening your search or changing your persona/life moment' 
                : 'Enter a search term or select a persona/life moment for personalized recommendations'}
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
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
    color: '#333',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // New Selection Controls
  selectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  selectionCountBadge: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectionCountText: {
    color: '#fff',
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
    color: '#FF3B30',
    fontWeight: '600',
  },
  
  // Selection Panel Styles
  selectionPanel: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closePanel: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePanelText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
    lineHeight: 28,
  },
  panelSections: {
    padding: 15,
  },
  panelSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  itemsScroll: {
    paddingBottom: 5,
  },
  personaItem: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginRight: 12,
    width: 130,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  momentItem: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginRight: 12,
    width: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  itemEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  selectedBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  panelFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  filterTagText: {
    color: '#fff',
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
    color: '#fff',
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
    gap: 20,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#FF3B30',
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySecondary: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Product card styles
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
    minHeight: 300,
  },
  cardContent: {
    padding: 20,
  },
  cardContentBack: {
    padding: 20,
    minHeight: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  ratingContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  whyBuyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  whyBuyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Card back styles
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 5,
    letterSpacing: -0.3,
  },
  detailsSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightLabel: {
    width: 100,
    fontSize: 13,
    color: '#666',
  },
  insightBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#eaeaea',
    borderRadius: 3,
    overflow: 'hidden',
  },
  insightBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightValue: {
    width: 30,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  verdictText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#32D74B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
}); 