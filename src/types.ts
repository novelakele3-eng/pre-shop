export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  size: string;
  image: string;
  badge?: string;
};

export type CartItem = Product & { quantity: number };