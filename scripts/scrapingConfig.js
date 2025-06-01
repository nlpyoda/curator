// Advanced Configuration for Smart Product Scraping System
// Focuses on high-velocity, deal-centric product discovery

export const SCRAPING_CONFIG = {
  // Execution schedule and performance settings
  SCHEDULE: {
    FULL_SCAN_INTERVAL: 6 * 60 * 60 * 1000, // Every 6 hours
    QUICK_SCAN_INTERVAL: 30 * 60 * 1000,    // Every 30 minutes for hot deals
    DEAL_ALERT_INTERVAL: 10 * 60 * 1000,    // Every 10 minutes for flash sales
    MAX_CONCURRENT_REQUESTS: 5,
    REQUEST_TIMEOUT: 15000 // 15 seconds
  },

  // Performance and rate limiting
  PERFORMANCE: {
    MAX_PRODUCTS_PER_RUN: 100,
    MAX_PAGES_PER_SITE: 3,
    BATCH_SIZE: 10,
    CACHE_TTL: 2 * 60 * 60 * 1000, // 2 hours
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000
  },

  // Deal quality thresholds
  DEAL_CRITERIA: {
    MIN_DISCOUNT_PERCENT: 10,
    MIN_SOCIAL_ENGAGEMENT: 5,
    MIN_PRICE: 25,
    MAX_PRICE: 5000,
    BLACKLIST_KEYWORDS: ['refurbished', 'used', 'broken', 'parts only', 'for repair'],
    PRIORITY_KEYWORDS: ['new', 'sealed', 'warranty', 'free shipping', 'limited time']
  },

  // Advanced data sources with smart fallbacks
  DATA_SOURCES: {
    // Tier 1: APIs (fastest, most reliable)
    APIS: [
      {
        name: 'Google Shopping API',
        endpoint: 'https://www.googleapis.com/customsearch/v1',
        enabled: true,
        priority: 100,
        rateLimit: 1000,
        dailyQuota: 100,
        reliability: 0.95
      },
      {
        name: 'Best Buy API',
        endpoint: 'https://api.bestbuy.com/v1/products',
        enabled: true,
        priority: 90,
        rateLimit: 2000,
        reliability: 0.90
      }
    ],

    // Tier 2: Deal aggregators (high deal focus)
    DEAL_AGGREGATORS: [
      {
        name: 'Slickdeals',
        baseUrl: 'https://slickdeals.net',
        endpoints: {
          frontpage: '/deals/frontpage',
          search: '/deals/search',
          api: '/api/1.0/deals'
        },
        selectors: {
          dealContainer: '.dealTile, .dealCard',
          title: '.dealTitle a, h3 a',
          price: '.dealPrice, .price',
          originalPrice: '.originalPrice, .strikethrough',
          discount: '.dealDiscount, .discount',
          votes: '.dealScore, .votes',
          store: '.dealStore, .merchant'
        },
        rateLimit: 3000,
        priority: 85,
        reliability: 0.85
      },
      {
        name: 'RetailMeNot',
        baseUrl: 'https://www.retailmenot.com',
        endpoints: {
          deals: '/deals',
          coupons: '/coupons'
        },
        rateLimit: 2500,
        priority: 80,
        reliability: 0.80
      }
    ],

    // Tier 3: Social signals (trending detection)
    SOCIAL_SOURCES: [
      {
        name: 'Reddit',
        subreddits: [
          { name: 'deals', weight: 1.0, minScore: 10 },
          { name: 'buildapcsales', weight: 1.2, minScore: 20 },
          { name: 'frugalmalefashion', weight: 0.8, minScore: 5 },
          { name: 'apple', weight: 1.1, minScore: 15 },
          { name: 'headphones', weight: 1.0, minScore: 10 }
        ],
        api: 'https://reddit.com/r/{subreddit}/{sort}.json',
        sorts: ['hot', 'top'],
        rateLimit: 2000,
        priority: 70
      },
      {
        name: 'Twitter Deals',
        accounts: ['dealsdotcom', 'dealnews', 'slickdeals'],
        keywords: ['deal', 'sale', 'discount', 'off'],
        priority: 60
      }
    ],

    // Tier 4: Price comparison sites
    COMPARISON_SITES: [
      {
        name: 'PriceGrabber',
        baseUrl: 'https://www.pricegrabber.com',
        searchEndpoint: '/search',
        rateLimit: 4000,
        priority: 50
      },
      {
        name: 'Shopzilla',
        baseUrl: 'https://www.shopzilla.com',
        searchEndpoint: '/search',
        rateLimit: 3500,
        priority: 45
      }
    ]
  },

  // Brand-specific configurations with smart targeting
  BRAND_CONFIGS: {
    'Apple': {
      priority: 100,
      hotProducts: [
        { name: 'iPhone 15', keywords: ['iphone 15', 'iphone15'], seasonality: 'high' },
        { name: 'MacBook Air', keywords: ['macbook air', 'mba'], seasonality: 'medium' },
        { name: 'AirPods Pro', keywords: ['airpods pro', 'airpods 2nd gen'], seasonality: 'high' },
        { name: 'Apple Watch', keywords: ['apple watch', 'watch series'], seasonality: 'medium' }
      ],
      priceRanges: { min: 99, max: 4000 },
      dealThreshold: 0.08, // 8% minimum discount
      sources: ['apis', 'deal_aggregators', 'social'],
      blackFriday: { dealThreshold: 0.15, priority: 150 }
    },
    
    'Nike': {
      priority: 95,
      hotProducts: [
        { name: 'Air Jordan', keywords: ['air jordan', 'jordan 1', 'jordan 4'], seasonality: 'high' },
        { name: 'Air Force 1', keywords: ['air force 1', 'af1'], seasonality: 'medium' },
        { name: 'Dunk', keywords: ['nike dunk', 'dunk low', 'dunk high'], seasonality: 'high' },
        { name: 'Air Max', keywords: ['air max', '90', '97', '270'], seasonality: 'medium' }
      ],
      priceRanges: { min: 60, max: 500 },
      dealThreshold: 0.12,
      sources: ['social', 'deal_aggregators', 'comparison'],
      releaseCalendar: true // Track new releases
    },

    'Sony': {
      priority: 90,
      hotProducts: [
        { name: 'WH-1000XM5', keywords: ['wh-1000xm5', 'sony headphones'], seasonality: 'high' },
        { name: 'PlayStation 5', keywords: ['ps5', 'playstation 5'], seasonality: 'critical' },
        { name: 'Alpha Camera', keywords: ['sony alpha', 'a7r', 'fx'], seasonality: 'low' }
      ],
      priceRanges: { min: 100, max: 3000 },
      dealThreshold: 0.10,
      sources: ['apis', 'deal_aggregators']
    },

    'Bose': {
      priority: 85,
      hotProducts: [
        { name: 'QuietComfort', keywords: ['quietcomfort', 'qc45', 'qc35'], seasonality: 'high' },
        { name: 'SoundLink', keywords: ['soundlink', 'revolve'], seasonality: 'medium' }
      ],
      priceRanges: { min: 80, max: 600 },
      dealThreshold: 0.15,
      sources: ['deal_aggregators', 'comparison']
    },

    'Dyson': {
      priority: 80,
      hotProducts: [
        { name: 'V15 Detect', keywords: ['v15 detect', 'dyson v15'], seasonality: 'medium' },
        { name: 'Airwrap', keywords: ['airwrap', 'hair styler'], seasonality: 'high' },
        { name: 'Supersonic', keywords: ['supersonic', 'hair dryer'], seasonality: 'medium' }
      ],
      priceRanges: { min: 200, max: 800 },
      dealThreshold: 0.12,
      sources: ['deal_aggregators', 'social']
    }
  },

  // Advanced filtering and ranking algorithms
  RANKING_ALGORITHM: {
    weights: {
      brandPriority: 0.25,      // How hot is this brand?
      discountPercentage: 0.30,  // How good is the deal?
      socialEngagement: 0.20,    // How much buzz?
      pricePoint: 0.10,         // Is it in the sweet spot?
      recency: 0.10,            // How fresh is this deal?
      reliability: 0.05         // How trustworthy is the source?
    },
    
    bonuses: {
      newProduct: 50,           // Bonus for recently released items
      limitedTime: 30,          // Bonus for flash sales
      freeShipping: 15,         // Bonus for free shipping
      warrantyIncluded: 10,     // Bonus for warranty
      authenticRetailer: 20     // Bonus for official retailers
    },
    
    penalties: {
      refurbished: -30,         // Penalty for refurb items
      noReturns: -20,          // Penalty for no return policy
      unknownSeller: -25,       // Penalty for sketchy sellers
      expiredDeal: -100         // Major penalty for expired deals
    }
  },

  // Smart caching and database optimization
  DATABASE: {
    TABLES: {
      products: 'Product',
      deals: 'ProductDeals',
      priceHistory: 'PriceHistory',
      brandPersonas: 'brand_personas'
    },
    
    CACHE_STRATEGY: {
      hotDeals: 5 * 60 * 1000,     // 5 minutes for hot deals
      regularProducts: 30 * 60 * 1000, // 30 minutes for regular products
      priceHistory: 24 * 60 * 60 * 1000, // 24 hours for price history
      socialSignals: 15 * 60 * 1000     // 15 minutes for social data
    },
    
    CLEANUP: {
      expiredDeals: 24 * 60 * 60 * 1000,     // Remove deals older than 24 hours
      duplicateThreshold: 0.85,               // 85% similarity = duplicate
      maxProductsPerBrand: 20                 // Keep top 20 deals per brand
    }
  },

  // Monitoring and alerting
  MONITORING: {
    SUCCESS_RATE_THRESHOLD: 0.80,  // Alert if success rate drops below 80%
    MAX_RESPONSE_TIME: 10000,       // Alert if requests take longer than 10s
    MIN_PRODUCTS_PER_RUN: 10,       // Alert if fewer than 10 products found
    ERROR_RATE_THRESHOLD: 0.20      // Alert if error rate exceeds 20%
  }
};

// Dynamic configuration based on time and events
export const getDynamicConfig = () => {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth();
  const dayOfWeek = now.getDay();
  
  let config = { ...SCRAPING_CONFIG };
  
  // Black Friday / Cyber Monday adjustments (November)
  if (month === 10) { // November
    config.SCHEDULE.QUICK_SCAN_INTERVAL = 10 * 60 * 1000; // Every 10 minutes
    config.DEAL_CRITERIA.MIN_DISCOUNT_PERCENT = 15; // Higher threshold
    config.PERFORMANCE.MAX_PRODUCTS_PER_RUN = 200; // More products
  }
  
  // Weekend adjustments (more social activity)
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
    config.DATA_SOURCES.SOCIAL_SOURCES[0].priority = 80; // Boost Reddit priority
  }
  
  // Peak hours adjustments (9 AM - 6 PM)
  if (hour >= 9 && hour <= 18) {
    config.SCHEDULE.DEAL_ALERT_INTERVAL = 5 * 60 * 1000; // Every 5 minutes
  }
  
  return config;
};

export default SCRAPING_CONFIG;