// Deal Hunter - Ultra-fast, AI-powered deal discovery system
// Focuses on real-time deal detection and social trend analysis

import { SmartProductScraper } from './smartProductScraper.js';
import { SCRAPING_CONFIG, getDynamicConfig } from './scrapingConfig.js';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';
const supabase = createClient(supabaseUrl, supabaseKey);

class DealHunter {
  constructor() {
    this.scraper = new SmartProductScraper();
    this.isRunning = false;
    this.stats = {
      runsCompleted: 0,
      totalDealsFound: 0,
      averageRunTime: 0,
      successRate: 0,
      lastRun: null
    };
    this.dealCache = new Map();
    this.priceHistory = new Map();
  }

  async initialize() {
    console.log('🔥 Initializing Deal Hunter...');
    await this.scraper.initialize();
    await this.setupDatabase();
    console.log('✅ Deal Hunter ready for action!');
  }

  // Setup database tables for advanced deal tracking
  async setupDatabase() {
    try {
      // Create price history table
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS price_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            product_title VARCHAR(500) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            original_price DECIMAL(10,2),
            discount_percent DECIMAL(5,2),
            source VARCHAR(100) NOT NULL,
            url TEXT,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deal_score INTEGER DEFAULT 0,
            social_mentions INTEGER DEFAULT 0,
            
            INDEX idx_product_timestamp (product_title, timestamp),
            INDEX idx_deal_score (deal_score DESC),
            INDEX idx_timestamp (timestamp DESC)
          );
          
          CREATE TABLE IF NOT EXISTS hot_deals (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            product_title VARCHAR(500) NOT NULL,
            brand VARCHAR(100),
            current_price DECIMAL(10,2) NOT NULL,
            original_price DECIMAL(10,2),
            discount_percent DECIMAL(5,2),
            deal_score INTEGER NOT NULL,
            source VARCHAR(100) NOT NULL,
            url TEXT,
            expires_at TIMESTAMP WITH TIME ZONE,
            social_buzz INTEGER DEFAULT 0,
            velocity_score INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            INDEX idx_deal_score (deal_score DESC),
            INDEX idx_brand (brand),
            INDEX idx_expires (expires_at),
            INDEX idx_created (created_at DESC)
          );
        `
      });
      console.log('✅ Deal tracking tables ready');
    } catch (error) {
      console.log('⚠️ Database setup info:', error.message);
    }
  }

  // Lightning-fast deal discovery with AI-powered filtering
  async huntDeals() {
    if (this.isRunning) {
      console.log('⚠️ Deal hunt already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    
    try {
      console.log('🏹 Starting lightning deal hunt...');
      
      const config = getDynamicConfig();
      const promises = [];
      
      // Parallel execution for maximum speed
      promises.push(this.scanFlashSales());
      promises.push(this.analyzeRedditTrends());
      promises.push(this.checkPriceDrops());
      promises.push(this.monitorInventoryLevels());
      promises.push(this.trackSocialBuzz());
      
      const results = await Promise.allSettled(promises);
      const allDeals = results
        .filter(r => r.status === 'fulfilled' && r.value)
        .flatMap(r => r.value);
      
      console.log(`🎯 Found ${allDeals.length} potential deals`);
      
      // AI-powered deal scoring and filtering
      const hotDeals = await this.scoreAndFilterDeals(allDeals);
      
      if (hotDeals.length > 0) {
        await this.saveHotDeals(hotDeals);
        await this.updatePriceHistory(hotDeals);
        await this.sendDealAlerts(hotDeals);
      }
      
      // Update statistics
      const runTime = Date.now() - startTime;
      this.updateStats(true, runTime, hotDeals.length);
      
      console.log(`🔥 Deal hunt complete! Found ${hotDeals.length} hot deals in ${runTime}ms`);
      
    } catch (error) {
      console.error('❌ Deal hunt error:', error);
      this.updateStats(false, Date.now() - startTime, 0);
    } finally {
      this.isRunning = false;
    }
  }

  // Scan for flash sales and limited-time offers
  async scanFlashSales() {
    console.log('⚡ Scanning for flash sales...');
    
    const flashSales = [];
    const config = SCRAPING_CONFIG.DATA_SOURCES.DEAL_AGGREGATORS;
    
    for (const source of config) {
      try {
        // Focus on front page deals (highest velocity)
        const deals = await this.scraper.scrapeDealSites([source]);
        
        // Filter for flash sales (time-sensitive keywords)
        const flashDeals = deals.filter(deal => {
          const title = deal.title.toLowerCase();
          return title.includes('flash') || 
                 title.includes('limited time') || 
                 title.includes('ends today') ||
                 title.includes('while supplies last') ||
                 title.includes('lightning deal');
        });
        
        flashSales.push(...flashDeals);
        
      } catch (error) {
        console.error(`❌ Flash sale scan error for ${source.name}:`, error.message);
      }
    }
    
    console.log(`⚡ Found ${flashSales.length} flash sales`);
    return flashSales;
  }

  // Real-time Reddit trend analysis
  async analyzeRedditTrends() {
    console.log('📈 Analyzing Reddit trends...');
    
    const trendingDeals = [];
    const redditConfig = SCRAPING_CONFIG.DATA_SOURCES.SOCIAL_SOURCES[0];
    
    for (const subreddit of redditConfig.subreddits) {
      try {
        const response = await fetch(
          `https://reddit.com/r/${subreddit.name}/hot.json?limit=25`,
          { headers: { 'User-Agent': 'DealHunter/1.0' } }
        );
        
        if (response.ok) {
          const data = await response.json();
          const posts = data.data?.children || [];
          
          // Focus on high-engagement deal posts
          const hotPosts = posts
            .filter(post => {
              const score = post.data.score;
              const title = post.data.title.toLowerCase();
              const hasTargetBrand = Object.keys(SCRAPING_CONFIG.BRAND_CONFIGS)
                .some(brand => title.includes(brand.toLowerCase()));
              
              return score >= subreddit.minScore && 
                     hasTargetBrand &&
                     (title.includes('deal') || title.includes('sale') || title.includes('%'));
            })
            .map(post => ({
              title: post.data.title,
              url: post.data.url,
              score: post.data.score,
              comments: post.data.num_comments,
              subreddit: subreddit.name,
              velocity: (post.data.score + post.data.num_comments) / Math.max(1, (Date.now() - post.data.created_utc * 1000) / (1000 * 60 * 60)), // Engagement per hour
              source: 'reddit_trending'
            }));
          
          trendingDeals.push(...hotPosts);
        }
        
        await this.delay(1000); // Respect Reddit rate limits
        
      } catch (error) {
        console.error(`❌ Reddit trend analysis error for r/${subreddit.name}:`, error.message);
      }
    }
    
    // Sort by velocity (hotness)
    trendingDeals.sort((a, b) => b.velocity - a.velocity);
    
    console.log(`📈 Found ${trendingDeals.length} trending deals on Reddit`);
    return trendingDeals.slice(0, 20); // Top 20 trending
  }

  // Monitor for significant price drops
  async checkPriceDrops() {
    console.log('💹 Checking for price drops...');
    
    const priceDrops = [];
    
    try {
      // Get recent price history for comparison
      const { data: recentPrices } = await supabase
        .from('price_history')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('timestamp', { ascending: false });
      
      if (recentPrices) {
        // Group by product and check for drops
        const pricesByProduct = new Map();
        
        recentPrices.forEach(entry => {
          if (!pricesByProduct.has(entry.product_title)) {
            pricesByProduct.set(entry.product_title, []);
          }
          pricesByProduct.get(entry.product_title).push(entry);
        });
        
        // Identify significant price drops
        pricesByProduct.forEach((prices, productTitle) => {
          if (prices.length >= 2) {
            const latest = prices[0];
            const previous = prices[1];
            
            const dropPercent = (previous.price - latest.price) / previous.price;
            
            if (dropPercent >= 0.10) { // 10% or greater drop
              priceDrops.push({
                title: productTitle,
                currentPrice: latest.price,
                previousPrice: previous.price,
                dropPercent: dropPercent,
                source: 'price_tracking',
                urgency: dropPercent >= 0.25 ? 'high' : 'medium'
              });
            }
          }
        });
      }
      
    } catch (error) {
      console.error('❌ Price drop check error:', error.message);
    }
    
    console.log(`💹 Found ${priceDrops.length} significant price drops`);
    return priceDrops;
  }

  // Monitor inventory levels for scarcity signals
  async monitorInventoryLevels() {
    console.log('📦 Monitoring inventory levels...');
    
    // Implementation for inventory monitoring
    // This would check stock levels and identify low-stock deals
    // For now, return empty array - can be expanded with retailer APIs
    return [];
  }

  // Track social media buzz and engagement
  async trackSocialBuzz() {
    console.log('🗣️ Tracking social media buzz...');
    
    // Implementation for social buzz tracking
    // This would monitor Twitter, TikTok, YouTube for product mentions
    // For now, return empty array - can be expanded with social APIs
    return [];
  }

  // AI-powered deal scoring and filtering
  async scoreAndFilterDeals(deals) {
    console.log('🤖 AI-powered deal scoring...');
    
    const algorithm = SCRAPING_CONFIG.RANKING_ALGORITHM;
    
    const scoredDeals = deals.map(deal => {
      let score = 0;
      
      // Brand priority score
      const brand = this.extractBrand(deal.title);
      const brandConfig = SCRAPING_CONFIG.BRAND_CONFIGS[brand];
      if (brandConfig) {
        score += brandConfig.priority * algorithm.weights.brandPriority;
      }
      
      // Discount percentage score
      if (deal.dropPercent || deal.discount_percent) {
        const discount = deal.dropPercent || deal.discount_percent;
        score += discount * 1000 * algorithm.weights.discountPercentage;
      }
      
      // Social engagement score
      if (deal.score || deal.socialEngagement) {
        const engagement = deal.score || deal.socialEngagement;
        score += Math.log10(engagement + 1) * 100 * algorithm.weights.socialEngagement;
      }
      
      // Velocity/urgency score
      if (deal.velocity) {
        score += deal.velocity * 50 * algorithm.weights.recency;
      }
      
      // Apply bonuses
      const title = deal.title.toLowerCase();
      if (title.includes('new') || title.includes('latest')) score += algorithm.bonuses.newProduct;
      if (title.includes('limited') || title.includes('flash')) score += algorithm.bonuses.limitedTime;
      if (title.includes('free shipping')) score += algorithm.bonuses.freeShipping;
      
      // Apply penalties
      if (title.includes('refurbished') || title.includes('used')) score += algorithm.penalties.refurbished;
      if (title.includes('no returns')) score += algorithm.penalties.noReturns;
      
      return { ...deal, dealScore: Math.round(score) };
    });
    
    // Filter and sort
    const filtered = scoredDeals
      .filter(deal => deal.dealScore > 50) // Minimum quality threshold
      .sort((a, b) => b.dealScore - a.dealScore)
      .slice(0, 30); // Top 30 deals
    
    console.log(`🤖 Filtered to ${filtered.length} high-quality deals`);
    return filtered;
  }

  // Save hot deals to database
  async saveHotDeals(deals) {
    console.log(`💾 Saving ${deals.length} hot deals...`);
    
    let savedCount = 0;
    for (const deal of deals) {
      try {
        const { error } = await supabase
          .from('hot_deals')
          .upsert({
            product_title: deal.title,
            brand: this.extractBrand(deal.title),
            current_price: deal.currentPrice || deal.price || 0,
            original_price: deal.previousPrice || deal.originalPrice || 0,
            discount_percent: deal.dropPercent || deal.discount_percent || 0,
            deal_score: deal.dealScore,
            source: deal.source,
            url: deal.url || deal.link || '#',
            social_buzz: deal.score || deal.socialEngagement || 0,
            velocity_score: deal.velocity || 0,
            expires_at: deal.urgency === 'high' ? 
              new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() : // 2 hours for urgent deals
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()   // 24 hours for regular deals
          });
        
        if (!error) savedCount++;
      } catch (error) {
        console.error(`❌ Error saving deal ${deal.title}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully saved ${savedCount} hot deals`);
  }

  // Update price history for trend analysis
  async updatePriceHistory(deals) {
    console.log('📊 Updating price history...');
    
    for (const deal of deals) {
      try {
        await supabase
          .from('price_history')
          .insert({
            product_title: deal.title,
            price: deal.currentPrice || deal.price || 0,
            original_price: deal.previousPrice || deal.originalPrice || 0,
            discount_percent: deal.dropPercent || deal.discount_percent || 0,
            source: deal.source,
            url: deal.url || deal.link || '#',
            deal_score: deal.dealScore,
            social_mentions: deal.score || deal.socialEngagement || 0
          });
      } catch (error) {
        console.error(`❌ Price history error for ${deal.title}:`, error.message);
      }
    }
  }

  // Send alerts for exceptional deals
  async sendDealAlerts(deals) {
    const exceptionalDeals = deals.filter(deal => deal.dealScore > 200);
    
    if (exceptionalDeals.length > 0) {
      console.log(`🚨 DEAL ALERT: ${exceptionalDeals.length} exceptional deals found!`);
      exceptionalDeals.forEach(deal => {
        console.log(`🔥 ${deal.title} - Score: ${deal.dealScore} - ${deal.source}`);
      });
      
      // Here you could integrate with notification services:
      // - Discord webhook
      // - Slack notification
      // - Email alerts
      // - Push notifications
    }
  }

  // Helper methods
  extractBrand(title) {
    return Object.keys(SCRAPING_CONFIG.BRAND_CONFIGS).find(brand => 
      title.toLowerCase().includes(brand.toLowerCase())
    );
  }

  updateStats(success, runTime, dealsFound) {
    this.stats.runsCompleted++;
    this.stats.totalDealsFound += dealsFound;
    this.stats.averageRunTime = (this.stats.averageRunTime + runTime) / 2;
    this.stats.successRate = (this.stats.successRate + (success ? 1 : 0)) / 2;
    this.stats.lastRun = new Date().toISOString();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get current statistics
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.dealCache.size,
      priceHistorySize: this.priceHistory.size
    };
  }

  async cleanup() {
    await this.scraper.cleanup();
  }
}

// Scheduler for automated deal hunting
class DealHuntScheduler {
  constructor() {
    this.hunter = new DealHunter();
    this.isInitialized = false;
  }

  async start() {
    if (!this.isInitialized) {
      await this.hunter.initialize();
      this.isInitialized = true;
    }

    console.log('📅 Starting automated deal hunting schedule...');
    
    // Quick scans every 30 minutes during business hours
    cron.schedule('*/30 9-18 * * *', async () => {
      console.log('⏰ Quick deal scan triggered');
      await this.hunter.huntDeals();
    });
    
    // Deep scans every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('⏰ Deep deal scan triggered');
      await this.hunter.huntDeals();
    });
    
    // Flash sale monitoring every 10 minutes during peak hours
    cron.schedule('*/10 10-16 * * *', async () => {
      console.log('⏰ Flash sale monitoring triggered');
      await this.hunter.scanFlashSales();
    });
    
    console.log('✅ Deal hunt scheduler active!');
  }

  async stop() {
    await this.hunter.cleanup();
    console.log('⏹️ Deal hunt scheduler stopped');
  }

  getStats() {
    return this.hunter.getStats();
  }
}

// Export for use in other modules
export { DealHunter, DealHuntScheduler };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const scheduler = new DealHuntScheduler();
  await scheduler.start();
  
  // Keep process alive
  process.on('SIGINT', async () => {
    console.log('👋 Shutting down deal hunter...');
    await scheduler.stop();
    process.exit(0);
  });
}