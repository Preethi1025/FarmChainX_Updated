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

  // ---- Helpers ----
  const apiBase = "http://localhost:8080";

  const fetchBatches = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${apiBase}/api/batches/farmer/${user.id}`
      );
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
      const res = await axios.get(`${apiBase}/api/batches/${batchId}/crops`);
      setBatchCrops((prev) => ({
        ...prev,
        [batchId]: res.data || [],
      }));
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
    if (!batchCrops[batchId]) {
      fetchCropsForBatch(batchId);
    }
  };

  const handleStatusChange = (batchId, newStatus) => {
    setStatusUpdate((prev) => ({
      ...prev,
      [batchId]: newStatus,
    }));
  };

  const handleQualityChange = (batchId, field, value) => {
    setQualityUpdate((prev) => ({
      ...prev,
      [batchId]: {
        ...(prev[batchId] || {}),
        [field]: value,
      },
    }));
  };

  const handleMergeTargetChange = (sourceBatchId, targetBatchId) => {
    setMergeTarget((prev) => ({
      ...prev,
      [sourceBatchId]: targetBatchId,
    }));
  };

  // ---- Actions ----

const applyStatusUpdate = async (batchId) => {
  const newStatus = statusUpdate[batchId];
  if (!newStatus) {
    alert("Please select a status first.");
    return;
  }

  try {
    setLoadingRow(batchId);
    await axios.put(`${apiBase}/api/batches/${batchId}/status`, {
      status: newStatus,
      userId: user.id,   // REQUIRED 🔥
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

  const applyQualityUpdate = async (batchId) => {
    const q = qualityUpdate[batchId] || {};
    if (!q.grade) {
      alert("Please select a quality grade.");
      return;
    }

    try {
      setLoadingRow(batchId);
      await axios.put(`${apiBase}/api/batches/${batchId}/quality`, {
        qualityGrade: q.grade,
        confidence: q.confidence ? Number(q.confidence) : null,
      });

      setBatches((prev) =>
        prev.map((b) =>
          b.batchId === batchId
            ? {
                ...b,
                avgQualityScore: q.confidence
                  ? Number(q.confidence)
                  : b.avgQualityScore,
              }
            : b
        )
      );

      alert("Batch quality updated!");
    } catch (err) {
      console.error("Error updating batch quality:", err);
      alert("Failed to update quality.");
    } finally {
      setLoadingRow(null);
    }
  };

  const handleSplitBatch = async (batchId) => {
    if (
      !window.confirm(
        "This will split this batch into two smaller batches. Continue?"
      )
    ) {
      return;
    }

    try {
      setLoadingRow(batchId);
      const res = await axios.post(
        `${apiBase}/api/batches/${batchId}/split`
      );
      const newBatch = res.data;

      // Add new batch, keep old one
      setBatches((prev) => [...prev, newBatch]);
      alert(`Batch split! New batch created: ${newBatch.batchId}`);
    } catch (err) {
      console.error("Error splitting batch:", err);
      alert(
        err.response?.data?.error ||
          "Failed to split batch. Check if there are enough crops."
      );
    } finally {
      setLoadingRow(null);
    }
  };

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

    if (
      !window.confirm(
        `All crops from ${sourceBatchId} will be moved into ${targetBatchId}. Continue?`
      )
    ) {
      return;
    }

    try {
      setLoadingRow(sourceBatchId);
      const res = await axios.post(
        `${apiBase}/api/batches/${sourceBatchId}/merge-into/${targetBatchId}`
      );
      const updatedTarget = res.data;

      // Remove source batch, update target batch
      setBatches((prev) =>
        prev
          .filter((b) => b.batchId !== sourceBatchId)
          .map((b) =>
            b.batchId === targetBatchId ? { ...b, ...updatedTarget } : b
          )
      );

      alert("Batches merged successfully!");
    } catch (err) {
      console.error("Error merging batches:", err);
      alert(
        err.response?.data?.error ||
          "Failed to merge batches. Check if both batches exist."
      );
    } finally {
      setLoadingRow(null);
    }
  };

  const handleProcessDailyHarvest = async () => {
    if (!user?.id) return;
    if (
      !window.confirm(
        "This will create a HARVESTED batch from all crops with status READY_FOR_HARVEST. Continue?"
      )
    ) {
      return;
    }

    try {
      setProcessingHarvest(true);
      const res = await axios.post(
        `${apiBase}/api/batches/process-daily-harvest/${user.id}`
      );

      if (res.status === 204 || !res.data) {
        alert("No crops with status READY_FOR_HARVEST for today.");
        return;
      }

      const newBatch = res.data;
      setBatches((prev) => [...prev, newBatch]);
      alert(`Harvest batch created: ${newBatch.batchId}`);
    } catch (err) {
      console.error("Error processing daily harvest:", err);
      alert("Failed to process daily harvest.");
    } finally {
      setProcessingHarvest(false);
    }
  };

  const getQrUrlForBatch = (batch) => {
    if (batch.qrCodeUrl) return batch.qrCodeUrl;
    return `${window.location.origin}/trace/${batch.batchId}`;
  };

  // ---- UI ----

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Batch Management
            </h2>
            <p className="text-xs text-slate-500">
              Grouped crop batches with status, quality and merge/split actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleProcessDailyHarvest}
              disabled={processingHarvest}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
            >
              {processingHarvest && (
                <span className="h-3 w-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              )}
              <SproutIcon />
              <span>Process Today&apos;s Harvest</span>
            </button>

            <button
              onClick={fetchBatches}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <RefreshCcw className="h-3 w-3" />
              Refresh
            </button>

            <button
              onClick={onClose}
              className="ml-2 text-xs px-3 py-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-900"
            >
              Close
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-3 mb-1 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center text-slate-500 text-sm">
              <div className="h-6 w-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mb-3" />
              Loading batches...
            </div>
          ) : batches.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No batches yet. Add crops first, then mark them as READY_FOR_HARVEST
              to generate harvest batches.
            </div>
          ) : (
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">
                      Batch
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">
                      Crop Type
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">
                      Total Qty
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-[11px] font-semibold text-slate-500">
                      Quality
                    </th>
                    <th className="px-3 py-2 text-right text-[11px] font-semibold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => {
                    const isExpanded = expandedBatchId === batch.batchId;
                    const crops = batchCrops[batch.batchId] || [];

                    return (
                      <React.Fragment key={batch.batchId}>
                        {/* Main row */}
                        <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                          <td className="px-3 py-2 align-top">
                            <button
                              onClick={() => toggleExpand(batch.batchId)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-slate-800"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                              <span className="font-mono">
                                {batch.batchId}
                              </span>
                            </button>
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-slate-700">
                            {batch.cropType || "-"}
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-slate-700">
                            {batch.totalQuantity != null
                              ? `${batch.totalQuantity} kg`
                              : "-"}
                          </td>
                          <td className="px-3 py-2 align-top text-xs">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide
                              bg-emerald-50 border-emerald-200 text-emerald-700">
                              {batch.status || "PLANTED"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-slate-700">
                            {batch.avgQualityScore != null ? (
                              <span className="inline-flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500" />
                                <span>{batch.avgQualityScore.toFixed(1)}%</span>
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-3 py-2 align-top text-xs text-right">
                            <button
                              onClick={() => toggleExpand(batch.batchId)}
                              className="inline-flex items-center text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700"
                            >
                              {isExpanded ? "Hide details" : "View details"}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/60 border-b border-slate-100">
                            <td
                              colSpan={6}
                              className="px-4 py-3 text-xs text-slate-700"
                            >
                              <div className="grid md:grid-cols-[2fr_1.3fr] gap-4">
                                {/* Left: crops list */}
                                <div>
                                  <p className="text-[11px] font-semibold text-slate-500 mb-2">
                                    Crops in this batch
                                  </p>

                                  {loadingRow === batch.batchId ? (
                                    <div className="py-4 text-slate-500 text-[11px] flex items-center gap-2">
                                      <span className="h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                      Loading crops...
                                    </div>
                                  ) : crops.length === 0 ? (
                                    <p className="py-3 text-[11px] text-slate-500">
                                      No crops linked to this batch yet.
                                    </p>
                                  ) : (
                                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                      {crops.map((crop) => (
                                        <div
                                          key={crop.cropId}
                                          className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-2 py-1.5"
                                        >
                                          <div>
                                            <p className="text-[11px] font-medium text-slate-800">
                                              {crop.cropName}
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                              Qty: {crop.quantity} | Status:{" "}
                                              {crop.status}
                                            </p>
                                          </div>
                                          <div className="text-[10px] text-slate-400">
                                            #{crop.cropId}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Right: actions + QR */}
                                <div className="space-y-3">
                                  {/* QR + basic info */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2 flex gap-2">
                                    <div className="flex items-center justify-center bg-slate-50 rounded-md p-2">
                                      <QRCodeSVG
                                        value={getQrUrlForBatch(batch)}
                                        size={72}
                                        level="H"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                        <QrCode className="h-3 w-3" />
                                        Traceability QR
                                      </p>
                                      <p className="text-[10px] text-slate-500 break-all max-h-10 overflow-hidden">
                                        {getQrUrlForBatch(batch)}
                                      </p>
                                      <a
                                        href={getQrUrlForBatch(batch)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 inline-block text-[10px] text-primary-600 hover:underline"
                                      >
                                        Open trace page
                                      </a>
                                    </div>
                                  </div>

                                  {/* Status update */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">
                                      Update Status
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <select
                                        className="flex-1 border border-slate-200 rounded-md text-[11px] px-2 py-1"
                                        value={
                                          statusUpdate[batch.batchId] ||
                                          batch.status ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleStatusChange(
                                            batch.batchId,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select status</option>
                                        {STATUS_OPTIONS.map((s) => (
                                          <option key={s} value={s}>
                                            {s}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        disabled={loadingRow === batch.batchId}
                                        onClick={() =>
                                          applyStatusUpdate(batch.batchId)
                                        }
                                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-60"
                                      >
                                        <CheckCircle2 className="h-3 w-3" />
                                        Save
                                      </button>
                                    </div>
                                  </div>

                                  {/* Quality update */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">
                                      Quality Grade
                                    </p>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <select
                                        className="border border-slate-200 rounded-md text-[11px] px-2 py-1"
                                        value={
                                          (qualityUpdate[batch.batchId] &&
                                            qualityUpdate[batch.batchId]
                                              .grade) ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleQualityChange(
                                            batch.batchId,
                                            "grade",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select grade</option>
                                        {QUALITY_OPTIONS.map((g) => (
                                          <option key={g} value={g}>
                                            {g}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="number"
                                        placeholder="Confidence %"
                                        className="flex-1 border border-slate-200 rounded-md text-[11px] px-2 py-1"
                                        value={
                                          (qualityUpdate[batch.batchId] &&
                                            qualityUpdate[batch.batchId]
                                              .confidence) ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleQualityChange(
                                            batch.batchId,
                                            "confidence",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button
                                        disabled={loadingRow === batch.batchId}
                                        onClick={() =>
                                          applyQualityUpdate(batch.batchId)
                                        }
                                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
                                      >
                                        <Star className="h-3 w-3" />
                                        Save
                                      </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                      Grade is A/B/C, confidence is optional
                                      (0–100).
                                    </p>
                                  </div>

                                  {/* Split / Merge */}
                                  <div className="bg-white rounded-lg border border-slate-200 p-2">
                                    <p className="text-[11px] font-semibold text-slate-700 mb-1">
                                      Split / Merge
                                    </p>
                                    <div className="flex flex-col gap-2">
                                      <button
                                        disabled={loadingRow === batch.batchId}
                                        onClick={() =>
                                          handleSplitBatch(batch.batchId)
                                        }
                                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700"
                                      >
                                        <Scissors className="h-3 w-3" />
                                        Split this batch
                                      </button>

                                      <div className="flex items-center gap-2">
                                        <select
                                          className="flex-1 border border-slate-200 rounded-md text-[11px] px-2 py-1"
                                          value={
                                            mergeTarget[batch.batchId] || ""
                                          }
                                          onChange={(e) =>
                                            handleMergeTargetChange(
                                              batch.batchId,
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">
                                            Merge into other batch...
                                          </option>
                                          {batches
                                            .filter(
                                              (b) =>
                                                b.batchId !== batch.batchId &&
                                                b.cropType === batch.cropType
                                            )
                                            .map((b) => (
                                              <option
                                                key={b.batchId}
                                                value={b.batchId}
                                              >
                                                {b.batchId} ({b.status})
                                              </option>
                                            ))}
                                        </select>
                                        <button
                                          disabled={
                                            loadingRow === batch.batchId
                                          }
                                          onClick={() =>
                                            handleMergeBatch(batch.batchId)
                                          }
                                          className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700"
                                        >
                                          <Link2 className="h-3 w-3" />
                                          Merge
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-slate-400">
                                        You can only merge batches of the same
                                        crop type.
                                      </p>
                                    </div>
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

// Tiny sprout icon so we don't re-import lucide again
const SproutIcon = () => (
  <svg
    className="h-3 w-3 text-emerald-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 20s3-3 3-8V4" />
    <path d="M5 4a3 3 0 0 0 6 0H5Z" />
    <path d="M15 8a3 3 0 0 0 6 0h-6Z" />
    <path d="M12 13a5 5 0 0 1 5-5h4" />
  </svg>
);

export default BatchManagement;
