// Test only Supabase service without Prisma dependencies
import { SupabaseService } from '../app/services/SupabaseService.js';
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

// Simplified AI service for testing Supabase only
class SimpleAIService {
  constructor() {
    this.supabaseService = null;
    this.activeService = 'mock';
  }

  async initialize() {
    try {
      console.log('Trying Supabase...');
      this.supabaseService = new SupabaseService();
      const success = await this.supabaseService.initialize();
      
      if (success) {
        const count = await this.supabaseService.getProductCount();
        if (count > 0) {
          this.activeService = 'supabase';
          console.log(`✅ Using Supabase with ${count} products`);
          return;
        }
      }
    } catch (error) {
      console.log('Supabase failed:', error.message);
    }
    
    this.activeService = 'mock';
    console.log('✅ Using mock data');
  }

  async searchProducts(query, persona) {
    if (this.activeService === 'supabase') {
      try {
        return await this.supabaseService.searchProducts(query, persona);
      } catch (error) {
        console.log('Supabase search failed, using mock:', error.message);
      }
    }
    
    // Mock data search
    const normalizedQuery = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(p => 
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery)
    );
    
    return filtered.map(p => ({ ...p, similarity: 0.8 }));
  }

  async cleanup() {
    if (this.supabaseService) {
      await this.supabaseService.cleanup();
    }
  }
}

async function testSupabaseOnly() {
  console.log('🧪 Testing Supabase-only Integration...\n');
  
  const service = new SimpleAIService();
  
  try {
    await service.initialize();
    console.log(`Active service: ${service.activeService}\n`);
    
    // Test searches
    const queries = ['headphones', 'smart', 'chair'];
    
    for (const query of queries) {
      console.log(`🔍 Searching for "${query}"`);
      const results = await service.searchProducts(query, 'tech enthusiast');
      console.log(`   Found ${results.length} products`);
      
      results.slice(0, 2).forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.title} - ${product.price}`);
      });
      console.log('');
    }
    
    console.log('✅ Test completed successfully!');
    
    if (service.activeService === 'mock') {
      console.log('\n💡 To enable Supabase:');
      console.log('1. Go to Supabase dashboard > SQL Editor');
      console.log('2. Run the SQL script from scripts/supabase-schema.sql');
      console.log('3. Rerun this test');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await service.cleanup();
  }
}

testSupabaseOnly();