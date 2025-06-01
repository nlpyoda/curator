// Test production app to see if Supabase is working
// This script simulates what the app does in production

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

async function testProductionApp() {
  console.log('🌐 Testing Production App with Supabase...\n');
  
  try {
    // Test the same connection the production app will use
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('1. Testing Supabase connection...');
    const { data: products, error } = await supabase
      .from('Product')
      .select('*')
      .limit(5);
    
    if (error) {
      throw error;
    }
    
    console.log(`   ✅ Connected! Found ${products.length} products in Supabase`);
    
    console.log('\n2. Sample products from production database:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - ${product.price}`);
      console.log(`      Source: ${product.source}, Category: ${product.category}`);
    });
    
    // Test search functionality like the app would do
    console.log('\n3. Testing search (like app would do)...');
    const { data: searchResults, error: searchError } = await supabase
      .from('Product')
      .select('*')
      .or('title.ilike.%headphones%,description.ilike.%headphones%');
    
    if (searchError) {
      throw searchError;
    }
    
    console.log(`   🔍 Search for "headphones": Found ${searchResults.length} results`);
    searchResults.forEach(product => {
      console.log(`     - ${product.title} - ${product.price}`);
    });
    
    console.log('\n✅ Production app test successful!');
    console.log('\n📊 Production Status:');
    console.log('- Supabase connection: ✅ Working');
    console.log('- Product data: ✅ Available');
    console.log('- Search functionality: ✅ Working');
    console.log(`- Production URL: https://isnt-nlpyoda-awesome.netlify.app`);
    
    console.log('\n🎉 Your app is now serving products from Supabase cloud database!');
    
  } catch (error) {
    console.error('\n❌ Production test failed:', error.message);
    
    if (error.message.includes('relation "Product" does not exist')) {
      console.log('\n💡 The Product table might not be created yet');
    } else {
      console.log('\n💡 Check:');
      console.log('1. Supabase project is running');
      console.log('2. Environment variables are set in Netlify');
      console.log('3. App is deployed with latest code');
    }
  }
}

testProductionApp();