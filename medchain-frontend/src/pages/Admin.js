import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [hospitals, setHospitals] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    authorized: 0,
    pending: 0,
    rejected: 0
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('/api/admin/hospitals', getAuthHeaders());
      const list = response.data.hospitals || [];
      setHospitals(list);
      setStats({
        total: list.length,
        authorized: list.filter(h => h.isAuthorized === true).length,
        pending: list.filter(h => h.isAuthorized === false).length,
        rejected: 0
      });
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (hospitalId) => {
    if (!window.confirm('Are you sure you want to authorize this hospital?')) return;
    setActionLoading(hospitalId);
    try {
      await axios.post(`/api/admin/authorize/${hospitalId}`, {}, getAuthHeaders());
      await fetchHospitals();
      alert('Hospital authorized successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to authorize hospital');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (hospitalId) => {
    if (!window.confirm("Are you sure you want to revoke this hospital's access?")) return;
    setActionLoading(hospitalId);
    try {
      await axios.post(`/api/admin/revoke/${hospitalId}`, {}, getAuthHeaders());
      await fetchHospitals();
      alert('Hospital access revoked');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to revoke access');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredHospitals = hospitals.filter(h => {
    if (activeTab === 'all') return true;
    if (activeTab === 'authorized') return h.isAuthorized === true;
    if (activeTab === 'pending') return h.isAuthorized === false;
    return true;
  });

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Government Admin Panel</h1>
            <p className="page-subtitle">
              Manage hospital authorizations and monitor the MedChain network
            </p>
          </div>
          <div className="admin-badge">
            <span className="badge-icon">⚙️</span>
            Administrator Access
          </div>
        </div>

        {/* Statistics */}
        <div className="admin-stats">
          <div className="stat-box">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Hospitals</div>
          </div>
          <div className="stat-box stat-box-success">
            <div className="stat-number">{stats.authorized}</div>
            <div className="stat-label">Authorized</div>
          </div>
          <div className="stat-box stat-box-warning">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-box stat-box-danger">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Hospitals ({stats.total})
          </button>
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval ({stats.pending})
          </button>
          <button
            className={`tab ${activeTab === 'authorized' ? 'active' : ''}`}
            onClick={() => setActiveTab('authorized')}
          >
            Authorized ({stats.authorized})
          </button>
        </div>

        {/* Hospital List */}
        <div className="hospitals-list">
          {filteredHospitals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏥</div>
              <h3>No hospitals found</h3>
              <p className="text-muted">
                {activeTab === 'pending' && 'No applications awaiting approval'}
                {activeTab === 'authorized' && 'No hospitals have been authorized yet'}
                {activeTab === 'all' && 'No hospital registrations yet'}
              </p>
            </div>
          ) : (
            filteredHospitals.map((hospital) => (
              <div key={hospital._id} className="hospital-card">
                <div className="hospital-header">
                  <div className="hospital-info">
                    <h3 className="hospital-name">{hospital.name}</h3>
                    <p className="hospital-reg">Reg: {hospital.registrationNumber}</p>
                  </div>
                  <span className={`badge ${hospital.isAuthorized ? 'badge-authorized' : 'badge-pending'}`}>
                    {hospital.isAuthorized ? '✓ AUTHORIZED' : '⏳ PENDING'}
                  </span>
                </div>

                <div className="hospital-details">
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{hospital.location}, {hospital.state}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact Person:</span>
                    <span className="detail-value">{hospital.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{hospital.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{hospital.phone || 'N/A'}</span>
                  </div>
                  {hospital.walletAddress && (
                    <div className="detail-row">
                      <span className="detail-label">Blockchain Address:</span>
                      <span className="detail-value blockchain-address">
                        {hospital.walletAddress.substring(0, 10)}...{hospital.walletAddress.substring(36)}
                      </span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Applied:</span>
                    <span className="detail-value">
                      {new Date(hospital.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="hospital-actions">
                  {!hospital.isAuthorized && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleAuthorize(hospital._id)}
                      disabled={actionLoading === hospital._id}
                    >
                      {actionLoading === hospital._id ? 'Processing...' : '✓ Authorize'}
                    </button>
                  )}
                  {hospital.isAuthorized && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRevoke(hospital._id)}
                      disabled={actionLoading === hospital._id}
                    >
                      {actionLoading === hospital._id ? 'Processing...' : 'Revoke Access'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;