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

  // Helper: format price
  const formatPrice = (p) => {
    if (p === null || p === undefined || p === "") return "—";
    const n = Number(p);
    if (Number.isNaN(n)) return "—";
    return `₹${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} / kg`;
  };

  useEffect(() => {
    if (!user?.id) {
      setCrops([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch farmer crops
        const cropRes = await axios.get(
          `http://localhost:8080/api/crops/farmer/${user.id}`
        );

        // 2️⃣ Fetch listings to mark already listed crops
        const listingRes = await axios.get(
          `http://localhost:8080/api/listings`
        );

        const listedCropIds = new Set(
          Array.isArray(listingRes.data)
            ? listingRes.data.map((l) => l.cropId)
            : []
        );

        // 3️⃣ Merge listing + rejection info
        const updatedCrops = Array.isArray(cropRes.data)
          ? cropRes.data.map((crop) => ({
              ...crop,
              listed: listedCropIds.has(crop.cropId),
            }))
          : [];

        setCrops(updatedCrops);
      } catch (err) {
        console.error("Error loading crops:", err);
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
        <p className="text-sm text-gray-500">
          No crops yet — add a crop to get started.
        </p>
      ) : (
        crops.map((crop) => (
          <div
            key={crop.cropId}
            className="border p-4 rounded-md bg-gray-50 flex justify-between items-start mb-3"
          >
            {/* LEFT SIDE */}
            <div>
              <p className="font-semibold">{crop.cropName}</p>

              <p className="text-sm text-green-700">
                {formatPrice(crop.price)}
              </p>

              <small className="text-gray-500 block">
                Batch: {crop.batchId}
              </small>

              {/* ✅ SHOW REJECTION REASON */}
              {crop.blocked && crop.rejectionReason && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    <strong>Rejected Reason:</strong>{" "}
                    {crop.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE – ACTION BUTTON */}
            <div className="text-right">
              {crop.blocked ? (
                // ❌ Rejected
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  ❌ Rejected
                </button>
              ) : crop.listed ? (
                // ✔ Already listed
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  ✔ Listed
                </button>
              ) : (
                // 🟢 Can list
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
          </div>
        ))
      )}

      {/* ---------- LISTING MODAL ---------- */}
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
