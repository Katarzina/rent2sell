'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Star, MapPin, Bed, Bath } from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  featured: boolean;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export function AdminPropertiesTab() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (propertyId: number, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Property ${!featured ? 'featured' : 'unfeatured'} successfully`,
        });
        fetchProperties();
      } else {
        throw new Error('Failed to update property');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property',
        variant: 'destructive',
      });
    }
  };

  const deleteProperty = async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Property deleted successfully',
        });
        fetchProperties();
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading properties...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Management</CardTitle>
        <CardDescription>
          Manage all property listings and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[200px] truncate">
                      {property.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {property.price}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {property.bathrooms}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{property.user?.name || 'No name'}</div>
                      <div className="text-muted-foreground text-xs">
                        {property.user?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.featured ? 'default' : 'secondary'}>
                      {property.featured ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </div>
                      ) : (
                        'Regular'
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(property.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(property.id, property.featured)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/property/${property.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProperty(property.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}