// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import OwnerDashboard from './components/OwnerDashboard';
import CustomerOrdering from './components/CustomerOrdering';
import Login from './components/Login';
import Signup from './components/Signup';
import RestaurantMenu from './components/RestaurantMenu';
import { CartProvider } from './CartContext';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation'; // Import OrderConfirmation

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/customer-ordering" element={<CustomerOrdering />} />
            <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} /> {/* Add OrderConfirmation route */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;