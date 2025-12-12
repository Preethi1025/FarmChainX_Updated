import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Scan, Sprout, ShoppingCart, Wallet } from 'lucide-react';
import QRScanner from '../components/common/QRScanner';

const Marketplace = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/listings/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading Marketplace...
      </div>
    );
  }

  // ⭐ UNIVERSAL BUTTON STYLE (same for all)
  const buttonClass =
    "w-full border border-primary-500 text-primary-600 hover:bg-primary-50 py-2 rounded-lg shadow flex items-center justify-center space-x-2 transition";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-2">
                Buy fresh, traceable products directly from farmers
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

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full py-8">
              🚫 No active listings available.
            </p>
          ) : (
            products.map((product) => (
              <motion.div
                key={product.listingId}
                className="card-hover bg-white rounded-xl shadow p-4 flex flex-col justify-between"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  {/* Placeholder image */}
                  <div className="h-40 bg-green-100 flex items-center justify-center rounded-lg mb-3 text-4xl">
                    🌿
                  </div>

                  <h2 className="text-lg font-semibold capitalize">{product.cropName}</h2>
                  <p className="text-sm text-gray-600">Farmer: {product.farmerId}</p>

                  <p className="mt-2 text-xl font-bold text-green-700">
                    ₹{product.price}
                    <span className="text-sm text-gray-600"> / kg</span>
                  </p>

                  <p className="text-sm text-gray-500">Available: {product.quantity} kg</p>

                  <p className={`text-xs mt-1 px-2 py-1 inline-block rounded ${getQualityColor(product.qualityGrade)}`}>
                    Grade: {product.qualityGrade || "Not Graded"}
                  </p>
                </div>

                {/* Buttons — SAME styling for all */}
                <div className="mt-4 flex flex-col space-y-2">

                  {/* BUY NOW */}
                  <button className={buttonClass}>
                    <Wallet className="h-4 w-4" />
                    <span>Buy Now</span>
                  </button>

                  {/* ADD TO CART */}
                  <button className={buttonClass}>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>

                  {/* TRACE ORIGIN */}
                  <button
                    onClick={() => {
                      if (product.traceUrl) window.open(product.traceUrl, "_blank");
                      else alert("Traceability URL not available");
                    }}
                    className={buttonClass}
                  >
                    <Sprout className="h-4 w-4" />
                    <span>Trace Origin</span>
                  </button>

                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={() => setShowScanner(false)}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Marketplace;
