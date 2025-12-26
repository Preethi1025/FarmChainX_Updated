// src/components/batches/BatchManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const { user } = useAuth();
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

  // Fetch batches based on user role
  const fetchBatches = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError("");
      let res;
      if (user.role === "FARMER") {
        res = await axios.get(`${apiBase}/farmer/${user.id}`);
      } else {
        res = await axios.get(`${apiBase}/pending`);
      }
      setBatches(res.data || []);
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
      console.error("Error fetching crops:", err);
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
    if (!newStatus) return alert("Please select a status first.");
    try {
      setLoadingRow(batchId);
      await axios.put(`${apiBase}/${batchId}/status`, {
        status: newStatus,
        userId: user.id,
      });
      setBatches((prev) =>
        prev.map((b) =>
          b.batchId === batchId ? { ...b, status: newStatus } : b
        )
      );
      alert("Batch status updated!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    } finally {
      setLoadingRow(null);
    }
  };

  // QUALITY
  const handleQualityChange = (batchId, field, value) =>
    setQualityUpdate((prev) => ({
      ...prev,
      [batchId]: { ...(prev[batchId] || {}), [field]: value },
    }));

  const applyQualityUpdate = async (batchId) => {
    const q = qualityUpdate[batchId] || {};
    if (!q.grade) return alert("Please select a quality grade.");
    try {
      setLoadingRow(batchId);
      await axios.put(`${apiBase}/${batchId}/status`, {
        status: "QUALITY_UPDATED",
        userId: user.id,
        qualityGrade: q.grade,
        confidence: q.confidence ? Number(q.confidence) : null,
      });
      setBatches((prev) =>
        prev.map((b) =>
          b.batchId === batchId
            ? { ...b, avgQualityScore: q.confidence ? Number(q.confidence) : b.avgQualityScore }
            : b
        )
      );
      alert("Quality marked (trace recorded).");
    } catch (err) {
      console.error("Error updating quality:", err);
      alert("Failed to update quality.");
    } finally {
      setLoadingRow(null);
    }
  };

  // SPLIT
  const handleSplitBatch = async (batchId) => {
    if (!window.confirm("Split this batch?")) return;
    const qtyStr = window.prompt("Enter quantity to split FROM this batch:");
    if (!qtyStr) return;
    const qty = Number(qtyStr);
    if (isNaN(qty) || qty <= 0) return alert("Enter a valid number.");
    try {
      setLoadingRow(batchId);
      const res = await axios.post(`${apiBase}/${batchId}/split`, {
        quantity: qty,
        userId: user.id,
      });
      if (res.data) setBatches((prev) => [...prev, res.data]);
      else fetchBatches();
      alert("Batch split successfully!");
    } catch (err) {
      console.error("Error splitting batch:", err);
      alert(err.response?.data?.message || "Failed to split batch.");
    } finally {
      setLoadingRow(null);
    }
  };

  // MERGE
  const handleMergeBatch = async (sourceBatchId) => {
    const targetBatchId = mergeTarget[sourceBatchId];
    if (!targetBatchId) return alert("Select target batch.");
    if (targetBatchId === sourceBatchId) return alert("Cannot merge into itself.");
    if (!window.confirm(`Merge ${sourceBatchId} into ${targetBatchId}?`)) return;

    try {
      setLoadingRow(sourceBatchId);
      const res = await axios.post(`${apiBase}/merge/${targetBatchId}`, {
        sourceBatchIds: [sourceBatchId],
        userId: user.id,
      });
      setBatches((prev) =>
        prev
          .filter((b) => b.batchId !== sourceBatchId)
          .map((b) => (b.batchId === targetBatchId ? res.data.find(r => r.batchId === targetBatchId) || b : b))
      );
      alert("Batch merged successfully!");
    } catch (err) {
      console.error("Error merging batches:", err);
      alert("Failed to merge batches.");
    } finally {
      setLoadingRow(null);
    }
  };

  // DISTRIBUTOR
  const approveBatch = async (batchId) => {
    if (!window.confirm("Approve this batch?")) return;
    try {
      setLoadingRow(batchId);
      const res = await axios.put(`${apiBase}/distributor/approve/${batchId}/${user.id}`);
      setBatches((prev) => prev.map((b) => (b.batchId === batchId ? { ...b, ...res.data } : b)));
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
      setBatches((prev) => prev.map((b) => (b.batchId === batchId ? { ...b, ...res.data } : b)));
      alert("Batch rejected.");
    } catch (err) {
      console.error("Error rejecting batch:", err);
      alert("Failed to reject.");
    } finally {
      setLoadingRow(null);
    }
  };

  // DAILY HARVEST
  const handleProcessDailyHarvest = async () => {
    if (!user?.id) return;
    if (!window.confirm("Create HARVESTED batch from READY_FOR_HARVEST?")) return;
    try {
      setProcessingHarvest(true);
      const res = await axios.post(`${apiBase}/process-daily-harvest/${user.id}`);
      if (res.data) setBatches((prev) => [...prev, res.data]);
      alert(`Harvest batch created: ${res.data?.batchId || "None"}`);
    } catch (err) {
      console.warn("process-daily-harvest failed:", err);
      alert("Failed to process harvest.");
    } finally {
      setProcessingHarvest(false);
    }
  };

  const getQrUrlForBatch = (batch) => batch.qrCodeUrl || `${window.location.origin}/trace/${batch.batchId}`;

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
                                {/* Crops + QR + Status + Quality + Split/Merge/Distributor */}
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
                                  {/* QR */}
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

                                  {/* Status Update */}
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

                                  {/* Quality */}
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

                                  {/* Split / Merge / Distributor */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">Split / Merge</p>
                                    <div className="flex flex-col gap-2">
                                      <button disabled={loadingRow === batch.batchId || user?.role !== "FARMER"} onClick={() => handleSplitBatch(batch.batchId)} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-60">
                                        <Scissors className="h-3 w-3" /> Split this batch
                                      </button>

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

                                  {/* Trace preview */}
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

// Trace preview component
const TracePreview = ({ batchId, apiBase }) => {
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/${batchId}/trace`);
        if (mounted) setTraces(res.data?.traces || []);
      } catch {
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
