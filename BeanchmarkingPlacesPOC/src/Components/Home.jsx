import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 8px;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const Select = styled.select`
  padding: 8px;
  margin-left: 10px;
`;

const SelectOption = styled.option``;

const SearchByTypeButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 10px;
`;

const MapContainer = styled.div`
  margin-top: 20px;
`;

// React Component
const HomeScreen = () => {
    const searchLocation = () => {
        // Implement your search logic here
    };

    const searchLocationByType = () => {
        // Implement your search by type logic here
    };

    return (
        <Container>
            <Title>Benchmarking places POC</Title>

            <InputContainer>
                <SearchInput type="text" id="searchInput" placeholder="Enter a location" />
                <SearchButton onClick={searchLocation}>Search</SearchButton>
            </InputContainer>

            <InputContainer>
                <label htmlFor="placeType">Choose a place type:</label>
                <Select id="placeType">
                    <SelectOption value="">All Types</SelectOption>
                    <option value="accounting">Accounting</option>
                    <option value="airport">Airport</option>
                    <option value="amusement_park">Amusement Park</option>
                    <option value="aquarium">Aquarium</option>
                    <option value="art_gallery">Art Gallery</option>
                    <option value="atm">ATM</option>
                    <option value="bakery">Bakery</option>
                    <option value="bank">Bank</option>
                    <option value="bar">Bar</option>
                    <option value="beauty_salon">Beauty Salon</option>
                    <option value="bicycle_store">Bicycle Store</option>
                    <option value="book_store">Book Store</option>
                    <option value="bowling_alley">Bowling Alley</option>
                    <option value="bus_station">Bus Station</option>
                    <option value="cafe">Cafe</option>
                    <option value="campground">Campground</option>
                    <option value="car_dealer">Car Dealer</option>
                    <option value="car_rental">Car Rental</option>
                    <option value="car_repair">Car Repair</option>
                    <option value="car_wash">Car Wash</option>
                    <option value="casino">Casino</option>
                    <option value="cemetery">Cemetery</option>
                    <option value="church">Church</option>
                    <option value="city_hall">City Hall</option>
                    <option value="clothing_store">Clothing Store</option>
                    <option value="convenience_store">Convenience Store</option>
                    <option value="courthouse">Courthouse</option>
                    <option value="dentist">Dentist</option>
                    <option value="department_store">Department Store</option>
                    <option value="doctor">Doctor</option>
                    <option value="drugstore">Drugstore</option>
                    <option value="electrician">Electrician</option>
                    <option value="electronics_store">Electronics Store</option>
                    <option value="embassy">Embassy</option>
                    <option value="fire_station">Fire Station</option>
                    <option value="florist">Florist</option>
                    <option value="funeral_home">Funeral Home</option>
                    <option value="furniture_store">Furniture Store</option>
                    <option value="gas_station">Gas Station</option>
                    <option value="gym">Gym</option>
                    <option value="hair_care">Hair Care</option>
                    <option value="hardware_store">Hardware Store</option>
                    <option value="hindu_temple">Hindu Temple</option>
                    <option value="home_goods_store">Home Goods Store</option>
                    <option value="hospital">Hospital</option>
                    <option value="insurance_agency">Insurance Agency</option>
                    <option value="jewelry_store">Jewelry Store</option>
                    <option value="laundry">Laundry</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="library">Library</option>
                    <option value="light_rail_station">Light Rail Station</option>
                    <option value="locksmith">Locksmith</option>
                    <option value="lodging">Lodging</option>
                    <option value="meal_delivery">Meal Delivery</option>
                    <option value="meal_takeaway">Meal Takeaway</option>
                    <option value="mosque">Mosque</option>
                    <option value="movie_rental">Movie Rental</option>
                    <option value="movie_theater">Movie Theater</option>
                    <option value="moving_company">Moving Company</option>
                    <option value="museum">Museum</option>
                    <option value="night_club">Night Club</option>
                    <option value="painter">Painter</option>
                    <option value="park">Park</option>
                    <option value="parking">Parking</option>
                    <option value="pet_store">Pet Store</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="physiotherapist">Physiotherapist</option>
                    <option value="plumber">Plumber</option>
                    <option value="police">Police</option>
                    <option value="post_office">Post Office</option>
                    <option value="primary_school">Primary School</option>
                    <option value="real_estate_agency">Real Estate Agency</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="roofing_contractor">Roofing Contractor</option>
                    <option value="rv_park">RV Park</option>
                    <option value="school">School</option>
                    <option value="secondary_school">Secondary School</option>
                    <option value="shoe_store">Shoe Store</option>
                    <option value="shopping_mall">Shopping Mall</option>
                    <option value="spa">Spa</option>
                    <option value="stadium">Stadium</option>
                    <option value="storage">Storage</option>
                    <option value="store">Store</option>
                    <option value="subway_station">Subway Station</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="synagogue">Synagogue</option>
                    <option value="taxi_stand">Taxi Stand</option>
                    <option value="tourist_attraction">Tourist Attraction</option>
                    <option value="train_station">Train Station</option>
                    <option value="transit_station">Transit Station</option>
                    <option value="travel_agency">Travel Agency</option>
                    <option value="university">University</option>
                    <option value="veterinary_care">Veterinary Care</option>
                    <option value="zoo">Zoo</option>
                </Select>
                <SearchByTypeButton onClick={searchLocationByType}>Search by Type</SearchByTypeButton>
            </InputContainer>

            <MapContainer id="map">
                {/* Your map component or placeholder */}
                <p>Map Placeholder</p>
            </MapContainer>
        </Container>
    );
};

export default HomeScreen;
