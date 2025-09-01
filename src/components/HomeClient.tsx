'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Send, Phone, Mail, CalendarDays, Clock, Check, Wallet } from "lucide-react";
import SearchComponent from "@/components/SearchComponent";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import RentalItemGrid from "@/components/RentalItemGrid";
import RentalItemForm from '@/components/RentalItemForm';
import { RentalItem, ContactFormData, TourFormData } from "@/types";
import { useSetRecoilState, useRecoilState } from 'recoil';
import { rentalItemsState, favoriteRentalItemsState } from '@/atoms/rentalItemsAtom';
import { useToast } from '@/components/ui/use-toast';

// Using the imported RentalItem type from @/types

interface HomeClientProps {
  initialItems: RentalItem[];
}

export default function HomeClient({ initialItems }: HomeClientProps) {
  const { data: session } = useSession();
  const setRentalItems = useSetRecoilState(rentalItemsState);
  const [favorites, setFavorites] = useRecoilState(favoriteRentalItemsState);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { toast } = useToast();
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    propertyType: 'all',
    priceRange: 'all',
    location: 'all'
  });
  const [rentalForm, setRentalForm] = useState({
    startDate: '',
    endDate: '',
    deliveryOption: 'pickup',
    insuranceOption: 'basic',
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    acceptedTerms: false
  });

  // Initialize Recoil state with server data
  useEffect(() => {
    setRentalItems(initialItems);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteProperties');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [initialItems, setRentalItems, setFavorites]);

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

  const handleViewDetails = (item: RentalItem) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const handleContactOwner = () => {
    setIsContactOpen(true);
    // Pre-fill message with item info
    setContactForm(prev => ({
      ...prev,
      message: `Hi, I'm interested in renting the ${selectedItem?.title} located at ${selectedItem?.location}. Please contact me with more information.`
    }));
  };

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitContact = () => {
    // Here you would normally send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    alert(`Thank you for your interest! An agent will contact you soon at ${contactForm.email} or ${contactForm.phone}.`);
    
    // Reset form and close modal
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsContactOpen(false);
  };

  const handleScheduleTour = () => {
    setIsTourOpen(true);
  };

  const handleTourFormChange = (field: string, value: string) => {
    setTourForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitRental = () => {
    if (!rentalForm.startDate || !rentalForm.endDate) {
      alert('Please select rental period.');
      return;
    }

    if (!rentalForm.acceptedTerms) {
      alert('Please accept the terms and conditions.');
      return;
    }
    
    console.log('Rental submitted:', rentalForm);
    alert(`Rental request submitted. You will receive a confirmation email at ${rentalForm.email}.`);
    
    // Reset form and close modal
    setRentalForm({
      startDate: '',
      endDate: '',
      deliveryOption: 'pickup',
      insuranceOption: 'basic',
      name: '',
      email: '',
      phone: '',
      idNumber: '',
      acceptedTerms: false
    });
    setIsTourOpen(false);
  };

  // Generate available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SearchComponent onSearch={setSearchFilters} />

      {/* Add Item Button and Form */}
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
        onSubmit={async (data) => {
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
            toast({ title: 'Success', description: 'Item created successfully' });
            setIsAddItemOpen(false);
          } catch (error) {
            toast({ 
              title: 'Error', 
              description: 'Failed to create item. Please try again.', 
              variant: 'destructive' 
            });
          }
        }}
      />

      {/* Rental Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <RentalItemGrid
          items={initialItems}
          onToggleFavorite={toggleFavorite}
          onViewDetails={handleViewDetails}
          onRentNow={(item) => {
            setSelectedItem(item);
            handleScheduleTour();
          }}
        />
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedItem.title}</DialogTitle>
                <DialogDescription className="text-lg text-gray-600">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {selectedItem.location}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Image */}
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={Array.isArray(selectedItem.image) ? selectedItem.image[0] : selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <FavoriteButton propertyId={selectedItem.id} />
                </div>

                {/* Price and Rating */}
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedItem.price.toLocaleString('cs-CZ')} Kč/day</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedItem.rating}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <CalendarDays className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-sm text-gray-600">Min Rental</p>
                    <p className="font-semibold">{selectedItem.minRentDays} days</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-semibold">{selectedItem.condition}</p>
                  </div>
                  {selectedItem.deposit && (
                    <div className="text-center">
                      <Wallet className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                      <p className="text-sm text-gray-600">Deposit</p>
                      <p className="font-semibold">{selectedItem.deposit?.toLocaleString('cs-CZ')} Kč</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.features?.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleScheduleTour}>
                    Rent Now
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleContactOwner}>
                    Contact Owner
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Agent Modal */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Contact Owner</DialogTitle>
            <DialogDescription>
              Fill out the form below and the owner will contact you about {selectedItem?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitContact(); }} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={contactForm.name}
                onChange={(e) => handleContactFormChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={contactForm.email}
                onChange={(e) => handleContactFormChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={contactForm.phone}
                onChange={(e) => handleContactFormChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us more about what you're looking for..."
                value={contactForm.message}
                onChange={(e) => handleContactFormChange('message', e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsContactOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Or contact us directly:</p>
            <div className="flex gap-4 text-sm">
              <a href="tel:+15551234567" className="flex items-center text-blue-600 hover:underline">
                <Phone className="w-4 h-4 mr-1" />
                +1 (555) 123-4567
              </a>
              <a href="mailto:info@realestate.com" className="flex items-center text-blue-600 hover:underline">
                <Mail className="w-4 h-4 mr-1" />
                info@realestate.com
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Tour Modal */}
      <Dialog open={isTourOpen} onOpenChange={setIsTourOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Rent {selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Fill in rental details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitRental(); }} className="space-y-6 mt-4">
            {/* Rental Period */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-base font-semibold flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Start Date *
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={rentalForm.startDate}
                    onChange={(e) => setRentalForm({ ...rentalForm, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-base font-semibold">
                    End Date *
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    required
                    min={rentalForm.startDate || new Date().toISOString().split('T')[0]}
                    value={rentalForm.endDate}
                    onChange={(e) => setRentalForm({ ...rentalForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              {/* Price Calculation */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span className="font-semibold">{selectedItem?.price.toLocaleString('cs-CZ')} Kč</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit:</span>
                  <span className="font-semibold">{selectedItem?.deposit?.toLocaleString('cs-CZ')} Kč</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{selectedItem?.price.toLocaleString('cs-CZ')} Kč</span>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Delivery Option *</Label>
              <Select 
                value={rentalForm.deliveryOption} 
                onValueChange={(value) => setRentalForm({ ...rentalForm, deliveryOption: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup from location</SelectItem>
                  <SelectItem value="delivery">Delivery (extra fee applies)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Insurance Options */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Insurance Option *</Label>
              <Select 
                value={rentalForm.insuranceOption}
                onValueChange={(value) => setRentalForm({ ...rentalForm, insuranceOption: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Coverage (included)</SelectItem>
                  <SelectItem value="premium">Premium Coverage (+10%)</SelectItem>
                  <SelectItem value="full">Full Coverage (+20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Your Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="renter-name">Name *</Label>
                  <Input
                    id="renter-name"
                    placeholder="Full Name"
                    required
                    value={rentalForm.name}
                    onChange={(e) => setRentalForm({ ...rentalForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renter-email">Email *</Label>
                  <Input
                    id="renter-email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={rentalForm.email}
                    onChange={(e) => setRentalForm({ ...rentalForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renter-phone">Phone *</Label>
                  <Input
                    id="renter-phone"
                    type="tel"
                    placeholder="+420 XXX XXX XXX"
                    required
                    value={rentalForm.phone}
                    onChange={(e) => setRentalForm({ ...rentalForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renter-id">ID Number *</Label>
                  <Input
                    id="renter-id"
                    placeholder="National ID or Passport"
                    required
                    value={rentalForm.idNumber}
                    onChange={(e) => setRentalForm({ ...rentalForm, idNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  className="rounded"
                  checked={rentalForm.acceptedTerms}
                  onChange={(e) => setRentalForm({ ...rentalForm, acceptedTerms: e.target.checked })}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the rental terms and conditions, including deposit and damage policies *
                </Label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Rental
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsTourOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}