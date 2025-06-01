// Simple database test without external dependencies
import { SupabaseService } from '../app/services/SupabaseService.js';
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

async function testSupabaseOnly() {
  console.log('🧪 Testing Supabase Database Integration...\n');
  
  try {
    const supabaseService = new SupabaseService();
    const initialized = await supabaseService.initialize();
    
    if (!initialized) {
      console.log('❌ Supabase initialization failed');
      return { available: false, reason: 'Initialization failed' };
    }
    
    const productCount = await supabaseService.getProductCount();
    console.log(`✅ Supabase initialized with ${productCount} products`);
    
    if (productCount === 0) {
      console.log('📋 Database is empty');
      return { available: true, productCount: 0, reason: 'No products in database' };
    }
    
    // Test search functionality
    const testQueries = ['headphones', 'smart', 'chair', 'laptop', 'tv', 'blender'];
    const searchResults = {};
    
    console.log('\n🔍 Testing search functionality:');
    for (const query of testQueries) {
      try {
        const results = await supabaseService.searchProducts(query, 'tech enthusiast');
        searchResults[query] = results.length;
        console.log(`   "${query}" → ${results.length} results`);
        
        // Show sample results for queries that return data
        if (results.length > 0) {
          results.slice(0, 2).forEach((product, i) => {
            console.log(`     ${i + 1}. ${product.title} - ${product.price}`);
          });
        }
      } catch (error) {
        searchResults[query] = 0;
        console.log(`   "${query}" → Error: ${error.message}`);
      }
    }
    
    await supabaseService.cleanup();
    return { 
      available: true, 
      productCount, 
      searchResults,
      reason: 'Fully functional'
    };
    
  } catch (error) {
    console.log(`❌ Supabase test failed: ${error.message}`);
    return { available: false, reason: error.message };
  }
}

async function testPrismaConnection() {
  console.log('\n🧪 Testing Prisma Local Database Connection...\n');
  
  try {
    // Use dynamic import to avoid dependency issues
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test connection
    await prisma.$connect();
    const productCount = await prisma.product.count();
    console.log(`✅ Prisma connected with ${productCount} products`);
    
    if (productCount > 0) {
      // Test a simple search
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: 'laptop', mode: 'insensitive' } },
            { title: { contains: 'headphones', mode: 'insensitive' } }
          ]
        },
        take: 3
      });
      
      console.log(`   Found ${products.length} sample products:`);
      products.forEach((product, i) => {
        console.log(`     ${i + 1}. ${product.title} - ${product.price}`);
      });
    }
    
    await prisma.$disconnect();
    return { 
      available: true, 
      productCount, 
      reason: 'Connected successfully'
    };
    
  } catch (error) {
    console.log(`❌ Prisma test failed: ${error.message}`);
    return { available: false, reason: error.message };
  }
}

function testMockData() {
  console.log('\n🧪 Testing Mock Data...\n');
  
  try {
    console.log(`✅ Mock data available with ${MOCK_PRODUCTS.length} products`);
    
    // Test mock search simulation
    const testQuery = 'headphones';
    const mockResults = MOCK_PRODUCTS.filter(product =>
      product.title.toLowerCase().includes(testQuery) ||
      product.description.toLowerCase().includes(testQuery)
    );
    
    console.log(`🔍 Mock search for "${testQuery}" → ${mockResults.length} results`);
    mockResults.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.title} - ${product.price}`);
    });
    
    return { 
      available: true, 
      productCount: MOCK_PRODUCTS.length,
      reason: 'Always available'
    };
    
  } catch (error) {
    console.log(`❌ Mock data test failed: ${error.message}`);
    return { available: false, reason: error.message };
  }
}

async function main() {
  console.log('🚀 Curator App Database Status Check\n');
  console.log('='.repeat(50));
  
  const results = {};
  
  // Test all data sources
  results.supabase = await testSupabaseOnly();
  results.prisma = await testPrismaConnection();
  results.mock = testMockData();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  
  console.log('\n🏆 Data Source Status:');
  Object.entries(results).forEach(([source, data]) => {
    const status = data.available ? '✅ Available' : '❌ Not Available';
    const count = data.productCount || 0;
    console.log(`   ${source.toUpperCase().padEnd(10)} ${status} (${count} products)`);
    console.log(`   ${' '.repeat(13)} Reason: ${data.reason}`);
  });
  
  console.log('\n🎯 Current Configuration:');
  console.log('   • AI Service Priority: Supabase → Prisma → Mock Data');
  console.log('   • Environment Variables: .env file configured');
  console.log('   • Supabase URL: https://uubjjjxzywpyxiqcxnfn.supabase.co');
  
  console.log('\n💡 Recommendations:');
  
  if (results.supabase.available && results.supabase.productCount > 0) {
    console.log('   ✅ Production Ready: Supabase database has products');
    console.log('   🚀 App will use Supabase cloud database in production');
  } else if (results.supabase.available && results.supabase.productCount === 0) {
    console.log('   ⚠️  Supabase connected but empty:');
    console.log('      1. Go to https://uubjjjxzywpyxiqcxnfn.supabase.co');
    console.log('      2. SQL Editor → New Query');
    console.log('      3. Run script from scripts/supabase-schema.sql');
  } else {
    console.log('   ❌ Supabase not available:');
    console.log('      1. Check EXPO_PUBLIC_SUPABASE_KEY in .env');
    console.log('      2. Verify Supabase project is active');
  }
  
  if (results.prisma.available && results.prisma.productCount > 0) {
    console.log('   ✅ Development Ready: Local database has products');
  } else if (results.prisma.available && results.prisma.productCount === 0) {
    console.log('   ⚠️  Local database connected but empty:');
    console.log('      Run: node scripts/populateProducts.js');
  } else {
    console.log('   ⚠️  Local database not available:');
    console.log('      1. Start PostgreSQL: brew services start postgresql');
    console.log('      2. Create database: createdb curator_db');
    console.log('      3. Push schema: npx prisma db push');
  }
  
  console.log('   ✅ Mock Data: Always available as fallback');
  
  console.log('\n🔧 Testing Database vs Mock Search:');
  console.log('   • Production: Uses Supabase if available, otherwise mock data');
  console.log('   • Development: Uses local Prisma if available, otherwise mock data');
  console.log('   • Fallback: Mock data ensures app always works');
  
  console.log('\n🧪 Next Steps to Test Search:');
  console.log('   1. Populate Supabase: Add products via SQL script');
  console.log('   2. Test integration: node scripts/testAIServiceWithSupabase.js');
  console.log('   3. Compare results: Search returns database vs mock data');
}

main().catch(console.error);