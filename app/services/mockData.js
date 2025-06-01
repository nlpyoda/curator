// Mock product data for testing
export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: '$299.99',
    link: 'https://example.com/headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    features: '- Active noise cancellation\n- 30-hour battery life\n- Premium audio drivers\n- Comfortable over-ear design',
    whyBuy: 'These headphones offer exceptional sound quality and comfort for long listening sessions.',
    reviews: {
      amazon: 'Users love the sound quality and battery life. Some mention they are a bit heavy.',
      instagram: 'Influencers praise the sleek design and noise cancellation features.',
      marketplace: 'Highly rated for durability and customer service.'
    },
    prosAndCons: {
      pros: ['Excellent sound quality', 'Long battery life', 'Effective noise cancellation'],
      cons: ['Premium price point', 'Slightly heavy for extended wear']
    },
    lastUpdated: '2023-09-15',
    source: 'Amazon'
  },
  {
    id: '2',
    title: 'Smart Home Hub',
    price: '$129.99',
    link: 'https://example.com/smarthub',
    description: 'Central control for all your smart home devices with voice assistant integration.',
    features: '- Compatible with 100+ smart devices\n- Voice control\n- Scheduling and automation\n- Energy monitoring',
    whyBuy: 'This hub simplifies managing all your smart home devices from one central interface.',
    reviews: {
      amazon: 'Users appreciate the easy setup and wide compatibility.',
      instagram: 'Tech reviewers highlight the intuitive app interface.',
      marketplace: 'Buyers mention good value for the features offered.'
    },
    prosAndCons: {
      pros: ['Wide device compatibility', 'Easy setup', 'Reliable connection'],
      cons: ['Limited advanced automation without subscription']
    },
    lastUpdated: '2023-10-20',
    source: 'Best Buy'
  },
  {
    id: '3',
    title: 'Ultra HD Smart TV 55"',
    price: '$699.99',
    link: 'https://example.com/tv',
    description: 'Crystal clear 4K display with smart features and streaming apps built-in.',
    features: '- 4K Ultra HD resolution\n- HDR support\n- Built-in streaming apps\n- Voice remote',
    whyBuy: 'This TV offers excellent picture quality and smart features at a competitive price point.',
    reviews: {
      amazon: 'Customers love the picture quality and smart features.',
      instagram: 'Tech influencers praise the value for money.',
      marketplace: 'High ratings for picture quality and easy setup.'
    },
    prosAndCons: {
      pros: ['Excellent picture quality', 'User-friendly interface', 'Good value'],
      cons: ['Sound could be better', 'Limited gaming features']
    },
    lastUpdated: '2023-11-05',
    source: 'Walmart'
  },
  {
    id: '4',
    title: 'Professional Blender',
    price: '$199.99',
    link: 'https://example.com/blender',
    description: 'High-powered blender for smoothies, soups, and food processing.',
    features: '- 1500W motor\n- Variable speed control\n- Pulse function\n- Dishwasher-safe parts',
    whyBuy: 'This blender can handle any blending task with ease and is built to last.',
    reviews: {
      amazon: 'Customers praise its power and durability.',
      instagram: 'Food bloggers love the versatility and consistent results.',
      marketplace: 'High ratings for build quality and performance.'
    },
    prosAndCons: {
      pros: ['Powerful motor', 'Versatile functions', 'Easy to clean'],
      cons: ['Loud operation', 'Takes up counter space']
    },
    lastUpdated: '2023-08-12',
    source: 'Target'
  },
  {
    id: '5',
    title: 'Ergonomic Office Chair',
    price: '$249.99',
    link: 'https://example.com/chair',
    description: 'Adjustable office chair designed for comfort during long work sessions.',
    features: '- Adjustable lumbar support\n- Breathable mesh back\n- Adjustable armrests\n- 5-year warranty',
    whyBuy: 'This chair provides excellent support for long work days and helps prevent back pain.',
    reviews: {
      amazon: 'Users report reduced back pain and improved comfort.',
      instagram: 'Work-from-home professionals recommend for all-day comfort.',
      marketplace: 'Consistently rated highly for build quality and ergonomics.'
    },
    prosAndCons: {
      pros: ['Excellent lumbar support', 'Highly adjustable', 'Durable construction'],
      cons: ['Assembly takes time', 'Premium price point']
    },
    lastUpdated: '2023-07-30',
    source: 'Office Depot'
  },
  {
    id: '6',
    title: 'iPhone 15 Pro',
    price: '$999.00',
    link: 'https://apple.com/iphone-15-pro',
    description: 'Latest iPhone with titanium design, A17 Pro chip, and professional camera system.',
    features: '- A17 Pro chip\n- Titanium design\n- Pro camera system\n- USB-C connector\n- Action Button',
    whyBuy: '🍎 Latest iPhone with titanium design and pro features for creators and professionals.',
    reviews: {
      amazon: 'Users love the titanium build and improved camera capabilities.',
      instagram: 'Tech reviewers praise the natural titanium finish and USB-C upgrade.',
      marketplace: 'High ratings for performance and camera quality.'
    },
    prosAndCons: {
      pros: ['Premium titanium design', 'Exceptional camera system', 'Professional features'],
      cons: ['Premium pricing', 'No significant battery life improvement']
    },
    lastUpdated: '2024-01-15',
    source: 'Apple Store'
  },
  {
    id: '7',
    title: 'Air Jordan 1 Retro High',
    price: '$170.00',
    link: 'https://nike.com/jordan-1',
    description: 'Iconic basketball sneaker with timeless design and premium leather construction.',
    features: '- Premium leather upper\n- Classic colorways\n- Air-Sole cushioning\n- Rubber outsole\n- Iconic silhouette',
    whyBuy: '🏃‍♂️ Iconic basketball sneaker with timeless style that works with any outfit.',
    reviews: {
      amazon: 'Customers love the classic style and quality leather construction.',
      instagram: 'Sneaker enthusiasts consistently rank this as a must-have classic.',
      marketplace: 'High ratings for style, comfort, and durability.'
    },
    prosAndCons: {
      pros: ['Timeless design', 'Premium materials', 'Versatile styling'],
      cons: ['Can be stiff initially', 'Premium price point']
    },
    lastUpdated: '2024-01-10',
    source: 'Nike'
  },
  {
    id: '8', 
    title: 'Sony WH-1000XM5',
    price: '$399.00',
    link: 'https://sony.com/headphones/wh-1000xm5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality.',
    features: '- Industry-leading noise cancellation\n- 30-hour battery life\n- Multipoint connection\n- Speak-to-chat technology\n- Premium comfort',
    whyBuy: '🎵 Industry-leading noise cancellation with premium sound quality for audiophiles.',
    reviews: {
      amazon: 'Users consistently rate these as the best noise-canceling headphones available.',
      instagram: 'Audio reviewers praise the natural sound signature and comfort.',
      marketplace: 'Top ratings for noise cancellation and sound quality.'
    },
    prosAndCons: {
      pros: ['Best-in-class noise cancellation', 'Exceptional sound quality', 'All-day comfort'],
      cons: ['Premium price', 'Touch controls can be sensitive']
    },
    lastUpdated: '2024-01-05',
    source: 'Sony'
  },
  {
    id: '9',
    title: 'Dyson V15 Detect',
    price: '$749.00', 
    link: 'https://dyson.com/v15-detect',
    description: 'Powerful cordless vacuum with laser dust detection and advanced filtration.',
    features: '- Laser dust detection\n- HEPA filtration\n- 60-minute runtime\n- LCD display\n- Multiple attachments',
    whyBuy: '🌪️ Revolutionary laser technology reveals hidden dust for the most thorough clean.',
    reviews: {
      amazon: 'Users are amazed by the laser feature showing dust they never knew existed.',
      instagram: 'Home cleaning enthusiasts call it a game-changer for deep cleaning.',
      marketplace: 'High ratings for suction power and innovative features.'
    },
    prosAndCons: {
      pros: ['Innovative laser detection', 'Powerful suction', 'Comprehensive filtration'],
      cons: ['Premium price point', 'Heavy for extended use']
    },
    lastUpdated: '2024-01-08',
    source: 'Dyson'
  },
  {
    id: '10',
    title: 'Samsung Galaxy S24 Ultra',
    price: '$1,199.00',
    link: 'https://samsung.com/galaxy-s24-ultra',
    description: 'Premium Android smartphone with S Pen, AI features, and professional cameras.',
    features: '- S Pen included\n- AI photo editing\n- 200MP main camera\n- 5000mAh battery\n- Titanium frame',
    whyBuy: '📱 Most advanced Android phone with S Pen and AI features for productivity.',
    reviews: {
      amazon: 'Users love the S Pen functionality and camera versatility.',
      instagram: 'Tech reviewers highlight the AI features and display quality.',
      marketplace: 'High ratings for performance and camera capabilities.'
    },
    prosAndCons: {
      pros: ['S Pen functionality', 'Excellent cameras', 'Premium build quality'],
      cons: ['Large size', 'Premium pricing']
    },
    lastUpdated: '2024-01-12',
    source: 'Samsung'
  }
]; 