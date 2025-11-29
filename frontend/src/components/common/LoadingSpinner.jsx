import React from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className={`${sizes[size]} text-primary-600`}
      >
        <Leaf className="h-full w-full" />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <LoadingSpinner size="xl" text="FarmChainX is loading..." />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-500"
        >
          Cultivating trust in every harvest
        </motion.p>
      </div>
    </div>
  )
}

export const ContentLoader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="large" text="Loading content..." />
    </div>
  )
}

export default LoadingSpinner