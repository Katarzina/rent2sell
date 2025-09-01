'use client';

import React from 'react';
import { useLocale } from '@/contexts/LocaleContext';

interface StaticMapProps {
  location: {
    name: string;
    coordinates: [number, number];
  };
}

export default function StaticMap({ location }: StaticMapProps) {
  const { t } = useLocale();
  const [lat, lng] = location.coordinates;
  
  // Using OpenStreetMap static image or iframe with wider view
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lng}`;
  
  return (
    <div className="h-full w-full relative">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        className="rounded-lg"
      />
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
        <strong className="text-lg block mb-2">{location.name}</strong>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          {t.map.openInGoogleMaps}
        </a>
      </div>
    </div>
  );
}