'use client';

import React from 'react';
import RentalItemCard from './RentalItemCard';

import { RentalItem } from '@/types';

interface RentalItemGridProps {
  items: RentalItem[];
  onToggleFavorite: (id: number) => void;
  onViewDetails: (item: RentalItem) => void;
  onRentNow: (item: RentalItem) => void;
}

export default function RentalItemGrid({ items, onToggleFavorite, onViewDetails, onRentNow }: RentalItemGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <RentalItemCard
          key={item.id}
          item={item}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onViewDetails={onViewDetails}
          onRentNow={onRentNow}
        />
      ))}
    </div>
  );
}