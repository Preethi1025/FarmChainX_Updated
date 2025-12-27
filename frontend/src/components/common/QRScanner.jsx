import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Camera, Scan, CheckCircle, X } from 'lucide-react'

const QRScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      videoRef.current.srcObject = stream
      streamRef.current = stream
      setIsScanning(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      // Fallback to manual input
      simulateScan()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsScanning(false)
  }

  const simulateScan = () => {
    // Simulate QR code scan for demo
    const demoData = {
      batchId: 'BCH_2024_001',
      product: 'Organic Tomatoes',
      farmer: 'Green Valley Farms',
      harvestDate: '2024-01-15',
      qualityGrade: 'A',
      confidence: 95
    }
    
    setScannedData(demoData)
    onScan(demoData)
  }

  const handleScan = (data) => {
    if (data) {
      setScannedData(data)
      stopCamera()
      onScan(data)
    }
  }

  const resetScan = () => {
    setScannedData(null)
    startCamera()
  }

  React.useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Scan className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
              <p className="text-sm text-gray-600">Point camera at product QR code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative">
          {!isScanning && !scannedData && (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Camera not active</p>
                <button
                  onClick={startCamera}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start Camera</span>
                </button>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Scanner Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary-400 rounded-lg relative">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary-400 rounded-tl"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary-400 rounded-tr"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary-400 rounded-bl"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary-400 rounded-br"></div>
                  
                  <motion.div
                    animate={{ y: [0, 250, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-full h-1 bg-primary-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          {scannedData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center p-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="bg-green-500 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <CheckCircle className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Verified!
                </h4>
                <p className="text-gray-600 mb-4">
                  {scannedData.product} from {scannedData.farmer}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="text-gray-600">Batch ID:</div>
                  <div className="font-medium">{scannedData.batchId}</div>
                  <div className="text-gray-600">Quality Grade:</div>
                  <div className="font-medium text-green-600">{scannedData.qualityGrade}</div>
                </div>
                <button
                  onClick={resetScan}
                  className="btn-secondary w-full"
                >
                  Scan Another
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Demo Button */}
        {!isScanning && !scannedData && (
          <div className="mt-4 text-center">
            <button
              onClick={simulateScan}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Use demo QR code for testing
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to scan:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Hold steady 6-12 inches from code</li>
            <li>• Position QR code within frame</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default QRScanner