const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Define persona and life moment associations
const PERSONA_KEYWORDS = {
  student: {
    keywords: ['budget', 'affordable', 'cheap', 'student', 'dorm', 'college', 'university', 'study', 'laptop', 'portable', 'basic', 'entry'],
    categories: ['laptop', 'computer', 'phone', 'headphones', 'accessories'],
    priceRange: [0, 500]
  },
  trendsetter: {
    keywords: ['premium', 'luxury', 'stylish', 'fashion', 'trendy', 'designer', 'exclusive', 'modern', 'sleek', 'aesthetic', 'instagram'],
    categories: ['fashion', 'beauty', 'jewelry', 'watch', 'bag', 'accessory'],
    priceRange: [200, 5000]
  },
  optimizer: {
    keywords: ['professional', 'business', 'productivity', 'performance', 'ergonomic', 'office', 'work', 'efficient', 'pro', 'enterprise'],
    categories: ['laptop', 'monitor', 'chair', 'desk', 'keyboard', 'mouse', 'software'],
    priceRange: [100, 3000]
  },
  conscious: {
    keywords: ['sustainable', 'eco', 'organic', 'natural', 'green', 'ethical', 'recyclable', 'biodegradable', 'minimal', 'clean'],
    categories: ['skincare', 'food', 'cleaning', 'clothing', 'home'],
    priceRange: [10, 1000]
  }
};

const LIFE_MOMENT_KEYWORDS = {
  'new-arrival': {
    keywords: ['baby', 'infant', 'newborn', 'parent', 'nursery', 'family', 'child', 'kids', 'toddler', 'safety'],
    categories: ['baby', 'family', 'home', 'safety', 'health']
  },
  'career-launch': {
    keywords: ['professional', 'interview', 'business', 'office', 'career', 'work', 'job', 'success', 'promotion'],
    categories: ['clothing', 'laptop', 'accessories', 'grooming', 'business']
  },
  sanctuary: {
    keywords: ['home', 'comfort', 'relax', 'cozy', 'peaceful', 'calm', 'zen', 'meditation', 'wellness', 'spa', 'retreat'],
    categories: ['home', 'furniture', 'decor', 'wellness', 'aromatherapy', 'candles']
  },
  'golden-years': {
    keywords: ['senior', 'elderly', 'retirement', 'comfort', 'easy', 'simple', 'accessible', 'health', 'medication'],
    categories: ['health', 'comfort', 'home', 'medical', 'easy-use']
  },
  'gamer-setup': {
    keywords: ['gaming', 'gamer', 'esports', 'performance', 'fps', 'competitive', 'rgb', 'mechanical', 'high-refresh'],
    categories: ['gaming', 'computer', 'monitor', 'keyboard', 'mouse', 'headset', 'chair']
  },
  'sustainable-living': {
    keywords: ['sustainable', 'eco', 'green', 'renewable', 'carbon-neutral', 'zero-waste', 'organic', 'natural'],
    categories: ['eco', 'green', 'sustainable', 'organic', 'natural']
  },
  'wellness-retreat': {
    keywords: ['wellness', 'health', 'fitness', 'yoga', 'meditation', 'mindfulness', 'self-care', 'spa', 'relaxation'],
    categories: ['wellness', 'fitness', 'health', 'spa', 'relaxation']
  },
  'perfect-hosting': {
    keywords: ['kitchen', 'cooking', 'entertaining', 'dinner', 'party', 'hosting', 'appliance', 'cookware'],
    categories: ['kitchen', 'cooking', 'entertaining', 'appliance', 'home']
  }
};

function calculatePersonaMatch(product, personaId, personaData) {
  let score = 0;
  const text = `${product.title || ''} ${product.description || ''} ${product.features || ''} ${product.whyBuy || ''}`.toLowerCase();
  
  // Check keywords
  const matchedKeywords = personaData.keywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  score += matchedKeywords.length * 0.3;
  
  // Check category
  if (product.category && personaData.categories.some(cat => 
    product.category.toLowerCase().includes(cat.toLowerCase())
  )) {
    score += 0.4;
  }
  
  // Check price range (if available)
  if (product.price && personaData.priceRange) {
    const priceStr = product.price.toString().replace(/[$,]/g, '');
    const price = parseFloat(priceStr);
    if (!isNaN(price) && price >= personaData.priceRange[0] && price <= personaData.priceRange[1]) {
      score += 0.3;
    }
  }
  
  return Math.min(score, 1.0);
}

function calculateLifeMomentMatch(product, momentId, momentData) {
  let score = 0;
  const text = `${product.title || ''} ${product.description || ''} ${product.features || ''} ${product.whyBuy || ''}`.toLowerCase();
  
  // Check keywords
  const matchedKeywords = momentData.keywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  score += matchedKeywords.length * 0.4;
  
  // Check category
  if (product.category && momentData.categories.some(cat => 
    product.category.toLowerCase().includes(cat.toLowerCase())
  )) {
    score += 0.6;
  }
  
  return Math.min(score, 1.0);
}

async function updateSupabaseAssociations() {
  try {
    console.log('🔄 Starting Supabase product association updates...');
    
    // First, check what table exists and get all products
    console.log('📊 Getting products from Supabase...');
    
    const { data: products, error: fetchError } = await supabase
      .from('Product')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${products.length} products to update`);
    
    if (products.length === 0) {
      console.log('ℹ️ No products found in the database');
      return;
    }
    
    // Show a sample of what we found
    console.log('\n📝 Sample products:');
    products.slice(0, 3).forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title}`);
      console.log(`     Category: ${product.category || 'none'}`);
      console.log(`     Price: ${product.price || 'none'}`);
      console.log(`     Current tags: ${product.tags?.join(', ') || 'none'}`);
      console.log('');
    });
    
    let updateCount = 0;
    
    for (const product of products) {
      const newTags = [...(product.tags || [])];
      let hasNewTags = false;
      
      // Check persona matches
      for (const [personaId, personaData] of Object.entries(PERSONA_KEYWORDS)) {
        const score = calculatePersonaMatch(product, personaId, personaData);
        const personaTag = `persona-${personaId}`;
        
        if (score >= 0.3 && !newTags.includes(personaTag)) {
          newTags.push(personaTag);
          hasNewTags = true;
          console.log(`✅ ${product.title} -> ${personaTag} (score: ${score.toFixed(2)})`);
        }
      }
      
      // Check life moment matches
      for (const [momentId, momentData] of Object.entries(LIFE_MOMENT_KEYWORDS)) {
        const score = calculateLifeMomentMatch(product, momentId, momentData);
        const momentTag = `lifemoment-${momentId}`;
        
        if (score >= 0.3 && !newTags.includes(momentTag)) {
          newTags.push(momentTag);
          hasNewTags = true;
          console.log(`✅ ${product.title} -> ${momentTag} (score: ${score.toFixed(2)})`);
        }
      }
      
      // Update product if we have new tags
      if (hasNewTags) {
        const { error: updateError } = await supabase
          .from('Product')
          .update({ tags: newTags })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${product.title}:`, updateError);
        } else {
          updateCount++;
        }
      }
      
      if ((updateCount) % 10 === 0 && updateCount > 0) {
        console.log(`⏳ Processed ${updateCount} products...`);
      }
    }
    
    console.log('\n🎉 Update complete!');
    console.log(`📈 Updated ${updateCount} products with new tags`);
    
    // Show some statistics
    console.log('\n📊 Persona tag distribution:');
    for (const persona of Object.keys(PERSONA_KEYWORDS)) {
      const { count } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true })
        .contains('tags', [`persona-${persona}`]);
      
      console.log(`  ${persona}: ${count || 0} products`);
    }
    
    console.log('\n🏖️ Life moment tag distribution:');
    for (const moment of Object.keys(LIFE_MOMENT_KEYWORDS)) {
      const { count } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true })
        .contains('tags', [`lifemoment-${moment}`]);
      
      console.log(`  ${moment}: ${count || 0} products`);
    }
    
  } catch (error) {
    console.error('❌ Error updating Supabase associations:', error);
  }
}

// Run the update
updateSupabaseAssociations();