import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell'; // IMPORT HERE AT TOP
import {
  Leaf,
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  BarChart3,
  Scan
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth() || {};   // Prevent null crash
  const location = useLocation();

  const navigation = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'Traceability', href: '/trace/demo', icon: Scan },
  ];

  const farmerNav = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ];

  const buyerNav = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ];

  // avoid crash if user is null
  const getRoleNav = () => {
    if (!user || !user.role) return [];
    return user.role === 'FARMER' ? farmerNav : buyerNav;
  };

  return (
    <header className="glass-effect sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-primary-500 to-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-emerald-700 bg-clip-text text-transparent">
                FarmChainX
              </h1>
              <p className="text-xs text-gray-500">Transparent Agriculture</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 font-medium transition-all duration-200 ${location.pathname === item.href ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user &&
              getRoleNav().map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 font-medium transition-all duration-200 ${location.pathname === item.href ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* ADD NOTIFICATION BELL HERE */}
                <NotificationBell />
                
                <div className="flex items-center space-x-2 bg-primary-50 rounded-full px-3 py-1">
                  <span className="text-lg">{user.avatar || '👤'}</span>
                  <span className="text-sm font-medium text-primary-700">
                    {user.name || 'User'}
                  </span>
                  <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                    {(user.role || '').toLowerCase()}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link to="/register" className="
    bg-emerald-600 text-white
    hover:bg-white hover:text-emerald-600
    border-2 border-emerald-600
    transition-all duration-300
    px-5 py-2 rounded-lg
    text-sm font-semibold
  ">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* ADD NOTIFICATION BELL FOR MOBILE TOO */}
              {user && (
                <div className="flex justify-center mb-4">
                  <NotificationBell />
                </div>
              )}
              
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user &&
                getRoleNav().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

              {!user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 font-medium text-center py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <User className="h-4 w-4" />
                    <span>{user.name || 'User'}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-500 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;