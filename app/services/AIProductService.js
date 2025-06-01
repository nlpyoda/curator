// AIProductService for React Native
import { MOCK_PRODUCTS } from './mockData.js';
// Import DatabaseService only if needed to avoid OpenAI dependency issues
// import { DatabaseService } from './DatabaseService.js';
// Import SupabaseService dynamically to avoid build issues
// import { SupabaseService } from './SupabaseService.js';

export class AIProductService {
  constructor() {
    this.useMockData = true; // Start with mock data, can be overridden
    this.initialized = false;
    this.MOCK_PRODUCTS = MOCK_PRODUCTS; // Store reference to mock data
    this.databaseService = null;
    this.supabaseService = null;
    this.databaseAvailable = false;
    this.supabaseAvailable = false;
    this.activeService = 'mock'; // 'supabase', 'prisma', or 'mock'
  }

  async initialize() {
    try {
      console.log('Initializing AI Product Service...');
      
      // Try Supabase first (best for production)
      try {
        const { SupabaseService } = await import('./SupabaseService.js');
        this.supabaseService = new SupabaseService();
        const supabaseSuccess = await this.supabaseService.initialize();
        
        if (supabaseSuccess) {
          const productCount = await this.supabaseService.getProductCount();
          if (productCount > 0) {
            this.supabaseAvailable = true;
            this.useMockData = false;
            this.activeService = 'supabase';
            console.log(`✅ AI Product Service initialized with Supabase (${productCount} products)`);
            this.initialized = true;
            return;
          }
        }
      } catch (supabaseError) {
        console.log('Supabase not available:', supabaseError.message);
      }

      // Skip Prisma for simplicity - using Supabase + Mock only
      console.log('⏩ Skipping Prisma database (using Supabase + Mock only)');

      // Fallback to mock data
      this.useMockData = true;
      this.activeService = 'mock';
      console.log('✅ AI Product Service initialized with mock data');
      this.initialized = true;
      
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      this.useMockData = true;
      this.activeService = 'mock';
      this.initialized = true;
    }
  }

  async searchProductsFromDatabase(query, persona) {
    try {
      // For database search, we'll use text-based search first, then potentially embeddings later
      const normalizedQuery = query.toLowerCase().trim();
      
      // Search products by title, description, features, and tags
      const products = await this.databaseService.prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: normalizedQuery, mode: 'insensitive' } },
            { description: { contains: normalizedQuery, mode: 'insensitive' } },
            { features: { contains: normalizedQuery, mode: 'insensitive' } },
            { tags: { hasSome: normalizedQuery.split(' ') } },
            { category: { contains: normalizedQuery, mode: 'insensitive' } },
            { subCategory: { contains: normalizedQuery, mode: 'insensitive' } }
          ]
        },
        take: 20 // Get more than we need for scoring
      });

      // Transform database format back to expected mock format for compatibility
      const transformedProducts = products.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        link: product.link,
        description: product.description,
        features: product.features,
        whyBuy: product.whyBuy,
        reviews: {
          amazon: product.amazonReviewSummary || '',
          instagram: product.instagramReviewSummary || '',
          marketplace: product.fbMarketplaceSummary || ''
        },
        prosAndCons: product.prosAndCons || { pros: [], cons: [] },
        lastUpdated: product.lastUpdated.toISOString().split('T')[0],
        source: product.source
      }));

      // Apply persona-based scoring similar to mock search
      const results = transformedProducts.map(product => {
        const personaLower = persona.toLowerCase();
        let similarity = 0.5; // Base score
        
        // Increase score for persona-relevant keywords
        if (personaLower.includes('tech') && 
          (product.title.toLowerCase().includes('macbook') || 
            product.title.toLowerCase().includes('headphones') || 
            product.title.toLowerCase().includes('smart'))) {
          similarity += 0.3;
        }
        
        if (personaLower.includes('professional') && 
          (product.description.toLowerCase().includes('professional') || 
            product.description.toLowerCase().includes('work'))) {
          similarity += 0.2;
        }
        
        if (personaLower.includes('quality') && 
          (product.prosAndCons.pros.some(pro => pro.toLowerCase().includes('quality')))) {
          similarity += 0.2;
        }
        
        return {
          ...product,
          similarity: Math.min(similarity, 0.97)
        };
      });
      
      // Sort by similarity and return top results
      results.sort((a, b) => b.similarity - a.similarity);
      
      console.log(`Database search returned ${results.length} products`);
      return results.slice(0, 10); // Return top 10
      
    } catch (error) {
      console.error('Database search error:', error);
      throw error;
    }
  }

  async searchProducts(query, persona) {
    console.log(`🔍 AIProductService.searchProducts: "${query}" with persona: "${persona}" (using ${this.activeService})`);
    console.log(`🔧 Service status: supabaseAvailable=${this.supabaseAvailable}, initialized=${this.initialized}`);
    
    // Try Supabase first if available
    if (this.supabaseAvailable && this.supabaseService) {
      try {
        console.log('🔄 Attempting Supabase search...');
        const results = await this.supabaseService.searchProducts(query, persona);
        console.log(`✅ Supabase search successful: ${results.length} results`);
        return results;
      } catch (supabaseError) {
        console.error('❌ Supabase search failed:', supabaseError);
        console.log('🔄 Falling back to mock data...');
      }
    } else {
      console.log(`⚠️ Supabase not available: supabaseAvailable=${this.supabaseAvailable}, supabaseService=${!!this.supabaseService}`);
    }
    
    // Try Prisma database if available
    if (this.databaseAvailable && this.databaseService) {
      try {
        return await this.searchProductsFromDatabase(query, persona);
      } catch (dbError) {
        console.log('Prisma search failed, falling back to mock data:', dbError.message);
      }
    }
    
    // Fallback to mock data search
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const normalizedQuery = query.toLowerCase().trim();
          
          // Create more products for better testing
          const allProducts = [...this.MOCK_PRODUCTS];
          
          // Add more products for certain search terms
          if (normalizedQuery.includes('laptop') || normalizedQuery.includes('computer') || normalizedQuery.includes('macbook')) {
            allProducts.push(
              {
                id: '101',
                title: 'MacBook Pro 14"',
                price: '$1,999.99',
                link: 'https://example.com/macbook-pro',
                description: 'Powerful laptop with M2 chip, perfect for professionals and creatives.',
                features: '- M2 Pro/Max chip\n- 14-inch Liquid Retina XDR display\n- Up to 32GB unified memory\n- Up to 18 hours of battery life',
                whyBuy: 'Exceptional performance for creative professionals with industry-leading battery life.',
                reviews: {
                  amazon: 'Users love the performance and battery life. The display is consistently rated as best-in-class.',
                  instagram: 'Tech influencers praise the speed and efficiency for video editing workflows.',
                  marketplace: 'Highly rated for reliability and resale value.'
                },
                prosAndCons: {
                  pros: ['Exceptional performance', 'Beautiful display', 'Great battery life'],
                  cons: ['Premium price', 'Limited port selection']
                },
                lastUpdated: '2023-12-01',
                source: 'Apple'
              },
              {
                id: '102',
                title: 'MacBook Air M2',
                price: '$1,199.99',
                link: 'https://example.com/macbook-air',
                description: 'Ultra-thin laptop with great performance and all-day battery life.',
                features: '- M2 chip\n- 13.6-inch Liquid Retina display\n- Up to 24GB unified memory\n- Up to 18 hours of battery life',
                whyBuy: 'Perfect balance of performance and portability with no fan noise.',
                reviews: {
                  amazon: 'Customers love the lightweight design and silent operation.',
                  instagram: 'Travel influencers praise its portability and battery life.',
                  marketplace: 'High ratings for everyday performance and build quality.'
                },
                prosAndCons: {
                  pros: ['Silent operation', 'Lightweight design', 'All-day battery'],
                  cons: ['Only 2 Thunderbolt ports', 'Base model has slower SSD']
                },
                lastUpdated: '2023-11-15',
                source: 'Apple'
              },
              {
                id: '103',
                title: 'MacBook Pro 16"',
                price: '$2,499.99',
                link: 'https://example.com/macbook-pro-16',
                description: 'Largest MacBook with desktop-class performance for serious professionals.',
                features: '- M2 Pro/Max chip\n- 16-inch Liquid Retina XDR display\n- Up to 96GB unified memory\n- Up to 22 hours of battery life',
                whyBuy: 'Desktop-class performance in a portable package with the largest MacBook screen available.',
                reviews: {
                  amazon: 'Professional users rave about the performance for 3D rendering and complex tasks.',
                  instagram: 'Film editors call it the best portable workstation available.',
                  marketplace: 'Consistently rated 5 stars for professional applications.'
                },
                prosAndCons: {
                  pros: ['Exceptional performance', 'Large beautiful display', 'Long battery life'],
                  cons: ['Expensive', 'Heavier than other MacBooks']
                },
                lastUpdated: '2023-12-05',
                source: 'Apple'
              }
            );
          }
          
          if (normalizedQuery.includes('chair') || normalizedQuery.includes('office')) {
            allProducts.push(
              {
                id: '104',
                title: 'Executive Mesh Office Chair',
                price: '$189.99',
                link: 'https://example.com/executive-chair',
                description: 'Premium office chair with adjustable features and breathable mesh.',
                features: '- High back design\n- Adjustable armrests\n- Lumbar support\n- 360° swivel',
                whyBuy: 'Provides excellent support for long work days with breathable comfort.',
                reviews: {
                  amazon: 'Office workers report significant comfort improvement over standard chairs.',
                  instagram: 'Home office influencers recommend for all-day sitting.',
                  marketplace: 'Consistently rated 4.5+ stars for comfort and durability.'
                },
                prosAndCons: {
                  pros: ['Very comfortable', 'Good lumbar support', 'Breathable material'],
                  cons: ['Assembly required', 'Armrests could be sturdier']
                },
                lastUpdated: '2023-10-10',
                source: 'Office Depot'
              },
              {
                id: '105',
                title: 'Gaming Chair with Footrest',
                price: '$229.99',
                link: 'https://example.com/gaming-chair',
                description: 'Racing-style gaming chair with retractable footrest and adjustable features.',
                features: '- Adjustable recline up to 155°\n- Retractable footrest\n- Neck and lumbar pillows\n- Premium PU leather',
                whyBuy: 'Designed for gamers and professionals who want maximum comfort during long sessions.',
                reviews: {
                  amazon: 'Gamers love the comfort for marathon gaming sessions.',
                  instagram: 'Streamers praise the adjustable features and aesthetic look on camera.',
                  marketplace: 'High ratings for comfort and style.'
                },
                prosAndCons: {
                  pros: ['Very comfortable', 'Fully adjustable', 'Includes footrest'],
                  cons: ['Bulky design', 'PU leather can get warm']
                },
                lastUpdated: '2023-09-20',
                source: 'Amazon'
              }
            );
          }
          
          console.log(`📝 Mock Search Query: "${normalizedQuery}", matching against ${allProducts.length} products`);
          
          // Improved search matching - look for partial matches in title, description and features
          let filteredProducts = allProducts.filter(product => {
            const title = product.title.toLowerCase();
            const description = product.description.toLowerCase();
            const features = product.features.toLowerCase();
            
            // Check for partial matches
            return title.includes(normalizedQuery) || 
                   description.includes(normalizedQuery) || 
                   features.includes(normalizedQuery) ||
                   (normalizedQuery.split(' ').some(word => 
                     title.includes(word) || description.includes(word) || features.includes(word)
                   ));
          });
          
          console.log(`📊 First filter found ${filteredProducts.length} products`);
          
          // If we don't have enough matches with strict criteria, relax the search to ensure we get results
          if (filteredProducts.length < 5) {
            filteredProducts = allProducts.filter(product => {
              const allText = `${product.title} ${product.description} ${product.features}`.toLowerCase();
              
              // Try to match any word in the query
              return normalizedQuery.split(' ').some(word => 
                word.length > 2 && allText.includes(word)
              );
            });
            
            console.log(`📊 Relaxed filter found ${filteredProducts.length} products`);
          }
          
          // If still not enough results, just show all products
          if (filteredProducts.length < 3) {
            console.log('📊 Not enough matches, showing all products');
            filteredProducts = allProducts;
          }
          
          console.log(`📊 Final filter: ${filteredProducts.length} products`)
          
          // Calculate match scores based on persona
          const results = filteredProducts.map(product => {
            // Calculate a similarity score (basic example)
            const personaLower = persona.toLowerCase();
            let similarity = 0.5; // Base score
            
            // Increase score for persona-relevant keywords
            if (personaLower.includes('tech') && 
              (product.title.toLowerCase().includes('macbook') || 
                product.title.toLowerCase().includes('headphones') || 
                product.title.toLowerCase().includes('smart'))) {
              similarity += 0.3;
            }
            
            if (personaLower.includes('professional') && 
              (product.description.toLowerCase().includes('professional') || 
                product.description.toLowerCase().includes('work'))) {
              similarity += 0.2;
            }
            
            if (personaLower.includes('quality') && 
              (product.prosAndCons.pros.some(pro => pro.toLowerCase().includes('quality')))) {
              similarity += 0.2;
            }
            
            return {
              ...product,
              similarity: Math.min(similarity, 0.97) // Cap at 0.97 to avoid perfect scores
            };
          });
          
          // Sort by similarity
          results.sort((a, b) => b.similarity - a.similarity);
          
          console.log(`Returning ${results.length} products`);
          resolve(results);
        } catch (error) {
          console.error('Error searching products:', error);
          resolve([]);
        }
      }, 1000); // Simulate network delay
    });
  }

  async cleanup() {
    // Clean up services
    if (this.supabaseService) {
      try {
        await this.supabaseService.cleanup();
      } catch (error) {
        console.error('Error cleaning up Supabase service:', error);
      }
    }
    
    if (this.databaseService) {
      try {
        await this.databaseService.cleanup();
      } catch (error) {
        console.error('Error cleaning up Prisma service:', error);
      }
    }
    
    this.initialized = false;
    this.supabaseAvailable = false;
    this.databaseAvailable = false;
    this.activeService = 'mock';
  }
} 