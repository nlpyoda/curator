import { AIProductService } from '../app/services/AIProductService.js';
import { DatabaseService } from '../app/services/DatabaseService.js';

async function main() {
  try {
    console.log('Initializing services...');
    const aiService = new AIProductService();
    const dbService = new DatabaseService();
    
    await aiService.initialize();
    await dbService.initialize();

    console.log('Creating test embeddings...');
    
    // Test product descriptions
    const products = [
      {
        title: "MacBook Air M2",
        description: "Lightweight laptop with powerful M2 chip, great for developers and creative professionals",
        facts: [
          "M2 chip for powerful performance",
          "Lightweight and portable design",
          "Great for developers",
          "Perfect for creative professionals"
        ]
      },
      {
        title: "Dell XPS 13",
        description: "Premium Windows ultrabook with InfinityEdge display and long battery life",
        facts: [
          "InfinityEdge display",
          "Long battery life",
          "Premium build quality",
          "Windows ultrabook"
        ]
      },
      {
        title: "ThinkPad X1 Carbon",
        description: "Business laptop known for reliability and excellent keyboard",
        facts: [
          "Excellent keyboard",
          "Business-grade reliability",
          "ThinkPad durability",
          "Professional design"
        ]
      }
    ];

    // Create embeddings and store products
    console.log('Storing products with embeddings...');
    for (const product of products) {
      const embedding = await aiService.createEmbedding(
        `${product.title}. ${product.description}`
      );
      
      console.log(`Created embedding for ${product.title} with dimension:`, embedding.length);
      
      await dbService.storeProduct({
        title: product.title,
        price: "$999.99",
        link: "https://example.com",
        source: "test",
        facts: product.facts,
        review: "Test review",
        whyBuy: "Test reasons",
        amazonReviewSummary: "Test summary",
        instagramReviewSummary: "Test summary",
        fbMarketplaceSummary: "Test summary", 
        prosAndCons: "Test pros and cons",
        lastUpdated: new Date(),
        embedding
      });
    }

    // Test search
    console.log('\nTesting search...');
    const searchQuery = "lightweight laptop for programming";
    const queryEmbedding = await aiService.createEmbedding(searchQuery);
    
    console.log('Query embedding dimension:', queryEmbedding.length);
    
    const results = await dbService.searchSimilarProducts(queryEmbedding, 3);
    
    console.log('\nSearch results for:', searchQuery);
    results.forEach((product, i) => {
      console.log(`${i + 1}. ${product.title}`);
    });

    await dbService.cleanup();
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

main(); 