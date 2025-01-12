import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const LocationPermission = () => {
  const [location, setLocation] = useState({ lat: 28.7041, lng: 77.1025 }); // Default to New Delhi
  const [showMap, setShowMap] = useState(false); // To toggle map visibility
  const [errorMessage, setErrorMessage] = useState(''); // To handle errors

  const enableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ lat: latitude, lng: longitude });
          setShowMap(true); // Show map after getting location
          setErrorMessage(''); // Clear error message
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setErrorMessage("Unable to fetch location. Please check your permissions.");
          setShowMap(false); // Hide map on error
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '200px',
    borderRadius: '10px',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <h2>Location Required</h2>
      <p>
        We use your location to provide you with the best experience. Your location is never shared publicly.
      </p>
      <button style={enableButtonStyle} onClick={enableLocation}>
        Enable Location Services
      </button>

      {/* Replace Placeholder Image with Map */}
      {/* {showMap ? (
        <>
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"> {}
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={12}
            >
              <Marker position={location} />
            </GoogleMap>
          </LoadScript>

          
        </>
      ) : (
        <div style={{ ...mapContainerStyle, background: '#ccc' }}>
          <p style={{ padding: '50px', color: '#666' }}>Map will display here after enabling location.</p>
        </div>
      )} */}
        <div style={infoContainerStyle}>
            <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
          </div>
      {/* Display Error Message */}
      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
    </div>
  );
};

const containerStyle = {
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
};

const enableButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  borderRadius: '5px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
};

const infoContainerStyle = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '16px',
};

const errorStyle = {
  marginTop: '20px',
  color: 'red',
};

export default LocationPermission;
