import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void; 
  }
}

interface Marker {
  googleCoords?: google.maps.LatLngLiteral;
  hereCoords?: google.maps.LatLngLiteral;
  name: string;
}

interface MapProps {
  onMapLoad: (map: google.maps.Map) => void;
  markers: Marker[];
}

const Map: React.FC<MapProps> = ({ onMapLoad, markers }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        if (mapRef.current) {
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            zoom: 13,
            center: { lat: 52.5200, lng: 13.4050 }
          });
          onMapLoad(mapInstanceRef.current);
        }
      };
      document.head.appendChild(script);
    };
    loadGoogleMapsScript();
  }, [onMapLoad]);

  useEffect(() => {
    if (mapInstanceRef.current && markers.length > 0) {
      markers.forEach(({ googleCoords, hereCoords, name }) => {
        if (googleCoords) {
          new window.google.maps.Marker({
            position: googleCoords,
            map: mapInstanceRef.current!,
            title: name
          });
        }
        if (hereCoords) {
          new window.google.maps.Marker({
            position: hereCoords,
            map: mapInstanceRef.current!,
            title: name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });
        }
      });
    }
  }, [markers]);

  return <div id="map" ref={mapRef} style={{ height: '500px', width: '100%' }}></div>;
};

export default Map;
