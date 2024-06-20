import React, { useState } from 'react';

interface PlaceType {
  value: string;
  label: string;
}

interface SearchBarProps {
  onSearch: (location: string, type?: string) => void;
}

const placeTypes: PlaceType[] = [
  { value: "", label: "All Types" },
  { value: "accounting", label: "Accounting" },
  { value: "airport", label: "Airport" },
  { value: "amusement_park", label: "Amusement Park" },
  { value: "aquarium", label: "Aquarium" },
  { value: "art_gallery", label: "Art Gallery" },
  { value: "atm", label: "ATM" },
  { value: "bakery", label: "Bakery" },
  { value: "bank", label: "Bank" },
  { value: "bar", label: "Bar" },
  { value: "beauty_salon", label: "Beauty Salon" },
  { value: "bicycle_store", label: "Bicycle Store" },
  { value: "book_store", label: "Book Store" },
  { value: "bowling_alley", label: "Bowling Alley" },
  { value: "bus_station", label: "Bus Station" },
  { value: "cafe", label: "Cafe" },
  { value: "campground", label: "Campground" },
  { value: "car_dealer", label: "Car Dealer" },
  { value: "car_rental", label: "Car Rental" },
  { value: "car_repair", label: "Car Repair" },
  { value: "car_wash", label: "Car Wash" },
  { value: "casino", label: "Casino" },
  { value: "cemetery", label: "Cemetery" },
  { value: "church", label: "Church" },
  { value: "city_hall", label: "City Hall" },
  { value: "clothing_store", label: "Clothing Store" },
  { value: "convenience_store", label: "Convenience Store" },
  { value: "courthouse", label: "Courthouse" },
  { value: "dentist", label: "Dentist" },
  { value: "department_store", label: "Department Store" },
  { value: "doctor", label: "Doctor" },
  { value: "drugstore", label: "Drugstore" },
  { value: "electrician", label: "Electrician" },
  { value: "electronics_store", label: "Electronics Store" },
  { value: "embassy", label: "Embassy" },
  { value: "fire_station", label: "Fire Station" },
  { value: "florist", label: "Florist" },
  { value: "funeral_home", label: "Funeral Home" },
  { value: "furniture_store", label: "Furniture Store" },
  { value: "gas_station", label: "Gas Station" },
  { value: "gym", label: "Gym" },
  { value: "hair_care", label: "Hair Care" },
  { value: "hardware_store", label: "Hardware Store" },
  { value: "hindu_temple", label: "Hindu Temple" },
  { value: "home_goods_store", label: "Home Goods Store" },
  { value: "hospital", label: "Hospital" },
  { value: "insurance_agency", label: "Insurance Agency" },
  { value: "jewelry_store", label: "Jewelry Store" },
  { value: "laundry", label: "Laundry" },
  { value: "lawyer", label: "Lawyer" },
  { value: "library", label: "Library" },
  { value: "light_rail_station", label: "Light Rail Station" },
  { value: "locksmith", label: "Locksmith" },
  { value: "lodging", label: "Lodging" },
  { value: "meal_delivery", label: "Meal Delivery" },
  { value: "meal_takeaway", label: "Meal Takeaway" },
  { value: "mosque", label: "Mosque" },
  { value: "movie_rental", label: "Movie Rental" },
  { value: "movie_theater", label: "Movie Theater" },
  { value: "moving_company", label: "Moving Company" },
  { value: "museum", label: "Museum" },
  { value: "night_club", label: "Night Club" },
  { value: "painter", label: "Painter" },
  { value: "park", label: "Park" },
  { value: "parking", label: "Parking" },
  { value: "pet_store", label: "Pet Store" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "plumber", label: "Plumber" },
  { value: "police", label: "Police" },
  { value: "post_office", label: "Post Office" },
  { value: "primary_school", label: "Primary School" },
  { value: "real_estate_agency", label: "Real Estate Agency" },
  { value: "restaurant", label: "Restaurant" },
  { value: "roofing_contractor", label: "Roofing Contractor" },
  { value: "rv_park", label: "RV Park" },
  { value: "school", label: "School" },
  { value: "secondary_school", label: "Secondary School" },
  { value: "shoe_store", label: "Shoe Store" },
  { value: "shopping_mall", label: "Shopping Mall" },
  { value: "spa", label: "Spa" },
  { value: "stadium", label: "Stadium" },
  { value: "storage", label: "Storage" },
  { value: "store", label: "Store" },
  { value: "subway_station", label: "Subway Station" },
  { value: "supermarket", label: "Supermarket" },
  { value: "synagogue", label: "Synagogue" },
  { value: "taxi_stand", label: "Taxi Stand" },
  { value: "tourist_attraction", label: "Tourist Attraction" },
  { value: "train_station", label: "Train Station" },
  { value: "transit_station", label: "Transit Station" },
  { value: "travel_agency", label: "Travel Agency" },
  { value: "university", label: "University" },
  { value: "veterinary_care", label: "Veterinary Care" },
  { value: "zoo", label: "Zoo" },
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [placeType, setPlaceType] = useState<string>("");

  const handleSearch = () => {
    if (!searchInput) {
      alert('Please enter a location.');
      return;
    }
    onSearch(searchInput, placeType);
  };

  const handleSearchByType = () => {
    if (!placeType) {
      alert('Please select a place type.');
      return;
    }
    onSearch(searchInput, placeType);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter a location"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="margin">
        <label htmlFor="placeType">Choose a place type:</label>
        <select id="placeType" value={placeType} onChange={(e) => setPlaceType(e.target.value)}>
          {placeTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <button onClick={handleSearchByType}>Search by Type</button>
      </div>
    </div>
  );
};

export default SearchBar;
