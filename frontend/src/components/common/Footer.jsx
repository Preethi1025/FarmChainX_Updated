import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Twitter, Facebook, Instagram, Github } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl">
                <Leaf className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">FarmChainX</h2>
                <p className="text-primary-200">Transparent Agriculture</p>
              </div>
            </Link>
            <p className="text-gray-300 max-w-md">
              Revolutionizing agriculture with AI-driven traceability and direct farmer-to-buyer marketplace. 
              Ensuring transparency, fairness, and quality from farm to table.
            </p>
            <div className="flex space-x-4 mt-4">
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

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/trace/demo" className="hover:text-white transition-colors">Traceability</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">For Farmers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Buyers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 FarmChainX. All rights reserved. Cultivating trust in every harvest.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer