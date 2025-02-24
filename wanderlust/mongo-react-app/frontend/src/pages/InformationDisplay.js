import React from 'react';
import { useLocation } from 'react-router-dom';

const InformationDisplay = () => {
  const location = useLocation(); // Get the location object
  const { latitude, longitude } = location.state; // Destructure latitude and longitude from state

  // Construct the Google Maps embed URL using the latitude and longitude
  const mapSrc = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=14`;

  return (
    <div className='page-background' style={containerStyle}>
      <div className='glass'>
        <iframe
          src={mapSrc}
          style={mapStyle}
          title="Map"
          allowFullScreen
        />
        <h2>Location Information</h2>
        <p>
          This location is at Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}.
          You can explore more about this place on the map above.
        </p>
        <button style={buttonStyle}>Play Audio</button>
        {/* <button style={buttonStyle}>Save</button>
        <button style={buttonStyle}>Share</button> */}
      </div>
    </div>
  );
};

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
};

const mapStyle = {
  width: '100%',
  height: '200px',
  border: 'none',
  borderRadius: '10px',
  marginBottom: '20px',
};

const buttonStyle = {
  margin: '10px 5px',
  padding: '10px 20px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  background: '#f5f5f5',
  cursor: 'pointer',
  fontSize: '14px',
  color: 'black',
};

export default InformationDisplay;