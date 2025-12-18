// import React from "react";
// import { ShoppingCart, Clock, IndianRupee, Users } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { useEffect, useState } from "react";
// import axios from "axios";
//
//
// const BuyerDashboard = () => {
//   const { user } = useAuth();
//   const [dashboard, setDashboard] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalSpent: 0
//   });
//
//
//   // dummy stats (later backend se aayega)
//   const stats = [
//     {
//       title: "Total Orders",
//       value: 0,
//       icon: ShoppingCart,
//     },
//     {
//       title: "Pending Orders",
//       value: 0,
//       icon: Clock,
//       badge: "down",
//     },
//     {
//       title: "Total Spent",
//       value: "₹0",
//       icon: IndianRupee,
//     },
//     {
//       title: "Favorite Farmers",
//       value: 0,
//       icon: Users,
//     },
//   ];
//
//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-900">
//           Welcome back, {user?.name || "Buyer"} 👋
//         </h1>
//         <p className="text-sm text-slate-500">
//           Here’s an overview of your activity
//         </p>
//       </div>
//
//       {/* Stats Cards */}
//       <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((item, index) => {
//           const Icon = item.icon;
//           return (
//             <div
//               key={index}
//               className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 m-5 flex items-center justify-between"
//             >
//               <div>
//                 <p className="text-sm text-slate-500">{item.title}</p>
//                 <h2 className="text-2xl font-bold text-slate-900">
//                   {item.value}
//                 </h2>
//               </div>
//
//               <div className="flex flex-col items-end gap-1">
//                 <Icon className="w-6 h-6 text-emerald-500" />
//                 {item.badge && (
//                   <span className="text-xs text-emerald-600">
//                     {item.badge}
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//
//       {/* Orders Section */}
//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//         <h3 className="text-sm font-semibold text-slate-800 mb-2">
//           Your Orders
//         </h3>
//         <p className="text-sm text-slate-500">
//           No orders yet. Browse products and place your first order.
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export default BuyerDashboard;
//

import React, { useState, useEffect } from "react";
import { ShoppingCart, Clock, IndianRupee, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import OrdersModal from "./modals/OrdersModal";
import PendingOrdersModal from "./modals/PendingOrdersModal";
import FavoriteFarmersModal from "./modals/FavoriteFarmersModal";

const BuyerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  });

  const [activeModal, setActiveModal] = useState(null); // orders | pending | favorites

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8080/api/orders/buyer/${user.id}`)
      .then((res) => {
        const orders = Array.isArray(res.data) ? res.data : [];

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === "PENDING").length,
          totalSpent: orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0),
        });
      })
      .catch((err) => console.error("Dashboard load failed", err));
  }, [user]);

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      onClick: () => setActiveModal("orders"),
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      onClick: () => setActiveModal("pending"),
    },
    {
      title: "Total Spent",
      value: `₹${stats.totalSpent.toFixed(2)}`,
      icon: IndianRupee,
    },
    {
      title: "Favorite Farmers",
      value: "View",
      icon: Users,
      onClick: () => setActiveModal("favorites"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back, {user?.name || "Buyer"} 👋
        </h1>
        <p className="text-sm text-slate-500">Here’s an overview of your activity</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={item.onClick}
              className={`cursor-pointer bg-white rounded-2xl border shadow-sm p-5 flex items-center justify-between hover:shadow-md transition ${!item.onClick && "cursor-default"}`}
            >
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>
                <h2 className="text-2xl font-bold text-slate-900">{item.value}</h2>
              </div>
              <Icon className="w-6 h-6 text-emerald-500" />
            </div>
          );
        })}
      </div>

      {activeModal === "orders" && (
        <OrdersModal buyerId={user.id} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "pending" && (
        <PendingOrdersModal buyerId={user.id} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "favorites" && (
        <FavoriteFarmersModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

export default BuyerDashboard;