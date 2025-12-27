import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Lock,
  Unlock,
  Trash2,
  Info,
  MoreHorizontal,
  X,
  Search,
  Filter,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supportApi } from "../../api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [stats, setStats] = useState({});

  const [search, setSearch] = useState("");
  const [cropSearch, setCropSearch] = useState("");
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
    try {
      const statsRes = await axios.get("http://localhost:8080/api/admin/stats");

      const farmers = (await axios.get("http://localhost:8080/api/admin/farmers")).data;
      const distributors = (await axios.get("http://localhost:8080/api/admin/distributors")).data;
      const consumers = (await axios.get("http://localhost:8080/api/admin/consumers")).data;
      const admins = (await axios.get("http://localhost:8080/api/admin/admins")).data;
      const cropsRes = await axios.get("http://localhost:8080/api/admin/crops");
      
      // Add ticket stats
      let ticketCount = 0;
      try {
        const ticketsStats = await supportApi.getSupportStats();
        ticketCount = ticketsStats.data?.totalTickets || 0;
      } catch (err) {
        console.log("Ticket stats not available:", err);
        try {
          const ticketsRes = await supportApi.getAllTickets();
          ticketCount = Array.isArray(ticketsRes.data) ? ticketsRes.data.length : 0;
        } catch (err2) {
          console.log("Could not fetch tickets:", err2);
        }
      }

      const allUsers = [...farmers, ...distributors, ...consumers, ...admins]
        .map(u => {
          const v = { ...u };
          delete v.password;
          return v;
        });

      // Merge stats with ticket count
      setStats({
        ...statsRes.data,
        tickets: ticketCount
      });
      setUsers(allUsers);
      setCrops(cropsRes.data);
      setFilteredCrops(cropsRes.data);
    } catch (err) {
      console.error("Admin dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter crops when search changes
  useEffect(() => {
    if (cropSearch.trim() === "") {
      setFilteredCrops(crops);
    } else {
      const searchTerm = cropSearch.toLowerCase();
      const filtered = crops.filter(crop => 
        (crop.cropName && crop.cropName.toLowerCase().includes(searchTerm)) ||
        (crop.cropType && crop.cropType.toLowerCase().includes(searchTerm)) ||
        (crop.batchId && crop.batchId.toLowerCase().includes(searchTerm)) ||
        (crop.status && crop.status.toLowerCase().includes(searchTerm))
      );
      setFilteredCrops(filtered);
    }
  }, [cropSearch, crops]);

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
    if (!window.confirm("Are you sure you want to delete this crop? This action cannot be undone.")) return;
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
    { label: "Crops", value: stats.crops, color: "from-orange-400 to-orange-600" },
    { 
      label: "Tickets", 
      value: stats.tickets || 0, 
      color: "from-pink-500 to-rose-500",
      clickable: true,
      onClick: () => navigate("/admin/support")
    }
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        {uiStats.map(s => (
          <motion.div
            key={s.label}
            whileHover={{ scale: 1.05 }}
            onClick={s.clickable ? s.onClick : undefined}
            className={`bg-gradient-to-r ${s.color} text-white p-6 rounded-2xl shadow-lg
              ${s.clickable ? 'cursor-pointer hover:shadow-xl transition-shadow duration-300' : ''}`}
          >
            <p className="text-3xl font-bold">{s.value ?? 0}</p>
            <p className="opacity-90">{s.label}</p>
            {s.clickable && (
              <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
                <span>Click to view</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* TABS + REPORTS */}
      <div className="flex gap-4 mb-6 items-center">
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
        
        <button
          onClick={() => navigate("/admin/support")}
          className="px-6 py-2 rounded-full font-medium bg-gradient-to-r from-pink-500 to-rose-500
                     text-white hover:from-pink-600 hover:to-rose-600 shadow-lg"
        >
          SUPPORT DASHBOARD
        </button>
      </div>

      {/* FILTER BAR FOR USERS */}
      {activeTab === "USERS" && (
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search users by email, name, or role..."
              className="pl-10 pr-4 py-2 rounded-lg border shadow-sm w-72"
              onChange={e => setSearch(e.target.value.toLowerCase())}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select className="px-3 py-2 rounded-lg border" onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <select className="px-3 py-2 rounded-lg border" onChange={e => setRoleFilter(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="FARMER">Farmer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="BUYER">Buyer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <span className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      )}

      {/* CROPS TABLE - UPDATED FOR YOUR API */}
{activeTab === "CROPS" && (
  <div className="bg-white/80 backdrop-blur rounded-2xl shadow overflow-hidden">
    <div className="grid grid-cols-8 bg-gray-100 px-6 py-3 text-sm font-semibold">
      <span>Crop ID</span>
      <span>Crop Name</span>
      <span>Type</span>
      <span>Quantity</span>
      <span>Price</span>
      <span>Status</span>
      <span>Batch ID</span>
      <span className="text-right">Actions</span>
    </div>

    {filteredCrops.length > 0 ? (
      filteredCrops.map(c => (
        <div
          key={c.cropId}
          className="grid grid-cols-8 px-6 py-4 border-t items-center hover:bg-gray-50"
        >
          <div className="font-mono text-sm">{c.cropId}</div>
          <div className="font-medium">{c.cropName}</div>
          <div>{c.cropType}</div>
          <div>{c.quantity}</div>
          <div>₹{c.price}</div>
          <div>
            <Badge color={
              c.status === "PLANTED" ? "blue" : 
              c.status === "HARVESTED" ? "green" : 
              c.status === "SOLD" ? "purple" : "gray"
            }>
              {c.status}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 font-mono">
            {c.batchId}
          </div>
          <div className="flex justify-end gap-3">
            {c.batchId && (
              <a 
                href={`/trace/${c.batchId}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-1 hover:bg-gray-200 rounded"
                title="View Traceability"
              >
                <Info size={16} className="text-blue-600" />
              </a>
            )}
            <button
              onClick={() => { setSelectedRow(c); setShowDetails(true); }}
              className="p-1 hover:bg-gray-200 rounded"
              title="View Details"
            >
              <MoreHorizontal size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => deleteCrop(c.cropId)}
              className="p-1 hover:bg-red-100 rounded"
              title="Delete Crop"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="px-6 py-8 text-center text-gray-500">
        No crops found. {cropSearch ? "Try a different search term." : "Farmers haven't listed any crops yet."}
      </div>
    )}
  </div>
)}

      {/* USERS TABLE */}
      {activeTab === "USERS" && (
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-100 px-6 py-3 text-sm font-semibold">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Registered</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map(u => (
              <div key={u.id} className="grid grid-cols-6 px-6 py-4 border-t items-center hover:bg-gray-50">
                <div className="font-medium">{u.name || u.fullName || "—"}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                <div>
                  {u.role === "ADMIN" ? (
                    <Badge color="purple">ADMIN</Badge>
                  ) : (
                    <select
                      value={u.role}
                      disabled={u.id === admin?.id}
                      onChange={e => setPendingRoleChange({ user: u, role: e.target.value })}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="FARMER">Farmer</option>
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="BUYER">Buyer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  )}
                </div>
                <div>
                  <Badge color={u.blocked ? "red" : "green"}>
                    {u.blocked ? "Inactive" : "Active"}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </div>
                <div className="flex justify-end gap-3">
                  {u.blocked ? (
                    <button
                      onClick={() => unblockUser(u.id)}
                      className="p-1 hover:bg-green-100 rounded"
                      title="Unblock User"
                    >
                      <Unlock size={16} className="text-green-600" />
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(u.id)}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Block User"
                    >
                      <Lock size={16} className="text-red-600" />
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedRow(u); setShowDetails(true); }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="View Details"
                  >
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      )}

      {/* CROPS TABLE - IMPROVED VERSION */}
      {activeTab === "CROPS" && (
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-100 px-6 py-3 text-sm font-semibold">
            <span>Crop Name</span>
            <span>Type</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Status</span>
            <span>Batch ID</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredCrops.length > 0 ? (
            filteredCrops.map(c => (
              <div
                key={c.cropId || c.id}
                className="grid grid-cols-7 px-6 py-4 border-t items-center hover:bg-gray-50"
              >
                <div className="font-medium">{c.cropName || c.name}</div>
                <div>{c.cropType || c.type || "—"}</div>
                <div>{c.quantity || c.quantityAvailable || 0}</div>
                <div>₹{c.price || c.pricePerUnit || 0}</div>
                <div>
                  <Badge color={
                    (c.status || "AVAILABLE").toUpperCase() === "AVAILABLE" ? "green" : 
                    (c.status || "").toUpperCase() === "SOLD" ? "red" : "blue"
                  }>
                    {c.status || "Available"}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 font-mono">
                  {c.batchId || c.batchID || "—"}
                </div>
                <div className="flex justify-end gap-3">
                  {c.batchId && (
                    <a 
                      href={`/trace/${c.batchId}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-1 hover:bg-gray-200 rounded"
                      title="View Traceability"
                    >
                      <Info size={16} className="text-blue-600" />
                    </a>
                  )}
                  <button
                    onClick={() => { setSelectedRow(c); setShowDetails(true); }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="View Details"
                  >
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteCrop(c.cropId || c.id)}
                    className="p-1 hover:bg-red-100 rounded"
                    title="Delete Crop"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No crops found. {cropSearch ? "Try a different search term." : "Farmers haven't listed any crops yet."}
            </div>
          )}
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
    ${color === "gray" && "bg-gray-100 text-gray-700"}
  `}>
    {children}
  </span>
);

const ConfirmModal = ({ text, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
      <h3 className="font-semibold text-lg mb-4">Confirm Role Change</h3>
      <p className="mb-6 text-gray-700">{text}</p>
      <div className="flex justify-end gap-3">
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Confirm Change
        </button>
      </div>
    </div>
  </div>
);

const DetailsModal = ({ row, onClose }) => {
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "—";
    
    if (key.toLowerCase().includes('date')) {
      return new Date(value).toLocaleString();
    }
    
    if (key.toLowerCase().includes('price')) {
      return `₹${value}`;
    }
    
    if (key.toLowerCase().includes('role')) {
      return (
        <Badge color={
          value === "ADMIN" ? "purple" :
          value === "FARMER" ? "blue" :
          value === "DISTRIBUTOR" ? "green" : "gray"
        }>
          {value}
        </Badge>
      );
    }
    
    if (key.toLowerCase().includes('status') || key.toLowerCase().includes('blocked')) {
      return (
        <Badge color={value === true || value === "blocked" ? "red" : "green"}>
          {value === true ? "Blocked" : value === false ? "Active" : String(value)}
        </Badge>
      );
    }
    
    return String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">
            {row.email ? "User Details" : "Crop Details"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="text-xs text-gray-500 font-medium mb-1">
                {formatKey(key)}
              </div>
              <div className="font-medium break-words">
                {formatValue(key, value)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};