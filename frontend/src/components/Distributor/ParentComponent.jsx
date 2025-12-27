import React from "react";
import { useNavigate } from "react-router-dom";
import BatchCard from "./components/Distributor/BatchCard";

const ParentComponent = ({ batches = [] }) => {
  const navigate = useNavigate();

  const handleTrace = (batchId) => {
    // Navigate to the Traceability page
    navigate(`/trace/${batchId}`);
  };

  return (
    <div className="space-y-6">
      {batches
        .filter(
          (batch) =>
            batch.status !== "DELETED" &&
            batch.status !== "EMPTY" &&
            !batch.blocked
        )
        .map((batch) => (
          <div
            key={batch.batchId}
            className="bg-white rounded-xl shadow border overflow-hidden"
          >
            {/* BATCH IMAGE (MERGED) */}
            {batch.cropImageUrl && (
              <img
                src={`http://localhost:8080${batch.cropImageUrl}`}
                alt={batch.cropType || "Crop"}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            )}

            {/* BATCH CARD */}
            <div className="p-4">
              <BatchCard
                batch={batch}
                onApprove={(id) => console.log("Approve", id)}
                onReject={(id) => console.log("Reject", id)}
                onTrace={handleTrace}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ParentComponent;