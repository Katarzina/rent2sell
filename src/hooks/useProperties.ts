'use client';

import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { 
  propertiesState, 
  propertiesLoadingState, 
  propertiesErrorState,
  favoritePropertiesState 
} from '@/atoms/propertiesAtom';

export function useProperties() {
  const [properties, setProperties] = useRecoilState(propertiesState);
  const [loading, setLoading] = useRecoilState(propertiesLoadingState);
  const [error, setError] = useRecoilState(propertiesErrorState);
  const setFavorites = useSetRecoilState(favoritePropertiesState);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/properties');
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      setProperties(data);
      
      // Initialize favorites from localStorage
      const savedFavorites = localStorage.getItem('favoriteProperties');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      
      // Save to localStorage
      localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  };

  const refetch = () => {
    fetchProperties();
  };

  return {
    properties,
    loading,
    error,
    toggleFavorite,
    refetch
  };
}