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
  return (
    <div className="p-5 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-all duration-200">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Leaf size={18} /> {batch.cropType || "Unknown Crop"}
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
          {batch.status}
        </span>
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
          Farmer: <strong>{batch.farmerName || batch.farmerId || "N/A"}</strong>
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
