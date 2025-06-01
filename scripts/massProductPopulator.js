// Mass Product Populator - Add 100+ premium products from top brands
// Uses the working database service from the app

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
//const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY1MjA4NCwiZXhwIjoyMDY0MjI4MDg0fQ.PzOKZW2qJRO8wgcCPnFqQPcCHwqOLs_6OJq6qKEInQE';
// Use the working anon key from the app with individual inserts
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjJDYZQGxNDZE-qWA5v-4';
const supabase = createClient(supabaseUrl, supabaseKey);

// 15 Major Brands with 7-8 Products Each = ~100+ Total Products
const COMPREHENSIVE_PRODUCT_DATABASE = [
  {
    brand: 'Apple',
    category: 'tech',
    products: [
      { title: 'iPhone 15 Pro Max', price: '$1,199', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', whyBuy: '🍎 Ultimate iPhone with titanium build and pro cameras' },
      { title: 'iPhone 15 Pro', price: '$999', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', whyBuy: '🍎 Professional iPhone with titanium design' },
      { title: 'iPhone 15', price: '$799', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', whyBuy: '🍎 Latest iPhone with USB-C and Dynamic Island' },
      { title: 'MacBook Pro 16" M3 Max', price: '$3,999', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop', whyBuy: '🍎 Most powerful MacBook for professionals' },
      { title: 'MacBook Air 15" M3', price: '$1,299', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop', whyBuy: '🍎 Larger Air with incredible performance' },
      { title: 'AirPods Pro (2nd Gen)', price: '$249', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop', whyBuy: '🍎 Best noise cancellation with spatial audio' },
      { title: 'Apple Watch Ultra 2', price: '$799', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop', whyBuy: '🍎 Rugged smartwatch for extreme activities' },
      { title: 'iPad Pro 12.9" M4', price: '$1,299', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', whyBuy: '🍎 Most advanced iPad with M4 chip power' }
    ]
  },
  {
    brand: 'Samsung',
    category: 'tech',
    products: [
      { title: 'Galaxy S24 Ultra', price: '$1,299', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '📱 Ultimate Android with S Pen and AI features' },
      { title: 'Galaxy S24+', price: '$999', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '📱 Premium Galaxy with large display' },
      { title: 'Galaxy Z Fold 6', price: '$1,899', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '📱 Revolutionary foldable with productivity features' },
      { title: 'Galaxy Z Flip 6', price: '$1,099', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '📱 Compact foldable with style and function' },
      { title: '85" Neo QLED 8K TV', price: '$4,999', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', whyBuy: '📱 Massive 8K display with quantum technology' },
      { title: 'Galaxy Buds2 Pro', price: '$229', image: 'https://images.unsplash.com/photo-1590658165737-15a047b83d20?w=600&h=600&fit=crop', whyBuy: '📱 Premium earbuds with intelligent ANC' },
      { title: 'Galaxy Watch7', price: '$329', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop', whyBuy: '📱 Advanced health tracking with Galaxy ecosystem' },
      { title: 'Galaxy Tab S10 Ultra', price: '$1,199', image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop', whyBuy: '📱 Professional Android tablet with S Pen' }
    ]
  },
  {
    brand: 'Nike',
    category: 'fashion',
    products: [
      { title: 'Air Jordan 1 Retro High OG', price: '$170', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Iconic basketball legend in premium leather' },
      { title: 'Air Jordan 4 Retro', price: '$210', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Classic silhouette with modern comfort' },
      { title: 'Nike Dunk Low', price: '$100', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Versatile court style for everyday wear' },
      { title: 'Air Max 270', price: '$150', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Maximum Air cushioning for all-day comfort' },
      { title: 'Air Force 1 Low', price: '$90', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Timeless court classic that goes with everything' },
      { title: 'Air Max 1', price: '$110', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ The original visible Air with retro appeal' },
      { title: 'Blazer Mid 77', price: '$100', image: 'https://images.unsplash.com/photo-1600717448996-7ad2b08aa7ab?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Vintage basketball style with modern updates' },
      { title: 'React Element 55', price: '$130', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Futuristic design with React foam comfort' }
    ]
  },
  {
    brand: 'Sony',
    category: 'audio',
    products: [
      { title: 'WH-1000XM5 Headphones', price: '$399', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Industry-leading noise cancellation' },
      { title: 'WF-1000XM4 Earbuds', price: '$279', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎵 True wireless with premium sound quality' },
      { title: 'PlayStation 5', price: '$499', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '🎵 Next-gen gaming with lightning-fast loading' },
      { title: 'Alpha A7R V Camera', price: '$3,899', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop', whyBuy: '🎵 Professional mirrorless with 61MP sensor' },
      { title: 'SRS-XB43 Speaker', price: '$249', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎵 Powerful portable bass with party lights' },
      { title: 'WH-CH720N Headphones', price: '$149', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Affordable noise canceling with great sound' },
      { title: 'FX3 Cinema Camera', price: '$3,899', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop', whyBuy: '🎵 Professional cinema camera for filmmakers' },
      { title: 'LinkBuds S', price: '$199', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎵 Smart earbuds with ambient sound control' }
    ]
  },
  {
    brand: 'Dyson',
    category: 'home',
    products: [
      { title: 'V15 Detect Absolute', price: '$749', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', whyBuy: '🌪️ Laser reveals hidden dust particles' },
      { title: 'Airwrap Complete Long', price: '$599', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', whyBuy: '🌪️ Revolutionary hair styling without extreme heat' },
      { title: 'Supersonic Hair Dryer', price: '$429', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', whyBuy: '🌪️ Fast drying with intelligent heat protection' },
      { title: 'V12 Detect Slim', price: '$649', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', whyBuy: '🌪️ Lightweight with powerful suction and laser' },
      { title: 'Pure Cool Air Purifier TP07', price: '$549', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', whyBuy: '🌪️ Purifies air while cooling your space' },
      { title: 'Corrale Hair Straightener', price: '$499', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', whyBuy: '🌪️ Cordless straightener with flexing plates' },
      { title: 'V8 Absolute', price: '$449', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop', whyBuy: '🌪️ Versatile cordless with whole-machine filtration' },
      { title: 'Hot+Cool Air Purifier HP07', price: '$649', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', whyBuy: '🌪️ Heats, cools, and purifies automatically' }
    ]
  },
  {
    brand: 'Bose',
    category: 'audio',
    products: [
      { title: 'QuietComfort 45', price: '$329', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎧 World-class noise cancellation for focus' },
      { title: 'QuietComfort Ultra Headphones', price: '$429', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎧 Spatial audio with immersive experience' },
      { title: 'QuietComfort Earbuds', price: '$279', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎧 True wireless with noise cancellation' },
      { title: 'SoundLink Revolve+', price: '$299', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎧 360-degree sound with portable design' },
      { title: 'Home Speaker 500', price: '$549', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🎧 Smart speaker with spacious sound' },
      { title: 'SoundLink Flex', price: '$149', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎧 Waterproof speaker for any adventure' },
      { title: 'Smart Soundbar 600', price: '$499', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🎧 Dolby Atmos with voice control' },
      { title: 'QuietComfort 20', price: '$249', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎧 In-ear noise cancelling for travel' }
    ]
  },
  {
    brand: 'Adidas',
    category: 'fashion', 
    products: [
      { title: 'Ultraboost 23', price: '$190', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Premium running with boost technology' },
      { title: 'Stan Smith', price: '$80', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Iconic white leather tennis classic' },
      { title: 'Yeezy Boost 350 V2', price: '$220', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Kanye West design with boost comfort' },
      { title: 'Gazelle', price: '$90', image: 'https://images.unsplash.com/photo-1600717448996-7ad2b08aa7ab?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Retro suede with timeless appeal' },
      { title: 'NMD R1', price: '$140', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Street style with modern boost sole' },
      { title: 'Superstar', price: '$85', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Shell toe icon with hip-hop heritage' },
      { title: 'Campus 00s', price: '$90', image: 'https://images.unsplash.com/photo-1600717448996-7ad2b08aa7ab?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Y2K revival with chunky silhouette' },
      { title: 'Forum Low', price: '$90', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop', whyBuy: '🏃‍♂️ Basketball heritage with ankle strap' }
    ]
  },
  {
    brand: 'Microsoft',
    category: 'tech',
    products: [
      { title: 'Surface Laptop 5', price: '$999', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', whyBuy: '💻 Premium Windows laptop with touchscreen' },
      { title: 'Surface Pro 9', price: '$879', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', whyBuy: '💻 2-in-1 tablet with laptop performance' },
      { title: 'Xbox Series X', price: '$499', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '💻 Most powerful Xbox with 4K gaming' },
      { title: 'Surface Studio 2+', price: '$4,299', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&h=600&fit=crop', whyBuy: '💻 All-in-one for creative professionals' },
      { title: 'Surface Headphones 2', price: '$249', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '💻 Intuitive controls with premium sound' },
      { title: 'Xbox Wireless Controller', price: '$59', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '💻 Precision gaming with haptic feedback' },
      { title: 'Surface Duo 2', price: '$1,499', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '💻 Dual-screen Android with productivity' },
      { title: 'HoloLens 2', price: '$3,500', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=600&h=600&fit=crop', whyBuy: '💻 Mixed reality for enterprise solutions' }
    ]
  },
  {
    brand: 'Google',
    category: 'tech',
    products: [
      { title: 'Pixel 8 Pro', price: '$999', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '🔍 AI-powered photography with pure Android' },
      { title: 'Pixel 8', price: '$699', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', whyBuy: '🔍 Smart camera with Google AI features' },
      { title: 'Pixel Buds Pro', price: '$199', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🔍 Smart earbuds with real-time translation' },
      { title: 'Nest Hub Max', price: '$229', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🔍 Smart display with family hub features' },
      { title: 'Nest Thermostat', price: '$129', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', whyBuy: '🔍 Energy-saving smart temperature control' },
      { title: 'Chromecast with Google TV', price: '$49', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', whyBuy: '🔍 4K streaming with personalized recommendations' },
      { title: 'Pixel Watch 2', price: '$349', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop', whyBuy: '🔍 Wear OS with Fitbit health tracking' },
      { title: 'Nest Cam Outdoor', price: '$179', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', whyBuy: '🔍 Smart security with intelligent alerts' }
    ]
  },
  {
    brand: 'JBL',
    category: 'audio',
    products: [
      { title: 'Charge 5', price: '$179', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎵 Portable powerbank speaker with bold sound' },
      { title: 'Flip 6', price: '$129', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🎵 Waterproof speaker with signature sound' },
      { title: 'Live 660NC', price: '$199', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Wireless headphones with adaptive noise cancelling' },
      { title: 'PartyBox 310', price: '$499', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop', whyBuy: '🎵 Party speaker with dynamic light show' },
      { title: 'Tour Pro 2', price: '$249', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', whyBuy: '🎵 Smart case earbuds with touchscreen control' },
      { title: 'Xtreme 3', price: '$349', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', whyBuy: '🎵 Massive sound with 15-hour playtime' },
      { title: 'Tune 760NC', price: '$129', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', whyBuy: '🎵 Affordable noise cancelling with JBL sound' },
      { title: 'Go 3', price: '$49', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop', whyBuy: '🎵 Ultra-portable with surprisingly big sound' }
    ]
  },
  {
    brand: 'Tesla',
    category: 'automotive',
    products: [
      { title: 'Model S Plaid', price: '$109,990', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=600&fit=crop', whyBuy: '⚡ Fastest production car with tri-motor setup' },
      { title: 'Model 3 Performance', price: '$50,990', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=600&fit=crop', whyBuy: '⚡ Track-ready electric sedan with autopilot' },
      { title: 'Model Y Long Range', price: '$47,990', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=600&fit=crop', whyBuy: '⚡ Family SUV with 330-mile range' },
      { title: 'Cybertruck', price: '$81,895', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=600&fit=crop', whyBuy: '⚡ Revolutionary electric truck design' },
      { title: 'Wall Connector', price: '$475', image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=600&fit=crop', whyBuy: '⚡ Fast home charging solution' },
      { title: 'Mobile Connector', price: '$275', image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=600&fit=crop', whyBuy: '⚡ Portable charging for any outlet' },
      { title: 'Powerwall 3', price: '$9,300', image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=600&fit=crop', whyBuy: '⚡ Home battery backup with solar integration' },
      { title: 'Solar Panels', price: '$12,000', image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=600&fit=crop', whyBuy: '⚡ Clean energy generation for your home' }
    ]
  },
  {
    brand: 'Lululemon',
    category: 'fitness',
    products: [
      { title: 'Align High-Rise Pant', price: '$98', image: 'https://images.unsplash.com/photo-1506629905452-19f18d504ad4?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Buttery-soft leggings for yoga and lounging' },
      { title: 'Wunder Train High-Rise Tight', price: '$98', image: 'https://images.unsplash.com/photo-1506629905452-19f18d504ad4?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Sweat-wicking for high-intensity training' },
      { title: 'Energy Bra', price: '$52', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Medium support for yoga and barre' },
      { title: 'Scuba Hoodie', price: '$118', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Oversized comfort for post-workout relaxation' },
      { title: 'Define Jacket', price: '$148', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Fitted jacket that moves with you' },
      { title: 'Everywhere Belt Bag', price: '$38', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Hands-free convenience for active lifestyle' },
      { title: 'Metal Vent Tech Long Sleeve', price: '$88', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Anti-stink technology for intense workouts' },
      { title: 'Free to Be Elevated Bra', price: '$58', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop', whyBuy: '🧘‍♀️ Light support with strappy details' }
    ]
  },
  {
    brand: 'Nintendo',
    category: 'gaming',
    products: [
      { title: 'Nintendo Switch OLED', price: '$349', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '🎮 Enhanced display for handheld gaming' },
      { title: 'Nintendo Switch Lite', price: '$199', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '🎮 Dedicated handheld with longer battery' },
      { title: 'Super Mario Bros. Wonder', price: '$59', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop', whyBuy: '🎮 Latest 2D Mario adventure with wonder effects' },
      { title: 'The Legend of Zelda: Tears of the Kingdom', price: '$69', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop', whyBuy: '🎮 Epic adventure in Hyrule with building mechanics' },
      { title: 'Super Mario Odyssey', price: '$49', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop', whyBuy: '🎮 3D platforming adventure across kingdoms' },
      { title: 'Pro Controller', price: '$69', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', whyBuy: '🎮 Professional gaming controller for precision' },
      { title: 'Mario Kart 8 Deluxe', price: '$59', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop', whyBuy: '🎮 Ultimate kart racing with friends and family' },
      { title: 'Animal Crossing: New Horizons', price: '$59', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop', whyBuy: '🎮 Relaxing island life simulation' }
    ]
  },
  {
    brand: 'KitchenAid',
    category: 'kitchen',
    products: [
      { title: 'Artisan Series 5-Qt Stand Mixer', price: '$449', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Iconic stand mixer for serious baking' },
      { title: 'Professional 5 Plus Mixer', price: '$499', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Powerful motor for heavy-duty mixing' },
      { title: 'Food Processor 13-Cup', price: '$299', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Large capacity for meal prep efficiency' },
      { title: 'Immersion Blender', price: '$79', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Versatile handheld for soups and sauces' },
      { title: 'Cold Brew Coffee Maker', price: '$199', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Brew perfect cold coffee at home' },
      { title: 'Pasta Roller Attachment', price: '$179', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Fresh pasta making with your mixer' },
      { title: 'Ice Cream Maker Bowl', price: '$89', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Homemade ice cream with your mixer' },
      { title: 'Spiralizer Attachment', price: '$149', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', whyBuy: '👨‍🍳 Vegetable noodles and creative presentations' }
    ]
  }
];

class MassProductPopulator {
  constructor() {
    this.savedCount = 0;
    this.errorCount = 0;
    this.totalProducts = 0;
  }

  async populateDatabase() {
    console.log('🚀 Mass Product Populator - Adding 100+ Premium Products...\n');
    
    // Calculate total products
    this.totalProducts = COMPREHENSIVE_PRODUCT_DATABASE.reduce((total, brand) => total + brand.products.length, 0);
    console.log(`📊 Processing ${COMPREHENSIVE_PRODUCT_DATABASE.length} brands with ${this.totalProducts} total products\n`);
    
    const startTime = Date.now();
    
    for (const brandData of COMPREHENSIVE_PRODUCT_DATABASE) {
      console.log(`🏢 Processing ${brandData.brand} (${brandData.products.length} products)...`);
      
      for (const product of brandData.products) {
        try {
          const formattedProduct = this.formatProduct(product, brandData);
          
          // Use insert instead of upsert to avoid constraint issues
          const { error } = await supabase
            .from('Product')
            .insert(formattedProduct);

          if (error) {
            throw new Error(error.message);
          }
          
          this.savedCount++;
          console.log(`   ✅ ${product.title}`);
        } catch (error) {
          console.log(`   ❌ Failed: ${product.title} - ${error.message}`);
          this.errorCount++;
        }
      }
      
      console.log(`   💾 Completed ${brandData.brand}: ${brandData.products.length} products\n`);
    }
    
    await this.generateReport(startTime);
  }

  formatProduct(product, brandData) {
    return {
      title: product.title,
      price: product.price,
      link: `https://${brandData.brand.toLowerCase()}.com/${product.title.toLowerCase().replace(/\s+/g, '-')}`,
      image: product.image,
      source: `${brandData.brand} Official Store`,
      description: `Premium ${brandData.brand} ${product.title} with authentic quality and warranty`,
      features: this.generateFeatures(product, brandData),
      whyBuy: product.whyBuy,
      category: this.mapCategory(brandData.category),
      subCategory: brandData.category,
      tags: [brandData.brand.toLowerCase(), brandData.category, 'premium', 'bestseller'],
      amazonReviewSummary: `Top-rated ${brandData.brand} product with excellent customer satisfaction`,
      instagramReviewSummary: `Trending ${brandData.brand} item popular on social media`,
      prosAndCons: {
        pros: [
          `Authentic ${brandData.brand} quality`,
          'Premium materials and craftsmanship',
          'Comprehensive warranty coverage'
        ],
        cons: [
          'Premium pricing',
          'High demand product',
          'May require wait times'
        ]
      },
      productEmbedding: Array.from({length: 384}, () => Math.random() * 2 - 1)
    };
  }

  generateFeatures(product, brandData) {
    const brandFeatures = {
      'Apple': 'Latest technology, seamless ecosystem integration, premium build quality',
      'Samsung': 'Cutting-edge innovation, advanced features, reliable performance',
      'Nike': 'Performance engineering, iconic design, athlete-tested quality',
      'Sony': 'Professional-grade quality, advanced audio technology, innovative features',
      'Dyson': 'Revolutionary engineering, powerful performance, innovative design',
      'Bose': 'Superior sound quality, premium materials, acoustic excellence',
      'Adidas': 'Sports performance, comfortable fit, iconic three-stripe design',
      'Microsoft': 'Productivity-focused, enterprise-grade, seamless integration',
      'Google': 'AI-powered features, smart functionality, seamless connectivity',
      'JBL': 'Bold sound signature, durable construction, portable design',
      'Tesla': 'Sustainable technology, autonomous features, cutting-edge innovation',
      'Lululemon': 'Technical fabrics, athletic performance, mindful design',
      'Nintendo': 'Family-friendly gaming, innovative gameplay, portable entertainment',
      'KitchenAid': 'Professional performance, durable construction, culinary excellence'
    };
    
    return brandFeatures[brandData.brand] || `Premium ${brandData.brand} product with professional quality`;
  }

  mapCategory(brandCategory) {
    const categoryMap = {
      'tech': 'Electronics',
      'audio': 'Audio & Headphones',
      'fashion': 'Fashion & Footwear',
      'home': 'Home & Garden',
      'automotive': 'Automotive',
      'fitness': 'Fitness & Sports',
      'gaming': 'Gaming',
      'kitchen': 'Kitchen & Dining'
    };
    
    return categoryMap[brandCategory] || 'General';
  }

  async generateReport(startTime) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('🎉 MASS PRODUCT POPULATION COMPLETE!\n');
    console.log('=' .repeat(60));
    console.log('📊 COMPREHENSIVE SUMMARY REPORT');
    console.log('=' .repeat(60));
    
    console.log(`\n📈 Results:`);
    console.log(`   • Total Products Added: ${this.savedCount}`);
    console.log(`   • Failed Products: ${this.errorCount}`);
    console.log(`   • Success Rate: ${Math.round((this.savedCount / this.totalProducts) * 100)}%`);
    console.log(`   • Processing Time: ${duration.toFixed(1)} seconds`);
    console.log(`   • Products per Second: ${(this.savedCount / duration).toFixed(1)}`);
    
    // Brand breakdown
    console.log(`\n🏢 Brand Coverage:`);
    COMPREHENSIVE_PRODUCT_DATABASE.forEach((brand, i) => {
      console.log(`   ${i+1}. ${brand.brand}: ${brand.products.length} products (${brand.category})`);
    });
    
    // Verify database
    try {
      const { count } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true });
      
      console.log(`\n🗄️ Database Status:`);
      console.log(`   • Total Products in Database: ${count}`);
      console.log(`   • Products Added This Session: ${this.savedCount}`);
      
      // Sample recent products
      const { data: recentProducts } = await supabase
        .from('Product')
        .select('title, price, source')
        .order('id', { ascending: false })
        .limit(5);
        
      if (recentProducts && recentProducts.length > 0) {
        console.log(`\n📱 Recent Products Added:`);
        recentProducts.forEach((product, i) => {
          console.log(`   ${i+1}. ${product.title} - ${product.price}`);
        });
      }
    } catch (error) {
      console.log(`\n⚠️ Could not verify database count: ${error.message}`);
    }
    
    console.log(`\n🎯 What's Now Available:`);
    console.log(`   1. 100+ premium products from top brands`);
    console.log(`   2. Complete product information with reviews`);
    console.log(`   3. Professional descriptions and features`);
    console.log(`   4. Brand persona integration ready`);
    console.log(`   5. AI curation with diverse product range`);
    
    console.log(`\n🚀 Ready for:`);
    console.log(`   • Enhanced AI product curation`);
    console.log(`   • Brand persona matching`);
    console.log(`   • Advanced search and filtering`);
    console.log(`   • User preference learning`);
    
    console.log('\n✅ Your curator now has a comprehensive premium product database!');
  }
}

// Main execution
async function main() {
  const populator = new MassProductPopulator();
  
  try {
    await populator.populateDatabase();
  } catch (error) {
    console.error('❌ Mass population failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Supabase connection');
    console.log('   2. Verify API key permissions');
    console.log('   3. Ensure Product table exists');
  }
}

// Export for use in other modules
export { MassProductPopulator, COMPREHENSIVE_PRODUCT_DATABASE };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}