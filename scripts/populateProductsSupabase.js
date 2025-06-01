// Script to populate Supabase with diverse products for meaningful AI curation
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive product dataset for meaningful AI curation
const products = [
  // APPLE ECOSYSTEM
  {
    title: 'MacBook Air M3',
    price: '$1,099',
    brand: 'Apple',
    category: 'tech',
    subCategory: 'laptops',
    description: 'The incredibly thin and light MacBook Air is now more powerful than ever. With the Apple M3 chip for next-level performance and up to 18 hours of battery life.',
    features: 'M3 chip with 8-core CPU and 10-core GPU, 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, MagSafe 3 charging port, Two Thunderbolt ports',
    whyBuy: '💻 Unmatched portability meets pro-level performance. Perfect for creators and professionals who need power on the go.',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.apple.com/macbook-air/',
    source: 'Apple',
    tags: ['premium', 'portable', 'professional', 'creative'],
    amazonReviewSummary: 'Excellent build quality and performance, outstanding battery life',
    instagramReviewSummary: 'Aesthetic powerhouse, loved by content creators',
    prosAndCons: {
      pros: ['Exceptional battery life', 'Silent operation', 'Premium build quality', 'Excellent display'],
      cons: ['Limited ports', 'Expensive', 'No Face ID']
    }
  },
  {
    title: 'iPhone 15 Pro',
    price: '$999',
    brand: 'Apple',
    category: 'tech',
    subCategory: 'smartphones',
    description: 'Forged in titanium with the powerful A17 Pro chip, customizable Action Button, and the most advanced iPhone camera system ever.',
    features: 'A17 Pro chip, Titanium design, 48MP Main camera, Action Button, USB-C, Dynamic Island',
    whyBuy: '📱 Revolutionary titanium design with pro-level camera capabilities. The ultimate creative tool in your pocket.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.apple.com/iphone-15-pro/',
    source: 'Apple',
    tags: ['premium', 'photography', 'professional', 'innovative'],
    amazonReviewSummary: 'Amazing camera quality, titanium feels premium, excellent performance',
    prosAndCons: {
      pros: ['Premium titanium build', 'Exceptional camera system', 'Powerful A17 Pro chip', 'USB-C finally'],
      cons: ['Very expensive', 'Heavy', 'Battery life could be better']
    }
  },
  {
    title: 'AirPods Pro (2nd generation)',
    price: '$249',
    brand: 'Apple',
    category: 'audio',
    subCategory: 'earbuds',
    description: 'AirPods Pro feature Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio for an immersive listening experience.',
    features: 'Active Noise Cancellation, Transparency mode, Adaptive Audio, Personalized Spatial Audio, H2 chip, Up to 6 hours listening time',
    whyBuy: '🎧 Industry-leading noise cancellation meets seamless Apple integration. Perfect audio companion for any lifestyle.',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.apple.com/airpods-pro/',
    source: 'Apple',
    tags: ['wireless', 'premium', 'noise-cancelling', 'portable'],
    amazonReviewSummary: 'Best noise cancellation, seamless connectivity, great for calls',
    prosAndCons: {
      pros: ['Excellent noise cancellation', 'Seamless Apple integration', 'Great sound quality', 'Comfortable fit'],
      cons: ['Expensive', 'Easy to lose', 'Battery degrades over time']
    }
  },

  // NIKE PERFORMANCE
  {
    title: 'Nike Air Zoom Pegasus 40',
    price: '$130',
    brand: 'Nike',
    category: 'fitness',
    subCategory: 'running',
    description: 'A responsive running shoe with Nike Air Zoom technology for energy return and comfort during your daily runs.',
    features: 'Nike Air Zoom unit, Engineered mesh upper, React foam midsole, Waffle-inspired outsole, Flywire technology',
    whyBuy: '🏃‍♂️ Legendary comfort meets responsive performance. Your reliable daily running companion for every mile.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.nike.com/t/air-zoom-pegasus-40-mens-road-running-shoes',
    source: 'Nike',
    tags: ['athletic', 'performance', 'comfort', 'durable'],
    amazonReviewSummary: 'Comfortable for daily runs, good cushioning, durable construction',
    prosAndCons: {
      pros: ['Excellent comfort', 'Versatile for different paces', 'Durable', 'Good value'],
      cons: ['Not the most stylish', 'Heavy for racing', 'Narrow fit for some']
    }
  },
  {
    title: 'Nike Dri-FIT ADV TechKnit Ultra',
    price: '$85',
    brand: 'Nike',
    category: 'fitness',
    subCategory: 'apparel',
    description: 'Advanced running shirt with Nike Dri-FIT ADV technology and TechKnit Ultra fabric for superior moisture management.',
    features: 'Dri-FIT ADV technology, TechKnit Ultra fabric, Ventilation zones, Reflective elements, Ergonomic seams',
    whyBuy: '👕 Next-level moisture management meets athletic style. Stay cool and confident during intense workouts.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.nike.com/t/dri-fit-adv-techknit-ultra-mens-short-sleeve-running-top',
    source: 'Nike',
    tags: ['athletic', 'moisture-wicking', 'breathable', 'performance'],
    amazonReviewSummary: 'Excellent moisture wicking, comfortable fit, good for hot weather',
    prosAndCons: {
      pros: ['Superior moisture management', 'Lightweight', 'Comfortable fit', 'Stylish design'],
      cons: ['Expensive for a t-shirt', 'Requires careful washing', 'May pill over time']
    }
  },

  // DYSON INNOVATION
  {
    title: 'Dyson V15 Detect Absolute',
    price: '$750',
    brand: 'Dyson',
    category: 'home',
    subCategory: 'cleaning',
    description: 'The most powerful, intelligent Dyson cordless vacuum with laser dust detection and LCD screen showing real-time dust analysis.',
    features: 'Laser dust detection, LCD screen, Up to 60 minutes run time, 5-stage filtration, Hyperdymium motor, Multiple attachments',
    whyBuy: '🧹 Revolutionary laser technology reveals hidden dust. The smartest way to achieve a truly deep clean.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.dyson.com/vacuum-cleaners/cordless/v15-detect',
    source: 'Dyson',
    tags: ['innovative', 'powerful', 'smart', 'efficient'],
    amazonReviewSummary: 'Amazing suction power, laser is game-changing, excellent filtration',
    prosAndCons: {
      pros: ['Incredible suction power', 'Laser dust detection', 'Long battery life', 'Multiple attachments'],
      cons: ['Very expensive', 'Heavy when extended', 'Noisy', 'Small dustbin']
    }
  },
  {
    title: 'Dyson Airwrap Complete',
    price: '$600',
    brand: 'Dyson',
    category: 'beauty',
    subCategory: 'hair-care',
    description: 'Multi-styler that styles and dries simultaneously with no extreme heat, featuring the Coanda effect for voluminous curls and waves.',
    features: 'Coanda effect styling, No extreme heat, Multiple attachments, Intelligent heat control, Digital motor',
    whyBuy: '💫 Professional salon results at home without heat damage. Revolutionary styling technology for healthier hair.',
    image: 'https://images.unsplash.com/photo-1620331317314-530796315638?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.dyson.com/hair-care/dyson-airwrap',
    source: 'Dyson',
    tags: ['innovative', 'beauty', 'premium', 'hair-care'],
    amazonReviewSummary: 'Amazing results, gentle on hair, versatile styling options',
    prosAndCons: {
      pros: ['No heat damage', 'Professional results', 'Multiple styling options', 'Fast styling'],
      cons: ['Very expensive', 'Learning curve', 'Heavy', 'Loud']
    }
  },

  // PATAGONIA SUSTAINABILITY
  {
    title: 'Patagonia Better Sweater Fleece Jacket',
    price: '$99',
    brand: 'Patagonia',
    category: 'outdoor',
    subCategory: 'apparel',
    description: 'Classic fleece jacket made from recycled polyester with a timeless design perfect for outdoor adventures and everyday wear.',
    features: 'Made from recycled polyester, Fair Trade Certified sewn, Full-zip design, Stand-up collar, Zippered handwarmer pockets',
    whyBuy: '🌲 Sustainable warmth meets timeless style. Ethical fashion choice that performs in any environment.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.patagonia.com/product/mens-better-sweater-fleece-jacket/',
    source: 'Patagonia',
    tags: ['sustainable', 'outdoor', 'comfortable', 'ethical'],
    amazonReviewSummary: 'Great quality, comfortable, good for layering, eco-friendly',
    prosAndCons: {
      pros: ['Sustainable materials', 'Very comfortable', 'Durable', 'Classic design'],
      cons: ['Not waterproof', 'Can pill', 'Expensive for fleece', 'Limited color options']
    }
  },
  {
    title: 'Patagonia Torrentshell 3L Jacket',
    price: '$149',
    brand: 'Patagonia',
    category: 'outdoor',
    subCategory: 'rain-gear',
    description: 'Waterproof, breathable rain jacket made with recycled materials and designed for mountain adventures and urban exploration.',
    features: '3-layer H2No Performance Standard, 100% recycled polyester, Adjustable hood, Pit zips, Stuffs into hand pocket',
    whyBuy: '⛈️ Reliable storm protection with environmental consciousness. Adventure-ready gear that respects the planet.',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.patagonia.com/product/mens-torrentshell-3l-jacket/',
    source: 'Patagonia',
    tags: ['waterproof', 'sustainable', 'outdoor', 'adventure'],
    amazonReviewSummary: 'Excellent waterproofing, good breathability, eco-conscious choice',
    prosAndCons: {
      pros: ['Excellent waterproofing', 'Breathable', 'Sustainable materials', 'Packable'],
      cons: ['Expensive', 'Can be noisy', 'Loose fit', 'Limited ventilation']
    }
  },

  // LULULEMON WELLNESS
  {
    title: 'Lululemon Align High-Rise Pant',
    price: '$98',
    brand: 'Lululemon',
    category: 'fitness',
    subCategory: 'yoga',
    description: 'Ultra-soft yoga pants made with Nulu fabric that feels weightless and moves with your body for yoga and low-impact workouts.',
    features: 'Nulu fabric, High-rise design, 25" inseam, Flat seam construction, No side seams, Hidden waistband pocket',
    whyBuy: '🧘‍♀️ Buttery-soft comfort meets mindful movement. The perfect companion for your wellness journey.',
    image: 'https://images.unsplash.com/photo-1506629905607-c7de7c6e6be1?w=600&h=600&fit=crop&crop=center',
    link: 'https://shop.lululemon.com/p/womens-leggings/Align-Pant-2/',
    source: 'Lululemon',
    tags: ['yoga', 'comfortable', 'premium', 'wellness'],
    amazonReviewSummary: 'Incredibly soft, great for yoga, comfortable all day',
    prosAndCons: {
      pros: ['Extremely comfortable', 'Perfect for yoga', 'Flattering fit', 'Soft fabric'],
      cons: ['Very expensive', 'Fabric can pill', 'Not for high-intensity', 'Delicate']
    }
  },
  {
    title: 'Lululemon City Excursion Hoodie',
    price: '$118',
    brand: 'Lululemon',
    category: 'lifestyle',
    subCategory: 'casual',
    description: 'Soft cotton-blend hoodie designed for urban adventures and post-workout comfort with a relaxed, oversized fit.',
    features: 'Cotton-blend fabric, Oversized fit, Kangaroo pocket, Drawcord hood, Thumbholes, Side slits',
    whyBuy: '✨ Effortless style meets mindful comfort. Elevated basics for your active lifestyle.',
    image: 'https://images.unsplash.com/photo-1556821840-3a9fbc86d06c?w=600&h=600&fit=crop&crop=center',
    link: 'https://shop.lululemon.com/p/womens-outerwear/City-Excursion-Hoodie/',
    source: 'Lululemon',
    tags: ['comfort', 'lifestyle', 'premium', 'casual'],
    amazonReviewSummary: 'Very comfortable, great quality, perfect for casual wear',
    prosAndCons: {
      pros: ['Super comfortable', 'High quality', 'Stylish design', 'Versatile'],
      cons: ['Expensive for a hoodie', 'Limited colors', 'Oversized fit', 'Can shrink']
    }
  },

  // BOSE AUDIO
  {
    title: 'Bose QuietComfort Ultra Headphones',
    price: '$429',
    brand: 'Bose',
    category: 'audio',
    subCategory: 'headphones',
    description: 'Premium wireless headphones with world-class noise cancellation, spatial audio, and luxurious comfort for immersive listening.',
    features: 'World-class noise cancellation, Immersive spatial audio, CustomTune technology, 24-hour battery life, Premium materials',
    whyBuy: '🎵 Unparalleled audio immersion meets legendary comfort. Transform any space into your personal concert hall.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.bose.com/en_us/products/headphones/noise_cancelling_headphones/quietcomfort-ultra-headphones.html',
    source: 'Bose',
    tags: ['premium', 'noise-cancelling', 'audio', 'comfort'],
    amazonReviewSummary: 'Incredible noise cancellation, amazing sound quality, very comfortable',
    prosAndCons: {
      pros: ['Best-in-class noise cancellation', 'Exceptional comfort', 'Great sound quality', 'Long battery life'],
      cons: ['Very expensive', 'Bulky', 'No wireless charging case', 'Touch controls can be finicky']
    }
  },
  {
    title: 'Bose SoundLink Revolve+ II',
    price: '$329',
    brand: 'Bose',
    category: 'audio',
    subCategory: 'speakers',
    description: 'Portable Bluetooth speaker with 360-degree sound, water-resistant design, and up to 17 hours of battery life.',
    features: '360-degree sound, Water-resistant IPX4, 17-hour battery life, Built-in speakerphone, Bose Connect app',
    whyBuy: '🔊 Room-filling 360° sound anywhere you go. Perfect audio companion for outdoor adventures and gatherings.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.bose.com/en_us/products/speakers/portable_speakers/soundlink-revolve-plus-ii.html',
    source: 'Bose',
    tags: ['portable', 'wireless', 'outdoor', 'premium'],
    amazonReviewSummary: 'Great sound quality, good battery life, durable build',
    prosAndCons: {
      pros: ['360-degree sound', 'Long battery life', 'Water-resistant', 'Portable'],
      cons: ['Expensive', 'Heavy', 'No USB-C', 'Bass could be stronger']
    }
  },

  // SONY CREATIVITY
  {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: '$399',
    brand: 'Sony',
    category: 'audio',
    subCategory: 'headphones',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life, and AI-enhanced features.',
    features: 'Industry-leading noise canceling, 30-hour battery, Multipoint connection, Speak-to-Chat, Quick Attention, LDAC codec',
    whyBuy: '🎧 Professional-grade audio meets intelligent features. Perfect for creators, commuters, and music lovers.',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4d?w=600&h=600&fit=crop&crop=center',
    link: 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b',
    source: 'Sony',
    tags: ['premium', 'noise-cancelling', 'professional', 'wireless'],
    amazonReviewSummary: 'Excellent noise cancellation, superb sound quality, comfortable',
    prosAndCons: {
      pros: ['Excellent noise cancellation', 'Superior sound quality', 'Long battery life', 'Smart features'],
      cons: ['Expensive', 'Touch controls can be sensitive', 'Case is large', 'No foldable design']
    }
  },
  {
    title: 'Sony α7 IV Full-Frame Camera',
    price: '$2,498',
    brand: 'Sony',
    category: 'photography',
    subCategory: 'cameras',
    description: 'Versatile full-frame mirrorless camera with 33MP sensor, 4K 60p video, and advanced autofocus for professionals and enthusiasts.',
    features: '33MP full-frame sensor, 4K 60p video, Real-time Eye AF, 10fps burst, In-body stabilization, Dual card slots',
    whyBuy: '📸 Professional versatility meets creative freedom. Capture stunning photos and cinematic videos with one camera.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop&crop=center',
    link: 'https://electronics.sony.com/cameras/c/cameras',
    source: 'Sony',
    tags: ['professional', 'photography', 'video', 'creative'],
    amazonReviewSummary: 'Excellent image quality, great for both photo and video, reliable',
    prosAndCons: {
      pros: ['Excellent image quality', 'Great video capabilities', 'Fast autofocus', 'Good battery life'],
      cons: ['Very expensive', 'Large and heavy', 'Menu system complex', 'Rolling shutter in video']
    }
  },

  // SAMSUNG SMART TECH
  {
    title: 'Samsung Galaxy S24 Ultra',
    price: '$1,299',
    brand: 'Samsung',
    category: 'tech',
    subCategory: 'smartphones',
    description: 'AI-powered flagship smartphone with S Pen, advanced camera system, and Galaxy AI features for enhanced productivity.',
    features: 'Galaxy AI, S Pen included, 200MP camera, 6.8" Dynamic AMOLED display, Snapdragon 8 Gen 3, S Pen integration',
    whyBuy: '📱 AI-powered productivity meets creative expression. The ultimate smartphone for power users and creators.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.samsung.com/us/smartphones/galaxy-s24-ultra/',
    source: 'Samsung',
    tags: ['premium', 'AI', 'productivity', 'creative'],
    amazonReviewSummary: 'Amazing camera, S Pen is useful, great display, powerful performance',
    prosAndCons: {
      pros: ['Excellent camera system', 'S Pen functionality', 'Beautiful display', 'AI features'],
      cons: ['Very expensive', 'Large and heavy', 'Battery life variable', 'Complex interface']
    }
  },
  {
    title: 'Samsung Galaxy Watch6 Classic',
    price: '$399',
    brand: 'Samsung',
    category: 'wearables',
    subCategory: 'smartwatches',
    description: 'Premium smartwatch with rotating bezel, comprehensive health monitoring, and seamless Galaxy ecosystem integration.',
    features: 'Rotating bezel navigation, Advanced health monitoring, GPS tracking, 4-day battery life, Galaxy ecosystem integration',
    whyBuy: '⌚ Classic sophistication meets smart innovation. Complete health and connectivity companion for your wrist.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.samsung.com/us/watches/galaxy-watch6/',
    source: 'Samsung',
    tags: ['smartwatch', 'health', 'connectivity', 'premium'],
    amazonReviewSummary: 'Great health tracking, nice design, good battery life',
    prosAndCons: {
      pros: ['Excellent health tracking', 'Premium design', 'Good battery life', 'Intuitive interface'],
      cons: ['Expensive', 'Limited third-party apps', 'Works best with Samsung phones', 'Charging can be slow']
    }
  },

  // ADDITIONAL DIVERSE PRODUCTS
  {
    title: 'Herman Miller Aeron Chair',
    price: '$1,395',
    brand: 'Herman Miller',
    category: 'home',
    subCategory: 'furniture',
    description: 'Iconic ergonomic office chair with revolutionary PostureFit SL support and advanced tilt mechanism for all-day comfort.',
    features: 'PostureFit SL back support, Pellicle suspension material, 8Z Pellicle, Advanced tilt mechanism, 12-year warranty',
    whyBuy: '🪑 Legendary ergonomic design meets lasting durability. Invest in your health and productivity with the gold standard.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.hermanmiller.com/products/seating/office-chairs/aeron-chairs/',
    source: 'Herman Miller',
    tags: ['ergonomic', 'premium', 'office', 'health'],
    amazonReviewSummary: 'Excellent ergonomics, durable, great for long hours',
    prosAndCons: {
      pros: ['Excellent ergonomics', 'Very durable', 'Breathable material', 'Great warranty'],
      cons: ['Very expensive', 'No headrest', 'Hard seat for some', 'Assembly required']
    }
  },
  {
    title: 'Vitamix A3500 Ascent Blender',
    price: '$549',
    brand: 'Vitamix',
    category: 'kitchen',
    subCategory: 'appliances',
    description: 'Professional-grade smart blender with wireless connectivity, self-detect technology, and variable speed control.',
    features: 'Wireless connectivity, Self-detect technology, Variable speed dial, Pulse feature, Built-in digital timer',
    whyBuy: '🥤 Professional power meets smart convenience. Create restaurant-quality smoothies, soups, and more at home.',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.vitamix.com/us/en_us/shop/a3500',
    source: 'Vitamix',
    tags: ['kitchen', 'healthy', 'professional', 'smart'],
    amazonReviewSummary: 'Incredibly powerful, makes perfect smoothies, built to last',
    prosAndCons: {
      pros: ['Extremely powerful', 'Versatile', 'Durable construction', 'Smart features'],
      cons: ['Very expensive', 'Large and heavy', 'Very loud', 'Learning curve']
    }
  },
  {
    title: 'Theragun PRO Percussive Therapy Device',
    price: '$399',
    brand: 'Therabody',
    category: 'wellness',
    subCategory: 'recovery',
    description: 'Professional-grade percussive therapy device with customizable speed, smart app integration, and ergonomic design.',
    features: 'Customizable speed range, Smart app integration, OLED screen, 150-minute battery life, 6 attachments included',
    whyBuy: '💪 Professional-grade recovery meets personalized therapy. Accelerate muscle recovery and enhance performance.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.therabody.com/us/en-us/theragun-pro-gen-5.html',
    source: 'Therabody',
    tags: ['wellness', 'recovery', 'professional', 'health'],
    amazonReviewSummary: 'Great for muscle recovery, powerful, easy to use',
    prosAndCons: {
      pros: ['Very effective', 'Professional quality', 'Long battery life', 'Smart features'],
      cons: ['Expensive', 'Can be loud', 'Heavy', 'Learning curve for optimal use']
    }
  },
  {
    title: 'Allbirds Tree Runners',
    price: '$98',
    brand: 'Allbirds',
    category: 'lifestyle',
    subCategory: 'footwear',
    description: 'Sustainable sneakers made from eucalyptus tree fiber with a breathable, lightweight design perfect for everyday wear.',
    features: 'Eucalyptus tree fiber upper, SweetFoam midsole, Machine washable, Carbon neutral shipping, Lightweight design',
    whyBuy: '👟 Sustainable comfort meets everyday style. Feel good about your footprint while feeling great on your feet.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center',
    link: 'https://www.allbirds.com/products/mens-tree-runners',
    source: 'Allbirds',
    tags: ['sustainable', 'comfortable', 'casual', 'eco-friendly'],
    amazonReviewSummary: 'Very comfortable, eco-friendly, good for casual wear',
    prosAndCons: {
      pros: ['Very comfortable', 'Sustainable materials', 'Machine washable', 'Lightweight'],
      cons: ['Not very durable', 'Limited support', 'Can get dirty easily', 'Expensive for casual shoes']
    }
  },
  {
    title: 'Ember Temperature Control Smart Mug²',
    price: '$149',
    brand: 'Ember',
    category: 'lifestyle',
    subCategory: 'drinkware',
    description: 'Smart mug that maintains your perfect drinking temperature, controlled via smartphone app with 1.5-hour battery life.',
    features: 'Temperature control 120°F - 145°F, 1.5-hour battery life, Smartphone app control, Auto sleep, LED indicator',
    whyBuy: '☕ Perfect temperature, every sip. Smart technology meets coffee ritual for the ultimate drinking experience.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop&crop=center',
    link: 'https://ember.com/products/ember-mug-2',
    source: 'Ember',
    tags: ['smart', 'innovative', 'lifestyle', 'tech'],
    amazonReviewSummary: 'Amazing for coffee lovers, maintains perfect temp, well-built',
    prosAndCons: {
      pros: ['Maintains perfect temperature', 'Smart app control', 'Well-designed', 'Great for coffee enthusiasts'],
      cons: ['Very expensive', 'Short battery life', 'Hand wash only', 'Limited capacity']
    }
  }
];

async function populateProducts() {
  console.log(`🚀 Starting to populate ${products.length} products in Supabase...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      const { data, error } = await supabase
        .from('Product')
        .insert({
          title: product.title,
          price: product.price,
          link: product.link,
          source: product.source,
          description: product.description,
          features: product.features,
          whyBuy: product.whyBuy,
          image: product.image,
          category: product.category,
          subCategory: product.subCategory,
          tags: product.tags,
          amazonReviewSummary: product.amazonReviewSummary,
          instagramReviewSummary: product.instagramReviewSummary,
          fbMarketplaceSummary: product.fbMarketplaceSummary,
          prosAndCons: product.prosAndCons,
          // Generate mock embedding for now
          productEmbedding: Array.from({length: 384}, () => Math.random() * 2 - 1)
        })
        .select();

      if (error) {
        console.error(`❌ Error inserting ${product.title}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Inserted: ${product.title} (${product.brand})`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error with ${product.title}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`✅ Successfully added: ${successCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);
  console.log(`📈 Total products: ${successCount + errorCount}`);
  
  // Get final count
  try {
    const { count } = await supabase
      .from('Product')
      .select('*', { count: 'exact', head: true });
    console.log(`🎯 Total products in database: ${count}`);
  } catch (error) {
    console.log('Could not get total count');
  }
}

// Run the script
console.log('🔧 Connecting to Supabase...');
populateProducts().catch(console.error);