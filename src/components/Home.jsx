import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
        <p className="text-gray-600 mb-8">Please select your role or action to continue.</p>

        <div className="space-y-4">
          <Link
            to="/owner-dashboard"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            I'm an Owner
          </Link>
          <Link
            to="/customer-ordering"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            I'm a Customer
          </Link>
          <Link
            to="/login"
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
