// src/components/batches/BatchManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../api";


import { QRCodeSVG } from "qrcode.react";
import {
  ChevronDown,
  ChevronRight,
  RefreshCcw,
  AlertCircle,
  QrCode,
  Scissors,
  Link2,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/**
 * BatchManagement (Option 3: Combined UI)
 *
 * - Role-aware behaviour:
 *   - FARMER: view own batches, split, update status, send quality update (via status), process harvest
 *   - DISTRIBUTOR: view pending batches, approve/reject, merge batches
 *   - CONSUMER: read-only / view pending (market) batches
 *
 * Important: This frontend matches your current controller endpoints:
 * - GET /api/batches/farmer/{farmerId}
 * - GET /api/batches/{batchId}/crops
 * - PUT /api/batches/{batchId}/status   { status, userId, ...optional }
 * - POST /api/batches/{batchId}/split   { quantity, userId }
 * - POST /api/batches/merge/{targetBatchId} { sourceBatchIds, userId }
 * - PUT /api/batches/distributor/approve/{batchId}/{distributorId}
 * - PUT /api/batches/distributor/reject/{batchId}/{distributorId}
 * - GET /api/batches/pending
 * - GET /api/batches/{batchId}/trace
 *
 * If you add a dedicated quality endpoint later, switch the quality update request to that endpoint.
 */

const STATUS_OPTIONS = [
  "PLANTED",
  "GROWING",
  "READY_FOR_HARVEST",
  "HARVESTED",
  "LISTED",
  "SOLD",
];

const QUALITY_OPTIONS = ["A", "B", "C"];

const BatchManagement = ({ onClose }) => {
  const { user } = useAuth(); // expects user.id and user.role
  const [batches, setBatches] = useState([]);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [batchCrops, setBatchCrops] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingRow, setLoadingRow] = useState(null);
  const [error, setError] = useState("");
  const [statusUpdate, setStatusUpdate] = useState({});
  const [qualityUpdate, setQualityUpdate] = useState({});
  const [mergeTarget, setMergeTarget] = useState({});
  const [processingHarvest, setProcessingHarvest] = useState(false);

  const apiBase = "http://localhost:8080/api/batches";

  // Choose which fetch to call depending on role
  const fetchBatches = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError("");
      let res;
      if (user.role === "FARMER") {
        res = await axios.get(`${apiBase}/farmer/${user.id}`);
        setBatches(res.data || []);
      } else if (user.role === "DISTRIBUTOR") {
        // distributor sees pending batches to approve
        res = await axios.get(`${apiBase}/pending`);
        setBatches(res.data || []);
      } else {
        // consumer or other roles: show pending marketplace (best effort)
        res = await axios.get(`${apiBase}/pending`);
        setBatches(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCropsForBatch = async (batchId) => {
    try {
      setLoadingRow(batchId);
      const res = await axios.get(`${apiBase}/${batchId}/crops`);
      setBatchCrops((prev) => ({ ...prev, [batchId]: res.data || [] }));
    } catch (err) {
      console.error("Error fetching crops for batch:", err);
      setError("Failed to load crops for this batch.");
    } finally {
      setLoadingRow(null);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [user]);

  const toggleExpand = (batchId) => {
    if (expandedBatchId === batchId) {
      setExpandedBatchId(null);
      return;
    }
    setExpandedBatchId(batchId);
    if (!batchCrops[batchId]) fetchCropsForBatch(batchId);
  };

  // STATUS
  const handleStatusChange = (batchId, newStatus) =>
    setStatusUpdate((prev) => ({ ...prev, [batchId]: newStatus }));

const applyStatusUpdate = async (batchId) => {
  const newStatus = statusUpdate[batchId];
  if (!newStatus) {
    alert("Please select a status first.");
    return;
  }

  try {
    setLoadingRow(batchId);
    await axios.put(`${apiBase}/${batchId}/status`, {
      status: newStatus,
      userId: user.id,
    });
    setBatches(prev =>
      prev.map(b =>
        b.batchId === batchId ? { ...b, status: newStatus } : b
      )
    );

    alert("Batch status updated!");
  } catch (err) {
    console.error("Error updating batch status:", err);
    alert("Failed to update status.");
  } finally {
    setLoadingRow(null);
  }
};

  // QUALITY: use status update workaround to avoid 404 (backend lacks dedicated /quality endpoint)
  const handleQualityChange = (batchId, field, value) =>
    setQualityUpdate((prev) => ({ ...prev, [batchId]: { ...(prev[batchId] || {}), [field]: value } }));

  const applyQualityUpdate = async (batchId) => {
    const q = qualityUpdate[batchId] || {};
    if (!q.grade) {
      alert("Please select a quality grade.");
      return;
    }
    try {
      setLoadingRow(batchId);
      // Send quality via the existing status endpoint as a safe workaround.
      // If you add a dedicated /quality endpoint later, replace this call.
      await axios.put(`${apiBase}/${batchId}/status`, {
        status: "QUALITY_UPDATED",
        userId: user.id,
        qualityGrade: q.grade,
        confidence: q.confidence ? Number(q.confidence) : null,
      });
      // update UI local approximation
      setBatches((prev) =>
        prev.map((b) =>
          b.batchId === batchId
            ? { ...b, avgQualityScore: q.confidence ? Number(q.confidence) : b.avgQualityScore }
            : b
        )
      );
      alert("Quality marked (trace recorded).");
    } catch (err) {
      console.error("Error updating batch quality:", err);
      alert("Failed to update quality.");
    } finally {
      setLoadingRow(null);
    }
  };

  // SPLIT: prompt for split quantity and send { quantity, userId }
  const handleSplitBatch = async (batchId) => {
    if (!window.confirm("This will split this batch into a new batch. Continue?")) return;
    // ask user for quantity to split
    const qtyStr = window.prompt("Enter quantity to split FROM this batch (numeric):");
    if (!qtyStr) return;
    const qty = Number(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      alert("Enter a valid positive number");
      return;
    }
    try {
      setLoadingRow(batchId);
      const res = await axios.post(`${apiBase}/${batchId}/split`, {
        quantity: qty,
        userId: user.id,
      });
      const newBatch = res.data;
      if (newBatch) {
        setBatches((prev) => [...prev, newBatch]);
        alert(`Batch split! New batch created: ${newBatch.batchId}`);
      } else {
        // backend may return 204 or similar
        alert("Split performed (no new batch returned). Refresh to see changes.");
        fetchBatches();
      }
    } catch (err) {
      console.error("Error splitting batch:", err);
      alert(err.response?.data?.message || "Failed to split batch. Check quantity and batch status.");
    } finally {
      setLoadingRow(null);
    }
  };

  // MERGE: use the controller endpoint POST /merge/{targetBatchId} with body { sourceBatchIds, userId }
const handleMergeBatch = async (sourceBatchId) => {
  const targetBatchId = mergeTarget[sourceBatchId];

  if (!targetBatchId) {
    alert("Select a target batch to merge into.");
    return;
  }

  if (targetBatchId === sourceBatchId) {
    alert("Source and target cannot be the same batch.");
    return;
  }

  if (!window.confirm(
    `All crops from ${sourceBatchId} will be moved into ${targetBatchId}. Continue?`
  )) return;

  try {
    setLoadingRow(sourceBatchId);

    const res = await API.post(
      `/batches/merge/${targetBatchId}`,
      {
        sourceBatchIds: [sourceBatchId],
        userId: user.id,
      }
    );

    // ✅ Filter out merged batch immediately from frontend state
    setBatches(prev =>
      prev
        .filter(b => b.batchId !== sourceBatchId) // remove the merged batch
        .map(b => b.batchId === targetBatchId ? res.data.find(r => r.batchId === targetBatchId) || b : b) // update target batch info
    );

    alert("Batch merged successfully!");
  } catch (err) {
    console.error("Error merging batches:", err);
    alert(
      err.response?.data?.error ||
      "Failed to merge batches. Ensure both batches exist and have same crop type."
    );
  } finally {
    setLoadingRow(null);
  }
};



  // Approve / Reject (distributor actions)
  const approveBatch = async (batchId) => {
    if (!window.confirm("Approve this batch?")) return;
    try {
      setLoadingRow(batchId);
      const res = await axios.put(`${apiBase}/distributor/approve/${batchId}/${user.id}`);
      const updated = res.data;
      setBatches((prev) => prev.map((b) => (b.batchId === batchId ? { ...b, ...updated } : b)));
      alert("Batch approved.");
    } catch (err) {
      console.error("Error approving batch:", err);
      alert("Failed to approve.");
    } finally {
      setLoadingRow(null);
    }
  };

  const rejectBatch = async (batchId) => {
    if (!window.confirm("Reject and block this batch?")) return;
    try {
      setLoadingRow(batchId);
      const res = await axios.put(`${apiBase}/distributor/reject/${batchId}/${user.id}`);
      const updated = res.data;
      setBatches((prev) => prev.map((b) => (b.batchId === batchId ? { ...b, ...updated } : b)));
      alert("Batch rejected and blocked.");
    } catch (err) {
      console.error("Error rejecting batch:", err);
      alert("Failed to reject.");
    } finally {
      setLoadingRow(null);
    }
  };

  // Process daily harvest (FARMER): your controller hasn't included an endpoint for this in the last paste.
  // We'll attempt to call it but handle 404 gracefully.
  const handleProcessDailyHarvest = async () => {
    if (!user?.id) return;
    if (!window.confirm("Create HARVESTED batch from crops READY_FOR_HARVEST?")) return;
    try {
      setProcessingHarvest(true);
      // Best-effort call — if your backend defines it, it will work. If not, we handle error.
      const res = await axios.post(`${apiBase}/process-daily-harvest/${user.id}`);
      if (!res.data) {
        alert("No harvest created or endpoint returned no data.");
      } else {
        setBatches((prev) => [...prev, res.data]);
        alert(`Harvest batch created: ${res.data.batchId}`);
      }
    } catch (err) {
      console.warn("process-daily-harvest not available or failed:", err);
      alert("Process daily harvest failed (endpoint may not be implemented).");
    } finally {
      setProcessingHarvest(false);
    }
  };

  const getQrUrlForBatch = (batch) => {
    if (batch.qrCodeUrl) return batch.qrCodeUrl;
    return `${window.location.origin}/trace/${batch.batchId}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Batch Management</h2>
            <p className="text-xs text-slate-500">Manage batches — split, merge, status, trace</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleProcessDailyHarvest}
              disabled={processingHarvest || user?.role !== "FARMER"}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
            >
              {processingHarvest && <span className="h-3 w-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
              <span>Process Today's Harvest</span>
            </button>

            <button onClick={fetchBatches} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border border-slate-200 hover:bg-slate-50">
              <RefreshCcw className="h-3 w-3" /> Refresh
            </button>

            <button onClick={onClose} className="ml-2 text-xs px-3 py-1.5 rounded-full bg-slate-800 text-white">Close</button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-3 mb-1 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-slate-500 text-sm">
              <div className="h-6 w-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mb-3" />
              Loading batches...
            </div>
          ) : batches.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No batches yet.</div>
          ) : (
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">Batch</th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">Crop</th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">Qty</th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">Status</th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">Quality</th>
                    <th className="px-3 py-2 text-right text-[11px] font-semibold text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => {
                    const isExpanded = expandedBatchId === batch.batchId;
                    const crops = batchCrops[batch.batchId] || [];
                    return (
                      <React.Fragment key={batch.batchId}>
                        <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                          <td className="px-3 py-2 align-top">
                            <button onClick={() => toggleExpand(batch.batchId)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-800">
                              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              <span className="font-mono">{batch.batchId}</span>
                            </button>
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-slate-700">{batch.cropType || "-"}</td>
                          <td className="px-3 py-2 align-top text-xs text-slate-700">{batch.totalQuantity != null ? `${batch.totalQuantity} kg` : "-"}</td>
                          <td className="px-3 py-2 align-top text-xs">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide bg-emerald-50 border-emerald-200 text-emerald-700">
                              {batch.status || "PLANTED"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-slate-700">
                            {batch.avgQualityScore != null ? <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{Number(batch.avgQualityScore).toFixed(1)}%</span> : "-"}
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-right">
                            <button onClick={() => toggleExpand(batch.batchId)} className="inline-flex items-center text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-100">Details</button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-slate-50/60 border-b border-slate-100">
                            <td colSpan={6} className="px-4 py-3 text-xs text-slate-700">
                              <div className="grid md:grid-cols-[2fr_1.3fr] gap-4">
                                <div>
                                  <p className="text-[11px] font-semibold text-slate-500 mb-2">Crops in this batch</p>
                                  {loadingRow === batch.batchId ? (
                                    <div className="py-4 text-slate-500 text-[11px] flex items-center gap-2">
                                      <span className="h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                      Loading crops...
                                    </div>
                                  ) : crops.length === 0 ? (
                                    <p className="py-3 text-[11px] text-slate-500">No crops linked to this batch yet.</p>
                                  ) : (
                                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                      {crops.map((crop) => (
                                        <div key={crop.cropId} className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-2 py-1.5">
                                          <div>
                                            <p className="text-[11px] font-medium text-slate-800">{crop.cropName}</p>
                                            <p className="text-[10px] text-slate-500">Qty: {crop.quantity} | Status: {crop.status}</p>
                                          </div>
                                          <div className="text-[10px] text-slate-400">#{crop.cropId}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <div className="bg-white rounded-lg border border-slate-200 p-2 flex gap-2">
                                    <div className="flex items-center justify-center bg-slate-50 rounded-md p-2">
                                      <QRCodeSVG value={getQrUrlForBatch(batch)} size={72} level="H" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1"><QrCode className="h-3 w-3" /> Traceability QR</p>
                                      <p className="text-[10px] text-slate-500 break-all max-h-10 overflow-hidden">{getQrUrlForBatch(batch)}</p>
                                      <a href={getQrUrlForBatch(batch)} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[10px] text-primary-600 hover:underline">Open trace page</a>
                                    </div>
                                  </div>

                                  {/* Status update */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">Update Status</p>
                                    <div className="flex items-center gap-2">
                                      <select className="flex-1 border border-slate-200 rounded-md text-[11px] px-2 py-1" value={statusUpdate[batch.batchId] || batch.status || ""} onChange={(e) => handleStatusChange(batch.batchId, e.target.value)}>
                                        <option value="">Select status</option>
                                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                      </select>
                                      <button disabled={loadingRow === batch.batchId} onClick={() => applyStatusUpdate(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60">
                                        <CheckCircle2 className="h-3 w-3" /> Save
                                      </button>
                                    </div>
                                  </div>

                                  {/* Quality update (uses status endpoint) */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">Quality Grade</p>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <select className="border border-slate-200 rounded-md text-[11px] px-2 py-1" value={(qualityUpdate[batch.batchId] && qualityUpdate[batch.batchId].grade) || ""} onChange={(e) => handleQualityChange(batch.batchId, "grade", e.target.value)}>
                                        <option value="">Select grade</option>
                                        {QUALITY_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                                      </select>
                                      <input type="number" placeholder="Confidence %" className="flex-1 border border-slate-200 rounded-md text-[11px] px-2 py-1" value={(qualityUpdate[batch.batchId] && qualityUpdate[batch.batchId].confidence) || ""} onChange={(e) => handleQualityChange(batch.batchId, "confidence", e.target.value)} />
                                      <button disabled={loadingRow === batch.batchId} onClick={() => applyQualityUpdate(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60">
                                        <Star className="h-3 w-3" /> Save
                                      </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400">Grade is A/B/C, confidence optional.</p>
                                  </div>

                                  {/* Split / Merge / Distributor actions */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">Split / Merge</p>
                                    <div className="flex flex-col gap-2">
                                      {/* Split (farmers only) */}
                                      <button disabled={loadingRow === batch.batchId || user?.role !== "FARMER"} onClick={() => handleSplitBatch(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-60">
                                        <Scissors className="h-3 w-3" /> Split this batch
                                      </button>

                                      {/* Merge (distributor or farmer) */}
                                      <div className="flex items-center gap-2">
                                        <select className="flex-1 border border-slate-200 rounded-md text-[11px] px-2 py-1" value={mergeTarget[batch.batchId] || ""} onChange={(e) => setMergeTarget((p) => ({ ...p, [batch.batchId]: e.target.value }))}>
                                          <option value="">Merge into other batch...</option>
                                          {batches.filter((b) => b.batchId !== batch.batchId && b.cropType === batch.cropType).map((b) => <option key={b.batchId} value={b.batchId}>{b.batchId} ({b.status})</option>)}
                                        </select>
                                        <button disabled={loadingRow === batch.batchId} onClick={() => handleMergeBatch(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700">
                                          <Link2 className="h-3 w-3" /> Merge
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-slate-400">You can only merge batches of the same crop type.</p>

                                      {/* Distributor actions */}
                                      {user?.role === "DISTRIBUTOR" && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <button disabled={loadingRow === batch.batchId} onClick={() => approveBatch(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                                            <CheckCircle2 className="h-3 w-3" /> Approve
                                          </button>
                                          <button disabled={loadingRow === batch.batchId} onClick={() => rejectBatch(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200">
                                            <XCircle className="h-3 w-3" /> Reject
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Trace viewer (small) */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">Recent Trace</p>
                                    <TracePreview batchId={batch.batchId} apiBase={apiBase} />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Small trace preview component that loads traces for a batch
const TracePreview = ({ batchId, apiBase }) => {
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/${batchId}/trace`);
        if (mounted) {
          // controller returns a wrapper object; traces at res.data.traces
          setTraces(res.data?.traces || []);
        }
      } catch (err) {
        // don't spam errors in small preview
        setTraces([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [batchId, apiBase]);

  if (loading) return <div className="text-[11px] text-slate-500">Loading trace...</div>;
  if (!traces || traces.length === 0) return <div className="text-[11px] text-slate-400">No trace events yet.</div>;

  return (
    <div className="space-y-1 max-h-28 overflow-y-auto">
      {traces.slice(0, 6).map((t, i) => (
        <div key={i} className="text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="font-medium">{t.status}</div>
            <div className="text-[10px] text-slate-400">{new Date(t.timestamp).toLocaleString()}</div>
          </div>
          <div className="text-[10px] text-slate-500">By: {t.changedBy || t.farmerId || "system"}</div>
        </div>
      ))}
    </div>
  );
};

export default BatchManagement;
