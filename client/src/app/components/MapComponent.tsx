'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { getCoordinates } from '../utils/geolocation';

// Dynamically import react-leaflet components to avoid Next.js SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Import Leaflet and fix missing marker issue
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  address: string;
}

const MapComponent = ({ address }: MapProps) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coords = await getCoordinates(address);
        if (coords) {
          setCoordinates({ lat: coords.latitude, lng: coords.longitude });
        } else {
          console.error('No coordinates found for address:', address);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  const handleMapCreated = (mapInstance: L.Map) => {
    mapRef.current = mapInstance;
    console.log('Map instance:', mapInstance);
  };

  return (
    <div className="w-full h-64">
      {!coordinates ? (
        <p className="text-center text-gray-500">Loading map...</p>
      ) : (
        <MapContainer
          center={coordinates}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          whenCreated={handleMapCreated} // Correct usage of whenCreated event
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates} icon={markerIcon}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
