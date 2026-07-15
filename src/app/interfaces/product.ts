export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  featured: boolean;
  discount: number;
  happyHour: boolean;
  happyHourStart: string | null;
  happyHourEnd: string | null;
  isHappyHourActiveNow: boolean;
  categoryId: number;
  userId: number;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  featured: boolean;
  discount: number;
  happyHour: boolean;
  happyHourStart: string | null;
  happyHourEnd: string | null;
  categoryId: number;
}

export interface UpdateProduct extends NewProduct {
  id: number;
  userId: number;
}