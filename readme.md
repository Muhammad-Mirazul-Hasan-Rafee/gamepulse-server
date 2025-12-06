# 🎮 Chill Gamer — Backend API

A scalable Node.js + Express backend powering a full game-review platform.
This service manages reviews, likes, user-specific filtering, and secure CRUD operations with MongoDB Atlas.



## 🚀 Features (Backend Highlights)

### **✔ Review Management**

* Create, read, update, and delete game reviews.
* Fetch all reviews or filter by user ID.

### **✔ Like System with Toggle Logic**

* API supports **like/unlike** using an intelligent toggle mechanism.
* Tracks:

  * `totalLikes`
  * `likedBy` → array of user UIDs
* Ensures idempotent operations (no double likes, no negative likes).

### **✔ Secure Environment Configuration**

* Environment variables handled using **dotenv**.
* Protects DB credentials and other sensitive configs.

### **✔ Clean MongoDB Data Modeling**

Every review document includes:

`json
{
  "gameTitle": "",
  "thumbnail": "",
  "reviewDescription": "",
  "uid": "",
  "userPhoto": "",
  "totalLikes": 0,
  "likedBy": []
}
`

### **✔ CORS Enabled for Cross-Origin Clients**

Supports modern frontend apps (React, Next.js, etc.).

---

## 🛠 Technologies Used

| Tech              | Purpose                       |
| ----------------- | ----------------------------- |
| **Node.js**       | Runtime                       |
| **Express.js**    | Routing & API development     |
| **MongoDB Atlas** | NoSQL Database                |
| **dotenv**        | Secure environment management |
| **CORS**          | Client-server communication   |

---

## 📁 Project Structure


/server
 ├── index.js
 ├── .env
 ├── package.json
 ├── /routes
 └── /controllers




## 🔑 Environment Setup

Create a `.env` file:


PORT=8000
DB_USER=yourMongoUser
DB_PASS=yourMongoPassword




## 📡 API Endpoints

### **1️⃣ Create Review**

`POST /game`
Creates a new review with default like fields.

### **2️⃣ Get All Reviews**

`GET /game`
Optional: `?uid=` filters by user.

### **3️⃣ Get Single Review**

`GET /game/:id`

### **4️⃣ Update Review**

`PUT /game/:id`

### **5️⃣ Delete Review**

`DELETE /game/:id`

### **6️⃣ Like / Unlike Review**

`POST /game/:id/like`
Request body:

json
{
  "uid": "USER_UNIQUE_ID"
}


Toggles like/unlike based on previous state.



## ❤️ Like Toggle Logic (Core Innovation)

The server ensures consistent behavior:

* If user already liked → **unlike**
* If user hasn’t liked → **add like**

Benefits:

* No duplicated likes
* Prevents race conditions
* Clean DB state



## ▶ How to Run Locally


npm install
npm start


Server will run on:


http://localhost:8000



## 🌐 Deployed Server (If Applicable)

I will add a live API link here.



## 📌 Summary

This backend is built for scalability, clarity, and production-readiness.
It handles secure data flow, clean CRUD operations, and an optimized like system — ideal for any modern review-based application.


