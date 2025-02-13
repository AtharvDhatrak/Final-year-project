import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const SignupOrLogin = () => {
  const navigate = useNavigate();

  // State to manage form input
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(''); // State to manage error messages

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission (authentication)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      // Check if response was successful
      if (!response.ok) {
        let errorMessage = 'Something went wrong.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error('Error parsing JSON:', err);
        }
        console.log('Error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
  
      const data = await response.json(); // Parse JSON if the response is OK
    console.log('Login successful:', data); // Log the successful response

    navigate('/location-permission'); // Navigate after successful login
  } catch (err) {
    console.error('Error during login:', err);
    setError('Something went wrong. Please try again.');
  }
  };
  console.log('Form Data:', formData);
//   console.log('Received Token:', data.token);


  return (
    <div className="page-background">
      <div className="glass">
        <h1>Wanderlust</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
        <p
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          onClick={() => navigate('/register')}
        >
          Continue to sign up for free
        </p>
        <p>If you already have an account, we'll log you in.</p>

        {/* Input Fields for Username and Password */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={{ padding: '10px', margin: '10px 0', width: '100%' }}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ padding: '10px', margin: '10px 0', width: '100%' }}
            required
          />
          <button type="submit">Log In</button>
        </form>

        {/* Other buttons */}
        {/* <button>Continue with Apple</button>
        <button>Continue with Google</button>
        <button>Continue with Facebook</button> */}
      </div>
    </div>
  );
};

export default SignupOrLogin;
