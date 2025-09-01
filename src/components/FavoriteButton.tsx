'use client';

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRecoilValue } from 'recoil';
import { isPropertyFavoritedSelector } from '@/atoms/propertiesAtom';
import { useProperties } from '@/hooks/useProperties';

interface FavoriteButtonProps {
  propertyId: number;
}

export default function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const isFavorite = useRecoilValue(isPropertyFavoritedSelector(propertyId));
  const { toggleFavorite } = useProperties();

  return (
    <Button
      size="icon"
      className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${
        isFavorite ? 'text-red-500' : 'text-gray-600'
      }`}
      onClick={() => toggleFavorite(propertyId)}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
}