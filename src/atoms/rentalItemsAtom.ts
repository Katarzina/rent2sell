import { atom, selector, selectorFamily } from 'recoil';

import { RentalItem } from '@/types';

// Atom to store all rental items
export const rentalItemsState = atom<RentalItem[]>({
  key: 'rentalItemsState',
  default: [],
});

// Atom to store loading state
export const rentalItemsLoadingState = atom<boolean>({
  key: 'rentalItemsLoadingState',
  default: false,
});

// Atom to store error state
export const rentalItemsErrorState = atom<string | null>({
  key: 'rentalItemsErrorState',
  default: null,
});

// Atom to store favorite item IDs
export const favoriteRentalItemsState = atom<number[]>({
  key: 'favoriteRentalItemsState',
  default: [],
});

// Selector to get items by category
export const rentalItemsByCategorySelector = selectorFamily({
  key: 'rentalItemsByCategorySelector',
  get: (category: string) => ({ get }) => {
    const items = get(rentalItemsState);
    return category === 'ALL' 
      ? items 
      : items.filter(item => item.category === category);
  },
});

// Selector to get rental item by ID
export const rentalItemByIdSelector = selectorFamily<RentalItem | undefined, number>({
  key: 'rentalItemByIdSelector',
  get: (id) => ({ get }) => {
    const items = get(rentalItemsState);
    return items.find(item => item.id === id);
  },
});

// Selector to check if an item is favorited
export const isRentalItemFavoritedSelector = selectorFamily<boolean, number>({
  key: 'isRentalItemFavoritedSelector',
  get: (id) => ({ get }) => {
    const favorites = get(favoriteRentalItemsState);
    return favorites.includes(id);
  },
});

// Selector to get all favorite rental items
export const favoriteRentalItemsSelector = selector({
  key: 'favoriteRentalItemsSelector',
  get: ({ get }) => {
    const items = get(rentalItemsState);
    const favoriteIds = get(favoriteRentalItemsState);
    return items.filter(item => favoriteIds.includes(item.id));
  },
});