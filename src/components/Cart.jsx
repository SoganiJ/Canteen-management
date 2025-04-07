import React from 'react';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + parseFloat(item.price), 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-yellow-600">🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty. Let’s fill it up!</p>
        ) : (
          <>
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h4 className="text-gray-800 font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">Rs.{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 mt-6 flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>Total:</span>
              <span className="text-green-600">Rs.{calculateTotal()}</span>
            </div>

            <div className="mt-6 space-y-3">
  <button
    onClick={clearCart}
    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg"
  >
    Clear Cart
  </button>
  <Link
    to="/checkout"
    className="w-full block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg text-center"
  >
    Proceed to Checkout
  </Link>
</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
