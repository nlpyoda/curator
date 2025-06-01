-- Fixed SQL for multimodal search function
-- Run this in Supabase SQL Editor to fix the ambiguous column reference

DROP FUNCTION IF EXISTS search_products_multimodal(text, vector, float, float, int);

CREATE OR REPLACE FUNCTION search_products_multimodal(
  text_query text DEFAULT '',
  image_embedding vector DEFAULT NULL,
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