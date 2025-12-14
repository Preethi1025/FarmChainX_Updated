import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Shield, 
  TrendingUp, 
  Users, 
  Scan,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Traceability',
      description: 'Every product has an immutable journey record from farm to table',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Insights',
      description: 'Smart predictions for yield, pricing, and quality grading',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Direct Marketplace',
      description: 'Connect directly with farmers, eliminate middlemen',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Scan,
      title: 'QR Verification',
      description: 'Scan to verify authenticity and complete product history',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Farmers Connected' },
    { number: '50K+', label: 'Products Tracked' },
    { number: '99.9%', label: 'Traceability Accuracy' },
    { number: '40%', label: 'Farmer Income Increase' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Revolutionizing Agriculture</span>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              From
              <span className="block bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Farm to Table
              </span>
              with Trust
            </h1>
            
            <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              FarmChainX brings transparency to agriculture using AI and blockchain technology. 
              Connect directly with farmers, verify product journeys, and ensure fair trade.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary bg-white text-primary-700 hover:bg-gray-50 text-lg px-8 py-4">
                Start Your Journey
              </Link>
               <Link to="/marketplace" className="btn-primary bg-white text-primary-700 hover:bg-gray-50 text-lg px-8 py-4">
                Explore Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-yellow-300 opacity-60"
        >
          <Leaf className="h-12 w-12" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 text-white opacity-40"
        >
          <Leaf className="h-16 w-16" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose FarmChainX?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building the future of agriculture with cutting-edge technology and unwavering commitment to transparency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="card-hover bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Agriculture?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and buyers who are already experiencing the future of transparent, fair-trade agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-white text-primary-700 hover:bg-gray-50">
                Join as Farmer
              </Link>
              <Link to="/register" className="btn-primary bg-white text-primary-700 hover:bg-gray-50">
                Join as Buyer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home