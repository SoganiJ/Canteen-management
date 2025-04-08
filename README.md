
**🍽️ Canteen Menu & Review App**

This is a web app built with React and Firebase. Users can view menu items from a canteen, add them to their cart, and leave reviews with star ratings and comments.

---

**🚀 What This App Can Do:**

- Show a list of food items from a canteen
- Let users add items to a cart
- Allow users to submit one review per restaurant
- Display all reviews and show the average rating
- Nice-looking, mobile-friendly design using Tailwind CSS

---

**🛠️ Tools Used:**

- React (for the frontend)
- Firebase Firestore (for storing menu, reviews, etc.)
- Firebase Authentication (to check if a user is logged in)
- Tailwind CSS (for styling)
- React Router (to handle pages)
- React Context (for managing the cart globally)

---

**📁 Folder Overview:**

```
src/
├── components/
│   └── RestaurantMenu.jsx   --> Main component for menu and reviews
├── CartContext.js           --> Code to manage cart
├── firebase.js              --> Firebase configuration
├── App.jsx / index.js       --> Main files to run the app
```

---

**📦 How to Set It Up:**

1. Clone the project:
   ```
   git clone https://github.com/your-username/restaurant-menu-app.git
   cd restaurant-menu-app
   ```

2. Install the required packages:
   ```
   npm install
   ```

3. Create a Firebase project:
   - Go to [https://console.firebase.google.com](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore and Authentication
   - Copy the Firebase config and paste it inside `firebase.js`

4. Run the app:
   ```
   npm run dev
   ```

---

**📌 Firestore Database Structure:**

```
restaurants (collection)
  └── restaurantId (document)
      ├── restaurantName
      ├── menu (subcollection)
      │   └── itemId (with name, price)
      └── reviews (subcollection)
          └── reviewId (with userId, rating, comment, timestamp)
```

---

**🧠 Possible Improvements (Optional):**

- Show reviewer's name from Firebase Auth
- Make reviews and menu auto-update in real-time
- Add a payment system to cart
- Add dark mode

---

**🤝 Want to Help?**

You can fork the repo, make changes, and create pull requests. Suggestions are welcome!

---

**📃 License:**

This project is under the MIT license. You’re free to use and modify it.

