import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">⛓</div>
          <div>
            <div className="brand-title">MEDCHAIN</div>
            <div className="brand-subtitle">Blockchain Healthcare</div>
          </div>
        </Link>

        <div className={`navbar-menu ${showMenu ? 'active' : ''}`}>
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              
              {!isAdmin && (
                <>
                  <Link to="/search" className="nav-link">
                    <span className="nav-icon">🔍</span>
                    Search Patient
                  </Link>
                  <Link to="/add-record" className="nav-link">
                    <span className="nav-icon">➕</span>
                    Add Record
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  Admin Panel
                </Link>
              )}

              <div className="nav-user">
                <div className="user-info">
                  <div className="user-name">{user.hospitalName || user.email}</div>
                  <div className="user-role">{isAdmin ? 'Government Admin' : 'Hospital'}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;