import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LocationPermission = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Read latitude and longitude from cookies on component mount
  useEffect(() => {
    try {
      const lat = Cookies.get('latitude');
      const lng = Cookies.get('longitude');

      if (lat && lng) {
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
      }
    } catch (error) {
      console.error('Error reading cookies:', error);
    }
  }, []);

  const enableLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Update state with the new location
          setLocation({ lat: latitude, lng: longitude });
          setErrorMessage('');

          try {
            // Set cookies for latitude and longitude
            Cookies.set('latitude', latitude.toString(), { expires: 7, path: '/' });
            Cookies.set('longitude', longitude.toString(), { expires: 7, path: '/' });
            
            // Navigate to InformationDisplay with latitude and longitude
            navigate('/information-display', { 
              state: { latitude, longitude } 
            });
          } catch (error) {
            setErrorMessage('Error saving location data');
            console.error('Error:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
          handleGeolocationError(error);
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  };

  const handleGeolocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setErrorMessage("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setErrorMessage("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setErrorMessage("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        setErrorMessage("An unknown error occurred.");
        break;
      default:
        setErrorMessage("An error occurred while fetching location.");
    }
  };

  // Define styles for page-background and glass if they're not in a CSS file
  const pageBackgroundStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const glassStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    marginBottom: '20px',
    width: '80%',
    maxWidth: '500px'
  };

  return (
    <div style={{...containerStyle, ...pageBackgroundStyle}}>
      <div style={glassStyle}>
        <h2>Location Required</h2>
        <p>
          We use your location to provide you with the best experience. Your location is never shared publicly.
        </p>
        <button 
          style={enableButtonStyle} 
          onClick={enableLocation} 
          disabled={loading}
        >
          {loading ? 'Fetching Location...' : 'Enable Location Services'}
        </button>
      </div>

      <div style={{...glassStyle, ...infoContainerStyle}}>
        {location.lat !== null && location.lng !== null ? (
          <>
            <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
          </>
        ) : (
          <p>Location not yet determined.</p>
        )}
      </div>

      {/* Display Error Message */}
      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
    </div>
  );
};

const containerStyle = {
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
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
  transition: 'background-color 0.3s',
  ':hover': {
    backgroundColor: '#0056b3'
  }
};

const infoContainerStyle = {
  textAlign: 'center',
  fontSize: '16px',
};

const errorStyle = {
  marginTop: '20px',
  color: 'red',
  fontWeight: 'bold',
  backgroundColor: 'rgba(255,200,200,0.3)',
  padding: '10px',
  borderRadius: '5px',
  width: '80%',
  maxWidth: '500px'
};

export default LocationPermission;