import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Sprout,
  Shield,
  Star
} from 'lucide-react'

const Traceability = () => {
  const { batchId } = useParams()

  // Mock traceability data
  const traceData = {
    batchId: batchId || 'BCH_2024_001',
    product: 'Organic Cherry Tomatoes',
    farmer: {
      name: 'Green Valley Farms',
      location: 'Salinas, CA',
      rating: 4.8,
      certified: true
    },
    quality: {
      grade: 'A',
      confidence: 95,
      notes: 'Excellent color and firmness'
    },
    timeline: [
      {
        stage: 'Planting',
        date: '2023-10-15',
        status: 'completed',
        details: 'Seeds planted in prepared soil',
        location: 'Field 4B'
      },
      {
        stage: 'Growing',
        date: '2023-11-20',
        status: 'completed',
        details: 'Regular organic fertilization',
        location: 'Field 4B'
      },
      {
        stage: 'Harvesting',
        date: '2024-01-15',
        status: 'completed',
        details: 'Hand-picked at optimal ripeness',
        location: 'Field 4B'
      },
      {
        stage: 'Quality Check',
        date: '2024-01-16',
        status: 'completed',
        details: 'AI grading completed - Grade A',
        location: 'Processing Center'
      },
      {
        stage: 'Packaging',
        date: '2024-01-17',
        status: 'completed',
        details: 'Packaged in eco-friendly containers',
        location: 'Processing Center'
      },
      {
        stage: 'Shipping',
        date: '2024-01-18',
        status: 'current',
        details: 'In transit to distribution center',
        location: 'Route 101'
      },
      {
        stage: 'Delivery',
        date: '2024-01-20',
        status: 'upcoming',
        details: 'Estimated delivery',
        location: 'Local Market'
      }
    ],
    certifications: [
      'USDA Organic',
      'Non-GMO Project Verified',
      'California Certified Organic Farmers',
      'Fair Trade Certified'
    ],
    environmental: {
      waterSaved: '15,000L',
      co2Reduced: '2.3 tons',
      soilHealth: 'Excellent'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'current': return Clock;
      case 'upcoming': return Clock;
      default: return Clock;
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-gray-400 bg-gray-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Journey
          </h1>
          <p className="text-gray-600">
            Track your food from farm to table with complete transparency
          </p>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="text-4xl">🍅</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {traceData.product}
                </h2>
                <p className="text-gray-600">Batch: {traceData.batchId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('completed')}`}>
                  Grade {traceData.quality.grade}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {traceData.quality.confidence}% confidence
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Product Journey Timeline
              </h3>
              
              <div className="space-y-6">
                {traceData.timeline.map((step, index) => {
                  const Icon = getStatusIcon(step.status)
                  return (
                    <motion.div
                      key={step.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex space-x-4"
                    >
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {index < traceData.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {step.stage}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {step.details}
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{step.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Farmer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Farmer Information
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {traceData.farmer.name}
                  </h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{traceData.farmer.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{traceData.farmer.rating}</span>
                </div>
                {traceData.farmer.certified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Certifications
              </h3>
              <div className="space-y-2">
                {traceData.certifications.map((cert, index) => (
                  <div
                    key={cert}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Environmental Impact
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">{traceData.environmental.waterSaved}</div>
                  <div className="text-green-100 text-sm">Water Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{traceData.environmental.co2Reduced}</div>
                  <div className="text-green-100 text-sm">CO₂ Reduced</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{traceData.environmental.soilHealth}</div>
                  <div className="text-green-100 text-sm">Soil Health</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Traceability