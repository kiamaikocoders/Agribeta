'use client';

import { useState, useEffect } from 'react';
import ShopCard from '@/components/shop/ShopCard';
import { ShopItem } from '@/types/shop';
import { supabase } from '@/lib/supabaseClient';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShopItems = async () => {
      setLoading(true);
      try {
        console.log('Fetching shop items...');
        const { data, error } = await supabase.from('shop_items').select('*');
        console.log('Shop items response:', { data, error });
        
        if (error) {
          console.error('Error fetching shop items:', error);
          setError(`Database error: ${error.message}`);
        } else if (data) {
          console.log('Shop items loaded:', data.length, 'items');
          setShopItems(data);
          setError(null);
        } else {
          console.log('No data returned from shop_items table');
          setError('No shop items found in database');
        }
      } catch (err) {
        console.error('Exception fetching shop items:', err);
        setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchShopItems();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? shopItems.filter(item => item.category === 'equipment' || item.category === 'tools')
    : shopItems.filter(item => item.category === selectedCategory && (item.category === 'equipment' || item.category === 'tools'));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8F9FA] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#343A40] mb-4">Farm Shop</h1>
            <p className="text-lg text-[#6C757D]">Quality products for your farming needs</p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-[#28A745] text-white'
                  : 'bg-white text-[#6C757D] hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {/* Removed Fertilizers and Seeds buttons */}
          </div>

          {/* Shop Items Grid */}
          {loading ? (
            <div className="text-center py-12 text-lg text-[#6C757D]">Loading shop items...</div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-lg text-red-600 mb-4">Error loading shop items</div>
              <div className="text-sm text-gray-600 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-between transform transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-xl text-[#000428] mb-1">{item.name}</h3>
                    <p className="text-[#6C757D] text-sm mb-2">{item.description}</p>
                    <div className="flex items-center justify-center text-[#FFC107] mb-2">
                      ⭐ {item.rating.toFixed(1)}
                    </div>
                    <p className="text-3xl font-extrabold text-[#28A745]">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="w-full text-center mb-4">
                    <span className="text-sm text-[#343A40] bg-green-100 py-1 px-3 rounded-full">
                      In stock: {item.stock}
                    </span>
                  </div>
                  <button className="w-full py-3 px-6 bg-[#28A745] text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center">
                    <span className="mr-2">🛒</span> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
