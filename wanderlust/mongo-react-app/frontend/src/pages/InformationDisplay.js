import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

const InformationDisplay = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [nearestLocations, setNearestLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapElementRef = useRef(null);

  useEffect(() => {
    // Read latitude and longitude from cookies
    const lat = Cookies.get('latitude');
    const lng = Cookies.get('longitude');

    if (lat && lng) {
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lng));
      console.log('Coordinates from cookies:', lat, lng);
    } else {
      console.error("Latitude and longitude not found in cookies.");
      setError("Location data not available. Please enable location services.");
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      // Fetch nearest locations
      fetchNearestLocations();
      
      // Load map scripts if not already loaded
      if (!mapLoaded) {
        loadHEREMapsScripts();
      }
    }
  }, [latitude, longitude, mapLoaded]);

  const fetchNearestLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching locations with coordinates: ${latitude}, ${longitude}`);
      
      const response = await fetch('http://localhost:5000/get-nearest-locations', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched locations:", data);
      setNearestLocations(data);
    } catch (error) {
      console.error("Error fetching nearest locations:", error);
      setError(`Failed to fetch nearby locations: ${error.message}`);
      setNearestLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadHEREMapsScripts = async () => {
    try {
      // Add HERE Maps UI CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
      document.head.appendChild(link);
      
      // Load scripts in sequence
      await loadScript('https://js.api.here.com/v3/3.1/mapsjs-core.js');
      await loadScript('https://js.api.here.com/v3/3.1/mapsjs-service.js');
      await loadScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js');
      await loadScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js');
      
      console.log("All HERE Maps scripts loaded");
      setMapLoaded(true);
    } catch (error) {
      console.error("Error loading HERE Maps scripts:", error);
      setError("Failed to load map. Please refresh the page.");
    }
  };
  
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  };
  
  useEffect(() => {
    // Initialize map when scripts are loaded and we have locations
    if (mapLoaded && latitude && longitude && mapElementRef.current) {
      initializeMap();
    }
  }, [mapLoaded, latitude, longitude, nearestLocations]);
  
  const initializeMap = () => {
    if (!window.H || !mapElementRef.current) {
      console.log("Map initialization requirements not met");
      return;
    }
    
    try {
      console.log("Initializing map");
      const platform = new window.H.service.Platform({
        apikey: 'Y8SvLv0rxvVd9tR2F7uHYWBqg58tETP49qJcL1TRZJA'
      });
      
      const defaultLayers = platform.createDefaultLayers();
      
      // Create map
      mapRef.current = new window.H.Map(
        mapElementRef.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: latitude, lng: longitude },
          zoom: 12,
          pixelRatio: window.devicePixelRatio || 1
        }
      );
      
      // Add UI and behavior
      const ui = window.H.ui.UI.createDefault(mapRef.current, defaultLayers);
      const mapEvents = new window.H.mapevents.MapEvents(mapRef.current);
      const behavior = new window.H.mapevents.Behavior(mapEvents);
      
      // Add markers
      addMapMarkers();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (mapRef.current) {
          mapRef.current.getViewPort().resize();
        }
      });
      
    } catch (error) {
      console.error("Error initializing map:", error);
      setError("Failed to initialize map. Please try again later.");
    }
  };
  
  const addMapMarkers = () => {
    if (!mapRef.current) return;
    
    // Create marker group
    const markerGroup = new window.H.map.Group();
    
    // Add user location marker
    const userMarker = new window.H.map.Marker({
      lat: latitude,
      lng: longitude
    });
    markerGroup.addObject(userMarker);
    
    // Add location markers
    nearestLocations.forEach((location, index) => {
      // Check if location has lat/lng properties
      if (location.latitude && location.longitude) {
        // Create marker
        const marker = new window.H.map.Marker({
          lat: location.latitude,
          lng: location.longitude
        });
        
        // Add tooltip with location name
        marker.setData(`<div>${location.name || 'Location ' + (index + 1)}</div>`);
        
        markerGroup.addObject(marker);
      }
    });
    
    // Add markers to map
    mapRef.current.addObject(markerGroup);
    
    // Create a bounding box for all markers
    if (nearestLocations.length > 0) {
      mapRef.current.getViewModel().setLookAtData({
        bounds: markerGroup.getBoundingBox()
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={infoContainerStyle}>
        <h2>Location Information</h2>
        {latitude && longitude ? (
          <p>
            This location is at Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}.
          </p>
        ) : (
          <p>Loading location information...</p>
        )}
        
        <h3>Nearest Locations</h3>
        {loading ? (
          <p>Loading nearby locations...</p>
        ) : error ? (
          <p style={{color: 'red'}}>{error}</p>
        ) : nearestLocations.length > 0 ? (
          <ul style={locationListStyle}>
            {nearestLocations.map((location, index) => (
              <li key={index} style={locationItemStyle}>
                <div dangerouslySetInnerHTML={{ __html: location.html }} />
                <div style={locationDetailsStyle}>
                  <span>Distance: {location.distance.toFixed(2)} km</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No nearby locations found.</p>
        )}
      </div>
      
      <div 
        ref={mapElementRef} 
        id="mapdiv" 
        style={mapStyle}
      ></div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px',
  flexWrap: 'wrap',
  minHeight: '90vh',
  backgroundColor: '#f5f5f5'
};

const infoContainerStyle = {
  alignSelf: 'flex-start',
  flex: '1 1 300px',
  marginRight: '20px',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '20px'
};

const mapStyle = {
  width: '100%',
  height: '70vh',
  minHeight: '400px',
  borderRadius: '10px',
  flex: '1 1 400px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  marginTop: '0',
};

const locationListStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0
};

const locationItemStyle = {
  padding: '15px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  marginBottom: '15px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const locationDetailsStyle = {
  marginTop: '8px',
  fontSize: '14px',
  color: '#666'
};

export default InformationDisplay;