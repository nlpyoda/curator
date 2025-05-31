// Test Supabase integration with JavaScript client
import { SupabaseService } from '../app/services/SupabaseService.js';

async function testSupabaseIntegration() {
  console.log('🧪 Testing Supabase JavaScript client integration...\n');
  
  const supabaseService = new SupabaseService();
  
  try {
    // Test initialization
    console.log('1. Testing Supabase initialization...');
    const initSuccess = await supabaseService.initialize();
    
    if (!initSuccess) {
      console.log('❌ Supabase initialization failed');
      console.log('\n📝 Setup needed:');
      console.log('1. Go to https://uubjjjxzywpyxiqcxnfn.supabase.co');
      console.log('2. Settings > API');
      console.log('3. Copy the "anon public" key');
      console.log('4. Add to .env: EXPO_PUBLIC_SUPABASE_KEY="your-key-here"');
      return;
    }
    
    console.log('   ✅ Supabase initialized successfully');
    
    // Test product count
    console.log('\n2. Testing product count...');
    const count = await supabaseService.getProductCount();
    console.log(`   📊 Found ${count} products in Supabase`);
    
    if (count === 0) {
      console.log('\n📝 Database is empty. You can:');
      console.log('1. Use Supabase dashboard to create Product table');
      console.log('2. Manually add some products via dashboard');
      console.log('3. Or use the migration script once table is created');
    } else {
      // Test search functionality
      console.log('\n3. Testing search functionality...');
      const searchResults = await supabaseService.searchProducts('test', 'tech enthusiast');
      console.log(`   🔍 Search returned ${searchResults.length} results`);
      
      if (searchResults.length > 0) {
        console.log('   Sample results:');
        searchResults.slice(0, 2).forEach((product, index) => {
          console.log(`     ${index + 1}. ${product.title} - ${product.price}`);
        });
      }
    }
    
    console.log('\n✅ Supabase integration test completed!');
    
  } catch (error) {
    console.error('\n❌ Supabase integration test failed:', error.message);
    
    if (error.message.includes('Supabase key not found')) {
      console.log('\n🔑 Missing Supabase Key:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Settings > API');
      console.log('3. Copy the "anon public" key');
      console.log('4. Add to .env: EXPO_PUBLIC_SUPABASE_KEY="your-key-here"');
    } else if (error.message.includes('relation "Product" does not exist')) {
      console.log('\n📋 Database Table Missing:');
      console.log('1. Go to Supabase dashboard > Table Editor');
      console.log('2. Create a new table named "Product"');
      console.log('3. Or use SQL Editor to run the Prisma schema');
    }
  } finally {
    await supabaseService.cleanup();
  }
}

testSupabaseIntegration();