// Test script to verify database integration
import { AIProductService } from '../app/services/AIProductService.js';

async function testDatabaseIntegration() {
  console.log('Testing database integration...\n');
  
  const aiService = new AIProductService();
  
  try {
    // Initialize service
    console.log('1. Initializing AI Product Service...');
    await aiService.initialize();
    
    console.log(`   - Database available: ${aiService.databaseAvailable}`);
    console.log(`   - Using mock data: ${aiService.useMockData}`);
    console.log(`   - Initialized: ${aiService.initialized}\n`);
    
    // Test search functionality
    console.log('2. Testing search functionality...');
    const searchQueries = [
      { query: 'headphones', persona: 'tech enthusiast' },
      { query: 'chair', persona: 'office professional' },
      { query: 'laptop', persona: 'creative professional' }
    ];
    
    for (const { query, persona } of searchQueries) {
      console.log(`\n   Searching for "${query}" with persona "${persona}"`);
      const results = await aiService.searchProducts(query, persona);
      console.log(`   Found ${results.length} products:`);
      
      results.slice(0, 3).forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.title} - ${product.price} (similarity: ${product.similarity?.toFixed(3) || 'N/A'})`);
      });
    }
    
    console.log('\n3. Database integration test completed successfully! ✅');
    
  } catch (error) {
    console.error('\n❌ Database integration test failed:', error);
  } finally {
    // Cleanup
    await aiService.cleanup();
    console.log('\nCleanup completed.');
  }
}

// Run the test
testDatabaseIntegration();