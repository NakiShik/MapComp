import React, { useState} from 'react';
import './main.css';
import SearchBar from './components/SearchBar.tsx';
import AddressComponents from './components/AddressComponents.tsx';
import NearbyPlaces from './components/NearbyPlaces.tsx';
import Map from './components/Map.tsx';

interface Place {
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  vicinity: string;
}

const App: React.FC = () => {
  const [place, setPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);


  const onSearch = (location: string, type?: string) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK') {
        const loc = results[0].geometry.location;
        if (map) map.setCenter(loc);
        findNearbyPlaces(loc, type);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const findNearbyPlaces = (location: google.maps.LatLngLiteral, type?: string) => {
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 3000,
      type: type ? [type] : []
    };
    const service = new window.google.maps.places.PlacesService(map as google.maps.Map);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        displayNearbyPlaces(results);
      } else {
        alert('Places service returned status: ' + status);
      }
    });
  };

  const fetchHereWeGoData = async (placeName: string) => {
    const hereApiKey = process.env.REACT_APP_HERE_API_KEY;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(placeName)}&apiKey=${hereApiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const { lat, lng } = data.items[0].position;
        return {
          hereCoords: { lat, lng },
          hereName: data.items[0].address.label,
          distance: 'Calculating...'
        };
      } else {
        return {
          hereCoords: null,
          hereName: 'No data',
          distance: 'No data'
        };
      }
    } catch (error) {
      console.error('Error fetching HereWeGo data:', error);
      return {
        hereCoords: null,
        hereName: 'Error fetching',
        distance: 'Error'
      };
    }
  };

  const displayNearbyPlaces = async (places: Place[]) => {
    const placesWithHereData = await Promise.all(places.map(async (place) => {
      const placeName = `${place.name}, ${place.vicinity}`;
      const hereData = await fetchHereWeGoData(placeName);
      return {
        name: placeName,
        googleCoords: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
        ...hereData
      };
    }));

    setPlaces(placesWithHereData);
    setMarkers(placesWithHereData.map(place => ({
      googleCoords: place.googleCoords,
      hereCoords: place.hereCoords,
      name: place.name
    })));
  };

  return (
    <div className="container flex">
      <SearchBar onSearch={onSearch} />
      <AddressComponents place={place} />
      <NearbyPlaces places={places} />
      <Map onMapLoad={setMap} markers={markers} />
    </div>
  );
};

export default App;
