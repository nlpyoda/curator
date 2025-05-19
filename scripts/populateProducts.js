import { chromium } from 'playwright';
import { DatabaseService } from '../app/services/DatabaseService.js';
import Anthropic from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { pipeline } from '@xenova/transformers';
import path from 'path';
import fs from 'fs/promises';

// TODO: Production Improvements
/*
1. Database:
   - Move to cloud-hosted PostgreSQL (e.g., AWS RDS, Google Cloud SQL)
   - Implement connection pooling
   - Add read replicas for scaling
   - Implement proper migration strategy

2. FAISS:
   - Move to a dedicated vector search service (e.g., Pinecone, Weaviate)
   - Consider using AWS SageMaker for FAISS deployment
   - Implement regular index rebuilding strategy
   - Add monitoring for index performance

3. Security:
   - Move all credentials to a secret manager (AWS Secrets, HashiCorp Vault)
   - Implement proper API key rotation
   - Add request rate limiting
   - Set up proper IAM roles and permissions
*/

// For testing, we'll use a smaller set of mock products
const TEST_PRODUCTS = [
  {
    amazon: 'https://www.amazon.com/dp/B09G9FPHY6',
    fbMarketplace: 'macbook air m2',
    instagram: ['techreviewsyt'],
    name: 'M2 MacBook Air'
  }
];

// Mock data for testing
const MOCK_DATA = {
  amazon: {
    title: "Apple 2023 MacBook Air Laptop with M2 chip",
    price: "$1,099.00",
    features: [
      "13.6-inch Liquid Retina Display",
      "8GB Unified Memory",
      "256GB SSD Storage",
      "1080p FaceTime HD Camera",
      "MagSafe Charging Port"
    ],
    reviews: [
      "5.0 out of 5 stars - Amazing laptop for everyday use",
      "4.5 out of 5 stars - Great performance but pricey",
      "5.0 out of 5 stars - Battery life is incredible"
    ].join('\n')
  },
  facebook: [
    {
      price: "$899",
      title: "M2 MacBook Air (Used)",
      condition: "Like New"
    },
    {
      price: "$1050",
      title: "MacBook Air M2 (New)",
      condition: "New"
    }
  ],
  instagram: [
    {
      text: "The M2 MacBook Air is a game-changer. Amazing performance and battery life! #Apple #MacBookAir",
      likes: "45,232",
      date: new Date().toISOString()
    }
  ]
};

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 2000;

// TODO: Production Improvements for retry mechanism
/*
1. Add circuit breaker pattern
2. Implement proper error categorization
3. Add metrics collection for retry attempts
4. Set up alerting for high retry rates
*/
async function retry(fn, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = BASE_DELAY * Math.pow(2, i);
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// TODO: Production Improvements for Amazon scraping
/*
1. Implement proper proxy rotation
2. Add captcha solving service integration
3. Use Amazon API if available
4. Implement proper rate limiting
5. Add error recovery for blocked requests
*/
async function extractAmazonInfo(page, url, useMockData = true) {
  if (useMockData) {
    console.log('Using mock Amazon data');
    return MOCK_DATA.amazon;
  }

  const selectors = {
    title: ['#productTitle', 'h1.product-title-word-break'],
    price: ['.a-price .a-offscreen', '.a-price-whole', '#priceblock_ourprice'],
    features: ['#feature-bullets li span', '#productDescription p', '.a-unordered-list .a-list-item'],
    reviews: ['#cm-cr-dp-review-list div.review', '.review-text-content span']
  };

  await page.goto(url, { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });

  // Try to bypass anti-bot detection
  await page.waitForTimeout(2000);
  await autoScroll(page);

  // Function to try multiple selectors
  async function trySelectors(selectorList) {
    for (const selector of selectorList) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        return selector;
      } catch (e) {
        continue;
      }
    }
    throw new Error('No matching selector found');
  }

  const title = await retry(async () => {
    const titleSelector = await trySelectors(selectors.title);
    return page.$eval(titleSelector, el => el.textContent.trim());
  });

  const price = await retry(async () => {
    const priceSelector = await trySelectors(selectors.price);
    return page.$eval(priceSelector, el => el.textContent.trim());
  });

  const features = await retry(async () => {
    const featureSelector = await trySelectors(selectors.features);
    return page.$$eval(featureSelector, elements =>
      elements.map(el => el.textContent.trim())
        .filter(text => text && !text.includes('Click here'))
        .slice(0, 5)
    );
  });

  const reviews = await retry(async () => {
    const reviewSelector = await trySelectors(selectors.reviews);
    return page.$$eval(reviewSelector, elements =>
      elements.slice(0, 5).map(el => {
        const text = el.textContent.trim();
        return text;
      })
    );
  });

  return {
    title,
    price,
    features,
    reviews: reviews.join('\n')
  };
}

// TODO: Production Improvements for Facebook Marketplace
/*
1. Implement proper Facebook API integration
2. Add authentication handling
3. Implement session management
4. Add rate limiting based on Facebook's policies
*/
async function extractFacebookMarketplaceInfo(page, searchTerm, useMockData = true) {
  if (useMockData) {
    console.log('Using mock Facebook Marketplace data');
    return MOCK_DATA.facebook;
  }

  // Facebook requires authentication, so we'll simulate a search result
  return [
    {
      price: 'Market data unavailable',
      title: `${searchTerm} (Used)`,
      condition: 'Used - Good'
    },
    {
      price: 'Market data unavailable',
      title: `${searchTerm} (New)`,
      condition: 'New'
    }
  ];
}

// TODO: Production Improvements for Instagram
/*
1. Implement Instagram Graph API integration
2. Add proper authentication flow
3. Implement webhook for real-time updates
4. Add caching for frequently accessed influencer data
*/
async function extractInstagramReviews(page, influencers, productName, useMockData = true) {
  if (useMockData) {
    console.log('Using mock Instagram data');
    return MOCK_DATA.instagram;
  }

  // Instagram requires authentication, so we'll use a different approach
  // For now, return placeholder data
  return influencers.map(username => ({
    text: `Review data from ${username} for ${productName} is currently unavailable`,
    likes: 'N/A',
    date: new Date().toISOString()
  }));
}

// Utility function for local embeddings
async function getLocalEmbeddingModel() {
  // Use Qwen model for embeddings
  return await pipeline('feature-extraction', 'Xenova/qwen1.5-0.5b');
}

// Mock embeddings for testing (Qwen embedding dimension is 2048)
const MOCK_EMBEDDING = new Array(2048).fill(0).map(() => Math.random() - 0.5);

// Embedding generation with Qwen as primary and OpenAI as fallback
async function createEmbedding(text, useMockData = false) {
  if (useMockData) {
    console.log('Using mock embedding');
    return MOCK_EMBEDDING;
  }

  try {
    // Try Qwen first (local model)
    console.log('Using Qwen for embeddings...');
    const model = await getLocalEmbeddingModel();
    const result = await model(text, { 
      pooling: 'mean', 
      normalize: true,
      // Qwen specific options
      max_length: 512,
      truncation: true
    });
    return Array.from(result.data);
  } catch (localError) {
    console.log('Qwen embedding failed, trying OpenAI:', localError.message);
    try {
      // Fallback to OpenAI
      const response = await retry(async () => {
        const result = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: text,
        });
        return result.data[0].embedding;
      });
      console.log('Using OpenAI embedding');
      return response;
    } catch (error) {
      console.log('OpenAI embedding failed, using mock:', error.message);
      return MOCK_EMBEDDING;
    }
  }
}

// TODO: Production Improvements for embedding combination
/*
1. Implement dynamic weight adjustment based on source quality
2. Add support for more sophisticated combination methods
3. Implement quality metrics for combined embeddings
4. Add A/B testing for different combination strategies
*/
async function combineEmbeddings(embeddings, weights = [0.5, 0.3, 0.2]) {
  // Weighted average of embeddings
  const numDimensions = embeddings[0].length;
  const combined = new Array(numDimensions).fill(0);
  
  embeddings.forEach((embedding, i) => {
    const weight = weights[i] || 1/embeddings.length;
    for (let j = 0; j < numDimensions; j++) {
      combined[j] += embedding[j] * weight;
    }
  });
  
  // Normalize the combined embedding
  const magnitude = Math.sqrt(combined.reduce((sum, val) => sum + val * val, 0));
  return combined.map(val => val / magnitude);
}

// TODO: Production Improvements for analysis
/*
1. Implement caching for similar products
2. Add sentiment analysis
3. Implement price trend analysis
4. Add competitive analysis
5. Implement multi-language support
*/
async function analyzeProductData(amazonData, fbListings, instagramReviews) {
  return await retry(async () => {
    const analysis = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Analyze this product across different platforms:

Amazon:
${amazonData.title}
Features: ${amazonData.features.join('\n')}
Reviews: ${amazonData.reviews}

Facebook Marketplace Listings:
${fbListings.map(l => `${l.title} - ${l.price} (${l.condition})`).join('\n')}

Instagram Influencer Reviews:
${instagramReviews.map(r => `${r.text} (Likes: ${r.likes})`).join('\n\n')}

Provide:
1. A comprehensive review summary incorporating all sources (3-4 sentences)
2. Key reasons why someone should buy this product (3-4 points)
3. Most important facts about the product (4-5 points)
4. Price analysis across platforms
5. Common pros and cons mentioned by reviewers`
      }]
    });

    const analysisText = analysis.content[0].text;
    const sections = analysisText.split('\n\n');
    
    return {
      review: sections[0]?.trim() || '',
      whyBuy: sections[1]?.trim() || '',
      facts: sections[2]?.split('\n').map(f => f.replace(/^[•-]\s*/, '').trim()).filter(Boolean) || [],
      priceAnalysis: sections[3]?.trim() || '',
      prosAndCons: sections[4]?.trim() || ''
    };
  });
}

// Update DatabaseService to handle FAISS persistence properly
class EnhancedDatabaseService extends DatabaseService {
  constructor() {
    super();
    this.indexPath = path.join(process.cwd(), 'data', 'faiss_index.idx');
    this.metadataPath = path.join(process.cwd(), 'data', 'faiss_metadata.json');
  }

  async initialize() {
    try {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
      await super.initialize();
    } catch (error) {
      console.error('Error initializing database service:', error);
      throw error;
    }
  }

  async saveIndex() {
    try {
      // Save product IDs mapping
      await fs.writeFile(
        this.metadataPath,
        JSON.stringify({ productIds: this.productIds }),
        'utf8'
      );
      console.log('Index metadata saved successfully');
    } catch (error) {
      console.error('Error saving index:', error);
    }
  }

  async loadIndex() {
    try {
      const metadata = await fs.readFile(this.metadataPath, 'utf8');
      const { productIds } = JSON.parse(metadata);
      this.productIds = productIds;
      console.log('Index metadata loaded successfully');
    } catch (error) {
      console.log('No existing index found, creating new one');
      this.productIds = [];
    }
  }
}

// TODO: Production Improvements for main process
/*
1. Implement proper job queue system (e.g., Bull, AWS SQS)
2. Add monitoring and alerting
3. Implement proper logging (e.g., Winston, Bunyan)
4. Add metrics collection (e.g., Prometheus)
5. Implement proper error handling and recovery
6. Add distributed tracing
*/
async function main() {
  const browser = await chromium.launch({ 
    headless: true
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    geolocation: { longitude: -122.084, latitude: 37.422 },
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  });

  const page = await context.newPage();
  const dbService = new EnhancedDatabaseService();
  await dbService.initialize();

  console.log('Starting product scraping (TEST MODE with mock data)...');

  for (const product of TEST_PRODUCTS) {
    try {
      console.log(`Processing ${product.name}...`);
      
      // Use mock data for testing
      const amazonData = await extractAmazonInfo(page, product.amazon, true);
      console.log('Amazon data collected (mock)');
      
      const fbListings = await extractFacebookMarketplaceInfo(page, product.fbMarketplace, true);
      console.log('Facebook Marketplace data collected (mock)');
      
      const instagramReviews = await extractInstagramReviews(page, product.instagram, product.name, true);
      console.log('Instagram review data collected (mock)');

      console.log('Creating embeddings (with fallback)...');
      const amazonEmbedding = await createEmbedding(
        `${amazonData.title}\n${amazonData.features.join('\n')}\n${amazonData.reviews}`,
        true // Use mock data for testing
      );
      
      const fbEmbedding = await createEmbedding(
        fbListings.map(l => `${l.title} - ${l.price} (${l.condition})`).join('\n'),
        true // Use mock data for testing
      );
      
      const instagramEmbedding = await createEmbedding(
        instagramReviews.map(r => r.text).join('\n'),
        true // Use mock data for testing
      );

      const combinedEmbedding = await combineEmbeddings(
        [amazonEmbedding, fbEmbedding, instagramEmbedding],
        [0.5, 0.3, 0.2]
      );

      console.log('Analyzing product data...');
      const analysis = await analyzeProductData(amazonData, fbListings, instagramReviews);

      const productData = {
        title: amazonData.title,
        price: amazonData.price,
        link: product.amazon,
        source: 'multi-platform',
        facts: analysis.facts,
        review: analysis.review,
        whyBuy: analysis.whyBuy,
        amazonReviewSummary: amazonData.reviews,
        instagramReviewSummary: instagramReviews.map(r => r.text).join('\n'),
        fbMarketplaceSummary: analysis.priceAnalysis,
        prosAndCons: analysis.prosAndCons,
        embedding: combinedEmbedding,
        lastUpdated: new Date()
      };

      console.log(`Storing product: ${productData.title}`);
      await dbService.storeProduct(productData);
      console.log('Product stored successfully!\n');
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`Error processing ${product.name}:`, error);
    }
  }

  await dbService.cleanup();
  await browser.close();
  console.log('Test run completed! Database populated with mock products and FAISS index created.');
}

// Run in test mode
main().catch(console.error); 