# 📍 SnapMap

_A hyperlocal, map-based photo sharing app designed for college campuses._

SNAP-MAP allows students to instantly capture photos and share them on a live campus map. All photos are geo-tagged, stored securely, and shown as clusters/bubbles on a dynamic map. Students can explore events happening around them, view photos contributed by others, and participate in the campus community in real time.

---

# 🚀 Features

### 📸 Camera & Upload

- Capture photos directly using the in-app camera
- Auto-attaches GPS coordinates
- Uploads securely to Azure Blob Storage
- Preview + retake option

### 🗺️ Map-Based Discovery

- Interactive map with user location
- Bubbles indicate photos uploaded around campus
- Clustered markers for multiple events or heavy hotspots
- Tap a bubble → see **All Photos** or **Event-wise Photos**

### 🎉 Event Clustering

- System auto-detects events based on photo density + proximity
- Groups photos under event IDs
- Shows “hotspot” visuals on the map

### 👤 User Accounts (via Clerk)

- College email login (domain restricted)
- Secure sessions
- View your uploaded photos
- Manage profile + logout

### 📂 Profile & Gallery

- All uploads in a grid
- Delete option
- Event galleries with horizontal swipe viewer

---

# 🧱 Tech Stack

### **Frontend**

- React Native (Expo)
- Expo Camera + Expo Location
- Mapbox or react-native-maps
- Axios for API calls
- Clerk for authentication

### **Backend**

- Node.js + Express
- Clerk server-side JWT verification
- Mongoose + MongoDB Atlas
- Azure Blob Storage (file storage only)

### **Database**

- **MongoDB Atlas**
  - Users
  - Photos
  - Events
  - Geospatial queries enabled

### **File Storage**

- **Azure Blob Storage**
  - All images compressed + uploaded here
  - URLs stored in MongoDB

---

# 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`

### **Health Check**

#### `GET /health`

- **Description:** Server health check
- **Auth Required:** No
- **Response:**
  ```json
  { "status": "ok" }
  ```

---

### **Authentication**

#### `POST /auth/login`

- **Description:** User login endpoint (placeholder)
- **Auth Required:** No
- **Response:** `"Login call"`

#### `POST /auth/signup`

- **Description:** Register a new user with Clerk authentication
- **Auth Required:** Yes (Clerk JWT)
- **Request Body:**
  ```json
  {
    "clerkId": "string",
    "email": "string",
    "rollNumber": "string"
  }
  ```

#### `POST /auth/profile-update`

- **Description:** Update user profile information
- **Auth Required:** Yes (Clerk JWT)
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `profileImg` (file): Profile image (max 10MB)
  - Other user fields

---

### **Photos**

#### `GET /photos/ping`

- **Description:** Photo service health check
- **Auth Required:** No
- **Response:**
  ```json
  { "pong": true }
  ```

#### `POST /photos/upload-photo`

- **Description:** Upload a single photo with GPS coordinates
- **Auth Required:** Yes (Clerk JWT)
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `photo` (file): Image file (max 10MB)
  - `latitude` (number): GPS latitude
  - `longitude` (number): GPS longitude
- **Response:** Photo object with Azure Blob URL

#### `POST /photos/upload-photos`

- **Description:** Upload multiple photos (max 10) at once
- **Auth Required:** Yes (Clerk JWT)
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `photos[]` (files): Up to 10 image files
  - GPS coordinates for each photo
- **Response:** Array of photo objects

#### `POST /photos/test-upload`

- **Description:** Test photo upload endpoint (for debugging)
- **Auth Required:** No
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `photo` (file): Test image file

#### `GET /photos/all-photos`

- **Description:** Retrieve all uploaded photos
- **Auth Required:** No
- **Response:** Array of all photo objects with URLs and metadata

---

# API Endpoints

All routes are under `/api/v1`

**Health**
- `GET /health` - just returns `{ status: "ok" }`

**Auth**
- `POST /auth/login` - login
- `POST /auth/signup` - register (needs auth header)
- `POST /auth/profile-update` - update profile pic etc, send profileImg in form-data
- `GET /auth/get-profile` - fetch logged in user's profile

**Photos**
- `GET /photos/ping` - returns `{ pong: true }`, good for testing
- `GET /photos/all-photos` - get all photos from db
- `POST /photos/upload-photo` - upload single photo (field: `photo`)
- `POST /photos/upload-photos` - batch upload, max 10 (field: `photos[]`)
- `POST /photos/test-upload` - same as upload but no auth, for testing

Auth routes need `Authorization: Bearer <clerk_token>` header. Max image size is 10MB.

---

# 📂 Project Structure

```
SnapMap/                         → Project root
│
│   CONTRIBUTING.md               → Contribution guidelines
│   README.md                     → Project overview
│
├── backend/                      → Backend API
│   │   package-lock.json
│   │   package.json
│   │   server.js                 → Server entry point
│   │   v1.js                     → /api/v1 all routes are here
│   │
│   ├── config/
│   ├── controllers/              → Request handlers
│   ├── db/                       → Database setup
│   ├── middleware/               → Request middleware
│   ├── models/                   → Database models
│   ├── routes/                   → API routes
│   └── utils/                    → Helper utilities
│
├── contributors/                 → Contributor records
│   └── <your_roll_no>.txt
│
├── frontend/                     → Mobile frontend
│   │   .gitignore
│   │   app.config.ts             → Expo app config
│   │   babel.config.js
│   │   index.js                  → App entry point
│   │   package-lock.json
│   │   package.json
│   │
│   ├── .expo/
│   │   │   devices.json
│   │   │   README.md
│   │   │   settings.json
│   │
│   └── src/
│       │   App.js                → Root component
│       │
│       ├── assets/               → Images & fonts
│       ├── components/           → Reusable UI
│       ├── context/
│       ├── navigation/           → App navigation
│       ├── screens/              → App screens
│       └── services/             → API services
│
└── UI-UX/                        → Design resources
    └── contributors/             → UI/UX credits

```

---

# 🤝 Contributing

- Submit PRs after reading [CONTRIBUTING.md](CONTRIBUTING.md)

---

# 💬 Contact

Reach out to me on Discord, ID: `terrormanzero` aka `terror_quota`

Our Server: https://bit.ly/OpencodeDiscord
