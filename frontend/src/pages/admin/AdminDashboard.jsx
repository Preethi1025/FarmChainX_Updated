import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Lock,
  Unlock,
  Trash2,
  Info,
  MoreHorizontal,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState({});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [activeTab, setActiveTab] = useState("USERS");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);

  const admin = JSON.parse(localStorage.getItem("admin"));

  /* ---------------- LOGOUT ---------------- */
  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    const statsRes = await axios.get("http://localhost:8080/api/admin/stats");

    const farmers = (await axios.get("http://localhost:8080/api/admin/farmers")).data;
    const distributors = (await axios.get("http://localhost:8080/api/admin/distributors")).data;
    const consumers = (await axios.get("http://localhost:8080/api/admin/consumers")).data;
    const cropsRes = await axios.get("http://localhost:8080/api/admin/crops");

    const allUsers = [...farmers, ...distributors, ...consumers].map(u => {
      const v = { ...u };
      delete v.password;
      return v;
    });

    setStats(statsRes.data);
    setUsers(allUsers);
    setCrops(cropsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- USER ACTIONS ---------------- */
  const blockUser = async (id) => {
    await axios.put(`http://localhost:8080/api/admin/block/${id}`);
    loadData();
  };

  const unblockUser = async (id) => {
    await axios.put(`http://localhost:8080/api/admin/unblock/${id}`);
    loadData();
  };

  const confirmRoleChange = async () => {
    await axios.put(
      `http://localhost:8080/api/admin/role/${pendingRoleChange.user.id}`,
      { role: pendingRoleChange.role }
    );
    setPendingRoleChange(null);
    loadData();
  };

  const deleteCrop = async (id) => {
    if (!window.confirm("Delete this crop?")) return;
    await axios.delete(`http://localhost:8080/api/crops/delete/${id}`);
    loadData();
  };

  /* ---------------- FILTER USERS ---------------- */
  const filteredUsers = users
    .filter(u => JSON.stringify(u).toLowerCase().includes(search))
    .filter(u =>
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && !u.blocked) ||
      (statusFilter === "INACTIVE" && u.blocked)
    )
    .filter(u =>
      roleFilter === "ALL" || u.role === roleFilter
    );

  /* ---------------- UI STATS ---------------- */
  const uiStats = [
    { label: "Farmers", value: stats.farmers, color: "from-blue-400 to-blue-600" },
    { label: "Distributors", value: stats.distributors, color: "from-green-400 to-green-600" },
    { label: "Consumers", value: stats.consumers, color: "from-purple-400 to-purple-600" },
    { label: "Admins", value: stats.admins, color: "from-red-400 to-red-600" },
    { label: "Crops", value: stats.crops, color: "from-orange-400 to-orange-600" }
  ];

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800">Admin Portal</h1>

        <div className="flex items-center gap-4">
          <div className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600
                          text-white rounded-full shadow">
            {admin?.name}
          </div>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-full bg-red-500 text-white
                       hover:bg-red-600 transition shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {uiStats.map(s => (
          <motion.div
            key={s.label}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${s.color} text-white p-6 rounded-2xl shadow-lg`}
          >
            <p className="text-3xl font-bold">{s.value ?? 0}</p>
            <p className="opacity-90">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* TABS + REPORTS */}
      <div className="flex gap-4 mb-6">
        {["USERS", "CROPS"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-medium transition-all
              ${activeTab === tab
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}

        <button
          onClick={() => navigate("/admin/reports")}
          className="px-6 py-2 rounded-full font-medium bg-white hover:bg-gray-100
                     border border-dashed border-purple-400 text-purple-600"
        >
          SYSTEM REPORTS
        </button>
      </div>

      {/* FILTER BAR */}
      {activeTab === "USERS" && (
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            placeholder="Search users..."
            className="px-4 py-2 rounded-lg border shadow-sm w-64"
            onChange={e => setSearch(e.target.value.toLowerCase())}
          />
          <select className="px-3 py-2 rounded-lg border" onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <select className="px-3 py-2 rounded-lg border" onChange={e => setRoleFilter(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="FARMER">Farmer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="BUYER">Buyer</option>
          </select>
        </div>
      )}

      {/* USERS TABLE */}
      {activeTab === "USERS" && (
        <Table headers={["Email", "Role", "Status", "Actions"]}>
          {filteredUsers.map(u => (
            <Row key={u.id}>
              <Cell>{u.email}</Cell>

              <Cell>
                {u.role === "ADMIN" ? (
                  <Badge color="purple">ADMIN</Badge>
                ) : (
                  <select
                    value={u.role}
                    onChange={e => setPendingRoleChange({ user: u, role: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    <option value="FARMER">Farmer</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="BUYER">Buyer</option>
                  </select>
                )}
              </Cell>

              <Cell>
                <Badge color={u.blocked ? "red" : "green"}>
                  {u.blocked ? "Inactive" : "Active"}
                </Badge>
              </Cell>

              <Cell className="flex gap-3">
                {u.blocked ? (
                  <Unlock onClick={() => unblockUser(u.id)} className="cursor-pointer" />
                ) : (
                  <Lock onClick={() => blockUser(u.id)} className="cursor-pointer" />
                )}
                <MoreHorizontal
                  onClick={() => { setSelectedRow(u); setShowDetails(true); }}
                  className="cursor-pointer"
                />
              </Cell>
            </Row>
          ))}
        </Table>
      )}

      {/* CROPS TABLE */}
      {activeTab === "CROPS" && (
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-5 bg-gray-100 px-6 py-3 text-sm font-semibold">
            <span>Crop</span>
            <span>Quantity</span>
            <span>Status</span>
            <span>Batch</span>
            <span className="text-right">Actions</span>
          </div>

          {crops.map(c => (
            <div
              key={c.cropId}
              className="grid grid-cols-5 px-6 py-4 border-t items-center hover:bg-gray-50"
            >
              <div className="font-medium">{c.cropName}</div>
              <div>{c.quantity}</div>
              <div><Badge color="blue">{c.status}</Badge></div>
              <div className="text-sm text-gray-500">{c.batchId || "—"}</div>
              <div className="flex justify-end gap-3">
                {c.batchId && (
                  <a href={`/trace/${c.batchId}`} target="_blank" rel="noreferrer">
                    <Info size={16} />
                  </a>
                )}
                <MoreHorizontal
                  onClick={() => { setSelectedRow(c); setShowDetails(true); }}
                  className="cursor-pointer"
                />
                <Trash2
                  onClick={() => deleteCrop(c.cropId)}
                  className="cursor-pointer text-red-600"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM ROLE CHANGE */}
      {pendingRoleChange && (
        <ConfirmModal
          text={`Change role of ${pendingRoleChange.user.email} to ${pendingRoleChange.role}?`}
          onCancel={() => setPendingRoleChange(null)}
          onConfirm={confirmRoleChange}
        />
      )}

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {showDetails && selectedRow && (
          <DetailsModal row={selectedRow} onClose={() => setShowDetails(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Badge = ({ children, color }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium
    ${color === "green" && "bg-green-100 text-green-700"}
    ${color === "red" && "bg-red-100 text-red-700"}
    ${color === "blue" && "bg-blue-100 text-blue-700"}
    ${color === "purple" && "bg-purple-100 text-purple-700"}
  `}>
    {children}
  </span>
);

const Table = ({ headers, children }) => (
  <div className="bg-white/80 backdrop-blur rounded-2xl shadow overflow-hidden">
    <div className="grid grid-cols-4 bg-gray-100 px-6 py-3 text-sm font-semibold">
      {headers.map(h => <span key={h}>{h}</span>)}
    </div>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div className="grid grid-cols-4 px-6 py-4 border-t items-center hover:bg-gray-50">
    {children}
  </div>
);

const Cell = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const ConfirmModal = ({ text, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-96">
      <p className="mb-6">{text}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={onConfirm}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const DetailsModal = ({ row, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.95, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 10 }}
      className="bg-white p-6 rounded-xl w-full max-w-xl relative shadow-xl"
    >
      <X onClick={onClose} className="absolute top-4 right-4 cursor-pointer" />
      <h3 className="font-semibold mb-4 text-lg">Details</h3>

      <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
        {Object.entries(row).map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="text-xs text-gray-500 capitalize">{k}</div>
            <div className="font-medium break-words">{String(v)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);
