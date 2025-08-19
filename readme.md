# YouTube‑Style Backend – Models, Routing, Multer & Cloudinary

A concise reference for setting up core models (User, Video, Subscription), routing, file uploads (Multer), and media storage (Cloudinary) in a Node.js/Express/MongoDB project.

---

## Tech Stack

* Runtime: Node.js (ES Modules)
* Framework: Express.js
* Database/ODM: MongoDB with Mongoose
* Authentication: JWT (access + refresh)
* Uploads: Multer (disk storage)
* Media Storage: Cloudinary
* Validation: zod or express-validator
* Utilities: dotenv,cors

---

## Suggested Folder Structure

```
project/
└─ src/
   ├─ db/
   ├─ models/
   ├─ routes/
   ├─ controllers/
   ├─ middlewares/
   ├─ utils/
index.js
app.js
constants.js
.env
```

---

## Environment Variables

* **App**: Port, environment, client URL
* **MongoDB**: Connection URI
* **Auth**: Secrets and expiry times for access and refresh tokens
* **Cloudinary**: Cloud name, API key, API secret, default folder

---

## Database Config

Centralized MongoDB connection setup for reusability.

---

## Cloudinary Config

* Configure Cloudinary with credentials from environment variables.
* Provide helpers for uploading and deleting media files.

---

## Multer Setup

* Temporary local storage for uploaded files.
* Restrict to specific MIME types (images and videos).
* Enforce file size limit (e.g., 200MB).

---

## Models

### User Model

* Fields: username, email, full name, avatar, cover image, password, refresh token
* Features: password hashing, password comparison

### Video Model

* Fields: owner (user reference), title, description, tags, thumbnail, video file (with metadata), published flag, views, likes count
* Indexed for search and queries

### Subscription Model

* Fields: subscriber (user), channel (user)
* Unique combination of subscriber and channel

> Optional: Comment, Like, Playlist models

---

## Auth Middleware

* Extract JWT from headers
* Verify token and attach user to request
* Reject unauthorized or invalid tokens

---

## Core Controllers (high‑level responsibilities)

### Authentication

* **Register**: Create new user, upload optional avatar, return tokens
* **Login**: Validate credentials, return tokens
* **Refresh**: Issue new access and refresh tokens

### Videos

* **Create Video**: Upload video and optional thumbnail, save metadata
* **List Videos**: Search/filter videos, paginate results
* **Increment View**: Increase video view count

### Subscriptions

* **Subscribe/Unsubscribe**: Manage relationships between subscriber and channel
* **List Subscriptions**: Show a user’s subscriptions or subscribers

---

## Routing

* **Auth Routes**: Register, login, refresh
* **User Routes**: Profile, update, avatar upload
* **Video Routes**: Upload, list, view count increment
* **Subscription Routes**: Subscribe, unsubscribe, list

---

## Notes

* Extend with additional models (likes, comments, playlists) as needed
