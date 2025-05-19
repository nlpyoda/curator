import React, { useState, useEffect } from 'react';
import { AIProductService } from '../services/AIProductService';

const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [persona, setPersona] = useState('tech enthusiast');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiService] = useState(() => new AIProductService());

  useEffect(() => {
    aiService.initialize();
    return () => aiService.cleanup();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await aiService.searchProducts(query, persona);
      setProducts(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="p-2 border rounded"
          />
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="tech enthusiast">Tech Enthusiast</option>
            <option value="budget conscious">Budget Conscious</option>
            <option value="luxury buyer">Luxury Buyer</option>
            <option value="eco friendly">Eco Friendly</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="space-y-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-xl text-blue-600 mb-4">{product.price}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Why Buy:</h3>
              <p>{product.whyBuy}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc pl-5">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Reviews:</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium">Amazon:</h4>
                  <p className="text-gray-600">{product.reviews.amazon}</p>
                </div>
                <div>
                  <h4 className="font-medium">Instagram:</h4>
                  <p className="text-gray-600">{product.reviews.instagram}</p>
                </div>
                <div>
                  <h4 className="font-medium">Marketplace Analysis:</h4>
                  <p className="text-gray-600">{product.reviews.marketplace}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Pros & Cons:</h3>
              <p className="text-gray-600">{product.prosAndCons}</p>
            </div>

            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch; 