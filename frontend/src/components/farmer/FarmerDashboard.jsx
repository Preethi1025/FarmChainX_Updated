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

  // ---------- PRICE FORMAT ----------
  const formatPrice = (p) => {
    if (!p) return "—";
    const n = Number(p);
    if (Number.isNaN(n)) return "—";
    return `₹${n.toFixed(2)} / kg`;
  };

  // ---------- FETCH CROPS ----------
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const cropRes = await axios.get(
          `http://localhost:8080/api/crops/farmer/${user.id}`
        );

        const listingRes = await axios.get(
          "http://localhost:8080/api/listings/"
        );

        const listedCropIds = new Set(
          Array.isArray(listingRes.data)
            ? listingRes.data.map((l) => l.cropId)
            : []
        );

        const merged = Array.isArray(cropRes.data)
          ? cropRes.data.map((crop) => ({
            ...crop,
            listed: listedCropIds.has(crop.cropId),
          }))
          : [];

        setCrops(merged);
      } catch (err) {
        console.error("Error loading crops:", err);
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Your Crops</h2>
        <p className="text-gray-500">Loading your crops…</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Your Crops</h2>

      {crops.length === 0 ? (
        <p className="text-gray-500">
          No crops yet — add a crop to get started.
        </p>
      ) : (
        crops.map((crop) => (
          <div
            key={crop.cropId}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition mb-6 flex overflow-hidden border"
          >
            {/* IMAGE */}
            <div className="relative w-48 h-36 flex-shrink-0">

              {crop.cropImageUrl ? (
                <img
                  src={getImageUrl(crop.cropImageUrl || "/placeholder.png")}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  alt={crop.cropName}
                  className="w-full h-full object-cover rounded-l-2xl"
                />

              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded-l-2xl">
                  No Image
                </div>
              )}

              {/* STATUS BADGE */}
              {crop.listed && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-[11px] px-3 py-1 rounded-full shadow">
                  Listed
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {crop.cropName}
                </h3>

                <p className="text-sm text-gray-500">
                  Batch ID: <span className="font-mono">{crop.batchId || "—"}</span>
                </p>

                <p className="text-lg font-semibold text-green-700 mt-1">
                  {formatPrice(crop.price)}
                </p>

                <div className="mt-2 inline-flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  ✅ Passed Quality Check
                </div>

                {crop.blocked && crop.rejectionReason && (
                  <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Rejected:</strong> {crop.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION */}
              <div className="mt-5 self-end">
                {crop.blocked ? (
                  <button
                    disabled
                    className="bg-red-400 text-white px-5 py-2 rounded-lg cursor-not-allowed"
                  >
                    ❌ Rejected
                  </button>
                ) : crop.listed ? (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg cursor-not-allowed"
                  >
                    ✔ Listed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCrop(crop);
                      setShowListingModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
                  >
                    List for Sale
                  </button>
                )}
              </div>
            </div>
          </div>
        ))

      )}

      {/* LISTING MODAL */}
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
