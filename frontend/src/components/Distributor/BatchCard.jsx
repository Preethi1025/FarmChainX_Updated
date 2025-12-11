import React from "react";

const BatchCard = ({ batch, onApprove, onReject, readOnly }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <p><strong>Crop:</strong> {batch.cropType || "N/A"} — <strong>{batch.totalQuantity || 0} kg</strong></p>
      <p><strong>Farmer:</strong> {batch.farmerId || "N/A"}</p>
      <p><strong>Batch ID:</strong> {batch.batchId || "N/A"}</p>
      <p><strong>Status:</strong> <span className="text-yellow-600">{batch.status}</span></p>
      <p><strong>Harvest Date:</strong> {batch.harvestDate || "N/A"}</p>
      <p><strong>Location:</strong> {batch.location || "N/A"}</p>

      {!readOnly && (
        <div className="mt-3 flex gap-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => onApprove(batch.batchId)}>Approve</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onReject(batch.batchId)}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default BatchCard;
