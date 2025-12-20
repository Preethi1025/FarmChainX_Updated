import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Scan,
  Sprout,
  ShoppingCart,
  Wallet,
  Search,
} from "lucide-react";
import QRScanner from "../components/common/QRScanner";
import { getImageUrl } from "../utils/image";

const Marketplace = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters & Sorting
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQty, setMinQty] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8080/api/listings/");
      const listings = Array.isArray(res.data) ? res.data : [];

      // 🔥 CLEAN + NORMALIZE DATA
      const validProducts = listings
        .filter((l) => l.status === "ACTIVE")
        .filter(
          (l) =>
            l.price > 0 &&
            l.quantity > 0 &&
            l.cropName &&
            l.batchId
        )
        .map((l) => ({
          ...l,
          price: Number(l.price),
          quantity: Number(l.quantity),
          traceUrl: l.traceUrl || `/trace/${l.batchId}`,
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

  // 🔎 FILTER + SORT
  const filteredProducts = products
    .filter((p) =>
      p.cropName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) => (minPrice ? p.price >= minPrice : true))
    .filter((p) => (maxPrice ? p.price <= maxPrice : true))
    .filter((p) => (minQty ? p.quantity >= minQty : true))
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              🌾 Marketplace
            </h1>
            <p className="text-gray-600 mt-1">
              Buy fresh, traceable produce directly from farmers
            </p>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="mt-4 lg:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow"
          >
            <Scan size={18} /> Scan QR
          </button>
        </motion.div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white rounded-2xl shadow p-4 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              🚫 No products match your filters
            </p>
          ) : (
            filteredProducts.map((p) => (
              <motion.div
                key={p.listingId}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-100"
              >
                {/* IMAGE */}
                <div className="relative h-48">
                  <img
                    src={getImageUrl(p.cropImageUrl)}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    alt={p.cropName}
                    className="h-full w-full object-cover"
                  />
                  {/* IMAGE FADE */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-4">

                  {/* NAME + PRICE */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 capitalize">
                        {p.cropName}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        📍 {p.location || "Unknown"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-green-700">
                        ₹{p.price}
                        <span className="text-sm font-medium text-gray-500"> /kg</span>
                      </p>
                      <span className="inline-block mt-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {p.quantity} kg available
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white py-2 rounded-xl flex items-center justify-center gap-2 font-medium">
                      <Wallet size={16} /> Buy Now
                    </button>

                    <button className="border border-green-600 text-green-700 hover:bg-green-50 py-2 rounded-xl flex items-center justify-center gap-2 font-medium">
                      <ShoppingCart size={16} /> Cart
                    </button>
                  </div>

                  {/* TRACE */}
                  <button
                    onClick={() => window.open(p.traceUrl, "_blank")}
                    className="w-full text-sm text-gray-500 hover:text-green-700 flex items-center justify-center gap-1 pt-1"
                  >
                    <Sprout size={14} /> Trace Origin
                  </button>
                </div>
              </motion.div>

            ))
          )}
        </div>
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
