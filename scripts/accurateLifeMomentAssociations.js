const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

const supabase = createClient(supabaseUrl, supabaseKey);

// ACCURATE life moment associations based on the screenshot
const ACCURATE_LIFE_MOMENT_LOGIC = {
  'new-arrival': {
    // Baby/parenting products ONLY
    keywords: ['baby', 'infant', 'newborn', 'stroller', 'crib', 'diaper', 'bottle', 'nursery', 'safety', 'monitor', 'carrier'],
    categories: ['baby', 'infant', 'parenting', 'nursery', 'child-safety'],
    // MacBooks/laptops should NOT match this unless they're specifically for new parent organization
    exclude_keywords: ['macbook', 'laptop', 'computer', 'gaming', 'pro', 'max'],
    match_threshold: 0.7 // High threshold - must be clearly baby-related
  },
  
  'career-launch': {
    // Professional gear and business essentials
    keywords: ['professional', 'business', 'office', 'laptop', 'briefcase', 'suit', 'interview', 'work', 'career', 'macbook', 'pro'],
    categories: ['laptop', 'computer', 'business', 'professional', 'office'],
    include_keywords: ['macbook', 'laptop', 'computer', 'professional', 'business'],
    match_threshold: 0.3 // Lower threshold - laptops are good for career
  },
  
  'sanctuary': {
    // Home comfort and decor items
    keywords: ['home', 'decor', 'candle', 'furniture', 'comfort', 'cozy', 'ambient', 'lighting', 'pillow', 'plant'],
    categories: ['home', 'decor', 'furniture', 'lighting', 'comfort'],
    // MacBooks should NOT match this unless they're for home setup
    exclude_keywords: ['macbook', 'laptop', 'computer', 'gaming', 'pro', 'max'],
    match_threshold: 0.7 // High threshold - must be clearly home/comfort related
  },
  
  'golden-years': {
    // Comfort, hobbies, accessibility
    keywords: ['comfort', 'hobby', 'easy', 'accessible', 'reading', 'garden', 'craft', 'health', 'ergonomic'],
    categories: ['comfort', 'hobby', 'health', 'accessibility'],
    // MacBooks might match if they're for hobbies/easy to use
    exclude_keywords: ['gaming', 'pro', 'max', 'performance'],
    match_threshold: 0.6 // Medium threshold
  },
  
  'gamer-setup': {
    // Gaming hardware and performance gear
    keywords: ['gaming', 'gamer', 'performance', 'rgb', 'mechanical', 'high-refresh', 'esports', 'monitor', 'chair', 'pro', 'max'],
    categories: ['gaming', 'computer', 'monitor', 'peripherals'],
    include_keywords: ['macbook', 'pro', 'max', 'performance'], // High-end MacBooks for content creation
    match_threshold: 0.4 // Medium threshold - some laptops are good for gaming/content
  },
  
  'sustainable-living': {
    // Eco-friendly and zero-waste products
    keywords: ['eco', 'sustainable', 'organic', 'bamboo', 'recycled', 'solar', 'biodegradable', 'zero-waste', 'ethical'],
    categories: ['eco', 'sustainable', 'organic', 'green'],
    // MacBooks could match if they're refurbished or eco-conscious
    exclude_keywords: ['gaming', 'performance', 'max'],
    match_threshold: 0.6 // Medium-high threshold
  }
};

function accurateLifeMomentMatch(product, momentId, momentData) {
  const text = `${product.title || ''} ${product.description || ''} ${product.features || ''} ${product.whyBuy || ''}`.toLowerCase();
  let score = 0;
  
  // Check if product should be excluded
  if (momentData.exclude_keywords) {
    const hasExcludedKeyword = momentData.exclude_keywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );
    if (hasExcludedKeyword) {
      console.log(`❌ ${product.title} excluded from ${momentId} due to excluded keywords`);
      return 0; // Automatically exclude
    }
  }
  
  // Check for included keywords (positive indicators)
  if (momentData.include_keywords) {
    const hasIncludedKeyword = momentData.include_keywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );
    if (hasIncludedKeyword) {
      score += 0.5; // Boost for included keywords
    }
  }
  
  // Check regular keywords
  const matchedKeywords = momentData.keywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );
  score += matchedKeywords.length * 0.2;
  
  // Check category
  if (product.category && momentData.categories.some(cat => 
    product.category.toLowerCase().includes(cat.toLowerCase())
  )) {
    score += 0.3;
  }
  
  return Math.min(score, 1.0);
}

async function clearAndUpdateLifeMomentTags() {
  try {
    console.log('🧹 Clearing old life moment tags and applying accurate associations...');
    
    // Get all products
    const { data: products, error: fetchError } = await supabase
      .from('Product')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${products.length} products to re-evaluate`);
    
    let updateCount = 0;
    let totalAssociations = 0;
    
    for (const product of products) {
      // Remove all existing life moment tags
      const cleanedTags = (product.tags || []).filter(tag => 
        !tag.startsWith('lifemoment-')
      );
      
      let hasNewLifeMomentTags = false;
      
      // Apply accurate life moment matching
      for (const [momentId, momentData] of Object.entries(ACCURATE_LIFE_MOMENT_LOGIC)) {
        const score = accurateLifeMomentMatch(product, momentId, momentData);
        const momentTag = `lifemoment-${momentId}`;
        
        if (score >= momentData.match_threshold) {
          cleanedTags.push(momentTag);
          hasNewLifeMomentTags = true;
          totalAssociations++;
          console.log(`✅ ${product.title} -> ${momentTag} (score: ${score.toFixed(2)}, threshold: ${momentData.match_threshold})`);
        } else if (score > 0) {
          console.log(`⚠️ ${product.title} -> ${momentTag} (score: ${score.toFixed(2)}, below threshold: ${momentData.match_threshold})`);
        }
      }
      
      // Update product with cleaned and new tags
      const { error: updateError } = await supabase
        .from('Product')
        .update({ tags: cleanedTags })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${product.title}:`, updateError);
      } else {
        updateCount++;
      }
      
      if (updateCount % 100 === 0) {
        console.log(`⏳ Processed ${updateCount} products...`);
      }
    }
    
    console.log('\n🎉 Accurate life moment associations complete!');
    console.log(`📈 Updated ${updateCount} products`);
    console.log(`🎯 Total life moment associations: ${totalAssociations}`);
    
    // Show final statistics
    console.log('\n📊 ACCURATE Life moment tag distribution:');
    for (const moment of Object.keys(ACCURATE_LIFE_MOMENT_LOGIC)) {
      const { count } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true })
        .contains('tags', [`lifemoment-${moment}`]);
      
      console.log(`  ${moment}: ${count || 0} products`);
    }
    
    // Show some examples of what got associated
    console.log('\n📝 Sample associations:');
    for (const moment of Object.keys(ACCURATE_LIFE_MOMENT_LOGIC)) {
      const { data: examples } = await supabase
        .from('Product')
        .select('title')
        .contains('tags', [`lifemoment-${moment}`])
        .limit(2);
      
      if (examples && examples.length > 0) {
        console.log(`  ${moment}:`);
        examples.forEach(product => {
          console.log(`    - ${product.title}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating accurate life moment associations:', error);
  }
}

// Run the accurate update
clearAndUpdateLifeMomentTags();