import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import Profile from './Profile'; // Import Profile

function CustomerOrdering() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      const restaurantList = restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRestaurants(restaurantList);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Order from your Favorite Restaurant!
          </h1>

          {/* Restaurant List */}
          <ul className="space-y-4">
            {restaurants.map((restaurant) => (
              <li
                key={restaurant.id}
                className="bg-gray-50 hover:bg-gray-100 transition p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <Link
                  to={`/restaurant/${restaurant.id}`}
                  className="text-lg text-blue-600 font-medium hover:underline"
                >
                  {restaurant.restaurantName}
                </Link>
                <span className="text-sm text-gray-500">Tap to view menu</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Components Below Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Cart</h2>
            <Cart />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Order History</h2>
            <OrderHistory />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile</h2>
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrdering;
