'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';
import { getLocationCoordinates } from '@/data/locations';
import StaticMap from '@/components/StaticMap';

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [location, setLocation] = useState<{
    name: string;
    coordinates: [number, number];
  } | null>(null);

  useEffect(() => {
    const locationName = searchParams.get('location');
    if (locationName) {
      const coordinates = getLocationCoordinates(locationName);
      if (coordinates) {
        setLocation({
          name: locationName,
          coordinates
        });
      } else {
        // If location not found, redirect back
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t.nav.home}
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="w-5 h-5" />
                {location.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container - Full Width */}
      <div className="w-full h-[calc(100vh-120px)]">
        <StaticMap location={location} />
      </div>
    </div>
  );
}