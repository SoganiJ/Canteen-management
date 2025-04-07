import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function Profile() {
  const [profile, setProfile] = useState({
    email: '',
    role: '',
    name: '',
    address: '',
    phoneNumber: '',
    loyaltyPoints: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, profile);
      setIsEditing(false);
      alert('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('❌ Failed to update profile.');
    }
  };

  const handleRedeemPoints = async () => {
    if (redeemAmount <= 0 || isNaN(redeemAmount)) {
      alert('⚠️ Please enter a valid positive amount to redeem.');
      return;
    }

    if (redeemAmount > profile.loyaltyPoints) {
      alert('🚫 Not enough loyalty points.');
      return;
    }

    try {
      const newPoints = profile.loyaltyPoints - redeemAmount;
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { loyaltyPoints: newPoints });
      setProfile(prev => ({ ...prev, loyaltyPoints: newPoints }));
      setRedeemAmount(0);
      alert('🎉 Loyalty points redeemed!');
    } catch (error) {
      console.error('Error redeeming points:', error);
      alert('❌ Redemption failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10 text-gray-800">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-10">👤 My Profile</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="text"
              value={profile.email}
              readOnly
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg mt-1 text-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <input
              type="text"
              value={profile.role}
              readOnly
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg mt-1 text-gray-800"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Loyalty Points</label>
            <div className="mt-1 text-xl font-bold text-green-700">{profile.loyaltyPoints}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Redeem Points</label>
            <input
              type="number"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2 border rounded-lg mt-1 text-gray-800"
            />
          </div>
        </div>

        {isEditing ? (
          <>
            <div className="mt-8 space-y-4">
              {['name', 'address', 'phoneNumber'].map((field) => (
                <div key={field}>
                  <label className="text-sm font-semibold text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={profile[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg mt-1 text-gray-800"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {['name', 'address', 'phoneNumber'].map(
                (field) =>
                  profile[field] && (
                    <div key={field}>
                      <label className="text-sm font-semibold text-gray-700">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <p className="mt-1 text-gray-900">{profile[field]}</p>
                    </div>
                  )
              )}
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={handleRedeemPoints}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Redeem Points
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
