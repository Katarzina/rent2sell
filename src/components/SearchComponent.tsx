'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from '@/constants/categories';
import { CONDITIONS } from '@/constants/conditions';

interface SearchFilters {
  category: string;
  pricePerDay: string;
  location: string;
  condition: string;
}

interface SearchComponentProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchComponent({ onSearch }: SearchComponentProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'ALL',
    pricePerDay: 'ALL',
    location: 'ALL',
    condition: 'ALL'
  });

  const handleChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid md:grid-cols-4 gap-4">

          <Select
            value={filters.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.pricePerDay}
            onValueChange={(value) => handleChange('pricePerDay', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Price per Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Any Price</SelectItem>
              <SelectItem value="0-1000">0-1,000 Kč</SelectItem>
              <SelectItem value="1000-5000">1,000-5,000 Kč</SelectItem>
              <SelectItem value="5000+">5,000+ Kč</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.condition}
            onValueChange={(value) => handleChange('condition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Any Condition</SelectItem>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.location}
            onValueChange={(value) => handleChange('location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Locations</SelectItem>
              <SelectItem value="Prague">Prague</SelectItem>
              <SelectItem value="Brno">Brno</SelectItem>
              <SelectItem value="Ostrava">Ostrava</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}