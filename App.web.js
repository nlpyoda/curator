import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, Image, PanResponder, Vibration, Easing, Platform, useWindowDimensions } from 'react-native';

// --- Debug: Log API Key at module level ---
console.log('[DEBUG] REACT_APP_CLAUDE_API_KEY at module level:', process.env.REACT_APP_CLAUDE_API_KEY);
// --- End Debug ---

// For trendy, minimalist color palette
const COLORS = {
  primary: '#121212',       // Instagram-like dark theme
  secondary: '#262626',     // Secondary dark
  accent1: '#0095F6',       // Instagram blue
  accent2: '#833AB4',       // Instagram purple (from gradient)
  accent3: '#FD1D1D',       // Instagram red/pink (from gradient)
  accent4: '#FCAF45',       // Instagram yellow/orange (from gradient)
  light: '#FFFFFF',         // White
  lightGray: '#FAFAFA',     // Instagram background gray
  midGray: '#8e8e8e',       // Instagram caption gray
  darkGray: '#262626',      // Dark text
  glassBg: 'rgba(255,255,255,0.8)',
  highlight: '#EFEFEF',     // Instagram highlight
  border: '#DBDBDB',        // Instagram border
  // Added for AI Curation form consistency
  background: '#FFFFFF', // Assuming a light theme for the form page itself
  text: '#1A1A1A', // Primary text color
  textInputBackground: '#F8F8F8',
  card: '#FFFFFF',
  shadow: '#000000',
  buttonPrimaryText: '#FFFFFF', // Text color for primary buttons
};

// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper function to lighten or darken a color
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100, 10);
  G = parseInt(G * (100 + percent) / 100, 10);
  B = parseInt(B * (100 + percent) / 100, 10);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16));

  return `#${RR}${GG}${BB}`;
};

// Mock data for testing
const mockProducts = [
  {
    id: 1,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: '$399.99',
    rating: '4.8',
    description: 'Industry-leading noise canceling, perfect for focus and immersive audio.',
    category: 'audio',
    tags: ['premium', 'wireless', 'noise-canceling', 'audio-excellence', 'travel-essential', 'optimizer-pick', 'trendsetter-pick', 'career-launch-essential', 'gamer-setup-essential', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&crop=center', // Premium headphones product shot
    affiliateUrl: 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-l?mg=shopping&gad_source=1&gad_campaignid=22224130485&gbraid=0AAAAABiDjZjIa5DKjAugccBx3T6KuLFCb&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGWew3GWTaHne6281N8_BDpE5qZdrbJcIgxWOT5Uz-yy9oisBKpJKBRoCdkgQAvD_BwE&gclsrc=aw.ds', // Sony official website link
    brand: 'Sony',
    insights: [],
    optimizerInsight: 'Exceptional noise cancellation for deep focus sessions.',
    trendsetterTip: 'A must-have for travel in style and ultimate audio immersion.',
    whyBuyThis: '✨ SILENCE IS GOLDEN → Industry-leading ANC blocks out the world • 30hr battery keeps you untethered • Premium comfort for marathon sessions • The gold standard pros swear by'
  },
  {
    id: 2,
    title: 'MacBook Pro 14-inch M3',
    price: '$1,999.00',
    rating: '4.9',
    description: 'Supercharged by M3 Pro chip for demanding creative and professional workflows.',
    category: 'laptop',
    tags: ['premium', 'pro', 'creative-powerhouse', 'performance', 'optimizer-pick', 'trendsetter-pick', 'career-launch-essential', 'gamer-setup-essential'],
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&crop=center', // Clean MacBook product shot
    affiliateUrl: 'https://www.amazon.com/dp/B0CM5JV268', // Amazon MacBook Pro 14" M3 link
    brand: 'Apple',
    insights: [],
    optimizerInsight: 'M3 Pro chip offers blazing fast performance for heavy workloads.',
    trendsetterTip: 'The creative professional\'s standard for power and aesthetics.',
    whyBuyThis: '🚀 POWER REDEFINED → M3 chip crushes any workflow • 22hr battery outlasts your ambition • Liquid Retina XDR makes pixels disappear • Your ideas deserve this canvas'
  },
  {
    id: 3,
    title: 'Dyson Supersonic Hair Dryer',
    price: '$429.99',
    rating: '4.7',
    description: 'Engineered for different hair types with intelligent heat control for shine.',
    category: 'beauty',
    tags: ['premium', 'beauty-tech', 'innovative', 'trendsetter-pick', 'wellness-retreat-essential', 'sanctuary-essential'],
    image: 'https://images.unsplash.com/photo-1620756236496-65f87a036c52?w=600&h=600&fit=crop&crop=center', // Luxury beauty device
    affiliateUrl: 'https://www.dyson.com/hair-care/hair-dryers/supersonic/black-nickel', // Official Dyson website link
    brand: 'Dyson',
    insights: [],
    trendsetterTip: 'Revolutionary hair tech that makes a statement.',
    whyBuyThis: '💫 SALON MEETS SCIENCE → Intelligent heat prevents damage • 3x faster than conventional dryers • Magnetic attachments snap on like magic • Your hair routine, revolutionized'
  },
  {
    id: 4,
    title: 'Away Carry-On Suitcase',
    price: '$275.00',
    rating: '4.6',
    description: 'Durable, lightweight polycarbonate shell with 360° spinner wheels and signature interior compression system.',
    category: 'travel',
    tags: ['travel-essential', 'durable', 'stylish-travel', 'conscious-pick', 'trendsetter-pick', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center', // Premium luggage shot
    affiliateUrl: 'https://www.awaytravel.com/products/carry-on-navy-blue', // Official Away navy blue carry-on
    brand: 'Away',
    insights: [],
    consciousChoiceDetail: 'Durable materials and a lifetime warranty reduce waste.',
    trendsetterTip: 'The iconic suitcase that started a travel revolution.',
    whyBuyThis: '✈️ TRAVEL GAME CHANGER → Award-winning design loved by millions • Interior compression fits 45% more • TSA-approved lock built-in • Lifetime warranty covers everything • The suitcase that made travel stylish again',
    trendingStats: '↗ 45% surge in searches • Featured in 200+ travel blogs this month • #1 carry-on on TikTok travel reviews • Sold 2M+ units worldwide',
    hotTake: 'This isn\'t just luggage—it\'s the travel accessory that transformed an entire industry. From Instagram feeds to airport terminals, the Away Carry-On became the unofficial uniform of modern travelers. The navy blue colorway is having a major moment as travelers embrace sophisticated, timeless aesthetics over flashy designs.'
  },
  {
    id: 5,
    title: 'Technivorm Moccamaster KBGV Select',
    price: '$359.00',
    rating: '4.8',
    description: 'Handmade in the Netherlands, brews a perfect pot of coffee, SCA certified.',
    category: 'kitchen',
    tags: ['premium-coffee', 'quality-brew', 'home-comfort', 'optimizer-pick', 'conscious-pick', 'sanctuary-essential', 'perfect-hosting-essential'],
    image: 'https://images.unsplash.com/photo-1559528895-4145a049718a?w=600&h=600&fit=crop&crop=center', // Premium coffee maker
    affiliateUrl: 'https://www.amazon.com/dp/B077JBQZPX', // Amazon Moccamaster link
    brand: 'Technivorm',
    insights: [],
    optimizerInsight: 'Consistently brews SCA Gold Cup standard coffee for peak morning productivity.',
    consciousChoiceDetail: 'Handmade, repairable, and built to last for years.',
    whyBuyThis: '☕ COFFEE PERFECTION → SCA-certified brewing hits ideal temperature every time • Handcrafted in Netherlands with 5-year warranty • 10-cup capacity fuels your entire day • Barista-quality without the barista price'
  },
  {
    id: 6,
    title: 'iPhone 15 Pro',
    price: '$999.00',
    rating: '4.9',
    description: 'Titanium design, A17 Pro chip, and a dramatically more powerful camera system.',
    category: 'phone',
    tags: ['premium', 'flagship', 'camera-excellence', 'performance', 'trendsetter-pick', 'optimizer-pick', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1695026545927-d9a838c3267f?w=600&h=600&fit=crop&crop=center', // iPhone 15 Pro
    affiliateUrl: 'https://www.amazon.com/dp/B0CHWV2Z1C', // Amazon iPhone 15 Pro link
    brand: 'Apple',
    insights: [],
    whyBuyThis: '📱 TITANIUM EVOLUTION → A17 Pro chip leaves competition behind • Pro camera system captures life in stunning detail • Action Button customizes to your workflow • Built to last, designed to impress'
  },
  {
    id: 7,
    title: 'Herman Miller Aeron Chair Remastered',
    price: '$1,395.00',
    rating: '4.8',
    description: 'The benchmark for ergonomic seating, fully adjustable for ultimate comfort and support.',
    category: 'furniture',
    tags: ['ergonomic', 'office-essential', 'premium-comfort', 'optimizer-pick', 'conscious-pick', 'career-launch-essential', 'sanctuary-essential', 'gamer-setup-essential'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center', // Modern office chair
    affiliateUrl: 'https://www.amazon.com/dp/B071G42VQD', // Amazon Herman Miller Aeron
    brand: 'Herman Miller',
    insights: [],
    whyBuyThis: '🪑 ERGONOMIC LEGEND → 8-zone PostureFit technology supports your every move • 12-year warranty backs legendary durability • Breathable mesh keeps you cool under pressure • The chair that built Silicon Valley'
  },
  {
    id: 8,
    title: 'Nespresso Vertuo Next Deluxe',
    price: '$229.00',
    rating: '4.5',
    description: 'Compact coffee and espresso machine with Centrifusion technology and sleek design.',
    category: 'kitchen',
    tags: ['coffee', 'convenience', 'home-cafe', 'student-pick', 'optimizer-pick', 'sanctuary-essential', 'perfect-hosting-essential'],
    image: 'https://images.unsplash.com/photo-1610801524961-a8f09715958d?w=600&h=600&fit=crop&crop=center', // Elegant coffee machine
    affiliateUrl: 'https://www.amazon.com/dp/B08HLYVJQL', // Amazon Nespresso Vertuo
    brand: 'Nespresso',
    insights: [],
    whyBuyThis: '☕ ONE-TOUCH LUXURY → Centrifusion tech extracts perfect crema every time • 40-second brewing beats morning rush • Compact design fits any counter • Café-quality without leaving home'
  },
  {
    id: 9,
    title: 'Allbirds Wool Runners',
    price: '$110.00',
    rating: '4.6',
    description: 'Soft, cozy, and sustainable sneakers made from ZQ Merino wool.',
    category: 'shoes',
    tags: ['sustainable', 'comfort-wear', 'casual-style', 'conscious-pick', 'student-pick', 'sustainable-living-essential', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d34?w=600&h=600&fit=crop&crop=center', // Clean sneaker shot
    affiliateUrl: 'https://www.amazon.com/dp/B071K7W8T1', // Amazon Allbirds link
    brand: 'Allbirds',
    insights: [],
    whyBuyThis: '👟 CLOUDS FOR YOUR FEET → Merino wool naturally regulates temperature • Machine washable keeps them fresh • Carbon-negative materials protect the planet • Comfort that converts non-believers'
  },
  {
    id: 10,
    title: 'Patagonia Nano Puff Jacket',
    price: '$239.00',
    rating: '4.7',
    description: 'Lightweight, windproof, and water-resistant jacket with recycled insulation.',
    category: 'clothing',
    tags: ['sustainable-outdoor', 'lightweight-warmth', 'travel-packable', 'conscious-pick', 'sustainable-living-essential'],
    image: 'https://images.unsplash.com/photo-1520903700003-46dcf53ea994?w=600&h=600&fit=crop&crop=center', // Updated Image
    affiliateUrl: 'https://www.amazon.com/dp/B0887QPPX3', // Amazon Patagonia Nano Puff link
    brand: 'Patagonia',
    insights: [],
    whyBuyThis: '🏔️ ADVENTURE ARMOR → Packable insulation weighs just 12oz • Weather-resistant DWR coating sheds light rain • 60g PrimaLoft recycled insulation keeps you warm • Your go-to layer for life outdoors'
  },
  // Student-focused products (Existing 5 + 1 new = 6)
  {
    id: 11,
    title: 'MacBook Air M2',
    price: '$999.00', // Adjusted price
    rating: '4.8',
    description: 'Perfect for students - lightweight, long battery life, great for notes and projects.',
    category: 'laptop',
    tags: ['student-pick', 'budget-friendly', 'portable', 'study-essential', 'performance', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.amazon.com/dp/B0B3C4CLBJ', // Amazon MacBook Air M2 link (corrected)
    brand: 'Apple',
    studentReview: 'Perfect for coding, note-taking, and Netflix. Battery lasts all day!',
    whyStudentsLove: 'Lightweight for campus carry, powerful enough for any major.',
    insights: [],
    whyBuyThis: '💻 STUDENT SUPERPOWER → M2 chip handles everything from coding to video editing • 18hr battery outlasts your longest study session • 2.7lb weight won\'t break your back • The laptop that gets you hired'
  },
  {
    id: 12,
    title: 'Anker PowerCore III Elite Portable Charger', // More specific model
    price: '$49.99', // Adjusted price
    rating: '4.7',
    description: 'High-capacity portable charger to keep all your devices powered on the go.',
    category: 'accessories',
    tags: ['student-pick', 'budget-friendly', 'essential-tech', 'portable-power', 'travel', 'career-launch-essential', 'gamer-setup-essential'],
    image: 'https://images.unsplash.com/photo-1609592806596-b43bada2e3c9?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.amazon.com/dp/B08LGM24ZP', // Amazon Anker PowerCore link
    brand: 'Anker',
    studentReview: 'Saved me countless times during finals week and long commutes!',
    whyStudentsLove: 'Reliable, fast charging, and fits in any backpack.',
    insights: [],
    whyBuyThis: '🔋 POWER ANXIETY = GONE → 25,600mAh charges your phone 5+ times • 60W USB-C powers laptops too • MultiProtect safety system prevents overheating • Your digital lifeline for $50'
  },
  {
    id: 13,
    title: 'Spotify Premium Student + Hulu & Showtime', // Bundled offer
    price: '$5.99/month',
    rating: '4.9',
    description: 'Music, movies, and shows for studying, relaxing, and entertainment.',
    category: 'subscription',
    tags: ['student-pick', 'budget-friendly', 'entertainment-bundle', 'study-break', 'value-deal', 'wellness-retreat-essential', 'gamer-setup-essential'],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.amazon.com/dp/B08C7KG5LP', // Amazon Spotify gift card alternative
    brand: 'Spotify',
    studentReview: 'The best deal for endless entertainment and study playlists.',
    whyStudentsLove: 'Three services for the price of one, essential for student life.',
    insights: [],
    whyBuyThis: '🎵 TRIPLE THREAT DEAL → Premium music + ad-free Hulu + Showtime for $6/month • 100M+ songs fuel your study sessions • Binge-worthy content for study breaks • Usually costs $35/month separately'
  },
  {
    id: 14,
    title: 'Hydro Flask Standard Mouth Bottle',
    price: '$39.95',
    rating: '4.7',
    description: 'Reusable water bottle to stay hydrated, keeps drinks cold for 24 hours or hot for 12.',
    category: 'accessories',
    tags: ['student-pick', 'sustainable', 'health-conscious', 'campus-essential', 'conscious-pick', 'sustainable-living-essential', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.amazon.com/dp/B077SQDQWS', // Amazon Hydro Flask link
    brand: 'Hydro Flask',
    studentReview: 'Keeps my water cold all day, even in a stuffy lecture hall!',
    whyStudentsLove: 'Eco-friendly, durable, and comes in cool colors.',
    insights: [],
    whyBuyThis: '🌊 HYDRATION HERO → TempShield insulation keeps drinks perfect for 24hrs • Dishwasher safe saves time • Lifetime warranty shows confidence • Campus essential that pays for itself'
  },
  {
    id: 15,
    title: 'Kanken Classic Backpack',
    price: '$80.00',
    rating: '4.6',
    description: 'Iconic and durable backpack, perfect for carrying books, laptop, and essentials.',
    category: 'accessories',
    tags: ['student-pick', 'fashionable-function', 'durable-design', 'campus-style', 'trendsetter-pick', 'career-launch-essential', 'sustainable-living-essential'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.amazon.com/dp/B00005GUXL', // Amazon Kanken backpack link
    brand: 'Fjallraven',
    studentReview: 'Super comfy, fits everything, and I get so many compliments!',
    whyStudentsLove: 'Stylish, practical, and built to last through all your college years.',
    insights: [],
    whyBuyThis: '🎒 CAMPUS ICON → Vinylon F fabric resists water and stains • Ergonomic straps prevent back pain • 16L capacity holds laptop + books + lunch • Swedish design that started a movement'
  },
  {
    id: 16, // New product
    title: 'Logitech MX Master 3S Mouse',
    price: '$99.99',
    rating: '4.9',
    description: 'Advanced wireless mouse with ultra-fast scrolling and ergonomic design for productivity.',
    category: 'accessories',
    tags: ['optimizer-pick', 'ergonomic', 'productivity-tool', 'tech-essential', 'performance', 'career-launch-essential', 'gamer-setup-essential'],
    image: 'https://images.unsplash.com/photo-1606416132922-7214bab15a56?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.logitech.com/en-us/products/mice/mx-master-3s.910-006556.html',
    brand: 'Logitech',
    insights: []
  },
  {
    id: 17, // New product
    title: 'Kindle Paperwhite Signature Edition',
    price: '$189.99',
    rating: '4.8',
    description: 'Glare-free display, waterproof, wireless charging, and adjustable warm light for reading.',
    category: 'electronics',
    tags: ['optimizer-pick', 'reading-gadget', 'travel-friendly', 'conscious-pick', 'student-pick', 'golden-years-essential', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98ba8ec?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.amazon.com/Kindle-Paperwhite-Signature-Edition-32/dp/B08N5J7S3L',
    brand: 'Amazon',
    insights: []
  },
  {
    id: 18, // New product
    title: 'Wacom Intuos Pro Medium',
    price: '$379.95',
    rating: '4.7',
    description: 'Professional pen tablet for digital drawing, painting, and photo editing.',
    category: 'electronics',
    tags: ['trendsetter-pick', 'creative-tool', 'digital-art', 'pro-gear', 'optimizer-pick', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1585288940045-07517f8371c7?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.wacom.com/en-us/products/pen-tablets/wacom-intuos-pro',
    brand: 'Wacom',
    insights: []
  },
  {
    id: 19, // New product
    title: 'Rimowa Essential Lite Cabin Suitcase',
    price: '$700.00',
    rating: '4.8',
    description: 'Exceptionally lightweight and durable polycarbonate suitcase, engineered for travelers.',
    category: 'travel',
    tags: ['trendsetter-pick', 'luxury-travel', 'lightweight', 'durable-design', 'premium', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1561580119-a4004e4cef59?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.rimowa.com/us/en/luggage/colour/black/cabin/82353624.html',
    brand: 'Rimowa',
    insights: []
  },
  {
    id: 20, // New product
    title: 'Moleskine Classic Notebook Large, Ruled',
    price: '$22.95',
    rating: '4.7',
    description: 'Iconic notebook for writing, journaling, and sketching. Durable cover and quality paper.',
    category: 'accessories',
    tags: ['optimizer-pick', 'student-pick', 'writing-essential', 'classic-design', 'conscious-pick', 'career-launch-essential', 'sanctuary-essential'],
    image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.moleskine.com/en-us/shop/notebooks/classic-notebooks/classic-notebook-black-hard-cover-large-ruled-8058647629578.html',
    brand: 'Moleskine',
    insights: []
  },
  {
    id: 21, // New product
    title: 'Bose QuietComfort Ultra Earbuds',
    price: '$299.00',
    rating: '4.6',
    description: 'World-class noise cancellation and high-fidelity audio in a compact earbud.',
    category: 'audio',
    tags: ['optimizer-pick', 'trendsetter-pick', 'premium-audio', 'noise-canceling', 'travel-essential', 'career-launch-essential', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1600003014704-538a195a697c?w=600&h=600&fit=crop&crop=center', // New image
    affiliateUrl: 'https://www.bose.com/en_us/products/headphones/earbuds/bose-quietcomfort-ultra-earbuds.html',
    brand: 'Bose',
    insights: []
  },
  {
    id: 22, // New Product
    title: 'Oura Ring Gen3 Horizon',
    price: '$349.00',
    rating: '4.5',
    description: 'Smart ring that tracks sleep, activity, readiness, and temperature with a sleek design.',
    category: 'wearables',
    tags: ['trendsetter-pick', 'health-tech', 'wearable-tech', 'sleep-tracking', 'premium', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1690994628236-9a3f780edc00?w=600&h=600&fit=crop&crop=center', // Replace with actual Oura ring image if possible
    affiliateUrl: 'https://ouraring.com/',
    brand: 'Oura',
    insights: []
  },
  {
    id: 23, // New Product
    title: 'Everlane The Organic Cotton Crew Tee',
    price: '$30.00',
    rating: '4.6',
    description: 'A classic, comfortable crew neck tee made from certified organic cotton.',
    category: 'clothing',
    tags: ['conscious-pick', 'sustainable-fashion', 'wardrobe-staple', 'organic', 'minimalist', 'sustainable-living-essential', 'sanctuary-essential'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.everlane.com/products/mens-organic-cotton-crew-uniform-white',
    brand: 'Everlane',
    insights: []
  },
  {
    id: 24, // New Product
    title: 'Fellow Stagg EKG Electric Kettle',
    price: '$195.00',
    rating: '4.8',
    description: 'Beautifully designed electric pour-over kettle with variable temperature control.',
    category: 'kitchen',
    tags: ['trendsetter-pick', 'optimizer-pick', 'premium-kitchen', 'coffee-lover', 'design-focused', 'sanctuary-essential', 'perfect-hosting-essential'],
    image: 'https://images.unsplash.com/photo-1620674156628-918f7994a9dd?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle',
    brand: 'Fellow',
    insights: []
  },
  {
    id: 25, // New Product
    title: 'Veja V-10 Sneakers',
    price: '$175.00',
    rating: '4.5',
    description: 'Sustainably made sneakers with a classic look, using ecological and recycled materials.',
    category: 'shoes',
    tags: ['conscious-pick', 'sustainable-fashion', 'ethical-brand', 'stylish-sneaker', 'trendsetter-pick', 'sustainable-living-essential'],
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.veja-store.com/en_us/v-10-leather-white-natural-VXM021267.html',
    brand: 'Veja',
    insights: []
  },
  {
    id: 26, // New product
    title: 'ThinkPad X1 Carbon Gen 11',
    price: '$1,749.00',
    rating: '4.8',
    description: 'Ultra-light and durable business laptop with robust security and performance features.',
    category: 'laptop',
    tags: ['optimizer-pick', 'business-laptop', 'premium', 'portable', 'security-focused', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=600&h=600&fit=crop&crop=center', // Generic laptop image
    affiliateUrl: 'https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-carbon-gen-11/len101t0049',
    brand: 'Lenovo',
    insights: []
  },
  {
    id: 27, // New product
    title: 'Roost V3 Laptop Stand',
    price: '$89.95',
    rating: '4.9',
    description: 'Ultra-portable and adjustable laptop stand for improved ergonomics.',
    category: 'accessories',
    tags: ['optimizer-pick', 'conscious-pick', 'ergonomic', 'portable', 'travel-essential', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1593642702821-c8da67585055?w=600&h=600&fit=crop&crop=center', // Generic workspace image
    affiliateUrl: 'https://www.therooststand.com/',
    brand: 'Roost',
    insights: []
  },
  {
    id: 28, // New product
    title: 'Premium Leather Briefcase by Satchel & Page',
    price: '$475.00',
    rating: '4.7',
    description: 'Handcrafted full-grain leather briefcase for the discerning professional.',
    category: 'accessories',
    tags: ['optimizer-pick', 'premium', 'leather-goods', 'professional-style', 'durable', 'career-launch-essential'],
    image: 'https://images.unsplash.com/photo-1584917865430-de3351a91a9f?w=600&h=600&fit=crop&crop=center', // Generic briefcase image
    affiliateUrl: 'https://www.satchel-page.com/products/founder-briefcase',
    brand: 'Satchel & Page',
    insights: []
  },
  {
    id: 29, // New student product
    title: 'TI-84 Plus CE Graphing Calculator',
    price: '$129.99',
    rating: '4.8',
    description: 'Essential graphing calculator for math and science students.',
    category: 'electronics',
    tags: ['student-pick', 'study-essential', 'math-tool', 'stem'],
    image: 'https://images.unsplash.com/photo-1595993900939-8088865091ce?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://education.ti.com/en/products/calculators/graphing-calculators/ti-84-plus-ce',
    brand: 'Texas Instruments',
    studentReview: 'A must-have for any STEM major. Makes complex calculations easy.',
    whyStudentsLove: 'Approved for most exams and lasts for years.',
    insights: []
  },
  {
    id: 30, // New Product - Instant Ramen
    title: 'Instant Ramen Variety Pack (Bulk)',
    price: '$24.99',
    rating: '4.3',
    description: 'Dorm room essential - quick, tasty, and budget-friendly meals for late-night study sessions.',
    category: 'food',
    tags: ['student-pick', 'budget-friendly', 'dorm-essential', 'quick-meal', 'comfort-food'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.amazon.com/dp/B07FQRPQSB', // Nongshim Shin Ramyun variety pack
    brand: 'Nongshim & Others',
    studentReview: 'Lifesaver during finals week when I have no time to cook.',
    whyStudentsLove: 'Cheap, filling, and surprisingly delicious.',
    insights: []
  },
  {
    id: 31, // New Product - Blue Light Glasses
    title: 'Blue Light Blocking Glasses (2-Pack)',
    price: '$19.99',
    rating: '4.4',
    description: 'Protect your eyes during long screen time sessions, reduce eye strain and improve sleep.',
    category: 'accessories',
    tags: ['student-pick', 'health-gadget', 'study-aid', 'budget-friendly', 'eye-care'],
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.amazon.com/dp/B08XQJK9XY', // Blue light blocking glasses 2-pack
    brand: 'Various Brands',
    studentReview: 'No more headaches after hours of coding and online lectures!',
    whyStudentsLove: 'Affordable way to protect your eyes and look smart.',
    insights: []
  },
  {
    id: 32, // New product for new arrival
    title: 'UPPAbaby Vista V2 Stroller System',
    price: '$969.99',
    rating: '4.8',
    description: 'Premium stroller system that grows with your child from infant to toddler.',
    category: 'baby',
    tags: ['new-arrival-essential', 'premium-parenting', 'stroller-system', 'infant-care'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://uppababy.com/vista/',
    brand: 'UPPAbaby',
    insights: []
  },
  {
    id: 33, // New product for new arrival
    title: 'SNOO Smart Sleeper Bassinet',
    price: '$1,695.00',
    rating: '4.9',
    description: 'Revolutionary smart bassinet that helps babies sleep better and longer.',
    category: 'baby',
    tags: ['new-arrival-essential', 'smart-parenting', 'sleep-solution', 'premium-baby'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.happiestbaby.com/products/snoo-smart-bassinet',
    brand: 'Happiest Baby',
    insights: []
  },
  {
    id: 34, // New product for golden years
    title: 'Bose SoundLink Revolve+ II',
    price: '$329.00',
    rating: '4.7',
    description: 'Portable Bluetooth speaker with 360-degree sound, perfect for any activity.',
    category: 'audio',
    tags: ['golden-years-essential', 'portable-audio', 'senior-friendly', 'easy-to-use'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.bose.com/en_us/products/speakers/portable_speakers/soundlink_revolve_plus_ii.html',
    brand: 'Bose',
    insights: []
  },
  {
    id: 35, // New product for golden years
    title: 'Kindle Oasis (10th Gen)',
    price: '$269.99',
    rating: '4.6',
    description: 'Premium e-reader with adjustable warm light, waterproof design, and page-turn buttons.',
    category: 'electronics',
    tags: ['golden-years-essential', 'reading-comfort', 'large-screen', 'senior-friendly'],
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98ba8ec?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.amazon.com/kindle-oasis/dp/B07L5GH2YP',
    brand: 'Amazon',
    insights: []
  },
  {
    id: 36, // New product for gamer setup
    title: 'ASUS ROG Swift PG279QM Gaming Monitor',
    price: '$699.00',
    rating: '4.8',
    description: '27" 1440p 240Hz IPS gaming monitor with G-SYNC and HDR for competitive gaming.',
    category: 'electronics',
    tags: ['gamer-setup-essential', 'high-refresh', 'competitive-gaming', 'premium-display'],
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://rog.asus.com/monitors/27-to-31-5-inches/rog-swift-pg279qm/',
    brand: 'ASUS',
    insights: []
  },
  {
    id: 37, // New product for gamer setup
    title: 'SteelSeries Arctis Pro Wireless',
    price: '$329.99',
    rating: '4.6',
    description: 'Premium wireless gaming headset with lossless 2.4GHz audio and Bluetooth.',
    category: 'audio',
    tags: ['gamer-setup-essential', 'wireless-gaming', 'premium-audio', 'competitive-edge'],
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://steelseries.com/gaming-headsets/arctis-pro-wireless',
    brand: 'SteelSeries',
    insights: []
  },
  {
    id: 38, // New product for hosting
    title: 'Vitamix A3500 Ascent Series Blender',
    price: '$549.95',
    rating: '4.9',
    description: 'Professional-grade blender perfect for entertaining - smoothies, soups, and cocktails.',
    category: 'kitchen',
    tags: ['perfect-hosting-essential', 'premium-kitchen', 'entertaining-tool', 'versatile-appliance'],
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.vitamix.com/us/en_us/shop/ascent-a3500',
    brand: 'Vitamix',
    insights: []
  },
  {
    id: 39, // New product for hosting
    title: 'Le Creuset Signature Cast Iron Dutch Oven',
    price: '$449.95',
    rating: '4.8',
    description: 'Iconic French cookware perfect for hosting - from bread to braised dishes.',
    category: 'kitchen',
    tags: ['perfect-hosting-essential', 'premium-cookware', 'entertaining-staple', 'heirloom-quality'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&crop=center',
    affiliateUrl: 'https://www.lecreuset.com/signature-round-dutch-oven',
    brand: 'Le Creuset',
    insights: []
  },
  {
    id: 40,
    title: 'Dyson Purifier Hot+Cool HP07',
    price: '$749.99',
    rating: '4.1',
    description: 'Purifies and heats the whole room evenly. Cools you with powerful airflow. App compatible.',
    category: 'home',
    tags: ['premium', 'air-purifier', 'heater', 'smart-home', 'health-tech', 'trendsetter-pick', 'optimizer-pick', 'sanctuary-essential', 'wellness-retreat-essential'],
    image: 'https://images.unsplash.com/photo-1607460342465-134e77a0f5f4?w=600&h=600&fit=crop&crop=center', // Replaced potentially restricted Dyson image URL
    affiliateUrl: 'https://www.dyson.com/air-treatment/air-purifier-heaters/purifier-hot-cool-hp07/black-nickel',
    brand: 'Dyson',
    insights: [],
    optimizerInsight: 'Automatically senses and captures pollutants for healthier indoor air.',
    trendsetterTip: 'The intelligent air purifier that doubles as premium home decor.',
    whyBuyThis: '🌪️ CLEAN AIR REVOLUTION → HEPA H13 captures 99.97% of particles • Heats and cools year-round • App control from anywhere • Your sanctuary deserves pure air'
  },
];

// Persona definitions
const personas = [
  {
    id: 'trendsetter',
    name: 'The Trendsetter',
    icon: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', // New stylish person
    description: 'Always ahead of the curve, seeks stylish, innovative, and often premium products. Values aesthetics and being an early adopter.',
    color: '#EF4444', // Red
  },
  {
    id: 'optimizer',
    name: 'The Productivity Optimizer',
    icon: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces', // New focused person
    description: 'Focuses on efficiency, performance, and tools that enhance workflow. Values quality, reliability, and time-saving features.',
    color: '#06B6D4', // Cyan
  },
  {
    id: 'conscious',
    name: 'The Conscious Consumer',
    icon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', // New thoughtful person
    description: 'Prioritizes sustainability, ethical sourcing, and minimalist design. Values durability, natural materials, and brands with a positive impact.',
    color: '#10B981', // Emerald
  },
  {
    id: 'student', // Kept 'student' id for consistency with student-pick tags
    name: 'The Budget Savvy Student',
    icon: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop&crop=faces', // Existing student group image
    description: 'Looks for the best value, practical items for study and campus life, and enjoys student discounts and deals.',
    color: '#8B5CF6', // Purple
  },
];

// Life Moments definitions
const lifeMoments = [
  {
    id: 'new-arrival',
    name: 'Welcoming a New Arrival',
    icon: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop',
    description: 'Essential items for new parents and creating a nurturing environment for your little one.',
    color: '#F8BBD0', // Soft pink
  },
  {
    id: 'career-launch',
    name: 'Embarking on a Career',
    icon: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    description: 'Professional gear and essentials for starting a new job or advancing your career.',
    color: '#1E88E5', // Professional blue
  },
  {
    id: 'sanctuary',
    name: 'Creating a Sanctuary',
    icon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
    description: 'Transform your space into a comfortable, stylish haven that reflects your personality.',
    color: '#7E57C2', // Elegant purple
  },
  {
    id: 'golden-years',
    name: 'Embracing Golden Years',
    icon: 'https://images.unsplash.com/photo-1559137200-670cc1ec5ba9?w=100&h=100&fit=crop',
    description: 'Products for comfort, new hobbies, and embracing life\'s next adventure with grace.',
    color: '#FF7043', // Warm orange
  },
  {
    id: 'gamer-setup',
    name: 'The Ultimate Gamer Setup',
    icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
    description: 'Build the ultimate gaming station with premium gear for peak performance and immersion.',
    color: '#00E676', // Electric green
  },
  {
    id: 'sustainable-living',
    name: 'Sustainable Living Refresh',
    icon: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop',
    description: 'Eco-friendly choices that reduce your footprint while enhancing your lifestyle.',
    color: '#4CAF50', // Earth green
  },
  {
    id: 'wellness-retreat',
    name: 'Weekend Wellness Retreat',
    icon: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    description: 'Self-care essentials for relaxation, mindfulness, and personal rejuvenation.',
    color: '#9C27B0', // Wellness purple
  },
  {
    id: 'perfect-hosting',
    name: 'Hosting the Perfect Gathering',
    icon: 'https://images.unsplash.com/photo-1529543638269-d38c4d5a0d35?w=100&h=100&fit=crop',
    description: 'Everything you need to create memorable experiences for friends and family.',
    color: '#FF5722', // Festive orange-red
  },
];

// Add trending products for life moments
const trendingByLifeMoment = {
  'new-parent': [
    {
      id: 'trend-np-1',
      title: 'UPPAbaby VISTA V2 Stroller',
      price: 999.99,
      rating: 4.9,
      description: 'Expandable stroller system with premium features and multiple configurations.',
      link: 'https://uppababy.com',
      tags: ['baby', 'stroller', 'premium', 'newborn'],
      category: 'baby',
      whyBuy: 'The gold standard for growing families with exceptional build quality and versatility.',
      insights: [
        { label: 'Quality', value: 97, color: '#FF5757' },
        { label: 'Versatility', value: 95, color: '#32D74B' },
        { label: 'Ease of Use', value: 90, color: '#4E7CFF' },
        { label: 'Value', value: 82, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-np-2',
      title: 'Snoo Smart Bassinet',
      price: 1495,
      rating: 4.7,
      description: 'Smart bassinet that automatically responds to your baby to improve sleep.',
      link: 'https://www.happiestbaby.com',
      tags: ['baby', 'bassinet', 'smart', 'premium', 'sleep'],
      category: 'baby',
      whyBuy: 'Helps babies sleep longer with responsive technology that mimics the womb.',
      insights: [
        { label: 'Sleep Tech', value: 98, color: '#FF5757' },
        { label: 'Design', value: 95, color: '#32D74B' },
        { label: 'Safety', value: 96, color: '#4E7CFF' },
        { label: 'Value', value: 75, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-np-3',
      title: 'Owlet Smart Sock Plus',
      price: 299,
      rating: 4.6,
      description: 'Tracks baby\'s oxygen and heart rate while they sleep, with notifications.',
      link: 'https://owletcare.com',
      tags: ['baby', 'monitor', 'smart', 'health', 'sleep'],
      category: 'baby',
      whyBuy: 'Peace of mind for anxious parents with medical-grade monitoring technology.',
      insights: [
        { label: 'Accuracy', value: 93, color: '#FF5757' },
        { label: 'Ease of Use', value: 88, color: '#32D74B' },
        { label: 'Battery Life', value: 85, color: '#4E7CFF' },
        { label: 'Value', value: 83, color: '#BF5AF2' }
      ]
    }
  ],
  'graduation': [
    {
      id: 'trend-grad-1',
      title: 'iPad Air 11"',
      price: 599,
      rating: 4.8,
      description: 'Powerful and versatile tablet with M1 chip for productivity and creative work.',
      link: 'https://www.apple.com/ipad-air',
      tags: ['tech', 'tablet', 'gift', 'premium', 'productivity'],
      category: 'electronics',
      whyBuy: 'Perfect balance of power and portability for college or new job tasks.',
      insights: [
        { label: 'Performance', value: 92, color: '#FF5757' },
        { label: 'Portability', value: 95, color: '#32D74B' },
        { label: 'Display', value: 94, color: '#4E7CFF' },
        { label: 'Value', value: 86, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-grad-2',
      title: 'Bose QC Ultra Headphones',
      price: 429,
      rating: 4.7,
      description: 'Premium noise cancelling headphones with spatial audio and excellent comfort.',
      link: 'https://www.bose.com',
      tags: ['audio', 'noise-cancelling', 'premium', 'gift'],
      category: 'audio',
      whyBuy: 'Best-in-class noise cancellation perfect for focusing in shared spaces.',
      insights: [
        { label: 'Sound Quality', value: 96, color: '#FF5757' },
        { label: 'Noise Cancelling', value: 98, color: '#32D74B' },
        { label: 'Comfort', value: 95, color: '#4E7CFF' },
        { label: 'Battery Life', value: 90, color: '#BF5AF2' }
      ]
    }
  ],
  'home-setup': [
    {
      id: 'trend-home-1',
      title: 'Herman Miller Aeron Chair',
      price: 1695,
      rating: 4.9,
      description: 'Ergonomic office chair with adjustable posture support and breathable mesh.',
      link: 'https://www.hermanmiller.com',
      tags: ['office', 'chair', 'ergonomic', 'premium', 'comfort'],
      category: 'furniture',
      whyBuy: 'The gold standard for ergonomic seating, essential for all-day comfort.',
      insights: [
        { label: 'Comfort', value: 96, color: '#FF5757' },
        { label: 'Durability', value: 97, color: '#32D74B' },
        { label: 'Adjustability', value: 95, color: '#4E7CFF' },
        { label: 'Value', value: 80, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-home-2',
      title: 'LG 34" UltraWide Monitor',
      price: 799,
      rating: 4.7,
      description: 'Ultra-wide curved monitor with high resolution for immersive multitasking.',
      link: 'https://www.lg.com',
      tags: ['monitor', 'tech', 'productivity', 'premium'],
      category: 'electronics',
      whyBuy: 'Significantly boosts productivity with screen space for multiple applications.',
      insights: [
        { label: 'Display Quality', value: 93, color: '#FF5757' },
        { label: 'Screen Size', value: 96, color: '#32D74B' },
        { label: 'Connectivity', value: 90, color: '#4E7CFF' },
        { label: 'Value', value: 87, color: '#BF5AF2' }
      ]
    }
  ],
  'travel-prep': [
    {
      id: 'trend-travel-1',
      title: 'Away The Medium Suitcase',
      price: 345,
      rating: 4.8,
      description: 'Durable hardside suitcase with 360° spinner wheels and built-in battery.',
      link: 'https://www.awaytravel.com',
      tags: ['travel', 'luggage', 'premium', 'portable'],
      category: 'travel',
      whyBuy: 'Perfect checked luggage size with thoughtful features and lifetime warranty.',
      insights: [
        { label: 'Durability', value: 94, color: '#FF5757' },
        { label: 'Design', value: 96, color: '#32D74B' },
        { label: 'Features', value: 92, color: '#4E7CFF' },
        { label: 'Value', value: 88, color: '#BF5AF2' }
      ]
    },
    {
      id: 'trend-travel-2',
      title: 'Apple AirTag (4 Pack)',
      price: 99,
      rating: 4.7,
      description: 'Precision finding devices to track and locate your important items.',
      link: 'https://www.apple.com/airtag',
      tags: ['travel', 'tech', 'accessories', 'tracking'],
      category: 'electronics',
      whyBuy: 'Peace of mind for all your valuable luggage and items when traveling.',
      insights: [
        { label: 'Tracking Accuracy', value: 95, color: '#FF5757' },
        { label: 'Battery Life', value: 90, color: '#32D74B' },
        { label: 'Ecosystem', value: 98, color: '#4E7CFF' },
        { label: 'Value', value: 85, color: '#BF5AF2' }
      ]
    }
  ]
};

// Add mood board aesthetics and social bundles to the top level data
const moodBoards = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    emoji: '◻️',
    color: '#000000',
    cursiveDescription: 'where less becomes more, and silence speaks volumes',
    philosophyText: 'The art of intentional living through curated simplicity',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(40,40,40,0.8))'
  },
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    emoji: '🌿',
    color: '#6B8E23',
    cursiveDescription: 'embracing the gentle rhythm of nature\'s timeless embrace',
    philosophyText: 'Romantic nostalgia meets sustainable living in perfect harmony',
    coverImage: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(107,142,35,0.7), rgba(85,107,47,0.8))'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '⚡',
    color: '#FF0080',
    cursiveDescription: 'future noir aesthetics dancing with neon dreams',
    philosophyText: 'High-tech rebellion meets dark urban sophistication',
    coverImage: 'https://images.unsplash.com/photo-1518709414923-fcf25c3432c1?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(255,0,128,0.8), rgba(128,0,255,0.7))'
  },
  {
    id: 'clean-girl',
    name: 'Clean Girl',
    emoji: '✨',
    color: '#F5F5DC',
    cursiveDescription: 'effortless beauty in its most authentic, radiant form',
    philosophyText: 'Understated elegance that celebrates natural confidence',
    coverImage: 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(245,245,220,0.9), rgba(250,240,230,0.8))'
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    emoji: '📚',
    color: '#8B4513',
    cursiveDescription: 'intellectual romance wrapped in ivy-covered mystery',
    philosophyText: 'Scholarly elegance meets gothic sophistication',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(139,69,19,0.8), rgba(85,60,42,0.9))'
  },
  {
    id: 'soft-luxury',
    name: 'Soft Luxury',
    emoji: '🤍',
    color: '#F8F6F0',
    cursiveDescription: 'whispered opulence in textures that embrace the soul',
    philosophyText: 'Refined indulgence through tactile elegance and muted grandeur',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop',
    gradient: 'linear-gradient(135deg, rgba(248,246,240,0.95), rgba(240,235,225,0.9))'
  }
];

const socialBundles = [
  {
    id: 'travel-essentials',
    title: 'Travel Essentials',
    creator: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format',
      verified: true
    },
    likes: 3426,
    saves: 874,
    products: [
      mockProducts[7], // Sony Headphones
      trendingByLifeMoment['travel-prep'][0], // Away Suitcase
      trendingByLifeMoment['travel-prep'][1] // Apple AirTag
    ],
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500&auto=format'
  },
  {
    id: 'wfh-setup',
    title: 'Dream WFH Setup',
    creator: {
      name: 'Mia Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format',
      verified: true
    },
    likes: 5218,
    saves: 1284,
    products: [
      mockProducts[0], // MacBook Pro
      trendingByLifeMoment['home-setup'][0], // Herman Miller chair
      trendingByLifeMoment['home-setup'][1] // LG Monitor
    ],
    coverImage: 'https://images.unsplash.com/photo-1605565348518-bef3e7d6fed8?q=80&w=500&auto=format'
  },
  {
    id: 'new-parent',
    title: 'New Parent Starter Pack',
    creator: {
      name: 'Taylor Wilson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format',
      verified: false
    },
    likes: 2189,
    saves: 956,
    products: [
      trendingByLifeMoment['new-parent'][0], // Stroller
      trendingByLifeMoment['new-parent'][1], // Bassinet
      trendingByLifeMoment['new-parent'][2] // Baby monitor
    ],
    coverImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=500&auto=format'
  }
];

// Add missing openExternalLink function
const openExternalLink = (url) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// Add trending data for TrendRadar
const trendRadarData = [
  {
    id: 1,
    title: 'Sony WH-1000XM5',
    category: 'ELECTRONICS',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop&crop=center', // Actual Sony headphones image
    trendChange: '↗ 28%',
    isViral: true,
    brandUrl: 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-l?mg=shopping&gad_source=1&gad_campaignid=22224130485&gbraid=0AAAAABiDjZjIa5DKjAugccBx3T6KuLFCb&gclid=CjwKCAjwi-DBBhA5EiwAXOHsGWew3GWTaHne6281N8_BDpE5qZdrbJcIgxWOT5Uz-yy9oisBKpJKBRoCdkgQAvD_BwE&gclsrc=aw.ds'
  },
  {
    id: 2,
    title: 'Dyson Air Purifier',
    category: 'HOME',
    image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/air-treatment/purifiers/hp07/dyson-purifier-hot-cool-hp07-black-nickel-hero-01.png?wid=600&hei=600&fmt=png-alpha', // Official Dyson product image
    trendChange: '↗ 16%',
    isViral: false,
    brandUrl: 'https://www.dyson.com/air-treatment/air-purifier-heaters/purifier-hot-cool-hp07/black-nickel'
  },
  {
    id: 3,
    title: 'Away Luggage',
    category: 'TRAVEL',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&crop=center',
    trendChange: '↗ 45%',
    isViral: true
    // No brandUrl - will search for product instead of direct link
  },
  {
    id: 4,
    title: 'Kindle Paperwhite',
    category: 'READING',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center',
    trendChange: '↗ 12%',
    isViral: false,
    brandUrl: 'https://www.amazon.com/kindle-paperwhite/dp/B08KTZ8249'
  }
];

// Product categories for visual entry points
const productCategories = [
  {
    id: 'tech',
    name: 'Technology',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
    color: '#6366F1',
    description: 'innovation meets intentional design'
  },
  {
    id: 'audio',
    name: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    color: '#8B5CF6',
    description: 'sound engineered for the discerning ear'
  },
  {
    id: 'home',
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    color: '#06B6D4',
    description: 'spaces that nurture the soul'
  },
  {
    id: 'travel',
    name: 'Travel',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop',
    color: '#10B981',
    description: 'wanderlust essentials for the mindful explorer'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
    color: '#F59E0B',
    description: 'wellness tools for the devoted practitioner'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
    color: '#EF4444',
    description: 'ritual essentials for authentic self-care'
  },
];

// InsightBar component for visualizing product metrics
const InsightBar = ({ label, value, color }) => {
  return (
    <View style={styles.insightContainer}>
      <Text style={styles.insightLabel}>{label}</Text>
      <View style={styles.insightBarBackground}>
        <View 
          style={[
            styles.insightBarFill, 
            { width: `${value}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.insightValue}>{value}</Text>
    </View>
  );
};

// Product Preview simulation
const ProductPreviewOverlay = ({ product, visible, onClose }) => {
  const [previewStatus, setPreviewStatus] = useState('loading'); // 'loading', 'ready', 'error'
  
  // Preview images based on product category
  const getCategoryPreviewImage = (category) => {
    switch(category) {
      case 'laptop':
        return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format';
      case 'baby':
        return 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format';
      case 'wearables':
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format';
      case 'audio':
        return 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&auto=format';
      default:
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format';
    }
  };
  
  useEffect(() => {
    if (visible) {
      setPreviewStatus('loading');
      // Simulate loading preview
      setTimeout(() => {
        setPreviewStatus('ready');
      }, 800);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <View style={styles.previewOverlay}>
      <View style={styles.previewContent}>
        <Text style={styles.previewTitle}>
          {previewStatus === 'loading' ? 'Loading Preview...' : 
           previewStatus === 'ready' ? 'Product Preview' : 
           'Preview Unavailable'}
        </Text>
        
        <View style={styles.previewImageContainer}>
          {previewStatus === 'loading' ? (
            <View style={styles.previewLoading}>
              <Text style={styles.previewLoadingText}>Preparing preview...</Text>
            </View>
          ) : previewStatus === 'ready' ? (
            <>
              <Image 
                source={{ uri: getCategoryPreviewImage(product.category) }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <View style={styles.previewProductInfo}>
                <Text style={styles.previewProductTitle}>{product.title}</Text>
                <Text style={styles.previewProductPrice}>${product.price}</Text>
              </View>
            </>
          ) : (
            <View style={styles.previewError}>
              <Text style={styles.previewErrorEmoji}>⚠️</Text>
              <Text style={styles.previewErrorText}>
                Unable to load preview. Please try again.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.previewActions}>
          <TouchableOpacity 
            style={styles.previewCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.previewCloseText}>Close</Text>
          </TouchableOpacity>
          
          {previewStatus === 'ready' && (
            <TouchableOpacity 
              style={styles.previewBuyButton}
              onPress={() => {
                onClose();
                setTimeout(() => openExternalLink(product.link), 300);
              }}
            >
              <Text style={styles.previewBuyText}>Buy Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Add WebXR AR integration
const WebXRARViewer = ({ product, visible, onClose }) => {
  const [arSupported, setArSupported] = useState(false);
  const [arStatus, setArStatus] = useState('checking'); // 'checking', 'supported', 'unsupported', 'running'
  const arContainerRef = useRef(null);
  
  // Check for WebXR support on component mount
  useEffect(() => {
    if (visible) {
      checkARSupport();
    }
  }, [visible]);
  
  // Check if AR is supported on this device/browser
  const checkARSupport = () => {
    setArStatus('checking');
    
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => {
          setArSupported(supported);
          setArStatus(supported ? 'supported' : 'unsupported');
        })
        .catch(error => {
          console.error('Error checking AR support:', error);
          setArSupported(false);
          setArStatus('unsupported');
        });
    } else {
      setArSupported(false);
      setArStatus('unsupported');
    }
  };
  
  // Start AR session
  const startARSession = () => {
    if (!arSupported) return;
    
    setArStatus('running');
    
    // WebXR session initialization would go here
    // This requires Three.js or another WebGL library to handle the rendering
    // For demo purposes, we'll simulate the session
    
    // In a real implementation, you would:
    // 1. Create a WebGL context
    // 2. Initialize Three.js scene
    // 3. Request an immersive-ar session
    // 4. Set up the AR hit testing and model placement
    
    // For this demo, we'll just show a placeholder
    setTimeout(() => {
      alert('AR session would start here with a 3D model of the product.');
    }, 1000);
  };
  
  // Get appropriate model URL based on product category
  const getARModelURL = (category) => {
    // In a real app, these would be links to actual 3D models (.glb or .usdz files)
    switch(category) {
      case 'laptop':
        return 'https://example.com/models/laptop.glb';
      case 'baby':
        return 'https://example.com/models/baby_product.glb';
      case 'wearables':
        return 'https://example.com/models/watch.glb';
      case 'audio':
        return 'https://example.com/models/headphones.glb';
      default:
        return 'https://example.com/models/generic.glb';
    }
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.arOverlay}>
      <View style={styles.arContent}>
        <Text style={styles.arTitle}>
          {arStatus === 'checking' ? 'Checking AR Capability...' : 
           arStatus === 'supported' ? 'AR Ready' : 
           arStatus === 'running' ? 'AR Session Active' :
           'AR Not Supported'}
        </Text>
        
        <View 
          style={styles.arViewport}
          ref={arContainerRef}
        >
          {arStatus === 'checking' ? (
            <View style={styles.arLoading}>
              <Text style={styles.arLoadingText}>Initializing AR...</Text>
            </View>
          ) : arStatus === 'supported' ? (
            <View style={styles.arReadyContainer}>
              <Text style={styles.arEmoji}>
                {product.category === 'laptop' ? '💻' : 
                 product.category === 'baby' ? '👶' : 
                 product.category === 'wearables' ? '⌚' :
                 product.category === 'audio' ? '🎧' : '📱'}
              </Text>
              <Text style={styles.arMessage}>
                Your device supports AR. Tap Start to view {product.title} in your space.
              </Text>
              <TouchableOpacity 
                style={styles.arStartButton}
                onPress={startARSession}
              >
                <Text style={styles.arStartButtonText}>Start AR Experience</Text>
              </TouchableOpacity>
            </View>
          ) : arStatus === 'running' ? (
            <View style={styles.arActiveContainer}>
              <Text style={styles.arActiveText}>
                AR Session Active. Move your device to scan the environment.
              </Text>
            </View>
          ) : (
            <View style={styles.arUnsupportedContainer}>
              <Text style={styles.arErrorEmoji}>⚠️</Text>
              <Text style={styles.arErrorText}>
                AR is not supported on your device or browser. Try using the latest Chrome on Android or Safari on iOS.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.arActions}>
          <TouchableOpacity 
            style={styles.arCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.arCloseText}>Close AR</Text>
          </TouchableOpacity>
          
          {arStatus === 'supported' && (
            <TouchableOpacity 
              style={styles.arHelpButton}
              onPress={() => {
                alert('AR Help: Make sure you have good lighting and a clear space. Move your device around to let it scan the environment before placing objects.');
              }}
            >
              <Text style={styles.arHelpText}>AR Tips</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Add virtual try-on functionality for apparel
const VirtualTryOn = ({ product, visible, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Reset state when visibility changes
  useEffect(() => {
    if (!visible) {
      setSelectedImage(null);
      setProcessedImage(null);
      setError(null);
    }
  }, [visible]);
  
  // Handle file selection for try-on
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }
    
    // Create a preview URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setError(null);
    
    // In a real app, you would upload this to a server for processing
    // For demo, we'll simulate the process
    processImage(imageUrl);
  };
  
  // Simulate image processing for virtual try-on
  const processImage = (imageUrl) => {
    setProcessingImage(true);
    
    // In a real app, this would be an API call to an AI model
    // that overlays the product on the user's image
    setTimeout(() => {
      // For demo, we'll just return a mock processed image
      // In reality, this would come from a ML model that does virtual try-on
      setProcessedImage(getVirtualTryOnImage(product.category));
      setProcessingImage(false);
    }, 2000);
  };
  
  // Get a mock processed image for the demo
  const getVirtualTryOnImage = (category) => {
    // These would be actual processed images from the ML model
    // For demo, we're using static images
    switch(category) {
      case 'clothing':
        return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format';
      case 'shoes':
        return 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&auto=format';
      case 'accessories':
        return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format';
      default:
        return 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format';
    }
  };
  
  // Trigger file input click
  const selectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Take a photo using webcam (simplified for demo)
  const takePhoto = () => {
    alert('In a real app, this would open your camera to take a photo for virtual try-on.');
    // For demo, we'll just use a mock image
    setSelectedImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format');
    processImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format');
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.tryOnOverlay}>
      <View style={styles.tryOnContent}>
        <Text style={styles.tryOnTitle}>
          Virtual Try-On: {product.title}
        </Text>
        
        <View style={styles.tryOnWorkspace}>
          {!selectedImage ? (
            // Image selection UI
            <View style={styles.tryOnUploadArea}>
              <Text style={styles.tryOnInstructions}>
                Upload a photo or take a picture to see how this item looks on you.
              </Text>
              
              <View style={styles.tryOnButtonsRow}>
                <TouchableOpacity 
                  style={styles.tryOnButton}
                  onPress={selectImage}
                >
                  <Text style={styles.tryOnButtonText}>Upload Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.tryOnButton}
                  onPress={takePhoto}
                >
                  <Text style={styles.tryOnButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
              
              {error && (
                <Text style={styles.tryOnError}>{error}</Text>
              )}
              
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </View>
          ) : processingImage ? (
            // Processing indicator
            <View style={styles.tryOnProcessing}>
              <Text style={styles.tryOnProcessingText}>
                Processing your image...
              </Text>
              <View style={styles.tryOnLoader} />
            </View>
          ) : processedImage ? (
            // Display processed image with try-on
            <View style={styles.tryOnResult}>
              <Image 
                source={{ uri: processedImage }}
                style={styles.tryOnResultImage}
                resizeMode="contain"
              />
              <Text style={styles.tryOnResultCaption}>
                Here's how {product.title} looks on you!
              </Text>
              <View style={styles.tryOnActionRow}>
                <TouchableOpacity 
                  style={styles.tryOnShareButton}
                  onPress={() => alert('Share functionality would be implemented here.')}
                >
                  <Text style={styles.tryOnShareButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tryOnTryAgainButton}
                  onPress={() => {
                    setSelectedImage(null);
                    setProcessedImage(null);
                  }}
                >
                  <Text style={styles.tryOnTryAgainButtonText}>Try Another Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Fallback
            <View style={styles.tryOnError}>
              <Text>Something went wrong. Please try again.</Text>
            </View>
          )}
        </View>
        
        <View style={styles.tryOnFooter}>
          <TouchableOpacity 
            style={styles.tryOnCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.tryOnCloseButtonText}>Close</Text>
          </TouchableOpacity>
          
          {processedImage && (
            <TouchableOpacity 
              style={styles.tryOnBuyButton}
              onPress={() => {
                onClose();
                setTimeout(() => openExternalLink(product.link), 300);
              }}
            >
              <Text style={styles.tryOnBuyButtonText}>Buy This Look</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Update the ProductCard component to use WebXRARViewer
const ProductCard = ({ product, onPress, isTrending = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleARView = () => {
    setShowARViewer(true);
  };

  const handleProductPreview = () => {
    setShowProductPreview(true);
  };

  const handleVirtualTryOn = () => {
    setShowVirtualTryOn(true);
  };

  const handleShopOnBrand = () => {
    if (product.affiliateUrl) {
      openExternalLink(product.affiliateUrl);
    }
  };

  const handleShopWithAgent = () => {
    // Placeholder for "Shop with Curator Agent" functionality
    alert('The Curator Agent will assist you with this purchase soon!');
  };

  return (
    <View style={[styles.productCard, isTrending && styles.trendingProductCard]}>
      {!isFlipped ? (
        <View style={styles.cardContent}>
          <View style={styles.cardImageContainer}>
            <Image 
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            </View>
            <TouchableOpacity style={styles.previewButton} onPress={handleProductPreview}>
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.brandText}>by {product.brand}</Text>
          </View>

          {/* Updated Card Actions with new buttons */}
          <View style={styles.productCardButtonContainer}>
            <TouchableOpacity
              style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
              onPress={handleShopOnBrand}
            >
              <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
              onPress={handleShopWithAgent}
            >
              <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardActions}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleFlip}>
                <Text style={styles.actionButtonText}>ℹ️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleARView}>
                <Text style={styles.actionButtonText}>👁️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleVirtualTryOn}>
                <Text style={styles.actionButtonText}>👤</Text>
              </TouchableOpacity>
            </View>
            {/* Old Buy Now button removed/commented out
            <TouchableOpacity style={styles.buyNowButton} onPress={handleShopOnBrand}>
              <Text style={styles.buyNowButtonText}>Buy Now</Text>
            </TouchableOpacity>
            */}
          </View>
        </View>
      ) : (
        <View style={styles.cardContentBack}>
          <TouchableOpacity style={styles.backButton} onPress={handleFlip}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.backProductTitle}>{product.title}</Text>
          <Text style={styles.backProductPrice}>{product.price}</Text>
          
          <View style={styles.highlightsContainer}>
            <Text style={styles.highlightsTitle}>Why Buy This?</Text>
            <Text style={styles.highlightsText}>{product.description}</Text>
          </View>
          
          <TouchableOpacity style={styles.buyNowButton} onPress={handleShopOnBrand}>
            <Text style={styles.buyNowButtonText}>Buy on {product.brand}</Text>
          </TouchableOpacity>
        </View>
      )}

      <WebXRARViewer 
        product={product}
        visible={showARViewer}
        onClose={() => setShowARViewer(false)}
      />

      <ProductPreviewOverlay 
        product={product}
        visible={showProductPreview}
        onClose={() => setShowProductPreview(false)}
      />

      <VirtualTryOn 
        product={product}
        visible={showVirtualTryOn}
        onClose={() => setShowVirtualTryOn(false)}
      />
    </View>
  );
};

// Add Visual Search feature
const VisualSearch = ({ visible, onClose, onSearch }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [analyzeStage, setAnalyzeStage] = useState('initial'); // initial, analyzing, detected, searching
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Reset state when visibility changes
  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);
  
  // Reset all state
  const resetState = () => {
    setSelectedImage(null);
    setDetectedObjects([]);
    setSelectedObjects([]);
    setAnalyzeStage('initial');
    setError(null);
  };
  
  // Handle file selection for visual search
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }
    
    // Create a preview URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setAnalyzeStage('analyzing');
    setError(null);
    
    // In a real app, you would upload this to a server for object detection
    // For demo, we'll simulate the process
    analyzeImage(imageUrl);
  };
  
  // Simulate image analysis for object detection
  const analyzeImage = (imageUrl) => {
    // In a real app, this would be an API call to an AI model
    // that detects objects in the image
    setTimeout(() => {
      // Simulate detected objects
      const mockObjects = [
        { id: '1', label: 'Shirt', confidence: 0.92, boundingBox: { x: 120, y: 80, width: 200, height: 220 } },
        { id: '2', label: 'Jeans', confidence: 0.88, boundingBox: { x: 130, y: 320, width: 180, height: 250 } },
        { id: '3', label: 'Shoes', confidence: 0.85, boundingBox: { x: 150, y: 580, width: 140, height: 90 } },
        { id: '4', label: 'Watch', confidence: 0.78, boundingBox: { x: 350, y: 180, width: 60, height: 60 } }
      ];
      setDetectedObjects(mockObjects);
      setAnalyzeStage('detected');
    }, 2000);
  };
  
  // Handle object selection toggle
  const toggleObjectSelection = (objectId) => {
    if (selectedObjects.includes(objectId)) {
      setSelectedObjects(selectedObjects.filter(id => id !== objectId));
    } else {
      setSelectedObjects([...selectedObjects, objectId]);
    }
  };
  
  // Trigger file input click
  const selectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Take a screenshot
  const takeScreenshot = () => {
    alert('In a real app, this would capture a screenshot of your current screen.');
    // For demo, we'll just use a mock image
    setSelectedImage('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format');
    setAnalyzeStage('analyzing');
    analyzeImage('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format');
  };
  
  // Perform search with selected objects
  const performSearch = () => {
    if (selectedObjects.length === 0) {
      alert('Please select at least one item to search for.');
      return;
    }
    
    setAnalyzeStage('searching');
    
    // Get selected object labels
    const selectedLabels = detectedObjects
      .filter(obj => selectedObjects.includes(obj.id))
      .map(obj => obj.label);
    
    // In a real app, this would trigger a search with the selected objects
    setTimeout(() => {
      // Call the search callback with the selected objects
      onSearch && onSearch(selectedLabels);
      onClose();
    }, 1000);
  };
  
  if (!visible) return null;
  
  return (
    <View style={styles.visualSearchOverlay}>
      <View style={styles.visualSearchContent}>
        <Text style={styles.visualSearchTitle}>
          Visual Search
        </Text>
        
        <View style={styles.visualSearchWorkspace}>
          {analyzeStage === 'initial' ? (
            // Image selection UI
            <View style={styles.visualSearchUploadArea}>
              <Text style={styles.visualSearchInstructions}>
                Upload a photo or take a screenshot to search for similar items.
              </Text>
              
              <View style={styles.visualSearchButtonsRow}>
                <TouchableOpacity 
                  style={styles.visualSearchButton}
                  onPress={selectImage}
                >
                  <Text style={styles.visualSearchButtonText}>Upload Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.visualSearchButton}
                  onPress={takeScreenshot}
                >
                  <Text style={styles.visualSearchButtonText}>Take Screenshot</Text>
                </TouchableOpacity>
              </View>
              
              {error && (
                <Text style={styles.visualSearchError}>{error}</Text>
              )}
              
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </View>
          ) : analyzeStage === 'analyzing' ? (
            // Analyzing state
            <View style={styles.visualSearchAnalyzing}>
              {selectedImage && (
                <Image 
                  source={{ uri: selectedImage }}
                  style={styles.visualSearchImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.visualSearchAnalyzingOverlay}>
                <Text style={styles.visualSearchAnalyzingText}>
                  Analyzing image...
                </Text>
                <View style={styles.visualSearchLoader} />
              </View>
            </View>
          ) : analyzeStage === 'detected' ? (
            // Object selection state
            <View style={styles.visualSearchDetected}>
              <View style={styles.visualSearchImageContainer}>
                {selectedImage && (
                  <Image 
                    source={{ uri: selectedImage }}
                    style={styles.visualSearchImage}
                    resizeMode="contain"
                  />
                )}
                
                {/* Object bounding boxes */}
                {detectedObjects.map(obj => (
                  <TouchableOpacity
                    key={obj.id}
                    style={[
                      styles.visualSearchBoundingBox,
                      {
                        left: obj.boundingBox.x,
                        top: obj.boundingBox.y,
                        width: obj.boundingBox.width,
                        height: obj.boundingBox.height,
                        borderColor: selectedObjects.includes(obj.id) ? '#4CAF50' : '#FF9800',
                        backgroundColor: selectedObjects.includes(obj.id) ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'
                      }
                    ]}
                    onPress={() => toggleObjectSelection(obj.id)}
                  >
                    <Text style={styles.visualSearchObjectLabel}>
                      {obj.label} ({Math.round(obj.confidence * 100)}%)
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.visualSearchSelectionInstructions}>
                <Text style={styles.visualSearchSelectionText}>
                  Tap on the items you want to search for
                </Text>
                <Text style={styles.visualSearchSelectedCount}>
                  {selectedObjects.length} item(s) selected
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.visualSearchActionButton,
                  selectedObjects.length === 0 && styles.visualSearchActionButtonDisabled
                ]}
                onPress={performSearch}
                disabled={selectedObjects.length === 0}
              >
                <Text style={styles.visualSearchActionButtonText}>
                  Search for Selected Items
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Searching state
            <View style={styles.visualSearchSearching}>
              <Text style={styles.visualSearchSearchingText}>
                Searching for similar products...
              </Text>
              <View style={styles.visualSearchLoader} />
            </View>
          )}
        </View>
        
        <View style={styles.visualSearchFooter}>
          <TouchableOpacity 
            style={styles.visualSearchCloseButton} 
            onPress={onClose}
          >
            <Text style={styles.visualSearchCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {analyzeStage !== 'initial' && analyzeStage !== 'searching' && (
            <TouchableOpacity 
              style={styles.visualSearchResetButton}
              onPress={resetState}
            >
              <Text style={styles.visualSearchResetButtonText}>Start Over</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Update the main App component
export default function App() {
  const { width: screenWidth } = useWindowDimensions(); // Get screen width here

  // State for user selections
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedLifeMoment, setSelectedLifeMoment] = useState(null);
  
  // State for app functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showPersonaPanel, setShowPersonaPanel] = useState(false);
  const [showLifeMomentPanel, setShowLifeMomentPanel] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showTrendingSocial, setShowTrendingSocial] = useState(false);
  
  // State for AI Curation
  const [showAiCurateView, setShowAiCurateView] = useState(null); // null, 'form', 'results'
  const [aiSelectedBrands, setAiSelectedBrands] = useState([]);
  const [aiPersonaStyle, setAiPersonaStyle] = useState('');
  const [aiPersonaBudget, setAiPersonaBudget] = useState(''); // e.g., '$', '$$', '$$$'
  const [aiLookingFor, setAiLookingFor] = useState('');
  const [aiGeneratedProducts, setAiGeneratedProducts] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState(null); // New state for AI errors
  
  // Extract unique brand names for AI Curation brand selection
  const availableBrands = [...new Set(mockProducts.map(p => p.brand))].sort();
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  
  // Initialize products on component mount
  useEffect(() => {
    // Start with all products for discovery
    setProducts(sortProducts([...mockProducts]));
  }, []);
  
  // Apply personalization when persona or life moment changes
  useEffect(() => {
    if (selectedPersona || selectedLifeMoment) {
      // Apply personalization by sorting the products
      setProducts(sortProducts([...mockProducts]));
    }
  }, [selectedPersona, selectedLifeMoment]);
  
  // Add browser history management
  useEffect(() => {
    const handlePopState = (event) => {
      // Handle browser back button
      setSearchQuery('');
      setSelectedPersona(null);
      setSelectedLifeMoment(null);
      setShowTrendingSocial(false);
      setShowAiCurateView(null); // Reset AI curate view
      setAiSelectedBrands([]);
      setAiPersonaStyle('');
      setAiPersonaBudget('');
      setAiLookingFor('');
      // setAiGeneratedProducts([]); // Keep AI generated products to avoid re-fetching if user navigates back and forth quickly to results
      setErrorMessage(null);

      const pageState = event.state ? event.state.page : 'discovery';

      switch (pageState) {
        case 'discovery':
          setIsDiscoveryMode(true);
          setProducts(sortProducts([...mockProducts]));
          break;
        case 'trending':
          setShowTrendingSocial(true);
          setIsDiscoveryMode(false);
          break;
        case 'aiCurateForm':
          setShowAiCurateView('form');
          setIsDiscoveryMode(false);
          break;
        case 'aiCurateResults':
          setShowAiCurateView('results');
          setIsDiscoveryMode(false);
          // Products should already be in aiGeneratedProducts state
          break;
        case 'products':
          setIsDiscoveryMode(false);
          // Attempt to restore previous product view context
          if (event.state.persona) {
            const foundPersona = personas.find(p => p.id === event.state.persona);
            if (foundPersona) handlePersonaSelect(foundPersona, false); // false to prevent history push
          } else if (event.state.lifeMoment) {
            const foundMoment = lifeMoments.find(m => m.id === event.state.lifeMoment);
            if (foundMoment) handleLifeMomentSelect(foundMoment, false);
          } else if (event.state.searchQuery) {
            setSearchQuery(event.state.searchQuery);
            handleSearch(false);
          } else {
            // Fallback if specific product context is missing, show all products
            setProducts(sortProducts([...mockProducts]));
          }
          break;
        default:
          setIsDiscoveryMode(true);
          setProducts(sortProducts([...mockProducts]));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      // Push initial state only if not already on a specific view from a direct URL or refresh
      if (isDiscoveryMode && !window.location.search) {
         window.history.replaceState({ page: 'discovery' }, '', window.location.pathname);
      } else if (showTrendingSocial && !window.location.search.includes('view=trending')) {
        window.history.replaceState({ page: 'trending' }, '', '?view=trending');
      } else if (showAiCurateView === 'form' && !window.location.search.includes('view=ai-curate')) {
        window.history.replaceState({ page: 'aiCurateForm' }, '', '?view=ai-curate');
      } else if (showAiCurateView === 'results' && !window.location.search.includes('view=ai-results')) {
        window.history.replaceState({ page: 'aiCurateResults' }, '', '?view=ai-results');
      } else if (!isDiscoveryMode && !showTrendingSocial && !showAiCurateView && !window.location.search) {
         // Generic product view, could be from persona, lifemoment or search
         // The individual handlers will push more specific states
         window.history.replaceState({ page: 'products' }, '', window.location.pathname); 
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [isDiscoveryMode, showTrendingSocial, showAiCurateView]); // Add showAiCurateView to dependency array

  // Update browser history when navigation occurs (Simplified)
  // Specific pushState calls are now within the action handlers themselves (handleSearch, handlePersonaSelect, Start AI Curation button, etc.)
  // This useEffect is now mainly for initial state or direct URL handling via popstate.

  const handleSearch = (searchTerm, pushHistory = true) => {
    if (!searchTerm.trim()) return;
    setSearchQuery(searchTerm); // Set search query state
    setIsLoadingAnimation(true);
    setIsDiscoveryMode(false);
    setShowTrendingSocial(false);
    setShowAiCurateView(null);

    if (pushHistory && typeof window !== 'undefined' && window.history && window.history.pushState) {
      window.history.pushState({ page: 'products', searchQuery: searchTerm }, '', `?search=${encodeURIComponent(searchTerm)}`);
    }

    setTimeout(() => {
      const searchResults = mockProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      setProducts(sortProducts(searchResults.length > 0 ? searchResults : mockProducts));
      setIsLoadingAnimation(false);
      
      if (searchResults.length === 0) {
        setErrorMessage('No products found. Try a different search term.');
      }
    }, 1000);
  };
  
  // Calculate product relevance score based on selected persona and life moment
  const getRelevanceScore = (product) => {
    let score = 1;
    
    // Apply persona-based scoring
    if (selectedPersona) {
      // Student persona - Prioritize budget-friendly options with strong emphasis on price
      if (selectedPersona.id === 'student') {
        // Heavy penalty for expensive products
        if (product.price > 1500) {
          score -= 5; // Significant penalty for high-priced products
        } else if (product.price < 1000) {
          score += 4; // Big boost for affordable products
        }
        
        // Additional boosts for student-friendly tags
        if (product.tags.includes('student')) score += 3;
        if (product.tags.includes('budget')) score += 2.5;
        if (product.tags.includes('entry-level')) score += 2;
        if (product.tags.includes('portable')) score += 1.5;
        
        // Value insight boost for student persona
        const valueInsight = product.insights.find(i => i.label === 'Value');
        if (valueInsight && valueInsight.value > 85) {
          score += 2;
        }
      }
      // Traveler persona - Focus on portability
      else if (selectedPersona.id === 'traveler') {
        // Prioritize lightweight and portable products
        if (product.tags.includes('portable')) score += 3;
        if (product.tags.includes('lightweight')) score += 2.5;
        
        // Battery life is important for travelers
        const batteryInsight = product.insights.find(i => i.label === 'Battery Life');
        if (batteryInsight && batteryInsight.value > 90) {
          score += 2;
        }
      }
      // Creative Pro persona - Focus on performance
      else if (selectedPersona.id === 'creative') {
        // Prioritize high-performance products
        if (product.tags.includes('pro')) score += 2;
        if (product.tags.includes('premium')) score += 1.5;
        if (product.tags.includes('creative')) score += 3;
        
        // Performance insight boost
        const performanceInsight = product.insights.find(i => i.label === 'Performance');
        if (performanceInsight && performanceInsight.value > 90) {
          score += 2.5;
        }
      }
      // Business Pro persona - Balance of performance and reliability
      else if (selectedPersona.id === 'business') {
        // Prioritize reliable business-oriented products
        if (product.tags.includes('pro')) score += 1.5;
        if (product.tags.includes('balanced')) score += 2;
        
        // Look for good all-around performance
        let allRoundScore = 0;
        let insightCount = 0;
        
        product.insights.forEach(insight => {
          allRoundScore += insight.value;
          insightCount++;
        });
        
        // Reward well-balanced products
        if (insightCount > 0 && (allRoundScore / insightCount) > 85) {
          score += 2;
        }
      }
    }
    
    // Apply life moment based scoring
    if (selectedLifeMoment) {
      // Strong boost for primary category match
      if (selectedLifeMoment.primaryCategory && product.category === selectedLifeMoment.primaryCategory) {
        score += 4;
      }
      
      // Apply tag boosts based on life moment
      product.tags.forEach(tag => {
        const momentTagWeights = selectedLifeMoment.tagWeights || {};
        if (momentTagWeights[tag]) {
          score += momentTagWeights[tag];
        }
      });
    }
    
    return score;
  };
  
  // Sort products based on relevance score
  const sortProducts = (products) => {
    if (!products || !Array.isArray(products)) return [];
    
    // Create a copy to avoid mutating the original array
    return [...products].sort((a, b) => {
      const scoreA = getRelevanceScore(a);
      const scoreB = getRelevanceScore(b);
      
      // Primary sort by relevance score
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      
      // Secondary sort by rating (higher is better)
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      
      // Tertiary sort by price (lower is better)
      return a.price - b.price;
    });
  };
  
  // Handle persona selection
  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setShowPersonaPanel(false); // Assuming this closes a panel
    setIsLoadingAnimation(true);
    setErrorMessage(null);

    setTimeout(() => {
      let filteredProducts = [];
      const personaId = persona.id;

      console.log(`[DEBUG] Filtering for persona: ${personaId}`);

      // Initial filter based on specific "-pick" tags for all personas
      if (personaId === 'student') {
        console.log('[DEBUG Student] Attempting primary filter for student-pick...');
        filteredProducts = mockProducts.filter(p => p.tags.includes('student-pick'));
        console.log(`[DEBUG Student] After primary \'student-pick\' filter, found ${filteredProducts.length} products. Titles:`, filteredProducts.map(p => p.id + ": " + p.title));
      } else if (personaId === 'trendsetter') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('trendsetter-pick'));
        console.log(`[DEBUG Trendsetter] After primary \'trendsetter-pick\' filter, found ${filteredProducts.length} products.`);
      } else if (personaId === 'optimizer') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('optimizer-pick'));
        console.log(`[DEBUG Optimizer] After primary \'optimizer-pick\' filter, found ${filteredProducts.length} products.`);
      } else if (personaId === 'conscious') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('conscious-pick'));
        console.log(`[DEBUG Conscious] After primary \'conscious-pick\' filter, found ${filteredProducts.length} products.`);
      } else {
        // Fallback for any persona that might not have a specific "-pick" logic above (should not happen with current personas)
        console.log(`[DEBUG ${personaId}] No specific -pick logic. Applying general tag/category filter for ${personaId}.`);
        filteredProducts = mockProducts.filter(p => 
          (p.tags.includes(personaId)) || 
          (p.category.toLowerCase().includes(personaId))
        );
      }
      
      console.log(`[DEBUG ${personaId}] After initial specific pick/filter, found ${filteredProducts.length} products.`);
      if (filteredProducts.length > 0) {
         console.log(`[DEBUG ${personaId}] Titles after initial pick: `, filteredProducts.map(p => p.title));
      }

      // Fallback logic if initial filter yields less than 5 products
      if (filteredProducts.length < 5 && mockProducts.length > 0) {
        console.log(`[DEBUG ${personaId}] Initial filter yielded < 5 products (${filteredProducts.length}). Attempting broader filter.`);
        
        let broaderFilter = [];
        const originalPickCount = filteredProducts.length; // Store how many items the specific pick found
        const specificPicksHadItems = originalPickCount > 0;

        if (personaId === 'student') {
            console.log('[DEBUG Student] Applying broader student filter...');
            const studentBroadTags = ['budget-friendly', 'study-essential', 'campus-essential', 'portable', 'value-deal'];
            broaderFilter = mockProducts.filter(p => {
                const hasBroadTag = studentBroadTags.some(tag => p.tags.includes(tag));
                const isRelevantCategory = ['laptop', 'accessories', 'electronics', 'subscription', 'food'].includes(p.category);
                return hasBroadTag || isRelevantCategory;
            });
            console.log(`[DEBUG Student] After broader student filter, found ${broaderFilter.length} products. Titles:`, broaderFilter.map(p=>p.id + ": " + p.title));
        } else {
            // Broader filter logic for other personas (trendsetter, optimizer, conscious)
            console.log(`[DEBUG ${personaId}] Applying broader filter for non-student persona ${personaId}...`);
            const personaTags = { 
                trendsetter: ['premium', 'innovative', 'stylish-travel', 'beauty-tech', 'camera-excellence', 'luxury-travel', 'design-focused', 'wearable-tech', 'fashionable-function'],
                optimizer: ['pro', 'performance', 'ergonomic', 'office-essential', 'productivity-tool', 'tech-essential', 'business-laptop', 'audio-excellence'],
                conscious: ['sustainable', 'eco-friendly', 'organic', 'minimalist', 'durable-design', 'ethical-brand', 'sustainable-fashion', 'health-conscious'],
            };
            broaderFilter = mockProducts.filter(p => {
                return personaTags[personaId]?.some(tag => p.tags.includes(tag)) || 
                       p.category.toLowerCase().includes(personaId);
            });
            console.log(`[DEBUG ${personaId}] Broader filter for ${personaId} found ${broaderFilter.length} products.`);
             if (broaderFilter.length > 0) {
                console.log(`[DEBUG ${personaId}] Titles from broader filter: `, broaderFilter.map(p => p.title));
            }
        }

        if (broaderFilter.length >= 5) {
            console.log(`[DEBUG ${personaId}] Broader filter successful (${broaderFilter.length} products). Using broader set.`);
            filteredProducts = broaderFilter;
        } else {
            console.log(`[DEBUG ${personaId}] Broader filter also yielded < 5 products (${broaderFilter.length}).`);
            // If specific picks originally had items, and broader search didn't get 5, prefer the original specific picks.
            // This prevents a good specific small set from being overridden by an even smaller (or empty) broad set.
            if (specificPicksHadItems) {
                console.log(`[DEBUG ${personaId}] Broader filter insufficient. Reverting to original specific -pick items (${originalPickCount} products) because they existed.`);
                // Re-fetch the original picks to ensure `filteredProducts` is correctly set
                 if (personaId === 'student') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('student-pick'));
                 } else if (personaId === 'trendsetter') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('trendsetter-pick'));
                 } else if (personaId === 'optimizer') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('optimizer-pick'));
                 } else if (personaId === 'conscious') {
                    filteredProducts = mockProducts.filter(p => p.tags.includes('conscious-pick'));
                 }
                 // If, after all this, filteredProducts is still empty (e.g. no -pick and no broad results)
                 // then the critical fallback below will catch it.
            } else {
                // If specific picks had NO items, and broader also failed to get 5, then we check broaderFilter.
                // If broaderFilter has *any* items, use them. Otherwise, it'll go to critical fallback.
                if(broaderFilter.length > 0){
                    console.log(`[DEBUG ${personaId}] Original picks were empty, broader filter has ${broaderFilter.length}. Using broader filter results.`);
                    filteredProducts = broaderFilter;
                } else {
                    console.log(`[DEBUG ${personaId}] Original picks were empty, and broader filter was also empty. Will proceed to critical fallback if necessary.`);
                    // `filteredProducts` remains empty here, will be caught by critical fallback if mockProducts has items.
                }
            }
        }
      }
      
      console.log(`[DEBUG ${personaId}] After all primary and secondary filtering, product count: ${filteredProducts.length}.`);

      // CRITICAL FALLBACK: If all filtering attempts for a persona result in zero products, show all products.
      if (filteredProducts.length === 0 && mockProducts.length > 0) {
          console.warn(`[DEBUG ${personaId}] CRITICAL FALLBACK: All filtering resulted in zero products. Showing all ${mockProducts.length} available products instead for ${personaId}.`);
          filteredProducts = [...mockProducts];
      }

      console.log(`[DEBUG ${personaId}] FINAL products to be set before sorting for ${personaId}: ${filteredProducts.length} items.`);
      if (filteredProducts.length > 0) {
        console.log(`[DEBUG ${personaId}] Final Titles before sorting:`, filteredProducts.map(p => p.title));
      } else {
        console.log(`[DEBUG ${personaId}] No products to display for ${personaId} after all filtering.`);
      }

      setProducts(sortProducts(filteredProducts)); 
      setIsLoadingAnimation(false);
      setIsDiscoveryMode(false);
      
      if (filteredProducts.length === 0 && mockProducts.length > 0) { // This message might now be redundant due to the critical fallback above but kept for safety.
        setErrorMessage(`No products specifically matched "${persona.name}". We're showing all available products instead.`);
         console.log(`[UI HINT] Setting error message for ${personaId} as no specific products found, but showing all due to fallback.`);
      } else if (filteredProducts.length === 0 && mockProducts.length === 0) {
        setErrorMessage(`No products available in the store at the moment.`);
        console.log(`[UI HINT] Setting error message as no products in store.`);
      } else {
        setErrorMessage(null); // Clear any previous error messages if products are found
      }

    }, 1000);
  };
  
  // Handle life moment selection
  const handleLifeMomentSelect = (moment) => {
    setSelectedLifeMoment(moment);
    setShowLifeMomentPanel(false);
    setIsLoadingAnimation(true);
    setErrorMessage(null);

    setTimeout(() => {
      let filteredProducts = [];
      const momentId = moment.id;

      console.log(`Filtering for life moment: ${momentId}`);

      // Primary filter using specific life moment tags
      if (momentId === 'new-arrival') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('new-arrival-essential'));
      } else if (momentId === 'career-launch') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('career-launch-essential'));
      } else if (momentId === 'sanctuary') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('sanctuary-essential'));
      } else if (momentId === 'golden-years') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('golden-years-essential'));
      } else if (momentId === 'gamer-setup') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('gamer-setup-essential'));
      } else if (momentId === 'sustainable-living') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('sustainable-living-essential'));
      } else if (momentId === 'wellness-retreat') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('wellness-retreat-essential'));
      } else if (momentId === 'perfect-hosting') {
        filteredProducts = mockProducts.filter(p => p.tags.includes('perfect-hosting-essential'));
      } else {
        // Fallback for any other moment or if no specific picks are defined
        filteredProducts = mockProducts.filter(p => 
          (p.tags.includes(momentId)) || // General tag match
          (p.category.toLowerCase().includes(momentId)) // General category match
        );
      }

      console.log(`Initial filtered products for ${momentId}:`, filteredProducts.length);

      // Ensure a minimum number of products, or show all if specific filter is too narrow
      if (filteredProducts.length < 4 && mockProducts.length > 0) {
        console.log(`Not enough specific products for ${momentId}, broadening search.`);
        // If specific picks are too few, try a broader filter based on general tags or categories
        let broaderFilter = mockProducts.filter(p => {
          const momentTags = { // Define some broader tags for each moment if specific picks are < 4
            'new-arrival': ['baby', 'infant-care', 'parenting', 'premium-parenting', 'smart-parenting'],
            'career-launch': ['pro', 'performance', 'premium', 'office-essential', 'productivity-tool', 'business-laptop'],
            'sanctuary': ['home-comfort', 'premium-comfort', 'design-focused', 'premium-kitchen', 'ergonomic'],
            'golden-years': ['senior-friendly', 'easy-to-use', 'reading-comfort', 'portable-audio', 'large-screen'],
            'gamer-setup': ['gaming', 'performance', 'tech-essential', 'high-refresh', 'competitive-gaming'],
            'sustainable-living': ['sustainable', 'eco-friendly', 'organic', 'minimalist', 'ethical-brand'],
            'wellness-retreat': ['health-tech', 'wellness', 'comfort-wear', 'self-care', 'relaxation'],
            'perfect-hosting': ['kitchen', 'entertaining', 'premium-kitchen', 'quality-brew', 'versatile-appliance']
          };
          return momentTags[momentId]?.some(tag => p.tags.includes(tag)) || 
                 p.category.toLowerCase().includes(momentId) ||
                 (momentId === 'new-arrival' && p.category === 'baby') ||
                 (momentId === 'sanctuary' && (p.category === 'kitchen' || p.category === 'furniture')) ||
                 (momentId === 'gamer-setup' && (p.category === 'electronics' || p.category === 'audio')) ||
                 (momentId === 'perfect-hosting' && p.category === 'kitchen');
        });

        if (broaderFilter.length >= 4) {
          filteredProducts = broaderFilter;
        } else if (mockProducts.filter(p => p.tags.includes(momentId + "-essential")).length > 0 && filteredProducts.length === 0) {
          // If there *are* -essential items but they were somehow filtered out, re-add them
          filteredProducts = mockProducts.filter(p => p.tags.includes(momentId + "-essential"));
        } else {
          // If still not enough, use the initial specific picks or all if specific picks were zero
          if(mockProducts.filter(p => p.tags.includes(momentId + "-essential")).length > 0 && filteredProducts.length === 0){
            filteredProducts = mockProducts.filter(p => p.tags.includes(momentId + "-essential"));
          } else if (filteredProducts.length === 0) { // Only show all if specific picks truly yield nothing
            console.log(`No specific or broader products for ${momentId}, showing all products.`);
            filteredProducts = [...mockProducts]; // Fallback to all products if no specific products found
          }
        }
      }

      // If after all attempts, filteredProducts is still empty, show all products.
      // This is a final safety net.
      if (filteredProducts.length === 0 && mockProducts.length > 0) {
        console.log(`Critical fallback for ${momentId}: All filters resulted in zero products. Showing all products.`);
        filteredProducts = [...mockProducts];
      }

      setProducts(sortProducts(filteredProducts)); // sortProducts will handle empty array if needed
      setIsLoadingAnimation(false);
      setIsDiscoveryMode(false);
      
      console.log(`Final products for ${momentId}:`, filteredProducts.length, filteredProducts.map(p=>p.title));
      if (filteredProducts.length === 0 && mockProducts.length > 0) {
        setErrorMessage(`No products found for "${moment.name}". We're showing all available products instead.`);
      } else if (filteredProducts.length === 0 && mockProducts.length === 0) {
        setErrorMessage(`No products available in the store at the moment.`);
      }

    }, 1000);
  };
  
  // Remove filters
  const removePersonaFilter = () => {
    setSelectedPersona(null);
    
    // Reapply any remaining filters
    setIsLoadingAnimation(true);
    
    setTimeout(() => {
      setProducts(sortProducts([...mockProducts]));
      setIsLoadingAnimation(false);
    }, 500);
  };
  
  const removeLifeMomentFilter = () => {
    setSelectedLifeMoment(null);
    
    // Reapply any remaining filters
    setIsLoadingAnimation(true);
    
    setTimeout(() => {
      setProducts(sortProducts([...mockProducts]));
      setIsLoadingAnimation(false);
    }, 500);
  };
  
  // Function to handle visual search results
  const handleVisualSearch = (searchLabels) => {
    setIsLoadingAnimation(true);
    
    // In a real app, this would query your product database with the detected objects
    // For demo, we'll filter the mock products to simulate a search
    
    // Simple filter by matched categories or tags
    const matchedProducts = mockProducts.filter(product => {
      // Check if product category matches any of the search labels
      if (searchLabels.some(label => product.category.toLowerCase().includes(label.toLowerCase()))) {
        return true;
      }
      
      // Check if any product tags match the search labels
      if (product.tags.some(tag => 
        searchLabels.some(label => tag.toLowerCase().includes(label.toLowerCase()))
      )) {
        return true;
      }
      
      // Check title and description for matches
      if (searchLabels.some(label => 
        product.title.toLowerCase().includes(label.toLowerCase()) ||
        product.description.toLowerCase().includes(label.toLowerCase())
      )) {
        return true;
      }
      
      return false;
    });
    
    // Update UI with search results
    setTimeout(() => {
      // Apply any persona/life moment personalization to the results
      setProducts(sortProducts(matchedProducts));
      setIsDiscoveryMode(false);
      setIsLoadingAnimation(false);
      
      if (matchedProducts.length === 0) {
        setErrorMessage('No products found matching your visual search. Try another image or select different items.');
      }
    }, 1000);
  };
  
  // --- Debug: Display API Key in UI ---
  const [debugApiKeyDisplay, setDebugApiKeyDisplay] = useState('Checking...');
  useEffect(() => {
    const key = process.env.REACT_APP_CLAUDE_API_KEY;
    if (key) {
      setDebugApiKeyDisplay(`Key starts with: ${key.substring(0, 5)}... (Full key logged at module level)`);
    } else {
      setDebugApiKeyDisplay('REACT_APP_CLAUDE_API_KEY is NOT SET in process.env');
    }
  }, []);
  // --- End Debug ---

  const isSmallScreen = screenWidth < 768; // Define a breakpoint

  return (
    <View style={styles.container}>
      {/* --- Debug: Display API Key in UI --- */}
      <View style={{padding: 10, backgroundColor: '#ffffcc', zIndex: 9999 }}>
        <Text style={{fontSize: 10, color: '#333', fontWeight: 'bold'}}>DEBUG PANEL:</Text>
        <Text style={{fontSize: 10, color: '#333'}}>{debugApiKeyDisplay}</Text>
      </View>
      {/* --- End Debug --- */}

      {/* Content */}
      <ScrollView 
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {isLoadingAnimation ? (
          <View style={styles.loadingContainer}>
            <Animated.View 
              style={styles.loadingPulse}
            />
            <Text style={styles.loadingText}>
              Personalizing for you...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : showTrendingSocial ? (
          // Trending Social Page - Refactored to match product/persona page layout
          <View style={styles.modernProductGrid}> {/* Use modernProductGrid for consistent padding and background */}
            {/* Re-using the ultraModernMainHeader structure */}
            <View style={styles.ultraModernMainHeader}>
              <View style={styles.mainHeaderContent}>
                <View style={styles.brandSection}>
                  <Text style={styles.ultraModernBrandLabel}>CURATED FOR YOU</Text>
                  <Text style={styles.ultraModernBrandTitle}>Trending on Social</Text>
                  <Text style={styles.ultraModernBrandTagline}>
                    {trendRadarData.length} products • what's capturing attention right now
                  </Text>
                </View>
                
                <View style={styles.ultraModernProductHeaderControls}>
                  <TouchableOpacity 
                    style={styles.ultraModernBackButton}
                    onPress={() => {
                      setShowTrendingSocial(false);
                      setIsDiscoveryMode(true);
                    }}
                  >
                    <Text style={styles.ultraModernBackButtonText}>← Discover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Trending Products Grid - now using productGrid for two-column layout */}
            <View style={styles.productGrid}>
              {trendRadarData.map((trendItem) => {
                // Find the corresponding product in mockProducts
                const product = mockProducts.find(p => 
                  p.title.toLowerCase().includes(trendItem.title.toLowerCase()) ||
                  p.category.toLowerCase() === trendItem.category.toLowerCase()
                ) || {
                  // Fallback product data based on trend item
                  id: `trend-${trendItem.id}`,
                  title: trendItem.title,
                  price: trendItem.category === 'ELECTRONICS' ? '$399.99' : 
                         trendItem.category === 'HOME' ? '$749.99' :
                         trendItem.category === 'TRAVEL' ? '$275.00' : '$99.99',
                  rating: '4.6',
                  description: `Trending ${trendItem.category.toLowerCase()} product`,
                  category: trendItem.category.toLowerCase(),
                  image: trendItem.image,
                  brand: trendItem.title.split(' ')[0],
                  affiliateUrl: trendItem.brandUrl || '#',
                  trendingStats: `${trendItem.trendChange} increase in social mentions • ${trendItem.isViral ? 'Going viral' : 'Steady growth'} • Featured across platforms`,
                  hotTake: `This ${trendItem.category.toLowerCase()} product is trending because it perfectly captures what people are looking for right now. The surge in social media mentions and reviews shows real consumer excitement.`,
                  whyBuyThis: `🔥 TRENDING PICK → ${trendItem.trendChange} surge in popularity • Social media approved • Join the conversation • Don't miss out on what everyone's talking about`
                };

                return (
                  // Use modernProductCard for individual card styling
                  <View key={`trending-${trendItem.id}`} style={styles.modernProductCard}>
                    <View style={styles.productImageContainer}>
                      <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity style={styles.favoriteButton}>
                        <Text style={styles.favoriteIcon}>♡</Text>
                      </TouchableOpacity>
                      {trendItem.isViral && (
                        <View style={styles.viralBadge}>
                          <Text style={styles.viralBadgeText}>VIRAL</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.brandName}>{product.brand}</Text>
                      <Text style={styles.productName} numberOfLines={2}>
                        {product.title}
                      </Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>{product.price}</Text>
                        <Text style={styles.rating}>★ {product.rating}</Text>
                      </View>

                      {/* Trending Stats Section */}
                      {product.trendingStats && (
                        <View style={styles.trendingStatsContainer}>
                          <Text style={styles.trendingStatsLabel}>🔥 TRENDING NOW</Text>
                          <Text style={styles.trendingStatsText}>{product.trendingStats}</Text>
                        </View>
                      )}

                      {/* Hot Take Section */}
                      {product.hotTake && (
                        <View style={styles.hotTakeContainer}>
                          <Text style={styles.hotTakeLabel}>💭 CURATOR'S HOT TAKE</Text>
                          <Text style={styles.hotTakeText}>{product.hotTake}</Text>
                        </View>
                      )}

                      {/* Why Buy This Section */}
                      {product.whyBuyThis && (
                        <View style={styles.whyBuyThisContainer}>
                          <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                        </View>
                      )}

                      {/* Action Buttons */}
                      <View style={styles.productCardButtonContainer}>
                        <TouchableOpacity
                          style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                          onPress={() => {
                            if (trendItem.brandUrl) {
                              openExternalLink(trendItem.brandUrl);
                            } else if (product.affiliateUrl && product.affiliateUrl !== '#') {
                              openExternalLink(product.affiliateUrl);
                            } else {
                              alert('Product link coming soon!');
                            }
                          }}
                        >
                          <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                          onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                        >
                          <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : isDiscoveryMode ? (
          <View style={[styles.discoveryContainer, isSmallScreen && styles.ultraModernDiscoveryContainerPaddingSmallScreen]}>
            {/* Ultra-Modern Main Header */}
            <View style={[styles.ultraModernMainHeader, isSmallScreen && styles.ultraModernMainHeaderSmallScreen]}>
              <View style={styles.mainHeaderContent}>
                <View style={styles.brandSection}>
                  <Text style={styles.ultraModernBrandLabel}>DISCOVERY</Text>
                  <Text style={[styles.ultraModernBrandTitle, isSmallScreen && styles.ultraModernBrandTitleSmallScreen]}>curator</Text>
                  <Text style={[styles.ultraModernBrandTagline, isSmallScreen && styles.ultraModernBrandTaglineSmallScreen]}>
                    where artificial intelligence meets intentional living
                  </Text>
                </View>
                
                <View style={[styles.ultraModernHeaderControls, isSmallScreen && styles.ultraModernHeaderControlsSmallScreen]}>
                  <View style={[styles.ultraModernSearchContainer, isSmallScreen && styles.ultraModernSearchContainerSmallScreen]}>
                    <View style={[styles.searchInputWrapper, isSmallScreen && styles.searchInputWrapperSmallScreen]}>
                      <TextInput
                        style={[styles.ultraModernSearchInput, isSmallScreen && styles.ultraModernSearchInputSmallScreen]}
                        placeholder="discover your perfect aesthetic..."
                        placeholderTextColor="#A0A0A0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                      />
                      <TouchableOpacity 
                        style={styles.ultraModernSearchButton}
                        onPress={handleSearch}
                      >
                        <Text style={styles.searchIcon}>⌕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={[styles.ultraModernSelectorRow, isSmallScreen && styles.ultraModernSelectorRowSmallScreen]}>
                    <TouchableOpacity 
                      style={[styles.ultraModernSelector, selectedPersona && styles.ultraModernSelectorActive, isSmallScreen && styles.ultraModernSelectorSmallScreen]}
                      onPress={() => setShowPersonaPanel(true)}
                    >
                      <View style={styles.selectorContent}>
                        {selectedPersona ? (
                          <Image 
                            source={{ uri: selectedPersona.icon }}
                            style={styles.ultraModernSelectorIcon}
                          />
                        ) : (
                          <View style={styles.ultraModernDefaultIcon}>
                            <Text style={styles.defaultIconText}>S</Text>
                          </View>
                        )}
                        <View style={styles.selectorTextContainer}>
                          <Text style={styles.ultraModernSelectorLabel}>STYLE</Text>
                          <Text style={[styles.ultraModernSelectorValue, isSmallScreen && styles.ultraModernSelectorValueSmallScreen]}>
                            {selectedPersona ? selectedPersona.name : 'Choose Your Aesthetic'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.ultraModernSelector, selectedLifeMoment && styles.ultraModernSelectorActive, isSmallScreen && styles.ultraModernSelectorSmallScreen]}
                      onPress={() => setShowLifeMomentPanel(true)}
                    >
                      <View style={styles.selectorContent}>
                        {selectedLifeMoment ? (
                          <Image 
                            source={{ uri: selectedLifeMoment.icon }}
                            style={styles.ultraModernSelectorIcon}
                          />
                        ) : (
                          <View style={styles.ultraModernDefaultIcon}>
                            <Text style={styles.defaultIconText}>M</Text>
                          </View>
                        )}
                        <View style={styles.selectorTextContainer}>
                          <Text style={styles.ultraModernSelectorLabel}>MOMENT</Text>
                          <Text style={[styles.ultraModernSelectorValue, isSmallScreen && styles.ultraModernSelectorValueSmallScreen]}>
                            {selectedLifeMoment ? selectedLifeMoment.name : 'Current Chapter'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.ultraModernSelector, isSmallScreen && styles.ultraModernSelectorSmallScreen]}
                      onPress={() => setShowVisualSearch(true)}
                    >
                      <View style={styles.selectorContent}>
                        <View style={styles.ultraModernDefaultIcon}>
                          <Text style={styles.defaultIconText}>📷</Text>
                        </View>
                        <View style={styles.selectorTextContainer}>
                          <Text style={styles.ultraModernSelectorLabel}>VISUAL</Text>
                          <Text style={[styles.ultraModernSelectorValue, isSmallScreen && styles.ultraModernSelectorValueSmallScreen]}>Search by Image</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            
            <TrendRadar 
              items={trendRadarData}
              onItemPress={(item) => {
                setShowTrendingSocial(true);
                setIsDiscoveryMode(false);
                setShowAiCurateView(null); // Reset AI view
                if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                  window.history.pushState({ page: 'trending' }, '', '?view=trending');
                }
              }}
              onSeeAll={() => {
                setShowTrendingSocial(true);
                setIsDiscoveryMode(false);
                setShowAiCurateView(null); // Reset AI view
                if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                  window.history.pushState({ page: 'trending' }, '', '?view=trending');
                }
              }}
            />
            
            <View style={[styles.ultraModernSocialBundlesContainer, isSmallScreen && styles.ultraModernSectionContainerMarginSmallScreen]}>
              <View style={styles.ultraModernSectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.ultraModernSectionLabel}>CURATED</Text>
                  <Text style={styles.ultraModernSectionTitle}>Social Bundles</Text>
                  <Text style={styles.ultraModernSectionSubtitle}>
                    thoughtfully assembled collections from our community
                  </Text>
                </View>
                <TouchableOpacity style={styles.modernSeeAllButton}>
                  <Text style={styles.modernSeeAllText}>View Collection</Text>
                  <Text style={styles.modernSeeAllArrow}>→</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.ultraModernBundlesScroll}
              >
                {socialBundles.map((bundle) => {
                  // TODO: Refactor these inline small-screen styles into StyleSheet
                  const bundleNameSmallScreenStyle = isSmallScreen ? { fontSize: 22 } : {};
                  const bundleCuratorAvatarSmallScreenStyle = isSmallScreen ? { width: 30, height: 30, borderRadius: 15 } : {};
                  const bundleCuratorNameSmallScreenStyle = isSmallScreen ? { fontSize: 15 } : {};

                  return (
                    <TouchableOpacity 
                      key={bundle.id} 
                      style={[
                        styles.ultraModernBundleCard, 
                        isSmallScreen && styles.ultraModernBundleCardSmallScreen,
                        isSmallScreen && { width: screenWidth * 0.75 } // Apply dynamic width here
                      ]}
                      onPress={() => {
                        // When a bundle is clicked, show its products
                        setIsLoadingAnimation(true);
                        setIsDiscoveryMode(false);
                        setShowTrendingSocial(false);
                        setShowAiCurateView(null); // Reset AI view
                        
                        if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                          window.history.pushState({ page: 'products', socialBundle: bundle.id }, '', `?bundle=${bundle.id}`);
                        }
                        
                        setTimeout(() => {
                          setProducts(sortProducts(bundle.products));
                          setIsLoadingAnimation(false);
                        }, 800);
                      }}
                    >
                      <View style={styles.ultraModernBundleImageContainer}>
                        <Image 
                          source={{ uri: bundle.coverImage }}
                          style={styles.ultraModernBundleCover}
                          resizeMode="cover"
                        />
                        <View style={styles.ultraModernBundleOverlay} />
                      </View>
                      <View style={styles.ultraModernBundleContent}>
                        <Text style={[styles.ultraModernBundleName, bundleNameSmallScreenStyle]}>{bundle.title}</Text>
                        <View style={styles.ultraModernBundleCreatorRow}>
                          <Image 
                            source={{ uri: bundle.creator.avatar }}
                            style={styles.ultraModernCreatorAvatar}
                          />
                          <Text style={styles.ultraModernCreatorName}>{bundle.creator.name}</Text>
                          {bundle.creator.verified && (
                            <Text style={styles.ultraModernVerifiedBadge}>✓</Text>
                          )}
                        </View>
                        
                        <Text style={styles.ultraModernBundleProductCount}>
                          {bundle.products.length} carefully selected items
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            
            <View style={[styles.shopByVibeContainer, isSmallScreen && styles.ultraModernSectionContainerMarginSmallScreen]}>
              <View style={styles.ultraModernSectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.ultraModernSectionLabel}>AESTHETIC</Text>
                  <Text style={styles.ultraModernSectionTitle}>Shop by Vibe</Text>
                  <Text style={styles.ultraModernSectionSubtitle}>
                    Discover your aesthetic language through curated collections
                  </Text>
                </View>
                <TouchableOpacity style={styles.modernSeeAllButton}>
                  <Text style={styles.modernSeeAllText}>Explore All</Text>
                  <Text style={styles.modernSeeAllArrow}>→</Text>
                </TouchableOpacity>
              </View>
              
              {(() => {
                const moodCardWidthSmallScreen = isSmallScreen ? screenWidth * 0.65 : undefined;
                const moodCardMarginRightSmallScreen = isSmallScreen ? 12 : 0;

                const moodItemsContent = moodBoards.map((mood) => (
                  <TouchableOpacity 
                    key={mood.id} 
                    style={[
                      styles.ultraModernMoodCard, 
                      isSmallScreen && styles.ultraModernMoodCardSmallScreen, // Will apply base small screen card style (e.g. aspectRatio)
                      isSmallScreen && { width: moodCardWidthSmallScreen, marginRight: moodCardMarginRightSmallScreen }
                    ]}
                    onPress={() => {
                      // When a mood is clicked, filter products by aesthetic
                      setIsLoadingAnimation(true);
                      setIsDiscoveryMode(false);
                      setShowTrendingSocial(false);
                      setShowAiCurateView(null); // Reset AI view

                      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                        window.history.pushState({ page: 'products', mood: mood.id }, '', `?mood=${mood.id}`);
                      }
                      
                      setTimeout(() => {
                        // Enhanced mood-based filtering logic
                        const moodProducts = mockProducts.filter(product => {
                          if (mood.id === 'minimalist') {
                            return product.tags.includes('premium') || product.tags.includes('pro') || product.category === 'laptop';
                          } else if (mood.id === 'cyberpunk') {
                            return product.category === 'laptop' || product.category === 'wearables' || product.tags.includes('tech');
                          } else if (mood.id === 'nostalgic') {
                            return product.category === 'gaming' || product.tags.includes('retro') || product.tags.includes('classic');
                          } else if (mood.id === 'romantic') {
                            return product.category === 'jewelry' || product.tags.includes('luxury') || product.category === 'beauty';
                          } else if (mood.id === 'streetwear') {
                            return product.category === 'fashion' || product.category === 'shoes' || product.tags.includes('urban');
                          } else if (mood.id === 'academia') {
                            return product.category === 'books' || product.category === 'stationery' || product.tags.includes('study');
                          }
                          return false;
                        });
                        setProducts(sortProducts(moodProducts));
                        setIsLoadingAnimation(false);
                      }, 800);
                    }}
                  >
                    <View style={styles.ultraModernMoodImageContainer}>
                      <Image 
                        source={{ uri: mood.coverImage }} 
                        style={styles.ultraModernMoodCover} 
                        resizeMode="cover"
                      />
                      <View style={[styles.ultraModernMoodOverlay, {backgroundColor: mood.overlayColor}]} />
                    </View>
                    <View style={[styles.ultraModernMoodContent, isSmallScreen && styles.ultraModernMoodContentSmallScreen]}>
                      <View>
                        <View style={styles.moodNameRow}>
                          <Text style={[styles.moodEmoji, isSmallScreen && styles.moodEmojiSmallScreen]}>{mood.emoji}</Text>
                          <Text style={[styles.ultraModernMoodName, isSmallScreen && styles.ultraModernMoodNameSmallScreen]} numberOfLines={1} ellipsizeMode="tail">{mood.name}</Text>
                        </View>
                        <Text style={[styles.cursiveDescription, isSmallScreen && styles.cursiveDescriptionSmallScreen]} numberOfLines={isSmallScreen ? 2 : 3} ellipsizeMode="tail">{mood.description}</Text>
                      </View>
                      <Text style={[styles.philosophyText, isSmallScreen && styles.philosophyTextSmallScreen]} numberOfLines={isSmallScreen ? 1 : 2} ellipsizeMode="tail">{mood.philosophy}</Text>
                    </View>
                  </TouchableOpacity>
                ));

                if (isSmallScreen) {
                  return (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ultraModernMoodsGridSmallScreenScrollViewContent}>
                      {moodItemsContent}
                    </ScrollView>
                  );
                }
                return (
                  <View style={[styles.ultraModernMoodsGrid, isSmallScreen && styles.ultraModernMoodsGridSmallScreen]}>
                    {moodItemsContent}
                  </View>
                );
              })()}
            </View>
            
            {/* Ultra-Modern Categories */}
            <View style={[styles.ultraModernCategoryContainer, isSmallScreen && styles.ultraModernSectionContainerMarginSmallScreen]}>
              <View style={styles.ultraModernSectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={styles.ultraModernSectionLabel}>BROWSE</Text>
                  <Text style={styles.ultraModernSectionTitle}>Shop by Category</Text>
                  <Text style={styles.ultraModernSectionSubtitle}>
                    explore our curated world of intentional products
                  </Text>
                </View>
              </View>
              
              <View style={[styles.ultraModernCategoryGrid, isSmallScreen && styles.ultraModernCategoryGridSmallScreen]}>
                {productCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.ultraModernCategoryItem, isSmallScreen && styles.ultraModernCategoryItemSmallScreen]}
                    onPress={() => {
                      // When a category is clicked, filter products by category name
                      setIsLoadingAnimation(true);
                      setIsDiscoveryMode(false);
                      setShowTrendingSocial(false);
                      setShowAiCurateView(null); // Reset AI view

                      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                        window.history.pushState({ page: 'products', category: category.name }, '', `?category=${encodeURIComponent(category.name)}`);
                      }

                      setTimeout(() => {
                        const categoryProducts = mockProducts.filter(product => 
                          product.category.toLowerCase().includes(category.id.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(category.id.toLowerCase()))
                        );
                        setProducts(sortProducts(categoryProducts.length > 0 ? categoryProducts : mockProducts));
                        setIsLoadingAnimation(false);
                      }, 800);
                    }}
                  >
                    <View style={styles.ultraModernCategoryIcon}>
                      <Image 
                        source={{ uri: category.image }}
                        style={styles.ultraModernCategoryImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={[styles.ultraModernCategoryName, isSmallScreen && styles.ultraModernCategoryNameSmallScreen]}>{category.name}</Text>
                    <Text style={[styles.ultraModernCategoryDescription, isSmallScreen && styles.ultraModernCategoryDescriptionSmallScreen]}>
                      {category.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyPrimary}>
              No products found
            </Text>
            <Text style={styles.emptySecondary}>
              Try adjusting your filters or search query
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateNeonBackButton} // Use new style
              onPress={() => {
                setIsDiscoveryMode(true);
                setSearchQuery('');
                setSelectedPersona(null);
                setSelectedLifeMoment(null);
                setProducts(sortProducts([...mockProducts]));
                setErrorMessage(null);
              }}
            >
              <Text style={styles.neonBackButtonText}>← Back to Discovery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.modernProductGrid, isSmallScreen && styles.modernProductGridSmallScreen]}>
            {/* Ultra-Modern Product Header - Consistent with Homepage */}
            <View style={styles.ultraModernMainHeader}>
              <View style={styles.mainHeaderContent}>
                <View style={styles.brandSection}>
                  <Text style={styles.ultraModernBrandLabel}>
                    {selectedPersona ? 'CURATED FOR' : selectedLifeMoment ? 'CURATED FOR' : 'DISCOVERY'}
                  </Text>
                  <Text style={styles.ultraModernBrandTitle}>
                    {selectedPersona ? selectedPersona.name : selectedLifeMoment ? selectedLifeMoment.name : 'curator'}
                  </Text>
                  <Text style={styles.ultraModernBrandTagline}>
                    {selectedPersona?.id === 'student'
                      ? `${products.length} budget essentials • carefully selected for your lifestyle`
                      : selectedLifeMoment
                        ? `${products.length} products • perfectly aligned with this chapter`
                        : selectedPersona
                          ? `${products.length} products • intentionally curated for your aesthetic`
                          : `${products.length} products • where artificial intelligence meets intentional living`
                    }
                  </Text>
                </View>
                
                <View style={styles.ultraModernProductHeaderControls}>
                  <TouchableOpacity 
                    style={styles.ultraModernBackButton}
                    onPress={() => {
                      setIsDiscoveryMode(true);
                      setSearchQuery('');
                      setSelectedPersona(null);
                      setSelectedLifeMoment(null);
                      setProducts(sortProducts([...mockProducts])); // Reset to all products, sorted
                      setErrorMessage(null);
                      // Add browser history management
                      if (window.history && window.history.pushState) {
                        window.history.pushState(null, null, window.location.pathname);
                      }
                    }}
                  >
                    <Text style={styles.ultraModernBackButtonText}>← Discover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Premium Product Grid */}
            <View style={styles.productGrid}>
              {products.length === 0 ? (
                <View style={styles.noProductsMessage}>
                  <Text style={styles.noProductsText}>
                    No products found for this selection. 
                  </Text>
                  <Text style={styles.noProductsSubtext}>
                    Try selecting a different persona or go back to discovery.
                  </Text>
                </View>
              ) : (
                products.map((product) => (
                  <View 
                    key={product.id} 
                    style={[
                      selectedPersona?.id === 'student' ? styles.studentProductCard : styles.modernProductCard,
                      isSmallScreen && (selectedPersona?.id === 'student' ? styles.studentProductCardSmallScreen : styles.modernProductCardSmallScreen)
                    ]}
                  >
                    {selectedPersona?.id === 'student' ? (
                      // REFINED Student Persona Card Layout
                      <>
                        <View style={styles.studentImageContainer}> {/* Using studentImageContainer which mirrors productImageContainer */}
                          <Image
                            source={{ uri: product.image }}
                            style={styles.productImage} // Reusing common productImage style
                            resizeMode="cover"
                          />
                          {/* studentCardBadge removed */}
                           <TouchableOpacity style={styles.favoriteButton}>
                            <Text style={styles.favoriteIcon}>♡</Text>{/* Standardized Icon */}
                          </TouchableOpacity>
                        </View>
                        <View style={styles.studentInfo}>
                          <Text style={styles.studentBrandName}>{product.brand}</Text>
                          <Text style={styles.studentProductName} numberOfLines={2}>
                            {product.title}
                          </Text>
                          <View style={styles.studentPriceRow}>
                            <Text style={styles.studentCurrentPrice}>{product.price}</Text>
                            <Text style={styles.studentRating}>★ {product.rating}</Text> {/* Using ★ for rating value as it's common */}
                          </View>

                          {(product.studentReview || product.whyStudentsLove) && (
                            <View style={styles.studentExclusiveContent}>
                              {product.studentReview && (
                                <>
                                  <Text style={styles.studentReviewLabel}>Student Review:</Text>
                                  <Text style={styles.studentReviewText}>"{product.studentReview}"</Text>
                                </>
                              )}
                              {product.whyStudentsLove && (
                                <>
                                  <Text style={styles.studentWhyLoveLabel}>Why Students Love It:</Text>
                                  <Text style={styles.studentWhyLoveText}>{product.whyStudentsLove}</Text>
                                </>
                              )}
                            </View>
                          )}

                          {/* Ultra-Modern Why Buy This Section */}
                          {product.whyBuyThis && (
                            <View style={styles.whyBuyThisContainer}>
                              <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                            </View>
                          )}

                          {/* Trending Stats Section */}
                          {product.trendingStats && (
                            <View style={styles.trendingStatsContainer}>
                              <Text style={styles.trendingStatsLabel}>🔥 TRENDING NOW</Text>
                              <Text style={styles.trendingStatsText}>{product.trendingStats}</Text>
                            </View>
                          )}

                          {/* Hot Take Section */}
                          {product.hotTake && (
                            <View style={styles.hotTakeContainer}>
                              <Text style={styles.hotTakeLabel}>💭 CURATOR'S HOT TAKE</Text>
                              <Text style={styles.hotTakeText}>{product.hotTake}</Text>
                            </View>
                          )}

                          {/* Updated Student Button Layout with two minimalist buttons */}
                          <View style={styles.productCardButtonContainer}>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                              onPress={() => openExternalLink(product.affiliateUrl)}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                              onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    ) : (
                      // Default/Modern Product Card Layout (existing)
                      <>
                        <View style={styles.productImageContainer}>
                          <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            resizeMode="cover"
                          />
                          <TouchableOpacity style={styles.favoriteButton}>
                            <Text style={styles.favoriteIcon}>♡</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.productInfo}>
                          <Text style={styles.brandName}>{product.brand}</Text>
                          <Text style={styles.productName} numberOfLines={2}>
                            {product.title}
                          </Text>

                          <View style={styles.priceRow}>
                            <Text style={styles.currentPrice}>{product.price}</Text>
                            <Text style={styles.rating}>★ {product.rating}</Text>
                          </View>

                          {/* Persona Exclusive Content for modernProductCard */}
                          {(product.optimizerInsight || product.trendsetterTip || product.consciousChoiceDetail) && selectedPersona && selectedPersona.id !== 'student' && (
                            <View style={styles.personaExclusiveContentContainer}>
                              {selectedPersona.id === 'optimizer' && product.optimizerInsight && (
                                <>
                                  <Text style={styles.personaInsightLabel}>Pro Tip:</Text>
                                  <Text style={styles.personaInsightText}>{product.optimizerInsight}</Text>
                                </> 
                              )}
                              {selectedPersona.id === 'trendsetter' && product.trendsetterTip && (
                                <>
                                  <Text style={styles.personaInsightLabel}>Style Note:</Text>
                                  <Text style={styles.personaInsightText}>{product.trendsetterTip}</Text>
                                </> 
                              )}
                              {selectedPersona.id === 'conscious' && product.consciousChoiceDetail && (
                                <>
                                  <Text style={styles.personaInsightLabel}>Conscious Detail:</Text>
                                  <Text style={styles.personaInsightText}>{product.consciousChoiceDetail}</Text>
                                </> 
                              )}
                            </View>
                          )}

                          {/* Ultra-Modern Why Buy This Section for Non-Students */}
                          {product.whyBuyThis && (
                            <View style={styles.whyBuyThisContainer}>
                              <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                            </View>
                          )}

                          {/* Trending Stats Section */}
                          {product.trendingStats && (
                            <View style={styles.trendingStatsContainer}>
                              <Text style={styles.trendingStatsLabel}>🔥 TRENDING NOW</Text>
                              <Text style={styles.trendingStatsText}>{product.trendingStats}</Text>
                            </View>
                          )}

                          {/* Hot Take Section */}
                          {product.hotTake && (
                            <View style={styles.hotTakeContainer}>
                              <Text style={styles.hotTakeLabel}>💭 CURATOR'S HOT TAKE</Text>
                              <Text style={styles.hotTakeText}>{product.hotTake}</Text>
                            </View>
                          )}

                          {/* Updated Non-Student Button Layout with two minimalist buttons */}
                          <View style={styles.productCardButtonContainer}>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                              onPress={() => openExternalLink(product.affiliateUrl)}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                              onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                            >
                              <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Visual Search Modal */}
      <VisualSearch 
        visible={showVisualSearch}
        onClose={() => setShowVisualSearch(false)}
        onSearch={handleVisualSearch}
      />
      
      {/* Persona Selection Panel */}
      <PersonaSelectionPanel
        visible={showPersonaPanel}
        onClose={() => setShowPersonaPanel(false)}
        personas={personas}
        selectedPersona={selectedPersona}
        onSelectPersona={handlePersonaSelect}
      />
      
      {/* Life Moment Selection Panel */}
      <LifeMomentSelectionPanel
        visible={showLifeMomentPanel}
        onClose={() => setShowLifeMomentPanel(false)}
        lifeMoments={lifeMoments}
        selectedLifeMoment={selectedLifeMoment}
        onSelectLifeMoment={handleLifeMomentSelect}
      />

      {/* New AI Curation Section */}
      <View style={styles.ultraModernAiCurationContainer}> {/* New container style needed */}
        <View style={styles.ultraModernSectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Text style={styles.ultraModernSectionLabel}>PERSONALIZE</Text>
            <Text style={styles.ultraModernSectionTitle}>Curate with AI</Text>
            <Text style={styles.ultraModernSectionSubtitle}>
              Describe your style, select favorite brands, and let our AI build a unique collection just for you.
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.ultraModernPrimaryButton} // Re-use or create a new primary button style
          onPress={() => {
            setShowAiCurateView('form');
            setIsDiscoveryMode(false); // Hide discovery content
            setShowTrendingSocial(false); // Ensure other views are hidden
            // Push history state for AI Curation form
            if (typeof window !== 'undefined' && window.history && window.history.pushState) {
              window.history.pushState({ page: 'aiCurateForm' }, '', '?view=ai-curate');
            }
          }}
        >
          <Text style={styles.ultraModernPrimaryButtonText}>Start AI Curation</Text>
        </TouchableOpacity>
      </View>

      {/* AI Curation Form View (To be built next) */}
      {showAiCurateView === 'form' ? (
        <View style={styles.aiCurateFormContainer}>
          {/* Header for AI Curation Form */}
          <View style={styles.ultraModernMainHeader}>
            <View style={styles.mainHeaderContent}>
              <View style={styles.brandSection}>
                <Text style={styles.ultraModernBrandLabel}>AI CURATION</Text>
                <Text style={styles.ultraModernBrandTitle}>Tell Us About You</Text>
                <Text style={styles.ultraModernBrandTagline}>
                  Help our AI understand your preferences to create the perfect bundle.
                </Text>
              </View>
              <View style={styles.ultraModernProductHeaderControls}>
                <TouchableOpacity 
                  style={styles.ultraModernBackButton}
                  onPress={() => {
                    setShowAiCurateView(null);
                    setIsDiscoveryMode(true); // Go back to discovery
                    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                      window.history.pushState({ page: 'discovery' }, '', window.location.pathname.split('?')[0]);
                    }
                  }}
                >
                  <Text style={styles.ultraModernBackButtonText}>← Discover</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Form elements will go here */}
          <ScrollView style={styles.aiFormScrollView}>
            <Text style={styles.aiFormSectionTitle}>Your Favorite Brands (select up to 5)</Text>
            <View style={styles.aiBrandSelectionContainer}>
              {availableBrands.map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.aiBrandChip,
                    aiSelectedBrands.includes(brand) && styles.aiBrandChipSelected
                  ]}
                  onPress={() => {
                    if (aiSelectedBrands.includes(brand)) {
                      setAiSelectedBrands(aiSelectedBrands.filter(b => b !== brand));
                    } else {
                      if (aiSelectedBrands.length < 5) {
                        setAiSelectedBrands([...aiSelectedBrands, brand]);
                      }
                    }
                  }}
                >
                  <Text style={styles.aiBrandChipText}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.aiFormSectionTitle}>Describe Your Style</Text>
            <TextInput
              style={styles.aiTextInput}
              placeholder="e.g., minimalist, vibrant, classic, tech-focused"
              value={aiPersonaStyle}
              onChangeText={setAiPersonaStyle}
              placeholderTextColor="#A0A0A0"
            />

            <Text style={styles.aiFormSectionTitle}>Your Budget Preference</Text>
            <View style={styles.aiBudgetSelectorContainer}>
              {['$', '$$', '$$$'].map(budget => (
                <TouchableOpacity
                  key={budget}
                  style={[
                    styles.aiBudgetChip,
                    aiPersonaBudget === budget && styles.aiBudgetChipSelected
                  ]}
                  onPress={() => setAiPersonaBudget(budget)}
                >
                  <Text style={styles.aiBudgetChipText}>{budget}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.aiFormSectionTitle}>What are you looking for specifically?</Text>
            <TextInput
              style={styles.aiTextInput}
              placeholder="e.g., a new laptop for college, a gift for a friend, summer travel essentials"
              value={aiLookingFor}
              onChangeText={setAiLookingFor}
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity 
              style={styles.ultraModernPrimaryButton} 
              onPress={async () => { // Make onPress async
                setIsAiLoading(true);
                setAiErrorMessage(null); // Clear previous errors
                setAiGeneratedProducts([]); // Clear previous results

                try {
                  const generated = await fetchAiCuratedProducts(
                    aiSelectedBrands,
                    aiPersonaStyle,
                    aiPersonaBudget,
                    aiLookingFor
                  );
                  setAiGeneratedProducts(generated);
                  setShowAiCurateView('results');
                  // Push history state for AI Curation results
                  if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                    window.history.pushState({ page: 'aiCurateResults' }, '', '?view=ai-results');
                  }
                } catch (error) {
                  console.error("Error during AI Curation:", error);
                  setAiErrorMessage(error.message || "An unexpected error occurred while curating products.");
                  setShowAiCurateView('results'); // Still go to results view to show the error
                   if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                    window.history.pushState({ page: 'aiCurateResults', error: true }, '', '?view=ai-results&error=true');
                  }
                } finally {
                  setIsAiLoading(false);
                }
              }}
            >
              {isAiLoading ? (
                <Text style={styles.ultraModernPrimaryButtonText}>Curating...</Text>
              ) : (
                <Text style={styles.ultraModernPrimaryButtonText}>Curate My Shopping Bundle</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : showAiCurateView === 'results' ? (
        // AI Curation Results View (To be built next)
        <View style={[styles.modernProductGrid, isSmallScreen && styles.modernProductGridSmallScreen]}> 
          <View style={[styles.ultraModernMainHeader, isSmallScreen && styles.ultraModernMainHeaderSmallScreen]}>
            <View style={styles.mainHeaderContent}>
              <View style={styles.brandSection}>
                <Text style={styles.ultraModernBrandLabel}>AI CURATED FOR YOU</Text>
                <Text style={[styles.ultraModernBrandTitle, isSmallScreen && styles.ultraModernBrandTitleSmallScreen]}>Your Personal Collection</Text>
                <Text style={[styles.ultraModernBrandTagline, isSmallScreen && styles.ultraModernBrandTaglineSmallScreen]}>
                  {aiGeneratedProducts.length > 0 ? `${aiGeneratedProducts.length} products` : aiErrorMessage ? 'Error' : 'No products'} • Based on your preferences: {aiSelectedBrands.join(', ')}, {aiPersonaStyle}, {aiPersonaBudget}
                </Text>
              </View>
              <View style={styles.ultraModernProductHeaderControls}>
                <TouchableOpacity 
                  style={[styles.ultraModernBackButton, isSmallScreen && styles.ultraModernBackButtonSmallScreen]}
                  onPress={() => {
                    setShowAiCurateView('form'); // Go back to the form
                     if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                      window.history.pushState({ page: 'aiCurateForm' }, '', '?view=ai-curate');
                    }
                  }}
                >
                  <Text style={styles.ultraModernBackButtonText}>← Edit Preferences</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {isAiLoading ? (
            <View style={styles.loadingContainer}>
              <Animated.View style={styles.loadingPulse} />
              <Text style={styles.loadingText}>Generating your curated collection...</Text>
            </View>
          ) : aiGeneratedProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyPrimary}>AI Couldn't Find Matches</Text>
              <Text style={styles.emptySecondary}>Please try adjusting your preferences.</Text>
            </View>
          ) : (
            <View style={styles.productGrid}>
              {aiGeneratedProducts.map((product) => (
                <View 
                  key={product.id} 
                  style={[
                    styles.modernProductCard, 
                    isSmallScreen && styles.modernProductCardSmallScreen // <<< Apply conditional style here
                  ]}
                >
                  {/* Using existing product card structure */}
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Text style={styles.favoriteIcon}>♡</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.brandName}>{product.brand}</Text>
                    <Text style={styles.productName} numberOfLines={2}>{product.title}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.currentPrice}>{product.price}</Text>
                      <Text style={styles.rating}>★ {product.rating}</Text>
                    </View>
                    {product.whyBuyThis && (
                      <View style={styles.whyBuyThisContainer}>
                        <Text style={styles.whyBuyThisText}>{product.whyBuyThis}</Text>
                      </View>
                    )}
                    <View style={styles.productCardButtonContainer}>
                      <TouchableOpacity
                        style={[styles.minimalistButtonShared, styles.minimalistButtonPrimary]}
                        onPress={() => openExternalLink(product.affiliateUrl)}
                      >
                        <Text style={[styles.buttonTextShared, styles.buttonTextPrimary]}>Shop on Brand Website</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.minimalistButtonShared, styles.minimalistButtonSecondary]}
                        onPress={() => alert('The Curator Agent will assist you with this purchase soon!')}
                      >
                        <Text style={[styles.buttonTextShared, styles.buttonTextSecondary]}>Shop with Curator Agent</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  discoveryContainer: {
    paddingHorizontal: 40,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
  },
  // TrendRadar styles
  trendRadarContainer: {
    marginBottom: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
  },
  trendRadarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 24,
  },
  trendRadarCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  trendRadarImageContainer: {
    height: 240,
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  trendRadarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  viralBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viralBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  trendOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 12,
  },
  trendChangeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  trendRadarContent: {
    padding: 20,
  },
  trendRadarCategory: {
    fontSize: 11,
    color: '#8B5CF6',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  trendRadarTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  // Social bundles styles
  ultraModernSocialBundlesContainer: {
    marginBottom: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
  },
  ultraModernBundlesScroll: {
    paddingVertical: 10,
    marginTop: 20,
  },
  ultraModernBundleCard: {
    width: Platform.OS === 'web' ? 'auto' : '31%', // Responsive width
    aspectRatio: '4/5', // Elegant proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginRight: Platform.OS === 'web' ? 0 : 20, // Add margin for RN horizontal scroll, not for web grid
  },
  ultraModernBundleImageContainer: {
    height: '60%', // Image takes up 60% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernBundleCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernBundleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // Subtle overlay
  },
  ultraModernBundleContent: {
    height: '40%', // Content takes up 40% of card
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  ultraModernBundleTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  ultraModernBundleCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ultraModernCreatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  ultraModernCreatorName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginRight: 6,
  },
  ultraModernVerifiedBadge: {
    fontSize: 10,
    color: '#6366F1',
    backgroundColor: '#6366F115',
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  ultraModernBundleProductCount: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '400',
  },
  shopByVibeContainer: {
    marginBottom: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 24,
  },
  moodCard: {
    width: '48%',
    height: 200, // Increased height for better proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // More modern rounded corners
    marginBottom: 0,
    overflow: 'hidden',
    borderWidth: 0, // Remove border for cleaner look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, // Stronger shadow for better depth
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  moodCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F8F8',
    objectFit: 'cover', // For web - ensures proper aspect ratio
  },
  moodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))',
    backgroundColor: 'rgba(99,102,241,0.8)', // fallback
  },
  moodName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  moodDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 16,
  },
  categoryEntryContainer: {
    marginBottom: 20,
  },
  categoryScroll: {
    paddingVertical: 10,
    marginTop: 10,
  },
  categoryItem: {
    width: 120, // Fixed width instead of percentage for consistency
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 80, // Increased size for better visibility
    height: 80,
    borderRadius: 16, // More modern rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden', // Ensure images stay within bounds
    backgroundColor: '#F8F8F8', // Fallback background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 36,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500', // Lighter weight
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea', // fallback
    padding: 60,
    borderRadius: 0,
    marginBottom: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -1,
    lineHeight: 56,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 50,
    lineHeight: 30,
    textAlign: 'center',
    maxWidth: 600,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroStatLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backToDiscoveryButton: {
    backgroundColor: COLORS.accent2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  backToDiscoveryText: {
    color: COLORS.light,
    fontWeight: '600',
    fontSize: 16,
  },
  // Right Side Panel Styles (Lyst-inspired)
  rightSidePanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  rightPanelContent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 400,
    backgroundColor: '#FAFAFA',
    borderLeftWidth: 1,
    borderLeftColor: '#E8E8E8',
    paddingHorizontal: 30,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  rightPanelHeader: {
    marginBottom: 30,
  },
  rightPanelTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  rightPanelSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 40,
    lineHeight: 24,
  },
  closeRightPanel: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  closeRightPanelText: {
    fontSize: 20,
    color: '#999999',
    fontWeight: '300',
  },
  rightPersonaList: {
    gap: 20,
  },
  rightPersonaItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  rightPersonaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightEmojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rightItemEmoji: {
    fontSize: 24,
  },
  rightPersonaImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rightPersonaText: {
    flex: 1,
  },
  rightItemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  rightItemDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontWeight: '400',
  },
  rightSelectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSelectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Section Header Styles (Lyst-inspired)
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  sectionAction: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 40,
    lineHeight: 26,
  },
  refinedHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    zIndex: 10,
  },
  brandSection: {
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  brandTagline: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    marginBottom: 40,
    lineHeight: 24,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refinedSearchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontWeight: '300',
  },
  searchIconButton: {
    marginLeft: 10,
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    flex: 1,
    marginRight: 10,
  },
  selectorEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
  },
  selectorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  defaultSelectorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  premiumSearchContainer: {
    flex: 1,
    marginRight: 20,
    marginBottom: 20,
  },
  searchGlow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#6366F1',
    position: 'relative',
    overflow: 'hidden',
    // Web-specific neon glow effects
    ...(Platform.OS === 'web' && {
      boxShadow: `
        0 0 20px rgba(99, 102, 241, 0.3),
        0 0 40px rgba(99, 102, 241, 0.2),
        0 0 60px rgba(99, 102, 241, 0.1),
        inset 0 0 20px rgba(99, 102, 241, 0.05)
      `,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      transition: 'all 0.3s ease',
    }),
  },
  premiumSearchInput: {
    flex: 1,
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '400',
    letterSpacing: -0.2,
    outline: 'none',
    ...(Platform.OS === 'web' && {
      '&:focus': {
        outline: 'none',
      },
    }),
  },
  premiumSearchButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    ...(Platform.OS === 'web' && {
      boxShadow: `
        0 0 15px rgba(99, 102, 241, 0.4),
        0 0 30px rgba(99, 102, 241, 0.2)
      `,
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: `
          0 0 20px rgba(99, 102, 241, 0.5),
          0 0 40px rgba(99, 102, 241, 0.3)
        `,
      },
    }),
  },
  premiumSearchIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent1,
    marginBottom: 5,
  },
  brandText: {
    fontSize: 14,
    color: COLORS.midGray,
    marginBottom: 10,
  },
  modernProductGrid: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  gridHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingBottom: 10,
  },
  gridHeaderContent: {
    flexDirection: 'row', // Keep as row for overall layout
    justifyContent: 'space-between', // To push button to the right
    alignItems: 'flex-start', // Align items to the top for the new stacked title
    paddingBottom: 10, // Keep some padding below the entire header block
  },
  personaGridHeaderContainer: {
    // This container will now hold the label, title, and subtitle
    marginBottom: 0, // Remove bottom margin as it's handled by gridHeaderContent padding
  },
  personaGridHeaderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999', // Matches "TRENDING" label
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4, // Space between label and main title
  },
  personaGridHeaderTitle: { // For the main persona name, styled like "What's Hot Now"
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 4, // Add space between title and subtitle
  },
  gridTitle: { // Will be repurposed for the main title part or removed if not needed
    fontSize: 24, // Keep as a fallback or for non-persona views
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  gridSubtitle: { // This will be used for the product count under the main title
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    // marginBottom: 5, // Removed, spacing handled by container/title
  },
  elegantBackButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  elegantBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modernProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modernProductCardSmallScreen: { // New style for small screens
    width: '98%', 
  },
  studentProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // Consistent with modernProductCard
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, // Softer shadow
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA', // Light, subtle border
    overflow: 'hidden',
  },
  studentProductCardSmallScreen: { // New style for student cards on small screens
    width: '98%',
  },
  productImageContainer: {
    height: 200,
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 15,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#FF9500',
  },
  viralBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viralBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productInfo: {
    padding: 15,
  },
  brandName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  trendingStatsText: {
    fontSize: 12,
    color: COLORS.midGray,
    lineHeight: 16,
  },
  hotTakeContainer: {
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 6,
  },
  hotTakeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  hotTakeText: {
    fontSize: 12,
    color: COLORS.midGray,
    lineHeight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent1,
  },
  rating: {
    fontSize: 12,
    color: '#FF9500',
  },
  shopButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  studentContent: {
    marginBottom: 10,
  },
  studentReviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  studentReview: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  whyStudentsLoveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  whyStudentsLove: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  studentShopButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  studentShopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  noProductsMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.accent1,
    textAlign: 'center',
    marginBottom: 10,
  },
  noProductsSubtext: {
    fontSize: 16,
    color: COLORS.accent2,
    textAlign: 'center',
    lineHeight: 22,
  },

  // REFINED Student Persona Specific Product Card Styles (Ultra Luxury / Minimalist)
  studentProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // Consistent with modernProductCard
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, // Softer shadow
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA', // Light, subtle border
    overflow: 'hidden',
  },
  studentImageContainer: { // Same as productImageContainer for consistency
    height: 200,
    position: 'relative',
    backgroundColor: '#F8F8F8', // Consistent placeholder color
  },
  studentInfo: {
    padding: 20, // More padding for a spacious feel
  },
  studentBrandName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#555555', // Medium grey
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studentProductName: {
    fontSize: 18, // Slightly larger for better readability
    fontWeight: '500', // Refined weight
    color: '#2C3E50', // Dark, sophisticated grey/blue
    marginBottom: 10,
    lineHeight: 24,
  },
  studentPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentCurrentPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: '#00796B', // Deep teal/green for value, but sophisticated
  },
  studentRating: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFA000', // Muted gold/amber for rating star
  },
  studentExclusiveContent: {
    marginTop: 10, // Add some space before this section
    marginBottom: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Very subtle separator
  },
  studentReviewText: {
    fontSize: 14,
    color: '#555555',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 10,
  },
  studentWhyLoveText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  studentDealButton: {
    backgroundColor: '#2C3E50', // Dark sophisticated grey/blue
    paddingVertical: 12,
    paddingHorizontal: 15, 
    borderRadius: 6, // Slightly more refined radius
    alignItems: 'center',
    marginTop: 10, // Space before button
  },
  studentDealButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  studentGridTitle: { // Refined student grid title
    fontSize: 26, // Slightly reduced for elegance
    fontWeight: '300', // Lighter font weight for luxury feel
    color: '#2C3E50',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'sans-serif-light',
    letterSpacing: 0.5,
  },
  studentGridSubtitle: { // Refined student grid subtitle
    fontSize: 14,
    color: '#555555',
    fontWeight: '400',
  },
  // NEON Back Button Styles (Inspired by Search Bar)
  neonBackButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12, // Match search button
    backgroundColor: '#FFFFFF', // Light base
    borderWidth: 1, // Subtle border
    borderColor: '#6366F180', // Neon color with some transparency
    shadowColor: '#6366F1', // This shadow will apply on native
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' ? { // Web-specific base styles
      cursor: 'pointer',
      transition: 'all 0.2s ease', // Basic transition for web
    } : {}),
  },
  neonBackButtonText: {
    color: '#6366F1', // Neon color for text
    fontSize: 14,
    fontWeight: '500', // Refined weight
    letterSpacing: 0.5,
  },
  // Specific style for the empty state back button to allow centering if needed
  emptyStateNeonBackButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    borderRadius: 12, 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#6366F180', 
    shadowColor: '#6366F1', // This shadow will apply on native
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
    ...(Platform.OS === 'web' ? { // Web-specific base styles
      cursor: 'pointer',
      transition: 'all 0.2s ease', // Basic transition for web
    } : {}),
  },
  // Styles for Persona Exclusive Content in modernProductCard
  personaExclusiveContentContainer: {
    marginTop: 10,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Subtle separator
  },
  personaInsightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  personaInsightText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  // Styles for New Minimalist Buttons
  productCardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16, // Add some space above the buttons
    gap: 10, // Space between the two buttons
  },
  minimalistButtonShared: { // Base style for both buttons
    flex: 1, // Allow buttons to share space
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40, // Ensure a decent tap target height
  },
  minimalistButtonPrimary: { // For "Shop on Brand Website"
    backgroundColor: '#FFFFFF',
    borderColor: '#6366F1', // Primary neon accent
  },
  minimalistButtonSecondary: { // For "Shop with Curator Agent"
    backgroundColor: '#F7F7FA', // Very light neutral
    borderColor: '#DCDCE0', // Softer neutral border
  },
  buttonTextShared: { // Base text style for both buttons
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#6366F1', // Primary neon accent
  },
  buttonTextSecondary: {
    color: '#2C2C38', // Clear, dark text
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0', // Lighter separator
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 16,
  },
  buyNowButton: { // This style might be repurposed or removed if the new buttons fully replace it
    backgroundColor: COLORS.accent1, // Or primary neon color
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flexGrow: 1, // Allow it to take available space if other items are fixed
    marginLeft: 10, // if actionButtons are present
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '600',
  },

  // Back of the card styles
  cardContentBack: {
    padding: 20,
    minHeight: 380,
  },
  backButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.darkGray,
  },
  backProductTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  backProductPrice: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  highlightsContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
  },
  highlightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  highlightsText: {
    fontSize: 14,
    color: COLORS.midGray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 15,
  },
  insightBar: {
    marginBottom: 15,
  },
  insightBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  insightBarLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  insightBarValue: {
    fontSize: 14,
    color: COLORS.midGray,
    fontWeight: '600',
  },
  insightBarTrack: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  insightBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  backFooter: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  whyBuyThisContainer: {
    marginBottom: 10,
  },
  whyBuyThisText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign: 'left',
    padding: 12,
    backgroundColor: 'linear-gradient(135deg, #F8F9FF 0%, #E8EFFF 100%)', // Light gradient background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8F4',
    letterSpacing: 0.3,
    // For web, add these properties
    ...(Platform.OS === 'web' ? {
      backgroundImage: 'linear-gradient(135deg, #F8F9FF 0%, #E8EFFF 100%)',
      backgroundColor: '#F8F9FF', // Fallback
    } : {
      backgroundColor: '#F8F9FF', // Solid color for mobile
    }),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    objectFit: 'cover', // For web - prevents image stretching
    backgroundColor: '#F8F8F8', // Fallback background
  },
  ultraModernSectionHeader: {
    backgroundColor: 'transparent',
    padding: 0,
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 48,
    paddingBottom: 0,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  ultraModernSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ultraModernSectionTitle: {
    fontSize: 42,
    fontWeight: '200',
    color: '#1A1A1A',
    letterSpacing: -1.2,
    lineHeight: 48,
    marginBottom: 16,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' : 'System',
  },
  ultraModernSectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 24,
    maxWidth: 480,
    fontStyle: 'italic',
  },
  modernSeeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  modernSeeAllText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  modernSeeAllArrow: {
    fontSize: 16,
    color: '#1A1A1A',
    transform: [{ translateX: 0 }],
    transition: 'transform 0.2s ease',
  },
  ultraModernMoodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns for better spacing
    gap: '32px',
    marginTop: 0,
    ...(Platform.OS !== 'web' ? {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      // No gap property for React Native, margin on items will handle it
    } : {}),
  },
  ultraModernMoodCard: {
    width: Platform.OS === 'web' ? 'auto' : '31%', // Responsive width
    aspectRatio: '4/5', // Elegant proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginBottom: Platform.OS === 'web' ? 0 : 20, // Add margin for RN flexbox grid
  },
  ultraModernMoodImageContainer: {
    height: '60%', // Image takes up 60% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernMoodCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernMoodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // Subtle overlay
  },
  ultraModernMoodContent: {
    height: '40%', // Content takes up 40% of card
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  moodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  ultraModernMoodName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    flex: 1,
  },
  cursiveDescription: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? '"Playfair Display", Georgia, serif' : 'System',
  },
  philosophyText: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '400',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ultraModernMainHeader: {
    backgroundColor: 'transparent',
    padding: 0,
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    marginBottom: 48,
    paddingBottom: 0,
  },
  mainHeaderContent: {
    flexDirection: 'column',
    gap: 40,
  },
  brandSection: {
    marginBottom: 0,
  },
  ultraModernHeaderControls: {
    flexDirection: 'column',
    gap: 24,
  },
  ultraModernProductHeaderControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 24,
  },
  ultraModernSearchContainer: {
    width: '100%',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  ultraModernSearchInput: {
    flex: 1,
    height: 56,
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '400',
    letterSpacing: -0.2,
    outline: 'none',
    ...(Platform.OS === 'web' && {
      outline: 'none',
    }),
  },
  ultraModernSearchButton: {
    padding: 8,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    fontSize: 20,
    color: '#666666',
  },
  ultraModernSelectorRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  ultraModernSelector: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  ultraModernSelectorActive: {
    borderColor: '#6366F1',
    backgroundColor: '#F8F9FF',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ultraModernSelectorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  ultraModernDefaultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  selectorTextContainer: {
    flex: 1,
  },
  ultraModernSelectorLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ultraModernSelectorValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 18,
  },
  ultraModernBrandLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ultraModernBrandTitle: {
    fontSize: 42,
    fontWeight: '200',
    color: '#1A1A1A',
    letterSpacing: -1.2,
    lineHeight: 48,
    marginBottom: 16,
    fontFamily: Platform.OS === 'web' ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' : 'System',
  },
  ultraModernBrandTagline: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 24,
    maxWidth: 480,
    fontStyle: 'italic',
  },
  ultraModernCategoryContainer: {
    marginBottom: 120,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 40,
    paddingTop: 60,
    shadowColor: 'transparent',
  },
  ultraModernCategoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns for better spacing
    gap: '32px',
    marginTop: 0,
    ...(Platform.OS !== 'web' ? {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      // No gap property for React Native, margin on items will handle it
    } : {}),
  },
  ultraModernCategoryItem: {
    width: Platform.OS === 'web' ? 'auto' : '31%', // Responsive width
    aspectRatio: '4/5', // Elegant proportions
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginBottom: Platform.OS === 'web' ? 0 : 20, // Add margin for RN flexbox grid
  },
  ultraModernCategoryIcon: {
    height: '60%', // Image takes up 60% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernCategoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernCategoryName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: -0.3,
    padding: 24,
    paddingBottom: 8,
  },
  ultraModernCategoryDescription: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
    fontFamily: Platform.OS === 'web' ? '"Playfair Display", Georgia, serif' : 'System',
  },
  ultraModernTrendRadarContainer: {
    marginBottom: 120,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 40,
    paddingTop: 60,
    shadowColor: 'transparent',
  },
  ultraModernTrendRadarGrid: {
    // marginTop: 20, // Using ScrollView's own spacing if needed
    // gap: 24, // Using marginRight on cards for horizontal scroll
    // For React Native, horizontal scroll setup
    ...(Platform.OS !== 'web' && {
      // Default to vertical grid on RN unless overridden by small screen ScrollView
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
    // For Web, keep it as a grid or flex container that wraps
    ...(Platform.OS === 'web' && {
      display: 'flex',
      flexDirection: 'row', 
      flexWrap: 'wrap', // Default to wrap for larger screens
      justifyContent: 'space-between',
      gap: 24, 
    }),
  },
  ultraModernTrendRadarGridSmallScreen: { // This style applies to the View when isSmallScreen is true BUT NOT using ScrollView
    // If we ever have a non-ScrollView small screen version, this would apply.
    // For now, it's not directly used by the ScrollView setup.
    // We might use it for the ScrollView's contentContainerStyle if padding is needed.
    flexDirection: 'row', // Ensures items are in a row for ScrollView logic to work if this style is repurposed
    // No flexWrap: 'nowrap' here, ScrollView handles that
    // justifyContent: 'flex-start', // ScrollView handles this
  },
  ultraModernTrendRadarGridSmallScreenScrollViewContent: { // Style for ScrollView contentContainerStyle
    paddingHorizontal: 20, // Example: Add some padding to the start/end of the scrollable content
    paddingVertical: 10,   // Example: Vertical padding if needed
  },
  ultraModernTrendRadarCard: {
    width: Platform.OS === 'web' ? 'auto' : '48%', // Responsive width
    aspectRatio: '3/2', // Wider aspect ratio for trending items
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More sophisticated rounded corners
    overflow: 'hidden',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth hover effect
    cursor: 'pointer',
    marginRight: Platform.OS === 'web' ? 0 : 20, // Add margin for RN horizontal scroll, not for web grid
  },
  ultraModernTrendRadarImageContainer: {
    height: '70%', // Image takes up 70% of card
    position: 'relative',
    backgroundColor: '#F8F8F8',
  },
  ultraModernTrendRadarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'contrast(1.1) saturate(1.2)', // Enhanced image quality
  },
  ultraModernViralBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ultraModernViralBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ultraModernTrendOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ultraModernTrendChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ultraModernTrendRadarContent: {
    height: '30%', // Content takes up 30% of card
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ultraModernTrendRadarCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  ultraModernTrendRadarTitle: {
    fontSize: 18, // Default size
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  ultraModernTrendRadarSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  ultraModernTrendPercentageContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ultraModernTrendPercentage: {
    color: '#FFFFFF',
    fontSize: 13, // Default size
    fontWeight: 'bold',
    marginRight: 4,
  },
  ultraModernTrendLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12, // Default size
    fontWeight: '500',
  },
  ultraModernBundleName: {
    fontSize: 20, // Default size
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  ultraModernBundleCuratorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom
    paddingTop: 8,
  },
  ultraModernBundleCuratorAvatar: {
    width: 24, // Default size
    height: 24, // Default size
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: COLORS.lightGray, // Placeholder
  },
  ultraModernBundleCuratorName: {
    fontSize: 13, // Default size
    color: COLORS.midGray,
    fontWeight: '500',
  },
  ultraModernTrendRadarCardSmallScreen: {
    // width is handled dynamically inline for horizontal scroll, so remove fixed width here.
    aspectRatio: '1.1', // Adjusted for horizontal scroll, makes it slightly wider than tall (was 16/9)
    marginBottom: 0, // No bottom margin for horizontal scroll items (was 20)
    // marginRight is handled dynamically inline for horizontal scroll items
  },
  // New Small Screen Styles for Trend Radar Content
  ultraModernTrendRadarTitleSmallScreen: {
    fontSize: 22, // Increased size
  },
  ultraModernTrendPercentageSmallScreen: {
    fontSize: 15, // Increased size
  },
  ultraModernTrendLabelSmallScreen: {
    fontSize: 14, // Increased size
  },
  // New Small Screen Styles for Social Bundle Content
  ultraModernBundleNameSmallScreen: {
    fontSize: 22, // Increased size
  },
  ultraModernBundleCuratorAvatarSmallScreen: {
    width: 30, // Increased size
    height: 30, // Increased size
    borderRadius: 15,
  },
  ultraModernBundleCuratorNameSmallScreen: {
    fontSize: 15, // Increased size
  },
  // Responsive margins for main section containers
  ultraModernSectionContainerMarginSmallScreen: {
    marginBottom: 60, // Reduced margin for small screens
  },
  ultraModernDiscoveryContainerPaddingSmallScreen: { // For the main discovery container itself
    paddingHorizontal: 20, // Reduced horizontal padding for the whole discovery page on small screens
  },
  ultraModernMoodNameSmallScreen: {
    fontSize: 20, // Increased from 16px
    paddingBottom: 4,
  },
  cursiveDescriptionSmallScreen: {
    fontSize: 15, // Increased from 13px
    lineHeight: 20, // Adjusted line height
  },
  philosophyTextSmallScreen: {
    fontSize: 12, // Increased from 10px
    lineHeight: 16, // Adjusted line height
  },
  moodEmojiSmallScreen: { // New style for emoji on small screens
    fontSize: 24, // Increased size
  },
  ultraModernMoodContentSmallScreen: { // New style for mood content area on small screens
    padding: 16, // Reduced padding from 24px
    height: 'auto', // More flexible height
  },
  ultraModernCategoryGridSmallScreen: {
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns for small screens
    gap: '20px', // Slightly smaller gap for smaller screens
    ...(Platform.OS !== 'web' && {
      // On React Native, if using flexbox for this grid on small screens:
      // No specific changes needed if the base ultraModernCategoryGrid already handles RN row wrapping well.
      // If category cards have fixed widths, might adjust justifyContent or rely on margins.
    }),
  },
  ultraModernCategoryNameSmallScreen: {
    fontSize: 18, // Increased from 16px
    paddingBottom: 2, // Reduced padding
    paddingHorizontal: 8, // Added horizontal padding adjustment
  },
  ultraModernCategoryDescriptionSmallScreen: {
    fontSize: 15, // Increased from 13px
    lineHeight: 20, // Adjusted line height
    paddingHorizontal: 8, // Added horizontal padding adjustment
    paddingBottom: 12, // Reduced bottom padding
  },
  ultraModernBundleCardSmallScreen: { // Around line 5626
    // width is handled dynamically inline (screenWidth * 0.75)
    aspectRatio: '4/5', // Good proportion for image + text content
    marginBottom: 0,    // No bottom margin for items in a horizontal scroll
    // marginRight is likely handled by the ScrollView's children or could be added dynamically if needed
  },
  ultraModernMoodsGridSmallScreen: { // This was recently added correctly
    flexDirection: 'row', // Ensures items are in a row
    // For a wrapped row on small screens (if not using ScrollView)
    // flexWrap: 'wrap', 
    // justifyContent: 'space-around',
    // Remove grid properties for small screen if relying on flex for ScrollView or wrapped row
    // gridTemplateColumns: undefined, 
    // gap: 16, 
  },
  ultraModernMoodsGridSmallScreenScrollViewContent: { // Style for ScrollView contentContainerStyle
    paddingHorizontal: 20, // Add some padding to the start/end of the scrollable content
    paddingVertical: 10,   // Vertical padding if needed
  },
  ultraModernMoodCardSmallScreen: { // Specific style for mood cards on small screens (when in horizontal scroll)
      // width is handled dynamically inline
      aspectRatio: '4/5', // Keeping the original elegant proportion, adjust if text overflows
      marginBottom: 0, // No bottom margin for horizontal scroll items
      // marginRight is handled dynamically inline
  },
  });

// Placeholder components to fix missing component errors
const FloatingPersonaSelector = ({ personas, selectedPersona, onSelectPersona, visible }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.floatingPersonaSelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {personas.map((persona) => (
          <TouchableOpacity
            key={persona.id}
            style={[
              styles.floatingPersonaItem,
              selectedPersona?.id === persona.id && styles.floatingPersonaItemSelected
            ]}
            onPress={() => onSelectPersona(persona)}
          >
            <Text style={styles.floatingPersonaEmoji}>{persona.emoji}</Text>
            <Text style={styles.floatingPersonaName}>{persona.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const TrendRadar = ({ items, onItemPress, onSeeAll }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 768;

  // Inline styles for small screens - TODO: Refactor to StyleSheet
  const cardWidthSmallScreen = isSmallScreen ? screenWidth * 0.75 : undefined;
  const cardMarginRightSmallScreen = isSmallScreen ? 16 : 0;

  // Adjusted font sizes for card content on small screens
  const cardTitleSmallScreenStyle = isSmallScreen ? { fontSize: 16, lineHeight: 20 } : {};
  const cardSubtitleSmallScreenStyle = isSmallScreen ? { fontSize: 12, lineHeight: 16 } : {};
  const cardPercentageSmallScreenStyle = isSmallScreen ? { fontSize: 14 } : {};
  const cardLabelSmallScreenStyle = isSmallScreen ? { fontSize: 11 } : {};
  const cardContentAreaSmallScreenStyle = isSmallScreen ? { paddingTop: 10, paddingBottom: 10, paddingHorizontal: 10 } : {};

  const radarItemsContent = items.map((item, index) => (
    <TouchableOpacity 
      key={index} 
      style={[
        styles.ultraModernTrendRadarCard,
        isSmallScreen && styles.ultraModernTrendRadarCardSmallScreen, // Applies small screen specific base styles like aspectRatio
        isSmallScreen && { width: cardWidthSmallScreen, marginRight: cardMarginRightSmallScreen } // Dynamic width and margin
      ]}
      onPress={() => onItemPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.ultraModernTrendRadarImage} resizeMode="cover" />
      <View style={styles.ultraModernTrendRadarOverlay} />
      <View style={[styles.ultraModernTrendRadarContent, cardContentAreaSmallScreenStyle]}>
        <Text style={[styles.ultraModernTrendRadarTitle, cardTitleSmallScreenStyle]} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.ultraModernTrendRadarSubtitle, cardSubtitleSmallScreenStyle]} numberOfLines={1} ellipsizeMode="tail">
            {item.subtitle}
          </Text>
        )}
      </View>
      {item.trendingStats && (
          <View style={styles.ultraModernTrendPercentageContainer}>
            <Text style={[styles.ultraModernTrendPercentage, cardPercentageSmallScreenStyle]}>
              {item.trendingStats.match(/↗\s*(\d+%)/)?.[1] || ''}
            </Text>
            <Text style={[styles.ultraModernTrendLabel, cardLabelSmallScreenStyle]}>
              {item.hotTake ? 'DEEP DIVE' : (item.trendingStats.includes('searches') ? 'Surge' : 'Viral')}
            </Text>
          </View>
      )}
    </TouchableOpacity>
  ));

  return (
    <View style={styles.ultraModernTrendRadarContainer}>
      <View style={styles.ultraModernSectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text style={styles.ultraModernSectionLabel}>TRENDING</Text>
          <Text style={styles.ultraModernSectionTitle}>What's Hot Now 🔥</Text>
        </View>
        {/* <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllButtonText}>View All Trends</Text>
        </TouchableOpacity> */}
      </View>
      {isSmallScreen ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ultraModernTrendRadarGridSmallScreenScrollViewContent}>
          {radarItemsContent}
        </ScrollView>
      ) : (
        <View style={styles.ultraModernTrendRadarGrid}>
          {radarItemsContent}
        </View>
      )}
    </View>
  );
};

// Persona Selection Panel Component
const PersonaSelectionPanel = ({ visible, onClose, personas, selectedPersona, onSelectPersona }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.rightSidePanel}>
      <TouchableOpacity style={styles.panelBackdrop} onPress={onClose} />
      <View style={styles.rightPanelContent}>
        <View style={styles.rightPanelHeader}>
          <Text style={styles.rightPanelTitle}>Choose Your Style</Text>
          <TouchableOpacity style={styles.closeRightPanel} onPress={onClose}>
            <Text style={styles.closeRightPanelText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.rightPanelSubtitle}>
          Personalize your discovery experience
        </Text>
        
        <View style={styles.rightPersonaList}>
          {personas.map((persona) => (
            <TouchableOpacity
              key={persona.id}
              style={[
                styles.rightPersonaItem,
                selectedPersona?.id === persona.id && { 
                  backgroundColor: `${persona.color}15`,
                  borderColor: persona.color 
                }
              ]}
              onPress={() => {
                onSelectPersona(persona);
                onClose();
              }}
            >
              <View style={styles.rightPersonaContent}>
                <View style={[styles.rightEmojiCircle, { backgroundColor: `${persona.color}20` }]}>
                  <Image 
                    source={{ uri: persona.icon }}
                    style={styles.rightPersonaImage}
                  />
                </View>
                <View style={styles.rightPersonaText}>
                  <Text style={styles.rightItemName}>{persona.name}</Text>
                  <Text style={styles.rightItemDescription}>{persona.description}</Text>
                </View>
                {selectedPersona?.id === persona.id && (
                  <View style={[styles.rightSelectedBadge, { backgroundColor: persona.color }]}>
                    <Text style={styles.rightSelectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Life Moment Selection Panel Component
const LifeMomentSelectionPanel = ({ visible, onClose, lifeMoments, selectedLifeMoment, onSelectLifeMoment }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.rightSidePanel}>
      <TouchableOpacity style={styles.panelBackdrop} onPress={onClose} />
      <View style={styles.rightPanelContent}>
        <View style={styles.rightPanelHeader}>
          <Text style={styles.rightPanelTitle}>Choose Your Moment</Text>
          <TouchableOpacity style={styles.closeRightPanel} onPress={onClose}>
            <Text style={styles.closeRightPanelText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.rightPanelSubtitle}>
          Find products perfect for your life stage
        </Text>
        
        <View style={styles.rightPersonaList}>
          {lifeMoments.map((moment) => (
            <TouchableOpacity
              key={moment.id}
              style={[
                styles.rightPersonaItem,
                selectedLifeMoment?.id === moment.id && { 
                  backgroundColor: `${moment.color}15`,
                  borderColor: moment.color 
                }
              ]}
              onPress={() => {
                onSelectLifeMoment(moment);
                onClose();
              }}
            >
              <View style={styles.rightPersonaContent}>
                <View style={[styles.rightEmojiCircle, { backgroundColor: `${moment.color}20` }]}>
                  <Image 
                    source={{ uri: moment.icon }}
                    style={styles.rightPersonaImage}
                  />
                </View>
                <View style={styles.rightPersonaText}>
                  <Text style={styles.rightItemName}>{moment.name}</Text>
                  <Text style={styles.rightItemDescription}>{moment.description}</Text>
                </View>
                {selectedLifeMoment?.id === moment.id && (
                  <View style={[styles.rightSelectedBadge, { backgroundColor: moment.color }]}>
                    <Text style={styles.rightSelectedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Placeholder function for fetching AI curated products
async function fetchAiCuratedProducts(selectedBrands, personaStyle, personaBudget, lookingFor) {
  console.log("Fetching AI Curated Products with:", {
    selectedBrands,
    personaStyle,
    personaBudget,
    lookingFor
  });

  let prompt = `You are "Curator," an expert AI shopping assistant specializing in ultra-modern, minimalist, and high-quality tech, lifestyle, and design products. Your goal is to curate a personalized shopping bundle for a user.

User Preferences:
- Liked Brands: ${selectedBrands.length > 0 ? selectedBrands.join(', ') : 'None specified'}
- Desired Style: ${personaStyle || 'Not specified'}
- Budget Indication: ${personaBudget || 'Not specified'}
- Specifically LookingFor: ${lookingFor || 'A general collection based on style and brands'}

Based on these preferences, please generate a list of 3-5 unique product recommendations. For each product, provide:
1.  title: A concise and appealing product title (e.g., "Minimalist Smart Desk Lamp").
2.  brand: The brand of the product (e.g., "Luminoir"). If it's a conceptual product, invent a plausible brand name.
3.  whyBuyThis: A short, compelling sales pitch (1-2 sentences, max 150 characters) highlighting its key benefit or unique selling proposition, using modern language and potentially an emoji if appropriate (e.g., "💡 Smart illumination meets sleek design. Control brightness and color temperature via app for the perfect ambiance.").
4.  category: A relevant category (e.g., 'home', 'tech', 'audio', 'accessories', 'lifestyle', 'design').
5.  price: An estimated price as a string (e.g., "$129.99").
6.  image: A URL to a high-quality, relevant placeholder image (600x600px). You can use Unsplash URLs like 'https://images.unsplash.com/photo-XXXXXXXXXXXXX?w=600&h=600&fit=crop&crop=center'. Try to pick images that match the product concept.
7.  affiliateUrl: A placeholder URL like 'https://example.com/product-link'.

Return the response as a JSON array of objects. Example product object:
{
  "title": "Aura Smart Diffuser",
  "brand": "SereneScents",
  "whyBuyThis": "✨ Create a calming oasis. Ultrasonic tech meets app-controlled aromatherapy for ultimate relaxation.",
  "category": "home",
  "price": "$89.00",
  "image": "https://images.unsplash.com/photo-1604275980648-363d53333884?w=600&h=600&fit=crop&crop=center",
  "affiliateUrl": "https://example.com/aura-diffuser"
}

Do not include any introductory text or explanations outside of the JSON array itself. The output must be only the JSON array.
`;

  // Read API Key from environment variable
  const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;
  const API_URL = 'https://api.anthropic.com/v1/messages'; // Standard Claude Messages API endpoint

  if (!CLAUDE_API_KEY) {
    console.error("ERROR: REACT_APP_CLAUDE_API_KEY is not set. Please ensure it is defined in your .env file for local development, or in Netlify environment variables for production.");
    console.error("To fix for local development: Create a .env file in your project root with REACT_APP_CLAUDE_API_KEY=your_actual_key_here and restart your development server.");
    console.error("To fix for Netlify: Go to Site settings > Build & deploy > Environment, and add REACT_APP_CLAUDE_API_KEY with your key, then redeploy.");
    throw new Error("AI API key is missing. Please see console for setup instructions.");
  }

  console.log("---- ATTEMPTING ACTUAL LLM API CALL ----");
  console.log("Prompt being sent (first 500 chars):", prompt.substring(0,500));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01' 
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229", 
        max_tokens: 2048, 
        messages: [
          { role: "user", content: prompt } 
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LLM API Error Response:', errorData);
      let detailedErrorMessage = 'Failed to get a valid response from AI.';
      if (errorData && errorData.error && errorData.error.message) {
        detailedErrorMessage = `AI Error: ${errorData.error.message}`;
      } else if (errorData && errorData.detail) {
        detailedErrorMessage = `AI Error: ${errorData.detail}`;
      }
      throw new Error(detailedErrorMessage);
    }

    const data = await response.json();
    console.log("LLM API Success. Full response data:", data);
    
    if (data.content && data.content.length > 0 && data.content[0].text) {
      const productJsonString = data.content[0].text;
      console.log("LLM Response content (productJsonString):", productJsonString);
      try {
        let cleanedJsonString = productJsonString.trim();
        if (cleanedJsonString.startsWith('```json')) {
          cleanedJsonString = cleanedJsonString.substring(7);
          if (cleanedJsonString.endsWith('```')) {
            cleanedJsonString = cleanedJsonString.substring(0, cleanedJsonString.length - 3);
          }
        } else if (cleanedJsonString.startsWith('```')) {
            cleanedJsonString = cleanedJsonString.substring(3);
            if (cleanedJsonString.endsWith('```')) {
                cleanedJsonString = cleanedJsonString.substring(0, cleanedJsonString.length - 3);
            }
        }
        
        const generatedProducts = JSON.parse(cleanedJsonString.trim());
        console.log("Parsed generated products:", generatedProducts);
        return generatedProducts;
      } catch (parseError) {
        console.error("Error parsing JSON response from LLM:", parseError);
        console.error("Raw LLM response string that failed to parse:", productJsonString);
        throw new Error("AI returned an invalid JSON format. Check the console for the raw response. You may need to adjust the prompt or the AI model settings to ensure it *only* returns a valid JSON array.");
      }
    } else {
      console.error("Unexpected response structure from LLM. 'data.content[0].text' is missing or invalid:", data);
      throw new Error("AI returned an unexpected response structure. Check console for details.");
    }

  } catch (error) {
    console.error('Error fetching AI curated products:', error);
    if (error instanceof Error) {
        throw error; 
    } else {
        throw new Error('An unknown error occurred while communicating with the AI.');
    }
  }
}

// Initialize products on component mount
// ... existing code ...