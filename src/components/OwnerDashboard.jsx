import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

function OwnerDashboard() {
  const [restaurantName, setRestaurantName] = useState('My Restaurant');
  const [foodName, setFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      const foodCollection = collection(db, 'restaurants', auth.currentUser.uid, 'menu');
      const foodSnapshot = await getDocs(foodCollection);
      const foodList = foodSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFoodItems(foodList);
    };

    if (auth.currentUser) {
      fetchFoodItems();
    }

    const ordersCollection = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const pendingOrders = orderList.filter((order) => order.status !== 'ready');
      setOrders(pendingOrders);
      calculateEarnings(orderList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddFoodItem = async (e) => {
    e.preventDefault();
    if (!foodName || !foodPrice) {
      alert('Please enter both food name and price.');
      return;
    }

    try {
      const foodCollection = collection(db, 'restaurants', auth.currentUser.uid, 'menu');
      const docRef = await addDoc(foodCollection, { name: foodName, price: foodPrice });
      setFoodItems([...foodItems, { id: docRef.id, name: foodName, price: foodPrice }]);
      setFoodName('');
      setFoodPrice('');
    } catch (error) {
      console.error('Error adding food item:', error.message);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'restaurants', auth.currentUser.uid, 'menu', id));
      setFoodItems(foodItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting food item:', error.message);
    }
  };

  const handleMarkOrderReady = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'ready' });
    } catch (error) {
      console.error('Error marking order as ready:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const calculateEarnings = (orderList) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let daily = 0,
      monthly = 0;

    orderList.forEach((order) => {
      const orderDate = order.timestamp.toDate();
      const total = parseFloat(order.total || 0);
      if (orderDate.toDateString() === today.toDateString()) daily += total;
      if (orderDate >= startOfMonth) monthly += total;
    });

    setDailyEarnings(daily);
    setMonthlyEarnings(monthly);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          {restaurantName} Dashboard
        </h1>

        {/* Earnings - Kept as in original */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-100 p-6 rounded-xl text-center shadow-sm border">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Daily Earnings</h3>
            <p className="text-3xl font-bold text-blue-900">Rs.{dailyEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl text-center shadow-sm border">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Monthly Earnings</h3>
            <p className="text-3xl font-bold text-green-900">Rs.{monthlyEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Food */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Add Food Item</h2>
          <form onSubmit={handleAddFoodItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Food Name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={foodPrice}
              onChange={(e) => setFoodPrice(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Item
            </button>
          </form>
        </section>

        {/* Food Items - Enhanced */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Food Items
          </h2>
          {foodItems.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">No food items yet. Add some to your menu!</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-2 max-h-96 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {foodItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-3 px-4 hover:bg-blue-50 transition rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </span>
                      <span className="text-gray-700 font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-blue-600 mr-4">Rs.{item.price}</span>
                      <button
                        onClick={() => handleDeleteFoodItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Orders - Enhanced */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Pending Orders
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">No pending orders at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-yellow-50 p-5 rounded-lg shadow-sm border border-yellow-200"
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-yellow-200">
                    <span className="font-medium text-yellow-800">Order #{order.id.slice(0, 6)}</span>
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">
                      Pending
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-gray-700">
                          <span>{item.name}</span>
                          <span className="font-medium">Rs.{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4 pt-2 border-t border-yellow-200">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">Rs.{order.total}</span>
                  </div>
                  
                  <button
                    onClick={() => handleMarkOrderReady(order.id)}
                    className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Ready
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;