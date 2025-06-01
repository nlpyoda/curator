// Netlify serverless function to handle AI curation API calls
// This avoids CORS issues by making the API call from the server side

exports.handler = async (event, context) => {
  // Handle preflight requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { prompt, selectedBrands, personaStyle, personaBudget, lookingFor } = JSON.parse(event.body);

    // Get the API key from environment variables
    const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || 
                          process.env.REACT_APP_CLAUDE_API_KEY ||
                          process.env.CLAUDE_API_KEY;
    
    console.log('Environment variables check:', {
      EXPO_PUBLIC_CLAUDE_API_KEY: process.env.EXPO_PUBLIC_CLAUDE_API_KEY ? 'SET' : 'NOT SET',
      REACT_APP_CLAUDE_API_KEY: process.env.REACT_APP_CLAUDE_API_KEY ? 'SET' : 'NOT SET',
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? 'SET' : 'NOT SET',
      finalKey: CLAUDE_API_KEY ? 'FOUND' : 'NOT FOUND',
      keyLength: CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0,
      keyPrefix: CLAUDE_API_KEY ? CLAUDE_API_KEY.substring(0, 15) + '...' : 'N/A'
    });
    
    if (!CLAUDE_API_KEY) {
      console.error('Claude API key not found in any environment variable');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'API key not configured',
          details: 'Claude API key not found in server environment variables',
          checkedVars: ['EXPO_PUBLIC_CLAUDE_API_KEY', 'REACT_APP_CLAUDE_API_KEY', 'CLAUDE_API_KEY']
        })
      };
    }

    // Check if API key looks valid and try Claude API first
    console.log('API key validation:', {
      hasKey: !!CLAUDE_API_KEY,
      startsCorrect: CLAUDE_API_KEY ? CLAUDE_API_KEY.startsWith('sk-ant-api03-') : false,
      lengthOk: CLAUDE_API_KEY ? CLAUDE_API_KEY.length >= 90 : false,
      actualLength: CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0
    });
    
    // Define fallback function for mock products
    const getMockProducts = () => {
      try {
        // Define mock products directly (can't use require in serverless functions easily)
        const MOCK_PRODUCTS = [
          {
            id: '1',
            title: 'Apple MacBook Pro 14"',
            price: '$1,999.99',
            link: 'https://apple.com/macbook-pro',
            whyBuy: 'Powerful laptop with M2 chip, perfect for professionals and creatives.',
            category: 'laptops'
          },
          {
            id: '2',
            title: 'Sony WH-1000XM5 Headphones',
            price: '$399.99',
            link: 'https://sony.com/headphones',
            whyBuy: 'Industry-leading noise cancellation perfect for focus and productivity.',
            category: 'audio'
          },
          {
            id: '3',
            title: 'Apple iPad Pro 12.9"',
            price: '$1,099.99',
            link: 'https://apple.com/ipad-pro',
            whyBuy: 'Professional tablet perfect for creative work and productivity.',
            category: 'tablets'
          },
          {
            id: '4',
            title: 'Apple AirPods Pro (2nd generation)',
            price: '$249.99',
            link: 'https://apple.com/airpods-pro',
            whyBuy: 'Industry-leading noise cancellation with seamless Apple integration. Perfect for daily use.',
            category: 'audio'
          },
          {
            id: '5',
            title: 'Bose QuietComfort Ultra Headphones',
            price: '$429.99',
            link: 'https://bose.com/headphones',
            whyBuy: 'World-class noise cancellation and premium comfort for immersive listening experiences.',
            category: 'audio'
          },
          {
            id: '6',
            title: 'Apple AirPods Max',
            price: '$549.99',
            link: 'https://apple.com/airpods-max',
            whyBuy: 'Premium over-ear headphones with spatial audio and exceptional build quality.',
            category: 'audio'
          },
          {
            id: '7',
            title: 'Bose SoundLink Revolve+ II',
            price: '$329.99',
            link: 'https://bose.com/speakers',
            whyBuy: '360-degree sound with water-resistant design. Perfect for outdoor adventures.',
            category: 'audio'
          },
          {
            id: '8',
            title: 'Microsoft Surface Laptop 5',
            price: '$1,299.99',
            link: 'https://microsoft.com/surface',
            whyBuy: 'Sleek Windows laptop with excellent build quality and performance.',
            category: 'laptops'
          },
          {
            id: '9',
            title: 'Dell XPS 13',
            price: '$999.99',
            link: 'https://dell.com/xps',
            whyBuy: 'Compact premium laptop with excellent display and performance.',
            category: 'laptops'
          }
        ];
        
        // Filter products based on user preferences with priority system
        let curatedProducts = [];
        
        // Priority 1: Products that match both brand AND what user is looking for
        if (selectedBrands && selectedBrands.length > 0 && lookingFor) {
          curatedProducts = MOCK_PRODUCTS.filter(product => {
            const productBrand = product.title.split(' ')[0];
            const matchesBrand = selectedBrands.some(brand => 
              productBrand.toLowerCase().includes(brand.toLowerCase()) ||
              product.title.toLowerCase().includes(brand.toLowerCase())
            );
            const matchesLookingFor = product.title.toLowerCase().includes(lookingFor.toLowerCase()) ||
                                    product.category.toLowerCase().includes(lookingFor.toLowerCase());
            return matchesBrand && matchesLookingFor;
          });
        }
        
        // Priority 2: Products that match what user is looking for (any brand)
        if (curatedProducts.length === 0 && lookingFor) {
          curatedProducts = MOCK_PRODUCTS.filter(product => {
            return product.title.toLowerCase().includes(lookingFor.toLowerCase()) ||
                   product.category.toLowerCase().includes(lookingFor.toLowerCase());
          });
        }
        
        // Priority 3: Products that match selected brands
        if (curatedProducts.length === 0 && selectedBrands && selectedBrands.length > 0) {
          curatedProducts = MOCK_PRODUCTS.filter(product => {
            const productBrand = product.title.split(' ')[0];
            return selectedBrands.some(brand => 
              productBrand.toLowerCase().includes(brand.toLowerCase()) ||
              product.title.toLowerCase().includes(brand.toLowerCase())
            );
          });
        }

        // Priority 4: Fallback to persona style matching
        if (curatedProducts.length === 0) {
          curatedProducts = MOCK_PRODUCTS.filter(product => {
            if (personaStyle && personaStyle.includes('tech')) {
              return product.title.toLowerCase().includes('macbook') || 
                     product.title.toLowerCase().includes('headphones') ||
                     product.title.toLowerCase().includes('smart');
            }
            return true;
          });
        }

        // Transform to AI response format
        const aiFormattedProducts = curatedProducts.slice(0, 3).map(product => ({
          title: product.title,
          brand: product.title.split(' ')[0], // Extract brand from title
          whyBuyThis: product.whyBuy || "Great choice for your needs based on your preferences.",
          category: product.category || "general", 
          price: product.price,
          image: `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&crop=center&q=80&auto=format`,
          affiliateUrl: product.link || "https://example.com"
        }));

        console.log(`✅ MOCK FALLBACK: Returning ${aiFormattedProducts.length} curated products for brands: [${selectedBrands?.join(', ')}], looking for: "${lookingFor}"`);
        console.log('Mock products returned:', aiFormattedProducts.map(p => p.title));
        return aiFormattedProducts;
        
      } catch (dbError) {
        console.error('Error accessing product database:', dbError);
        
        // Final fallback - hardcoded products
        return [
          {
            title: "MacBook Air M2",
            brand: "Apple",
            whyBuyThis: "Perfect productivity laptop with excellent battery life and silent operation. Great for professionals who need reliable performance.",
            category: "laptops",
            price: "$1,199.99",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&crop=center",
            affiliateUrl: "https://example.com/macbook-air"
          },
          {
            title: "Sony WH-1000XM5 Headphones",
            brand: "Sony", 
            whyBuyThis: "Industry-leading noise cancellation perfect for focus and productivity. Excellent for remote work and travel.",
            category: "audio",
            price: "$399.99",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center",
            affiliateUrl: "https://example.com/sony-headphones"
          },
          {
            title: "Magic Keyboard for iPad",
            brand: "Apple",
            whyBuyThis: "Transform your iPad into a productivity powerhouse with this precision keyboard and trackpad combo.",
            category: "accessories",
            price: "$329.99", 
            image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&crop=center",
            affiliateUrl: "https://example.com/magic-keyboard"
          }
        ];
      }
    };

    // Try Claude API first if key looks valid
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY.length < 30) {
      console.log('❌ CLAUDE API KEY INVALID/MISSING - Using mock fallback');
      console.log('Key status:', {
        hasKey: !!CLAUDE_API_KEY,
        keyLength: CLAUDE_API_KEY ? CLAUDE_API_KEY.length : 0,
        reason: !CLAUDE_API_KEY ? 'No key found' : 'Key too short'
      });
      const mockProducts = getMockProducts();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockProducts)
      };
    }

    console.log('Attempting Claude API call...');

    console.log('Making AI API call with prompt length:', prompt.length);
    console.log('User preferences:', { selectedBrands, personaStyle, personaBudget, lookingFor });

    // Make the API call to Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      console.log('Falling back to mock products due to API error');
      
      // Return mock products if API call fails
      const mockProducts = getMockProducts();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockProducts)
      };
    }

    const data = await response.json();
    console.log('✅ CLAUDE API SUCCESS - Response length:', JSON.stringify(data).length);

    // Extract the AI response content
    const aiResponse = data.content[0].text;
    console.log('Raw AI response preview:', aiResponse.substring(0, 200) + '...');
    
    // Try to parse the JSON response from the AI
    let products;
    try {
      // The AI should return a JSON array of products
      products = JSON.parse(aiResponse);
      console.log(`✅ CLAUDE AI PRODUCTS: Returning ${products.length} AI-generated products`);
      console.log('AI products returned:', products.map(p => p.title));
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      console.log('Raw AI Response:', aiResponse);
      console.log('🔄 Falling back to mock products due to parsing error');
      
      // Return mock products if AI parsing fails
      const mockProducts = getMockProducts();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockProducts)
      };
    }

    // Return the successfully parsed products
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(products)
    };

  } catch (error) {
    console.error('Serverless function error (Claude API failed):', error);
    console.log('Falling back to mock products due to API error');
    
    // Return mock products if Claude API fails completely
    const mockProducts = getMockProducts();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockProducts)
    };
  }
};