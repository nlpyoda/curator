// Smart Product Scraper - Multi-source deal-focused product aggregation
// Focuses on high-demand products with real deals across multiple brands

import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import fetch from 'node-fetch';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration for different data sources
const DATA_SOURCES = {
  // Deal aggregator sites (more scraping-friendly)
  DEAL_SITES: [
    {
      name: 'Slickdeals',
      url: 'https://slickdeals.net',
      selectors: {
        deals: '.dealTile',
        title: '.dealTitle a',
        price: '.dealPrice',
        originalPrice: '.originalPrice',
        store: '.dealStore'
      },
      rateLimit: 2000 // ms between requests
    },
    {
      name: 'DealNews',
      url: 'https://dealnews.com',
      categories: ['electronics', 'audio', 'computers'],
      rateLimit: 1500
    }
  ],
  
  // Shopping APIs (fastest, most reliable)
  APIS: [
    {
      name: 'Google Shopping',
      endpoint: 'https://www.googleapis.com/customsearch/v1',
      key: process.env.GOOGLE_API_KEY,
      searchEngine: process.env.GOOGLE_SEARCH_ENGINE_ID
    },
    {
      name: 'Best Buy API',
      endpoint: 'https://api.bestbuy.com/v1/products',
      key: process.env.BESTBUY_API_KEY
    }
  ],
  
  // Social signals for trending products
  SOCIAL_SOURCES: [
    {
      name: 'Reddit Deals',
      subreddits: ['deals', 'buildapcsales', 'frugalmalefashion'],
      api: 'https://reddit.com/r/{subreddit}/hot.json'
    }
  ],
  
  // Price comparison sites (usually more lenient)
  COMPARISON_SITES: [
    {
      name: 'PriceGrabber',
      baseUrl: 'https://pricegrabber.com/search',
      rateLimit: 3000
    },
    {
      name: 'Shopping.com',
      baseUrl: 'https://shopping.com/products',
      rateLimit: 2500
    }
  ]
};

// Target brands with their priority keywords
const TARGET_BRANDS = {
  'Apple': {
    priority: 'high',
    keywords: ['iphone', 'macbook', 'airpods', 'ipad', 'apple watch'],
    priceRanges: { low: 100, high: 3000 },
    dealThreshold: 0.10 // 10% discount minimum
  },
  'Nike': {
    priority: 'high', 
    keywords: ['air jordan', 'dunk', 'air max', 'pegasus'],
    priceRanges: { low: 50, high: 300 },
    dealThreshold: 0.15
  },
  'Sony': {
    priority: 'high',
    keywords: ['wh-1000xm', 'playstation', 'camera', 'headphones'],
    priceRanges: { low: 100, high: 2000 },
    dealThreshold: 0.12
  },
  'Bose': {
    priority: 'medium',
    keywords: ['quietcomfort', 'soundlink', 'noise cancelling'],
    priceRanges: { low: 100, high: 500 },
    dealThreshold: 0.15
  },
  'Dyson': {
    priority: 'medium',
    keywords: ['v15', 'v11', 'airwrap', 'supersonic'],
    priceRanges: { low: 200, high: 800 },
    dealThreshold: 0.10
  }
};

class SmartProductScraper {
  constructor() {
    this.browser = null;
    this.requestQueue = [];
    this.rateLimiters = new Map();
    this.cache = new Map();
    this.dealScore = new Map();
  }

  async initialize() {
    console.log('🚀 Initializing Smart Product Scraper...');
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    // Initialize rate limiters for each source
    Object.values(DATA_SOURCES).flat().forEach(source => {
      this.rateLimiters.set(source.name, {
        lastRequest: 0,
        delay: source.rateLimit || 2000
      });
    });
    
    console.log('✅ Smart Product Scraper initialized');
  }

  // Multi-source product discovery with deal focus
  async discoverTrendingProducts() {
    console.log('🔍 Discovering trending products across multiple sources...');
    
    const discoveries = await Promise.allSettled([
      this.scrapeDealSites(),
      this.fetchFromAPIs(),
      this.analyzeSocialSignals(),
      this.scanComparisonSites()
    ]);

    const allProducts = discoveries
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

    console.log(`📊 Discovered ${allProducts.length} potential products`);
    return this.rankAndFilterProducts(allProducts);
  }

  // Scrape deal aggregator sites (most deal-focused)
  async scrapeDealSites() {
    console.log('🏷️ Scraping deal aggregator sites...');
    const deals = [];
    
    for (const source of DATA_SOURCES.DEAL_SITES) {
      try {
        await this.respectRateLimit(source.name);
        
        const page = await this.browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (compatible; CuratorBot/1.0)');
        
        // Check robots.txt first
        const robotsAllowed = await this.checkRobotsPermission(source.url);
        if (!robotsAllowed) {
          console.log(`⚠️ Robots.txt disallows scraping ${source.name}`);
          continue;
        }

        await page.goto(source.url, { waitUntil: 'domcontentloaded' });
        
        const siteDeals = await page.evaluate((selectors) => {
          const dealElements = document.querySelectorAll(selectors.deals);
          return Array.from(dealElements).slice(0, 20).map(deal => {
            const title = deal.querySelector(selectors.title)?.textContent?.trim();
            const price = deal.querySelector(selectors.price)?.textContent?.trim();
            const originalPrice = deal.querySelector(selectors.originalPrice)?.textContent?.trim();
            const store = deal.querySelector(selectors.store)?.textContent?.trim();
            
            return { title, price, originalPrice, store, source: 'deal_site' };
          }).filter(deal => deal.title && deal.price);
        }, source.selectors);

        deals.push(...siteDeals);
        await page.close();
        
      } catch (error) {
        console.error(`❌ Error scraping ${source.name}:`, error.message);
      }
    }
    
    console.log(`✅ Found ${deals.length} deals from aggregator sites`);
    return this.filterByTargetBrands(deals);
  }

  // Use shopping APIs for fast, reliable data
  async fetchFromAPIs() {
    console.log('🔌 Fetching from shopping APIs...');
    const products = [];
    
    // Google Shopping API
    if (process.env.GOOGLE_API_KEY) {
      for (const [brand, config] of Object.entries(TARGET_BRANDS)) {
        for (const keyword of config.keywords.slice(0, 2)) { // Limit to top 2 keywords per brand
          try {
            const searchQuery = `${brand} ${keyword} deal sale`;
            const response = await fetch(
              `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=5`
            );
            
            if (response.ok) {
              const data = await response.json();
              const apiProducts = data.items?.map(item => ({
                title: item.title,
                description: item.snippet,
                link: item.link,
                source: 'google_shopping',
                brand: brand,
                searchKeyword: keyword
              })) || [];
              
              products.push(...apiProducts);
            }
            
            await this.delay(100); // Respect API rate limits
          } catch (error) {
            console.error(`❌ Google API error for ${brand} ${keyword}:`, error.message);
          }
        }
      }
    }
    
    console.log(`✅ Found ${products.length} products from APIs`);
    return products;
  }

  // Analyze social media for trending products
  async analyzeSocialSignals() {
    console.log('📱 Analyzing social signals for trending products...');
    const trendingProducts = [];
    
    // Reddit deals analysis
    for (const source of DATA_SOURCES.SOCIAL_SOURCES) {
      for (const subreddit of source.subreddits) {
        try {
          const response = await fetch(source.api.replace('{subreddit}', subreddit), {
            headers: { 'User-Agent': 'CuratorBot/1.0' }
          });
          
          if (response.ok) {
            const data = await response.json();
            const posts = data.data?.children || [];
            
            const relevantPosts = posts
              .filter(post => this.containsTargetBrand(post.data.title))
              .slice(0, 10)
              .map(post => ({
                title: post.data.title,
                url: post.data.url,
                score: post.data.score,
                comments: post.data.num_comments,
                source: 'reddit',
                subreddit: subreddit,
                socialEngagement: post.data.score + post.data.num_comments
              }));
            
            trendingProducts.push(...relevantPosts);
          }
          
          await this.delay(1000); // Respect Reddit rate limits
        } catch (error) {
          console.error(`❌ Reddit API error for r/${subreddit}:`, error.message);
        }
      }
    }
    
    console.log(`✅ Found ${trendingProducts.length} trending products from social signals`);
    return trendingProducts;
  }

  // Quick scan of price comparison sites
  async scanComparisonSites() {
    console.log('💰 Scanning price comparison sites...');
    // Implementation for price comparison sites
    // Focus on sites that aggregate deals and allow scraping
    return [];
  }

  // Intelligent product ranking and filtering
  async rankAndFilterProducts(products) {
    console.log('🎯 Ranking and filtering products by relevance and deal quality...');
    
    const scored = products.map(product => {
      const score = this.calculateDealScore(product);
      return { ...product, dealScore: score };
    });

    // Sort by deal score (highest first)
    scored.sort((a, b) => b.dealScore - a.dealScore);
    
    // Remove duplicates and keep top deals
    const uniqueProducts = this.deduplicateProducts(scored);
    const topDeals = uniqueProducts.slice(0, 50); // Top 50 deals
    
    console.log(`✅ Filtered to ${topDeals.length} top-quality deals`);
    return topDeals;
  }

  // Calculate deal quality score
  calculateDealScore(product) {
    let score = 0;
    
    // Brand priority multiplier
    const brand = this.extractBrand(product.title);
    const brandConfig = TARGET_BRANDS[brand];
    if (brandConfig) {
      score += brandConfig.priority === 'high' ? 100 : 50;
    }
    
    // Price discount factor
    if (product.originalPrice && product.price) {
      const discount = this.calculateDiscount(product.originalPrice, product.price);
      if (discount > 0.1) score += discount * 200; // High weight for good discounts
    }
    
    // Social engagement factor
    if (product.socialEngagement) {
      score += Math.log10(product.socialEngagement + 1) * 20;
    }
    
    // Source reliability factor
    if (product.source === 'google_shopping') score += 30;
    if (product.source === 'deal_site') score += 40;
    if (product.source === 'reddit') score += 25;
    
    // Keyword relevance
    const brand = this.extractBrand(product.title);
    if (brandConfig && brandConfig.keywords.some(keyword => 
      product.title.toLowerCase().includes(keyword.toLowerCase())
    )) {
      score += 50;
    }
    
    return score;
  }

  // Helper methods
  async respectRateLimit(sourceName) {
    const limiter = this.rateLimiters.get(sourceName);
    if (limiter) {
      const elapsed = Date.now() - limiter.lastRequest;
      if (elapsed < limiter.delay) {
        await this.delay(limiter.delay - elapsed);
      }
      limiter.lastRequest = Date.now();
    }
  }

  async checkRobotsPermission(url) {
    try {
      const robotsUrl = new URL('/robots.txt', url).href;
      const response = await fetch(robotsUrl);
      if (response.ok) {
        const robotsText = await response.text();
        // Simple robots.txt check - look for explicit disallows
        return !robotsText.includes('Disallow: /');
      }
    } catch (error) {
      console.log(`⚠️ Could not check robots.txt for ${url}`);
    }
    return true; // Assume allowed if robots.txt check fails
  }

  containsTargetBrand(text) {
    return Object.keys(TARGET_BRANDS).some(brand => 
      text.toLowerCase().includes(brand.toLowerCase())
    );
  }

  extractBrand(title) {
    return Object.keys(TARGET_BRANDS).find(brand => 
      title.toLowerCase().includes(brand.toLowerCase())
    );
  }

  calculateDiscount(originalPrice, salePrice) {
    const orig = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));
    const sale = parseFloat(salePrice.replace(/[^0-9.]/g, ''));
    if (orig && sale && orig > sale) {
      return (orig - sale) / orig;
    }
    return 0;
  }

  deduplicateProducts(products) {
    const seen = new Set();
    return products.filter(product => {
      const key = product.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Save top deals to database
  async saveToDatabase(products) {
    console.log(`💾 Saving ${products.length} top deals to database...`);
    
    let savedCount = 0;
    for (const product of products) {
      try {
        const { data, error } = await supabase
          .from('Product')
          .upsert({
            title: product.title,
            price: product.price || 'See listing',
            link: product.link || product.url || '#',
            source: `Smart Scraper (${product.source})`,
            description: product.description || `Great deal on ${product.title}`,
            features: `Trending product with deal score: ${product.dealScore}`,
            whyBuy: `🔥 Trending deal with high social engagement and good pricing`,
            category: this.categorizeProduct(product.title),
            tags: [product.brand, 'trending', 'deal'].filter(Boolean),
            // Generate mock embedding
            productEmbedding: Array.from({length: 384}, () => Math.random() * 2 - 1)
          }, {
            onConflict: 'title'
          });

        if (!error) savedCount++;
      } catch (error) {
        console.error(`❌ Error saving product ${product.title}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully saved ${savedCount} products to database`);
  }

  categorizeProduct(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('headphone') || titleLower.includes('airpods') || titleLower.includes('earbuds')) return 'audio';
    if (titleLower.includes('laptop') || titleLower.includes('macbook') || titleLower.includes('computer')) return 'tech';
    if (titleLower.includes('phone') || titleLower.includes('iphone') || titleLower.includes('galaxy')) return 'tech';
    if (titleLower.includes('shoe') || titleLower.includes('sneaker') || titleLower.includes('jordan')) return 'footwear';
    if (titleLower.includes('watch') || titleLower.includes('fitness')) return 'wearables';
    return 'general';
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runSmartScraper() {
  const scraper = new SmartProductScraper();
  
  try {
    await scraper.initialize();
    
    console.log('🎯 Starting intelligent product discovery...');
    const products = await scraper.discoverTrendingProducts();
    
    if (products.length > 0) {
      await scraper.saveToDatabase(products);
      console.log(`🎉 Smart scraping complete! Found ${products.length} trending deals`);
    } else {
      console.log('📭 No trending products found in this run');
    }
    
  } catch (error) {
    console.error('❌ Smart scraper error:', error);
  } finally {
    await scraper.cleanup();
  }
}

// Export for use in other scripts
export { SmartProductScraper, runSmartScraper };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSmartScraper();
}