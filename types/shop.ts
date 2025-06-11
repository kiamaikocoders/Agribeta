export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

export type ShopCategory = 'all' | 'fertilizers' | 'seeds' | 'tools' | 'equipment';
