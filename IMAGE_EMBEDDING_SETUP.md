# 🖼️ Image & Embedding Setup Guide

## 🎯 Overview
This guide sets up **image support** and **pgvector embeddings** for visual product search using Supabase.

## 📋 Prerequisites
- Supabase project with Product table
- Optional: OpenAI API key for real embeddings (will use mock embeddings otherwise)

## 🔧 Step 1: Run SQL Setup in Supabase

Copy and paste this SQL into your **Supabase SQL Editor**:

```sql
-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add image column for storing image URLs
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS image TEXT;

-- Add image_embedding column for pgvector similarity search
-- Using vector(1536) for OpenAI text-embedding-ada-002
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS image_embedding vector(1536);

-- Create index for fast similarity search
CREATE INDEX IF NOT EXISTS product_image_embedding_idx 
ON "Product" 
USING hnsw (image_embedding vector_cosine_ops);

-- Add metadata columns
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'openai-ada-002';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS embedding_created_at TIMESTAMP DEFAULT NOW();

-- Create similarity search function
CREATE OR REPLACE FUNCTION search_products_by_image_similarity(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  price text,
  link text,
  image text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.price,
    p.link,
    p.image,
    1 - (p.image_embedding <=> query_embedding) AS similarity
  FROM "Product" p
  WHERE p.image_embedding IS NOT NULL
    AND 1 - (p.image_embedding <=> query_embedding) > match_threshold
  ORDER BY p.image_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create multimodal search function (text + image)
CREATE OR REPLACE FUNCTION search_products_multimodal(
  text_query text DEFAULT '',
  image_embedding vector(1536) DEFAULT NULL,
  text_weight float DEFAULT 0.6,
  image_weight float DEFAULT 0.4,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  price text,
  link text,
  image text,
  description text,
  combined_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.price,
    p.link,
    p.image,
    p.description,
    CASE 
      WHEN text_query != '' AND image_embedding IS NOT NULL AND p.image_embedding IS NOT NULL THEN
        (text_weight * ts_rank_cd(to_tsvector('english', p.title || ' ' || p.description), plainto_tsquery('english', text_query))) +
        (image_weight * (1 - (p.image_embedding <=> image_embedding)))
      WHEN text_query != '' THEN
        ts_rank_cd(to_tsvector('english', p.title || ' ' || p.description), plainto_tsquery('english', text_query))
      WHEN image_embedding IS NOT NULL AND p.image_embedding IS NOT NULL THEN
        1 - (p.image_embedding <=> image_embedding)
      ELSE 0
    END AS combined_score
  FROM "Product" p
  WHERE 
    (text_query = '' OR 
     to_tsvector('english', p.title || ' ' || p.description) @@ plainto_tsquery('english', text_query))
    AND
    (image_embedding IS NULL OR 
     p.image_embedding IS NULL OR 
     1 - (p.image_embedding <=> image_embedding) > 0.5)
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;
```

## 🚀 Step 2: Run Setup Scripts

### Option A: Full Setup (Images + Embeddings)
```bash
# This will add images and generate embeddings for all products
node scripts/populateEmbeddings.js
```

### Option B: Images Only (if you ran SQL manually)
```bash
# If you already ran the SQL and just need images
node scripts/addImageColumn.js
```

## 🔍 Step 3: Test the Setup

After running the scripts, test your search:

```bash
# Test regular search (should now include images)
node -e "
import { AIProductService } from './app/services/AIProductService.js';
const service = new AIProductService();
await service.initialize();
const results = await service.searchProducts('macbook', 'tech enthusiast');
console.log('Search results:', results.map(p => ({title: p.title, price: p.price, image: p.image})));
"
```

## 🤖 OpenAI API Key (Optional but Recommended)

For **real embeddings** instead of mock ones:

1. Get OpenAI API key from https://platform.openai.com
2. Add to your environment:
   ```bash
   export OPENAI_API_KEY="sk-..."
   # or add to .env file
   OPENAI_API_KEY=sk-...
   ```
3. Re-run: `node scripts/populateEmbeddings.js`

## 📊 What You Get

### ✅ After Setup:
- **Image URLs**: All products have high-quality images
- **Vector Search**: pgvector-powered similarity search
- **Multimodal Search**: Combined text + image search
- **Fast Indexing**: HNSW index for sub-second search
- **Fallback Support**: Works with or without OpenAI API

### 🔍 Search Capabilities:
1. **Text Search**: "laptop computer" → finds MacBooks
2. **Image Similarity**: Upload/describe image → find visually similar products
3. **Combined Search**: "red gaming chair" + chair image → best matches
4. **Semantic Search**: "work from home setup" → finds relevant products

## 🗄️ Database Schema After Setup

```sql
-- Product table structure
Table "Product" (
  id UUID PRIMARY KEY,
  title TEXT,
  price TEXT,
  link TEXT,
  image TEXT,                    -- ✅ NEW: Image URLs
  image_embedding VECTOR(1536),  -- ✅ NEW: Embeddings
  embedding_model TEXT,          -- ✅ NEW: Model metadata
  embedding_created_at TIMESTAMP,-- ✅ NEW: Timestamp
  -- ... existing columns
)
```

## 🎯 Search Examples

### Image Similarity Search:
```javascript
// Find products similar to a MacBook
const embedding = await embeddingService.generateQueryEmbedding('MacBook laptop computer');
const similar = await supabaseService.searchProductsByImageSimilarity(embedding, 0.7, 5);
```

### Multimodal Search:
```javascript
// Combine text + image search
const results = await supabaseService.searchProductsMultimodal(
  'gaming chair', 
  chairImageEmbedding,
  { textWeight: 0.6, imageWeight: 0.4 }
);
```

## 🔧 Troubleshooting

### Issue: "relation does not exist"
- **Solution**: Run the SQL setup in Supabase SQL Editor

### Issue: "vector extension not found"
- **Solution**: Enable pgvector extension: `CREATE EXTENSION vector;`

### Issue: "function search_products_by_image_similarity does not exist"
- **Solution**: Run the function creation SQL from Step 1

### Issue: No embeddings generated
- **Solution**: Check OpenAI API key or use mock embeddings for testing

## 📈 Performance Notes

- **pgvector HNSW index**: Sub-second search on 100k+ products
- **Embedding dimensions**: 1536 (OpenAI) or 768 (CLIP) - adjust as needed
- **Similarity threshold**: 0.7 default, lower for more results
- **Rate limiting**: 1 second delay between OpenAI API calls

## 🎉 Success Validation

After setup, you should see:
```
✅ All products have images
✅ All products have embeddings  
✅ Similarity search returns results
✅ Multimodal search works
✅ Fast performance with indexes
```

Your product curation app now has **state-of-the-art visual search** capabilities! 🚀