// Update Supabase products with proper affiliate links
import { SupabaseService } from '../app/services/SupabaseService.js';

async function updateProductLinks() {
  const service = new SupabaseService();
  await service.initialize();
  
  console.log('🔄 Updating Supabase products with proper affiliate links...');
  
  // Product link updates mapping
  const linkUpdates = [
    {
      title: 'MacBook Pro 14" M2',
      link: 'https://www.apple.com/macbook-pro-14-and-16/'
    },
    {
      title: 'MacBook Air M2',
      link: 'https://www.apple.com/macbook-air-m2/'
    },
    {
      title: 'Premium Wireless Headphones',
      link: 'https://www.amazon.com/dp/B08MVGF24M'
    },
    {
      title: 'Smart Home Hub',
      link: 'https://www.amazon.com/dp/B08MQLDKS6'
    },
    {
      title: 'Ultra HD Smart TV 55"',
      link: 'https://www.bestbuy.com/site/lg-55-class-c3-series-oled-4k-uhd-smart-webos-tv/6535928.p'
    },
    {
      title: 'Smart 4K TV 65"',
      link: 'https://www.bestbuy.com/site/samsung-65-class-qn90c-neo-qled-4k-smart-tizen-tv/6535717.p'
    },
    {
      title: 'Professional Blender',
      link: 'https://www.vitamix.com/us/en_us/shop/a3500'
    },
    {
      title: 'Professional Blender Max',
      link: 'https://www.vitamix.com/us/en_us/shop/a3500'
    },
    {
      title: 'Ergonomic Office Chair',
      link: 'https://www.herman-miller.com/products/seating/office-chairs/aeron-chairs/'
    },
    {
      title: 'Ergonomic Office Chair Pro',
      link: 'https://www.herman-miller.com/products/seating/office-chairs/embody-chairs/'
    },
    {
      title: 'Gaming Chair with RGB Lighting',
      link: 'https://www.amazon.com/dp/B08T1YX8JD'
    }
  ];
  
  // Get all products from Supabase
  const products = await service.getAllProducts();
  
  let updatedCount = 0;
  
  for (const product of products) {
    const updateData = linkUpdates.find(update => 
      product.title.includes(update.title) || update.title.includes(product.title)
    );
    
    if (updateData) {
      try {
        console.log(`🔄 Updating: ${product.title}`);
        console.log(`   Old link: ${product.link}`);
        console.log(`   New link: ${updateData.link}`);
        
        await service.updateProduct(product.id, { link: updateData.link });
        updatedCount++;
        
        console.log(`✅ Updated: ${product.title}`);
      } catch (error) {
        console.error(`❌ Error updating ${product.title}:`, error);
      }
    } else {
      console.log(`⚠️ No update mapping found for: ${product.title}`);
    }
  }
  
  console.log(`\n🎉 Successfully updated ${updatedCount} products!`);
  
  // Test a search to verify updates
  console.log('\n🔍 Testing search after updates...');
  const searchResults = await service.searchProducts('macbook', 'tech enthusiast');
  console.log('MacBook search results:');
  searchResults.forEach(product => {
    console.log(`  - ${product.title}: ${product.link}`);
  });
  
  await service.cleanup();
}

// Run the update
updateProductLinks().catch(console.error);