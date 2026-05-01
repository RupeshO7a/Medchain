import React, { useState } from 'react';
import axios from 'axios';
import './SearchPatient.css';

const SearchPatient = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const formatAadhaar = (value) => {
    // No formatting - just return plain numbers
    return value.replace(/\D/g, '').slice(0, 12);
  };

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    // FIXED: No need to remove dashes since we're not adding them
    if (formatted.length <= 12) {
      setAadhaar(formatted);
      setError('');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Clean aadhaar (remove any non-digits just in case)
    const cleanAadhaar = aadhaar.replace(/\D/g, '');
    
    if (cleanAadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/records/${cleanAadhaar}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRecords(response.data.records || []);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to fetch patient records');
      setRecords([]);
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

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1 className="page-title">Search Patient Records</h1>
          <p className="page-subtitle">
            Enter patient's Aadhaar number to view complete medical history from all hospitals
          </p>
        </div>

        <div className="search-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                className="search-input"
                placeholder="Enter 12 digit Aadhaar"
                value={aadhaar}
                onChange={handleAadhaarChange}
                maxLength={12}
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Records'}
              </button>
            </div>
            
            {error && (
              <div className="alert alert-error mt-2">
                {error}
              </div>
            )}

            <div className="search-info">
              <p className="text-muted">
                <span className="info-icon">🔐</span>
                All searches are logged and encrypted for patient privacy
              </p>
            </div>
          </form>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="text-muted mt-2">Querying blockchain network...</p>
          </div>
        )}

        {!loading && searched && (
          <>
            {records.length === 0 ? (
              <div className="empty-results">
                <div className="empty-icon">📋</div>
                <h3>No Records Found</h3>
                <p className="text-muted">
                  No medical records exist for this Aadhaar number in the network.
                  This could mean the patient hasn't visited any hospital in the system yet.
                </p>
              </div>
            ) : (
              <div className="results-section">
                <div className="results-header">
                  <h2>Patient Medical History</h2>
                  <span className="record-count">
                    {records.length} record{records.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                <div className="timeline">
                  {records.map((record, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker">
                        <div className="marker-dot"></div>
                        <div className="marker-line"></div>
                      </div>
                      
                      <div className="record-card">
                        <div className="record-header">
                          <div>
                            <h3 className="hospital-name">{record.hospitalName}</h3>
                            <p className="record-date">{formatDate(record.visitDate)}</p>
                          </div>
                          <div className="record-badge">
                            <span className="badge badge-success">⛓ Verified</span>
                          </div>
                        </div>

                        <div className="record-body">
                          <div className="record-field">
                            <span className="field-label">Doctor:</span>
                            <span className="field-value">{record.doctorName}</span>
                          </div>

                          <div className="record-field">
                            <span className="field-label">Diagnosis:</span>
                            <span className="field-value">{record.diagnosis}</span>
                          </div>

                          {record.medicines && (
                            <div className="record-field">
                              <span className="field-label">Medicines:</span>
                              <span className="field-value">{record.medicines}</span>
                            </div>
                          )}

                          {record.testResults && (
                            <div className="record-field">
                              <span className="field-label">Test Results:</span>
                              <span className="field-value">{record.testResults}</span>
                            </div>
                          )}

                          {record.notes && (
                            <div className="record-field full-width">
                              <span className="field-label">Clinical Notes:</span>
                              <div className="field-value notes-box">{record.notes}</div>
                            </div>
                          )}
                        </div>

                        <div className="record-footer">
                          <span className="record-id">
                            Record ID: #{record.recordId}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPatient;
