// Script to populate Supabase database with sample products for testing
import { SupabaseService } from '../app/services/SupabaseService.js';
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

const ADDITIONAL_PRODUCTS = [
  {
    title: 'MacBook Pro 14" M2',
    price: '$1,999.99',
    link: 'https://example.com/macbook-pro-14',
    source: 'Apple',
    description: 'Powerful laptop with M2 Pro chip, perfect for professionals and creatives.',
    features: '- M2 Pro/Max chip\n- 14-inch Liquid Retina XDR display\n- Up to 32GB unified memory\n- Up to 18 hours of battery life',
    whyBuy: 'Exceptional performance for creative professionals with industry-leading battery life.',
    reviews: {
      amazon: 'Users love the performance and battery life. The display is consistently rated as best-in-class.',
      instagram: 'Tech influencers praise the speed and efficiency for video editing workflows.',
      marketplace: 'Highly rated for reliability and resale value.'
    },
    prosAndCons: {
      pros: ['Exceptional performance', 'Beautiful display', 'Great battery life'],
      cons: ['Premium price', 'Limited port selection']
    },
    category: 'Electronics',
    subCategory: 'Computers',
    tags: ['laptop', 'apple', 'premium', 'professional']
  },
  {
    title: 'MacBook Air M2',
    price: '$1,199.99',
    link: 'https://example.com/macbook-air-m2',
    source: 'Apple',
    description: 'Ultra-thin laptop with great performance and all-day battery life.',
    features: '- M2 chip\n- 13.6-inch Liquid Retina display\n- Up to 24GB unified memory\n- Up to 18 hours of battery life',
    whyBuy: 'Perfect balance of performance and portability with no fan noise.',
    reviews: {
      amazon: 'Customers love the lightweight design and silent operation.',
      instagram: 'Travel influencers praise its portability and battery life.',
      marketplace: 'High ratings for everyday performance and build quality.'
    },
    prosAndCons: {
      pros: ['Silent operation', 'Lightweight design', 'All-day battery'],
      cons: ['Only 2 Thunderbolt ports', 'Base model has slower SSD']
    },
    category: 'Electronics',
    subCategory: 'Computers',
    tags: ['laptop', 'apple', 'portable', 'student']
  },
  {
    title: 'Gaming Chair with RGB Lighting',
    price: '$299.99',
    link: 'https://example.com/gaming-chair-rgb',
    source: 'Amazon',
    description: 'Premium gaming chair with RGB lighting, adjustable features, and premium comfort.',
    features: '- RGB LED lighting\n- Adjustable lumbar support\n- 4D armrests\n- Premium PU leather\n- 360° swivel',
    whyBuy: 'Combines comfort with style, perfect for long gaming sessions and streaming.',
    reviews: {
      amazon: 'Gamers love the RGB lighting and comfort during marathon sessions.',
      instagram: 'Streamers praise the aesthetic appeal and camera-friendly design.',
      marketplace: 'High ratings for build quality and unique features.'
    },
    prosAndCons: {
      pros: ['Unique RGB lighting', 'Very comfortable', 'High-quality build'],
      cons: ['Higher price point', 'RGB may not appeal to everyone']
    },
    category: 'Furniture',
    subCategory: 'Gaming Furniture',
    tags: ['chair', 'gaming', 'rgb', 'comfort']
  },
  {
    title: 'Ergonomic Office Chair Pro',
    price: '$449.99',
    link: 'https://example.com/office-chair-pro',
    source: 'Herman Miller',
    description: 'Professional-grade ergonomic office chair designed for all-day comfort and productivity.',
    features: '- Advanced lumbar support\n- Breathable mesh design\n- Height adjustable armrests\n- 12-year warranty\n- PostureFit technology',
    whyBuy: 'Investment in your health and productivity with professional-grade ergonomics.',
    reviews: {
      amazon: 'Office workers report significant improvement in back comfort and posture.',
      instagram: 'Work-from-home professionals recommend for serious home offices.',
      marketplace: 'Consistently rated 5 stars for durability and comfort.'
    },
    prosAndCons: {
      pros: ['Exceptional ergonomics', 'Durable construction', 'Long warranty'],
      cons: ['Premium price', 'Assembly complexity']
    },
    category: 'Furniture',
    subCategory: 'Office Furniture',
    tags: ['chair', 'office', 'ergonomic', 'professional', 'premium']
  },
  {
    title: 'Smart 4K TV 65"',
    price: '$799.99',
    link: 'https://example.com/smart-tv-65',
    source: 'Best Buy',
    description: 'Large 65-inch 4K smart TV with HDR support and built-in streaming apps.',
    features: '- 65-inch 4K Ultra HD display\n- HDR10+ support\n- Built-in streaming apps\n- Voice remote\n- Gaming mode\n- Multiple HDMI ports',
    whyBuy: 'Perfect for large living rooms with excellent picture quality and smart features.',
    reviews: {
      amazon: 'Customers love the large screen size and crisp 4K picture quality.',
      instagram: 'Home theater enthusiasts praise the HDR performance.',
      marketplace: 'High ratings for value and smart TV features.'
    },
    prosAndCons: {
      pros: ['Large screen size', 'Excellent picture quality', 'Good smart features'],
      cons: ['Requires large space', 'Sound could be better']
    },
    category: 'Electronics',
    subCategory: 'Display',
    tags: ['tv', 'smart', '4k', 'large', 'entertainment']
  },
  {
    title: 'Professional Blender Max',
    price: '$349.99',
    link: 'https://example.com/blender-pro-max',
    source: 'Vitamix',
    description: 'Commercial-grade blender for smoothies, soups, nut butters, and more.',
    features: '- 2.2HP motor\n- Variable speed control\n- Self-cleaning\n- 64oz container\n- 10-year warranty\n- Pre-programmed settings',
    whyBuy: 'Restaurant-quality blending power for serious home cooks and health enthusiasts.',
    reviews: {
      amazon: 'Customers praise the powerful motor and consistent results.',
      instagram: 'Health influencers love the smooth smoothies and nut butter capability.',
      marketplace: 'High ratings for durability and versatility.'
    },
    prosAndCons: {
      pros: ['Extremely powerful', 'Versatile functions', 'Long warranty'],
      cons: ['Very loud operation', 'Premium price point']
    },
    category: 'Kitchen',
    subCategory: 'Appliances',
    tags: ['blender', 'professional', 'kitchen', 'health', 'premium']
  }
];

async function populateSupabase() {
  console.log('🚀 Populating Supabase Database with Sample Products...\n');
  
  const supabaseService = new SupabaseService();
  
  try {
    // Initialize Supabase service
    const initialized = await supabaseService.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize Supabase service');
      return;
    }
    
    console.log('✅ Supabase service initialized');
    
    // Check current product count
    const currentCount = await supabaseService.getProductCount();
    console.log(`📊 Current products in database: ${currentCount}`);
    
    // Add mock products first (if not already present)
    console.log('\n📦 Adding mock products...');
    for (const [index, product] of MOCK_PRODUCTS.entries()) {
      try {
        const productData = {
          title: product.title,
          price: product.price,
          link: product.link,
          source: product.source,
          description: product.description,
          features: product.features,
          whyBuy: product.whyBuy,
          reviews: product.reviews,
          prosAndCons: product.prosAndCons,
          category: 'General',
          subCategory: 'General',
          tags: []
        };
        
        await supabaseService.addProduct(productData);
        console.log(`   ✅ Added: ${product.title}`);
      } catch (error) {
        // Product might already exist, that's OK
        console.log(`   ⚠️  ${product.title}: ${error.message}`);
      }
    }
    
    // Add additional products
    console.log('\n📦 Adding additional sample products...');
    for (const [index, product] of ADDITIONAL_PRODUCTS.entries()) {
      try {
        await supabaseService.addProduct(product);
        console.log(`   ✅ Added: ${product.title}`);
      } catch (error) {
        console.log(`   ❌ Failed to add ${product.title}: ${error.message}`);
      }
    }
    
    // Final count
    const finalCount = await supabaseService.getProductCount();
    console.log(`\n📊 Final products in database: ${finalCount}`);
    
    // Test search with new products
    console.log('\n🔍 Testing search with populated database:');
    const testQueries = ['laptop', 'chair', 'tv', 'blender', 'headphones', 'smart'];
    
    for (const query of testQueries) {
      try {
        const results = await supabaseService.searchProducts(query, 'tech enthusiast');
        console.log(`   "${query}" → ${results.length} results`);
        results.slice(0, 2).forEach((product, i) => {
          console.log(`     ${i + 1}. ${product.title} - ${product.price}`);
        });
      } catch (error) {
        console.log(`   "${query}" → Error: ${error.message}`);
      }
    }
    
    console.log('\n✅ Database population completed successfully!');
    console.log('\n💡 Now you can test database vs mock search:');
    console.log('   • Database search: Will return results from Supabase');
    console.log('   • Mock search: Can be forced by setting useMockData = true');
    console.log('   • AI Service: Will automatically choose Supabase over mock data');
    
  } catch (error) {
    console.log(`❌ Error populating database: ${error.message}`);
  } finally {
    await supabaseService.cleanup();
  }
}

async function testSearchComparison() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 DATABASE vs MOCK SEARCH COMPARISON');
  console.log('='.repeat(60));
  
  const supabaseService = new SupabaseService();
  
  try {
    await supabaseService.initialize();
    
    const testQuery = 'laptop';
    console.log(`\nTesting search for: "${testQuery}"`);
    
    // Database search
    console.log('\n📊 Supabase Database Results:');
    const dbResults = await supabaseService.searchProducts(testQuery, 'tech professional');
    console.log(`   Found ${dbResults.length} products`);
    dbResults.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.title} - ${product.price} (${product.source})`);
    });
    
    // Mock search simulation
    console.log('\n📋 Mock Data Results:');
    const mockResults = MOCK_PRODUCTS.filter(product =>
      product.title.toLowerCase().includes(testQuery) ||
      product.description.toLowerCase().includes(testQuery)
    );
    console.log(`   Found ${mockResults.length} products`);
    mockResults.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.title} - ${product.price} (${product.source})`);
    });
    
    console.log('\n🎯 Key Differences:');
    console.log(`   • Database has ${dbResults.length} results vs Mock has ${mockResults.length}`);
    console.log('   • Database can include additional products beyond mock data');
    console.log('   • Database supports more complex queries and filtering');
    console.log('   • Mock data is static but always available');
    
  } catch (error) {
    console.log(`❌ Search comparison failed: ${error.message}`);
  } finally {
    await supabaseService.cleanup();
  }
}

async function main() {
  await populateSupabase();
  await testSearchComparison();
}

main().catch(console.error);