import { atom, useRecoilState } from 'recoil';

// Atom to store favorite item IDs
export const favoritesState = atom<number[]>({
  key: 'favoritesState',
  default: [],
});

export const useFavorites = () => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      // Save to localStorage
      localStorage.setItem('favoriteItems', JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  };

  const isFavorite = (itemId: number) => favorites.includes(itemId);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};