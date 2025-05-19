import { chromium } from 'playwright';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

export class ReviewService {
  constructor() {
    this.browser = null;
    this.context = null;
  }

  async initialize() {
    this.browser = await chromium.launch({
      headless: true
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    console.log('Review service initialized');
  }

  async scrapeAmazonReviews(productUrl) {
    const page = await this.context.newPage();
    try {
      await page.goto(productUrl, { waitUntil: 'networkidle' });
      
      // Click on reviews tab/link
      await page.click('#acrCustomerReviewText');
      await page.waitForSelector('.review-text-content');

      // Extract reviews
      const reviews = await page.$$eval('.review-text-content', elements =>
        elements.slice(0, 10).map(el => el.textContent.trim())
      );

      // Use Claude to summarize reviews
      const summary = await this.summarizeReviews(reviews, 'Amazon');
      return summary;

    } catch (error) {
      console.error('Error scraping Amazon reviews:', error);
      return null;
    } finally {
      await page.close();
    }
  }

  async scrapeInstagramReviews(productName) {
    const page = await this.context.newPage();
    try {
      // Search for product hashtag
      await page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(productName.replace(/\s+/g, ''))}`);
      await page.waitForSelector('article');

      // Extract post captions
      const posts = await page.$$eval('article', elements =>
        elements.slice(0, 10).map(el => {
          const caption = el.querySelector('img')?.alt || '';
          return caption;
        })
      );

      // Use Claude to summarize posts
      const summary = await this.summarizeReviews(posts, 'Instagram');
      return summary;

    } catch (error) {
      console.error('Error scraping Instagram reviews:', error);
      return null;
    } finally {
      await page.close();
    }
  }

  async summarizeReviews(reviews, source) {
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze these ${source} reviews/posts and provide a comprehensive summary highlighting:
        1. Overall sentiment
        2. Most mentioned pros
        3. Most mentioned cons
        4. Common use cases
        5. Quality and durability feedback
        Reviews: ${JSON.stringify(reviews)}
        Format the response as a concise paragraph.`
      }]
    });

    return message.content;
  }

  async cleanup() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    console.log('Review service cleaned up');
  }
} 