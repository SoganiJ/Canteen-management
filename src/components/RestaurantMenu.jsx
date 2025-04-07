import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { useCart } from '../CartContext';

function RestaurantMenu() {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
        if (restaurantDoc.exists()) {
          setRestaurantName(restaurantDoc.data().restaurantName);
        }

        const menuSnapshot = await getDocs(collection(db, 'restaurants', restaurantId, 'menu'));
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuList);

        const reviewsSnapshot = await getDocs(collection(db, 'restaurants', restaurantId, 'reviews'));
        const reviewsList = reviewsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());
        setReviews(reviewsList);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert('Please log in to submit a review.');
    if (rating === 0) return alert('Please select a rating.');

    try {
      const reviewsCollection = collection(db, 'restaurants', restaurantId, 'reviews');
      const reviewQuery = query(reviewsCollection, where('userId', '==', auth.currentUser.uid));
      const existingReview = await getDocs(reviewQuery);

      if (!existingReview.empty) {
        alert('You have already submitted a review for this restaurant.');
        return;
      }

      const newReview = {
        userId: auth.currentUser.uid,
        rating,
        comment,
        timestamp: new Date(),
      };

      await addDoc(reviewsCollection, newReview);
      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error.message);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          {restaurantName || 'Restaurant'} Menu
        </h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Menu Items</h2>
            {menuItems.length === 0 ? (
              <p className="text-gray-500 italic">No items available at the moment.</p>
            ) : (
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between bg-gray-900 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-300">Rs.{item.price}</p>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800">Reviews & Ratings</h2>
              <p className="text-gray-600 mt-1">
                <span className="font-bold">Average Rating:</span> {calculateAverageRating()} ⭐
              </p>

              <ul className="mt-4 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <li key={review.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">★</span>
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <span key={i} className="text-gray-300 text-lg">★</span>
                        ))}
                      </div>
                      <p className="text-gray-700 mb-1">{review.comment}</p>
                      <p className="text-xs text-gray-400">
                        {review.timestamp?.toDate().toLocaleDateString()}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-10 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Leave a Review</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val} className="flex items-center space-x-1">
                      <input
                        type="radio"
                        value={val}
                        checked={rating === val}
                        onChange={() => setRating(val)}
                        className="accent-yellow-400"
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                  rows={3}
                  placeholder="Write your feedback..."
                />
              </div>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default RestaurantMenu;
