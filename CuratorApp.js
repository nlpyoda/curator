// Curator bundle collections with navigation
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

// Bundle data
const bundles = [
  {
    id: 'travel-essentials',
    title: 'Travel Essentials',
    creator: 'Alex Chen',
    verified: true,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500&auto=format',
    description: 'Curated items for the modern traveler who values both style and functionality.',
    items: [
      'Premium luggage set with 360° wheels',
      'Noise-canceling headphones',
      'Universal travel adapter',
      'Compact packing cubes',
      'Travel-sized skincare essentials'
    ],
    tags: ['travel', 'minimalist', 'premium'],
    price: '$2,450'
  },
  {
    id: 'dream-wfh-setup',
    title: 'Dream WFH Setup',
    creator: 'Mia Johnson',
    verified: true,
    image: 'https://images.unsplash.com/photo-1605565348518-bef3e7d6fed8?q=80&w=500&auto=format',
    description: 'Transform your workspace into a productivity haven with these thoughtfully selected items.',
    items: [
      'Ergonomic office chair',
      '27-inch 4K monitor',
      'Mechanical keyboard',
      'Adjustable standing desk',
      'Plants for better air quality'
    ],
    tags: ['workspace', 'productivity', 'ergonomic'],
    price: '$3,200'
  }
];

export default function CuratorApp({ onBack, selectedBundle }) {
  const [currentView, setCurrentView] = useState(selectedBundle ? 'bundle-detail' : 'home'); // Start with bundle-detail if bundle is provided
  const [selectedBundleState, setSelectedBundleState] = useState(selectedBundle || null);

  const handleBundleClick = (bundle) => {
    setSelectedBundleState(bundle);
    setCurrentView('bundle-detail');
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack(); // Go back to main app
    } else {
      setCurrentView('home');
      setSelectedBundleState(null);
    }
  };

  if (currentView === 'bundle-detail' && selectedBundleState) {
    return <BundleDetailPage bundle={selectedBundleState} onBack={handleBackToHome} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Curator</Text>
          <Text style={styles.headerSubtitle}>Curated Collections</Text>
        </View>
        
        {/* Bundle Cards */}
        <View style={styles.bundleSection}>
          {bundles.map((bundle) => (
            <TouchableOpacity 
              key={bundle.id}
              style={styles.bundleCard}
              onPress={() => handleBundleClick(bundle)}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri: bundle.image }}
                style={styles.bundleImage}
              />
              <View style={styles.bundleOverlay}>
                <Text style={styles.bundleTitle}>{bundle.title}</Text>
                <Text style={styles.bundleCreator}>
                  by {bundle.creator} {bundle.verified ? '✓' : ''}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Story Section */}
        <View style={styles.storySection}>
          <Text style={styles.sectionTitle}>The Story</Text>
          <Text style={styles.storyText}>
            These carefully curated collections represent the perfect blend of functionality and style. 
            Each item has been thoughtfully selected to create cohesive experiences for your lifestyle moments.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Bundle Detail Page Component
function BundleDetailPage({ bundle, onBack }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Curator</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: bundle.image }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{bundle.title}</Text>
            <Text style={styles.heroCreator}>
              Curated by {bundle.creator} {bundle.verified ? '✓' : ''}
            </Text>
          </View>
        </View>

        {/* Bundle Info */}
        <View style={styles.bundleInfo}>
          <Text style={styles.bundleDescription}>
            {bundle.description}
          </Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Collection Value</Text>
            <Text style={styles.priceValue}>{bundle.price}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            {bundle.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {bundle.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemBullet} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.shopButton} activeOpacity={0.9}>
            <Text style={styles.shopButtonText}>Shop This Collection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    fontWeight: '300',
  },
  bundleSection: {
    padding: 20,
  },
  bundleCard: {
    position: 'relative',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bundleImage: {
    width: '100%',
    height: '100%',
  },
  bundleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  bundleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bundleCreator: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  storySection: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  storyText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  // Bundle Detail Styles
  heroSection: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroCreator: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  bundleInfo: {
    padding: 30,
  },
  bundleDescription: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    marginBottom: 24,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  itemsSection: {
    padding: 30,
    backgroundColor: '#fafafa',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
    marginTop: 8,
    marginRight: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  actionSection: {
    padding: 30,
  },
  shopButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shopButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 