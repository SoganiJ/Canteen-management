import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', auth.currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">You have no order history yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="text-sm text-gray-500 mb-1">Order ID: {order.id}</div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-base font-semibold text-gray-700">
                      Status: <span className="capitalize">{order.status}</span>
                    </div>
                    <div className="text-base text-gray-600">
                      Total: <span className="font-medium text-green-600">Rs.{order.total}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {/* Optional: show date if order has timestamp */}
                    {order.createdAt?.toDate
                      ? new Date(order.createdAt.toDate()).toLocaleDateString()
                      : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
