'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RentalItem, ProductCategory, ItemCondition } from '@/types';

interface RentalItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RentalItem>) => Promise<void>;
  initialData?: RentalItem;
}

export default function RentalItemForm({
  open,
  onClose,
  onSubmit,
  initialData
}: RentalItemFormProps) {
  const defaultValues = {
    title: '',
    category: ProductCategory.BOATS,
    price: 0,
    image: [''],
    condition: ItemCondition.NEW,
    rating: 5,
    location: '',
    minRentDays: 1,
    deposit: 0,
    features: [],
    description: ''
  };

  const [formData, setFormData] = useState<Partial<RentalItem>>(initialData || defaultValues);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.image || []);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.secure_url;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);

    // Create previews and upload files
    for (const file of newFiles) {
      setIsUploading(true);
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);
        setFormData(prev => ({
          ...prev,
          image: [...(prev.image || []), cloudinaryUrl]
        }));
      } catch (error) {
        console.error('Upload error:', error);
        // Handle error (show toast, etc)
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      image: prev.image?.filter((_, i) => i !== index)
    }));
  };

  // Reset form data when initialData changes
  useEffect(() => {
    setFormData(initialData || defaultValues);
    setImagePreviews(initialData?.image || []);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Rental Item' : 'Add New Rental Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 mb-6">
            <Label className="text-lg font-semibold mb-2 block">Upload photos</Label>
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className={`w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handleFileSelect}
                />
                <div className="text-3xl text-gray-400">+</div>
                <div className="text-xs text-gray-500 text-center mt-1">Upload or{"\n"}Take Photo</div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category as ProductCategory}
                onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductCategory.BOATS}>Boats</SelectItem>
                  <SelectItem value={ProductCategory.EQUIPMENT}>Equipment</SelectItem>
                  <SelectItem value={ProductCategory.FASHION}>Fashion</SelectItem>
                  <SelectItem value={ProductCategory.ELECTRONICS}>Electronics</SelectItem>
                  <SelectItem value={ProductCategory.SPORTS}>Sports</SelectItem>
                  <SelectItem value={ProductCategory.PARTY}>Party</SelectItem>
                  <SelectItem value={ProductCategory.TRAVEL}>Travel</SelectItem>
                  <SelectItem value={ProductCategory.HOME}>Home</SelectItem>
                  <SelectItem value={ProductCategory.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Day (Kč)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit (Kč)</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.deposit ?? ''}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value ? parseFloat(e.target.value) : null })}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition as ItemCondition}
                onValueChange={(value: ItemCondition) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ItemCondition.NEW}>New</SelectItem>
                  <SelectItem value={ItemCondition.LIKE_NEW}>Like New</SelectItem>
                  <SelectItem value={ItemCondition.GOOD}>Good</SelectItem>
                  <SelectItem value={ItemCondition.FAIR}>Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minRentDays">Minimum Rental Days</Label>
              <Input
                id="minRentDays"
                type="number"
                value={formData.minRentDays}
                onChange={(e) => setFormData({ ...formData, minRentDays: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                required
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              value={formData.features?.join(', ')}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()) })}
              required
              placeholder="Feature 1, Feature 2, Feature 3"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}