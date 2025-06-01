// Setup script for Deal Hunter system dependencies
// Run this to install required packages and test the system

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

async function installDependencies() {
  console.log('📦 Installing Deal Hunter dependencies...\n');
  
  const dependencies = [
    'playwright',      // For web scraping
    'node-fetch',      // For API calls  
    'node-cron',       // For scheduling
    '@anthropic-ai/sdk' // For AI enhancements (optional)
  ];
  
  try {
    console.log('Installing packages:', dependencies.join(', '));
    
    // Install using npm
    const { stdout, stderr } = await execAsync(`npm install ${dependencies.join(' ')}`);
    
    if (stderr && !stderr.includes('warning')) {
      console.log('⚠️ Installation warnings:', stderr);
    }
    
    console.log('✅ Dependencies installed successfully!\n');
    
    // Install Playwright browsers
    console.log('🌐 Installing Playwright browsers...');
    await execAsync('npx playwright install chromium');
    console.log('✅ Playwright browsers installed!\n');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('\n🔧 Manual installation:');
    console.log('npm install playwright node-fetch node-cron @anthropic-ai/sdk');
    console.log('npx playwright install chromium');
  }
}

async function createEnvironmentFile() {
  console.log('⚙️ Setting up environment configuration...\n');
  
  const envTemplate = `# Deal Hunter Configuration
# Add your API keys here for enhanced functionality

# Google Shopping API (optional - for product search)
# GOOGLE_API_KEY=your_google_api_key_here  
# GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Best Buy API (optional - for electronics deals)
# BESTBUY_API_KEY=your_bestbuy_api_key_here

# Anthropic API (optional - for AI enhancements)
# CLAUDE_API_KEY=your_claude_api_key_here

# Existing keys (keep these)
# DATABASE_URL=your_database_url
# EXPO_PUBLIC_SUPABASE_KEY=your_supabase_key
`;

  try {
    // Check if .env exists
    const envExists = await fs.access('.env').then(() => true).catch(() => false);
    
    if (!envExists) {
      await fs.writeFile('.env', envTemplate);
      console.log('✅ Created .env file with Deal Hunter configuration');
    } else {
      // Append Deal Hunter config if not present
      const currentEnv = await fs.readFile('.env', 'utf-8');
      
      if (!currentEnv.includes('Deal Hunter Configuration')) {
        await fs.appendFile('.env', '\n' + envTemplate);
        console.log('✅ Added Deal Hunter configuration to existing .env file');
      } else {
        console.log('⚠️ Deal Hunter configuration already exists in .env file');
      }
    }
    
  } catch (error) {
    console.error('❌ Environment setup failed:', error.message);
  }
}

async function runQuickTest() {
  console.log('🧪 Running quick system test...\n');
  
  try {
    // Run the quick test
    const { stdout, stderr } = await execAsync('node scripts/quickDealTest.js');
    
    console.log(stdout);
    
    if (stderr) {
      console.log('⚠️ Test warnings:', stderr);
    }
    
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
    console.log('\n🔧 Try running manually:');
    console.log('node scripts/quickDealTest.js');
  }
}

async function showGetStartedGuide() {
  console.log('\n🚀 Deal Hunter Setup Complete!\n');
  console.log('📋 Quick Start Guide:');
  console.log('');
  console.log('1. 🧪 Test the System:');
  console.log('   node scripts/quickDealTest.js');
  console.log('');
  console.log('2. 🏃‍♂️ Run Performance Benchmark:');
  console.log('   node scripts/testDealHunter.js --benchmark');
  console.log('');
  console.log('3. 💎 Check Deal Quality:');
  console.log('   node scripts/testDealHunter.js --quality');
  console.log('');
  console.log('4. 🔄 Start Automated Monitoring:');
  console.log('   node scripts/dealHunter.js');
  console.log('');
  console.log('📚 Full Documentation:');
  console.log('   See DEAL_HUNTER_README.md for complete guide');
  console.log('');
  console.log('🔧 Configuration:');
  console.log('   - Add API keys to .env file for enhanced functionality');
  console.log('   - Customize brands/products in scripts/scrapingConfig.js');
  console.log('   - Monitor performance in scripts/testDealHunter.js');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   - Run initial test to validate setup');
  console.log('   - Configure target brands and products');  
  console.log('   - Set up automated scheduling');
  console.log('   - Integrate with main curator app');
  console.log('');
}

async function main() {
  console.log('🔥 Deal Hunter Setup Script\n');
  console.log('==========================================\n');
  
  try {
    // Step 1: Install dependencies
    await installDependencies();
    
    // Step 2: Setup environment
    await createEnvironmentFile();
    
    // Step 3: Run quick test
    await runQuickTest();
    
    // Step 4: Show getting started guide
    await showGetStartedGuide();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🆘 Get Help:');
    console.log('   - Check Node.js version (needs 16+)');
    console.log('   - Ensure npm is working correctly');
    console.log('   - Verify database connection');
    console.log('   - See DEAL_HUNTER_README.md for troubleshooting');
  }
}

// Check Node.js version
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.error('❌ Node.js 16+ required. Current version:', nodeVersion);
    console.log('Please upgrade Node.js: https://nodejs.org/');
    process.exit(1);
  }
  
  console.log(`✅ Node.js version: ${nodeVersion}\n`);
}

// Run setup
checkNodeVersion();
main().catch(console.error);