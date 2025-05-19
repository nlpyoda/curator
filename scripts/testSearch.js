import { AIProductService } from '../app/services/AIProductService.js';

// Test data
const TEST_PRODUCTS = [
  {
    title: "Apple 2023 MacBook Air Laptop with M2 chip",
    price: "$1,099.00",
    link: "https://www.amazon.com/dp/B09G9FPHY6",
    source: "Amazon",
    facts: [
      "13.6-inch Liquid Retina Display",
      "8GB Unified Memory",
      "256GB SSD Storage",
      "1080p FaceTime HD Camera"
    ],
    review: "The M2 MacBook Air represents a perfect balance of performance and portability. Its redesigned chassis, brilliant display, and exceptional battery life make it an ideal choice for both professionals and casual users.",
    whyBuy: "Perfect for users who need a powerful yet portable laptop with great battery life and a premium build quality.",
    amazonReviewSummary: "Users consistently praise the M2 MacBook Air's performance, build quality, and battery life. Many highlight its silent operation and excellent display quality.",
    instagramReviewSummary: "Tech influencers are impressed by the sleek design and performance. Popular for its portability and premium feel.",
    fbMarketplaceSummary: "High demand in the secondary market with good value retention. Used prices typically range from $850-950.",
    prosAndCons: "Pros: Excellent performance, great battery life, premium build quality, beautiful display. Cons: Limited ports, higher starting price than M1 model.",
    lastUpdated: new Date()
  },
  {
    title: "Samsung Galaxy S24 Ultra Smartphone",
    price: "$1,299.99",
    link: "https://www.amazon.com/dp/SAMSUNGS24",
    source: "Amazon",
    facts: [
      "6.8-inch Dynamic AMOLED Display",
      "200MP Main Camera",
      "12GB RAM",
      "Snapdragon 8 Gen 3"
    ],
    review: "The Galaxy S24 Ultra sets a new standard for Android smartphones with its AI capabilities, exceptional camera system, and refined design. It's the ultimate tool for productivity and creativity.",
    whyBuy: "Ideal for users who want the most advanced Android phone with top-tier camera capabilities and S-Pen functionality.",
    amazonReviewSummary: "Reviewers praise the improved camera system, AI features, and battery life. The S-Pen integration remains a standout feature.",
    instagramReviewSummary: "Photography enthusiasts love the versatile camera system. Popular among content creators for its AI editing features.",
    fbMarketplaceSummary: "Strong demand for new and slightly used models. Prices typically range from $1000-1200 for mint condition.",
    prosAndCons: "Pros: Exceptional camera system, S-Pen functionality, powerful performance. Cons: Premium price, large size may not suit all users.",
    lastUpdated: new Date()
  }
];

async function runTest() {
  console.log('Starting test...');
  const aiService = new AIProductService();
  
  try {
    console.log('Initializing services...');
    await aiService.initialize();

    // Store test products
    console.log('Storing test products...');
    for (const productData of TEST_PRODUCTS) {
      const embedding = await aiService.createEmbedding(
        `${productData.title}\n${productData.facts.join('\n')}\n${productData.review}`
      );
      await aiService.dbService.storeProduct({
        ...productData,
        embedding
      });
      console.log(`Stored product: ${productData.title}`);
    }

    // Test searches with different queries and personas
    const testQueries = [
      {
        query: "I need a powerful laptop for video editing",
        persona: "creative professional"
      },
      {
        query: "Best smartphone for photography",
        persona: "tech enthusiast"
      }
    ];

    console.log('\nTesting searches...');
    for (const { query, persona } of testQueries) {
      console.log(`\nSearching for: "${query}" (${persona})`);
      const results = await aiService.searchProducts(query, persona);
      console.log(`Found ${results.length} results:`);
      results.forEach(result => {
        console.log(`- ${result.title} (${result.price})`);
        console.log(`  Why buy: ${result.whyBuy}`);
      });
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    console.log('\nCleaning up...');
    await aiService.cleanup();
    console.log('Test completed');
  }
}

runTest().catch(console.error); 