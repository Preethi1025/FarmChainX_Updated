import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar,
  Sprout,
  Scan,
  ShoppingCart
} from 'lucide-react'
import QRScanner from '../components/common/QRScanner'

const Marketplace = () => {
  const [showScanner, setShowScanner] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    quality: '',
    priceRange: [0, 100],
    location: ''
  })

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Organic Cherry Tomatoes',
      farmer: 'Green Valley Farms',
      price: 2.99,
      unit: 'kg',
      quality: 'A',
      confidence: 95,
      location: 'Salinas, CA',
      harvestDate: '2024-01-15',
      image: '🍅',
      rating: 4.8,
      reviews: 124,
      certifications: ['Organic', 'Non-GMO'],
      traceability: true
    },
    {
      id: 2,
      name: 'Fresh Bell Peppers',
      farmer: 'Sunrise Organics',
      price: 3.49,
      unit: 'kg',
      quality: 'A',
      confidence: 92,
      location: 'Fresno, CA',
      harvestDate: '2024-01-12',
      image: '🫑',
      rating: 4.6,
      reviews: 89,
      certifications: ['Organic'],
      traceability: true
    },
    {
      id: 3,
      name: 'Sweet Basil',
      farmer: 'Herb Garden Co.',
      price: 4.99,
      unit: 'bunch',
      quality: 'B',
      confidence: 88,
      location: 'Monterey, CA',
      harvestDate: '2024-01-18',
      image: '🌿',
      rating: 4.9,
      reviews: 67,
      certifications: ['Pesticide-Free'],
      traceability: true
    },
    {
      id: 4,
      name: 'Rainbow Carrots',
      farmer: 'Root Revolution',
      price: 2.79,
      unit: 'kg',
      quality: 'A',
      confidence: 94,
      location: 'Bakersfield, CA',
      harvestDate: '2024-01-10',
      image: '🥕',
      rating: 4.7,
      reviews: 156,
      certifications: ['Organic', 'Local'],
      traceability: true
    }
  ]

  const categories = [
    'All Crops',
    'Vegetables',
    'Fruits',
    'Herbs',
    'Grains',
    'Dairy'
  ]

  const handleScan = (data) => {
    console.log('Scanned data:', data)
    setShowScanner(false)
  }

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-2">
                Discover fresh, traceable products directly from farmers
              </p>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2"
            >
              <Scan className="h-4 w-4" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, farmers, or locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Filter Button */}
            <button className="btn-secondary flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center relative">
                <span className="text-6xl">{product.image}</span>
                <div className="absolute top-4 right-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(product.quality)}`}>
                    Grade {product.quality} • {product.confidence}%
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {product.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-500">per {product.unit}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  by {product.farmer}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Harvested {product.harvestDate}</span>
                  </div>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.certifications.map(cert => (
                    <span
                      key={cert}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                  {product.traceability && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Traceable
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="btn-secondary text-sm py-2 px-3">
                    <Sprout className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="btn-secondary">
            Load More Products
          </button>
        </motion.div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}

export default Marketplace