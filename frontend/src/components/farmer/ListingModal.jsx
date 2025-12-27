import { useState } from "react";
import axios from "axios";

export default function ListingModal({ crop, onClose, onSuccess }) {
  const [price, setPrice] = useState(crop?.price || "");
  const [quantity, setQuantity] = useState(crop?.quantity || "");

  const handleSubmit = async () => {
    if (!price || !quantity) {
      alert("Price and Quantity are required!");
      return;
    }

    const payload = {
      cropId: crop.cropId,
      farmerId: crop.farmerId,
      batchId: crop.batchId,
      price: Number(price),
      quantity: Number(quantity),
      status: "PENDING", // ✅ Do not auto-activate
    };

    try {
      await axios.post("http://localhost:8080/api/listings/create", payload);
      alert("Listing submitted for distributor approval!");

      if (onSuccess) onSuccess({ cropId: crop.cropId });
      onClose();
    } catch (err) {
      console.error("Error Creating Listing:", err.response?.data || err);
      alert("Failed to create listing.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-96 p-6 rounded-lg shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          List Crop for Sale: {crop.cropName}
        </h2>

        <label className="block text-sm font-medium mb-2">Price (₹)</label>
        <input
          type="number"
          className="border p-2 rounded w-full mb-4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label className="block text-sm font-medium mb-2">Quantity (kg)</label>
        <input
          type="number"
          className="border p-2 rounded w-full mb-4"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}