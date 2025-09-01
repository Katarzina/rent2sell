export enum ProductCategory {
  BOATS = 'BOATS',
  EQUIPMENT = 'EQUIPMENT',
  FASHION = 'FASHION',
  ELECTRONICS = 'ELECTRONICS',
  SPORTS = 'SPORTS',
  PARTY = 'PARTY',
  TRAVEL = 'TRAVEL',
  HOME = 'HOME',
  OTHER = 'OTHER'
}

export enum ItemCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR'
}

// Rental item types
export interface RentalItem {
  id: number;
  title: string;
  category: ProductCategory;
  price: number;
  image: string[];
  condition: ItemCondition;
  rating: number;
  location: string;
  minRentDays: number;
  deposit?: number;
  features: string[];
  description?: string;
  available?: boolean;
}

// Inquiry types
export interface Inquiry {
  id: string;
  rentalItemId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Tour form data
export interface TourFormData {
  name: string;
  email: string;
  phone: string;
}

