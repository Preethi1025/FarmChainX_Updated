import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { supportApi } from '../../api';
import './ContactForm.css';

const ContactForm = ({ onClose }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    issueType: '',
    reportedAgainstId: '',
    reportedAgainstType: '',
    subject: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Extract user info
  const userId = user?.id;
  const userType = user?.role;
  const userName = user?.name || user?.email || 'User';

  useEffect(() => {
    if (!user) {
      setMessage({
        text: 'Please login to create a support ticket.',
        type: 'error'
      });
    }
  }, [user]);

  const issueTypes = [
    { value: 'TECHNICAL', label: 'Technical Issue' },
    { value: 'USER_DISPUTE', label: 'Issue with Another User' },
    { value: 'PAYMENT', label: 'Payment Problem' },
    { value: 'PRODUCT_QUALITY', label: 'Product Quality Issue' },
    { value: 'DELIVERY', label: 'Delivery Issue' },
    { value: 'ACCOUNT', label: 'Account Issue' },
    { value: 'OTHER', label: 'Other' }
  ];

  const userTypes = [
    { value: 'FARMER', label: 'Farmer' },
    { value: 'DISTRIBUTOR', label: 'Distributor' },
    { value: 'BUYER', label: 'Buyer' },
    { value: 'ADMIN', label: 'Admin' }
  ];

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Check if user exists
  if (!user || !user.id || !user.role) {
    setMessage({
      text: 'User information is not available. Please login again.',
      type: 'error'
    });
    return;
  }

  // Validate required fields
  if (!formData.issueType || !formData.subject || !formData.description) {
    setMessage({
      text: 'Please fill all required fields.',
      type: 'error'
    });
    return;
  }

  setLoading(true);
  setMessage({ text: '', type: '' });

  try {
    const ticketData = {
      reportedById: user.id,
      reportedByRole: user.role.toUpperCase(),
      reportedAgainstId: formData.reportedAgainstId || null,
      reportedAgainstType: formData.reportedAgainstType || null,
      issueType: formData.issueType,
      subject: formData.subject,
      description: formData.description,
      priority: formData.issueType === 'PAYMENT' ? 'HIGH' : 'MEDIUM',
      status: 'OPEN'
    };

    console.log('🔄 Sending ticket data to backend:', ticketData);
    
    // Call API
    const response = await supportApi.createTicket(ticketData);
    
    console.log('✅ Backend response:', response);
    console.log('📊 Response data:', response.data);

    if (response.data && response.data.success === true) {
      const ticketId = response.data.ticket?.ticketId || 'N/A';
      const ticketNumber = response.data.ticket?.id || 'N/A';
      
      setMessage({
        text: `🎉 SUCCESS! TICKET CREATED
        
        📋 Ticket Details:
        • Ticket ID: #${ticketId}
        • Reference: TKT-${ticketNumber}
        • Status: 🟡 OPEN
        • Priority: ${formData.issueType === 'PAYMENT' ? '🔴 HIGH' : '🟡 MEDIUM'}
        
        📬 Next Steps:
        • Admin will review within 24 hours
        • You'll get notified when they respond
        • Track progress in "My Tickets" section
        
        Thank you for reporting the issue!`,
        type: 'success'
      });

      // Clear form
      setFormData({
        issueType: '',
        reportedAgainstId: '',
        reportedAgainstType: '',
        subject: '',
        description: ''
      });

      // Close after 6 seconds to give user time to read
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 6000);
      }
    } else {
      // Backend returned success: false or unexpected format
      console.error('❌ Unexpected response format:', response.data);
      setMessage({
        text: response.data?.error || response.data?.message || 'Ticket created but got unexpected response.',
        type: 'warning'
      });
    }

  } catch (error) {
    console.error('❌ Error creating ticket:', error);
    
    // Detailed error logging
    if (error.response) {
      // Server responded with error status
      console.error('📡 Server error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      let errorMsg = 'Server error occurred.';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }
      setMessage({ text: `❌ ERROR: ${errorMsg}`, type: 'error' });
      
    } else if (error.request) {
      // Request was made but no response received
      console.error('📡 No response received. Request:', error.request);
      setMessage({ 
        text: '❌ No response from server. Please check if backend is running.', 
        type: 'error' 
      });
      
    } else {
      // Something else happened
      console.error('❓ Setup error:', error.message);
      setMessage({ 
        text: `❌ Error: ${error.message}`, 
        type: 'error' 
      });
    }
    
    // Don't clear form on error so user can try again
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="contact-form-overlay">
      <div className="contact-form-modal">
        <div className="contact-form-header">
          <h2>Contact Admin / Report Issue</h2>
          <button 
            className="close-btn" 
            onClick={onClose} 
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="issueType">Issue Type *</label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              required
              disabled={loading || !user}
              className={!formData.issueType ? 'required-field' : ''}
            >
              <option value="">Select Issue Type</option>
              {issueTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {formData.issueType === 'USER_DISPUTE' && (
            <div className="user-dispute-fields">
              <div className="form-group">
                <label htmlFor="reportedAgainstType">Report Against User Type</label>
                <select
                  id="reportedAgainstType"
                  name="reportedAgainstType"
                  value={formData.reportedAgainstType}
                  onChange={handleChange}
                  disabled={loading || !user}
                >
                  <option value="">Select User Type</option>
                  {userTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reportedAgainstId">User ID to Report Against</label>
                <input
                  type="text"
                  id="reportedAgainstId"
                  name="reportedAgainstId"
                  value={formData.reportedAgainstId}
                  onChange={handleChange}
                  placeholder="Enter the user ID (optional)"
                  disabled={loading || !user}
                />
                <small className="helper-text">
                  Optional: Enter the ID of the user you want to report
                </small>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              required
              disabled={loading || !user}
              className={!formData.subject ? 'required-field' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe your issue in detail..."
              rows="5"
              required
              disabled={loading || !user}
              className={!formData.description ? 'required-field' : ''}
            />
            <small className="helper-text">
              Include relevant details like dates, times, transaction IDs, screenshots description, etc.
            </small>
          </div>

          {message.text && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

         

          <div className="form-user-info">
            <small>
              <strong>Reporting as:</strong> {userName} (ID: {userId || 'N/A'}, Type: {userType || 'N/A'})
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !user}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;