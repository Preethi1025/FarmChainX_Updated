import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingOrdersModal = ({ buyerId, onClose }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/orders/buyer/${buyerId}`)
      .then((res) => {
        const all = res.data || [];
        setOrders(all.filter((o) => o.status === "PENDING"));
      })
      .catch(console.error);
  }, [buyerId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[600px]">
        <h2 className="text-lg font-semibold mb-4">Pending Orders</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No pending orders 🎉</p>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="border-b py-2 text-sm">
              Batch: {o.batchId} | Qty: {o.quantity} | ₹{o.totalPrice}
            </div>
          ))
        )}

        <div className="text-right mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersModal;
