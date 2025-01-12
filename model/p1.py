import pandas as pd

# Load dataset
file_path = "model\Top Indian Places to Visit.csv"  # Replace with your dataset path
data = pd.read_csv(file_path)

def filter_locations(data, zone=None, state=None, city=None):
    """
    Filters dataset by Zone, State, and City in hierarchical order.
    
    Parameters:
        data (DataFrame): The dataset.
        zone (str): Zone to filter by.
        state (str): State to filter by (within the Zone).
        city (str): City to filter by (within the State).
        
    Returns:
        DataFrame: Filtered data.
    """
    filtered_data = data
    if zone:
        filtered_data = filtered_data[filtered_data['Zone'] == zone]
    if state:
        filtered_data = filtered_data[filtered_data['State'] == state]
    if city:
        filtered_data = filtered_data[filtered_data['City'] == city]
    
    return filtered_data

# Example Usage
zone_input = "Northern"  
state_input = "Delhi" 
city_input = "Delhi"  

result = filter_locations(data, zone=zone_input, state=state_input, city=city_input)
print(result)
