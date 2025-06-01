// Update Supabase products with proper affiliate links and images
import { SupabaseService } from '../app/services/SupabaseService.js';

async function updateProducts() {
  const service = new SupabaseService();
  await service.initialize();
  
  console.log('🔄 Updating Supabase products with proper links and images...');
  
  // Product updates mapping
  const productUpdates = [
    {
      title: 'MacBook Pro 14" M2',
      updates: {
        link: 'https://www.apple.com/macbook-pro-14-and-16/',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=640&hei=640&fmt=jpeg&qlt=95&.v=1671304673229'
      }
    },
    {
      title: 'MacBook Air M2',
      updates: {
        link: 'https://www.apple.com/macbook-air-m2/',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=640&hei=640&fmt=jpeg&qlt=95&.v=1708367688034'
      }
    },
    {
      title: 'Premium Wireless Headphones',
      updates: {
        link: 'https://www.amazon.com/dp/B08MVGF24M',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Smart Home Hub',
      updates: {
        link: 'https://www.amazon.com/dp/B08MQLDKS6',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Ultra HD Smart TV 55"',
      updates: {
        link: 'https://www.bestbuy.com/site/lg-55-class-c3-series-oled-4k-uhd-smart-webos-tv/6535928.p',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Smart 4K TV 65"',
      updates: {
        link: 'https://www.bestbuy.com/site/samsung-65-class-qn90c-neo-qled-4k-smart-tizen-tv/6535717.p',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Professional Blender',
      updates: {
        link: 'https://www.vitamix.com/us/en_us/shop/a3500',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Professional Blender Max',
      updates: {
        link: 'https://www.vitamix.com/us/en_us/shop/a3500',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Ergonomic Office Chair',
      updates: {
        link: 'https://www.herman-miller.com/products/seating/office-chairs/aeron-chairs/',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Ergonomic Office Chair Pro',
      updates: {
        link: 'https://www.herman-miller.com/products/seating/office-chairs/embody-chairs/',
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Gaming Chair with RGB Lighting',
      updates: {
        link: 'https://www.amazon.com/dp/B08T1YX8JD',
        image: 'https://images.unsplash.com/photo-1664906225771-ad3c13c5b96a?w=800&h=800&fit=crop&crop=center&q=80'
      }
    }
  ];
  
  // Get all products from Supabase
  const products = await service.getAllProducts();
  
  let updatedCount = 0;
  
  for (const product of products) {
    const updateData = productUpdates.find(update => 
      product.title.includes(update.title) || update.title.includes(product.title)
    );
    
    if (updateData) {
      try {
        console.log(`🔄 Updating: ${product.title}`);
        console.log(`   New link: ${updateData.updates.link}`);
        console.log(`   New image: ${updateData.updates.image}`);
        
        await service.updateProduct(product.id, updateData.updates);
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
    console.log(`    Image: ${product.image}`);
  });
  
  await service.cleanup();
}

// Run the update
updateProducts().catch(console.error);