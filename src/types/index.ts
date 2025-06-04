export interface Product {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  price: number;
  description: string;
  short_description: string;
  image_url: string;
  rating: number;
  review_count: number;
  features: string[];
  compatibility: string[];
  is_new: boolean;
  is_featured: boolean;
}