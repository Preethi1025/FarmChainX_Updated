import React from "react";

const FavoriteFarmersModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-3">Favorite Farmers</h2>
        <p className="text-sm text-gray-500">
          Feature coming soon 🚧
        </p>

        <div className="text-right mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteFarmersModal;
