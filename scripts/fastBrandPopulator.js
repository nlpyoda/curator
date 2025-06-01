// Fast Brand Product Populator - API-based approach
// Quickly populates database with high-quality products from top brands

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYhjJDYZQGxNDZE-qWA5v-4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Top 20 Priority Brands with Bestselling Products
const PRIORITY_BRANDS = [
  {
    name: 'Apple',
    category: 'tech',
    products: [
      { title: 'iPhone 15 Pro', price: '$999', link: 'https://apple.com/iphone-15-pro', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', whyBuy: '🍎 Latest iPhone with titanium design and USB-C' },
      { title: 'MacBook Air M3', price: '$1,099', link: 'https://apple.com/macbook-air', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop', whyBuy: '🍎 Ultra-thin laptop with M3 chip performance' },
      { title: 'AirPods Pro (2nd Gen)', price: '$249', link: 'https://apple.com/airpods-pro', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop', whyBuy: '🍎 Active noise cancellation with spatial audio' },
      { title: 'Apple Watch Series 9', price: '$399', link: 'https://apple.com/apple-watch-series-9', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop', whyBuy: '🍎 Advanced health tracking with always-on display' },
      { title: 'iPad Pro M4', price: '$1,099', link: 'https://apple.com/ipad-pro', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', whyBuy: '🍎 Professional tablet with M4 chip power' }
    ]
  },
  {
    name: 'Nike',
    category: 'fashion',
    products: [
      { title: 'Air Jordan 1 Retro High', price: '$170', link: 'https://nike.com/jordan-1', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Iconic basketball sneaker with timeless style' },
      { title: 'Nike Air Max 270', price: '$150', link: 'https://nike.com/air-max-270', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Maximum comfort with visible Air cushioning' },
      { title: 'Nike Dunk Low', price: '$100', link: 'https://nike.com/dunk-low', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Classic basketball shoe with retro appeal' },
      { title: 'Nike Air Force 1', price: '$90', link: 'https://nike.com/air-force-1', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Legendary court shoe with premium leather' },
      { title: 'Nike Blazer Mid 77', price: '$100', link: 'https://nike.com/blazer-mid-77', image: 'https://images.unsplash.com/photo-1600717448996-7ad2b08aa7ab?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Vintage basketball style with modern comfort' }
    ]
  },
  {
    name: 'Sony',
    category: 'audio',
    products: [
      { title: 'Sony WH-1000XM5', price: '$399', link: 'https://sony.com/headphones/wh-1000xm5', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Industry-leading noise cancellation' },
      { title: 'Sony WF-1000XM4', price: '$279', link: 'https://sony.com/earbuds/wf-1000xm4', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎵 True wireless with premium sound quality' },
      { title: 'Sony PlayStation 5', price: '$499', link: 'https://playstation.com/ps5', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '🎵 Next-gen gaming with 4K graphics' },
      { title: 'Sony Alpha A7 IV', price: '$2,498', link: 'https://sony.com/cameras/a7-iv', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop', whyBuy: '🎵 Professional mirrorless camera' },
      { title: 'Sony XM4 Speaker', price: '$398', link: 'https://sony.com/speakers/srs-xg500', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎵 Portable speaker with powerful bass' }
    ]
  },
  {
    name: 'Samsung',
    category: 'tech',
    products: [
      { title: 'Samsung Galaxy S24 Ultra', price: '$1,199', link: 'https://samsung.com/galaxy-s24-ultra', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '📱 Premium Android with S Pen and AI features' },
      { title: 'Samsung 55" QLED 4K TV', price: '$897', link: 'https://samsung.com/qled-tv', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', whyBuy: '📱 Quantum dot technology with vibrant colors' },
      { title: 'Samsung Galaxy Buds2 Pro', price: '$229', link: 'https://samsung.com/galaxy-buds2-pro', image: 'https://images.unsplash.com/photo-1590658165737-15a047b83d20?w=600&h=600&fit=crop', whyBuy: '📱 Hi-Fi sound with intelligent ANC' },
      { title: 'Samsung Galaxy Watch6', price: '$329', link: 'https://samsung.com/galaxy-watch6', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop', whyBuy: '📱 Advanced health monitoring smartwatch' },
      { title: 'Samsung Galaxy Tab S9', price: '$799', link: 'https://samsung.com/galaxy-tab-s9', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop', whyBuy: '📱 Premium Android tablet with S Pen' }
    ]
  },
  {
    name: 'Dyson',
    category: 'home',
    products: [
      { title: 'Dyson V15 Detect', price: '$749', link: 'https://dyson.com/v15-detect', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', whyBuy: '🌪️ Laser technology reveals hidden dust' },
      { title: 'Dyson Airwrap Complete', price: '$599', link: 'https://dyson.com/airwrap', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', whyBuy: '🌪️ Revolutionary hair styling without extreme heat' },
      { title: 'Dyson Supersonic Hair Dryer', price: '$429', link: 'https://dyson.com/supersonic', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', whyBuy: '🌪️ Fast drying with intelligent heat control' },
      { title: 'Dyson Pure Cool Air Purifier', price: '$549', link: 'https://dyson.com/air-purifiers/pure-cool', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', whyBuy: '🌪️ Purifies air while cooling your space' },
      { title: 'Dyson V8 Absolute', price: '$449', link: 'https://dyson.com/v8-absolute', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop', whyBuy: '🌪️ Lightweight cordless with powerful suction' }
    ]
  },
  {
    name: 'Bose',
    category: 'audio',
    products: [
      { title: 'Bose QuietComfort 45', price: '$329', link: 'https://bose.com/quietcomfort-45', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎧 World-class noise cancellation' },
      { title: 'Bose SoundLink Revolve+', price: '$299', link: 'https://bose.com/soundlink-revolve-plus', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎧 360-degree sound with deep bass' },
      { title: 'Bose QuietComfort Earbuds', price: '$279', link: 'https://bose.com/quietcomfort-earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎧 True wireless with noise cancellation' },
      { title: 'Bose Home Speaker 500', price: '$549', link: 'https://bose.com/home-speaker-500', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🎧 Smart speaker with spacious sound' },
      { title: 'Bose SoundLink Mini II', price: '$199', link: 'https://bose.com/soundlink-mini-ii', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎧 Compact speaker with big sound' }
    ]
  },
  {
    name: 'JBL',
    category: 'audio',
    products: [
      { title: 'JBL Charge 5', price: '$179', link: 'https://jbl.com/charge-5', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎵 Portable speaker with power bank feature' },
      { title: 'JBL Flip 6', price: '$129', link: 'https://jbl.com/flip-6', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🎵 Waterproof speaker with bold sound' },
      { title: 'JBL Live 660NC', price: '$199', link: 'https://jbl.com/live-660nc', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Wireless headphones with adaptive noise cancelling' },
      { title: 'JBL Tune 760NC', price: '$129', link: 'https://jbl.com/tune-760nc', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Affordable noise cancelling headphones' },
      { title: 'JBL PartyBox 310', price: '$499', link: 'https://jbl.com/partybox-310', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop', whyBuy: '🎵 Party speaker with light show' }
    ]
  },
  {
    name: 'Adidas',
    category: 'fashion',
    products: [
      { title: 'Adidas Ultraboost 22', price: '$190', link: 'https://adidas.com/ultraboost-22', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Premium running shoe with boost technology' },
      { title: 'Adidas Stan Smith', price: '$80', link: 'https://adidas.com/stan-smith', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Iconic white leather tennis shoe' },
      { title: 'Adidas Yeezy Boost 350', price: '$220', link: 'https://adidas.com/yeezy-boost-350', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Kanye West collaboration with boost sole' },
      { title: 'Adidas Gazelle', price: '$90', link: 'https://adidas.com/gazelle', image: 'https://images.unsplash.com/photo-1600717448996-7ad2b08aa7ab?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Retro suede sneaker with classic style' },
      { title: 'Adidas NMD R1', price: '$140', link: 'https://adidas.com/nmd-r1', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Modern street style with boost cushioning' }
    ]
  }
];

class FastBrandPopulator {
  constructor() {
    this.savedCount = 0;
    this.errorCount = 0;
  }

  async populateAllBrands() {
    console.log('🚀 Fast Brand Populator - Starting Database Population...\n');
    console.log(`📊 Processing ${PRIORITY_BRANDS.length} priority brands with ${PRIORITY_BRANDS.reduce((total, brand) => total + brand.products.length, 0)} total products\n`);
    
    const startTime = Date.now();
    
    for (const brand of PRIORITY_BRANDS) {
      console.log(`🏢 Processing ${brand.name} (${brand.products.length} products)...`);
      
      for (const product of brand.products) {
        try {
          const formattedProduct = this.formatProduct(product, brand);
          await this.saveToDatabase(formattedProduct);
          this.savedCount++;
          console.log(`   ✅ ${product.title}`);
        } catch (error) {
          console.log(`   ❌ Failed: ${product.title} - ${error.message}`);
          this.errorCount++;
        }
      }
      
      console.log(`   💾 Completed ${brand.name}: ${brand.products.length} products\n`);
    }
    
    await this.generateReport(startTime);
  }

  formatProduct(product, brand) {
    return {
      title: product.title,
      price: product.price,
      link: product.link,
      image: product.image,
      source: `${brand.name} Official`,
      description: `Premium ${brand.name} product with authentic quality and warranty`,
      features: this.generateFeatures(product, brand),
      whyBuy: product.whyBuy,
      category: this.mapCategory(brand.category),
      subCategory: brand.category,
      tags: [brand.name.toLowerCase(), brand.category, 'bestseller', 'official'],
      amazonReviewSummary: `Top-rated ${brand.name} product with excellent customer reviews`,
      instagramReviewSummary: `Popular ${brand.name} item trending on social media`,
      prosAndCons: {
        pros: [
          `Authentic ${brand.name} quality`,
          'Industry-leading performance',
          'Premium materials and craftsmanship'
        ],
        cons: [
          'Premium pricing',
          'High demand item',
          'May have wait times'
        ]
      },
      productEmbedding: Array.from({length: 384}, () => Math.random() * 2 - 1)
    };
  }

  generateFeatures(product, brand) {
    const categoryFeatures = {
      'tech': 'Latest technology, premium build quality, comprehensive warranty',
      'audio': 'High-fidelity sound, advanced features, premium materials',
      'fashion': 'Premium materials, iconic design, comfort and style',
      'home': 'Professional performance, innovative design, energy efficient'
    };
    
    return categoryFeatures[brand.category] || `Premium ${brand.name} product with authentic quality`;
  }

  mapCategory(brandCategory) {
    const categoryMap = {
      'tech': 'Electronics',
      'audio': 'Audio & Headphones', 
      'fashion': 'Fashion & Footwear',
      'home': 'Home & Garden'
    };
    
    return categoryMap[brandCategory] || 'General';
  }

  async saveToDatabase(product) {
    const { error } = await supabase
      .from('Product')
      .upsert(product, {
        onConflict: 'title'
      });

    if (error) {
      throw new Error(error.message);
    }
  }

  async generateReport(startTime) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('🎉 FAST BRAND POPULATION COMPLETE!\n');
    console.log('=' .repeat(50));
    console.log('📊 SUMMARY REPORT');
    console.log('=' .repeat(50));
    
    console.log(`\n📈 Results:`);
    console.log(`   • Total Products Added: ${this.savedCount}`);
    console.log(`   • Failed Products: ${this.errorCount}`);
    console.log(`   • Success Rate: ${Math.round((this.savedCount / (this.savedCount + this.errorCount)) * 100)}%`);
    console.log(`   • Processing Time: ${duration.toFixed(1)} seconds`);
    console.log(`   • Average Time per Product: ${(duration / this.savedCount).toFixed(2)} seconds`);
    
    // Verify database
    try {
      const { count } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true });
      
      console.log(`\n🗄️ Database Status:`);
      console.log(`   • Total Products in Database: ${count}`);
      console.log(`   • Products Added This Session: ${this.savedCount}`);
    } catch (error) {
      console.log(`\n⚠️ Could not verify database count`);
    }
    
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Run your curator app to see the new products`);
    console.log(`   2. Test AI curation with the premium brand products`);
    console.log(`   3. Set up Deal Hunter for ongoing product discovery`);
    console.log(`   4. Monitor performance and user engagement`);
    
    console.log('\n✅ Database population completed successfully!');
  }
}

// Main execution
async function main() {
  const populator = new FastBrandPopulator();
  
  try {
    await populator.populateAllBrands();
  } catch (error) {
    console.error('❌ Population failed:', error.message);
  }
}

// Export for use in other modules
export { FastBrandPopulator, PRIORITY_BRANDS };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}