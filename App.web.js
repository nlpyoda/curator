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
    whyBuy: 'Best value MacBook with exceptional battery life and solid performance for students.',
    insights: [
      { label: 'Performance', value: 75, color: '#FF5757' },
      { label: 'Battery Life', value: 96, color: '#32D74B' },
      { label: 'Portability', value: 93, color: '#4E7CFF' },
      { label: 'Value', value: 95, color: '#BF5AF2' }
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

// Persona selector component with cool hover effects
const PersonaSelector = ({ personas, selectedPersona, onSelectPersona }) => {
  return (
    <View style={styles.personaContainer}>
      <View style={styles.personaTitleContainer}>
        <Text style={styles.personaTitle}>Personalize Your Results</Text>
        <Text style={styles.personaSubtitle}>Select your vibe to get curated product recommendations</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.personaScroll}
      >
        {personas.map(persona => (
          <TouchableOpacity
            key={persona.id}
            style={[
              styles.personaCard,
              selectedPersona?.id === persona.id && { 
                borderColor: persona.color,
                borderWidth: 3,
                backgroundColor: `${persona.color}15`,
              }
            ]}
            onPress={() => onSelectPersona(persona)}
            activeOpacity={0.7}
          >
            <Text style={styles.personaEmoji}>{persona.emoji}</Text>
            <Text style={styles.personaName}>{persona.name}</Text>
            <Text style={styles.personaDescription}>{persona.description}</Text>
            
            {selectedPersona?.id === persona.id && (
              <View style={styles.personaActiveIndicator}>
                <Text style={styles.personaActiveText}>Active</Text>
              </View>
            )}
            
            <View style={[styles.personaFocus, { borderColor: persona.color }]}>
              <Text style={styles.personaFocusText}>Prioritizes</Text>
              <View style={styles.personaTagsContainer}>
                {persona.insights.map((insight, idx) => (
                  <View 
                    key={idx} 
                    style={[styles.personaTag, { backgroundColor: `${persona.color}30` }]}
                  >
                    <Text style={[styles.personaTagText, { color: persona.color }]}>
                      {insight}
                    </Text>
                  </View>
                ))}
              </View>
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
  const [scrollY] = useState(new Animated.Value(0));

  // Calculate product relevance score based on selected persona
  const getRelevanceScore = (product, persona) => {
    if (!persona) return 1; // No boost if no persona selected
    
    let score = 1;
    product.tags.forEach(tag => {
      Object.entries(persona.tagWeights).forEach(([weightTag, weight]) => {
        if (tag.toLowerCase().includes(weightTag.toLowerCase())) {
          score += weight;
        }
      });
    });
    
    return score;
  };

  // Search immediately when persona changes
  useEffect(() => {
    if (selectedPersona) {
      handleSearch();
    }
  }, [selectedPersona]);

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedPersona) {
      setErrorMessage('Please enter a search query or select a persona.');
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
      
      // Apply persona-based ranking if a persona is selected
      if (selectedPersona) {
        filteredProducts = filteredProducts.map(product => ({
          ...product,
          relevanceScore: getRelevanceScore(product, selectedPersona)
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
        
        <PersonaSelector 
          personas={personas}
          selectedPersona={selectedPersona}
          onSelectPersona={(persona) => {
            // Toggle selection if clicking the same persona
            setSelectedPersona(selectedPersona?.id === persona.id ? null : persona);
          }}
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
        {selectedPersona && !isLoading && products.length > 0 && (
          <View style={[styles.personaResultTag, { backgroundColor: selectedPersona.color }]}>
            <Text style={styles.personaResultTagText}>
              {selectedPersona.emoji} Recommendations tailored for {selectedPersona.name}
            </Text>
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
              {searchQuery.trim() || selectedPersona ? 'No matching products found' : 'Ready for product discovery'}
            </Text>
            <Text style={styles.emptySecondary}>
              {searchQuery.trim() || selectedPersona
                ? 'Try broadening your search or selecting a different persona' 
                : 'Enter a search term or select a persona to find personalized recommendations'}
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
  
  // Persona selector styles
  personaContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  personaTitleContainer: {
    marginBottom: 15,
  },
  personaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: -0.3,
  },
  personaSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  personaScroll: {
    paddingBottom: 10,
  },
  personaCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  personaEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  personaName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  personaDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  personaActiveIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  personaActiveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  personaFocus: {
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  personaFocusText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  personaTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  personaTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  personaTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  personaResultTag: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  personaResultTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
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