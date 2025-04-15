import pandas as pd
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from math import radians, sin, cos, sqrt, atan2

app = Flask(__name__)

# Configure CORS to allow credentials and specific origin
CORS(app, supports_credentials=True, origins=["http://localhost:3000"], allow_headers=["Content-Type", "Authorization"])

# Load the CSV file into a DataFrame
try:
    locations_df = pd.read_csv('tourist_places_300_rows.csv')
    print(f"Successfully loaded CSV with {len(locations_df)} locations")
except Exception as e:
    print(f"Error loading CSV file: {e}")
    # Create a sample DataFrame if loading fails
    locations_df = pd.DataFrame({
        'Name': ['Sample Place 1', 'Sample Place 2', 'Sample Place 3', 'Sample Place 4', 'Sample Place 5'],
        'City': ['City A', 'City B', 'City C', 'City D', 'City E'],
        'State': ['State X', 'State Y', 'State Z', 'State X', 'State Y'],
        'Latitude': [28.7041, 28.6139, 28.5355, 28.4595, 28.8041],
        'Longitude': [77.1025, 77.2090, 77.3910, 77.0266, 77.0025],
        'Type': ['Beach', 'Museum', 'Nature', 'Religious', 'Other']
    })

# Place information
place_info = {
    "Place 1": "Located just 130 kilometers from Bhubaneswar, Place 1 is a pristine beach offering a tranquil escape from the city's hustle. With its golden sands and gentle waves, this beach is perfect for relaxation, leisurely walks, and witnessing breathtaking sunrises.",
    "Place 2": "A nature lover's paradise, Place 2 is situated approximately 160 kilometers from Bhubaneswar and offers an immersive experience in Odisha's lush landscapes. Surrounded by dense forests, scenic waterfalls, and diverse flora and fauna, this destination is perfect for trekking, birdwatching, and eco-tourism.",
    "Place 3": "Located 237 kilometers from Thiruvananthapuram, Place 3 is a renowned museum that showcases Kerala's rich cultural and historical heritage. The museum houses an impressive collection of ancient artifacts, sculptures, traditional artwork, and rare manuscripts.",
    "Place 4": "Situated 241 kilometers from Varanasi, Place 4 is a sacred destination known for its deep spiritual significance. Revered by devotees, it features centuries-old temples, serene ghats, and sacred rituals that reflect India's rich religious heritage.",
    "Place 5": "At a distance of 246 kilometers from Panaji, Place 5 is a stunning beach that perfectly captures Goa's coastal beauty. Famous for its golden sands, swaying palm trees, and vibrant beach shacks, it attracts both adventure seekers and relaxation enthusiasts."
}

# Define different templates for displaying information
templates = {
    "Beach": (
        "{index}. **{place_name}, {city} ({state}) – Beach**  \n"
        "Located approximately {distance:.2f} kilometers from your location, "
        "{place_name} is a beautiful beach known for its golden sands and vibrant atmosphere. "
        "Visitors can enjoy water sports, relax under the sun, and savor delicious seafood at nearby shacks."
    ),
    "Museum": (
        "{index}. **{place_name}, {city} ({state}) – Museum**  \n"
        "Situated {distance:.2f} kilometers from your location, {place_name} is a treasure trove of history. "
        "Explore ancient artifacts, sculptures, and exhibitions that narrate the rich cultural heritage of the region."
    ),
    "Nature": (
        "{index}. **{place_name}, {city} ({state}) – Nature**  \n"
        "Located about {distance:.2f} kilometers from your location, {place_name} is a nature lover's paradise. "
        "Surrounded by lush greenery, it offers opportunities for trekking, birdwatching, and enjoying the serene environment."
    ),
    "Religious": (
        "{index}. **{place_name}, {city} ({state}) – Religious**  \n"
        "At a distance of {distance:.2f} kilometers from your location, {place_name} is a sacred site known for its spiritual significance. "
        "Visitors can partake in rituals and experience the rich traditions of the local culture."
    ),
    "Other": (
        "{index}. **{place_name}, {city} ({state}) – {type}**  \n"
        "Located approximately {distance:.2f} kilometers from your location, {place_name} offers a unique experience. "
        "Explore its attractions and enjoy the local culture."
    )
}

def haversine(lat1, lon1, lat2, lon2):
    # Calculate the distance between two points on the Earth
    R = 6371.0  # Radius of the Earth in kilometers
    
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    
    return distance

@app.route('/get-nearest-locations', methods=['GET'])
def get_nearest_locations():
    # Try to get latitude and longitude from cookies first
    latitude = request.cookies.get('latitude')
    longitude = request.cookies.get('longitude')
    
    # If not in cookies, try query parameters
    if not latitude or not longitude:
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
    
    # Log the received coordinates
    print(f"Received coordinates - Latitude: {latitude}, Longitude: {longitude}")
    
    # Set default values if not provided
    if not latitude or not longitude:
        latitude = 28.7041  # Default: New Delhi
        longitude = 77.1025
        print("Using default coordinates")
    
    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except (ValueError, TypeError) as e:
        print(f"Error converting coordinates: {e}")
        return jsonify({'error': 'Invalid latitude or longitude values.'}), 400
    
    # Calculate distances for each location
    distances = []
    for _, row in locations_df.iterrows():
        try:
            distance = haversine(latitude, longitude, row['Latitude'], row['Longitude'])
            distances.append({
                'index': len(distances) + 1,
                'name': row['Name'],
                'city': row['City'],
                'state': row['State'],
                'type': row['Type'],
                'latitude': float(row['Latitude']),  # Ensure these are numbers for the frontend
                'longitude': float(row['Longitude']),
                'distance': distance
            })
        except Exception as e:
            print(f"Error calculating distance for {row['Name']}: {e}")
    
    # Sort by distance and get top 5
    nearest_locations = sorted(distances, key=lambda x: x['distance'])[:5]
    
    # Format the output for frontend display
    formatted_locations = []
    for i, location in enumerate(nearest_locations):
        place_type = location['type']
        template = templates.get(place_type, templates["Other"])
        
        # Format the description
        info = template.format(
            index=i + 1,
            place_name=location['name'],
            city=location['city'],
            state=location['state'],
            distance=location['distance'],
            type=place_type
        )
        
        # Create a structured object that includes both formatted text and raw data
        formatted_locations.append({
            'html': info,
            'name': location['name'],
            'city': location['city'],
            'state': location['state'],
            'type': place_type,
            'latitude': location['latitude'],
            'longitude': location['longitude'],
            'distance': location['distance']
        })
    
    # Log what we're sending back
    print(f"Sending back {len(formatted_locations)} locations")
    
    # Set cookies in response if they weren't present
    response = make_response(jsonify(formatted_locations))
    if not request.cookies.get('latitude') or not request.cookies.get('longitude'):
        response.set_cookie('latitude', str(latitude))
        response.set_cookie('longitude', str(longitude))
    
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)