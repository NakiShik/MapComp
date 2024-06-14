let map;
let markers = [];
let placesData = [];

function searchLocationByType() {
    var selectedType = document.getElementById("placeType").value;
    if (!selectedType || selectedType === "") {
        alert('Please select a place type.');
        return;
    }

    var searchInput = document.getElementById("searchInput").value;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': searchInput }, function (results, status) {
        if (status === 'OK') {
            var location = results[0].geometry.location;
            map.setCenter(location);

            var request = {
                location: location,
                radius: 3000,
                type: [selectedType]
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    displayNearbyPlaces(results);
                } else {
                    alert('Places service returned status: ' + status);
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}



function initAutocomplete() {
    var searchInput = document.getElementById("searchInput");
    var autocomplete = new google.maps.places.Autocomplete(searchInput);
    autocomplete.setFields(["geometry"]);

    autocomplete.addListener("place_changed", function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Adjust zoom level as needed
        }

        // Optionally trigger a search based on the selected place
         searchLocationByType(); // Uncomment if you want to trigger search on place change
    });
}


function loadConfig() {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            window.GOOGLE_API_KEY = config.GOOGLE_API_KEY;
            window.HERE_API_KEY = config.HERE_API_KEY;
            loadGoogleMapsScript();
        })
        .catch(error => console.error('Error loading config:', error));
}

function loadGoogleMapsScript() {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${window.GOOGLE_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function initMap() {
    // Create a map object without a predefined center
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13, // Default zoom
    });

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Set the map's center to the current location
                map.setCenter(pos);
            },
            function() {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }

    initAutocomplete();
}

function handleLocationError(browserHasGeolocation, pos) {
    console.error(browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation.");
    map.setCenter(pos); // Fallback to a default position
}



function displayAddressComponents(place) {
    var container = document.getElementById("address-components");
    container.innerHTML = "";

    var latLng = place.geometry.location;
    var latLngElement = document.createElement("p");
    latLngElement.textContent =
        "Latitude: " + latLng.lat() + ", Longitude: " + latLng.lng();
    container.appendChild(latLngElement);

    place.address_components.forEach(function (component) {
        var element = document.createElement("p");
        element.textContent =
            component.long_name + " (" + component.types.join(", ") + ")";
        container.appendChild(element);
    });
}

function findNearbyPlaces(location) {
    var selectedType = document.getElementById("placeType").value;
    var request = {
        location: location,
        radius: 3000,
    };

    if (selectedType && selectedType !== "") {
        request.type = [selectedType];
    }

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            displayNearbyPlaces(results);
        } else {
            alert('Places service returned status: ' + status);
        }
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const earthRadius = 6371; // Radius of the Earth in kilometers

    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    // Check if distance is greater than 0.02 km (20 meters)
    if (distance > 0.02) {
        return distance.toFixed(2); // Distance in kilometers rounded to 2 decimal places
    } else {
        return null; // Return null for distances less than or equal to 0.02 km
    }
}

function displayNearbyPlaces(places) {
    var table = document.createElement("table");
    table.classList.add("table");

    var tableHeader = document.createElement("thead");
    var headerRow = document.createElement("tr");

    var nameHeader = document.createElement("th");
    nameHeader.textContent = "Place Name";
    headerRow.appendChild(nameHeader);

    // Add the new column for HERE WeGo Place Name
    var hereNameHeader = document.createElement("th");
    hereNameHeader.textContent = "HERE WeGo Place Name";
    headerRow.appendChild(hereNameHeader);

    var googleCoordsHeader = document.createElement("th");
    googleCoordsHeader.textContent = "Google Coordinates";
    headerRow.appendChild(googleCoordsHeader);

    var hereCoordsHeader = document.createElement("th");
    hereCoordsHeader.textContent = "HERE WeGo Coordinates";
    headerRow.appendChild(hereCoordsHeader);

    var differenceHeader = document.createElement("th");
    differenceHeader.textContent = "Coordinate Difference (km)";
    headerRow.appendChild(differenceHeader);

    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    var tableBody = document.createElement("tbody");
    placesData = []; // Clear previous data

    places.forEach(function (place) {
        var row = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = place.name + " - " + place.vicinity;
        row.appendChild(nameCell);

        // Add an empty cell for HERE WeGo Place Name
        var hereNameCell = document.createElement("td");
        hereNameCell.textContent = "Fetching...";
        row.appendChild(hereNameCell);

        var googleCoordsCell = document.createElement("td");
        var latLng = place.geometry.location;
        googleCoordsCell.textContent =
            "Lat: " + latLng.lat() + ", Lng: " + latLng.lng();
        row.appendChild(googleCoordsCell);

        var hereCoordsCell = document.createElement("td");
        hereCoordsCell.textContent = "Fetching...";
        row.appendChild(hereCoordsCell);

        var differenceCell = document.createElement("td");
        differenceCell.textContent = "Error";
        row.appendChild(differenceCell);

        tableBody.appendChild(row);

        fetchHereWeGoCoordinates(place.name, place.vicinity)
            .then(function (coords) {
                hereCoordsCell.textContent =
                    "Lat: " + coords.lat + ", Lng: " + coords.lng;

                var distance = calculateDistance(latLng.lat(), latLng.lng(), coords.lat, coords.lng);
                if (distance == null) { differenceCell.textContent = "Diff is very small"; }
                else { differenceCell.textContent = `${distance} Km`; }

                var placeData = placesData.find(p => p.name === (place.name + " - " + place.vicinity));
                if (placeData) {
                    placeData.hereCoords = "Lat: " + coords.lat + ", Lng: " + coords.lng;
                    placeData.distance = distance;
                }

                addMarker(coords, "HERE WeGo: " + place.name, "blue");
                // Fetch HERE WeGo Place Name and render
                fetchHereWeGoPlaceName(coords.lat, coords.lng)
                    .then(function (placeName) {
                        hereNameCell.textContent = placeName;
                        if (placeData) {
                            placeData.hereName = placeName;
                        }
                    })
                    .catch(function (error) {
                        hereNameCell.textContent = "Error fetching place name";
                        console.error("Error fetching HERE WeGo place name:", error);
                    });
            })
            .catch(function (error) {
                hereCoordsCell.textContent = "Error fetching coordinates";
                console.error("Error fetching HERE WeGo coordinates:", error);
            });

        addMarker(latLng, "Google Maps: " + place.name, "red");

        placesData.push({
            name: place.name + " - " + place.vicinity,
            googleCoords: "Lat: " + latLng.lat() + ", Lng: " + latLng.lng(),
            hereCoords: "Fetching...",
            hereName: "Fetching...",
            distance: "Calculating..."
        });
    });

    table.appendChild(tableBody);

    var container = document.getElementById("nearby-places");
    container.innerHTML = "";
    container.appendChild(table);

    var downloadButton = document.createElement("button");
    downloadButton.textContent = "Download CSV";
    downloadButton.onclick = function () {
        downloadCSV();
    };
    container.appendChild(downloadButton);
}

function fetchHereWeGoPlaceName(lat, lng) {
    var url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${window.HERE_API_KEY}`;

    return fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            if (data.items && data.items.length > 0) {
                return data.items[0].title;
            } else {
                throw new Error("Place name not found");
            }
        });
}


function addMarker(location, title, color) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
        icon: {
            url:
                "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png",
        },
    });
    markers.push(marker);
}

function fetchHereWeGoCoordinates(name, vicinity) {
    var url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        name + ", " + vicinity
    )}&apiKey=${window.HERE_API_KEY}`;

    return fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            if (data.items && data.items.length > 0) {
                var location = data.items[0].position;
                return { lat: location.lat, lng: location.lng };
            } else {
                throw new Error("Coordinates not found");
            }
        });
}

function downloadCSV() {
    var selectedType = document.getElementById("placeType").value;
    var filterName = selectedType ? selectedType : "All_Types";

    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Place Name,Google Coordinates,HERE WeGo Place Name,HERE WeGo Coordinates,Coordinate Difference (km)\n";

    placesData.forEach(function (place) {
        var row = `"${place.name}","${place.googleCoords}","${place.hereName}","${place.hereCoords}","${place.distance}"\n`;
        csvContent += row;
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filterName + "_places.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up the DOM
}

function searchLocation() {
    var searchInput = document.getElementById("searchInput").value;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': searchInput }, function (results, status) {
        if (status === 'OK') {
            var location = results[0].geometry.location;
            map.setCenter(location);
            findNearbyPlaces(location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}



window.addEventListener('load', loadConfig);