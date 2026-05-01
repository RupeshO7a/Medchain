import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Phone number must be 10 digits');
      setLoading(false);
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('PIN code must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h1>Registration Successful!</h1>
            <p>Your hospital registration application has been submitted successfully.</p>
            <p className="text-muted">
              A government administrator will review your application. You will receive 
              an email notification once your hospital is authorized to access the system.
            </p>
            <p className="text-muted mt-3">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <Link to="/" className="back-link">← Back to Login</Link>
            <div className="register-icon">🏥</div>
            <h1 className="register-title">Hospital Registration</h1>
            <p className="register-subtitle">
              Apply for access to the MedChain Healthcare Network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-section">
              <h3 className="section-title">Hospital Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hospital Name *</label>
                  <input
                    type="text"
                    name="hospitalName"
                    className="form-input"
                    placeholder="e.g., Apollo Hospital Chennai"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    className="form-input"
                    placeholder="Government registration number"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select
                    name="state"
                    className="form-select"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    placeholder="6-digit PIN"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Contact Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    className="form-input"
                    placeholder="Full name"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="hospital@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Account Security</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-notice">
              <p>
                By submitting this application, you confirm that all information provided 
                is accurate and that your hospital complies with all government healthcare 
                regulations and data protection laws.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Submitting Application...' : 'Submit Registration Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;