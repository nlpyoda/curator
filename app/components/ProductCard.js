import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import GradientBackground from './GradientBackground';

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
      {halfStar && <Text key="half" style={styles.starEmpty}>☆</Text>}
      {Array(emptyStars).fill().map((_, i) => (
        <Text key={`empty-${i}`} style={styles.starEmpty}>☆</Text>
      ))}
    </View>
  );
};

const ProductCard = ({ product, index, scrollY, onPress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const flipAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);
  const storyAnim = useSharedValue(0);
  const panX = useSharedValue(0);

  // Calculate card position for parallax effect
  const inputRange = [-1, 0, 100 * index, 100 * (index + 2)];
  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.8],
  });

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.5],
  });

  const translateY = scrollY.interpolate({
    inputRange,
    outputRange: [0, 0, 0, 50],
  });

  // Get theme color based on product category
  const getThemeColor = () => {
    const category = product.title.toLowerCase();
    if (category.includes('laptop') || category.includes('macbook')) return '#007AFF';
    if (category.includes('headphone')) return '#FF2D55';
    if (category.includes('camera')) return '#5856D6';
    return '#34C759';
  };

  const themeColor = getThemeColor();

  // Enhanced flip animation with spring physics
  const flipCard = () => {
    flipAnim.value = withSpring(isFlipped ? 0 : 1, {
      damping: 15,
      stiffness: 100,
      mass: 0.5
    });
    setIsFlipped(!isFlipped);
  };

  // Enhanced story animation
  const toggleStory = () => {
    storyAnim.value = withSpring(showStory ? 0 : 1, {
      damping: 15,
      stiffness: 100
    });
    setShowStory(!showStory);
  };

  // Enhanced hover animation
  const handleHover = (isHovered) => {
    scaleAnim.value = withSpring(isHovered ? 1.05 : 1, {
      damping: 15,
      stiffness: 100
    });
  };

  // Pan gesture handler for interactive card flipping
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      panX.value = event.translationX;
      // Update flip animation based on pan gesture
      flipAnim.value = withSpring(
        isFlipped ? 1 - Math.min(Math.abs(event.translationX) / 200, 1) : Math.min(Math.abs(event.translationX) / 200, 1),
        {
          damping: 15,
          stiffness: 100
        }
      );
    })
    .onEnd((event) => {
      // Determine if we should flip based on velocity and position
      const shouldFlip = Math.abs(event.velocityX) > 500 || Math.abs(event.translationX) > 100;
      if (shouldFlip) {
        flipAnim.value = withSpring(isFlipped ? 0 : 1, {
          damping: 15,
          stiffness: 100
        });
        setIsFlipped(!isFlipped);
      } else {
        // Return to original state
        flipAnim.value = withSpring(isFlipped ? 1 : 0, {
          damping: 15,
          stiffness: 100
        });
      }
      panX.value = withSpring(0);
    });

  // Tap gesture handler for card interaction
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      handleHover(true);
    })
    .onFinalize(() => {
      handleHover(false);
    });

  // Combine gestures
  const gesture = Gesture.Simultaneous(panGesture, tapGesture);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleAnim.value },
        { perspective: 1000 },
        {
          rotateY: `${flipAnim.value * 180}deg`
        }
      ],
      opacity: interpolate(
        flipAnim.value,
        [0, 0.5, 1],
        [1, 0, 0],
        Extrapolate.CLAMP
      )
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleAnim.value },
        { perspective: 1000 },
        {
          rotateY: `${flipAnim.value * 180 + 180}deg`
        }
      ],
      opacity: interpolate(
        flipAnim.value,
        [0, 0.5, 1],
        [0, 0, 1],
        Extrapolate.CLAMP
      )
    };
  });

  const storyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            storyAnim.value,
            [0, 1],
            [100, 0],
            Extrapolate.CLAMP
          )
        }
      ],
      opacity: storyAnim.value
    };
  });

  return (
    <Animated.View
      style={[
        styles.productCardContainer,
        {
          transform: [{ scale }, { translateY }],
          opacity,
        },
      ]}
    >
      <GestureDetector gesture={gesture}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={flipCard}
          onLongPress={() => onPress(product)}
        >
          <Animated.View style={[styles.productCard, frontAnimatedStyle]}>
            <GradientBackground
              colors={[themeColor, `${themeColor}80`]}
              style={styles.cardGradient}
              testID="gradient-background"
            >
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <View style={styles.storeTag}>
                  <Text style={styles.storeText}>{product.source}</Text>
                </View>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{product.price}</Text>
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingText}>🔥 Trending</Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {product.description}
              </Text>

              <View style={styles.matchContainer}>
                <Text style={styles.matchText}>
                  Match Score: {product.similarityScore}%
                </Text>
                <View style={styles.starContainer}>
                  <StarRating rating={product.averageRating} />
                </View>
              </View>

              <TouchableOpacity
                style={styles.storyButton}
                onPress={toggleStory}
              >
                <Text style={styles.storyButtonText}>View Story</Text>
              </TouchableOpacity>
            </GradientBackground>
          </Animated.View>

          <Animated.View style={[styles.productCard, styles.cardBack, backAnimatedStyle]}>
            <GradientBackground
              colors={[`${themeColor}80`, themeColor]}
              style={styles.cardGradient}
            >
              <View style={styles.backContent}>
                <Text style={styles.whyBuyTitle}>Why Consider This?</Text>
                <Text style={styles.whyBuyText}>{product.whyBuy}</Text>
                
                <View style={styles.prosConsContainer}>
                  <View style={styles.prosContainer}>
                    <Text style={styles.prosTitle}>Pros</Text>
                    {product.prosAndCons.pros.map((pro, index) => (
                      <Text key={index} style={styles.prosText}>✓ {pro}</Text>
                    ))}
                  </View>
                  <View style={styles.consContainer}>
                    <Text style={styles.consTitle}>Cons</Text>
                    {product.prosAndCons.cons.map((con, index) => (
                      <Text key={index} style={styles.consText}>× {con}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </GradientBackground>
          </Animated.View>

          <Animated.View style={[styles.storyContainer, storyAnimatedStyle]}>
            <GradientBackground
              colors={[themeColor, `${themeColor}80`]}
              style={styles.storyGradient}
            >
              <ScrollView style={styles.storyScroll}>
                <View style={styles.storyContent}>
                  <Text style={styles.storyTitle}>Product Story</Text>
                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>Customer Reviews</Text>
                    {Object.entries(product.reviews).map(([platform, review], index) => (
                      <View key={index} style={styles.reviewItem}>
                        <Text style={styles.platformText}>{platform}</Text>
                        <Text style={styles.reviewText}>{review}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.socialProof}>
                    <Text style={styles.socialTitle}>Social Proof</Text>
                    <View style={styles.socialStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>98%</Text>
                        <Text style={styles.statLabel}>Satisfaction</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>10k+</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>4.8</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </GradientBackground>
          </Animated.View>
        </TouchableOpacity>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  productTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.2,
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
  storeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
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
  description: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 14,
    lineHeight: 20,
  },
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  matchText: {
    fontSize: 13,
    color: '#555555',
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
  starEmpty: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.15)',
    marginRight: 1,
  },
  storyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 12,
  },
  storyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  whyBuyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
    marginBottom: 16,
  },
  prosConsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prosContainer: {
    flex: 1,
    marginRight: 8,
  },
  consContainer: {
    flex: 1,
    marginLeft: 8,
  },
  prosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00875A',
    marginBottom: 8,
  },
  consTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D14343',
    marginBottom: 8,
  },
  prosText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#00875A',
    marginBottom: 4,
  },
  consText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#D14343',
    marginBottom: 4,
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
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  platformText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
    fontStyle: 'italic',
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

export default ProductCard; 