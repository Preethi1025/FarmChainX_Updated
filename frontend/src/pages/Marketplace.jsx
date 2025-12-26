import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Scan,
  Sprout,
  ShoppingCart,
  Wallet,
  X,
  Search,
} from "lucide-react";
import QRScanner from "../components/common/QRScanner";
import { getImageUrl } from "../utils/image";
import { useLocation } from "react-router-dom";

/* ---------------- CHECKOUT MODAL ---------------- */
const CheckoutModal = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const pricePerKg = product.priceAtCart || product.price || 0;
  const totalAmount = quantity * Number(pricePerKg);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-3">
          <p><b>Crop:</b> {product.cropName}</p>
          <p><b>Price:</b> ₹{pricePerKg} / kg</p>

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
            <p className="font-semibold">Total Amount: ₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
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
  const location = useLocation();

  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCartModal, setShowCartModal] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/listings/");
      const listings = Array.isArray(res.data) ? res.data : [];

      const validProducts = listings
        .filter((l) => l.status === "ACTIVE" || l.status === "APPROVED")
        .filter((l) => l.price > 0 && l.quantity > 0 && l.cropName && l.batchId)
        .map((l) => ({
          listingId: l.listingId,
          batchId: l.batchId,
          cropName: l.cropName || "Unknown Crop",
          farmerId: l.farmerId,
          price: Number(l.price) || 0,
          quantity: Number(l.quantity) || 0,
          qualityGrade: l.qualityGrade || "Not Graded",
          traceUrl: l.traceUrl || `/trace/${l.batchId}`,
          location: l.location || "Unknown",
          cropImageUrl: l.cropImageUrl || null,
        }));

      setProducts(validProducts);
    } catch (err) {
      console.error("Marketplace load failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.showCart) setShowCartModal(true);
  }, [location.state]);

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

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.listingId === product.listingId);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.listingId === product.listingId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1, priceAtCart: product.price }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.cropName} added to cart!`);
  };

  /* ---------------- CONFIRM ORDER ---------------- */
  /* ---------------- CONFIRM ORDER ---------------- */
const confirmOrder = async (qty, address, contact) => {
  const consumerId = localStorage.getItem("buyerId") || localStorage.getItem("userId");
  console.log(consumerId); // Ensure this is the buyer's ID
  if (!consumerId) {
    alert("Please login as a buyer to place an order");
    return;
  }

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
          consumerId: consumerId,   // send correct consumerId
          quantity: qty,
          deliveryAddress: address,
          contactNumber: contact,
        },
      }
    );

    alert(
      `✅ Order Placed Successfully!\nOrder ID: ${res.data.orderId}\nTotal Amount: ₹${res.data.totalAmount.toFixed(2)}`
    );

    setSelectedProduct(null);
    fetchProducts();
  } catch (err) {
    console.error("Order failed:", err);
    alert("Order failed");
  }
};


  /* ---------------- FILTER + SORT ---------------- */
  const filteredProducts = products
    .filter((p) => p.cropName.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (minPrice ? p.price >= minPrice : true))
    .filter((p) => (maxPrice ? p.price <= maxPrice : true))
    .sort((a, b) => {
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      if (sortBy === "QTY_ASC") return a.quantity - b.quantity;
      if (sortBy === "QTY_DESC") return b.quantity - a.quantity;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading Marketplace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">🌾 Marketplace</h1>
            <p className="text-gray-600">Buy fresh, traceable products directly from farmers</p>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="btn-primary flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <Scan size={18} /> Scan QR
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full border rounded-xl px-3 py-2"
            />
          </div>
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="">Sort</option>
            <option value="PRICE_ASC">Price ↑</option>
            <option value="PRICE_DESC">Price ↓</option>
            <option value="QTY_ASC">Qty ↑</option>
            <option value="QTY_DESC">Qty ↓</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No active listings</p>
          ) : (
            filteredProducts.map((p) => (
              <motion.div
                key={p.listingId}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
              >
                {/* IMAGE */}
                <div className="relative h-40 w-full mb-3">
                  <img
                    src={getImageUrl(p.cropImageUrl)}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    alt={p.cropName}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">{p.cropName}</h2>
                  <p className="text-sm text-gray-600">Farmer: {p.farmerId}</p>
                  <p className="mt-1 text-xl font-bold text-green-700">₹{p.price} / kg</p>
                  <p className="text-sm text-gray-500">Available: {p.quantity} kg</p>
                  <span className="inline-block mt-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    Grade {p.qualityGrade}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg flex items-center justify-center gap-2"
                    onClick={() => handleBuyNow(p)}
                  >
                    <Wallet size={16} /> Buy Now
                  </button>
                  <button
                    className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart(p)}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button
                    className="w-full text-sm text-gray-500 hover:text-green-700 flex items-center justify-center gap-1 pt-1"
                    onClick={() => window.open(p.traceUrl, "_blank")}
                  >
                    <Sprout size={14} /> Trace Origin
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {showScanner && <QRScanner onScan={() => setShowScanner(false)} onClose={() => setShowScanner(false)} />}

      {selectedProduct && <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onConfirm={confirmOrder} />}

      {/* CART MODAL */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Cart 🧺</h2>
              <button onClick={() => setShowCartModal(false)}><X /></button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between border rounded-lg p-3 text-sm">
                    <span>{item.cropName}</span>
                    <span>{item.quantity} × ₹{item.priceAtCart || item.price}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button onClick={() => setShowCartModal(false)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
