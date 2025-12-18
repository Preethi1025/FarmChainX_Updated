import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersModal = ({ buyerId, onClose }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/orders/buyer/${buyerId}`)
      .then((res) => setOrders(res.data || []))
      .catch(console.error);
  }, [buyerId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Batch</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b">
                  <td>{o.batchId}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.totalPrice}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="text-right mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
