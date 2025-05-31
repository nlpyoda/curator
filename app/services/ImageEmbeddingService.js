// Image Embedding Service for visual product search
export class ImageEmbeddingService {
  constructor() {
    this.apiKey = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      // Check for OpenAI API key for CLIP embeddings
      this.apiKey = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      
      if (!this.apiKey) {
        console.log('⚠️ No OpenAI API key found. Image embeddings will not be available.');
        return false;
      }

      this.initialized = true;
      console.log('✅ Image Embedding Service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Image Embedding Service:', error);
      return false;
    }
  }

  /**
   * Generate embeddings for an image URL using OpenAI's API
   * @param {string} imageUrl - URL of the image to generate embeddings for
   * @returns {Promise<number[]>} - Array of embedding values
   */
  async generateImageEmbedding(imageUrl) {
    if (!this.initialized) {
      throw new Error('Image Embedding Service not initialized');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002', // Using text model for now
          input: `Product image: ${imageUrl}`, // Will be replaced with actual image processing
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating image embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for a product description (fallback)
   * @param {string} productDescription - Product title and description
   * @returns {Promise<number[]>} - Array of embedding values
   */
  async generateTextEmbedding(productDescription) {
    if (!this.initialized) {
      throw new Error('Image Embedding Service not initialized');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: productDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating text embedding:', error);
      throw error;
    }
  }

  /**
   * Process product image and generate embeddings
   * This is a placeholder for future CLIP model integration
   * @param {string} imageUrl - URL of the product image
   * @returns {Promise<number[]>} - Array of embedding values
   */
  async processProductImage(imageUrl) {
    // For now, we'll generate embeddings based on the image URL
    // In the future, this would use a CLIP model to process the actual image
    return await this.generateImageEmbedding(imageUrl);
  }

  /**
   * Generate embeddings for search query (text or image description)
   * @param {string} query - Search query
   * @returns {Promise<number[]>} - Array of embedding values
   */
  async generateQueryEmbedding(query) {
    return await this.generateTextEmbedding(query);
  }

  /**
   * Calculate cosine similarity between two embeddings
   * @param {number[]} embedding1 - First embedding vector
   * @param {number[]} embedding2 - Second embedding vector
   * @returns {number} - Similarity score between 0 and 1
   */
  cosineSimilarity(embedding1, embedding2) {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    if (magnitude === 0) return 0;

    return dotProduct / magnitude;
  }

  /**
   * Mock embedding generation for development/testing
   * @param {string} input - Input text or image URL
   * @returns {number[]} - Mock embedding vector
   */
  generateMockEmbedding(input) {
    // Generate a consistent but random-looking embedding based on input
    const hash = this.simpleHash(input);
    const embedding = [];
    
    for (let i = 0; i < 768; i++) {
      // Use hash to generate consistent pseudo-random values
      const value = Math.sin(hash + i) * 0.5;
      embedding.push(value);
    }
    
    return embedding;
  }

  /**
   * Simple hash function for consistent mock embeddings
   * @param {string} str - Input string
   * @returns {number} - Hash value
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  async cleanup() {
    this.initialized = false;
    this.apiKey = null;
  }
}