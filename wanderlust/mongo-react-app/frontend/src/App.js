import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupOrLogin from './pages/SignupOrLogin';
import LocationPermission from './pages/LocationPermission';
import GoogleMaps from './pages/GoogleMaps';
import InformationDisplay from './pages/InformationDisplay';
import FeedbackForm from './pages/FeedbackForm';
import Registration from'./pages/registrationpage';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignupOrLogin />} />
                <Route path="/location-permission" element={<LocationPermission />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/google-maps" element={<GoogleMaps />} />
                <Route path="/information-display" element={<InformationDisplay />} />
                <Route path="/feedback-form" element={<FeedbackForm />} />
                <Route path="/login" element={<SignupOrLogin />} />
            </Routes>
        </Router>
    );
};

export default App;
