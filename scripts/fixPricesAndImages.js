// Fix product prices and add image support
import { SupabaseService } from '../app/services/SupabaseService.js';

async function fixPricesAndImages() {
  const service = new SupabaseService();
  await service.initialize();
  
  console.log('🔄 Fixing product prices and adding image support...\n');
  
  // Updated product data with correct prices and images
  const productUpdates = [
    {
      title: 'MacBook Pro 14" M2',
      updates: {
        price: '$1,999.00',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=800&hei=800&fmt=jpeg&qlt=95&.v=1671304673229'
      }
    },
    {
      title: 'MacBook Air M2',
      updates: {
        price: '$1,199.00',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=800&hei=800&fmt=jpeg&qlt=95&.v=1708367688034'
      }
    },
    {
      title: 'Premium Wireless Headphones',
      updates: {
        price: '$279.99',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Smart Home Hub',
      updates: {
        price: '$99.99',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Ultra HD Smart TV 55"',
      updates: {
        price: '$799.99',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Smart 4K TV 65"',
      updates: {
        price: '$999.99',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Professional Blender',
      updates: {
        price: '$449.99',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Professional Blender Max',
      updates: {
        price: '$549.99',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Ergonomic Office Chair',
      updates: {
        price: '$649.99',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Ergonomic Office Chair Pro',
      updates: {
        price: '$899.99',
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=800&fit=crop&crop=center&q=80'
      }
    },
    {
      title: 'Gaming Chair with RGB Lighting',
      updates: {
        price: '$329.99',
        image: 'https://images.unsplash.com/photo-1664906225771-ad3c13c5b96a?w=800&h=800&fit=crop&crop=center&q=80'
      }
    }
  ];
  
  // Get all products
  const products = await service.getAllProducts();
  console.log(`Found ${products.length} products to update\n`);
  
  let updatedCount = 0;
  let imageColumnExists = false;
  
  // Test if image column exists by trying to update the first product
  if (products.length > 0) {
    try {
      const testUpdate = await service.supabase
        .from('Product')
        .update({ image: 'test' })
        .eq('id', products[0].id)
        .select();
      
      if (!testUpdate.error) {
        imageColumnExists = true;
        console.log('✅ Image column exists in database\n');
      }
    } catch (error) {
      // Image column doesn't exist
    }
  }
  
  if (!imageColumnExists) {
    console.log('❌ Image column does not exist in Supabase table');
    console.log('📝 Creating SQL to add image column...\n');
    
    try {
      // Try to add the image column using direct SQL
      const { data, error } = await service.supabase.rpc('sql', {
        query: 'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS image TEXT;'
      });
      
      if (!error) {
        console.log('✅ Successfully added image column!');
        imageColumnExists = true;
      } else {
        console.log('⚠️  Cannot add column via RPC. Will update prices only.');
        console.log('   To add images, run this SQL in Supabase dashboard:');
        console.log('   ALTER TABLE "Product" ADD COLUMN image TEXT;\n');
      }
    } catch (rpcError) {
      console.log('⚠️  Cannot add column via RPC. Will update prices only.');
      console.log('   To add images, run this SQL in Supabase dashboard:');
      console.log('   ALTER TABLE "Product" ADD COLUMN image TEXT;\n');
    }
  }
  
  // Update products
  for (const product of products) {
    const updateData = productUpdates.find(update => 
      product.title.includes(update.title) || update.title.includes(product.title)
    );
    
    if (updateData) {
      try {
        console.log(`🔄 Updating: ${product.title}`);
        console.log(`   Old price: ${product.price} → New price: ${updateData.updates.price}`);
        
        const updateFields = { price: updateData.updates.price };
        
        if (imageColumnExists && updateData.updates.image) {
          updateFields.image = updateData.updates.image;
          console.log(`   Adding image: ${updateData.updates.image}`);
        }
        
        await service.updateProduct(product.id, updateFields);
        updatedCount++;
        
        console.log(`✅ Updated: ${product.title}\n`);
      } catch (error) {
        console.error(`❌ Error updating ${product.title}:`, error.message, '\n');
      }
    } else {
      console.log(`⚠️ No update mapping found for: ${product.title}\n`);
    }
  }
  
  console.log(`🎉 Successfully updated ${updatedCount} products!`);
  
  // Test search results
  console.log('\n🔍 Testing updated search results...');
  const testResults = await service.searchProducts('macbook', 'tech enthusiast');
  console.log('MacBook search results:');
  testResults.forEach(product => {
    console.log(`  - ${product.title}: ${product.price} | ${product.link}`);
    if (imageColumnExists && product.image) {
      console.log(`    Image: ${product.image}`);
    }
  });
  
  await service.cleanup();
}

// Run the update
fixPricesAndImages().catch(console.error);