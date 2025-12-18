import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Leaf,
  Truck,
  User,
  Search,
  Package,
  Lock,
  Unlock,
  Trash2,
  Info,
  MoreHorizontal,
  X,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [farmers, setFarmers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");

  const [activeTable, setActiveTable] = useState(""); 
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const admin = JSON.parse(localStorage.getItem("admin"));

  // ---------- LOAD DASHBOARD DATA ----------
  const loadData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:8080/api/admin/stats");
      const farmerRes = await axios.get("http://localhost:8080/api/admin/farmers");
      const distributorRes = await axios.get("http://localhost:8080/api/admin/distributors");
      const consumerRes = await axios.get("http://localhost:8080/api/admin/consumers");
      const cropRes = await axios.get("http://localhost:8080/api/admin/crops");

      setStats(statsRes.data);
      setFarmers(stripSensitive(farmerRes.data));
      setDistributors(stripSensitive(distributorRes.data));
      setConsumers(stripSensitive(consumerRes.data));
      setCrops(cropRes.data);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Remove passwords before displaying
  const stripSensitive = (data) =>
    data.map((item) => {
      const v = { ...item };
      delete v.password;
      return v;
    });

  const handleCardClick = (table) => {
    setActiveTable(activeTable === table ? "" : table);
  };

  // ---------- BLOCK USER ----------
  const doBlock = async (id) => {
    setActionLoadingId(id);
    await axios.put(`http://localhost:8080/api/admin/block/${id}`);
    await loadData();
    setActionLoadingId(null);
  };

  // ---------- UNBLOCK USER ----------
  const doUnblock = async (id) => {
    setActionLoadingId(id);
    await axios.put(`http://localhost:8080/api/admin/unblock/${id}`);
    await loadData();
    setActionLoadingId(null);
  };

  // ---------- DELETE CROP ----------
  const deleteCrop = async (cropId) => {
    if (!window.confirm("Delete this crop?")) return;
    setActionLoadingId(cropId);
    await axios.delete(`http://localhost:8080/api/crops/delete/${cropId}`);
    await loadData();
    setActionLoadingId(null);
  };

  // ---------- EXPORT CSV ----------
  const exportCSV = (data, name) => {
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const openDetails = (row) => {
    setSelectedRow(row);
    setShowDetails(true);
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-10"
      >
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
          Admin Dashboard
        </h1>

        <div className="px-5 py-2 bg-primary-600 text-white rounded-full shadow-lg text-lg">
          {admin?.name}
        </div>
      </motion.div>

      {/* Stats Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        
        <div onClick={() => handleCardClick("farmers")}>
          <StatCard
            label="Farmers"
            value={stats.farmers}
            icon={<Users size={38} />}
            color="from-blue-200/40 to-blue-100/70"
            active={activeTable === "farmers"}
          />
        </div>

        <div onClick={() => handleCardClick("distributors")}>
          <StatCard
            label="Distributors"
            value={stats.distributors}
            icon={<Truck size={38} />}
            color="from-green-200/40 to-green-100/70"
            active={activeTable === "distributors"}
          />
        </div>

        <div onClick={() => handleCardClick("consumers")}>
          <StatCard
            label="Consumers"
            value={stats.consumers}
            icon={<User size={38} />}
            color="from-purple-200/40 to-purple-100/70"
            active={activeTable === "consumers"}
          />
        </div>

        <div onClick={() => handleCardClick("crops")}>
          <StatCard
            label="Crops"
            value={stats.crops}
            icon={<Leaf size={38} />}
            color="from-orange-200/40 to-orange-100/70"
            active={activeTable === "crops"}
          />
        </div>
      </div>

      {/* Search bar (only if table is open) */}
      {activeTable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative max-w-lg mx-auto mb-10"
        >
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-full py-3 pl-12 pr-4 shadow-md bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-primary-500"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </motion.div>
      )}

      {/* TABLES */}
      <AnimatePresence>
        {activeTable === "farmers" && (
          <TableBlock
            title="Farmers"
            data={farmers}
            search={search}
            icon={Users}
            openDetails={openDetails}
            doBlock={doBlock}
            doUnblock={doUnblock}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeTable === "distributors" && (
          <TableBlock
            title="Distributors"
            data={distributors}
            search={search}
            icon={Truck}
            openDetails={openDetails}
            doBlock={doBlock}
            doUnblock={doUnblock}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeTable === "consumers" && (
          <TableBlock
            title="Consumers"
            data={consumers}
            search={search}
            icon={User}
            openDetails={openDetails}
            doBlock={doBlock}
            doUnblock={doUnblock}
            actionLoadingId={actionLoadingId}
          />
        )}

        {activeTable === "crops" && (
          <TableBlock
            title="Crops"
            data={crops}
            search={search}
            icon={Package}
            isCropTable={true}
            openDetails={openDetails}
            deleteCrop={deleteCrop}
            actionLoadingId={actionLoadingId}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}
      <DetailsModal
        show={showDetails}
        close={() => setShowDetails(false)}
        activeTable={activeTable}
        row={selectedRow}
        doBlock={doBlock}
        doUnblock={doUnblock}
        exportCSV={exportCSV}
      />
    </div>
  );
}

//
// ---------------- STAT CARD ----------------
//
function StatCard({ label, value, icon, color, active }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-3xl shadow-lg bg-gradient-to-br ${color} 
      cursor-pointer backdrop-blur-xl border border-white/30 transition-all
      ${active ? "ring-4 ring-primary-400 shadow-xl" : ""}`}
    >
      <div className="flex items-center gap-5">
        <div className="p-4 bg-white/80 rounded-2xl shadow">{icon}</div>
        <div>
          <p className="text-4xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-600 text-sm">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

//
// --------------- TABLE BLOCK ----------------
//
function TableBlock({
  title,
  data,
  search,
  icon: Icon,
  openDetails,
  doBlock,
  doUnblock,
  deleteCrop,
  actionLoadingId,
  isCropTable
}) {
  const filtered = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="mb-14 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-5">
        <Icon className="text-primary-600" size={28} />
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No records found</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-full text-gray-800">
            <thead className="bg-gray-100/70 text-gray-700">
              <tr>
                {Object.keys(filtered[0]).map((key) => (
                  <th key={key} className="py-3 px-4 border-b text-left capitalize">
                    {key}
                  </th>
                ))}
                <th className="py-3 px-4 border-b text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="py-3 px-4 border-b">
                      {String(val)}
                    </td>
                  ))}

                  {/* ACTION BUTTONS */}
                  <td className="py-3 px-4 border-b text-right">
                    <div className="inline-flex items-center gap-2">

                      {!isCropTable ? (
                        <>
                          {row.blocked ? (
                            <button
                              onClick={() => doUnblock(row.id)}
                              className="p-2 rounded-md border hover:bg-gray-50"
                              disabled={actionLoadingId === row.id}
                            >
                              <Unlock size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => doBlock(row.id)}
                              className="p-2 rounded-md border hover:bg-gray-50"
                              disabled={actionLoadingId === row.id}
                            >
                              <Lock size={16} />
                            </button>
                          )}

                          {/* DETAILS BUTTON */}
                          <button
                            onClick={() => openDetails(row)}
                            className="p-2 rounded-md border hover:bg-gray-50"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          {row.batchId && (
                            <a
                              href={`${window.location.origin}/trace/${row.batchId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-md border hover:bg-gray-50"
                            >
                              <Info size={16} />
                            </a>
                          )}

                          <button
                            onClick={() => deleteCrop(row.cropId)}
                            className="p-2 rounded-md border hover:bg-red-50 text-red-600"
                            disabled={actionLoadingId === row.cropId}
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            onClick={() => openDetails(row)}
                            className="p-2 rounded-md border hover:bg-gray-50"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </motion.div>
  );
}

//
// ------------------- DETAILS MODAL -------------------
//
function DetailsModal({
  show,
  close,
  row,
  activeTable,
  doBlock,
  doUnblock,
  exportCSV
}) {
  if (!show || !row) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>

          <h3 className="text-xl font-semibold mb-4">Details</h3>

          <div className="max-h-[50vh] overflow-auto pr-2 space-y-3">
            {Object.entries(row).map(([key, val]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="text-xs text-gray-500 capitalize">{key}</div>
                <div className="font-medium text-gray-800">{String(val)}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3 flex-wrap">
            {activeTable !== "crops" && (
              <>
                {row.blocked ? (
                  <button
                    onClick={() => {
                      doUnblock(row.id);
                      close();
                    }}
                    className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
                  >
                    <Unlock size={14} /> Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      doBlock(row.id);
                      close();
                    }}
                    className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
                  >
                    <Lock size={14} /> Block
                  </button>
                )}
              </>
            )}

            {activeTable === "crops" && row.batchId && (
              <a
                href={`${window.location.origin}/trace/${row.batchId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
              >
                <Info size={14} /> Open Trace
              </a>
            )}

            <button
              onClick={() => exportCSV([row], `${activeTable}_row.csv`)}
              className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
            >
              <Download size={14} /> Export Row
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
