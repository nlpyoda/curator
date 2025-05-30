import { PrismaClient } from '@prisma/client';
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

const prisma = new PrismaClient();

// Create a basic embedding for mock data (using fixed dimensions for consistency)
function createMockEmbedding() {
  return new Array(384).fill(0).map(() => Math.random() - 0.5);
}

// Transform mock data structure to match database schema
function transformMockProduct(mockProduct) {
  return {
    id: mockProduct.id,
    title: mockProduct.title,
    price: mockProduct.price,
    link: mockProduct.link,
    source: mockProduct.source,
    description: mockProduct.description,
    features: mockProduct.features,
    whyBuy: mockProduct.whyBuy,
    amazonReviewSummary: mockProduct.reviews?.amazon || '',
    instagramReviewSummary: mockProduct.reviews?.instagram || '',
    fbMarketplaceSummary: mockProduct.reviews?.marketplace || '',
    prosAndCons: mockProduct.prosAndCons || null,
    lastUpdated: new Date(mockProduct.lastUpdated),
    productEmbedding: createMockEmbedding(),
    category: inferCategory(mockProduct.title, mockProduct.description),
    subCategory: inferSubCategory(mockProduct.title, mockProduct.description),
    tags: generateTags(mockProduct),
    attributes: generateAttributes(mockProduct)
  };
}

// Infer category from product title and description
function inferCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('headphone') || text.includes('audio')) return 'Electronics';
  if (text.includes('smart') && text.includes('hub')) return 'Smart Home';
  if (text.includes('tv') || text.includes('display')) return 'Electronics';
  if (text.includes('blender') || text.includes('kitchen')) return 'Kitchen';
  if (text.includes('chair') || text.includes('office')) return 'Furniture';
  if (text.includes('laptop') || text.includes('macbook')) return 'Electronics';
  
  return 'General';
}

// Infer subcategory
function inferSubCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('headphone')) return 'Audio';
  if (text.includes('smart hub')) return 'Automation';
  if (text.includes('tv')) return 'Display';
  if (text.includes('blender')) return 'Appliances';
  if (text.includes('chair')) return 'Office Furniture';
  if (text.includes('laptop') || text.includes('macbook')) return 'Computers';
  
  return null;
}

// Generate tags from product data
function generateTags(product) {
  const tags = [];
  const text = `${product.title} ${product.description}`.toLowerCase();
  
  if (text.includes('wireless')) tags.push('wireless');
  if (text.includes('premium')) tags.push('premium');
  if (text.includes('smart')) tags.push('smart');
  if (text.includes('professional')) tags.push('professional');
  if (text.includes('office')) tags.push('office');
  if (text.includes('ergonomic')) tags.push('ergonomic');
  if (product.price.includes('$2') || product.price.includes('$3')) tags.push('premium-price');
  
  return tags;
}

// Generate attributes from product data
function generateAttributes(product) {
  const attributes = {};
  
  // Extract price as numeric value
  const priceMatch = product.price.match(/\$([0-9,]+)/);
  if (priceMatch) {
    attributes.priceNumeric = parseFloat(priceMatch[1].replace(',', ''));
  }
  
  // Extract features count
  attributes.featureCount = product.features.split('\n').filter(f => f.trim()).length;
  
  // Extract warranty info if mentioned
  if (product.features.includes('warranty') || product.features.includes('year')) {
    attributes.hasWarranty = true;
  }
  
  return attributes;
}

async function migrateMockData() {
  try {
    console.log('Starting mock data migration...');
    
    // Clear existing products (optional - remove if you want to keep existing data)
    console.log('Clearing existing products...');
    await prisma.product.deleteMany({});
    
    console.log(`Migrating ${MOCK_PRODUCTS.length} mock products...`);
    
    for (const mockProduct of MOCK_PRODUCTS) {
      const transformedProduct = transformMockProduct(mockProduct);
      
      console.log(`Migrating: ${transformedProduct.title}`);
      
      await prisma.product.create({
        data: transformedProduct
      });
      
      console.log(`✓ Migrated: ${transformedProduct.title}`);
    }
    
    // Verify migration
    const productCount = await prisma.product.count();
    console.log(`\n✅ Migration completed! ${productCount} products in database.`);
    
    // Show sample data
    const sampleProducts = await prisma.product.findMany({
      take: 2,
      select: {
        id: true,
        title: true,
        category: true,
        subCategory: true,
        tags: true
      }
    });
    
    console.log('\nSample migrated products:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.title} (${product.category}/${product.subCategory}) [${product.tags.join(', ')}]`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  migrateMockData().catch(console.error);
}

export { migrateMockData };