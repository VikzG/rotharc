export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  description: string;
  shortDescription: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  features: string[];
  compatibility: string[];
  isNew: boolean;
  isFeatured: boolean;
}