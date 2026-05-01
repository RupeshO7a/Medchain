import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

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

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">⛓</div>
            <h1 className="login-title">MEDCHAIN</h1>
            <p className="login-subtitle">Blockchain Healthcare Records System</p>
            <div className="login-badge">Government of India • NDHM</div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
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

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>New hospital? <Link to="/register" className="link">Apply for Access</Link></p>
            <div className="login-info">
              <p className="text-muted">🔒 Secure blockchain authentication</p>
              <p className="text-muted">✓ End-to-end encrypted</p>
            </div>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Immutable Records</h3>
            <p>Patient data stored permanently on blockchain, impossible to alter or delete</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Cross-Hospital Sharing</h3>
            <p>Access complete medical history from any authorized hospital in the network</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Patient-Controlled</h3>
            <p>Patients own their data with cryptographic keys and grant access permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
