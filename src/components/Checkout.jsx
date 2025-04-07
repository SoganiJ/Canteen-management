import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv) {
        alert("Please enter all credit card details.");
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!bankName || !accountNumber || !password) {
        alert("Please enter all net banking details.");
        return;
      }
    }

    let paymentSuccessful = ['upi', 'card', 'netbanking'].includes(paymentMethod);

    if (paymentSuccessful) {
      try {
        const ordersCollection = collection(db, "orders");
        const orderRef = await addDoc(ordersCollection, {
          userId: auth.currentUser.uid,
          items: cart,
          total: calculateTotal(),
          timestamp: new Date(),
          status: "pending",
          paymentMethod,
        });

        const pointsEarned = Math.floor(parseFloat(calculateTotal()));
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentPoints = userData.loyaltyPoints || 0;
          await updateDoc(userDocRef, {
            loyaltyPoints: currentPoints + pointsEarned,
          });
        }

        clearCart();

        navigate('/order-confirmation', {
          state: {
            orderId: orderRef.id,
            items: cart,
            total: calculateTotal(),
            paymentMethod,
          },
        });
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Error placing order. Please try again.");
      }
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col items-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* Order Summary */}
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-3 mb-6">
            <ul className="divide-y divide-gray-200">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between py-2">
                  <span>{item.name}</span>
                  <span className="text-gray-700 font-medium">Rs.{item.price}</span>
                </li>
              ))}
            </ul>
            <div className="text-xl font-semibold text-right">
              Total: <span className="text-green-600">Rs.{calculateTotal()}</span>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Payment Method</h2>
          <div className="space-y-3">
            {['upi', 'card', 'netbanking'].map(method => (
              <label key={method} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-blue-600"
                />
                <span className="capitalize">{method}</span>
              </label>
            ))}
          </div>

          {/* Conditional Fields */}
          {paymentMethod === 'card' && (
            <div className="mt-4 space-y-4">
              <Input label="Card Number" value={cardNumber} onChange={setCardNumber} />
              <Input label="Expiry Date" value={expiryDate} onChange={setExpiryDate} />
              <Input label="CVV" value={cvv} onChange={setCvv} />
            </div>
          )}
          {paymentMethod === 'netbanking' && (
            <div className="mt-4 space-y-4">
              <Input label="Bank Name" value={bankName} onChange={setBankName} />
              <Input label="Account Number" value={accountNumber} onChange={setAccountNumber} />
              <Input label="Password" value={password} onChange={setPassword} type="password" />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-3 rounded-md shadow"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

// Reusable Input component
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Checkout;
