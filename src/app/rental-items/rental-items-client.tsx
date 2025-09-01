'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RentalItem } from '@/types';
import RentalItemForm from '@/components/RentalItemForm';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface RentalItemsClientProps {
  initialItems: RentalItem[];
}

export default function RentalItemsClient({ initialItems }: RentalItemsClientProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RentalItem | undefined>();

  const handleCreate = async (data: Partial<RentalItem>) => {
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
      setItems([newItem, ...items]);
      toast({ title: 'Success', description: 'Item created successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to create item', 
        variant: 'destructive' 
      });
    }
  };

  const handleUpdate = async (data: Partial<RentalItem>) => {
    if (!editingItem) return;

    try {
      const response = await fetch(\`/api/rental-items/\${editingItem.id}\`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update item');

      const updatedItem = await response.json();
      setItems(items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      toast({ title: 'Success', description: 'Item updated successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update item', 
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(\`/api/rental-items/\${id}\`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setItems(items.filter(item => item.id !== id));
      toast({ title: 'Success', description: 'Item deleted successfully' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete item', 
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (item: RentalItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setEditingItem(undefined);
    setIsFormOpen(false);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rental Items Management</h1>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Add Item
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price.toLocaleString('cs-CZ')} Kč/day</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <span className={\`px-2 py-1 rounded-full text-xs \${
                    item.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }\`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RentalItemForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        initialData={editingItem}
      />
    </div>
  );
}