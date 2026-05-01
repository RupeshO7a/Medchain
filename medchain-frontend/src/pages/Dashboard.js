import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecords: 0,
    todayRecords: 0,
    activePatients: 0
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recordsRes] = await Promise.all([
        axios.get('/api/records/stats'),
        axios.get('/api/records/recent')
      ]);
      
      setStats(statsRes.data);
      setRecentRecords(recordsRes.data.records || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.hospitalName || 'Hospital'}</p>
          </div>
          <div className="header-actions">
            <Link to="/add-record" className="btn btn-primary">
              <span>➕</span> Add New Record
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalRecords}</div>
              <div className="stat-label">Total Records</div>
            </div>
            <div className="stat-trend">
              <span className="trend-up">↑ All time</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.todayRecords}</div>
              <div className="stat-label">Today's Records</div>
            </div>
            <div className="stat-trend">
              <span className="trend-neutral">→ Last 24 hours</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.activePatients}</div>
              <div className="stat-label">Active Patients</div>
            </div>
            <div className="stat-trend">
              <span className="trend-up">↑ This month</span>
            </div>
          </div>

          <div className="stat-card stat-card-highlight">
            <div className="stat-icon">⛓</div>
            <div className="stat-content">
              <div className="stat-value">100%</div>
              <div className="stat-label">Blockchain Secured</div>
            </div>
            <div className="stat-badge">Immutable</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/search" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Search Patient</h3>
              <p>Find and view complete medical history</p>
            </Link>

            <Link to="/add-record" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Record</h3>
              <p>Create new patient medical record</p>
            </Link>

            <div className="action-card action-card-info">
              <div className="action-icon">🔐</div>
              <h3>Secure & Private</h3>
              <p>All data encrypted end-to-end</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2 className="section-title">Recent Records</h2>
          {recentRecords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No recent records</h3>
              <p>Records added today will appear here</p>
              <Link to="/add-record" className="btn btn-primary mt-3">
                Add Your First Record
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <span className="patient-id">
                          {record.patientId.substring(0, 12)}...
                        </span>
                      </td>
                      <td>{record.doctorName}</td>
                      <td>{record.diagnosis}</td>
                      <td>{formatDate(record.visitDate)}</td>
                      <td>
                        <span className="badge badge-success">
                          ⛓ On Chain
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hospital Info Card */}
        <div className="hospital-info-card">
          <div className="info-header">
            <div className="info-icon">🏥</div>
            <div>
              <h3>{user?.hospitalName}</h3>
              <p className="text-muted">{user?.email}</p>
            </div>
          </div>
          <div className="info-details">
            <div className="info-item">
              <span className="info-label">Registration Number:</span>
              <span className="info-value">{user?.registrationNumber || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="badge badge-success">✓ Authorized</span>
            </div>
            <div className="info-item">
              <span className="info-label">Blockchain Address:</span>
              <span className="info-value blockchain-address">
                {user?.walletAddress ? 
                  `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(38)}` 
                  : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
