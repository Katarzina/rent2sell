'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, Square, Heart, Star } from "lucide-react";
import { Property } from "@/types";
import { useRecoilValue } from 'recoil';
import { isPropertyFavoritedSelector } from '@/atoms/propertiesAtom';

interface PropertyCardProps {
  apartment: Property;
  onToggleFavorite: () => void;
  onViewDetails: (apartment: Property) => void;
  onScheduleTour: (apartment: Property) => void;
}

export default function PropertyCard({ 
  apartment, 
  onToggleFavorite, 
  onViewDetails,
  onScheduleTour
}: PropertyCardProps) {
  const isFavorite = useRecoilValue(isPropertyFavoritedSelector(apartment.id));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={apartment.image}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          className={`absolute top-4 right-4 bg-white/90 hover:bg-white z-10 ${
            isFavorite ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        {apartment.featured && (
          <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
            Featured
          </Badge>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{apartment.title}</h3>
          <div className="flex items-center text-gray-500 mt-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <a href={`/map/${encodeURIComponent(apartment.location)}`} className="hover:underline">
              {apartment.location}
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">{apartment.price}/mo</div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{apartment.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{apartment.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{apartment.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{apartment.area} sqft</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onViewDetails(apartment)}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onScheduleTour(apartment);
            }}
          >
            Schedule Tour
          </Button>
        </div>
      </div>
    </div>
  );
}