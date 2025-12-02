import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ListingModal from "./ListingModal";

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState([]);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cropRes = await axios.get(`http://localhost:8080/api/crops/farmer/${user.id}`);
      const listingRes = await axios.get(`http://localhost:8080/api/listings`);

      const listedCropIds = new Set(listingRes.data.map(listing => listing.cropId));

      const updatedCrops = cropRes.data.map(crop => ({
        ...crop,
        listed: listedCropIds.has(crop.cropId)
      }));

      setCrops(updatedCrops);
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Your Crops</h2>

      {crops.map(crop => (
        <div key={crop.cropId} className="border p-4 rounded-md bg-gray-50 flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold">{crop.cropName}</p>
            <small className="text-gray-500">Batch: {crop.batchId}</small>
          </div>

          {crop.listed ? (
            <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
              ✔ Listed
            </button>
          ) : (
            <button
              onClick={() => { setSelectedCrop(crop); setShowListingModal(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              List for Sale
            </button>
          )}
        </div>
      ))}

      {showListingModal && selectedCrop && (
        <ListingModal
          crop={selectedCrop}
          onClose={() => setShowListingModal(false)}
          onSuccess={(listing) => {
            setCrops(prev => prev.map(c =>
              c.cropId === listing.cropId ? { ...c, listed: true } : c
            ));
          }}
        />
      )}
    </div>
  );
};

export default FarmerDashboard;
