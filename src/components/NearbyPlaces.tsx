import React from 'react';

interface Place {
  name: string;
  hereName: string;
  googleCoords: {
    lat: number;
    lng: number;
  };
  hereCoords: {
    lat: number;
    lng: number;
  } | null;
  distance: string;
}

interface NearbyPlacesProps {
  places: Place[];
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ places }) => {
  if (!places.length) return null;

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Place Name,Google Coordinates,HERE WeGo Place Name,HERE WeGo Coordinates,Coordinate Difference (km)\n" +
      places
        .map(
          (place) =>
            `"${place.name}","${place.googleCoords.lat}, ${place.googleCoords.lng}","${place.hereName}","${
              place.hereCoords ? `${place.hereCoords.lat}, ${place.hereCoords.lng}` : 'N/A'
            }","${place.distance}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "places.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Nearby Places</h1>
      <table>
        <thead>
          <tr>
            <th>Place Name</th>
            <th>HERE WeGo Place Name</th>
            <th>Google Coordinates</th>
            <th>HERE WeGo Coordinates</th>
            <th>Coordinate Difference (km)</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place, index) => (
            <tr key={index}>
              <td>{place.name}</td>
              <td>{place.hereName}</td>
              <td>{place.googleCoords.lat}, {place.googleCoords.lng}</td>
              <td>{place.hereCoords ? `${place.hereCoords.lat}, ${place.hereCoords.lng}` : 'N/A'}</td>
              <td>{place.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};

export default NearbyPlaces;
