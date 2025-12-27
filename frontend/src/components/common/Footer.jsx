import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Twitter, Facebook, Instagram, Github } from 'lucide-react';
import ContactForm from './ContactForm';
import './Footer.css';

const Footer = ({ userType, userId, userName }) => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);

  const handleFooterClick = (item) => {
    switch(item) {
      case 'help':
      navigate('/helpcenter');  // Changed from /${userType}/help-center
      break;
      case 'contact':
        setShowContactForm(true);
        break;
      case 'privacy':
        navigate('/privacypolicy');
        break;
      case 'terms':
        navigate('/termsconditions');
        break;
      case 'about':
        navigate('/about-us');
        break;
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'trace':
        navigate('/pages/traceability');
        break;
      case 'farmer-dashboard':
        navigate('/farmer/dashboard');
        break;
      case 'buyer-dashboard':
        navigate('/pages/Consumerdashboard');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <footer className="farmchainx-footer bg-gradient-to-br from-gray-900 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-2">
                <div className="bg-white p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="footer-logo text-xl font-bold">FarmChainX</h3>
                  <p className="footer-tagline text-primary-200">Transparent Agriculture</p>
                </div>
              </div>
              <p className="footer-description text-gray-300 ">
                Revolutionizing agriculture with AI-driven traceability and direct farmer-to-buyer marketplace. 
                Ensuring transparency, fairness, and quality from farm to table.
              </p>
              <div className="flex space-x-3 mt-2">
                {[Twitter, Facebook, Instagram, Github].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div className="footer-section">
              <h3 className="footer-heading">Platform</h3>
              <ul className="footer-links">

                <li>
                  <button 
                    onClick={() => handleFooterClick('marketplace')}
                    className="footer-link-btn hover:text-white transition-colors w-full text-left"
                  >
                    Marketplace
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterClick('trace')}
                    className="footer-link-btn hover:text-white transition-colors w-full text-left"
                  >
                    Traceability
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterClick('farmer-dashboard')}
                    className="footer-link-btn hover:text-white transition-colors w-full text-left"
                  >
                    For Farmers
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterClick('buyer-dashboard')}
                    className="footer-link-btn hover:text-white transition-colors w-full text-left"
                  >
                    For Buyers
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-section">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li>
                  <button 
                    onClick={() => handleFooterClick('help')}
                    className="footer-link-btn hover:text-white transition-colors  text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterClick('contact')}
                    className="footer-link-btn hover:text-white transition-colors  text-left"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterClick('privacy')}
                    className="footer-link-btn hover:text-white transition-colors  text-left"
                  >
                    Privacy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFooterClick('terms')}
                    className="footer-link-btn hover:text-white transition-colors  text-left"
                  >
                    Terms
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="contact-info">
                <p className="contact-item text-gray-300">

                  <span className="contact-icon">📧</span>
                  support@farmchainx.com
                </p>
                <p className="contact-item text-gray-300">

                  <span className="contact-icon">📞</span>
                  +91 9686322533
                </p>
                <p className="contact-item text-gray-300">

                  <span className="contact-icon">📍</span>
                  28-1170/1, T Nagar, Chennai
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom border-t border-white/20 mt-4 pt-3 text-center text-gray-300">
            <p className="copyright">
              &copy; {new Date().getFullYear()} FarmChainX. All rights reserved. Cultivating trust in every harvest.
            </p>
            <p className="version mt-2">
              Version 1.0.0 | Farm-to-Table Traceability System
            </p>
          </div>
        </div>
      </footer>

      {showContactForm && (
        <ContactForm
          userType={userType}
          userId={userId}
          userName={userName}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </>
  );
};

export default Footer;