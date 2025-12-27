import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, DollarSign, Package } from 'lucide-react'

const OrderHistory = () => {
  const orders = [
    {
      id: 'ORD_001',
      products: [
        { name: 'Organic Tomatoes', quantity: '2kg', price: '$5.98' },
        { name: 'Fresh Basil', quantity: '1 bunch', price: '$4.99' }
      ],
      total: '$10.97',
      status: 'delivered',
      date: '2024-01-18',
      farmer: 'Green Valley Farms'
    },
    {
      id: 'ORD_002',
      products: [
        { name: 'Bell Peppers', quantity: '1.5kg', price: '$5.24' }
      ],
      total: '$5.24',
      status: 'delivered',
      date: '2024-01-15',
      farmer: 'Sunrise Organics'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order History</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order {order.id}</h4>
                  <p className="text-sm text-gray-600">from {order.farmer}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary-600">{order.total}</div>
                <div className="text-sm text-gray-500">{order.date}</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              {order.products.map((product, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{product.name} ({product.quantity})</span>
                  <span className="font-medium">{product.price}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{order.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Delivered</span>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                Reorder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory