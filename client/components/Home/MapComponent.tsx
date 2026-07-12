'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing default icon issue with Leaflet in React
const setupLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Custom marker icon based on the brand color (#a62025)
const customIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTYyMDI1IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIxIDEwYzAgNy05IDEzLTkgMTNzLTktNi05LTEzYTkgOSAwIDAgMSAxOCAwemIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiLz48L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
}) : null;

// Create custom cluster icon using brand colors (pink/red)
const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  let size = 'w-8 h-8 text-xs';
  let bgColor = 'bg-[#00a8e8]/90'; // Blue for small

  if (count > 10) {
    size = 'w-10 h-10 text-sm';
    bgColor = 'bg-[#f59e0b]/90'; // Orange for medium
  }
  if (count > 200) {
    size = 'w-14 h-14 text-base';
    bgColor = 'bg-[#e84e8a]/90'; // Pink for large
  }
  if (count > 1000) {
    size = 'w-20 h-20 text-xl';
    bgColor = 'bg-[#d946ef]/90'; // Fuchsia for massive
  }

  return L.divIcon({
    html: `<div class="flex items-center justify-center ${size} rounded-full ${bgColor} text-white font-bold border-[3px] border-white shadow-md">${count}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

const alumniLocations = [
  { id: 1, city: 'New York', longitude: -74.006, latitude: 40.7128 },
  { id: 2, city: 'San Francisco', longitude: -122.4194, latitude: 37.7749 },
  { id: 3, city: 'London', longitude: -0.1276, latitude: 51.5074 },
  { id: 4, city: 'New Delhi', longitude: 77.209, latitude: 28.6139 },
  { id: 5, city: 'Bengaluru', longitude: 77.5946, latitude: 12.9716 },
  { id: 6, city: 'Sydney', longitude: 151.2093, latitude: -33.8688 },
  { id: 7, city: 'Toronto', longitude: -79.3832, latitude: 43.6532 },
  { id: 8, city: 'Dubai', longitude: 55.2708, latitude: 25.2048 },
];

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setupLeafletIcons();
    setMounted(true);
  }, []);

  if (!mounted || !customIcon) return null;

  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={3}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={false}
      >
        {alumniLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={customIcon}
          >
            <Popup className="rounded-lg">
              <div className="text-center p-1">
                <h4 className="font-semibold text-gray-800 m-0">{loc.city}</h4>
                <p className="text-xs text-gray-500 m-0 mt-1">Alumni location</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Simulated large clusters to match user's screenshot requirement */}
        {Array.from({ length: 132 }).map((_, i) => (
          <Marker key={`p1-${i}`} position={[24.0 + Math.random() * 2, 54.0 + Math.random() * 2]} icon={customIcon} />
        ))}
        {Array.from({ length: 2407 }).map((_, i) => (
          <Marker key={`p2-${i}`} position={[19.0 + Math.random() * 2, 72.0 + Math.random() * 2]} icon={customIcon} />
        ))}
        {Array.from({ length: 14516 }).map((_, i) => (
          <Marker key={`p3-${i}`} position={[30.0 + Math.random() * 3, 75.0 + Math.random() * 3]} icon={customIcon} />
        ))}
        {Array.from({ length: 2070 }).map((_, i) => (
          <Marker key={`p4-${i}`} position={[17.0 + Math.random() * 3, 78.0 + Math.random() * 3]} icon={customIcon} />
        ))}
        {Array.from({ length: 1055 }).map((_, i) => (
          <Marker key={`p5-${i}`} position={[23.0 + Math.random() * 2, 88.0 + Math.random() * 2]} icon={customIcon} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
