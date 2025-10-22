// src/RegisterForm.js
import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    role: '',
    password: '',
    image: '',
    address: {
      complete_address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      location: {
        type: 'Point',
        coordinates: ['', ''],
      },
    },
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length === 1) {
      setFormData({ ...formData, [name]: value });
    } else if (nameParts.length === 2) {
      setFormData({
        ...formData,
        [nameParts[0]]: { ...formData[nameParts[0]], [nameParts[1]]: value },
      });
    } else if (nameParts.length === 3) {
      setFormData({
        ...formData,
        [nameParts[0]]: {
          ...formData[nameParts[0]],
          [nameParts[1]]: { ...formData[nameParts[0]][nameParts[1]], [nameParts[2]]: value },
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
    } else {
      console.log('Form data submitted:', formData);
      setErrorMessage('');
      // Handle successful registration here
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>
        <h3>Address</h3>
        <div>
          <label>Complete Address:</label>
          <input
            type="text"
            name="address.complete_address"
            value={formData.address.complete_address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="address.postal_code"
            value={formData.address.postal_code}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
