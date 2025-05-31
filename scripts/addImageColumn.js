// Add image column to Supabase Product table
import { SupabaseService } from '../app/services/SupabaseService.js';

async function addImageColumn() {
  const service = new SupabaseService();
  await service.initialize();
  
  console.log('🔧 Testing image column support...\n');
  
  try {
    // First, test if image column already exists
    const products = await service.getAllProducts();
    if (products.length > 0) {
      console.log('Testing if image column exists by updating a product...');
      
      const testResult = await service.supabase
        .from('Product')
        .update({ image: 'https://example.com/test.jpg' })
        .eq('id', products[0].id)
        .select();
      
      if (testResult.error && testResult.error.message.includes('column')) {
        console.log('❌ Image column does not exist');
        console.log('🔧 Need to add image column manually in Supabase dashboard');
        console.log('');
        console.log('Manual steps:');
        console.log('1. Go to https://app.supabase.com');
        console.log('2. Navigate to your project');
        console.log('3. Go to Table Editor → Product');
        console.log('4. Click "Add Column"');
        console.log('5. Name: image, Type: text, Nullable: true');
        console.log('');
        console.log('Or run this SQL in the SQL Editor:');
        console.log('ALTER TABLE "Product" ADD COLUMN image TEXT;');
        
        return false;
      } else if (!testResult.error) {
        console.log('✅ Image column exists! Proceeding with image updates...');
        
        // Reset the test value
        await service.supabase
          .from('Product')
          .update({ image: null })
          .eq('id', products[0].id);
        
        return true;
      } else {
        console.log('❌ Unexpected error:', testResult.error.message);
        return false;
      }
    }
  } catch (error) {
    console.log('❌ Error testing image column:', error.message);
    return false;
  }
}

async function updateProductImages() {
  const service = new SupabaseService();
  await service.initialize();
  
  const imageUpdates = [
    {
      title: 'MacBook Pro 14" M2',
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=800&hei=800&fmt=jpeg&qlt=95&.v=1671304673229'
    },
    {
      title: 'MacBook Air M2',
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=800&hei=800&fmt=jpeg&qlt=95&.v=1708367688034'
    },
    {
      title: 'Premium Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Smart Home Hub',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Ultra HD Smart TV 55"',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Smart 4K TV 65"',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Professional Blender',
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Professional Blender Max',
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Ergonomic Office Chair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Ergonomic Office Chair Pro',
      image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=800&fit=crop&crop=center&q=80'
    },
    {
      title: 'Gaming Chair with RGB Lighting',
      image: 'https://images.unsplash.com/photo-1664906225771-ad3c13c5b96a?w=800&h=800&fit=crop&crop=center&q=80'
    }
  ];
  
  const products = await service.getAllProducts();
  let updatedCount = 0;
  
  console.log('🖼️ Updating product images...\n');
  
  for (const product of products) {
    const imageData = imageUpdates.find(update => 
      product.title.includes(update.title) || update.title.includes(product.title)
    );
    
    if (imageData) {
      try {
        console.log(`🔄 Adding image to: ${product.title}`);
        console.log(`   Image: ${imageData.image}`);
        
        await service.updateProduct(product.id, { image: imageData.image });
        updatedCount++;
        
        console.log(`✅ Updated image for: ${product.title}\n`);
      } catch (error) {
        console.error(`❌ Error updating image for ${product.title}:`, error.message);
      }
    }
  }
  
  console.log(`🎉 Successfully updated images for ${updatedCount} products!`);
  
  // Test the results
  console.log('\n🔍 Testing search with images...');
  const results = await service.searchProducts('macbook', 'tech enthusiast');
  results.forEach(product => {
    console.log(`📱 ${product.title}: ${product.price}`);
    console.log(`   🔗 ${product.link}`);
    console.log(`   🖼️ ${product.image || 'No image'}\n`);
  });
  
  await service.cleanup();
}

async function main() {
  const imageColumnExists = await addImageColumn();
  
  if (imageColumnExists) {
    await updateProductImages();
  } else {
    console.log('\n⚠️ Cannot proceed with image updates until image column is added.');
    console.log('Please add the image column manually in Supabase dashboard first.');
  }
}

main().catch(console.error);