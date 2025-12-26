import React from "react";
import {
  Leaf,
  Calendar,
  User,
  MapPin,
  Star,
  Weight,
  IndianRupee,
  PackageCheck,
  BadgeCheck,
} from "lucide-react";

const BatchCard = ({
  batch,
  onApprove,
  onReject,
  onTrace,
  readOnly = false,
}) => {
  if (!batch || batch.status === "DELETED" || batch.status === "EMPTY") {
    return null;
  }

  // ✅ SAFE IMAGE URL (handles spaces + missing image)
  const imageUrl = batch.cropImageUrl
    ? `http://localhost:8080${encodeURI(batch.cropImageUrl)}`
    : "/placeholder.png";

  return (
    <div className="p-5 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-all duration-200 overflow-hidden">

      {/* IMAGE SECTION */}
      <div className="relative mb-4 rounded-xl overflow-hidden aspect-[16/10]">
        <img
          src={imageUrl}
          alt={batch.cropType || "Crop"}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null; // 🛑 prevent infinite loop
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        {/* STATUS BADGE */}
        <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full shadow">
          {batch.status}
        </span>

        {/* CROP NAME OVER IMAGE */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
          <Leaf size={16} />
          {batch.cropType || "Unknown Crop"}
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="space-y-2 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <Weight size={16} className="text-green-600" />
          <strong>{batch.totalQuantity || 0} kg</strong>
        </p>

        <p className="flex items-center gap-2">
          <IndianRupee size={16} className="text-green-700" />
          <strong>
            {batch.price && batch.price > 0
              ? `₹${batch.price} / kg`
              : "Price not set"}
          </strong>
        </p>

        {batch.listingQuantity != null && (
          <p className="flex items-center gap-2">
            <PackageCheck size={16} className="text-teal-600" />
            Listing Qty: <strong>{batch.listingQuantity} kg</strong>
          </p>
        )}

        <p className="flex items-center gap-2">
          <User size={16} className="text-blue-600" />
          Farmer:{" "}
          <strong>{batch.farmerName || batch.farmerId || "N/A"}</strong>
        </p>

        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-red-500" />
          Harvest Date: <strong>{batch.harvestDate || "N/A"}</strong>
        </p>

        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-purple-600" />
          Location: <strong>{batch.location || "N/A"}</strong>
        </p>

        <p className="flex items-center gap-2">
          <Star size={16} className="text-yellow-500" />
          Quality Score:{" "}
          <strong>
            {batch.avgQualityScore != null
              ? `${Number(batch.avgQualityScore).toFixed(1)}%`
              : "Not Available"}
          </strong>
        </p>

        {batch.certification && (
          <p className="flex items-center gap-2">
            <BadgeCheck size={16} className="text-indigo-600" />
            Certification: <strong>{batch.certification}</strong>
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex gap-3 flex-wrap">
        {!readOnly && (
          <>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              onClick={() => onApprove && onApprove(batch.batchId)}
            >
              Approve
            </button>

            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              onClick={() => onReject && onReject(batch.batchId)}
            >
              Reject
            </button>
          </>
        )}

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => onTrace && onTrace(batch.batchId)}
        >
          Trace
        </button>
      </div>
    </div>
  );
};

export default BatchCard;
