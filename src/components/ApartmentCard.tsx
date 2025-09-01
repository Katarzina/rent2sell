'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, MapPin, Square, Heart, Star } from "lucide-react";
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';
import { Property } from '@/types';

interface ApartmentCardProps {
  apartment: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewDetails: (apartment: Property) => void;
  onScheduleTour: (apartment: Property) => void;
}

export default function ApartmentCard({ 
  apartment, 
  isFavorite, 
  onToggleFavorite, 
  onViewDetails, 
  onScheduleTour
}: ApartmentCardProps) {
  const { t } = useLocale();
  return (
    <Card 
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={apartment.image}
          alt={apartment.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {apartment.featured && (
          <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white border-0">
            {t.property.featured}
          </Badge>
        )}
        
        {/* Heart Icon */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white shadow-lg"
          onClick={() => onToggleFavorite(apartment.id)}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </Button>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-800">{apartment.rating}</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl font-bold text-blue-600">
            {apartment.price}
          </span>
          <span className="text-sm text-gray-500">{t.property.perMonth}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {apartment.title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <Link 
            href={`/map?location=${encodeURIComponent(apartment.location)}`}
            className="text-sm hover:text-blue-600 hover:underline transition-colors"
          >
            {apartment.location}
          </Link>
        </div>
        
        {/* Apartment Details */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{apartment.bedrooms} {t.property.bed}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{apartment.bathrooms} {t.property.bath}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Square className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{apartment.area} {t.property.sqft}</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">{t.property.amenities}</p>
          <div className="flex flex-wrap gap-2">
            {apartment.amenities.map((amenity, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => onViewDetails(apartment)}
          >
            {t.property.viewDetails}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
            onClick={() => onScheduleTour(apartment)}
          >
            {t.property.scheduleTour}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}