# 📍 SNAP-MAP  
*A hyperlocal, map-based photo sharing app designed for college campuses.*

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

# 📂 Project Structure

```
snap-map/
│
├── contributors/
│   └── <your_roll_number>.txt        # Contributors add their identity files here
│
├── UI-UX/
│   ├── contributors/
|   |   ├──<your_roll>.txt            # Fonts, color palette, spacing rules
│   └── main/                         # Finalized Design
│
├── backend/
│   ├── src/
│   │   ├── models/                   # MongoDB Schemas (User, Photo, Event)
│   │   ├── controllers/              # Backend business logic
│   │   ├── middleware/               # Auth middleware, Clerk verification
│   │   ├── routes/                   # API routes
│   │   ├── utils/                    # Azure Upload service, helpers
│   │   └── config/                   # DB connection config
│   └── package.json
│
└── mobile/
    ├── src/
    │   ├── screens/                  # All React Native screens
    │   ├── components/               # Reusable UI components
    │   ├── navigation/               # Navigation setup
    │   ├── services/                 # API calls, helpers
    │   ├── context/                  # Global state, providers
    │   └── assets/                   # Images, icons, fonts
    └── package.json


```
---

# 🤝 Contributing
- Submit PRs after reading [CONTRIBUTING.md](CONTRIBUTING.md)  

---

# 💬 Contact
Reach out to me on Discord, ID: abdul230898


