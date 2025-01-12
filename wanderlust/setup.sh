#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Project directories
PROJECT_NAME="mongo-react-app"
BACKEND_DIR="$PROJECT_NAME/backend"
FRONTEND_DIR="$PROJECT_NAME/frontend"

# Create project structure
echo "Creating project structure..."
mkdir -p $BACKEND_DIR $FRONTEND_DIR

# Initialize backend
cd $BACKEND_DIR
echo "Initializing backend..."
npm init -y
npm install express mongoose cors dotenv

echo "Creating backend files..."
cat <<EOT > server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
EOT

touch .env

# Initialize frontend
cd ../../$FRONTEND_DIR
echo "Initializing frontend..."
npx create-react-app .

# Install additional frontend dependencies
npm install axios react-router-dom

# Create React pages
echo "Creating React pages..."
mkdir -p src/pages src/components

cat <<EOT > src/pages/SignupOrLogin.js
import React from 'react';
const SignupOrLogin = () => {
    return <div>Signup or Login Page</div>;
};
export default SignupOrLogin;
EOT

cat <<EOT > src/pages/LocationPermission.js
import React from 'react';
const LocationPermission = () => {
    return <div>Location Permission Page</div>;
};
export default LocationPermission;
EOT

cat <<EOT > src/pages/GoogleMaps.js
import React from 'react';
const GoogleMaps = () => {
    return <div>Google Maps Page</div>;
};
export default GoogleMaps;
EOT

cat <<EOT > src/pages/InformationDisplay.js
import React from 'react';
const InformationDisplay = () => {
    return <div>Information Display Page</div>;
};
export default InformationDisplay;
EOT

cat <<EOT > src/pages/FeedbackForm.js
import React from 'react';
const FeedbackForm = () => {
    return <div>Feedback Form Page</div>;
};
export default FeedbackForm;
EOT

# Update App.js to include routing
echo "Updating App.js for routing..."
cat <<EOT > src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupOrLogin from './pages/SignupOrLogin';
import LocationPermission from './pages/LocationPermission';
import GoogleMaps from './pages/GoogleMaps';
import InformationDisplay from './pages/InformationDisplay';
import FeedbackForm from './pages/FeedbackForm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignupOrLogin />} />
                <Route path="/location-permission" element={<LocationPermission />} />
                <Route path="/google-maps" element={<GoogleMaps />} />
                <Route path="/information-display" element={<InformationDisplay />} />
                <Route path="/feedback-form" element={<FeedbackForm />} />
            </Routes>
        </Router>
    );
};

export default App;
EOT

echo "Project setup completed!"
echo "Navigate to $PROJECT_NAME/backend to work on the backend"
echo "Navigate to $PROJECT_NAME/frontend to work on the frontend"
