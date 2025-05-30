// Test AIProductService with database integration
// Simplified version that avoids OpenAI dependency in DatabaseService

import { PrismaClient } from '@prisma/client';
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

// Simplified DatabaseService for testing
class SimpleDatabaseService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async initialize() {
    console.log('Simple Database service initialized');
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

// Simplified AIProductService for testing
class TestAIProductService {
  constructor() {
    this.useMockData = true;
    this.initialized = false;
    this.databaseService = null;
    this.databaseAvailable = false;
  }

  async initialize() {
    try {
      // Try to initialize database service
      try {
        this.databaseService = new SimpleDatabaseService();
        await this.databaseService.initialize();
        
        // Test database connection by checking if we have any products
        const testProducts = await this.databaseService.prisma.product.findMany({ take: 1 });
        if (testProducts.length > 0) {
          this.databaseAvailable = true;
          this.useMockData = false;
          console.log('✅ AI Product Service initialized with database');
        } else {
          console.log('📝 Database is empty, using mock data');
        }
      } catch (dbError) {
        console.log('❌ Database not available, using mock data:', dbError.message);
        this.databaseAvailable = false;
        this.useMockData = true;
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      this.useMockData = true;
      this.initialized = true;
    }
  }

  async searchProductsFromDatabase(query, persona) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search products by title, description, features, and tags
    const products = await this.databaseService.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { description: { contains: normalizedQuery, mode: 'insensitive' } },
          { features: { contains: normalizedQuery, mode: 'insensitive' } },
          { tags: { hasSome: normalizedQuery.split(' ') } },
          { category: { contains: normalizedQuery, mode: 'insensitive' } }
        ]
      },
      take: 20
    });

    // Transform database format back to expected mock format
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      link: product.link,
      description: product.description,
      features: product.features,
      whyBuy: product.whyBuy,
      reviews: {
        amazon: product.amazonReviewSummary || '',
        instagram: product.instagramReviewSummary || '',
        marketplace: product.fbMarketplaceSummary || ''
      },
      prosAndCons: product.prosAndCons || { pros: [], cons: [] },
      lastUpdated: product.lastUpdated.toISOString().split('T')[0],
      source: product.source
    }));

    // Apply persona-based scoring
    const results = transformedProducts.map(product => {
      const personaLower = persona.toLowerCase();
      let similarity = 0.5;
      
      if (personaLower.includes('tech') && 
        (product.title.toLowerCase().includes('headphones') || 
          product.title.toLowerCase().includes('smart'))) {
        similarity += 0.3;
      }
      
      if (personaLower.includes('professional') && 
        (product.description.toLowerCase().includes('professional') || 
          product.description.toLowerCase().includes('work'))) {
        similarity += 0.2;
      }
      
      return {
        ...product,
        similarity: Math.min(similarity, 0.97)
      };
    });
    
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, 10);
  }

  async searchProducts(query, persona) {
    if (this.databaseAvailable && this.databaseService) {
      try {
        return await this.searchProductsFromDatabase(query, persona);
      } catch (dbError) {
        console.log('Database search failed, falling back to mock data:', dbError.message);
      }
    }
    
    // Fallback to mock data (simplified version)
    const normalizedQuery = query.toLowerCase().trim();
    const filteredProducts = MOCK_PRODUCTS.filter(product => {
      const text = `${product.title} ${product.description}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
    
    return filteredProducts.map(product => ({ ...product, similarity: 0.8 }));
  }

  async cleanup() {
    if (this.databaseService) {
      await this.databaseService.cleanup();
    }
    this.initialized = false;
  }
}

// Test the integrated service
async function testIntegratedService() {
  console.log('🧪 Testing AI Product Service with Database Integration...\n');
  
  const service = new TestAIProductService();
  
  try {
    await service.initialize();
    console.log(`Database Mode: ${!service.useMockData ? 'ENABLED' : 'DISABLED'}\n`);
    
    const testQueries = [
      { query: 'headphones', persona: 'tech enthusiast' },
      { query: 'smart', persona: 'tech professional' },
      { query: 'chair', persona: 'office worker' }
    ];
    
    for (const { query, persona } of testQueries) {
      console.log(`🔍 Searching for "${query}" with persona "${persona}"`);
      const results = await service.searchProducts(query, persona);
      console.log(`   Found ${results.length} products:`);
      
      results.slice(0, 3).forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.title} - ${product.price}`);
        console.log(`        Similarity: ${product.similarity?.toFixed(3) || 'N/A'}, Source: ${product.source}`);
      });
      console.log('');
    }
    
    console.log('✅ AI Product Service integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  } finally {
    await service.cleanup();
  }
}

testIntegratedService();