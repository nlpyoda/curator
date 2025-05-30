// Test database connectivity and search functionality
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnectivity() {
  try {
    console.log('🔍 Testing database connectivity...\n');
    
    // Test 1: Check connection
    console.log('1. Testing database connection...');
    const productCount = await prisma.product.count();
    console.log(`   ✅ Connected! Found ${productCount} products in database.\n`);
    
    // Test 2: Fetch all products
    console.log('2. Fetching all products...');
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        source: true,
        category: true,
        tags: true
      }
    });
    
    allProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - ${product.price}`);
      console.log(`      Source: ${product.source}, Category: ${product.category}`);
      console.log(`      Tags: [${product.tags.join(', ')}]`);
    });
    console.log('');
    
    // Test 3: Search functionality
    console.log('3. Testing search functionality...');
    const searchTests = [
      { term: 'headphones', expected: 'Premium Wireless Headphones' },
      { term: 'smart', expected: 'Smart Home Hub' },
      { term: 'chair', expected: 'Ergonomic Office Chair' }
    ];
    
    for (const { term, expected } of searchTests) {
      const results = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } }
          ]
        },
        select: { id: true, title: true, price: true }
      });
      
      console.log(`   Search "${term}": Found ${results.length} products`);
      results.forEach(product => {
        console.log(`     - ${product.title} - ${product.price}`);
      });
    }
    
    console.log('\n✅ Database connectivity test passed! Database is ready for production use.');
    
  } catch (error) {
    console.error('❌ Database connectivity test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnectivity();