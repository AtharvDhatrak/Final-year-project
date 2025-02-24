import pandas as pd
import random
from geopy.distance import great_circle

# Load your dataset
# Replace 'your_dataset.csv' with the path to your dataset
df = pd.read_csv('model\Indian_Tourist_Places_Unique.csv')

def find_closest_locations(random_latitude, random_longitude, df, n=5):
    # Create a list to store distances
    distances = []

    # Calculate distance for each location in the dataset
    for index, row in df.iterrows():
        location = (row['Latitude'], row['Longitude'])
        distance = great_circle((random_latitude, random_longitude), location).kilometers
        distances.append((distance, row))

    # Sort by distance and get the closest n locations
    closest_locations = sorted(distances, key=lambda x: x[0])[:n]
    
    return closest_locations

def chatbot_response(closest_locations):
    response = "Here are the 5 closest locations:\n"
    for distance, location in closest_locations:
        response += f"\nName: {location['Name']}, City: {location['City']}, State: {location['State']}, Distance: {distance:.2f} km"
    return response

# Generate random latitude and longitude
random_latitude = random.uniform(-90, 90)
random_longitude = random.uniform(-180, 180)

# Find closest locations
closest_locations = find_closest_locations(random_latitude, random_longitude, df)

# Get chatbot response
response = chatbot_response(closest_locations)

# Print the random coordinates and the response
print(f"Coordinates: Latitude: {random_latitude:.6f}, Longitude: {random_longitude:.6f}")
print(response)