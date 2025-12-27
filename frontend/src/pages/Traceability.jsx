import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { CheckCircle, Clock, MapPin, User, Leaf, PackageSearch } from 'lucide-react';

const Traceability = () => {
  const { batchId } = useParams();
  const [trace, setTrace] = useState([]);
  const [farmerId, setFarmerId] = useState(null);
  const [cropName, setCropName] = useState(null);
  const [distributorId, setDistributorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        const res = await API.get(`/batches/${batchId}/trace`);
        setFarmerId(res.data.farmerId);
        setCropName(res.data.cropType || "Not Available");
        setDistributorId(res.data.distributorId || "Not Assigned");
        setTrace(res.data.traces || []);
      } catch (e) {
        console.error("Error fetching trace:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrace();
  }, [batchId]);

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(",", " ·");
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "planted": return Leaf;
      case "growing": return Clock;
      case "ready_for_harvest": return PackageSearch;
      case "harvested": return CheckCircle;
      case "listed": return Clock;
      case "sold": return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "planted": return "bg-green-100 text-green-700";
      case "growing": return "bg-blue-100 text-blue-700";
      case "ready_for_harvest": return "bg-yellow-100 text-yellow-700";
      case "harvested": return "bg-green-200 text-green-800";
      case "listed": return "bg-purple-100 text-purple-700";
      case "sold": return "bg-gray-200 text-gray-700";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-2xl p-6 shadow-lg mb-8">
          <h1 className="text-3xl font-bold">Batch Traceability</h1>
          <p className="text-sm opacity-80 mt-1 tracking-wide">
            Batch ID: <span className="font-semibold">{batchId}</span>
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {/* Farmer */}
          <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4 border border-gray-200">
            <div className="p-3 bg-green-100 rounded-full">
              <User className="text-green-700" size={28} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Farmer ID</p>
              <p className="text-lg font-semibold">{farmerId}</p>
            </div>
          </div>

          {/* Crop */}
          <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4 border border-gray-200">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Leaf className="text-yellow-700" size={28} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Crop Type</p>
              <p className="text-lg font-semibold">{cropName}</p>
            </div>
          </div>

          {/* Distributor */}
          <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4 border border-gray-200">
            <div className="p-3 bg-purple-100 rounded-full">
              <PackageSearch className="text-purple-700" size={28} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Distributor ID</p>
              <p className="text-lg font-semibold">{distributorId}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative border-l-4 border-green-300 ml-6">
          {trace.map((step, i) => {
            const Icon = getStatusIcon(step.status);
            return (
              <div key={i} className="mb-10 ml-6 relative">
                <div className={`absolute -left-9 top-0 p-3 rounded-full shadow ${getStatusColor(step.status)}`}>
                  <Icon size={20} />
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold capitalize text-gray-800">
                      {step.status.replaceAll('_', ' ')}
                    </h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDateTime(step.timestamp)}
                    </span>
                  </div>

                  {step.changedBy && (
                    <p className="text-sm text-gray-600 mt-2">
                      <User className="inline h-4 w-4 mr-1 text-gray-400" />
                      Updated by: {step.changedBy}
                    </p>
                  )}

                  {step.location && (
                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {step.location}
                    </p>
                  )}

                  {step.remarks && (
                    <p className="text-sm text-gray-600 mt-2">{step.remarks}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Traceability;