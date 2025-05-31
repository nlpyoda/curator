// Script to populate image embeddings for all products
import { SupabaseService } from '../app/services/SupabaseService.js';
import { ImageEmbeddingService } from '../app/services/ImageEmbeddingService.js';

async function populateProductEmbeddings() {
  console.log('🤖 Starting image embedding population...\n');

  const supabaseService = new SupabaseService();
  const embeddingService = new ImageEmbeddingService();

  try {
    // Initialize services
    await supabaseService.initialize();
    const embeddingInitialized = await embeddingService.initialize();

    if (!embeddingInitialized) {
      console.log('⚠️ OpenAI API not available. Using mock embeddings for development.\n');
    }

    // Get all products that need embeddings
    const products = await supabaseService.getProductsWithoutEmbeddings();
    console.log(`📊 Found ${products.length} products needing embeddings\n`);

    if (products.length === 0) {
      console.log('✅ All products already have embeddings!');
      return;
    }

    let processedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        console.log(`🔄 Processing: ${product.title}`);
        
        let embedding;
        
        if (embeddingInitialized && product.image) {
          // Use real OpenAI embeddings for the image
          console.log(`   🖼️ Generating embedding for image: ${product.image}`);
          try {
            embedding = await embeddingService.generateImageEmbedding(product.image);
          } catch (embeddingError) {
            console.log(`   ⚠️ Image embedding failed, using text fallback: ${embeddingError.message}`);
            embedding = await embeddingService.generateTextEmbedding(
              `${product.title} ${product.description}`
            );
          }
        } else {
          // Use mock embeddings for development
          const inputText = product.image || `${product.title} ${product.description}`;
          embedding = embeddingService.generateMockEmbedding(inputText);
          console.log(`   🎭 Generated mock embedding (${embedding.length} dimensions)`);
        }

        // Update product with embedding
        await supabaseService.updateProductEmbedding(product.id, embedding, {
          model: embeddingInitialized ? 'openai-ada-002' : 'mock-embedding'
        });

        processedCount++;
        console.log(`   ✅ Updated: ${product.title}\n`);

        // Rate limiting for OpenAI API
        if (embeddingInitialized) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }

      } catch (error) {
        errorCount++;
        console.error(`   ❌ Error processing ${product.title}:`, error.message, '\n');
      }
    }

    console.log(`🎉 Embedding population complete!`);
    console.log(`   ✅ Successfully processed: ${processedCount} products`);
    console.log(`   ❌ Errors: ${errorCount} products`);

    // Test similarity search
    if (processedCount > 0) {
      console.log('\n🔍 Testing similarity search...');
      await testSimilaritySearch(supabaseService, embeddingService);
    }

  } catch (error) {
    console.error('❌ Error in embedding population:', error);
  } finally {
    await supabaseService.cleanup();
    await embeddingService.cleanup();
  }
}

async function testSimilaritySearch(supabaseService, embeddingService) {
  try {
    console.log('Testing search for "laptop computer"...');
    
    // Generate query embedding
    let queryEmbedding;
    if (embeddingService.initialized) {
      queryEmbedding = await embeddingService.generateQueryEmbedding('laptop computer MacBook');
    } else {
      queryEmbedding = embeddingService.generateMockEmbedding('laptop computer MacBook');
    }

    // Search using image similarity
    const similarProducts = await supabaseService.searchProductsByImageSimilarity(
      queryEmbedding, 
      0.5, // Lower threshold for testing
      5
    );

    if (similarProducts.length > 0) {
      console.log('📱 Similar products found:');
      similarProducts.forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.title} (similarity: ${product.similarity.toFixed(3)})`);
      });
    } else {
      console.log('   No similar products found (this is normal for mock embeddings)');
    }

    // Test multimodal search
    console.log('\n🔍 Testing multimodal search...');
    const multimodalResults = await supabaseService.searchProductsMultimodal(
      'professional laptop', 
      queryEmbedding,
      { textWeight: 0.7, imageWeight: 0.3, limit: 3 }
    );

    if (multimodalResults.length > 0) {
      console.log('🎯 Multimodal search results:');
      multimodalResults.forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.title} (score: ${product.similarity.toFixed(3)})`);
      });
    }

  } catch (error) {
    console.log('⚠️ Similarity search test failed (this is expected if functions are not yet created):', error.message);
  }
}

// Additional function to update existing products with images
async function updateProductsWithImages() {
  console.log('🖼️ Updating products with images first...\n');

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
  let imageUpdateCount = 0;

  for (const product of products) {
    const imageData = imageUpdates.find(update => 
      product.title.includes(update.title) || update.title.includes(product.title)
    );

    if (imageData && (!product.image || product.image === '')) {
      try {
        console.log(`🖼️ Adding image to: ${product.title}`);
        await service.updateProduct(product.id, { image: imageData.image });
        imageUpdateCount++;
        console.log(`   ✅ Image added\n`);
      } catch (error) {
        console.log(`   ❌ Failed to add image: ${error.message}\n`);
      }
    }
  }

  console.log(`📊 Updated ${imageUpdateCount} products with images\n`);
  await service.cleanup();
}

async function main() {
  // First update products with images if needed
  await updateProductsWithImages();
  
  // Then populate embeddings
  await populateProductEmbeddings();
}

main().catch(console.error);