import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const [scannedProducts, setScannedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Placeholder for fetching scanned products
    // Update with actual API endpoint when available
    setLoading(false)
    setScannedProducts([])
  }, [user])

  return (
    <div className="space-y-5">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Buyer Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Verify products and track your orders from farmers.
          </p>
        </div>
        <a href="/marketplace" className="btn-primary text-xs">
          Browse Products
        </a>
      </header>

      <div className="card grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Recently Scanned
          </p>
          {loading ? (
            <p className="text-xs text-slate-500">Loading...</p>
          ) : scannedProducts.length === 0 ? (
            <ul className="space-y-3 text-xs">
              <li className="text-slate-500">
                No products scanned yet. Scan a QR code from a product to verify its origin.
              </li>
            </ul>
          ) : (
            <ul className="space-y-3 text-xs">
              {scannedProducts.map((product, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-slate-500">Farmer: {product.farmer}</p>
                  </div>
                  <span className="badge bg-emerald-50 text-emerald-600">Verified</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 text-white p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-75 mb-1">
              Why verify?
            </p>
            <p className="text-sm font-semibold mb-2">
              Ensure your food is authentic, safe, and ethically sourced.
            </p>
            <p className="text-[11px] opacity-80">
              FarmChainX shows the full chain of custody including harvest
              details, transport temperature logs, and certifications.
            </p>
          </div>
          <p className="text-[10px] opacity-70 mt-4">
            Data provided by farmers and distributors via the FarmChainX
            platform.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Your Orders</h3>
        <p className="text-xs text-slate-500">
          No orders yet. Start by browsing available products from farmers.
        </p>
      </div>
    </div>
  )
}

export default BuyerDashboard