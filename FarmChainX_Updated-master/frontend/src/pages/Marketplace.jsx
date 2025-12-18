    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { motion } from 'framer-motion';
    import { Scan, Sprout, ShoppingCart, Wallet } from 'lucide-react';
    import QRScanner from '../components/common/QRScanner';
    import { useAuth } from '../context/AuthContext';

    const Marketplace = () => {

      const { user } = useAuth();
      const [showScanner, setShowScanner] = useState(false);
      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);

      const [showBuyModal, setShowBuyModal] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [buyWeight, setBuyWeight] = useState(1);


      const fetchProducts = async () => {
        try {
          const res = await axios.get("http://localhost:8080/api/listings/");
//           const res = axios.get("http://localhost:8080/api/batches/marketplace");
          const listings = Array.isArray(res.data) ? res.data : [];

          // ✅ Show only ACTIVE listings
          const productsWithPrice = listings.filter(listing =>
              listing.status === "ACTIVE" || listing.status === "APPROVED"
          )
          .map(listing => ({
            listingId: listing.listingId,
            batchId: listing.batchId || listing.batch?.id,   // ✅ REQUIRED
            farmerId: listing.farmerId,
            cropName: listing.cropName || listing.batch?.cropName || "Unknown Crop",
            price: listing.price || listing.batch?.price || 0,
            quantity: listing.quantity || listing.batch?.totalQuantity || 0,
            qualityGrade: listing.qualityGrade || listing.batch?.avgQualityScore || "Not Graded",
            traceUrl: listing.traceUrl || `/trace/${listing.batchId}`,
          }));

          setProducts(productsWithPrice);
        } catch (error) {
            console.error("Error loading listings:", error);
        } finally {
            setLoading(false);
        }
      };

      const handleAddToCart = async (product) => {
        if (!user) {
          alert("Please login to add items to cart");
          return;
        }

        try {
//           const cartPayload = {
//             id: `CART-${Date.now()}`,
//             buyerId: user.id,
//             batchId: product.batchId,
//             quantity: 1,
//             totalPrice: product.price
//           };
          const cartPayload = {
            id: crypto.randomUUID(),
            buyerId: user.id,
            batchId: product.batchId,
            quantity: 1,
            totalPrice: product.price,
            status: "CART"
          };



          await axios.post(
            "http://localhost:8080/api/orders/cart",
            cartPayload
          );

          alert("🛒 Added to cart");
        } catch (err) {
          console.error(err);
          alert("Failed to add to cart");
        }
      };


      const handleConfirmBuy = async () => {
          try {
//             const orderPayload = {
//               id: `ORD-${Date.now()}`,              // ✅ PK
//               buyerId: user.id,                     // ✅ matches backend
//               batchId: selectedProduct.batchId,     // ✅ MOST IMPORTANT
//               quantity: buyWeight,
//               totalPrice: buyWeight * selectedProduct.price
//             };

            const orderPayload = {
              id: crypto.randomUUID(),              // ✅ PK required
              buyerId: user.id,                     // ✅ BUY-xxxx
              batchId: selectedProduct.batchId,     // ✅ VERY IMPORTANT
              quantity: buyWeight,
              totalPrice: buyWeight * selectedProduct.price
            };


            await axios.post(
              "http://localhost:8080/api/orders/place",
              orderPayload
            );

            alert("✅ Order placed successfully");

            setShowBuyModal(false);
            setSelectedProduct(null);

//             refresh marketplace (quantity update)
            fetchProducts();

          } catch (error) {
            console.error("Order failed:", error);
            alert("❌ Failed to place order");
          }
      };

      const openBuyModal = (product) => {
          setSelectedProduct(product);
          setBuyWeight(1);
          setShowBuyModal(true);
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

      if (loading) return <div className="flex justify-center items-center h-screen text-gray-600 text-lg">Loading Marketplace...</div>;

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
                  <p className="text-gray-600 mt-2">Buy fresh, traceable products directly from farmers</p>
                </div>

                <button onClick={() => setShowScanner(true)} className="btn-primary mt-4 lg:mt-0 flex items-center space-x-2">
                  <Scan className="h-4 w-4" />
                  <span>Scan QR Code</span>
                </button>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full py-8">🚫 No active listings available.</p>
              ) : (
                products.map((product) => (
                  <motion.div key={product.listingId} className="card-hover bg-white rounded-xl shadow p-4 flex flex-col justify-between" whileHover={{ scale: 1.02 }}>
                    <div>
                      <div className="h-40 bg-green-100 flex items-center justify-center rounded-lg mb-3 text-4xl">🌿</div>

                      <h2 className="text-lg font-semibold capitalize">{product.cropName}</h2>
                      <p className="text-sm text-gray-600">Farmer: {product.farmerId}</p>

                      <p className="mt-2 text-xl font-bold text-green-700">
                        ₹{Number(product.price).toFixed(2)}
                        <span className="text-sm text-gray-600"> / kg</span>
                      </p>

                      <p className="text-sm text-gray-500">Available: {product.quantity} kg</p>
                      <p className={`text-xs mt-1 px-2 py-1 inline-block rounded ${getQualityColor(product.qualityGrade)}`}>
                        Grade: {product.qualityGrade || "Not Graded"}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col space-y-2">
                      <button
                        onClick={() => openBuyModal(product)}
                        className={buttonClass}
                      >
                        <Wallet className="h-4 w-4" />
                        <span>Buy Now</span>
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={buttonClass}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>

                      <button onClick={() => product.traceUrl ? window.open(product.traceUrl, "_blank") : alert("Traceability URL not available")} className={buttonClass}><Sprout className="h-4 w-4" /><span>Trace Origin</span></button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>


          {showBuyModal && selectedProduct && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-96">

                <h2 className="text-lg font-semibold mb-1">
                  Buy {selectedProduct.cropName}
                </h2>

                <p className="text-sm text-gray-600 mb-2">
                  Available: {selectedProduct.quantity} kg
                </p>

                <input
                  type="number"
                  min="1"
                  max={selectedProduct.quantity}
                  value={buyWeight}
                  onChange={(e) => setBuyWeight(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 mb-2"
                />

                {buyWeight > selectedProduct.quantity && (
                  <p className="text-red-500 text-xs mb-1">
                    Entered weight exceeds available quantity
                  </p>
                )}

                <p className="text-sm font-medium mb-4">
                  Total Price: ₹{(buyWeight * selectedProduct.price).toFixed(2)}
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="px-4 py-2 text-sm border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={buyWeight <= 0 || buyWeight > selectedProduct.quantity}
                    onClick={handleConfirmBuy}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded disabled:opacity-50"
                  >
                    Confirm Buy
                  </button>
                </div>
              </div>
            </div>
          )}

          {showScanner && <QRScanner onScan={() => setShowScanner(false)} onClose={() => setShowScanner(false)} />}
        </div>
      );
    };

    export default Marketplace;
