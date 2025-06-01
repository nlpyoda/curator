// Comprehensive test script to compare database search vs mock data search
import { AIProductService } from '../app/services/AIProductService.js';
import { SupabaseService } from '../app/services/SupabaseService.js';
import { DatabaseService } from '../app/services/DatabaseService.js';
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

class DatabaseComparisonTest {
  constructor() {
    this.results = {
      supabase: { available: false, productCount: 0, searchResults: {} },
      prisma: { available: false, productCount: 0, searchResults: {} },
      mock: { available: true, productCount: MOCK_PRODUCTS.length, searchResults: {} }
    };
  }

  async testSupabase() {
    console.log('🧪 Testing Supabase Database...');
    try {
      const supabaseService = new SupabaseService();
      const initialized = await supabaseService.initialize();
      
      if (initialized) {
        this.results.supabase.available = true;
        this.results.supabase.productCount = await supabaseService.getProductCount();
        console.log(`   ✅ Supabase available with ${this.results.supabase.productCount} products`);
        
        // Test search functionality
        const testQueries = ['headphones', 'smart', 'chair', 'laptop'];
        for (const query of testQueries) {
          try {
            const results = await supabaseService.searchProducts(query, 'tech enthusiast');
            this.results.supabase.searchResults[query] = results.length;
            console.log(`   🔍 "${query}" → ${results.length} results`);
          } catch (error) {
            console.log(`   ❌ Search "${query}" failed: ${error.message}`);
            this.results.supabase.searchResults[query] = 0;
          }
        }
        
        await supabaseService.cleanup();
      } else {
        console.log('   ❌ Supabase initialization failed');
      }
    } catch (error) {
      console.log(`   ❌ Supabase error: ${error.message}`);
    }
  }

  async testPrisma() {
    console.log('\n🧪 Testing Prisma Local Database...');
    try {
      const databaseService = new DatabaseService();
      await databaseService.initialize();
      
      // Check if database has products
      const productCount = await databaseService.prisma.product.count();
      this.results.prisma.available = true;
      this.results.prisma.productCount = productCount;
      console.log(`   ✅ Prisma available with ${productCount} products`);
      
      if (productCount > 0) {
        // Test search functionality using AIProductService's database search
        const testQueries = ['headphones', 'smart', 'chair', 'laptop'];
        for (const query of testQueries) {
          try {
            // Create a minimal AI service instance for testing database search
            const aiService = new AIProductService();
            aiService.databaseService = databaseService;
            aiService.databaseAvailable = true;
            
            const results = await aiService.searchProductsFromDatabase(query, 'tech enthusiast');
            this.results.prisma.searchResults[query] = results.length;
            console.log(`   🔍 "${query}" → ${results.length} results`);
          } catch (error) {
            console.log(`   ❌ Search "${query}" failed: ${error.message}`);
            this.results.prisma.searchResults[query] = 0;
          }
        }
      } else {
        console.log('   📋 Database is empty - no products to search');
      }
      
      await databaseService.cleanup();
    } catch (error) {
      console.log(`   ❌ Prisma error: ${error.message}`);
      this.results.prisma.available = false;
    }
  }

  async testMockData() {
    console.log('\n🧪 Testing Mock Data...');
    try {
      const aiService = new AIProductService();
      aiService.useMockData = true;
      aiService.activeService = 'mock';
      
      const testQueries = ['headphones', 'smart', 'chair', 'laptop'];
      for (const query of testQueries) {
        try {
          const results = await aiService.searchProducts(query, 'tech enthusiast');
          this.results.mock.searchResults[query] = results.length;
          console.log(`   🔍 "${query}" → ${results.length} results`);
        } catch (error) {
          console.log(`   ❌ Search "${query}" failed: ${error.message}`);
          this.results.mock.searchResults[query] = 0;
        }
      }
      
      console.log(`   ✅ Mock data available with ${this.results.mock.productCount} products`);
    } catch (error) {
      console.log(`   ❌ Mock data error: ${error.message}`);
    }
  }

  async testAIServicePriority() {
    console.log('\n🧪 Testing AI Service Priority Logic...');
    try {
      const aiService = new AIProductService();
      await aiService.initialize();
      
      console.log(`   🎯 Active service: ${aiService.activeService}`);
      console.log(`   📊 Supabase available: ${aiService.supabaseAvailable}`);
      console.log(`   📊 Prisma available: ${aiService.databaseAvailable}`);
      console.log(`   📊 Using mock data: ${aiService.useMockData}`);
      
      // Test a search to see which service is actually used
      const testResults = await aiService.searchProducts('laptop', 'tech enthusiast');
      console.log(`   🔍 Test search returned ${testResults.length} results`);
      
      await aiService.cleanup();
    } catch (error) {
      console.log(`   ❌ AI Service error: ${error.message}`);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DATABASE COMPARISON SUMMARY');
    console.log('='.repeat(60));
    
    console.log('\n🏆 Service Availability:');
    Object.entries(this.results).forEach(([service, data]) => {
      const status = data.available ? '✅ Available' : '❌ Not Available';
      console.log(`   ${service.toUpperCase().padEnd(10)} ${status} (${data.productCount} products)`);
    });
    
    console.log('\n🔍 Search Performance Comparison:');
    const queries = ['headphones', 'smart', 'chair', 'laptop'];
    
    console.log('Query'.padEnd(15) + 'Supabase'.padEnd(12) + 'Prisma'.padEnd(12) + 'Mock Data');
    console.log('-'.repeat(50));
    
    queries.forEach(query => {
      const supabaseCount = this.results.supabase.searchResults[query] || 0;
      const prismaCount = this.results.prisma.searchResults[query] || 0;
      const mockCount = this.results.mock.searchResults[query] || 0;
      
      console.log(
        query.padEnd(15) + 
        supabaseCount.toString().padEnd(12) + 
        prismaCount.toString().padEnd(12) + 
        mockCount.toString()
      );
    });
    
    console.log('\n💡 Recommendations:');
    
    if (this.results.supabase.available && this.results.supabase.productCount > 0) {
      console.log('   ✅ Supabase is ready for production use');
    } else {
      console.log('   ⚠️  Set up Supabase database for production');
      console.log('      1. Go to Supabase dashboard');
      console.log('      2. Run SQL script from scripts/supabase-schema.sql');
    }
    
    if (this.results.prisma.available && this.results.prisma.productCount > 0) {
      console.log('   ✅ Local Prisma database is ready for development');
    } else {
      console.log('   ⚠️  Set up local database for development');
      console.log('      1. Ensure PostgreSQL is running');
      console.log('      2. Run: npx prisma db push');
      console.log('      3. Run: node scripts/populateProducts.js');
    }
    
    console.log('   ✅ Mock data fallback is always available');
    
    console.log('\n🔧 Testing Database vs Mock Search:');
    console.log('   • To test Supabase search: Ensure products exist in Supabase');
    console.log('   • To test Prisma search: Populate local database');
    console.log('   • To test Mock search: Disable databases or use force mock mode');
    console.log('   • AI Service will automatically choose best available option');
  }

  async run() {
    console.log('🚀 Starting Comprehensive Database Comparison Test...\n');
    
    await this.testSupabase();
    await this.testPrisma();
    await this.testMockData();
    await this.testAIServicePriority();
    
    this.printSummary();
  }
}

async function main() {
  const test = new DatabaseComparisonTest();
  await test.run();
}

main().catch(console.error);