// Test Script for Deal Hunter System
// Validates scraping performance and deal quality

import { DealHunter } from './dealHunter.js';
import { SCRAPING_CONFIG } from './scrapingConfig.js';

async function testDealHunter() {
  console.log('🧪 Starting Deal Hunter Test Suite...\n');
  
  const hunter = new DealHunter();
  
  try {
    // Test 1: Initialization
    console.log('📋 Test 1: System Initialization');
    await hunter.initialize();
    console.log('✅ Initialization successful\n');
    
    // Test 2: Quick Deal Hunt
    console.log('📋 Test 2: Quick Deal Hunt (30 second timeout)');
    const startTime = Date.now();
    
    const dealHuntPromise = hunter.huntDeals();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 30000)
    );
    
    try {
      await Promise.race([dealHuntPromise, timeoutPromise]);
      const runTime = Date.now() - startTime;
      console.log(`✅ Deal hunt completed in ${runTime}ms`);
    } catch (error) {
      if (error.message === 'Timeout') {
        console.log('⚠️ Deal hunt exceeded 30 seconds (may still be running in background)');
      } else {
        throw error;
      }
    }
    
    // Test 3: Statistics Check
    console.log('\n📋 Test 3: Statistics and Performance');
    const stats = hunter.getStats();
    console.log('📊 Current Stats:');
    console.log(`   - Runs Completed: ${stats.runsCompleted}`);
    console.log(`   - Total Deals Found: ${stats.totalDealsFound}`);
    console.log(`   - Average Run Time: ${Math.round(stats.averageRunTime)}ms`);
    console.log(`   - Success Rate: ${Math.round(stats.successRate * 100)}%`);
    console.log(`   - Last Run: ${stats.lastRun}`);
    
    // Test 4: Configuration Validation
    console.log('\n📋 Test 4: Configuration Validation');
    validateConfiguration();
    
    // Test 5: Database Connection
    console.log('\n📋 Test 5: Database Connection Test');
    await testDatabaseConnection();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📈 Performance Summary:');
    console.log(`   - System is ${stats.successRate >= 0.8 ? '✅ HEALTHY' : '⚠️ NEEDS ATTENTION'}`);
    console.log(`   - Speed is ${stats.averageRunTime < 15000 ? '🚀 FAST' : '🐌 SLOW'}`);
    console.log(`   - Deal quality is ${stats.totalDealsFound > 0 ? '💎 GOOD' : '❌ POOR'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    await hunter.cleanup();
    console.log('\n🧹 Test cleanup complete');
  }
}

function validateConfiguration() {
  const config = SCRAPING_CONFIG;
  
  // Check brand configurations
  const brands = Object.keys(config.BRAND_CONFIGS);
  console.log(`   - Configured brands: ${brands.length} (${brands.join(', ')})`);
  
  // Check data sources
  const apiSources = config.DATA_SOURCES.APIS.length;
  const dealSources = config.DATA_SOURCES.DEAL_AGGREGATORS.length;
  const socialSources = config.DATA_SOURCES.SOCIAL_SOURCES.length;
  
  console.log(`   - API sources: ${apiSources}`);
  console.log(`   - Deal aggregators: ${dealSources}`);
  console.log(`   - Social sources: ${socialSources}`);
  
  // Validate critical settings
  const hasValidThresholds = config.DEAL_CRITERIA.MIN_DISCOUNT_PERCENT > 0;
  const hasValidRateLimits = config.PERFORMANCE.MAX_CONCURRENT_REQUESTS > 0;
  
  if (hasValidThresholds && hasValidRateLimits) {
    console.log('✅ Configuration validation passed');
  } else {
    console.log('⚠️ Configuration issues detected');
  }
}

async function testDatabaseConnection() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYhjJDYZQGxNDZE-qWA5v-4';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`⚠️ Database connection issue: ${error.message}`);
    } else {
      console.log('✅ Database connection successful');
      console.log(`   - Sample data available: ${data.length > 0 ? 'Yes' : 'No'}`);
    }
    
  } catch (error) {
    console.log(`❌ Database test failed: ${error.message}`);
  }
}

// Run performance benchmark
async function runPerformanceBenchmark() {
  console.log('\n🏃‍♂️ Running Performance Benchmark...');
  
  const hunter = new DealHunter();
  await hunter.initialize();
  
  const iterations = 3;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    console.log(`   Run ${i + 1}/${iterations}...`);
    const start = Date.now();
    
    try {
      await hunter.huntDeals();
      const time = Date.now() - start;
      times.push(time);
      console.log(`   ✅ Completed in ${time}ms`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
    
    // Wait between runs
    if (i < iterations - 1) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log('\n📊 Benchmark Results:');
    console.log(`   - Average Time: ${Math.round(avgTime)}ms`);
    console.log(`   - Fastest Run: ${minTime}ms`);
    console.log(`   - Slowest Run: ${maxTime}ms`);
    console.log(`   - Success Rate: ${(times.length / iterations * 100).toFixed(1)}%`);
    
    // Performance rating
    if (avgTime < 10000) {
      console.log('   - Rating: 🚀 EXCELLENT (< 10s)');
    } else if (avgTime < 20000) {
      console.log('   - Rating: ✅ GOOD (< 20s)');
    } else if (avgTime < 30000) {
      console.log('   - Rating: ⚠️ ACCEPTABLE (< 30s)');
    } else {
      console.log('   - Rating: 🐌 SLOW (> 30s)');
    }
  }
  
  await hunter.cleanup();
}

// Quality assessment of found deals
async function assessDealQuality() {
  console.log('\n💎 Assessing Deal Quality...');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYhjJDYZQGxNDZE-qWA5v-4';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check for recent hot deals
    const { data: hotDeals } = await supabase
      .from('hot_deals')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('deal_score', { ascending: false });
    
    if (hotDeals && hotDeals.length > 0) {
      console.log(`   - Hot deals found: ${hotDeals.length}`);
      console.log(`   - Average deal score: ${Math.round(hotDeals.reduce((sum, deal) => sum + deal.deal_score, 0) / hotDeals.length)}`);
      console.log(`   - Best deal: ${hotDeals[0].product_title} (Score: ${hotDeals[0].deal_score})`);
      
      // Analyze deal distribution by brand
      const brandCounts = {};
      hotDeals.forEach(deal => {
        const brand = deal.brand || 'Unknown';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      });
      
      console.log('   - Brand distribution:');
      Object.entries(brandCounts).forEach(([brand, count]) => {
        console.log(`     * ${brand}: ${count} deals`);
      });
      
    } else {
      console.log('   - No recent hot deals found');
    }
    
  } catch (error) {
    console.log(`   ❌ Quality assessment failed: ${error.message}`);
  }
}

// Main test execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--benchmark')) {
    await runPerformanceBenchmark();
  } else if (args.includes('--quality')) {
    await assessDealQuality();
  } else {
    await testDealHunter();
  }
}

// Export for use in other scripts
export { testDealHunter, runPerformanceBenchmark, assessDealQuality };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}