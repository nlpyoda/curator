// Simple test for mock data functionality without database dependencies
import { MOCK_PRODUCTS } from '../app/services/mockData.js';

console.log('Testing mock data structure...\n');

console.log(`Found ${MOCK_PRODUCTS.length} mock products:`);
MOCK_PRODUCTS.forEach((product, index) => {
  console.log(`${index + 1}. ${product.title} - ${product.price}`);
  console.log(`   Source: ${product.source}`);
  console.log(`   Description: ${product.description.substring(0, 60)}...`);
  console.log(`   Reviews: Amazon: ${product.reviews.amazon ? 'Yes' : 'No'}, Instagram: ${product.reviews.instagram ? 'Yes' : 'No'}`);
  console.log(`   Pros/Cons: ${product.prosAndCons.pros.length} pros, ${product.prosAndCons.cons.length} cons\n`);
});

console.log('✅ Mock data structure is valid and ready for migration!');