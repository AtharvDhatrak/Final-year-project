import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie'; // Import js-cookie

const LocationPermission = () => {
  const [location, setLocation] = useState({ lat: 28.7041, lng: 77.1025 }); // Default to New Delhi
  const [showMap, setShowMap] = useState(false); // To toggle map visibility
  const [errorMessage, setErrorMessage] = useState(''); // To handle errors
  const navigate = useNavigate(); // Initialize navigate

  // Read latitude and longitude from cookies on component mount
  useEffect(() => {
    const lat = Cookies.get('latitude');
    const lng = Cookies.get('longitude');
    const username = Cookies.get('username');
    const password = Cookies.get('password');

    console.log('Cookies on mount:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);

    if (lat && lng) {
      setLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setShowMap(true);
    }
  }, []);

  const enableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ lat: latitude, lng: longitude });
          setShowMap(true); // Show map after getting location
          setErrorMessage(''); // Clear error message

          // Set cookies for username, password, latitude, and longitude
          const username = 'JohnDoe'; // Replace with actual username
          const password = 'password123'; // Replace with actual password
          Cookies.set('username', username, { expires: 7 }); // Expires in 7 days
          Cookies.set('password', password, { expires: 7 }); // Expires in 7 days
          Cookies.set('latitude', latitude, { expires: 7 }); // Expires in 7 days
          Cookies.set('longitude', longitude, { expires: 7 }); // Expires in 7 days

          // Log the cookies to the console
          console.log('Cookies set:');
          console.log('Username:', Cookies.get('username'));
          console.log('Password:', Cookies.get('password'));
          console.log('Latitude:', Cookies.get('latitude'));
          console.log('Longitude:', Cookies.get('longitude'));

          // Navigate to InformationDisplay with latitude and longitude
          navigate('/information-display', { state: { latitude, longitude } });
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
    <div className='page-background' style={containerStyle}>
      <div className='glass'>
        <h2>Location Required</h2>
        <p>
          We use your location to provide you with the best experience. Your location is never shared publicly.
        </p>
        <button style={enableButtonStyle} onClick={enableLocation}>
          Enable Location Services
        </button>

        {/* Replace Placeholder Image with Map */}
        {showMap ? (
          <>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
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
        )}
        <div className='glass' style={infoContainerStyle}>
          <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
        </div>
        {/* Display Error Message */}
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      </div>
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