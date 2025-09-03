'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { rentalItemsState } from '@/atoms/rentalItemsAtom';
import { RentalItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import SearchComponent from "@/components/SearchComponent";
import Footer from "@/components/Footer";
import RentalItemForm from '@/components/RentalItemForm';
import RentalItemGrid from "@/components/RentalItemGrid";
import { useFavorites } from '@/hooks/useFavorites';

interface HomeClientProps {
  initialItems: RentalItem[];
}

export default function HomeClient({ initialItems }: HomeClientProps) {
  const { data: session } = useSession();
  const setRentalItems = useSetRecoilState(rentalItemsState);
  const { toggleFavorite } = useFavorites();
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(initialItems);
  const { toast } = useToast();

  const handleAddItem = async (data: Partial<RentalItem>) => {
    try {
      const response = await fetch('/api/rental-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create item');

      const newItem = await response.json();
      setRentalItems(prev => [newItem, ...prev]);
      setFilteredItems(prev => [newItem, ...prev]);
      toast({ title: 'Success', description: 'Item created successfully' });
      setIsAddItemOpen(false);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to create item. Please try again.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchComponent
        onSearch={(filters) => {
          let filtered = initialItems;

          // Filter by category
          if (filters.category !== 'ALL') {
            filtered = filtered.filter(item => item.category === filters.category);
          }

          // Filter by condition
          if (filters.condition !== 'ALL') {
            filtered = filtered.filter(item => item.condition === filters.condition);
          }

          // Filter by location
          if (filters.location !== 'ALL') {
            filtered = filtered.filter(item => 
              item.location.toLowerCase().includes(filters.location.toLowerCase())
            );
          }

          // Filter by price range
          if (filters.pricePerDay !== 'ALL') {
            const [min, max] = filters.pricePerDay.split('-').map(Number);
            filtered = filtered.filter(item => {
              if (filters.pricePerDay === '5000+') {
                return item.price >= 5000;
              }
              return item.price >= min && item.price <= max;
            });
          }

          setFilteredItems(filtered);
        }}
      />

      {/* Add Item Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-end">
        {session?.user && (
          <Button 
            onClick={() => setIsAddItemOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            + Add Item
          </Button>
        )}
      </div>

      {/* Add Item Form */}
      <RentalItemForm
        open={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSubmit={handleAddItem}
      />

      {/* Rental Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-center">
        <RentalItemGrid
          items={filteredItems}
          onToggleFavorite={toggleFavorite}
          onViewDetails={setSelectedItem}
          onRentNow={setSelectedItem}
        />
      </div>

      <Footer />
    </div>
  );
}