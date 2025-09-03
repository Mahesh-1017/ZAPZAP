export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  dataAiHint: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
