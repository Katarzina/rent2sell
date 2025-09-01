'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, Package, DollarSign, Star } from "lucide-react";
import { useLocale } from '@/contexts/LocaleContext';

interface SearchComponentProps {
  onSearch?: (filters: {
    query: string;
    category: string;
    pricePerDay: string;
    location: string;
    condition: string;
  }) => void;
}

export default function SearchComponent({ onSearch }: SearchComponentProps) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [pricePerDay, setPricePerDay] = useState('all');
  const [location, setLocation] = useState('all');
  const [condition, setCondition] = useState('all');

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        query: searchQuery,
        category,
        pricePerDay,
        location,
        condition
      });
    }
  };


  return (
    <section className="bg-gradient-to-b from-blue-50 to-white -mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-24">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Search Form */}
          <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Location Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Lokace
                </label>
                <Select value={location} onValueChange={(value) => {
                  setLocation(value);
                  if (onSearch) {
                    onSearch({
                      query: searchQuery,
                      category,
                      pricePerDay,
                      location: value,
                      condition
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Všechny lokace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všechny lokace</SelectItem>
                    <SelectItem value="prague-1">Praha 1</SelectItem>
                    <SelectItem value="prague-2">Praha 2</SelectItem>
                    <SelectItem value="prague-3">Praha 3</SelectItem>
                    <SelectItem value="prague-4">Praha 4</SelectItem>
                    <SelectItem value="prague-5">Praha 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  Kategorie
                </label>
                <Select value={category} onValueChange={(value) => {
                  setCategory(value);
                  if (onSearch) {
                    onSearch({
                      query: searchQuery,
                      category: value,
                      pricePerDay,
                      location,
                      condition
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Všechny kategorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všechny kategorie</SelectItem>
                    <SelectItem value="BOATS">Lodě</SelectItem>
                    <SelectItem value="EQUIPMENT">Vybavení</SelectItem>
                    <SelectItem value="FASHION">Móda</SelectItem>
                    <SelectItem value="ELECTRONICS">Elektronika</SelectItem>
                    <SelectItem value="SPORTS">Sport</SelectItem>
                    <SelectItem value="PARTY">Párty</SelectItem>
                    <SelectItem value="TRAVEL">Cestování</SelectItem>
                    <SelectItem value="HOME">Domov</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Per Day */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Cena za den
                </label>
                <Select value={pricePerDay} onValueChange={(value) => {
                  setPricePerDay(value);
                  if (onSearch) {
                    onSearch({
                      query: searchQuery,
                      category,
                      pricePerDay: value,
                      location,
                      condition
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Jakákoliv cena" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Jakákoliv cena</SelectItem>
                    <SelectItem value="0-500">Do 500 Kč</SelectItem>
                    <SelectItem value="500-1000">500 - 1000 Kč</SelectItem>
                    <SelectItem value="1000-2000">1000 - 2000 Kč</SelectItem>
                    <SelectItem value="2000-5000">2000 - 5000 Kč</SelectItem>
                    <SelectItem value="5000+">Nad 5000 Kč</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Stav
                </label>
                <Select value={condition} onValueChange={(value) => {
                  setCondition(value);
                  if (onSearch) {
                    onSearch({
                      query: searchQuery,
                      category,
                      pricePerDay,
                      location,
                      condition: value
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Jakýkoliv stav" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Jakýkoliv stav</SelectItem>
                    <SelectItem value="NEW">Nové</SelectItem>
                    <SelectItem value="LIKE_NEW">Jako nové</SelectItem>
                    <SelectItem value="GOOD">Dobré</SelectItem>
                    <SelectItem value="FAIR">Uspokojivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Bar */}
           {/*} <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t.hero.searchPlaceholder}
                className="pl-10 h-12 text-base pr-32"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                size="lg" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
                onClick={handleSearch}
              >
                {t.hero.searchButton}
              </Button>
            </div>*/}
          </div>
        </div>
      </div>
    </section>
  );
}