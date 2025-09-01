'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types';
import { Loader2, Plus, X } from 'lucide-react';
import Image from 'next/image';

// Define the form data type explicitly
interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  featured: boolean;
  amenities: string[];
  image: string;
}

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  price: z.string().min(1, 'Price is required'),
  area: z.string().min(1, 'Area is required'),
  bedrooms: z.number().min(0, 'Bedrooms must be 0 or more'),
  bathrooms: z.number().min(0, 'Bathrooms must be 0 or more'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  featured: z.boolean(),
  amenities: z.array(z.string()),
  image: z.string().url('Must be a valid URL'),
}) satisfies z.ZodType<PropertyFormData>;

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const defaultAmenities = [
  'Gym',
  'Pool',
  'Parking',
  'Doorman',
  'Elevator',
  'Laundry',
  'Pet-friendly',
  'Balcony',
  'Rooftop',
  'Concierge',
  'Storage',
  'Bike Room',
  'Garden',
  'Playground',
  'Spa',
];

export default function PropertyForm({ property, onSubmit, isSubmitting }: PropertyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities || []
  );
  const [customAmenity, setCustomAmenity] = useState('');

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      location: property?.location || '',
      price: property?.price || '',
      area: property?.area || '',
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      description: property?.description || '',
      featured: property?.featured || false,
      amenities: property?.amenities || [],
      image: property?.image || '',
    },
  });

  const handleAddCustomAmenity = () => {
    if (customAmenity && !selectedAmenities.includes(customAmenity)) {
      const newAmenities = [...selectedAmenities, customAmenity];
      setSelectedAmenities(newAmenities);
      form.setValue('amenities', newAmenities);
      setCustomAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.filter(a => a !== amenity);
    setSelectedAmenities(newAmenities);
    form.setValue('amenities', newAmenities);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl>
                  <Input placeholder="Modern Downtown Loft" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Downtown, New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="$2,850" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the price with currency symbol (e.g., $2,850)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sqft)</FormLabel>
                <FormControl>
                  <Input placeholder="1,200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Enter a valid image URL for the property
              </FormDescription>
              {field.value && (
                <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={field.value}
                    alt="Property preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the property..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {defaultAmenities.map(amenity => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            const newAmenities = [...selectedAmenities, amenity];
                            setSelectedAmenities(newAmenities);
                            field.onChange(newAmenities);
                          } else {
                            handleRemoveAmenity(amenity);
                          }
                        }}
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom amenity"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAmenity();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomAmenity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {selectedAmenities.filter(a => !defaultAmenities.includes(a)).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities
                      .filter(a => !defaultAmenities.includes(a))
                      .map(amenity => (
                        <div
                          key={amenity}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleRemoveAmenity(amenity)}
                            className="hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Featured Property
                </FormLabel>
                <FormDescription>
                  This property will be highlighted on the homepage
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {property ? 'Update Property' : 'Create Property'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/agent/properties')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}