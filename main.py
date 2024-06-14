import csv
import requests
import time
from flask import Flask, render_template_string

app = Flask(__name__)

def get_nearby_places(api_key, latitude, longitude, radius, keyword=None, page_token=None):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius={radius}&key={api_key}"
    if keyword:
        url += f"&keyword={keyword}"
    if page_token:
        url += f"&pagetoken={page_token}"
    
    response = requests.get(url)
    data = response.json()
    return data

def save_places_to_csv(places, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Place ID', 'Name', 'Latitude', 'Longitude', 'Rating']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for place in places:
            writer.writerow({
                'Place ID': place['place_id'],
                'Name': place['name'],
                'Latitude': place['geometry']['location']['lat'],
                'Longitude': place['geometry']['location']['lng'],
                'Rating': place.get('rating', 'N/A')
            })

def read_csv(filename):
    with open(filename, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

@app.route('/')
def index():
    csv_files = ['nearby_places_page_1.csv', 'nearby_places_page_2.csv', 'nearby_places_page_3.csv']
    tables = []
    for file in csv_files:
        data = read_csv(file)
        tables.append(data)
    
    return render_template_string('''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Nearby Places</title>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>Nearby Places</h1>
            {% for table in tables %}
                <table>
                    <thead>
                        <tr>
                            <th>Place ID</th>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for row in table %}
                            <tr>
                                <td>{{ row['Place ID'] }}</td>
                                <td>{{ row['Name'] }}</td>
                                <td>{{ row['Latitude'] }}</td>
                                <td>{{ row['Longitude'] }}</td>
                                <td>{{ row['Rating'] }}</td>
                            </tr>
                        {% endfor %}
                    </tbody>
                </table>
            {% endfor %}
        </body>
        </html>
    ''', tables=tables)

def main():
    api_key = 'AIzaSyDoLzY6DBVoUPPMoCNewEnnp3inyXvCkNE'
    latitude = 40.7128  # Example latitude (New York City)
    longitude = -74.0060  # Example longitude (New York City)
    radius = 1000  # Radius in meters
    keyword = 'restaurant'  # Keyword to search for (optional)

    places = []
    page_token = None
    num_pages = 3
    for i in range(num_pages):
        data = get_nearby_places(api_key, latitude, longitude, radius, keyword, page_token)
        places.extend(data['results'])
        if 'next_page_token' not in data:
            break
        page_token = data['next_page_token']
        time.sleep(2)  # Google API requires a short delay before the next request with the new page token

    for i in range(num_pages):
        start_index = i * 20
        end_index = start_index + 20
        subset_places = places[start_index:end_index]
        csv_filename = f'nearby_places_page_{i+1}.csv'
        save_places_to_csv(subset_places, csv_filename)

    # Start Flask app
    app.run(debug=True)

if __name__ == "__main__":
    main()