const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Define diverse product categories for each persona and life moment
const DIVERSE_PRODUCT_TARGETS = {
  personas: {
    student: [
      { category: 'laptop', keywords: ['budget laptop', 'student laptop', 'chromebook', 'refurbished laptop'], count: 15 },
      { category: 'phone', keywords: ['budget smartphone', 'android phone', 'unlocked phone'], count: 10 },
      { category: 'headphones', keywords: ['budget headphones', 'wireless earbuds', 'study headphones'], count: 8 },
      { category: 'backpack', keywords: ['school backpack', 'student backpack', 'laptop bag'], count: 7 },
      { category: 'desk', keywords: ['small desk', 'dorm desk', 'study desk', 'compact desk'], count: 5 }
    ],
    trendsetter: [
      { category: 'fashion', keywords: ['designer handbag', 'luxury watch', 'designer sunglasses'], count: 12 },
      { category: 'beauty', keywords: ['premium skincare', 'luxury makeup', 'beauty tools'], count: 10 },
      { category: 'jewelry', keywords: ['gold jewelry', 'silver jewelry', 'designer jewelry'], count: 8 },
      { category: 'phone', keywords: ['iPhone 15', 'premium smartphone', 'luxury phone case'], count: 8 },
      { category: 'clothing', keywords: ['designer dress', 'luxury clothing', 'premium fashion'], count: 7 }
    ],
    optimizer: [
      { category: 'monitor', keywords: ['4K monitor', 'ultrawide monitor', 'professional monitor'], count: 12 },
      { category: 'keyboard', keywords: ['mechanical keyboard', 'ergonomic keyboard', 'wireless keyboard'], count: 10 },
      { category: 'mouse', keywords: ['ergonomic mouse', 'wireless mouse', 'gaming mouse'], count: 8 },
      { category: 'chair', keywords: ['ergonomic chair', 'office chair', 'herman miller'], count: 8 },
      { category: 'desk', keywords: ['standing desk', 'adjustable desk', 'executive desk'], count: 7 }
    ],
    conscious: [
      { category: 'skincare', keywords: ['organic skincare', 'natural skincare', 'eco skincare'], count: 12 },
      { category: 'food', keywords: ['organic food', 'sustainable food', 'eco friendly snacks'], count: 10 },
      { category: 'cleaning', keywords: ['eco cleaning products', 'natural cleaners', 'zero waste'], count: 8 },
      { category: 'clothing', keywords: ['sustainable clothing', 'organic cotton', 'eco fashion'], count: 8 },
      { category: 'home', keywords: ['bamboo products', 'sustainable home', 'eco home decor'], count: 7 }
    ]
  },
  lifeMoments: {
    'new-arrival': [
      { category: 'baby-gear', keywords: ['baby stroller', 'car seat', 'baby carrier'], count: 15 },
      { category: 'nursery', keywords: ['crib', 'changing table', 'nursery decor'], count: 12 },
      { category: 'feeding', keywords: ['baby bottles', 'breast pump', 'high chair'], count: 10 },
      { category: 'safety', keywords: ['baby monitor', 'baby gates', 'outlet covers'], count: 8 },
      { category: 'toys', keywords: ['baby toys', 'developmental toys', 'soft toys'], count: 5 }
    ],
    'career-launch': [
      { category: 'laptop', keywords: ['business laptop', 'macbook pro', 'thinkpad'], count: 15 },
      { category: 'clothing', keywords: ['business suit', 'dress shirt', 'professional attire'], count: 12 },
      { category: 'bag', keywords: ['briefcase', 'laptop bag', 'professional bag'], count: 8 },
      { category: 'accessories', keywords: ['professional watch', 'business accessories'], count: 7 },
      { category: 'grooming', keywords: ['professional grooming', 'cologne', 'hair styling'], count: 5 }
    ],
    'sanctuary': [
      { category: 'furniture', keywords: ['comfortable sofa', 'reading chair', 'coffee table'], count: 15 },
      { category: 'lighting', keywords: ['ambient lighting', 'table lamps', 'floor lamps'], count: 12 },
      { category: 'decor', keywords: ['wall art', 'throw pillows', 'plants'], count: 10 },
      { category: 'candles', keywords: ['scented candles', 'luxury candles', 'aromatherapy'], count: 8 },
      { category: 'textiles', keywords: ['throw blankets', 'rugs', 'curtains'], count: 5 }
    ],
    'golden-years': [
      { category: 'health', keywords: ['blood pressure monitor', 'pill organizer', 'mobility aids'], count: 12 },
      { category: 'comfort', keywords: ['comfortable shoes', 'ergonomic cushions', 'heating pad'], count: 10 },
      { category: 'hobbies', keywords: ['gardening tools', 'puzzle games', 'craft supplies'], count: 8 },
      { category: 'technology', keywords: ['large button phone', 'tablet for seniors', 'simple devices'], count: 7 },
      { category: 'reading', keywords: ['reading glasses', 'book light', 'large print books'], count: 5 }
    ],
    'gamer-setup': [
      { category: 'monitor', keywords: ['gaming monitor', '144hz monitor', '4K gaming display'], count: 15 },
      { category: 'keyboard', keywords: ['mechanical gaming keyboard', 'RGB keyboard'], count: 12 },
      { category: 'mouse', keywords: ['gaming mouse', 'wireless gaming mouse', 'RGB mouse'], count: 10 },
      { category: 'headset', keywords: ['gaming headset', 'wireless gaming headset'], count: 8 },
      { category: 'chair', keywords: ['gaming chair', 'racing chair', 'ergonomic gaming'], count: 5 }
    ],
    'sustainable-living': [
      { category: 'solar', keywords: ['solar panels', 'solar charger', 'renewable energy'], count: 12 },
      { category: 'reusable', keywords: ['reusable water bottle', 'reusable bags', 'zero waste'], count: 10 },
      { category: 'organic', keywords: ['organic food', 'organic clothing', 'natural products'], count: 8 },
      { category: 'composting', keywords: ['compost bin', 'garden tools', 'sustainable garden'], count: 7 },
      { category: 'eco-home', keywords: ['bamboo products', 'cork products', 'sustainable materials'], count: 5 }
    ]
  }
};

// Simulated product data based on realistic product research
const CURATED_PRODUCTS = {
  // Student products
  'budget laptop': [
    {
      title: 'ASUS VivoBook 15 Thin and Light Laptop',
      description: 'Affordable 15.6" laptop perfect for students with AMD Ryzen 3 processor, 8GB RAM, and 256GB SSD storage.',
      price: '$449',
      category: 'laptop',
      link: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'AMD Ryzen 3, 8GB RAM, 256GB SSD, Windows 11',
      whyBuy: 'Perfect balance of performance and affordability for students'
    },
    {
      title: 'Acer Chromebook Spin 314',
      description: 'Convertible Chromebook ideal for students who need portability and long battery life for schoolwork.',
      price: '$379',
      category: 'laptop',
      link: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Intel Celeron N4500, 4GB RAM, 64GB eMMC, Chrome OS',
      whyBuy: 'Lightweight, long battery life, perfect for online learning'
    }
  ],
  
  // Trendsetter products
  'designer handbag': [
    {
      title: 'Michael Kors Jet Set Medium Tote',
      description: 'Luxurious Saffiano leather tote bag perfect for the modern trendsetter who values style and functionality.',
      price: '$298',
      category: 'fashion',
      link: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Saffiano leather, multiple compartments, signature hardware',
      whyBuy: 'Timeless design that elevates any outfit while staying functional'
    },
    {
      title: 'Coach Pillow Tabby Shoulder Bag',
      description: 'Soft puffy leather bag that combines comfort with high fashion, perfect for making a statement.',
      price: '$450',
      category: 'fashion',
      link: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Puffy leather construction, adjustable strap, signature Coach hardware',
      whyBuy: 'Unique texture and design that stands out in any crowd'
    }
  ],

  // Baby products for new-arrival
  'baby stroller': [
    {
      title: 'UPPAbaby Vista V2 Stroller',
      description: 'Premium convertible stroller that grows with your family, featuring superior suspension and comfort.',
      price: '$949',
      category: 'baby-gear',
      link: 'https://images.unsplash.com/photo-1544553845-4d508eaa10b0?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Convertible design, all-wheel suspension, expandable storage',
      whyBuy: 'Investment piece that adapts from infant to toddler and beyond'
    },
    {
      title: 'Baby Jogger City Mini GT2 Stroller',
      description: 'All-terrain stroller perfect for active parents who want to maintain their lifestyle with baby.',
      price: '$279',
      category: 'baby-gear',
      link: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'All-terrain wheels, hand brake, one-hand fold',
      whyBuy: 'Smooth ride on any surface with easy maneuverability'
    }
  ],

  // Gaming products
  'gaming monitor': [
    {
      title: 'ASUS TUF Gaming VG27AQ 27" 1440P Monitor',
      description: 'Professional gaming monitor with 165Hz refresh rate and G-SYNC compatibility for competitive gaming.',
      price: '$329',
      category: 'monitor',
      link: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop',
      source: 'curated',
      features: '27" 1440P, 165Hz, G-SYNC Compatible, IPS panel',
      whyBuy: 'Perfect balance of size, resolution, and refresh rate for gaming'
    }
  ],

  // Sustainable products
  'solar charger': [
    {
      title: 'Goal Zero Nomad 7 Plus Solar Panel',
      description: 'Portable solar charger perfect for outdoor adventures and reducing dependence on grid electricity.',
      price: '$99',
      category: 'solar',
      link: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
      source: 'curated',
      features: '7W solar panel, USB output, weather resistant',
      whyBuy: 'Clean energy on the go for your devices and outdoor activities'
    }
  ],

  // Professional/optimizer products
  'ergonomic chair': [
    {
      title: 'Herman Miller Aeron Chair',
      description: 'World-renowned ergonomic office chair designed for all-day comfort and optimal productivity.',
      price: '$1395',
      category: 'chair',
      link: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Breathable mesh, adjustable lumbar support, 12-year warranty',
      whyBuy: 'Investment in your health and productivity for years to come'
    }
  ],

  // Golden years products
  'blood pressure monitor': [
    {
      title: 'Omron Platinum Blood Pressure Monitor',
      description: 'Advanced home blood pressure monitoring with smartphone connectivity for easy health tracking.',
      price: '$79',
      category: 'health',
      link: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Bluetooth connectivity, unlimited memory, easy-to-read display',
      whyBuy: 'Professional-grade accuracy for monitoring health at home'
    }
  ],

  // Sanctuary/home products
  'scented candles': [
    {
      title: 'Diptyque Baies Candle',
      description: 'Luxury French candle with sophisticated blackcurrant and rose scent, perfect for creating ambiance.',
      price: '$68',
      category: 'candles',
      link: 'https://images.unsplash.com/photo-1602874801006-e26ae98d3d95?w=800&h=600&fit=crop',
      source: 'curated',
      features: '70-hour burn time, hand-poured, signature Diptyque scent',
      whyBuy: 'Transforms any space into a luxurious retreat with sophisticated fragrance'
    }
  ]
};

// Expand products with variations
function generateProductVariations(baseProducts) {
  const variations = [];
  
  for (const [searchTerm, products] of Object.entries(baseProducts)) {
    for (const product of products) {
      variations.push(product);
      
      // Generate price variations
      const basePrice = parseInt(product.price.replace(/[$,]/g, ''));
      
      // Budget version
      const budgetPrice = Math.round(basePrice * 0.7);
      variations.push({
        ...product,
        title: product.title.replace(/Premium|Luxury|Professional/, 'Budget'),
        price: `$${budgetPrice}`,
        description: product.description.replace(/premium|luxury|professional/gi, 'affordable'),
        whyBuy: product.whyBuy + ' at an affordable price point'
      });
      
      // Premium version
      const premiumPrice = Math.round(basePrice * 1.4);
      variations.push({
        ...product,
        title: 'Premium ' + product.title,
        price: `$${premiumPrice}`,
        description: 'Premium ' + product.description.toLowerCase(),
        whyBuy: 'Top-tier quality and features for the discerning customer'
      });
    }
  }
  
  return variations;
}

async function clearExistingProducts() {
  console.log('🧹 Clearing existing products from database...');
  
  const { error } = await supabase
    .from('Product')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all products
  
  if (error) {
    console.error('❌ Error clearing products:', error);
    return false;
  }
  
  console.log('✅ Existing products cleared');
  return true;
}

async function insertDiverseProducts() {
  console.log('🌟 Generating diverse product catalog...');
  
  const allProducts = generateProductVariations(CURATED_PRODUCTS);
  
  // Add more category diversity
  const additionalProducts = [
    // Kitchen/cooking products for hosting
    {
      title: 'KitchenAid Stand Mixer',
      description: 'Professional-grade stand mixer perfect for baking enthusiasts and dinner party hosts.',
      price: '$379',
      category: 'kitchen',
      link: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      source: 'curated',
      features: '5-quart bowl, 10 speeds, multiple attachments',
      whyBuy: 'Essential tool for creating memorable meals and desserts for guests'
    },
    
    // Fitness/wellness products
    {
      title: 'Peloton Bike+',
      description: 'Connected fitness bike that brings studio-quality workouts to your home sanctuary.',
      price: '$2495',
      category: 'fitness',
      link: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Rotating HD touchscreen, live and on-demand classes, heart rate monitoring',
      whyBuy: 'Transform your home into a personal fitness studio with world-class instruction'
    },
    
    // Beauty/skincare for conscious consumers
    {
      title: 'Tatcha The Water Cream',
      description: 'Oil-free moisturizer made with Japanese botanicals for clean, conscious skincare.',
      price: '$68',
      category: 'skincare',
      link: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Oil-free, non-comedogenic, Japanese wild rose and botanical hyaluronic acid',
      whyBuy: 'Clean beauty that delivers results while honoring traditional Japanese skincare wisdom'
    },
    
    // Home office products for career-focused individuals
    {
      title: 'Autonomous SmartDesk Pro',
      description: 'Electric standing desk that promotes health and productivity in professional settings.',
      price: '$399',
      category: 'desk',
      link: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      source: 'curated',
      features: 'Electric height adjustment, memory presets, cable management',
      whyBuy: 'Invest in your health and productivity with professional-grade workspace furniture'
    }
  ];
  
  allProducts.push(...additionalProducts);
  
  // Generate unique IDs and randomize order
  const productsToInsert = allProducts.map((product, index) => ({
    ...product,
    // Remove the id field to let Supabase auto-generate UUIDs
    tags: [], // Start with empty tags, will be populated by association script
    productEmbedding: new Array(1536).fill(0) // Empty embedding vector, will be generated later
  }));
  
  console.log(`📦 Inserting ${productsToInsert.length} diverse products...`);
  
  // Insert in batches to avoid overwhelming the database
  const batchSize = 50;
  let insertedCount = 0;
  
  for (let i = 0; i < productsToInsert.length; i += batchSize) {
    const batch = productsToInsert.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('Product')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
    } else {
      insertedCount += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${insertedCount} total products`);
    }
  }
  
  console.log(`🎉 Successfully inserted ${insertedCount} diverse products!`);
  return insertedCount;
}

async function showDiversityReport() {
  console.log('\n📊 DIVERSITY REPORT:');
  
  // Count products by category
  const { data: products, error } = await supabase
    .from('Product')
    .select('category, title, price');
  
  if (error) {
    console.error('❌ Error fetching diversity report:', error);
    return;
  }
  
  const categoryCount = {};
  const priceRanges = { under100: 0, under500: 0, under1000: 0, over1000: 0 };
  
  products.forEach(product => {
    // Count categories
    const category = product.category || 'uncategorized';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
    
    // Count price ranges
    const price = parseInt(product.price?.replace(/[$,]/g, '') || '0');
    if (price < 100) priceRanges.under100++;
    else if (price < 500) priceRanges.under500++;
    else if (price < 1000) priceRanges.under1000++;
    else priceRanges.over1000++;
  });
  
  console.log('\n🏷️ Product Categories:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} products`);
  });
  
  console.log('\n💰 Price Distribution:');
  console.log(`  Under $100: ${priceRanges.under100} products`);
  console.log(`  $100-$499: ${priceRanges.under500} products`);
  console.log(`  $500-$999: ${priceRanges.under1000} products`);
  console.log(`  $1000+: ${priceRanges.over1000} products`);
  
  console.log(`\n📈 Total Products: ${products.length}`);
  console.log(`🎯 Categories: ${Object.keys(categoryCount).length}`);
}

async function runDiverseProductScraper() {
  try {
    console.log('🚀 Starting Diverse Product Catalog Generation...\n');
    
    // Step 1: Clear existing products
    const cleared = await clearExistingProducts();
    if (!cleared) {
      console.error('❌ Failed to clear existing products');
      return;
    }
    
    // Step 2: Insert diverse products
    const insertedCount = await insertDiverseProducts();
    if (insertedCount === 0) {
      console.error('❌ No products were inserted');
      return;
    }
    
    // Step 3: Show diversity report
    await showDiversityReport();
    
    console.log('\n🎉 Diverse product catalog generation complete!');
    console.log('🔄 Ready to run association script with new diverse products');
    
  } catch (error) {
    console.error('❌ Error in diverse product scraper:', error);
  }
}

// Run the scraper
runDiverseProductScraper();