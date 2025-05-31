// Supabase service for cloud database integration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';

export class SupabaseService {
  constructor() {
    this.supabase = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Get Supabase key from environment variables
      // For testing, let's use the key directly first
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || 
                         process.env.SUPABASE_KEY || 
                         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';
      
      if (!supabaseKey) {
        throw new Error('Supabase key not found in environment variables');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection with a simple query - check if Product table exists
      try {
        const { data, error } = await this.supabase
          .from('Product')
          .select('*')
          .limit(1);
        
        if (error) {
          // If table doesn't exist, that's expected - we'll handle it gracefully
          if (error.message.includes('relation "Product" does not exist')) {
            console.log('📋 Product table does not exist in Supabase yet');
            throw new Error('Product table does not exist. Please create the table first.');
          }
          throw error;
        }
      } catch (tableError) {
        throw tableError;
      }
      
      this.initialized = true;
      console.log('✅ Supabase service initialized successfully');
      return true;
      
    } catch (error) {
      console.log('❌ Supabase initialization failed:', error.message);
      this.initialized = false;
      return false;
    }
  }

  async searchProducts(query, persona = null, limit = 10) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const normalizedQuery = query.toLowerCase().trim();
      
      // Search products using Supabase query
      let queryBuilder = this.supabase
        .from('Product')
        .select('*')
        .or(`title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%,features.ilike.%${normalizedQuery}%`)
        .limit(limit);

      const { data: products, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }

      // Transform to expected format and apply persona scoring
      const transformedProducts = products.map(product => {
        // Convert Supabase format to expected format
        const transformed = {
          id: product.id,
          title: product.title,
          price: product.price,
          link: product.link,
          description: product.description,
          features: product.features,
          whyBuy: product.whyBuy,
          image: product.image || '', // Add image support
          reviews: {
            amazon: product.amazonReviewSummary || '',
            instagram: product.instagramReviewSummary || '',
            marketplace: product.fbMarketplaceSummary || ''
          },
          prosAndCons: product.prosAndCons || { pros: [], cons: [] },
          lastUpdated: product.lastUpdated ? new Date(product.lastUpdated).toISOString().split('T')[0] : '',
          source: product.source
        };

        // Apply persona scoring
        let similarity = 0.5; // Base score
        
        if (persona) {
          const personaLower = persona.toLowerCase();
          
          if (personaLower.includes('tech') && 
            (product.title.toLowerCase().includes('headphones') || 
              product.title.toLowerCase().includes('smart') ||
              product.title.toLowerCase().includes('macbook'))) {
            similarity += 0.3;
          }
          
          if (personaLower.includes('professional') && 
            (product.description.toLowerCase().includes('professional') || 
              product.description.toLowerCase().includes('work'))) {
            similarity += 0.2;
          }
          
          if (personaLower.includes('quality') && 
            (product.prosAndCons?.pros?.some(pro => pro.toLowerCase().includes('quality')))) {
            similarity += 0.2;
          }
        }
        
        return {
          ...transformed,
          similarity: Math.min(similarity, 0.97)
        };
      });

      // Sort by similarity
      transformedProducts.sort((a, b) => b.similarity - a.similarity);
      
      console.log(`Found ${transformedProducts.length} products from Supabase`);
      return transformedProducts;
      
    } catch (error) {
      console.error('Supabase search error:', error);
      throw error;
    }
  }

  async getAllProducts(limit = 50) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const { data: products, error } = await this.supabase
        .from('Product')
        .select('*')
        .limit(limit);
      
      if (error) {
        throw error;
      }

      return products.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        link: product.link,
        description: product.description,
        features: product.features,
        whyBuy: product.whyBuy,
        image: product.image || '', // Add image support
        reviews: {
          amazon: product.amazonReviewSummary || '',
          instagram: product.instagramReviewSummary || '',
          marketplace: product.fbMarketplaceSummary || ''
        },
        prosAndCons: product.prosAndCons || { pros: [], cons: [] },
        lastUpdated: product.lastUpdated ? new Date(product.lastUpdated).toISOString().split('T')[0] : '',
        source: product.source
      }));
      
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  async addProduct(productData) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const { data, error } = await this.supabase
        .from('Product')
        .insert([{
          title: productData.title,
          price: productData.price,
          link: productData.link,
          source: productData.source,
          description: productData.description,
          features: productData.features,
          whyBuy: productData.whyBuy,
          amazonReviewSummary: productData.reviews?.amazon || '',
          instagramReviewSummary: productData.reviews?.instagram || '',
          fbMarketplaceSummary: productData.reviews?.marketplace || '',
          prosAndCons: productData.prosAndCons,
          category: productData.category,
          subCategory: productData.subCategory,
          tags: productData.tags || [],
          attributes: productData.attributes || {}
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Product added to Supabase:', data[0]?.title);
      return data[0];
      
    } catch (error) {
      console.error('Error adding product to Supabase:', error);
      throw error;
    }
  }

  async getProductCount() {
    if (!this.initialized) {
      return 0;
    }

    try {
      const { count, error } = await this.supabase
        .from('Product')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error getting product count:', error);
      return 0;
    }
  }

  async updateProduct(productId, updates) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const { data, error } = await this.supabase
        .from('Product')
        .update(updates)
        .eq('id', productId)
        .select();
      
      if (error) {
        throw error;
      }
      
      return data[0];
      
    } catch (error) {
      console.error('Error updating product in Supabase:', error);
      throw error;
    }
  }

  async searchProductsByImageSimilarity(queryEmbedding, threshold = 0.7, limit = 10) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const { data, error } = await this.supabase
        .rpc('search_products_by_image_similarity', {
          query_embedding: queryEmbedding,
          match_threshold: threshold,
          match_count: limit
        });

      if (error) {
        throw error;
      }

      return data.map(product => ({
        ...product,
        similarity: product.similarity || 0
      }));
    } catch (error) {
      console.error('Error in image similarity search:', error);
      throw error;
    }
  }

  async searchProductsMultimodal(textQuery = '', imageEmbedding = null, options = {}) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    const {
      textWeight = 0.6,
      imageWeight = 0.4,
      limit = 10
    } = options;

    try {
      const { data, error } = await this.supabase
        .rpc('search_products_multimodal', {
          text_query: textQuery,
          image_embedding: imageEmbedding,
          text_weight: textWeight,
          image_weight: imageWeight,
          match_count: limit
        });

      if (error) {
        throw error;
      }

      return data.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        link: product.link,
        image: product.image || '',
        description: product.description,
        similarity: product.combined_score || 0,
        source: 'Supabase'
      }));
    } catch (error) {
      console.error('Error in multimodal search:', error);
      // Fallback to regular text search
      if (textQuery) {
        return await this.searchProducts(textQuery, null, limit);
      }
      throw error;
    }
  }

  async updateProductEmbedding(productId, embedding, metadata = {}) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const updateData = {
        image_embedding: embedding,
        embedding_model: metadata.model || 'clip-vit-base-patch32',
        embedding_created_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('Product')
        .update(updateData)
        .eq('id', productId)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error updating product embedding:', error);
      throw error;
    }
  }

  async getProductsWithoutEmbeddings(limit = 50) {
    if (!this.initialized) {
      throw new Error('Supabase service not initialized');
    }

    try {
      const { data, error } = await this.supabase
        .from('Product')
        .select('id, title, description, image')
        .is('image_embedding', null)
        .not('image', 'is', null)
        .limit(limit);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching products without embeddings:', error);
      throw error;
    }
  }

  async cleanup() {
    // Supabase client doesn't need explicit cleanup
    this.initialized = false;
  }
}