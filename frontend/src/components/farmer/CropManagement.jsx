import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const AddCropModal = ({ show, onClose }) => {
  const [batchId, setBatchId] = useState("");
  const [cropType, setCropType] = useState("");
  const [sowDate, setSowDate] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [location, setLocation] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/crops/all");
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  const handleGenerateQR = () => {
    if (!batchId) return;
    setQrValue(`${window.location.origin}/trace/${batchId}`);
  };

  const handleAddCrop = async () => {
    try {
      await axios.post("http://localhost:8080/api/crops/add", {
        batchId,
        cropType,
        sowDate,
        expectedHarvestDate,
        location,
        farmerId: "test123",
      });
      alert("Crop added successfully!");
      setBatchId(""); setCropType(""); setSowDate(""); setExpectedHarvestDate(""); setLocation(""); setQrValue("");
      fetchCrops(); // Refresh crop list
      onClose();
    } catch (err) {
      console.error("Error adding crop:", err);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">X</button>
        <h2 className="text-lg font-semibold text-gray-900">Add New Crop</h2>

        <input type="text" placeholder="Batch ID" className="w-full border p-2 rounded" value={batchId} onChange={e => setBatchId(e.target.value)} />
        <input type="text" placeholder="Crop Type" className="w-full border p-2 rounded" value={cropType} onChange={e => setCropType(e.target.value)} />
        <input type="date" placeholder="Sow Date" className="w-full border p-2 rounded" value={sowDate} onChange={e => setSowDate(e.target.value)} />
        <input type="date" placeholder="Expected Harvest Date" className="w-full border p-2 rounded" value={expectedHarvestDate} onChange={e => setExpectedHarvestDate(e.target.value)} />
        <input type="text" placeholder="Location" className="w-full border p-2 rounded" value={location} onChange={e => setLocation(e.target.value)} />

        <div className="flex gap-2 mt-2">
          <button onClick={handleGenerateQR} className="btn-secondary flex-1">Generate QR</button>
          <button onClick={handleAddCrop} className="btn-primary flex-1">Add Crop</button>
        </div>

        {qrValue && (
          <div className="mt-4 flex flex-col items-center">
            <QRCodeSVG value={qrValue} size={150} level="H" includeMargin />
            <p className="text-xs text-gray-500 mt-2 break-all">{qrValue}</p>
          </div>
        )}

        {/* List of Crops */}
        {crops.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Your Crops:</h3>
            <ul className="space-y-1 max-h-48 overflow-y-auto">
              {crops.map((crop) => (
                <li key={crop.batchId} className="border rounded p-2">
                  <strong>{crop.cropType}</strong> - {crop.status || "Pending"} (Batch: {crop.batchId})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCropModal;
