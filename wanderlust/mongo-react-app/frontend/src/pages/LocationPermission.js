import React, { useState, useEffect } from 'react';
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

          // Set cookies for latitude and longitude
          Cookies.set('latitude', latitude, { expires: 7 }); // Expires in 7 days
          Cookies.set('longitude', longitude, { expires: 7 }); // Expires in 7 days

          // Navigate to InformationDisplay with latitude and longitude
          navigate('/information-display', { state: { latitude, longitude } });
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setErrorMessage("Unable to fetch location. Please check your permissions.");
          setShowMap(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setErrorMessage("Geolocation is not supported by your browser.");
    }
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
      </div>

      <div className='glass' style={infoContainerStyle}>
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