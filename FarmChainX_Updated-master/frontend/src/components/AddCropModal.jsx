import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { X, Calendar, MapPin, Scale, Sprout, AlertCircle, Tag, Package } from 'lucide-react';

const AddCropModal = ({ onClose, farmerId, onCropAdded }) => {
  // Form state - matching backend Crop model INCLUDING price and quantity
  const [formData, setFormData] = useState({
    farmerId: farmerId || 1,
    cropName: '',
    cropType: '',
    variety: '',
    sowDate: '',
    expectedHarvestDate: '',
    location: '',
    estimatedYield: '',
    price: '',      // Required by database
    quantity: ''    // Required by database
  });

  const [loading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [generatedBatchId, setGeneratedBatchId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Crop type options
  const cropTypes = [
    'TOMATO', 'WHEAT', 'RICE', 'POTATO', 'CORN', 'CARROT',
    'LETTUCE', 'SPINACH', 'ONION', 'GARLIC', 'CUCUMBER',
    'PEPPER', 'EGGPLANT', 'BEANS', 'PEAS', 'OTHER'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (error) setError('');
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.cropName.trim()) {
      setError('Crop Name is required');
      return false;
    }

    if (!formData.cropType) {
      setError('Crop Type is required');
      return false;
    }

    if (!formData.sowDate) {
      setError('Sow Date is required');
      return false;
    }

    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }

    if (!formData.farmerId) {
      setError('Farmer ID is required');
      return false;
    }

    // Price validation (required by database)
    if (!formData.price || formData.price.trim() === '') {
      setError('Price is required');
      return false;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Price must be a valid positive number');
      return false;
    }

    // Quantity validation (required by database)
    if (!formData.quantity || formData.quantity.trim() === '') {
      setError('Quantity is required');
      return false;
    }

    const quantityNum = parseFloat(formData.quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Quantity must be a valid positive number');
      return false;
    }

    // Date validation
    const sowDate = new Date(formData.sowDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sowDate > today) {
      setError('Sow date cannot be in the future');
      return false;
    }

    if (formData.expectedHarvestDate) {
      const harvestDate = new Date(formData.expectedHarvestDate);
      if (harvestDate <= sowDate) {
        setError('Expected harvest date must be after sow date');
        return false;
      }
    }

    // Yield validation
    if (formData.estimatedYield) {
      const yieldNum = parseFloat(formData.estimatedYield);
      if (isNaN(yieldNum) || yieldNum <= 0) {
        setError('Estimated yield must be a positive number');
        return false;
      }
    }

    return true;
  };

  const handleAddCrop = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data for backend - EXACTLY matching Crop model
      const cropData = {
        farmerId: formData.farmerId,
        cropName: formData.cropName.trim(),
        cropType: formData.cropType,
        variety: formData.variety || null,
        sowDate: formData.sowDate,
        expectedHarvestDate: formData.expectedHarvestDate || null,
        location: formData.location.trim(),
        estimatedYield: formData.estimatedYield ? parseFloat(formData.estimatedYield) : null,
        price: formData.price || "0",        // Required by database
        quantity: formData.quantity || "0"   // Required by database
        // Note: status is NOT sent - backend sets default "PLANTED"
      };

      console.log('Sending crop data:', cropData);

      // Try main endpoint
      const response = await axios.post('http://localhost:8080/api/crops/add', cropData);

      const savedCrop = response.data;
      console.log('Saved crop response:', savedCrop);
      // Ensure QR Code exists for the saved crop
      if (!savedCrop.qrCodeUrl) {
        savedCrop.qrCodeUrl = `${window.location.origin}/trace/${savedCrop.batchId}`;
      }

      setGeneratedBatchId(savedCrop.batchId);
      setQrValue(savedCrop.qrCodeUrl);


      // Generate QR code with batch ID (NOT cropId)
      const batchId = savedCrop.batchId;
      if (!batchId) {
        throw new Error('Batch ID not returned from server');
      }

      const qrUrl = `${window.location.origin}/trace/${batchId}`;

      setGeneratedBatchId(batchId);
      setQrValue(qrUrl);
      setSuccess(true);
      const shouldList = window.confirm("Crop added successfully! Do you want to create a marketplace listing now?");

      if (onCropAdded) {
        onCropAdded(savedCrop, shouldList);
      }



    } catch (err) {
      console.error('Error adding crop:', err);

      let errorMessage = 'Error adding crop';

      if (err.response) {
        console.error('Server response:', err.response.data);

        // Handle different error formats
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }

        // Specific status code handling
        if (err.response.status === 400) {
          errorMessage = `Validation error: ${errorMessage}`;
        } else if (err.response.status === 404) {
          errorMessage = 'Farmer not found. Please check farmer ID';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please check backend logs';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please ensure backend is running on http://localhost:8080';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      farmerId: farmerId || 1,
      cropName: '',
      cropType: '',
      variety: '',
      sowDate: '',
      expectedHarvestDate: '',
      location: '',
      estimatedYield: '',
      price: '',
      quantity: ''
    });
    setQrValue('');
    setGeneratedBatchId('');
    setSuccess(false);
    setError('');
  };

  const handleClose = () => {
    if (success && onCropAdded) {
      onCropAdded();
    }
    onClose();
  };

  // Get today's date for max date restrictions
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Crop</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-semibold text-emerald-800 mb-1">Crop Added Successfully!</h3>
              <p className="text-sm text-emerald-700 mb-3">
                Your crop has been added to the system. Here's your batch ID:
              </p>
              <div className="bg-white border border-emerald-300 rounded-lg p-3 mb-4">
                <p className="font-mono font-bold text-lg text-emerald-800">{generatedBatchId}</p>
              </div>
            </div>

            {qrValue && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Scan to Track</h4>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <QRCodeSVG
                    value={qrValue}
                    size={180}
                    level="H"
                    includeMargin
                    className="mb-3"
                  />
                  <p className="text-xs text-gray-500 break-all text-center">
                    {qrValue}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Scan this QR code to view the complete traceability journey of this crop batch.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="btn-secondary flex-1 py-2"
              >
                Add Another Crop
              </button>
              <button
                onClick={handleClose}
                className="btn-primary flex-1 py-2"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Farmer ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farmer ID
                </label>
                <input
                  type="text"
                  value={formData.farmerId}
                  disabled
                  className="w-full border border-gray-300 bg-gray-50 text-gray-500 p-2.5 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Crop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  placeholder="e.g., Organic Cherry Tomatoes"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variety
                </label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  placeholder="e.g., Cherry, Heirloom, Basmati"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Sow Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    Sow Date <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="sowDate"
                  value={formData.sowDate}
                  onChange={handleChange}
                  max={today}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Expected Harvest Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    Expected Harvest Date
                  </div>
                </label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={formData.expectedHarvestDate}
                  onChange={handleChange}
                  min={formData.sowDate || today}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    Location <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Field A, North Plot, GPS Coordinates"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {/* Estimated Yield */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Scale className="h-4 w-4 mr-1 text-gray-500" />
                    Estimated Yield (kg)
                  </div>
                </label>
                <input
                  type="number"
                  name="estimatedYield"
                  value={formData.estimatedYield}
                  onChange={handleChange}
                  placeholder="e.g., 150.5"
                  step="0.1"
                  min="0"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Price and Quantity Section */}
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Market Information</h4>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-gray-500" />
                        Price (₹) <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g., 25.50"
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Per kg price</p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1 text-gray-500" />
                        Quantity (kg) <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 100"
                      step="0.1"
                      min="0.1"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Total available quantity</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="btn-secondary flex-1 py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCrop}
                disabled={loading}
                className="btn-primary flex-1 py-3 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Sprout className="h-4 w-4 mr-2" />
                    Add Crop
                  </>
                )}
              </button>
            </div>

            {/* Information Note */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <span className="font-medium">Note:</span> Price and quantity are required for market listing.
                You can update these values later when the crop is ready for sale.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddCropModal;