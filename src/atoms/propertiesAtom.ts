import { atom, selector, selectorFamily } from 'recoil';
import { Property } from '@/types';

// Atom to store all properties
export const propertiesState = atom<Property[]>({
  key: 'propertiesState',
  default: [],
});

// Atom to store loading state
export const propertiesLoadingState = atom<boolean>({
  key: 'propertiesLoadingState',
  default: false,
});

// Atom to store error state
export const propertiesErrorState = atom<string | null>({
  key: 'propertiesErrorState',
  default: null,
});

// Atom to store favorite property IDs
export const favoritePropertiesState = atom<number[]>({
  key: 'favoritePropertiesState',
  default: [],
});

// Selector to get featured properties
export const featuredPropertiesSelector = selector({
  key: 'featuredPropertiesSelector',
  get: ({ get }) => {
    const properties = get(propertiesState);
    return properties.filter(property => property.featured);
  },
});

// Selector family to get property by ID
export const propertyByIdSelector = selectorFamily<Property | undefined, number>({
  key: 'propertyByIdSelector',
  get: (id) => ({ get }) => {
    const properties = get(propertiesState);
    return properties.find(property => property.id === id);
  },
});

// Selector to check if a property is favorited
export const isPropertyFavoritedSelector = selectorFamily<boolean, number>({
  key: 'isPropertyFavoritedSelector',
  get: (id) => ({ get }) => {
    const favorites = get(favoritePropertiesState);
    return favorites.includes(id);
  },
});

// Selector to get all favorite properties
export const favoritePropertiesSelector = selector({
  key: 'favoritePropertiesSelector',
  get: ({ get }) => {
    const properties = get(propertiesState);
    const favoriteIds = get(favoritePropertiesState);
    return properties.filter(property => favoriteIds.includes(property.id));
  },
});