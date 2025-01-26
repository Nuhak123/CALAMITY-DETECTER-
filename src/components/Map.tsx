import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  apiKey: string;
  calamityData: any[];
  calamityType: string;
}

const Map: React.FC<MapProps> = ({ apiKey, calamityData, calamityType }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useLeaflet, setUseLeaflet] = useState(false);

  // Fix Leaflet default icon path issue
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps || document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      scriptRef.current = script;

      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load Google Maps. Using OpenStreetMap as fallback.');
        setUseLeaflet(true);
      };
      document.head.appendChild(script);

      window.gm_authFailure = () => {
        setError('Google Maps failed to load. Using OpenStreetMap as fallback.');
        setUseLeaflet(true);
      };
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) return;

      try {
        if (googleMapRef.current) {
          google.maps.event.clearInstanceListeners(googleMapRef.current);
        }

        const map = new google.maps.Map(mapRef.current, {
          zoom: 2,
          center: { lat: 0, lng: 0 },
          mapTypeId: 'terrain'
        });
        googleMapRef.current = map;
        
        calamityData.forEach(point => {
          new google.maps.Marker({
            position: { lat: point.latitude, lng: point.longitude },
            map,
            title: point.title,
            icon: getMarkerIcon(calamityType)
          });
        });
      } catch (err) {
        setError('An error occurred while initializing the map. Using OpenStreetMap as fallback.');
        setUseLeaflet(true);
        console.error('Map initialization error:', err);
      }
    };

    if (!useLeaflet) {
      loadGoogleMaps();
    }

    return () => {
      if (googleMapRef.current) {
        google.maps.event.clearInstanceListeners(googleMapRef.current);
      }
      window.gm_authFailure = null;
    };
  }, [apiKey, calamityData, calamityType, useLeaflet]);

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'earthquake':
        return '/earthquake-marker.png';
      case 'wildfire':
        return '/fire-marker.png';
      case 'tsunami':
        return '/tsunami-marker.png';
      default:
        return undefined;
    }
  };

  if (useLeaflet) {
    return (
      <div className="relative">
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-50 p-2 text-sm text-yellow-700 z-[1000] rounded-t-lg">
            <p className="flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        )}
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '500px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {calamityData.map((point, index) => (
            <Marker
              key={index}
              position={[point.latitude, point.longitude]}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{point.title}</h3>
                  <p className="text-sm">{point.location}</p>
                  {point.magnitude && (
                    <p className="text-sm">Magnitude: {point.magnitude}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  }

  if (error && !useLeaflet) {
    return (
      <div className="w-full h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please visit the{' '}
            <a 
              href="https://console.cloud.google.com/project/_/billing/enable"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Google Cloud Console
            </a>
            {' '}to enable billing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
  );
};

export default Map;