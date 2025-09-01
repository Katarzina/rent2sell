'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RentalItem } from '@/types';
import RentalItemGrid from '@/components/RentalItemGrid';
import { useFavorites } from '@/hooks/useFavorites';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [items, setItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/rental-items');
        const data = await response.json();
        
        // Filter items based on search query
        const filtered = data.filter((item: RentalItem) => {
          const searchTerms = query?.toLowerCase().split(' ') || [];
          const itemText = [
            item.title,
            item.description,
            item.location,
            item.category,
            ...item.features,
          ].join(' ').toLowerCase();

          return searchTerms.every(term => itemText.includes(term));
        });

        setItems(filtered);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [query]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 max-w-6xl mx-auto">
        {items.length 
          ? `Found ${items.length} items for "${query}"`
          : `No items found for "${query}"`}
      </h1>
      <RentalItemGrid
        items={items}
        onToggleFavorite={toggleFavorite}
        onViewDetails={() => {}}
        onRentNow={() => {}}
      />
    </div>
  );
}