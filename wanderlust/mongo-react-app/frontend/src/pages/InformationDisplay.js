import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie

const InformationDisplay = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const mapRef = useRef(null); // Ref to store the map instance

  useEffect(() => {
    // Read latitude and longitude from cookies
    const lat = Cookies.get('latitude');
    const lng = Cookies.get('longitude');

    if (lat && lng) {
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lng));
      console.log('Latitude from cookies:', lat); // Log latitude
      console.log('Longitude from cookies:', lng); // Log longitude
    } else {
      console.error("Latitude and longitude not found in cookies.");
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.body.appendChild(script);
        });
      };

      const loadHEREMapsScripts = async () => {
        try {
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js');
          await loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js');

          // Initialize HERE Maps API after all scripts are loaded
          const platform = new window.H.service.Platform({
            apikey: 'Y8SvLv0rxvVd9tR2F7uHYWBqg58tETP49qJcL1TRZJA', // Replace with your actual HERE API key
          });

          const defaultLayers = platform.createDefaultLayers();

          // Check if the map has already been initialized
          if (!mapRef.current) {
            // Instantiate and display a map
            mapRef.current = new window.H.Map(
              document.getElementById('mapdiv'),
              defaultLayers.vector.normal.map,
              {
                center: { lat: latitude, lng: longitude },
                zoom: 14,
                pixelRatio: window.devicePixelRatio || 1,
              }
            );

            // Enable map events and UI
            new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapRef.current));
            window.H.ui.UI.createDefault(mapRef.current, defaultLayers);

            // Create a bounding box around the point
            const offset = 0.01; // Adjust this value as needed
            const bbox = new window.H.geo.Rect(
              latitude + offset,   // North-West corner latitude
              longitude - offset,  // North-West corner longitude
              latitude - offset,   // South-East corner latitude
              longitude + offset   // South-East corner longitude
            );

            // Set the view of the map to this bounding box
            mapRef.current.getViewModel().setLookAtData({ bounds: bbox });

            // Add a marker at the user's location
            const marker = new window.H.map.Marker({ lat: latitude, lng: longitude });
            mapRef.current.addObject(marker);
          }
        } catch (error) {
          console.error("Error loading HERE Maps scripts:", error);
        }
      };

      loadHEREMapsScripts();

      // Cleanup function to remove the map instance if needed
      return () => {
        if (mapRef.current) {
          mapRef.current.dispose(); // Dispose of the map instance
          mapRef.current = null; // Clear the reference
        }
      };
    }
  }, [latitude, longitude]); // Re-run effect when latitude or longitude changes

  return (
    <div style={containerStyle}>
      <div style={infoContainerStyle}>
        <h2>Location Information</h2>
        {latitude && longitude ? (
          <p>
            This location is at Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}.
          </p>
        ) : (
          <p>Loading location information ...</p>
        )}
      </div>
      <div id="mapdiv" style={mapStyle}></div>
    </div>
  );
};

// Container style to position elements
const containerStyle = {
  // backgroundColor: 'purple',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px',
  flexWrap: 'wrap', // Allow wrapping for smaller screens
};

const infoContainerStyle = {
  alignSelf:'center',
  // backgroundColor: 'blue',
  flex: '1 1 300px', // Allow the info container to grow and shrink, with a minimum width
  marginRight: '20px', // Space between info and map
};

const mapStyle = {
  // backgroundColor: 'red', // Background color of the map container
  width: '100%', // Full width of the parent container
  height: 'calc(100vh - 100px)', // Set a specific height for the map
  borderRadius: '10px', // Rounded corners
  flex: '1 1 400px', // Allow the map to take up space on the right
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
  marginTop: '20px', // Space above the map
  overflow: 'hidden', // Prevent overflow if needed
};

export default InformationDisplay;