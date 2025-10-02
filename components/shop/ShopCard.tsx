import Image from 'next/image';
import { ShopItem } from '@/types/shop';
import { toast } from '@/components/ui/use-toast';

interface ShopCardProps {
  item: ShopItem;
}

export default function ShopCard({ item }: ShopCardProps) {
  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
          </div>
          <span className="text-sm text-gray-500">In Stock: {item.stock}</span>
        </div>
        <button 
          className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 