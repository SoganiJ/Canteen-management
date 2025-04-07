import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [restaurantName, setRestaurantName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let additionalData = {
        email: email,
        role: role,
        loyaltyPoints: 0,
      };

      if (role === 'owner') {
        additionalData.restaurantName = restaurantName;
      }

      await setDoc(doc(db, 'users', user.uid), additionalData);

      if (role === 'owner') {
        await setDoc(doc(db, 'restaurants', user.uid), {
          restaurantName: restaurantName,
        });
      }

      console.log('User signed up successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="customer">Customer</option>
              <option value="owner">Restaurant Owner</option>
            </select>
          </div>

          {role === 'owner' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Restaurant Name</label>
              <input
                type="text"
                placeholder="e.g. Spicy Spoon"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
