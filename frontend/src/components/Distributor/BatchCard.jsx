import React from "react";
import {
  Leaf,
  MapPin,
  IndianRupee,
  BadgeCheck,
  CheckCircle,
  XCircle
} from "lucide-react";

const BatchCard = ({
  batch,
  onApprove,
  onReject,
  onTrace,
  readOnly = false
}) => {
  if (!batch || batch.status === "DELETED" || batch.status === "EMPTY") {
    return null;
  }
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden w-full max-w-[300px]">

      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={`http://localhost:8080${batch.cropImageUrl}`}
          alt={batch.cropType || "Crop"}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        {/* STATUS */}
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] px-3 py-1 rounded-full shadow">
          {batch.status}
        </span>

        {/* TITLE */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="flex items-center gap-1 text-sm font-semibold">
            <Leaf size={14} />
            {batch.cropType || "OTHER"}
          </p>
          <p className="text-xs opacity-90">
            {batch.totalQuantity || 0} kg available
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 space-y-2">

        {/* PRICE + LOCATION */}
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-green-700 font-semibold">
            <IndianRupee size={16} />
            {batch.price ?? "—"}
            <span className="text-xs text-gray-500">/kg</span>
          </p>

          <p className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            {batch.location || "—"}
          </p>
        </div>

        {/* QUALITY */}
        <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full w-fit">
          <BadgeCheck size={14} />
          Passed Quality Check
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2">

          {/* APPROVE / REJECT → ONLY FOR PENDING */}
          {!readOnly && onApprove && onReject && (
            <>
              <button
                onClick={() => onApprove(batch.batchId)}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-medium transition"
              >
                <CheckCircle size={16} />
                Approve
              </button>

              <button
                onClick={() => onReject(batch.batchId)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition"
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}
        </div>

        {/* TRACE */}
        <button
          onClick={() => onTrace(batch.batchId)}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition"
        >
          Trace Batch
        </button>
      </div>
    </div>
  );
};

export default BatchCard;
