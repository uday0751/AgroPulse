"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapController({ selectedMandi, userLocation }: { selectedMandi: any, userLocation: any }) {
  const map = useMap();
  useEffect(() => {
    if (selectedMandi) {
      map.flyTo([selectedMandi.lat, selectedMandi.lng], 13);
    } else if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 10);
    } else {
      map.flyTo([20.5937, 78.9629], 5);
    }
  }, [selectedMandi, userLocation, map]);
  return null;
}

export default function MandiMap({ mandis, selectedMandi, onSelectMandi, userLocation }: any) {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedMandi={selectedMandi} userLocation={userLocation} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="font-semibold text-blue-600">Your Location</div>
            </Popup>
          </Marker>
        )}

        {mandis.map((mandi: any) => (
          <Marker 
            key={mandi.id} 
            position={[mandi.lat, mandi.lng]} 
            icon={customIcon}
            eventHandlers={{
              click: () => onSelectMandi(mandi),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-900">{mandi.name}</h3>
                <p className="text-sm text-gray-600">{mandi.city}, {mandi.state}</p>
                <div className="mt-2 text-xs font-semibold text-green-600 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> View Details
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
