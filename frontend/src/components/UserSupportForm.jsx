import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ContactForm from './common/ContactForm';
import { useNavigate } from 'react-router-dom';

const UserSupportForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ADD THIS LINE
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="user-support-container p-6">
      <div className="support-header text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Support & Help Center</h2>
        <p className="text-gray-600 mt-2">Having issues? Contact our admin team for assistance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="support-card bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Contact Admin</h3>
          <p className="text-gray-600 mb-4">Report issues, ask questions, or get help from our support team.</p>
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
            onClick={() => setShowContactForm(true)}
            disabled={!user}
          >
            Contact Admin
          </button>
          
          {!user && (
            <p className="text-red-500 text-sm mt-2">Please login to contact admin</p>
          )}
        </div>

        <div className="support-card bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">FAQs</h3>
          <p className="text-gray-600 mb-4">Check our frequently asked questions for quick answers.</p>
          <button 
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
            onClick={() => alert('FAQs feature coming soon!')}
          >
            View FAQs
          </button>
        </div>

        <div className="support-card bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">My Tickets</h3>
          <p className="text-gray-600 mb-4">View and track your previous support tickets.</p>
          <button 
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            onClick={() => navigate('/my-tickets')}
          >
            View My Tickets
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Track status, view responses, and reply to admin
          </p>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
        />
      )}

      {/* Help Tips */}
      <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">How it works:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">1</div>
            <p className="text-sm text-blue-700">Create a ticket describing your issue</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">2</div>
            <p className="text-sm text-blue-700">Admin will review and respond within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 font-bold">3</div>
            <p className="text-sm text-blue-700">Track responses in "My Tickets" section</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSupportForm;