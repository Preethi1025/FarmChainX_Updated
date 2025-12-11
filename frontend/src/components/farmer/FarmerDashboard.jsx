import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ListingModal from "./ListingModal";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: formats price (string or number) to "₹<n>.00 / kg"
  const formatPrice = (p) => {
    if (p === null || p === undefined || p === "") return "—";
    // if it's already a number or numeric string, format with 2 decimals
    const n = Number(p);
    if (Number.isNaN(n)) return "—";
    // locale formatting keeps commas for thousands
    return `₹${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / kg`;
  };

  useEffect(() => {
    if (!user?.id) {
      // wait until user is available
      setCrops([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all crops of farmer
        const cropRes = await axios.get(
          `http://localhost:8080/api/crops/farmer/${user.id}`
        );

        // Fetch all listings to check which crops are already listed
        const listingRes = await axios.get(`http://localhost:8080/api/listings`);

        const listedCropIds = new Set(
          Array.isArray(listingRes.data) ? listingRes.data.map((listing) => listing.cropId) : []
        );

        // Add "listed" flag to each crop
        const updatedCrops = Array.isArray(cropRes.data)
          ? cropRes.data.map((crop) => ({
              ...crop,
              listed: listedCropIds.has(crop.cropId),
            }))
          : [];

        setCrops(updatedCrops);
      } catch (error) {
        console.error("Error loading crops:", error);
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Crops</h2>
        <p className="text-sm text-gray-500">Loading your crops…</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Your Crops</h2>

      {crops.length === 0 ? (
        <p className="text-sm text-gray-500">No crops yet — add a crop to get started.</p>
      ) : (
        crops.map((crop) => (
          <div
            key={crop.cropId}
            className="border p-4 rounded-md bg-gray-50 flex justify-between items-center mb-3"
          >
            <div>
              <p className="font-semibold">{crop.cropName}</p>

              <p className="text-sm text-green-700">
                {formatPrice(crop.price)}
              </p>

              <small className="text-gray-500">Batch: {crop.batchId}</small>
            </div>

            {/* ---------- BUTTON CONDITIONS ---------- */}

            {crop.blocked ? (
              // 1️⃣ If distributor rejected crop → cannot list
              <button
                className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                ❌ Rejected — Cannot List
              </button>
            ) : crop.listed ? (
              // 2️⃣ Already listed
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                ✔ Listed
              </button>
            ) : (
              // 3️⃣ Normal crop → list for sale
              <button
                onClick={() => {
                  setSelectedCrop(crop);
                  setShowListingModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                List for Sale
              </button>
            )}
          </div>
        ))
      )}

      {/* ---------- Listing Modal ---------- */}
      {showListingModal && selectedCrop && (
        <ListingModal
          crop={selectedCrop}
          onClose={() => setShowListingModal(false)}
          onSuccess={(listing) => {
            setCrops((prev) =>
              prev.map((c) =>
                c.cropId === listing.cropId ? { ...c, listed: true } : c
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default FarmerDashboard;
