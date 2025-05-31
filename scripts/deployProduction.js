// Production deployment script for Supabase database
import { PrismaClient } from '@prisma/client';
import { migrateMockData } from './migrateMockData.js';

const prisma = new PrismaClient();

async function deployProduction() {
  console.log('🚀 Starting production deployment...\n');
  
  try {
    // Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Database connection successful');
    
    // Check if database is empty
    const existingProducts = await prisma.product.count();
    console.log(`   📊 Found ${existingProducts} existing products`);
    
    if (existingProducts === 0) {
      console.log('\n2. Database is empty, migrating mock data...');
      await migrateMockData();
      console.log('   ✅ Mock data migration completed');
    } else {
      console.log('\n2. Database already has data, skipping migration');
    }
    
    // Verify the data
    console.log('\n3. Verifying production data...');
    const productCount = await prisma.product.count();
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: { id: true, title: true, price: true, source: true }
    });
    
    console.log(`   📈 Total products: ${productCount}`);
    console.log('   📝 Sample products:');
    sampleProducts.forEach((product, index) => {
      console.log(`     ${index + 1}. ${product.title} - ${product.price} (${product.source})`);
    });
    
    console.log('\n✅ Production deployment completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify your Netlify environment variables include DATABASE_URL');
    console.log('2. Redeploy your app to use the cloud database');
    console.log('3. Test the deployed app to ensure database integration works');
    
  } catch (error) {
    console.error('\n❌ Production deployment failed:', error);
    
    if (error.code === 'P1001') {
      console.log('\n🔍 Connection failed. Please check:');
      console.log('1. DATABASE_URL is correctly set in your environment');
      console.log('2. Supabase project is running');
      console.log('3. Password and connection string are correct');
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Check if this script is being run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  deployProduction().catch(console.error);
}

export { deployProduction };