import React from "react";
import { useNavigate } from "react-router-dom";
import BatchCard from "./components/Distributor/BatchCard";

const ParentComponent = ({ batches }) => {
  const navigate = useNavigate();

  const handleTrace = (batchId) => {
    // Navigate to the Traceability page
    navigate(`/trace/${batchId}`);
  };

  return (
    <div className="space-y-4">
      {batches.map((batch) => (
        <BatchCard
          key={batch.batchId}
          batch={batch}
          onApprove={(id) => console.log("Approve", id)}
          onReject={(id) => console.log("Reject", id)}
          onTrace={handleTrace} // Pass navigate handler
        />
      ))}
    </div>
  );
};

export default ParentComponent;
