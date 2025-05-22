import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

// Mock data for testing
const mockProducts = [
  {
    id: '1',
    title: 'MacBook Pro 16"',
    price: 2499,
    rating: 4.8,
    description: 'Latest MacBook Pro with M3 Pro chip, 16GB RAM, and 512GB SSD.',
    link: 'https://www.apple.com/macbook-pro',
    tags: ['pro', 'premium', 'power-user', 'creative']
  },
  {
    id: '2',
    title: 'MacBook Air M2',
    price: 1199,
    rating: 4.7,
    description: 'Ultra-thin and lightweight MacBook Air with M2 chip.',
    link: 'https://www.apple.com/macbook-air',
    tags: ['lightweight', 'portable', 'student', 'casual']
  },
  {
    id: '3',
    title: 'MacBook Pro 14"',
    price: 1999,
    rating: 4.9,
    description: 'Powerful yet portable MacBook Pro with M3 chip.',
    link: 'https://www.apple.com/macbook-pro',
    tags: ['pro', 'premium', 'power-user', 'balanced']
  },
  {
    id: '4',
    title: 'MacBook Air M1',
    price: 999,
    rating: 4.6,
    description: 'Affordable MacBook Air with the efficient M1 chip.',
    link: 'https://www.apple.com/macbook-air',
    tags: ['budget', 'student', 'casual', 'entry-level']
  }
];

// Persona definitions
const personas = [
  {
    id: 'creative',
    name: 'Creative Pro',
    emoji: '🎨',
    description: 'High-end performance for creative workflows',
    tagWeights: { premium: 2, pro: 2, creative: 3, power: 1.5 },
    color: '#FF5757'
  },
  {
    id: 'student',
    name: 'Student',
    emoji: '🎓',
    description: 'Affordable options for studying',
    tagWeights: { student: 2, budget: 1.5, portable: 1.5, entry: 1.2 },
    color: '#4E7CFF'
  },
  {
    id: 'business',
    name: 'Business Pro',
    emoji: '💼',
    description: 'Reliable performance for business tasks',
    tagWeights: { premium: 1.5, balanced: 1.8, pro: 1.3 },
    color: '#32D74B'
  },
  {
    id: 'traveler',
    name: 'Digital Nomad',
    emoji: '✈️',
    description: 'Ultra-portable for on-the-go productivity',
    tagWeights: { portable: 2, lightweight: 2, balanced: 1.5 },
    color: '#BF5AF2'
  }
];

// Simple product card component
const ProductCard = ({ product, onPress }) => {
  const { title, price, rating, description } = product;
  
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
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

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => onPress(product)}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Persona selector component with cool hover effects
const PersonaSelector = ({ personas, selectedPersona, onSelectPersona }) => {
  return (
    <View style={styles.personaContainer}>
      <Text style={styles.personaTitle}>Choose Your Vibe</Text>
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
                borderWidth: 2,
                backgroundColor: `${persona.color}22`,
              }
            ]}
            onPress={() => onSelectPersona(persona)}
            activeOpacity={0.7}
          >
            <Text style={styles.personaEmoji}>{persona.emoji}</Text>
            <Text style={styles.personaName}>{persona.name}</Text>
            <Text style={styles.personaDescription}>{persona.description}</Text>
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

  const handleProductSelect = (product) => {
    window.open(product.link, '_blank');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
      </View>

      <ScrollView style={styles.content}>
        {selectedPersona && !isLoading && products.length > 0 && (
          <View style={[styles.personaTag, { backgroundColor: selectedPersona.color }]}>
            <Text style={styles.personaTagText}>
              {selectedPersona.emoji} Showing results for {selectedPersona.name}
            </Text>
          </View>
        )}
      
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
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
                onPress={handleProductSelect}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
    height: 44,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 8,
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
  },
  personaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  personaScroll: {
    paddingBottom: 10,
  },
  personaCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  personaEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  personaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  personaDescription: {
    fontSize: 12,
    color: '#666',
  },
  personaTag: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  personaTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  content: {
    flex: 1,
    padding: 16,
  },
  productList: {
    gap: 16,
  },
  loadingContainer: {
    padding: 20,
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
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyPrimary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySecondary: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  // Product card styles
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  ratingContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 