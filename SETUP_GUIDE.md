# CuratorApp Setup Guide

This document provides all the steps needed to recreate the CuratorApp from scratch.

## Project Overview

CuratorApp is a React Native/Expo app that provides AI-powered product recommendations based on user queries and personas. The app initially attempted to use a Prisma database with pgvector for embedding storage but ultimately uses a simpler approach with mock data for React Native compatibility.

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

## Setup Steps

### 1. Create a new Expo project

```bash
# Install the Expo CLI if you don't have it already
npm install -g expo-cli

# Create a new Expo project
npx create-expo-app CuratorApp
cd CuratorApp
```

### 2. Install dependencies

```bash
# Install required packages
npm install react-native-gesture-handler
npm install @xenova/transformers
```

### 3. Create the folder structure

```bash
# Create the app directories
mkdir -p app/services
```

### 4. Create the mock data file

Create the file `app/services/mockData.js`:

```javascript
// Mock product data for testing
export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: '$299.99',
    link: 'https://example.com/headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    features: '- Active noise cancellation\n- 30-hour battery life\n- Premium audio drivers\n- Comfortable over-ear design',
    whyBuy: 'These headphones offer exceptional sound quality and comfort for long listening sessions.',
    reviews: {
      amazon: 'Users love the sound quality and battery life. Some mention they are a bit heavy.',
      instagram: 'Influencers praise the sleek design and noise cancellation features.',
      marketplace: 'Highly rated for durability and customer service.'
    },
    prosAndCons: {
      pros: ['Excellent sound quality', 'Long battery life', 'Effective noise cancellation'],
      cons: ['Premium price point', 'Slightly heavy for extended wear']
    },
    lastUpdated: '2023-09-15',
    source: 'Amazon'
  },
  {
    id: '2',
    title: 'Smart Home Hub',
    price: '$129.99',
    link: 'https://example.com/smarthub',
    description: 'Central control for all your smart home devices with voice assistant integration.',
    features: '- Compatible with 100+ smart devices\n- Voice control\n- Scheduling and automation\n- Energy monitoring',
    whyBuy: 'This hub simplifies managing all your smart home devices from one central interface.',
    reviews: {
      amazon: 'Users appreciate the easy setup and wide compatibility.',
      instagram: 'Tech reviewers highlight the intuitive app interface.',
      marketplace: 'Buyers mention good value for the features offered.'
    },
    prosAndCons: {
      pros: ['Wide device compatibility', 'Easy setup', 'Reliable connection'],
      cons: ['Limited advanced automation without subscription']
    },
    lastUpdated: '2023-10-20',
    source: 'Best Buy'
  },
  {
    id: '3',
    title: 'Ultra HD Smart TV 55"',
    price: '$699.99',
    link: 'https://example.com/tv',
    description: 'Crystal clear 4K display with smart features and streaming apps built-in.',
    features: '- 4K Ultra HD resolution\n- HDR support\n- Built-in streaming apps\n- Voice remote',
    whyBuy: 'This TV offers excellent picture quality and smart features at a competitive price point.',
    reviews: {
      amazon: 'Customers love the picture quality and smart features.',
      instagram: 'Tech influencers praise the value for money.',
      marketplace: 'High ratings for picture quality and easy setup.'
    },
    prosAndCons: {
      pros: ['Excellent picture quality', 'User-friendly interface', 'Good value'],
      cons: ['Sound could be better', 'Limited gaming features']
    },
    lastUpdated: '2023-11-05',
    source: 'Walmart'
  },
  {
    id: '4',
    title: 'Professional Blender',
    price: '$199.99',
    link: 'https://example.com/blender',
    description: 'High-powered blender for smoothies, soups, and food processing.',
    features: '- 1500W motor\n- Variable speed control\n- Pulse function\n- Dishwasher-safe parts',
    whyBuy: 'This blender can handle any blending task with ease and is built to last.',
    reviews: {
      amazon: 'Customers praise its power and durability.',
      instagram: 'Food bloggers love the versatility and consistent results.',
      marketplace: 'High ratings for build quality and performance.'
    },
    prosAndCons: {
      pros: ['Powerful motor', 'Versatile functions', 'Easy to clean'],
      cons: ['Loud operation', 'Takes up counter space']
    },
    lastUpdated: '2023-08-12',
    source: 'Target'
  },
  {
    id: '5',
    title: 'Ergonomic Office Chair',
    price: '$249.99',
    link: 'https://example.com/chair',
    description: 'Adjustable office chair designed for comfort during long work sessions.',
    features: '- Adjustable lumbar support\n- Breathable mesh back\n- Adjustable armrests\n- 5-year warranty',
    whyBuy: 'This chair provides excellent support for long work days and helps prevent back pain.',
    reviews: {
      amazon: 'Users report reduced back pain and improved comfort.',
      instagram: 'Work-from-home professionals recommend for all-day comfort.',
      marketplace: 'Consistently rated highly for build quality and ergonomics.'
    },
    prosAndCons: {
      pros: ['Excellent lumbar support', 'Highly adjustable', 'Durable construction'],
      cons: ['Assembly takes time', 'Premium price point']
    },
    lastUpdated: '2023-07-30',
    source: 'Office Depot'
  }
];
```

### 5. Create the AI Product Service

Create the file `app/services/AIProductService.js`:

```javascript
// AIProductService for React Native
import { MOCK_PRODUCTS } from './mockData';

export class AIProductService {
  constructor() {
    this.useMockData = true; // Always use mock data in React Native
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('AI Product Service initialized with mock data');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }

  async searchProducts(query, persona) {
    console.log(`Searching for: ${query} with persona: ${persona}`);
    
    try {
      // Filter mock products based on query
      let results = [...MOCK_PRODUCTS];
      
      // Filter by query text
      if (query) {
        results = results.filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Add persona-based relevance scores
      results = results.map(product => {
        let relevanceScore = 0.5; // Default relevance
        
        // Adjust relevance based on persona
        if (persona.toLowerCase().includes('tech') || 
            persona.toLowerCase().includes('professional') || 
            persona.toLowerCase().includes('programmer')) {
          if (product.title.toLowerCase().includes('ergonomic') || 
              product.title.toLowerCase().includes('programmer') ||
              product.title.toLowerCase().includes('desk')) {
            relevanceScore = 0.9;
          }
        } else if (persona.toLowerCase().includes('artist') || 
                  persona.toLowerCase().includes('creative') || 
                  persona.toLowerCase().includes('designer')) {
          if (product.title.toLowerCase().includes('artist') || 
              product.title.toLowerCase().includes('drafting')) {
            relevanceScore = 0.95;
          }
        } else if (persona.toLowerCase().includes('gamer') || 
                  persona.toLowerCase().includes('gaming')) {
          if (product.title.toLowerCase().includes('gaming') || 
              product.title.toLowerCase().includes('rgb')) {
            relevanceScore = 0.9;
          }
        }
        
        return {
          ...product,
          similarity: relevanceScore
        };
      });
      
      // Sort by relevance
      results = results.sort((a, b) => b.similarity - a.similarity);
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async cleanup() {
    // Nothing to clean up with mock data
    this.initialized = false;
  }
}
```

### 6. Update the App.js file

Replace the contents of `App.js` with the following:

```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AIProductService } from './app/services/AIProductService';

// Product row component
const ProductRow = ({ item, onPress }) => (
  <TouchableOpacity style={styles.productRow} onPress={onPress}>
    <View style={styles.productHeader}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </View>
    <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
    <View style={styles.productFooter}>
      <Text style={styles.storeLabel}>From: <Text style={styles.storeText}>{item.source}</Text></Text>
      {item.similarity && (
        <Text style={styles.matchScore}>Match: {Math.round(item.similarity * 100)}%</Text>
      )}
    </View>
  </TouchableOpacity>
);

// Product detail component
const ProductDetail = ({ item, visible, onClose, onBuyNow }) => {
  if (!visible || !item) return null;
  
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{item.title}</Text>
          <Text style={styles.modalPrice}>{item.price}</Text>
          <Text style={styles.modalStore}>From: {item.source}</Text>
        </View>
        
        <Text style={styles.modalDescription}>{item.description}</Text>
        
        <Text style={styles.sectionTitle}>Features:</Text>
        <Text style={styles.modalText}>{item.features}</Text>
        
        <Text style={styles.sectionTitle}>Why Buy:</Text>
        <Text style={styles.modalText}>{item.whyBuy}</Text>
        
        {item.prosAndCons && (
          <>
            <Text style={styles.sectionTitle}>Pros & Cons:</Text>
            <View style={styles.prosConsContainer}>
              <View style={styles.prosContainer}>
                <Text style={styles.prosConsTitle}>Pros:</Text>
                {item.prosAndCons.pros && item.prosAndCons.pros.map((pro, index) => (
                  <Text key={`pro-${index}`} style={styles.prosConsItem}>• {pro}</Text>
                ))}
              </View>
              <View style={styles.consContainer}>
                <Text style={styles.prosConsTitle}>Cons:</Text>
                {item.prosAndCons.cons && item.prosAndCons.cons.map((con, index) => (
                  <Text key={`con-${index}`} style={styles.prosConsItem}>• {con}</Text>
                ))}
              </View>
            </View>
          </>
        )}
        
        <View style={styles.buttonRow}>
          <Button title="Close" onPress={onClose} />
          <Button title="Buy Now" onPress={onBuyNow} color="#4CAF50" />
        </View>
      </View>
    </View>
  );
};

const aiService = new AIProductService();

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState('A tech-savvy professional who values quality and efficiency');
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        await aiService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize AI service:', error);
        setErrorMessage('Failed to initialize the service. Using mock data instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeService();
    
    return () => {
      aiService.cleanup();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a search query.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const curatedProducts = await aiService.searchProducts(searchQuery, persona);
      setProducts(curatedProducts);
      
      if (curatedProducts.length === 0) {
        setErrorMessage('No products found matching your search criteria.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setErrorMessage('Search failed. Please try again.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (productUrl) => {
    console.log('Buy now clicked for:', productUrl);
    // In a real app, this would navigate to a purchase flow
    alert(`Would purchase product from: ${productUrl}`);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>CuratorApp</Text>
          <Text style={styles.appSubtitle}>AI-Powered Product Recommendations</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TextInput
            style={styles.personaInput}
            placeholder="Describe the buyer persona..."
            value={persona}
            onChangeText={setPersona}
            multiline
          />
          <Button title="Search" onPress={handleSearch} color="#2196F3" />
          
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>
              {isInitialized ? 'Searching for products...' : 'Initializing database...'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductRow
                item={item}
                onPress={() => setSelectedProduct(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {errorMessage ? errorMessage : 
                  searchQuery.trim() ? 'No products found. Try a different search.' : 
                  'Search for products to see results.'}
              </Text>
            }
          />
        )}
        
        {selectedProduct && (
          <ProductDetail
            item={selectedProduct}
            visible={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onBuyNow={() => handleBuyNow(selectedProduct.link)}
          />
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  personaInput: {
    height: 60,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  productRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeLabel: {
    fontSize: 12,
    color: '#666',
  },
  storeText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  matchScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  modalStore: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 5,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  prosConsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  prosContainer: {
    flex: 1,
    marginRight: 10,
  },
  consContainer: {
    flex: 1,
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  prosConsItem: {
    fontSize: 12,
    marginBottom: 3,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    padding: 20,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#FFCCCC',
    borderWidth: 1,
    borderColor: '#FF9999',
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#FF3333',
  },
});
```

### 7. Update the Babel Configuration

Update `babel.config.js` to handle ES modules:

```javascript
export default function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['@babel/plugin-transform-export-namespace-from']
  };
}
```

### 8. Create Metro Configuration

Create a `metro.config.js` file at the root of your project:

```javascript
import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

// Modify the config to handle ES modules
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

export default config;
```

### 9. Install Additional Dependencies

```bash
npm install --save-dev @babel/plugin-transform-export-namespace-from
```

### 10. Start the Application

```bash
npx expo start --clear
```

## Key Features of the CuratorApp

1. **AI-Powered Product Search**: The app simulates an AI-powered search system using mock data and relevance scoring based on user queries and persona information.

2. **Persona-Based Recommendations**: Users can specify a persona to tailor product recommendations to different user profiles.

3. **Detailed Product Information**: Each product includes comprehensive details such as features, pros and cons, and pricing.

4. **Error Handling**: The app includes robust error handling for search failures and initialization issues.

5. **Clean and Modern UI**: The app features a clean, user-friendly interface with proper loading states and error messages.

## Next Steps and Potential Improvements

1. **Server Integration**: In a full-scale deployment, you could create a backend service to handle actual database operations and AI processing.

2. **Real-time Product Data**: Integrate with e-commerce APIs to fetch real product data instead of using mock data.

3. **User Authentication**: Add user authentication to save user personas and search history.

4. **Advanced AI Features**: Implement more sophisticated AI matching algorithms based on product features, user preferences, and shopping history.

5. **Enhanced UI**: Add images, ratings, and more interactive elements to the product listings. 