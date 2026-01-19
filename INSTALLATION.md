# 🧰 Project Setup Guide (Fork → Clone → Run)

## 📦 1. Prerequisites

### Install Node.js + npm  
👉 https://nodejs.org/

### Install Expo Go (for mobile testing)
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent  
- iOS: https://apps.apple.com/app/expo-go/id982107779  

---

## 🍴 2. Fork the Repository
1. Open the GitHub repo  
2. Click **Fork**  
3. Choose your GitHub profile  

---

## 📥 3. Clone to Local Machine

```bash
git clone https://github.com/<your-username>/SnapMap.git
cd SnapMap/
```

---

## 📁 4. Install Dependencies

```bash
cd frontend 
npm install
```

---

## ▶️ 5. Start the Mobile App
Note: Make sure you are in the mobile folder
```bash
npx expo start
```

Scan the QR code using the Expo Go app.

---

## 📡 6. Important: WiFi / Network Requirements

Your **laptop** and **mobile device must be on the same network**.

### ✅ Recommended
- Turn on **Mobile Hotspot**  
- Connect your laptop to it  
- This avoids proxy/firewall issues  

### ❌ Avoid
- IIITA Campus WiFi  
- Hostel WiFi (proxy-enabled)  
- Any network with firewall restrictions  

Expo will **not work** reliably on these.

---

Any issue you encounter while setting up, ask me on Discord.

My Discord Handle is mentioned in the [README.md](README.md)