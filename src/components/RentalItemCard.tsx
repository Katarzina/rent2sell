'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Calendar, MapPin, Coins } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';

import { RentalItem } from '@/types';

interface RentalItemCardProps {
  item: RentalItem;
  onToggleFavorite: () => void;
  onViewDetails: (item: RentalItem) => void;
  onRentNow: (item: RentalItem) => void;
}

const getCategoryColor = (category: string) => {
  const colors = {
    FASHION: 'bg-pink-500',
    BOOKS: 'bg-yellow-500',
    ELECTRONICS: 'bg-blue-500',
    TOOLS: 'bg-orange-500',
    SPORTS: 'bg-green-500',
    PARTY: 'bg-purple-500',
    TRAVEL: 'bg-indigo-500',
    OTHER: 'bg-gray-500'
  };
  return colors[category as keyof typeof colors] || colors.OTHER;
};

export default function RentalItemCard({ 
  item, 
  onToggleFavorite, 
  onViewDetails,
  onRentNow
}: RentalItemCardProps) {
  const { isFavorite } = useFavorites();
  const favorite = isFavorite(item.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={item.image[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          className={`absolute top-2 right-2 bg-white/90 hover:bg-white z-10 ${favorite ? 'text-red-500' : 'text-gray-600'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </Button>
        <Badge className={`absolute top-2 left-2 ${getCategoryColor(item.category)} text-white`}>
          {item.category}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
          <div className="flex items-center text-gray-500 mt-1 text-sm">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-600">{item.price.toLocaleString('cs-CZ')} Kč/day</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{item.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Min: {item.minRentDays} days</span>
          </div>
          <Badge variant="outline">{item.condition}</Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={() => onRentNow(item)}
          >
            Rent Now
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(item);
            }}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}