import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const AddCropModal = ({ onClose, farmerId = 1 }) => { // farmerId from logged-in user
  const [cropId, setCropId] = useState('');
  const [cropName, setCropName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [qrValue, setQrValue] = useState('');

  const handleGenerateQR = (generatedCropId) => {
    if (!generatedCropId) return;
    setQrValue(`${window.location.origin}/trace/${generatedCropId}`);
  };

  const handleAddCrop = async () => {
    if (!cropName || !price || !quantity) {
      alert('Please enter crop name, price, and quantity');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/crops/add', {
        farmerId, // pass farmer ID
        cropName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
      });

      const savedCrop = response.data;
      setCropId(savedCrop.cropId); // auto-generated from backend
      handleGenerateQR(savedCrop.cropId);

      alert('Crop added successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding crop');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          X
        </button>

        <h2 className="text-lg font-semibold text-gray-900">Add New Crop</h2>

        {/* Read-only farmerId field */}
        <input
          type="text"
          value={farmerId}
          disabled
          className="w-full border p-2 rounded bg-gray-200 cursor-not-allowed"
        />

        {/* Read-only cropId shown only after submission */}
        {cropId && (
          <input
            type="text"
            value={cropId}
            disabled
            className="w-full border p-2 rounded bg-gray-200 cursor-not-allowed"
          />
        )}

        <input
          type="text"
          placeholder="Crop Name"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Price ($/unit)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button onClick={handleAddCrop} className="btn-primary w-full mt-2">
          Add Crop
        </button>

        {qrValue && (
          <div className="mt-4 flex flex-col items-center">
            <QRCodeSVG value={qrValue} size={150} level="H" includeMargin />
            <p className="text-xs text-gray-500 mt-2 break-all">{qrValue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCropModal;
