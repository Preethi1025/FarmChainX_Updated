import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Scan, Sprout, ShoppingCart, Wallet, X } from "lucide-react";
import QRScanner from "../components/common/QRScanner";

/* ---------------- CHECKOUT MODAL ---------------- */
const CheckoutModal = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const totalAmount = quantity * product.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-3">
          <p><b>Crop:</b> {product.cropName}</p>
          <p><b>Price:</b> ₹{product.price} / kg</p>

          <div>
            <label className="text-sm font-medium">Quantity (kg)</label>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="House no, Street, City, Pincode"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="bg-gray-100 rounded-lg p-3">
            <p className="font-semibold">
              Total Amount: ₹{totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(quantity, address, contact)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Place Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const Marketplace = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/listings/");
      const listings = Array.isArray(res.data) ? res.data : [];

      const activeProducts = listings
        .filter(
          (l) => l.status === "ACTIVE" || l.status === "APPROVED"
        )
        .map((l) => ({
          listingId: l.listingId,
          batchId: l.batchId,
          cropName: l.cropName || "Unknown Crop",
          farmerId: l.farmerId,
          price: l.price || 0,
          quantity: l.quantity || 0,
          qualityGrade: l.qualityGrade || "Not Graded",
          traceUrl: `/trace/${l.batchId}`,
        }));

      setProducts(activeProducts);
    } catch (err) {
      console.error("Error loading marketplace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- BUY NOW ---------------- */
  const handleBuyNow = (product) => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    if (!userId || role !== "BUYER") {
      alert("Please login as a buyer to place an order");
      return;
    }

    setSelectedProduct(product);
  };

  /* ---------------- CONFIRM ORDER ---------------- */
  const confirmOrder = async (qty, address, contact) => {
    if (!address || !contact) {
      alert("Please fill all delivery details");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/orders/place",
        null,
        {
          params: {
            listingId: selectedProduct.listingId,
            consumerId: localStorage.getItem("userId"),
            quantity: qty,
            deliveryAddress: address,
            contactNumber: contact,
          },
        }
      );

      alert(
        `✅ Order Placed Successfully!\n\n` +
        `Order ID: ${res.data.orderId}\n` +
        `Total Amount: ₹${res.data.totalAmount.toFixed(2)}`
      );

      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order failed");
    }
  };

  /* ---------------- HELPERS ---------------- */
  const getQualityColor = (grade) => {
    switch (grade) {
      case "A": return "text-green-700 bg-green-100";
      case "B": return "text-yellow-700 bg-yellow-100";
      case "C": return "text-orange-700 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Marketplace...
      </div>
    );
  }

  const buttonClass =
    "w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg flex items-center justify-center space-x-2";

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-gray-600">
              Buy fresh, traceable products directly from farmers
            </p>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Scan size={18} />
            Scan QR
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No active listings
            </p>
          ) : (
            products.map((p) => (
              <motion.div
                key={p.listingId}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-green-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                    🌿
                  </div>

                  <h2 className="text-lg font-semibold">{p.cropName}</h2>
                  <p className="text-sm text-gray-600">
                    Farmer: {p.farmerId}
                  </p>

                  <p className="mt-2 text-xl font-bold text-green-700">
                    ₹{p.price} / kg
                  </p>

                  <p className="text-sm text-gray-500">
                    Available: {p.quantity} kg
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${getQualityColor(
                      p.qualityGrade
                    )}`}
                  >
                    Grade {p.qualityGrade}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    className={buttonClass}
                    onClick={() => handleBuyNow(p)}
                  >
                    <Wallet size={16} />
                    Buy Now
                  </button>

                  <button className={buttonClass}>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>

                  <button
                    className={buttonClass}
                    onClick={() => window.open(p.traceUrl, "_blank")}
                  >
                    <Sprout size={16} />
                    Trace Origin
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {showScanner && (
        <QRScanner onScan={() => setShowScanner(false)} onClose={() => setShowScanner(false)} />
      )}

      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={confirmOrder}
        />
      )}
    </div>
  );
};

export default Marketplace;
