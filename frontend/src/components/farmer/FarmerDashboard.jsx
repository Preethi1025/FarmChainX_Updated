import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ListingModal from "./ListingModal";
import { getImageUrl } from "../../utils/image";

const FarmerDashboard = () => {
  const { user } = useAuth();

  const [crops, setCrops] = useState([]);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: format price (UNCHANGED)
  const formatPrice = (p) => {
    if (p === null || p === undefined || p === "") return "—";
    const n = Number(p);
    if (Number.isNaN(n)) return "—";
    return `₹${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} / kg`;
  };

  // Fetch crops (UNCHANGED LOGIC)
  useEffect(() => {
    if (!user?.id) {
      setCrops([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const cropRes = await axios.get(
          `http://localhost:8080/api/crops/farmer/${user.id}`
        );

        const listingRes = await axios.get(
          `http://localhost:8080/api/listings`
        );

        const listedCropIds = new Set(
          Array.isArray(listingRes.data)
            ? listingRes.data.map((l) => l.cropId)
            : []
        );

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
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition mb-5 flex overflow-hidden border"
          >
            {/* IMAGE (ADDED) */}
            <div className="relative w-44 h-32 flex-shrink-0">
              {crop.cropImageUrl ? (
                <img
                  src={getImageUrl(crop.cropImageUrl)}
                  alt={crop.cropName}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Image
                </div>
              )}

              {crop.listed && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                  Listed
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-4 flex justify-between">
              {/* LEFT */}
              <div>
                <p className="font-semibold text-lg">{crop.cropName}</p>

                <p className="text-sm text-green-700">
                  {formatPrice(crop.price)}
                </p>

                <small className="text-gray-500 block">
                  Batch: {crop.batchId}
                </small>

                {/* QUALITY CHECK (ADDED) */}
                {crop.qualityCheckStatus === "PASSED" && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                    ✅ Passed Quality Check
                  </div>
                )}

                {/* REJECTION (UNCHANGED) */}
                {crop.blocked && crop.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">
                      <strong>Rejected Reason:</strong>{" "}
                      {crop.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT – ACTION BUTTON (UNCHANGED LOGIC) */}
              <div className="text-right self-center">
                {crop.blocked ? (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                    disabled
                  >
                    ❌ Rejected
                  </button>
                ) : crop.listed ? (
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                    disabled
                  >
                    ✔ Listed
                  </button>
                ) : (
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
          </div>
        ))
      )}

      {/* LISTING MODAL (UNCHANGED) */}
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
