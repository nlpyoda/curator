// Visual Search Component - Upload image to find similar products
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, Linking } from 'react-native';

export const VisualSearch = ({ onSearchResults }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ uri: imageUrl, file });
      
      // Auto-search when image is selected
      await performVisualSearch(file);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ uri: imageUrl, file });
      
      // Auto-search when image is dropped
      await performVisualSearch(file);
    }
  };

  const performVisualSearch = async (imageFile) => {
    setIsSearching(true);
    
    try {
      console.log('🔍 Starting visual search...');
      
      // Convert image to base64 for processing
      const base64Image = await fileToBase64(imageFile);
      
      // Call our visual search service
      const { AIProductService } = await import('../services/AIProductService.js');
      const { VisualSearchService } = await import('../services/VisualSearchService.js');
      
      const aiService = new AIProductService();
      const visualService = new VisualSearchService();
      
      await aiService.initialize();
      await visualService.initialize();
      
      // Generate embedding for the uploaded image
      console.log('🤖 Generating image embedding...');
      const imageEmbedding = await visualService.generateImageEmbedding(base64Image, imageFile.name);
      
      // Search for similar products
      console.log('🔍 Searching for similar products...');
      const results = await visualService.searchSimilarProducts(imageEmbedding, {
        threshold: 0.3, // Lower threshold for visual search
        limit: 5
      });
      
      console.log(`✅ Found ${results.length} similar products`);
      setSearchResults(results.slice(0, 2)); // Top 2 results as requested
      
      if (onSearchResults) {
        onSearchResults(results.slice(0, 2));
      }
      
    } catch (error) {
      console.error('❌ Visual search failed:', error);
      Alert.alert('Search Error', 'Failed to search for similar products. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const openProductLink = (url) => {
    if (url && url !== 'https://example.com') {
      Linking.openURL(url);
    }
  };

  const styles = {
    container: {
      padding: 20,
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      margin: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 15,
      textAlign: 'center',
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: dragActive ? '#3498db' : '#bdc3c7',
      borderStyle: 'dashed',
      borderRadius: 8,
      padding: 30,
      alignItems: 'center',
      backgroundColor: dragActive ? '#ecf0f1' : 'white',
      marginBottom: 20,
      transition: 'all 0.3s ease',
    },
    uploadText: {
      fontSize: 16,
      color: '#7f8c8d',
      textAlign: 'center',
      marginBottom: 15,
    },
    uploadButton: {
      backgroundColor: '#3498db',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 6,
      elevation: 2,
    },
    uploadButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    selectedImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 15,
      resizeMode: 'contain',
    },
    searchingText: {
      fontSize: 16,
      color: '#e67e22',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    resultsContainer: {
      marginTop: 20,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 15,
      textAlign: 'center',
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 6,
      marginRight: 15,
      resizeMode: 'cover',
    },
    productInfo: {
      flex: 1,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#27ae60',
      marginBottom: 5,
    },
    similarityScore: {
      fontSize: 12,
      color: '#7f8c8d',
      fontStyle: 'italic',
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewButton: {
      backgroundColor: '#27ae60',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginTop: 8,
    },
    viewButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    noResults: {
      textAlign: 'center',
      color: '#7f8c8d',
      fontSize: 16,
      fontStyle: 'italic',
      marginTop: 20,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Visual Product Search</Text>
      
      <View 
        style={styles.uploadArea}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        {selectedImage ? (
          <Image source={selectedImage} style={styles.selectedImage} />
        ) : (
          <>
            <Text style={styles.uploadText}>
              📸 Drop an image here or click to upload{'\n'}
              Take a screenshot of any product to find similar items!
            </Text>
            <TouchableOpacity style={styles.uploadButton}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" style={styles.uploadButtonText}>
                Choose Image
              </label>
            </TouchableOpacity>
          </>
        )}
      </View>

      {isSearching && (
        <Text style={styles.searchingText}>
          🤖 Analyzing image and searching for similar products...
        </Text>
      )}

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            🎯 Top {searchResults.length} Similar Products
          </Text>
          
          <ScrollView>
            {searchResults.map((product, index) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productRow}>
                  {product.image && (
                    <Image 
                      source={{ uri: product.image }} 
                      style={styles.productImage}
                    />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Text style={styles.similarityScore}>
                      {product.similarity ? 
                        `${Math.round(product.similarity * 100)}% similar` : 
                        `Result #${index + 1}`
                      }
                    </Text>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => openProductLink(product.link)}
                    >
                      <Text style={styles.viewButtonText}>View Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {!isSearching && selectedImage && searchResults.length === 0 && (
        <Text style={styles.noResults}>
          No similar products found. Try a different image or adjust search settings.
        </Text>
      )}
    </View>
  );
};

export default VisualSearch;