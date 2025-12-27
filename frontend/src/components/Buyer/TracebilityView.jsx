import React from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Shield,
  Leaf
} from 'lucide-react'

const TraceabilityView = ({ batchId, onClose }) => {
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
      'Fair Trade Certified'
    ]
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'current':
        return Clock
      case 'upcoming':
        return Clock
      default:
        return Clock
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'current':
        return 'text-blue-600 bg-blue-100'
      case 'upcoming':
        return 'text-gray-400 bg-gray-100'
      default:
        return 'text-gray-400 bg-gray-100'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Product Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🍅</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {traceData.product}
              </h3>
              <p className="text-sm text-gray-600">
                Batch: {traceData.batchId}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Quality Grade</p>
            <p className="text-3xl font-bold text-green-600">
              {traceData.quality.grade}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Farmer</p>
            <p className="font-semibold text-gray-900">{traceData.farmer.name}</p>
            <div className="flex items-center space-x-1 mt-1">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{traceData.farmer.location}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Certifications</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {traceData.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center space-x-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                >
                  <Shield className="h-3 w-3" />
                  <span>{cert}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">
          Product Journey
        </h4>
        <div className="space-y-4">
          {traceData.timeline.map((event, index) => {
            const Icon = getStatusIcon(event.status)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex space-x-4"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`p-2 rounded-full ${getStatusColor(event.status)}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < traceData.timeline.length - 1 && (
                    <div className="w-1 h-12 bg-gray-200 my-2" />
                  )}
                </div>
                <div className="pb-4">
                  <h5 className="font-semibold text-gray-900">{event.stage}</h5>
                  <p className="text-sm text-gray-600">{event.details}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default TraceabilityView
