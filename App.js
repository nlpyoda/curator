import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Animated as RNAnimated, Dimensions, Platform, Easing, Modal, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AIProductService } from './app/services/AIProductService';
import PlaywrightService from './app/services/PlaywrightService';
import GradientBackground from './app/components/GradientBackground';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import ProductCard from './app/components/ProductCard';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.92;

// Add this new component for star ratings
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <View style={styles.starContainer}>
      {Array(fullStars).fill().map((_, i) => (
        <Text key={`full-${i}`} style={styles.starFull}>★</Text>
      ))}
      {halfStar && <Text style={styles.starHalf}>★</Text>}
      {Array(emptyStars).fill().map((_, i) => (
        <Text key={`empty-${i}`} style={styles.starEmpty}>☆</Text>
      ))}
    </View>
  );
};

// Animated Background Element (ethereal floating elements)
const EtherealBackground = ({ children }) => {
  const anim1 = useRef(new RNAnimated.Value(0)).current;
  const anim2 = useRef(new RNAnimated.Value(0)).current;
  const anim3 = useRef(new RNAnimated.Value(0)).current;
  
  useEffect(() => {
    const createAnimation = (animatedValue) => {
      return RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(animatedValue, {
            toValue: 1,
            duration: Math.random() * 10000 + 15000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          RNAnimated.timing(animatedValue, {
            toValue: 0,
            duration: Math.random() * 10000 + 15000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          })
        ])
      );
    };
    
    // Start animations
    createAnimation(anim1).start();
    // Add delay to second animation
    setTimeout(() => createAnimation(anim2).start(), 2000);
    setTimeout(() => createAnimation(anim3).start(), 4000);
    
    return () => {
      anim1.stopAnimation();
      anim2.stopAnimation();
      anim3.stopAnimation();
    };
  }, []);
  
  const circleInterpolation1 = {
    translateY: anim1.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -20]
    }),
    translateX: anim1.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -10]
    }),
    opacity: anim1.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0.1, 0.3, 0.3, 0.1]
    })
  };
  
  const circleInterpolation2 = {
    translateY: anim2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -30]
    }),
    translateX: anim2.interpolate({
      inputRange: [0, 1],
      outputRange: [-15, 15]
    }),
    opacity: anim2.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0.05, 0.15, 0.15, 0.05]
    })
  };
  
  const circleInterpolation3 = {
    translateY: anim3.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 10]
    }),
    translateX: anim3.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -20]
    }),
    opacity: anim3.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0.08, 0.2, 0.2, 0.08]
    })
  };
  
  return (
    <View style={styles.backgroundContainer}>
      <Animated.View 
        style={[
          styles.etherealCircle, 
          styles.etherealCircle1,
          { transform: [
              { translateX: circleInterpolation1.translateX },
              { translateY: circleInterpolation1.translateY }
            ],
            opacity: circleInterpolation1.opacity
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.etherealCircle, 
          styles.etherealCircle2,
          { transform: [
              { translateX: circleInterpolation2.translateX },
              { translateY: circleInterpolation2.translateY }
            ],
            opacity: circleInterpolation2.opacity
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.etherealCircle, 
          styles.etherealCircle3,
          { transform: [
              { translateX: circleInterpolation3.translateX },
              { translateY: circleInterpolation3.translateY }
            ],
            opacity: circleInterpolation3.opacity
          }
        ]} 
      />
      {children}
    </View>
  );
};

// Product Detail Panel - Update to include reviews
const ProductDetail = ({ item, visible, onClose, onPurchase }) => {
  const slideAnim = useRef(new RNAnimated.Value(visible ? 0 : 300)).current;
  const opacityAnim = useRef(new RNAnimated.Value(visible ? 1 : 0)).current;
  
  useEffect(() => {
    if (visible) {
      RNAnimated.parallel([
        RNAnimated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      RNAnimated.parallel([
        RNAnimated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);
  
  if (!item) return null;

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!item.reviews) return 0;
    let total = 0;
    let count = 0;
    
    // Simple algorithm to extract rating values from review text
    for (const platform in item.reviews) {
      const review = item.reviews[platform].toLowerCase();
      if (review.includes('love') || review.includes('excellent')) {
        total += 4.5;
        count++;
      } else if (review.includes('great') || review.includes('good')) {
        total += 4;
        count++;
      } else if (review.includes('okay') || review.includes('decent')) {
        total += 3;
        count++;
      } else if (review.includes('poor') || review.includes('bad')) {
        total += 2;
        count++;
      } else {
        // Default if no keywords found
        total += 3.5;
        count++;
      }
    }
    
    return count > 0 ? (total / count).toFixed(1) : 0;
  };
  
  const averageRating = calculateAverageRating();

  // Determine background texture based on product type
  const getDetailPattern = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('headphones') || titleLower.includes('audio')) 
      return 'rgba(120, 87, 255, 0.03)';
    if (titleLower.includes('tv') || titleLower.includes('smart home'))
      return 'rgba(25, 132, 197, 0.03)';
    if (titleLower.includes('chair') || titleLower.includes('office'))
      return 'rgba(76, 175, 80, 0.03)';
    
    return 'rgba(66, 66, 66, 0.03)';
  };
  
  return (
    <Animated.View 
      style={[
        styles.detailOverlay,
        { opacity: opacityAnim }
      ]}
      accessibilityViewIsModal={true}
    >
      <TouchableOpacity 
        style={styles.backdropTouch} 
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.backdropView} />
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.detailContainer,
          { 
            transform: [{ translateY: slideAnim }],
            backgroundColor: getDetailPattern(item.title)
          }
        ]}
      >
        <View style={styles.detailHeader}>
          <View style={styles.detailHeaderContent}>
            <Text style={styles.detailTitle}>{item.title}</Text>
            <Text style={styles.detailPrice}>{item.price}</Text>
            <View style={styles.ratingRow}>
              <StarRating rating={parseFloat(averageRating)} />
              <Text style={styles.detailRatingText}>{averageRating}</Text>
            </View>
            <View style={styles.detailStoreBadge}>
              <Text style={styles.detailStoreText}>{item.source}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            accessibilityLabel="Close product details"
            accessibilityRole="button"
            accessibilityHint="Returns to product list"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailBody}>
          <Text style={styles.detailDescription}>{item.description}</Text>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <Text style={styles.featureText}>{item.features}</Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Why Consider This</Text>
            <Text style={styles.valueText}>{item.whyBuy}</Text>
          </View>
          
          {item.reviews && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <View style={styles.reviewsContainer}>
                {item.reviews.amazon && (
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewPlatform}>Amazon</Text>
                    <Text style={styles.reviewContent}>{item.reviews.amazon}</Text>
                  </View>
                )}
                {item.reviews.instagram && (
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewPlatform}>Instagram</Text>
                    <Text style={styles.reviewContent}>{item.reviews.instagram}</Text>
                  </View>
                )}
                {item.reviews.marketplace && (
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewPlatform}>Marketplace</Text>
                    <Text style={styles.reviewContent}>{item.reviews.marketplace}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {item.prosAndCons && (
            <View style={styles.prosConsWrapper}>
              <Text style={styles.sectionTitle}>Pros & Cons</Text>
              <View style={styles.prosConsContainer}>
                <View style={[styles.prosConsColumn, styles.prosContainer]}>
                  {item.prosAndCons.pros && item.prosAndCons.pros.map((pro, index) => (
                    <View key={`pro-${index}`} style={styles.proItem}>
                      <Text style={styles.proText}>✓ {pro}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.prosConsColumn, styles.consContainer]}>
                  {item.prosAndCons.cons && item.prosAndCons.cons.map((con, index) => (
                    <View key={`con-${index}`} style={styles.conItem}>
                      <Text style={styles.conText}>✕ {con}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close details"
          >
            <Text style={styles.secondaryButtonText}>Back to Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => item && onPurchase && onPurchase(item)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Buy now"
          >
            <Text style={styles.primaryButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const aiService = new AIProductService();
const playwrightService = new PlaywrightService();

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState('A tech-savvy professional who values quality and efficiency');
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [purchaseState, setPurchaseState] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const scrollY = useRef(new RNAnimated.Value(0)).current;
  
  // Animated values for UI transitions
  const headerHeight = useRef(new RNAnimated.Value(120)).current;
  
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        await aiService.initialize();
        await playwrightService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        setErrorMessage('Failed to initialize services. Using mock data instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeService();
    
    return () => {
      aiService.cleanup();
      playwrightService.cleanup();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a search query.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    // Collapse header on search
    RNAnimated.timing(headerHeight, {
      toValue: 80,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
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

  const handleProductSelect = (product) => {
    // When a product card is long-pressed, open the full modal
    setSelectedProduct(product);
    setDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  const handleBackToProducts = () => {
    setDetailVisible(false);
  };

  const handlePurchase = async (product) => {
    if (!product) return;
    
    setPurchaseState({
      status: 'initializing',
      message: 'Preparing to purchase...'
    });
    setIsPurchasing(true);
    
    try {
      // In a real app, you would collect user payment/shipping details first
      const userDetails = {
        shipping: {
          name: 'Demo User',
          address: '123 Example St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105'
        },
        payment: {
          // This would be securely managed in a real app
          type: 'demo-only'
        }
      };
      
      setPurchaseState({
        status: 'connecting',
        message: 'Connecting to store...'
      });
      
      // Wait a bit to show the UI state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPurchaseState({
        status: 'processing',
        message: 'Processing your purchase...'
      });
      
      const result = await playwrightService.purchaseProduct(product, userDetails);
      
      setPurchaseState({
        status: result.success ? 'success' : 'error',
        message: result.message,
        error: result.error,
        suggestion: result.suggestion,
        orderDetails: result.orderDetails
      });
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseState({
        status: 'error',
        message: 'Failed to complete purchase',
        error: error.message,
        suggestion: `Please visit ${product.link} to purchase directly`
      });
    }
  };
  
  const handleClosePurchaseModal = () => {
    setIsPurchasing(false);
    // Reset purchase state after animation completes
    setTimeout(() => setPurchaseState(null), 300);
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
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
            accessibilityLabel="Search products input field"
            accessibilityHint="Enter product keywords to search"
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            activeOpacity={0.9}
            accessibilityLabel="Search button"
            accessibilityRole="button"
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderProductList = () => {
    return (
      <Animated.FlatList
        data={products.slice(0, 5)} // Limit to five products
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            index={index}
            scrollY={scrollY}
            onPress={handleProductSelect}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyPrimary}>
              {searchQuery.trim() ? 'No matching products found' : 'Ready for product discovery'}
            </Text>
            <Text style={styles.emptySecondary}>
              {searchQuery.trim() 
                ? 'Try broadening your search or changing keywords' 
                : 'Enter a search term to find personalized product recommendations'}
            </Text>
          </View>
        }
      />
    );
  };

  // Render purchase status modal
  const renderPurchaseModal = () => {
    if (!purchaseState) return null;
    
    const isSuccess = purchaseState.status === 'success';
    const isError = purchaseState.status === 'error';
    const isProcessing = !isSuccess && !isError;
    
    return (
      <Modal
        visible={isPurchasing}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePurchaseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.purchaseModal}>
            <View style={styles.purchaseModalHeader}>
              <Text style={styles.purchaseModalTitle}>
                {isSuccess ? 'Purchase Complete' : isError ? 'Purchase Failed' : 'Processing Purchase'}
              </Text>
              {!isProcessing && (
                <TouchableOpacity 
                  style={styles.closeModalButton} 
                  onPress={handleClosePurchaseModal}
                >
                  <Text style={styles.closeModalButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.purchaseModalBody}>
              {isProcessing && (
                <ActivityIndicator size="large" color="#444" style={{marginVertical: 20}} />
              )}
              
              <Text style={styles.purchaseStatusMessage}>{purchaseState.message}</Text>
              
              {isError && purchaseState.error && (
                <Text style={styles.purchaseErrorMessage}>{purchaseState.error}</Text>
              )}
              
              {isError && purchaseState.suggestion && (
                <Text style={styles.purchaseSuggestion}>{purchaseState.suggestion}</Text>
              )}
              
              {isSuccess && purchaseState.orderDetails && (
                <View style={styles.orderDetails}>
                  <Text style={styles.orderDetailTitle}>Order Details</Text>
                  
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Store:</Text>
                    <Text style={styles.orderDetailValue}>{purchaseState.orderDetails.store}</Text>
                  </View>
                  
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Price:</Text>
                    <Text style={styles.orderDetailValue}>{purchaseState.orderDetails.price}</Text>
                  </View>
                  
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Estimated Delivery:</Text>
                    <Text style={styles.orderDetailValue}>{purchaseState.orderDetails.estimatedDelivery}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.trackingButton}>
                    <Text style={styles.trackingButtonText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {!isProcessing && (
              <TouchableOpacity 
                style={[styles.modalButton, isSuccess ? styles.successButton : styles.neutralButton]} 
                onPress={handleClosePurchaseModal}
              >
                <Text style={styles.modalButtonText}>
                  {isSuccess ? 'Done' : 'Close'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EtherealBackground>
        <SafeAreaView style={styles.container}>
          {renderHeader()}
          
          <View style={styles.contentContainer}>
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>!</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
            
            <View style={styles.personaContainer}>
              <Text style={styles.personaLabel}>Shopping for:</Text>
              <TextInput
                style={styles.personaInput}
                placeholder="Describe the ideal customer (e.g., 'tech enthusiast who values premium audio')"
                value={persona}
                onChangeText={setPersona}
                multiline
                placeholderTextColor="#8C8C8C"
                accessibilityLabel="Buyer persona input"
                accessibilityHint="Describe the type of shopper to personalize results"
              />
              <Text style={styles.personaHint}>
                Providing a detailed persona will improve your product recommendations
              </Text>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#444" />
                <Text style={styles.loadingText}>
                  {isInitialized ? 'Finding the perfect products...' : 'Initializing product data...'}
                </Text>
              </View>
            ) : (
              renderProductList()
            )}
          </View>
          
          <ProductDetail
            item={selectedProduct}
            visible={detailVisible}
            onClose={handleCloseDetail}
            onPurchase={handlePurchase}
          />
          
          {renderPurchaseModal()}
          
          <StatusBar style="dark" />
        </SafeAreaView>
      </EtherealBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Changed to transparent to show ethereal background
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 10,
    backdropFilter: Platform.OS === 'ios' ? 'blur(10px)' : undefined,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Add padding for iOS
  },
  headerContent: {
    marginBottom: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 30,
  },
  appTitle: {
    fontSize: 28, // Increased size
    fontWeight: '700',
    color: '#222222',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(245, 245, 247, 0.85)', // Made semi-transparent
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#333333',
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  personaContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  personaLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  personaInput: {
    minHeight: 44,
    maxHeight: 80,
    backgroundColor: 'rgba(245, 245, 247, 0.85)', // Made semi-transparent
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  personaHint: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#555555',
    textAlign: 'center',
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 12,
  },
  cardContainer: {
    width: '100%',
    marginBottom: 16,
    alignSelf: 'center',
    height: 220, // Increased height for rating row
  },
  productCard: {
    flex: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    backgroundColor: 'transparent',
    backfaceVisibility: 'hidden',
  },
  cardSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    padding: 16,
    backfaceVisibility: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)', // Made slightly transparent
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.97)',
    backfaceVisibility: 'hidden',
  },
  storeTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    zIndex: 1,
  },
  storeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
    alignItems: 'flex-start',
    flexWrap: 'wrap', // Allow wrapping to prevent overlap
  },
  productTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.2,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
  },
  productDescription: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 14,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom of container
  },
  featuresPreview: {
    flex: 1,
    marginRight: 8,
  },
  featurePreviewText: {
    fontSize: 13,
    color: '#555555',
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  matchIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  matchScore: {
    fontSize: 13,
    fontWeight: '600',
  },
  tapHint: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
  },
  backHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
    flex: 1,
    marginRight: 10,
  },
  infoButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  infoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  whyBuySection: {
    marginBottom: 14,
  },
  backSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  whyBuyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
    marginBottom: 16,
  },
  backProsConsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prosConsBackColumn: {
    flex: 1,
  },
  proBackText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#00875A',
    marginBottom: 4,
  },
  conBackText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#D14343',
    marginBottom: 4,
  },
  flipBackButton: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 6,
  },
  flipBackText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  detailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdropTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // backdropFilter only works on iOS
    backdropFilter: Platform.OS === 'ios' ? 'blur(3px)' : undefined,
  },
  detailContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  detailHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  detailHeaderContent: {
    flex: 1,
    marginRight: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  detailStoreBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  detailStoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 28,
  },
  detailBody: {
    paddingHorizontal: 20,
    flex: 1,
    overflow: 'hidden', // Ensure content doesn't overflow
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444444',
  },
  valueText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444444',
  },
  prosConsWrapper: {
    marginBottom: 24,
  },
  prosConsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  prosConsColumn: {
    flex: 1,
  },
  prosContainer: {
    flex: 1,
    marginRight: 8,
  },
  consContainer: {
    flex: 1,
    marginLeft: 8,
  },
  proItem: {
    marginBottom: 8,
  },
  conItem: {
    marginBottom: 8,
  },
  proText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#00875A',
  },
  conText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#D14343',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#222222',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 60,
  },
  emptyPrimary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySecondary: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2F2',
    borderWidth: 1,
    borderColor: '#FFDEDE',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D14343',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 20,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    color: '#D14343',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginLeft: 5,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starFull: {
    fontSize: 14,
    color: '#FF8800',
    marginRight: 1,
  },
  starHalf: {
    fontSize: 14,
    color: '#FF8800',
    marginRight: 1,
  },
  starEmpty: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.15)',
    marginRight: 1,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    overflow: 'hidden', // Ensure circles don't overflow
  },
  etherealCircle: {
    position: 'absolute',
    borderRadius: 200,
    // Gradient-like effect with shadow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  etherealCircle1: {
    width: 300,
    height: 300,
    top: '10%',
    right: '-20%',
    backgroundColor: 'rgba(145, 203, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  etherealCircle2: {
    width: 250,
    height: 250,
    top: '50%',
    left: '-10%',
    backgroundColor: 'rgba(188, 243, 209, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  etherealCircle3: {
    width: 220,
    height: 220,
    bottom: '15%',
    right: '15%',
    backgroundColor: 'rgba(252, 228, 177, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewsSection: {
    marginBottom: 14,
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#444444',
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  reviewsContainer: {
    marginTop: 5,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  reviewPlatform: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
    fontStyle: 'italic',
  },
  detailRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  purchaseModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    maxHeight: '80%',
  },
  purchaseModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },
  closeModalButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#333333',
    lineHeight: 28,
  },
  purchaseModalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseStatusMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 16,
  },
  purchaseErrorMessage: {
    fontSize: 14,
    color: '#D14343',
    marginBottom: 16,
  },
  purchaseSuggestion: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  orderDetails: {
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },
  orderDetailValue: {
    fontSize: 14,
    color: '#444444',
  },
  trackingButton: {
    backgroundColor: '#2C6BED',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  trackingButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#222222',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  successButton: {
    backgroundColor: '#00875A',
  },
  neutralButton: {
    backgroundColor: '#FF8800',
  },
  productCardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backfaceVisibility: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  storyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  storyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  backContent: {
    flex: 1,
    padding: 16,
  },
  whyBuyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  storyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  storyGradient: {
    flex: 1,
    padding: 16,
  },
  storyScroll: {
    flex: 1,
  },
  storyContent: {
    padding: 16,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 16,
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 12,
  },
  socialProof: {
    marginTop: 16,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 12,
  },
  socialStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
});
