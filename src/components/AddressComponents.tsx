import React from 'react';

const AddressComponents = ({ place }) => {
  if (!place) return null;

  return (
    <div>
      <p>Latitude: {place.geometry.location.lat()}, Longitude: {place.geometry.location.lng()}</p>
      {place.address_components.map((component, index) => (
        <p key={index}>{component.long_name} ({component.types.join(", ")})</p>
      ))}
    </div>
  );
};

export default AddressComponents;
