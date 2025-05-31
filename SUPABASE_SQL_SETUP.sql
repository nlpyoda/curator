-- SQL to add image and embedding columns to Supabase Product table
-- Run this in your Supabase SQL Editor

-- 1. First, enable the pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add image column for storing image URLs
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS image TEXT;

-- 3. Add image_embedding column for pgvector similarity search
-- Using vector(768) which is common for OpenAI/CLIP embeddings
-- Adjust the dimension based on your embedding model:
-- - OpenAI text-embedding-ada-002: vector(1536)
-- - CLIP models: vector(512) or vector(768)
-- - Sentence-BERT: vector(384) or vector(768)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS image_embedding vector(768);

-- 4. Create an index on the embedding column for fast similarity search
CREATE INDEX IF NOT EXISTS product_image_embedding_idx 
ON "Product" 
USING hnsw (image_embedding vector_cosine_ops);

-- 5. Optional: Add a function to search products by image similarity
CREATE OR REPLACE FUNCTION search_products_by_image_similarity(
  query_embedding vector(768),
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

-- 6. Optional: Add a function to search products by combined text + image similarity
CREATE OR REPLACE FUNCTION search_products_multimodal(
  text_query text DEFAULT '',
  image_embedding vector(768) DEFAULT NULL,
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
      -- If both text and image query provided
      WHEN text_query != '' AND image_embedding IS NOT NULL AND p.image_embedding IS NOT NULL THEN
        (text_weight * ts_rank_cd(to_tsvector('english', p.title || ' ' || p.description), plainto_tsquery('english', text_query))) +
        (image_weight * (1 - (p.image_embedding <=> image_embedding)))
      -- If only text query provided
      WHEN text_query != '' THEN
        ts_rank_cd(to_tsvector('english', p.title || ' ' || p.description), plainto_tsquery('english', text_query))
      -- If only image query provided  
      WHEN image_embedding IS NOT NULL AND p.image_embedding IS NOT NULL THEN
        1 - (p.image_embedding <=> image_embedding)
      ELSE 0
    END AS combined_score
  FROM "Product" p
  WHERE 
    -- Text search condition
    (text_query = '' OR 
     to_tsvector('english', p.title || ' ' || p.description) @@ plainto_tsquery('english', text_query))
    AND
    -- Image similarity condition (if image query provided)
    (image_embedding IS NULL OR 
     p.image_embedding IS NULL OR 
     1 - (p.image_embedding <=> image_embedding) > 0.5)
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- 7. Create indexes for better text search performance
CREATE INDEX IF NOT EXISTS product_text_search_idx 
ON "Product" 
USING gin(to_tsvector('english', title || ' ' || description));

-- 8. Optional: Add metadata columns for embeddings
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'clip-vit-base-patch32';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS embedding_created_at TIMESTAMP DEFAULT NOW();

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Product' 
ORDER BY ordinal_position;