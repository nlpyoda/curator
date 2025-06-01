// Database Schema Updater - Add brand and detailed category columns
import { SupabaseService } from '../app/services/SupabaseService.js';

class DatabaseSchemaUpdater {
  constructor() {
    this.supabaseService = null;
  }

  async initialize() {
    console.log('🔧 Initializing Supabase service for schema updates...');
    this.supabaseService = new SupabaseService();
    const initialized = await this.supabaseService.initialize();
    
    if (!initialized) {
      throw new Error('Failed to initialize Supabase service');
    }
    
    console.log('✅ Supabase service initialized successfully');
    return true;
  }

  async updateSchema() {
    console.log('🗄️ Updating Product table schema...\n');
    
    try {
      // Add brand column
      console.log('📝 Adding brand column...');
      const { error: brandError } = await this.supabaseService.supabase
        .rpc('exec_sql', { 
          sql: 'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS brand TEXT;' 
        });
      
      if (brandError) {
        console.log('⚠️ Brand column may already exist or RPC not available - continuing...');
      } else {
        console.log('✅ Brand column added successfully');
      }

      // Add specific category column (shoes, apparel, etc.)
      console.log('📝 Adding specific category column...');
      const { error: specificCategoryError } = await this.supabaseService.supabase
        .rpc('exec_sql', { 
          sql: 'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS specific_category TEXT;' 
        });
      
      if (specificCategoryError) {
        console.log('⚠️ Specific category column may already exist or RPC not available - continuing...');
      } else {
        console.log('✅ Specific category column added successfully');
      }

      // Update existing products with brand and specific category data
      console.log('\n🔄 Updating existing products with brand and category data...');
      
      // Get all existing products
      const existingProducts = await this.supabaseService.getAllProducts(200);
      console.log(`📊 Found ${existingProducts.length} existing products to update`);
      
      let updatedCount = 0;
      for (const product of existingProducts) {
        try {
          const brandAndCategory = this.extractBrandAndCategory(product.title, product.category);
          
          const { error } = await this.supabaseService.supabase
            .from('Product')
            .update({
              brand: brandAndCategory.brand,
              specific_category: brandAndCategory.specificCategory
            })
            .eq('id', product.id);
          
          if (error) {
            console.log(`❌ Failed to update ${product.title}: ${error.message}`);
          } else {
            updatedCount++;
            if (updatedCount % 20 === 0) {
              console.log(`📊 Updated ${updatedCount}/${existingProducts.length} products...`);
            }
          }
        } catch (error) {
          console.log(`❌ Error updating ${product.title}: ${error.message}`);
        }
      }
      
      console.log(`\n✅ Schema update completed! Updated ${updatedCount} existing products`);
      
    } catch (error) {
      console.error('❌ Schema update failed:', error.message);
      throw error;
    }
  }

  extractBrandAndCategory(title, category) {
    // Extract brand from title
    let brand = 'Unknown';
    let specificCategory = 'General';
    
    // Brand detection patterns
    const brandPatterns = {
      'Apple': /^(iPhone|iPad|MacBook|iMac|Mac Studio|Apple Watch|AirPods|Studio Display)/i,
      'Samsung': /^(Galaxy|Neo QLED|OLED|Crystal UHD|Odyssey|ViewFinity|990 PRO|T7 Shield)/i,
      'Nike': /^(Air Jordan|Air Force|Air Max|Nike Dunk|Blazer|React|ZoomX|Alphafly|Pegasus|Invincible|Metcon|Free RN|Tech Fleece)/i,
      'Sony': /^(WH-1000XM|WF-1000XM|LinkBuds|PlayStation|DualSense|Alpha|FX\d|SRS-XB|SRS-XG|BRAVIA|InZone)/i,
      'Bose': /^(QuietComfort|SoundLink|Home Speaker|Smart Soundbar|Sport Earbuds|SoundSport|Bass Module)/i,
      'Dyson': /^(V\d+|Airwrap|Supersonic|Corrale|Pure Cool|Pure Hot|Gen\d|Big Ball)/i,
      'Adidas': /^(Ultraboost|Stan Smith|Yeezy|Gazelle|NMD|Superstar|Campus|Forum|Samba|ZX|Adicolor)/i
    };
    
    for (const [brandName, pattern] of Object.entries(brandPatterns)) {
      if (pattern.test(title)) {
        brand = brandName;
        break;
      }
    }
    
    // Specific category detection
    if (category === 'Fashion & Footwear') {
      if (/jordan|force|max|dunk|blazer|ultraboost|stan smith|yeezy|gazelle|nmd|superstar|campus|forum|samba/i.test(title)) {
        specificCategory = 'Shoes';
      } else if (/hoodie|jacket|fleece/i.test(title)) {
        specificCategory = 'Apparel';
      }
    } else if (category === 'Electronics') {
      if (/iphone|galaxy s|pixel/i.test(title)) {
        specificCategory = 'Smartphones';
      } else if (/macbook|surface laptop|galaxy book/i.test(title)) {
        specificCategory = 'Laptops';
      } else if (/ipad|galaxy tab/i.test(title)) {
        specificCategory = 'Tablets';
      } else if (/watch/i.test(title)) {
        specificCategory = 'Smartwatches';
      } else if (/tv|display|monitor/i.test(title)) {
        specificCategory = 'Displays';
      }
    } else if (category === 'Audio & Headphones') {
      if (/headphones|wh-/i.test(title)) {
        specificCategory = 'Headphones';
      } else if (/earbuds|airpods|wf-/i.test(title)) {
        specificCategory = 'Earbuds';
      } else if (/speaker|soundbar/i.test(title)) {
        specificCategory = 'Speakers';
      }
    } else if (category === 'Gaming') {
      if (/playstation|xbox|nintendo switch/i.test(title)) {
        specificCategory = 'Consoles';
      } else if (/controller/i.test(title)) {
        specificCategory = 'Controllers';
      } else if (/mario|zelda|pokemon/i.test(title)) {
        specificCategory = 'Games';
      }
    } else if (category === 'Home & Garden') {
      if (/vacuum|v\d+/i.test(title)) {
        specificCategory = 'Vacuums';
      } else if (/purifier|pure/i.test(title)) {
        specificCategory = 'Air Purifiers';
      }
    } else if (category === 'Beauty & Personal Care') {
      if (/hair dryer|supersonic/i.test(title)) {
        specificCategory = 'Hair Dryers';
      } else if (/airwrap|styler/i.test(title)) {
        specificCategory = 'Hair Styling';
      } else if (/straightener|corrale/i.test(title)) {
        specificCategory = 'Hair Straighteners';
      }
    }
    
    return { brand, specificCategory };
  }
}

// Main execution
async function main() {
  const updater = new DatabaseSchemaUpdater();
  
  try {
    await updater.initialize();
    await updater.updateSchema();
    console.log('\n🎉 Database schema successfully updated with brand and category columns!');
  } catch (error) {
    console.error('❌ Schema update failed:', error.message);
  }
}

main();