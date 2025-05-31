-- Supabase Product table schema
-- Run this in Supabase SQL Editor to create the Product table

CREATE TABLE IF NOT EXISTS "Product" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    link TEXT NOT NULL,
    source TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL,
    "whyBuy" TEXT NOT NULL,
    "amazonReviewSummary" TEXT,
    "instagramReviewSummary" TEXT,
    "fbMarketplaceSummary" TEXT,
    "prosAndCons" JSONB,
    "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "productEmbedding" FLOAT8[],
    category TEXT,
    "subCategory" TEXT,
    tags TEXT[] DEFAULT '{}',
    attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_title ON "Product" USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_product_description ON "Product" USING GIN (to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product" (category, "subCategory");
CREATE INDEX IF NOT EXISTS idx_product_tags ON "Product" USING GIN (tags);

-- Create PersonaEmbedding table (optional - for future use)
CREATE TABLE IF NOT EXISTS "PersonaEmbedding" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "personaName" TEXT NOT NULL,
    description TEXT NOT NULL,
    embedding FLOAT8[] NOT NULL,
    "relevanceScore" FLOAT8 NOT NULL,
    "productId" UUID REFERENCES "Product"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PersonaEmbedding
CREATE INDEX IF NOT EXISTS idx_persona_name ON "PersonaEmbedding" ("personaName");
CREATE INDEX IF NOT EXISTS idx_persona_product ON "PersonaEmbedding" ("productId");

-- Insert sample data (same as our mock data)
INSERT INTO "Product" (
    title, price, link, source, description, features, "whyBuy",
    "amazonReviewSummary", "instagramReviewSummary", "fbMarketplaceSummary",
    "prosAndCons", category, "subCategory", tags
) VALUES
(
    'Premium Wireless Headphones',
    '$299.99',
    'https://example.com/headphones',
    'Amazon',
    'High-quality wireless headphones with noise cancellation and premium sound quality.',
    '- Active noise cancellation
- 30-hour battery life
- Premium audio drivers
- Comfortable over-ear design',
    'These headphones offer exceptional sound quality and comfort for long listening sessions.',
    'Users love the sound quality and battery life. Some mention they are a bit heavy.',
    'Influencers praise the sleek design and noise cancellation features.',
    'Highly rated for durability and customer service.',
    '{"pros": ["Excellent sound quality", "Long battery life", "Effective noise cancellation"], "cons": ["Premium price point", "Slightly heavy for extended wear"]}',
    'Electronics',
    'Audio',
    '{"wireless", "premium", "premium-price"}'
),
(
    'Smart Home Hub',
    '$129.99',
    'https://example.com/smarthub',
    'Best Buy',
    'Central control for all your smart home devices with voice assistant integration.',
    '- Compatible with 100+ smart devices
- Voice control
- Scheduling and automation
- Energy monitoring',
    'This hub simplifies managing all your smart home devices from one central interface.',
    'Users appreciate the easy setup and wide compatibility.',
    'Tech reviewers highlight the intuitive app interface.',
    'Buyers mention good value for the features offered.',
    '{"pros": ["Wide device compatibility", "Easy setup", "Reliable connection"], "cons": ["Limited advanced automation without subscription"]}',
    'Smart Home',
    'Automation',
    '{"smart"}'
),
(
    'Ultra HD Smart TV 55"',
    '$699.99',
    'https://example.com/tv',
    'Walmart',
    'Crystal clear 4K display with smart features and streaming apps built-in.',
    '- 4K Ultra HD resolution
- HDR support
- Built-in streaming apps
- Voice remote',
    'This TV offers excellent picture quality and smart features at a competitive price point.',
    'Customers love the picture quality and smart features.',
    'Tech influencers praise the value for money.',
    'High ratings for picture quality and easy setup.',
    '{"pros": ["Excellent picture quality", "User-friendly interface", "Good value"], "cons": ["Sound could be better", "Limited gaming features"]}',
    'Electronics',
    'Display',
    '{"smart"}'
),
(
    'Professional Blender',
    '$199.99',
    'https://example.com/blender',
    'Target',
    'High-powered blender for smoothies, soups, and food processing.',
    '- 1500W motor
- Variable speed control
- Pulse function
- Dishwasher-safe parts',
    'This blender can handle any blending task with ease and is built to last.',
    'Customers praise its power and durability.',
    'Food bloggers love the versatility and consistent results.',
    'High ratings for build quality and performance.',
    '{"pros": ["Powerful motor", "Versatile functions", "Easy to clean"], "cons": ["Loud operation", "Takes up counter space"]}',
    'Kitchen',
    'Appliances',
    '{"professional"}'
),
(
    'Ergonomic Office Chair',
    '$249.99',
    'https://example.com/chair',
    'Office Depot',
    'Adjustable office chair designed for comfort during long work sessions.',
    '- Adjustable lumbar support
- Breathable mesh back
- Adjustable armrests
- 5-year warranty',
    'This chair provides excellent support for long work days and helps prevent back pain.',
    'Users report reduced back pain and improved comfort.',
    'Work-from-home professionals recommend for all-day comfort.',
    'Consistently rated highly for build quality and ergonomics.',
    '{"pros": ["Excellent lumbar support", "Highly adjustable", "Durable construction"], "cons": ["Assembly takes time", "Premium price point"]}',
    'Furniture',
    'Office Furniture',
    '{"office", "ergonomic", "premium-price"}'
)
ON CONFLICT (id) DO NOTHING;