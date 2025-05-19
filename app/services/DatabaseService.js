import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';

const prisma = new PrismaClient();

// Only initialize OpenAI if API key is available
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  } else {
    console.warn('OPENAI_API_KEY not found. OpenAI client will not be initialized.');
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

const EMBEDDING_DIM = 384; // MiniLM-L6 dimension

// Utility function to compute cosine similarity
function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class DatabaseService {
  constructor() {
    this.prisma = prisma;
  }

  async initialize() {
    console.log('Database service initialized');
  }

  async storeProduct(productData, personaData = []) {
    try {
      // Convert product embedding to array format
      const productEmbedding = Array.from(productData.productEmbedding);
      console.log('Product embedding length:', productEmbedding.length);
      
      if (productEmbedding.length !== EMBEDDING_DIM) {
        throw new Error(`Invalid product embedding dimension: ${productEmbedding.length}, expected ${EMBEDDING_DIM}`);
      }

      // Prepare persona embeddings data
      const personaEmbeddings = personaData.map(persona => ({
        personaName: persona.name,
        description: persona.description,
        embedding: Array.from(persona.embedding),
        relevanceScore: persona.relevanceScore || 0.5
      }));

      // Store product with embeddings in PostgreSQL
      const product = await this.prisma.product.create({
        data: {
          title: productData.title,
          price: productData.price,
          link: productData.link,
          source: productData.source,
          description: productData.description,
          features: productData.features,
          whyBuy: productData.whyBuy,
          amazonReviewSummary: productData.amazonReviewSummary,
          instagramReviewSummary: productData.instagramReviewSummary,
          fbMarketplaceSummary: productData.fbMarketplaceSummary,
          prosAndCons: productData.prosAndCons,
          lastUpdated: productData.lastUpdated || new Date(),
          productEmbedding: productEmbedding,
          category: productData.category,
          subCategory: productData.subCategory,
          tags: productData.tags || [],
          attributes: productData.attributes || {},
          personaEmbeddings: {
            create: personaEmbeddings
          }
        }
      });

      console.log('Product stored in PostgreSQL with ID:', product.id);
      return product;
    } catch (error) {
      console.error('Error storing product:', error);
      throw error;
    }
  }

  async searchSimilarProducts(queryEmbedding, persona = null, k = 5) {
    try {
      // Convert query embedding to array
      const embedding = Array.from(queryEmbedding);
      console.log('Query embedding length:', embedding.length);
      
      if (embedding.length !== EMBEDDING_DIM) {
        throw new Error(`Invalid query embedding dimension: ${embedding.length}, expected ${EMBEDDING_DIM}`);
      }

      // Get all products with their embeddings
      const products = await this.prisma.product.findMany({
        include: {
          personaEmbeddings: persona ? {
            where: {
              personaName: {
                contains: persona,
                mode: 'insensitive'
              }
            }
          } : true
        }
      });

      // Calculate similarities and sort
      const productsWithSimilarity = products.map(product => {
        // Base similarity with product embedding
        let similarity = cosineSimilarity(embedding, product.productEmbedding);
        
        // If persona is provided and matching persona embeddings exist, boost similarity
        if (persona && product.personaEmbeddings.length > 0) {
          // Find the most relevant persona embedding
          const personaEmbedding = product.personaEmbeddings.reduce((best, current) => {
            return current.relevanceScore > best.relevanceScore ? current : best;
          }, product.personaEmbeddings[0]);
          
          // Boost similarity based on persona relevance
          const personaSimilarity = cosineSimilarity(embedding, personaEmbedding.embedding);
          similarity = (similarity + personaSimilarity * personaEmbedding.relevanceScore) / 2;
        }

        return {
          ...product,
          similarity
        };
      });

      // Sort by similarity (highest first) and take top k
      const results = productsWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, k);

      console.log(`Found ${results.length} similar products`);
      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getProductsByStore(storeName, limit = 10) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          source: {
            contains: storeName,
            mode: 'insensitive'
          }
        },
        take: limit
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products by store:', error);
      return [];
    }
  }

  async getProductsByCategory(category, subCategory = null, limit = 10) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          category: {
            contains: category,
            mode: 'insensitive'
          },
          ...(subCategory && {
            subCategory: {
              contains: subCategory,
              mode: 'insensitive'
            }
          })
        },
        take: limit
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}