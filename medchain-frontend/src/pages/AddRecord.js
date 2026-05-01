import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRecord.css';

const AddRecord = () => {
  const [formData, setFormData] = useState({
    aadhaar: '',
    doctorName: '',
    diagnosis: '',
    medicines: '',
    testResults: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();

  const formatAadhaar = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8, 12)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'aadhaar') {
      const formatted = formatAadhaar(value);
      if (formatted.replace(/-/g, '').length <= 12) {
        setFormData({ ...formData, [name]: formatted });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cleanAadhaar = formData.aadhaar.replace(/-/g, '');
    
    if (cleanAadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/records/add', {
        aadhaar: cleanAadhaar,
        doctorName: formData.doctorName,
        diagnosis: formData.diagnosis,
        medicines: formData.medicines,
        testResults: formData.testResults,
        notes: formData.notes
      });

      setTxHash(response.data.transactionHash);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        aadhaar: '',
        doctorName: '',
        diagnosis: '',
        medicines: '',
        testResults: '',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add record to blockchain');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="add-record-page">
        <div className="container">
          <div className="success-container">
            <div className="success-card-large">
              <div className="success-animation">
                <div className="checkmark-circle">
                  <div className="checkmark"></div>
                </div>
              </div>
              
              <h1>Record Added Successfully! </h1>
              <p className="success-subtitle">
                Medical record has been permanently stored on the blockchain
              </p>

              <div className="tx-details">
                <div className="detail-label">Transaction Hash</div>
                <div className="tx-hash">
                  {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                </div>
                <p className="text-muted mt-2">
                  This transaction is now immutable and verifiable across the entire network
                </p>
              </div>

              <div className="success-actions">
                <button 
                  onClick={() => setShowSuccess(false)} 
                  className="btn btn-primary"
                >
                  Add Another Record
                </button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-record-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Add Medical Record</h1>
          <p className="page-subtitle">
            Create a new patient medical record on the blockchain
          </p>
        </div>

        <div className="add-record-card">
          <form onSubmit={handleSubmit} className="record-form">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-section">
              <h3 className="section-title">Patient Information</h3>
              
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🆔</span>
                  Aadhaar Number *
                </label>
                <input
                  type="text"
                  name="aadhaar"
                  className="form-input"
                  placeholder="XXXX-XXXX-XXXX"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  required
                />
                <p className="field-hint">Patient's 12-digit Aadhaar number</p>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Medical Details</h3>
              
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👨‍⚕️</span>
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="doctorName"
                  className="form-input"
                  placeholder="Dr. Full Name"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🩺</span>
                  Diagnosis *
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  className="form-input"
                  placeholder="Primary diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />
                <p className="field-hint">Main condition or illness identified</p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">💊</span>
                  Medicines Prescribed
                </label>
                <textarea
                  name="medicines"
                  className="form-textarea"
                  placeholder="List all prescribed medications with dosage..."
                  value={formData.medicines}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🧪</span>
                  Test Results
                </label>
                <textarea
                  name="testResults"
                  className="form-textarea"
                  placeholder="Lab test results, vitals, imaging findings..."
                  value={formData.testResults}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📝</span>
                  Clinical Notes
                </label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  placeholder="Additional observations, treatment plan, follow-up instructions..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>

            <div className="form-warning">
              <div className="warning-icon">⚠️</div>
              <div>
                <strong>Important:</strong> Once submitted, this record will be permanently 
                stored on the blockchain and cannot be edited or deleted. Please verify all 
                information is accurate before proceeding.
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Submitting to Blockchain...
                  </>
                ) : (
                  <>
                    <span>⛓</span>
                    Save to Blockchain
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecord;