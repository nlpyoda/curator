const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Stunning, appealing product images that will make people want to buy
const APPEALING_PRODUCT_IMAGES = {
  // Laptops - Beautiful, aspirational shots
  'ASUS VivoBook 15 Thin and Light Laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Acer Chromebook Spin 314': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Acer Chromebook Spin 314': 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium ASUS VivoBook 15 Thin and Light Laptop': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Fashion bags - Luxury lifestyle shots
  'Michael Kors Jet Set Medium Tote': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Michael Kors Jet Set Medium Tote': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Coach Pillow Tabby Shoulder Bag': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Coach Pillow Tabby Shoulder Bag': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Baby strollers - Happy family lifestyle
  'UPPAbaby Vista V2 Stroller': 'https://images.unsplash.com/photo-1544553845-4d508eaa10b0?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium UPPAbaby Vista V2 Stroller': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Baby Jogger City Mini GT2 Stroller': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Baby Jogger City Mini GT2 Stroller': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Gaming monitors - Epic gaming setup shots
  'ASUS TUF Gaming VG27AQ 27" 1440P Monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium ASUS TUF Gaming VG27AQ 27" 1440P Monitor': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Solar panels - Clean energy lifestyle
  'Goal Zero Nomad 7 Plus Solar Panel': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Goal Zero Nomad 7 Plus Solar Panel': 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Office chairs - Professional workspace
  'Herman Miller Aeron Chair': 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Herman Miller Aeron Chair': 'https://images.unsplash.com/photo-1566041510632-8f5bb2bd1e95?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Health monitors - Clean medical device shots
  'Omron Platinum Blood Pressure Monitor': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Omron Platinum Blood Pressure Monitor': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Candles - Spa/luxury lifestyle
  'Diptyque Baies Candle': 'https://images.unsplash.com/photo-1602874801006-e26ae98d3d95?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',
  'Premium Diptyque Baies Candle': 'https://images.unsplash.com/photo-1543248939-75d0fbadcde0?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Kitchen appliances - Beautiful kitchen lifestyle
  'KitchenAid Stand Mixer': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Fitness equipment - Inspiring workout shots
  'Peloton Bike+': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Beauty products - Luxurious skincare lifestyle
  'Tatcha The Water Cream': 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=800&fit=crop&crop=center&auto=format&q=90',

  // Desks - Modern workspace inspiration
  'Autonomous SmartDesk Pro': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&crop=center&auto=format&q=90'
};

async function fixProductImages() {
  try {
    console.log('📸 Fixing product images to make them appealing...\n');
    
    // Get all current products
    const { data: products, error: fetchError } = await supabase
      .from('Product')
      .select('id, title, link');
    
    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${products.length} products to make appealing`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      // Check if we have an appealing image for this product
      const appealingImage = APPEALING_PRODUCT_IMAGES[product.title];
      
      if (appealingImage) {
        const { error: updateError } = await supabase
          .from('Product')
          .update({ link: appealingImage })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${product.title}:`, updateError);
        } else {
          updatedCount++;
          console.log(`✨ Made appealing: ${product.title}`);
          console.log(`   📸 New stunning image: ${appealingImage}`);
          console.log('');
        }
      } else {
        console.log(`⚠️ No specific image found for: ${product.title}`);
      }
    }
    
    console.log(`\n🎉 Product image makeover complete!`);
    console.log(`✨ Made ${updatedCount} products visually appealing`);
    
    // Show some examples
    console.log('\n📸 Sample appealing products:');
    const { data: sampleProducts } = await supabase
      .from('Product')
      .select('title, category, price, link')
      .limit(5);
    
    sampleProducts?.forEach(product => {
      console.log(`📦 ${product.title} (${product.price})`);
      console.log(`   🖼️ ${product.link}`);
      console.log('');
    });
    
    console.log('✨ Your products now have stunning, purchase-inspiring images!');
    
  } catch (error) {
    console.error('❌ Error fixing product images:', error);
  }
}

fixProductImages();