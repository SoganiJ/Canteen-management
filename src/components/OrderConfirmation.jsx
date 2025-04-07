import React from 'react';
import { useLocation } from 'react-router-dom';

function OrderConfirmation() {
  const location = useLocation();
  const { orderId, items = [], total, paymentMethod } = location.state || {};

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + parseFloat(item.price || 0), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          🎉 Order Confirmed!
        </h1>
        {orderId ? (
          <div className="space-y-4 text-gray-700">
            <p className="text-center">
              Thank you for your order. Your <span className="font-medium">Order ID</span> is{' '}
              <span className="font-bold text-black">{orderId}</span>
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2 border-b pb-2">🧾 Order Summary</h2>
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between py-2 text-sm">
                  <span>{item.name}</span>
                  <span className="text-gray-800 font-medium">{parseFloat(item.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between text-lg font-semibold text-gray-800">
              <span>Total</span>
              <span>Rs.{calculateTotal(items)}</span>
            </div>

            <div className="mt-2">
              <strong>Payment Method:</strong> {paymentMethod}
            </div>
            <div className="text-sm text-gray-500 mt-1">Estimated Delivery Time: 30-45 minutes</div>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Track Your Order
              </a>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 font-medium">No order details found.</p>
        )}
      </div>
    </div>
  );
}

export default OrderConfirmation;
