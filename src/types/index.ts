import { ProductCategory, ItemCondition } from '@prisma/client';

export { ProductCategory, ItemCondition };


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
  deposit: number | null;
  features: string[];
  description: string;
  maxRentDays: number;
  rules?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    name: string | null;
    email: string;
  };
  available: boolean;
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

