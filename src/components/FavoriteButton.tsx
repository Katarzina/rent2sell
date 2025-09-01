import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  itemId: number;
}

export default function FavoriteButton({ itemId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(itemId);

  return (
    <Button
      size="icon"
      className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${
        favorite ? 'text-red-500' : 'text-gray-600'
      }`}
      onClick={() => toggleFavorite(itemId)}
    >
      <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
    </Button>
  );
}