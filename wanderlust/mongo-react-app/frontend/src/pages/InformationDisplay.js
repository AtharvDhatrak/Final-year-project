import React from 'react';
const InformationDisplay = () => {
    return (
        <div style={containerStyle}>
          <iframe
            src="https://www.google.com/maps/embed"
            style={mapStyle}
            title="Map"
          />
          <h2>Union Square, San Francisco</h2>
          <p>
            This is a public plaza in downtown San Francisco. It's one of the world's premier shopping districts...
          </p>
          <button style={buttonStyle}>Play Audio</button>
          <button style={buttonStyle}>Save</button>
          <button style={buttonStyle}>Share</button>
        </div>
      );};

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
        color:'black'
      };
export default InformationDisplay;
