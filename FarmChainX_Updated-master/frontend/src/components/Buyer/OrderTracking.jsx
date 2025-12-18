import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react'

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('')
  const [order, setOrder] = useState(null)

  const handleTrack = () => {
    // Simulate API call
    if (trackingId) {
      setOrder({
        id: trackingId,
        status: 'shipped',
        product: 'Organic Tomatoes',
        farmer: 'Green Valley Farms',
        timeline: [
          { stage: 'Order Placed', date: '2024-01-18 10:30', completed: true },
          { stage: 'Processing', date: '2024-01-18 14:15', completed: true },
          { stage: 'Shipped', date: '2024-01-19 09:00', completed: true },
          { stage: 'Out for Delivery', date: '2024-01-20', completed: false },
          { stage: 'Delivered', date: '', completed: false }
        ]
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Track Your Order</h3>
      
      {/* Tracking Input */}
      <div className="flex space-x-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter tracking ID (e.g., BCH_2024_001)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button 
          onClick={handleTrack}
          className="btn-primary"
        >
          Track
        </button>
      </div>

      {/* Tracking Results */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">{order.product}</h4>
                <p className="text-sm text-gray-600">from {order.farmer}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Tracking ID</div>
                <div className="font-mono text-primary-600">{order.id}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-900">Delivery Timeline</h5>
            {order.timeline.map((step, index) => {
              const Icon = step.completed ? CheckCircle : Clock
              return (
                <div key={step.stage} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{step.stage}</div>
                    {step.date && (
                      <div className="text-sm text-gray-500">{step.date}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TrackOrder