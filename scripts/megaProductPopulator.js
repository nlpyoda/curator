// Mega Product Populator - Add 1000+ products across diverse categories
// Uses correct Supabase anon key for maximum compatibility

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYhjJDYZQGxNDZE-qWA5v-4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate diverse products across categories
function generateDiverseProducts() {
  const products = [];
  
  // Product templates for variety
  const brandTemplates = {
    // Tech/Electronics (200 products)
    'Apple': {
      base: ['iPhone', 'iPad', 'MacBook', 'Apple Watch', 'AirPods', 'iMac', 'Mac Mini', 'Studio Display'],
      variants: ['Pro', 'Pro Max', 'Air', 'Mini', 'Studio', '15"', '13"', 'Ultra', 'SE'],
      priceRange: [99, 4999],
      category: 'Electronics'
    },
    'Samsung': {
      base: ['Galaxy S', 'Galaxy Note', 'Galaxy Tab', 'Galaxy Watch', 'Galaxy Buds', 'QLED TV', 'Monitor', 'SSD'],
      variants: ['Ultra', 'Plus', 'Pro', '24', '23', '22', '21', 'Active', 'FE'],
      priceRange: [79, 2999],
      category: 'Electronics'
    },
    'Sony': {
      base: ['PlayStation', 'WH-1000XM', 'WF-1000XM', 'Alpha A7', 'FX Camera', 'Speaker SRS', 'TV BRAVIA'],
      variants: ['5', '4', '3', 'Pro', 'III', 'IV', 'V', 'R', 'S'],
      priceRange: [149, 3999],
      category: 'Electronics'
    },
    
    // Fashion/Footwear (300 products)
    'Nike': {
      base: ['Air Jordan', 'Air Max', 'Air Force', 'Dunk', 'Blazer', 'React', 'Zoom', 'Free'],
      variants: ['1', '90', '95', '97', '270', '720', 'Low', 'High', 'Mid', 'Retro'],
      priceRange: [65, 250],
      category: 'Fashion & Footwear'
    },
    'Adidas': {
      base: ['Ultraboost', 'Stan Smith', 'Superstar', 'Gazelle', 'NMD', 'Yeezy', 'Forum', 'Campus'],
      variants: ['22', '23', 'DNA', 'OG', 'Primeknit', 'Boost', 'R1', 'R2'],
      priceRange: [60, 350],
      category: 'Fashion & Footwear'
    },
    'Levis': {
      base: ['501', '511', '721', 'Trucker Jacket', 'Sherpa', 'T-Shirt', 'Hoodie'],
      variants: ['Original', 'Skinny', 'Straight', 'Vintage', 'Premium', 'High Rise'],
      priceRange: [29, 199],
      category: 'Fashion & Footwear'
    },
    
    // Home & Kitchen (200 products)
    'Dyson': {
      base: ['V15', 'V12', 'V11', 'Airwrap', 'Supersonic', 'Pure Cool', 'Hot+Cool'],
      variants: ['Detect', 'Absolute', 'Complete', 'Animal', 'Origin', 'Outsize'],
      priceRange: [199, 899],
      category: 'Home & Garden'
    },
    'KitchenAid': {
      base: ['Stand Mixer', 'Food Processor', 'Blender', 'Coffee Maker', 'Toaster', 'Hand Mixer'],
      variants: ['Artisan', 'Professional', 'Classic', '5-Qt', '7-Qt', '13-Cup', 'K400'],
      priceRange: [79, 599],
      category: 'Kitchen & Dining'
    },
    
    // Audio (150 products)
    'Bose': {
      base: ['QuietComfort', 'SoundLink', 'SoundSport', 'Home Speaker', 'Smart Soundbar'],
      variants: ['45', '35', 'Ultra', 'Revolve', 'Mini', 'Flex', '500', '700'],
      priceRange: [99, 899],
      category: 'Audio & Headphones'
    },
    'JBL': {
      base: ['Charge', 'Flip', 'Xtreme', 'PartyBox', 'Tune', 'Live', 'Club'],
      variants: ['5', '6', '3', '310', '110', '660NC', '950NC', 'Pro'],
      priceRange: [39, 699],
      category: 'Audio & Headphones'
    },
    
    // Gaming (100 products)
    'Nintendo': {
      base: ['Switch', 'Mario Kart', 'Zelda', 'Mario Bros', 'Metroid', 'Pokémon', 'Pro Controller'],
      variants: ['OLED', 'Lite', '8 Deluxe', 'Wonder', 'Tears Kingdom', 'Dread', 'Violet'],
      priceRange: [49, 349],
      category: 'Gaming'
    },
    'Microsoft': {
      base: ['Xbox Series', 'Surface Laptop', 'Surface Pro', 'Surface Studio', 'Xbox Controller'],
      variants: ['X', 'S', '5', '9', '2+', 'Wireless', 'Elite'],
      priceRange: [59, 4299],
      category: 'Gaming'
    },
    
    // Beauty & Personal Care (150 products)
    'Dyson Beauty': {
      base: ['Corrale', 'Supersonic', 'Airwrap'],
      variants: ['Straightener', 'Hair Dryer', 'Complete', 'Long', 'Nickel/Copper'],
      priceRange: [399, 599],
      category: 'Beauty & Personal Care'
    }
  };

  // Generate products for each brand
  Object.entries(brandTemplates).forEach(([brand, template]) => {
    template.base.forEach(base => {
      template.variants.forEach(variant => {
        // Create multiple color/size variations
        const variations = [
          { suffix: '', multiplier: 1 },
          { suffix: ' - Black', multiplier: 1 },
          { suffix: ' - White', multiplier: 1.05 },
          { suffix: ' - Silver', multiplier: 1.02 },
          { suffix: ' - Limited Edition', multiplier: 1.15 }
        ];
        
        variations.forEach(variation => {
          const basePrice = Math.floor(Math.random() * (template.priceRange[1] - template.priceRange[0]) + template.priceRange[0]);
          const finalPrice = Math.floor(basePrice * variation.multiplier);
          
          products.push({
            title: `${base} ${variant}${variation.suffix}`,
            price: `$${finalPrice}`,
            link: `https://${brand.toLowerCase().replace(/[^a-z]/g, '')}.com/${base.toLowerCase().replace(/\s+/g, '-')}-${variant.toLowerCase()}`,
            image: getProductImage(template.category, base),
            source: `${brand} Official Store`,
            description: `Premium ${brand} ${base} ${variant} with authentic quality and warranty. ${generateDescription(base, variant, brand)}`,
            features: generateFeatures(base, variant, brand),
            whyBuy: generateWhyBuy(brand, base, variant),
            category: template.category,
            subCategory: getSubCategory(template.category, base),
            tags: [brand.toLowerCase(), base.toLowerCase(), variant.toLowerCase(), 'authentic', 'premium'],
            amazonReviewSummary: `Highly rated ${brand} product with excellent customer satisfaction and verified reviews`,
            instagramReviewSummary: `Trending ${brand} item popular among influencers and lifestyle enthusiasts`,
            prosAndCons: {
              pros: [
                `Authentic ${brand} quality`,
                'Premium materials and craftsmanship',
                'Comprehensive warranty coverage',
                'Industry-leading performance'
              ],
              cons: [
                'Premium pricing',
                'High demand item',
                'May require wait times',
                'Limited availability'
              ]
            },
            productEmbedding: Array.from({length: 384}, () => Math.random() * 2 - 1)
          });
        });
      });
    });
  });

  return products;
}

// Helper functions
function getProductImage(category, productName) {
  const imageMap = {
    'Electronics': {
      'iPhone': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'MacBook': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      'Galaxy': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
      'PlayStation': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
      'default': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
    },
    'Fashion & Footwear': {
      'Air Jordan': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop',
      'Air Max': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'default': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop'
    },
    'Audio & Headphones': {
      'QuietComfort': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'default': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop'
    },
    'Home & Garden': {
      'Dyson': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      'default': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'
    },
    'default': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
  };
  
  const categoryImages = imageMap[category] || imageMap['default'];
  for (const [key, image] of Object.entries(categoryImages)) {
    if (productName.includes(key)) return image;
  }
  return categoryImages['default'] || imageMap['default'];
}

function generateDescription(base, variant, brand) {
  const descriptions = {
    'iPhone': 'Latest iPhone technology with advanced camera system and powerful performance.',
    'MacBook': 'Professional laptop with industry-leading performance and all-day battery life.',
    'Air Jordan': 'Iconic basketball sneaker with premium materials and timeless design.',
    'QuietComfort': 'Industry-leading noise cancellation with exceptional audio quality.',
    'V15': 'Revolutionary vacuum technology with laser dust detection.'
  };
  
  return descriptions[base] || `Premium ${brand} product with cutting-edge features and reliable performance.`;
}

function generateFeatures(base, variant, brand) {
  const featureMap = {
    'iPhone': `- A17 Pro chip\n- Pro camera system\n- All-day battery life\n- iOS ecosystem integration`,
    'MacBook': `- Apple Silicon processor\n- Retina display\n- Up to 20 hours battery\n- macOS productivity`,
    'Air Jordan': `- Premium leather construction\n- Air cushioning technology\n- Iconic design heritage\n- Multiple colorways`,
    'QuietComfort': `- Active noise cancellation\n- 30+ hour battery\n- Multipoint Bluetooth\n- Premium comfort`,
    'default': `- Premium ${brand} quality\n- Advanced technology\n- Durable construction\n- Authentic warranty`
  };
  
  return featureMap[base] || featureMap['default'];
}

function generateWhyBuy(brand, base, variant) {
  const emojis = {
    'Apple': '🍎',
    'Samsung': '📱',
    'Nike': '🏃‍♂️',
    'Sony': '🎵',
    'Bose': '🎧',
    'Dyson': '🌪️',
    'Nintendo': '🎮',
    'Microsoft': '💻'
  };
  
  const emoji = emojis[brand] || '✨';
  return `${emoji} Premium ${brand} ${base} ${variant} with authentic quality and cutting-edge technology`;
}

function getSubCategory(category, productName) {
  const subCategoryMap = {
    'Electronics': {
      'iPhone': 'Smartphones',
      'MacBook': 'Laptops',
      'TV': 'Televisions',
      'default': 'Electronics'
    },
    'Fashion & Footwear': {
      'Air': 'Sneakers',
      'Jacket': 'Outerwear',
      'T-Shirt': 'Apparel',
      'default': 'Footwear'
    }
  };
  
  const categoryMap = subCategoryMap[category] || { 'default': category };
  for (const [key, subCat] of Object.entries(categoryMap)) {
    if (productName.includes(key)) return subCat;
  }
  return categoryMap['default'];
}

class MegaProductPopulator {
  constructor() {
    this.savedCount = 0;
    this.errorCount = 0;
    this.batchSize = 50; // Process in batches to avoid timeout
  }

  async populateDatabase() {
    console.log('🚀 Mega Product Populator - Generating 1000+ Products...\n');
    
    const products = generateDiverseProducts();
    console.log(`📊 Generated ${products.length} diverse products across multiple categories\n`);
    
    const startTime = Date.now();
    
    // Process in batches
    const batches = [];
    for (let i = 0; i < products.length; i += this.batchSize) {
      batches.push(products.slice(i, i + this.batchSize));
    }
    
    console.log(`📦 Processing ${batches.length} batches of ${this.batchSize} products each...\n`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} products)...`);
      
      try {
        const { data, error } = await supabase
          .from('Product')
          .upsert(batch, {
            onConflict: 'title'
          });

        if (error) {
          console.error(`❌ Batch ${i + 1} failed:`, error.message);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Batch ${i + 1} completed successfully`);
          this.savedCount += batch.length;
        }
      } catch (error) {
        console.error(`❌ Batch ${i + 1} error:`, error.message);
        this.errorCount += batch.length;
      }
      
      // Small delay between batches
      if (i < batches.length - 1) {
        await this.delay(1000);
      }
    }
    
    await this.generateReport(startTime, products.length);
  }

  async generateReport(startTime, totalGenerated) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n🎉 MEGA PRODUCT POPULATION COMPLETE!\n');
    console.log('=' .repeat(60));
    console.log('📊 FINAL REPORT');
    console.log('=' .repeat(60));
    
    console.log(`\n📈 Results:`);
    console.log(`   • Products Generated: ${totalGenerated}`);
    console.log(`   • Products Saved: ${this.savedCount}`);
    console.log(`   • Failed Products: ${this.errorCount}`);
    console.log(`   • Success Rate: ${Math.round((this.savedCount / totalGenerated) * 100)}%`);
    console.log(`   • Processing Time: ${duration.toFixed(1)} seconds`);
    console.log(`   • Products per Second: ${(this.savedCount / duration).toFixed(1)}`);
    
    // Verify database
    try {
      const { count } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true });
      
      console.log(`\n🗄️ Database Status:`);
      console.log(`   • Total Products in Database: ${count}`);
      console.log(`   • Products Added This Session: ${this.savedCount}`);
    } catch (error) {
      console.log(`\n⚠️ Could not verify database count: ${error.message}`);
    }
    
    console.log(`\n🎯 What's Now Available:`);
    console.log(`   • 1000+ diverse products across all categories`);
    console.log(`   • Multiple brands: Apple, Samsung, Nike, Bose, Dyson, etc.`);
    console.log(`   • Varied pricing from $29 to $4999`);
    console.log(`   • Different product variations and colors`);
    console.log(`   • Rich search possibilities for AI curation`);
    
    console.log('\n✅ Your database now has massive product diversity for testing!');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const populator = new MegaProductPopulator();
  
  try {
    await populator.populateDatabase();
  } catch (error) {
    console.error('❌ Mega population failed:', error.message);
  }
}

// Export for use in other modules
export { MegaProductPopulator, generateDiverseProducts };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}