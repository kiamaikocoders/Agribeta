'use client';

import { useState } from 'react';
import ShopCard from '@/components/shop/ShopCard';
import { ShopItem } from '@/types/shop';

// Temporary data - we'll move this to a separate file later
const shopItems: ShopItem[] = [
  {
    id: 1,
    name: 'Digital Pheromone Trap',
    description: 'Advanced digital trap for pest monitoring',
    price: 129.99,
    image: '/shop-items/digital-trap.jpg',
    category: 'equipment',
    stock: 50,
    rating: 4.7,
  },
  {
    id: 2,
    name: 'Handheld Microscope',
    description: 'Portable microscope for on-field diagnosis',
    price: 79.99,
    image: '/shop-items/handheld-microscope.jpg',
    category: 'tools',
    stock: 75,
    rating: 4.6,
  },
  {
    id: 3,
    name: 'LCD Microscope',
    description: 'High-resolution LCD microscope for detailed analysis',
    price: 199.99,
    image: '/shop-items/lcd-microscope.jpg',
    category: 'tools',
    stock: 30,
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Raspberry Pi 3',
    description: 'Mini-computer for various agricultural automation projects',
    price: 35.00,
    image: '/shop-items/raspberry- pi-3.jpg',
    category: 'equipment',
    stock: 120,
    rating: 4.4,
  },
  {
    id: 5,
    name: 'Weather Monitoring Station',
    description: 'Real-time weather data for optimized farming decisions',
    price: 249.99,
    image: '/shop-items/weather-station.jpg',
    category: 'equipment',
    stock: 20,
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Pheromone Trap Installation Kit',
    description: 'Complete kit for easy installation of pheromone traps',
    price: 49.99,
    image: '/shop-items/trap-installation.jpg',
    category: 'tools',
    stock: 80,
    rating: 4.3,
  },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter to only show equipment and tools categories
  const filteredItems = selectedCategory === 'all'
    ? shopItems.filter(item => item.category === 'equipment' || item.category === 'tools')
    : shopItems.filter(item => item.category === selectedCategory && (item.category === 'equipment' || item.category === 'tools'));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farm Shop</h1>
          <p className="text-lg text-gray-600">Quality products for your farming needs</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {/* Removed Fertilizers and Seeds buttons */}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ShopCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
