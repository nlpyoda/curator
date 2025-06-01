// Script to create brand_personas table in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uubjjjxzywpyxiqcxnfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Ympqanh6eXdweXhpcWN4bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTIwODQsImV4cCI6MjA2NDIyODA4NH0.ba0c3uKsmhs9BosnuqLJFUYyjDYZQGxNDZE-qWA5v-4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBrandPersonasTable() {
  console.log('Creating brand_personas table in Supabase...');

  try {
    // Create the brand_personas table using SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS brand_personas (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          brand_name VARCHAR(100) NOT NULL UNIQUE,
          persona VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          keywords TEXT[] NOT NULL DEFAULT '{}',
          values TEXT[] NOT NULL DEFAULT '{}',
          demographics TEXT[] NOT NULL DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_brand_personas_brand_name ON brand_personas(brand_name);
        CREATE INDEX IF NOT EXISTS idx_brand_personas_keywords ON brand_personas USING GIN(keywords);
        CREATE INDEX IF NOT EXISTS idx_brand_personas_values ON brand_personas USING GIN(values);
        CREATE INDEX IF NOT EXISTS idx_brand_personas_demographics ON brand_personas USING GIN(demographics);

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_brand_personas_updated_at ON brand_personas;
        CREATE TRIGGER update_brand_personas_updated_at
          BEFORE UPDATE ON brand_personas
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (error) {
      throw error;
    }

    console.log('✅ brand_personas table created successfully');
    return true;

  } catch (error) {
    // If the rpc doesn't exist, try direct SQL execution
    console.log('RPC method not available, attempting direct table creation...');
    
    try {
      // Alternative approach: Create table through direct query
      const { error: createError } = await supabase
        .from('brand_personas')
        .select('*')
        .limit(1);

      if (createError && createError.message.includes('does not exist')) {
        console.log('⚠️  Table does not exist. Please create it manually in Supabase SQL editor:');
        console.log(`
CREATE TABLE brand_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name VARCHAR(100) NOT NULL UNIQUE,
  persona VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  values TEXT[] NOT NULL DEFAULT '{}',
  demographics TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_brand_personas_brand_name ON brand_personas(brand_name);
CREATE INDEX idx_brand_personas_keywords ON brand_personas USING GIN(keywords);
CREATE INDEX idx_brand_personas_values ON brand_personas USING GIN(values);
CREATE INDEX idx_brand_personas_demographics ON brand_personas USING GIN(demographics);
        `);
        return false;
      }

      console.log('✅ brand_personas table already exists or was created');
      return true;

    } catch (altError) {
      console.error('❌ Error creating brand_personas table:', altError);
      return false;
    }
  }
}

// Brand personas data from frontend
const brandPersonas = {
  'Apple': {
    persona: 'Tech Minimalist Pioneer',
    description: 'Clean design meets cutting-edge innovation',
    keywords: ['minimalist', 'premium', 'innovative', 'sleek', 'intuitive'],
    values: ['design', 'simplicity', 'innovation', 'premium quality'],
    demographics: ['professionals', 'creatives', 'tech enthusiasts']
  },
  'Patagonia': {
    persona: 'Sustainable Adventure Innovator', 
    description: 'Environmental responsibility meets outdoor performance',
    keywords: ['sustainable', 'outdoor', 'ethical', 'durable', 'adventure'],
    values: ['sustainability', 'environmental responsibility', 'adventure', 'quality'],
    demographics: ['outdoor enthusiasts', 'eco-conscious', 'millennials']
  },
  'Nike': {
    persona: 'Performance Lifestyle Champion',
    description: 'Athletic excellence inspiring everyday achievement',
    keywords: ['performance', 'athletic', 'motivational', 'innovative', 'lifestyle'],
    values: ['excellence', 'innovation', 'inspiration', 'performance'],
    demographics: ['athletes', 'fitness enthusiasts', 'lifestyle conscious']
  },
  'Dyson': {
    persona: 'Engineering Excellence Disruptor',
    description: 'Revolutionary engineering transforming home experiences',
    keywords: ['innovative', 'engineering', 'premium', 'efficient', 'modern'],
    values: ['innovation', 'engineering excellence', 'efficiency', 'design'],
    demographics: ['tech adopters', 'design conscious', 'premium shoppers']
  },
  'Lululemon': {
    persona: 'Mindful Wellness Curator',
    description: 'Conscious living through premium athletic lifestyle',
    keywords: ['wellness', 'mindful', 'premium', 'community', 'lifestyle'],
    values: ['wellness', 'mindfulness', 'community', 'quality', 'lifestyle'],
    demographics: ['wellness enthusiasts', 'yoga practitioners', 'mindful consumers']
  },
  'Bose': {
    persona: 'Audio Perfectionist Innovator',
    description: 'Obsessive audio engineering for pure listening experiences',
    keywords: ['audio excellence', 'engineering', 'premium', 'immersive', 'precision'],
    values: ['audio quality', 'innovation', 'craftsmanship', 'experience'],
    demographics: ['audiophiles', 'music lovers', 'professionals']
  },
  'Sony': {
    persona: 'Creative Technology Enabler',
    description: 'Empowering creativity through advanced technology',
    keywords: ['creative', 'innovative', 'professional', 'entertainment', 'quality'],
    values: ['creativity', 'innovation', 'entertainment', 'professional quality'],
    demographics: ['creatives', 'professionals', 'entertainment enthusiasts']
  },
  'Samsung': {
    persona: 'Smart Innovation Pioneer',
    description: 'Intelligent technology enhancing connected lifestyles',
    keywords: ['smart', 'connected', 'innovative', 'versatile', 'advanced'],
    values: ['innovation', 'connectivity', 'intelligence', 'versatility'],
    demographics: ['tech enthusiasts', 'early adopters', 'connected consumers']
  }
};

async function populateBrandPersonas() {
  console.log('Populating brand personas...');

  try {
    for (const [brandName, persona] of Object.entries(brandPersonas)) {
      const { data, error } = await supabase
        .from('brand_personas')
        .upsert({
          brand_name: brandName,
          persona: persona.persona,
          description: persona.description,
          keywords: persona.keywords,
          values: persona.values,
          demographics: persona.demographics
        }, {
          onConflict: 'brand_name'
        })
        .select();

      if (error) {
        console.error(`❌ Error inserting ${brandName}:`, error);
      } else {
        console.log(`✅ Inserted/Updated ${brandName}`);
      }
    }

    console.log('✅ Brand personas populated successfully');
    return true;

  } catch (error) {
    console.error('❌ Error populating brand personas:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up brand personas in Supabase...\n');

  const tableCreated = await createBrandPersonasTable();
  
  if (tableCreated) {
    await populateBrandPersonas();
  } else {
    console.log('⚠️  Please create the table manually in Supabase and run this script again');
  }

  console.log('\n✨ Brand personas setup complete!');
}

// Run the script
main().catch(console.error);