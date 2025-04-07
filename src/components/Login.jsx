import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        if (role === 'owner') {
          navigate('/owner-dashboard');
        } else if (role === 'customer') {
          navigate('/customer-ordering');
        } else {
          console.warn('Unknown user role');
          navigate('/');
        }
      } else {
        console.error('User document not found in Firestore');
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      {/* Left side */}
      <div className="hidden md:flex flex-col items-start justify-center p-12 w-1/2">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back 👋</h1>
        <p className="text-lg text-gray-600">
          Sign in to continue managing your orders and exploring delicious options.
        </p>
        <img
          src="https://illustrations.popsy.co/gray/business-woman-with-checklist.svg"
          alt="Login Illustration"
          className="w-96 mt-8"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl md:w-1/2">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="text-right text-sm">
            <a href="#" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account? <span className="text-blue-500 cursor-pointer hover:underline">Register now</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
