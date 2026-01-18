# SnapMap Android Native Setup Guide (Expo Go → Expo Native)

> Branch: `crop-feature`  
> Purpose: Run SnapMap as a native Android app instead of Expo Go, because required libraries use native code.

---

## Overview

The `crop-feature` branch of SnapMap uses native libraries that are not supported by Expo Go.
To work with these libraries, the app must be run in Expo Native (Bare Workflow) and built directly using Android Studio.

This guide explains:
- How to set up the project in Android Studio
- How to move from Expo Go → Expo Native
- What works successfully
- What currently does not work and why
- Common errors and their meaning

---

## Important Project Structure Note

Although the folder is named `backend/`, this is where the Expo mobile app actually lives.

IMPORTANT: All Expo and Android commands must be run inside the `backend/` directory, not the repository root.

SnapMap/
- backend/   ← Expo / React Native app
- submission/
- README.md

---

## Prerequisites

System Requirements:
- Node.js 18 or higher
- Java JDK 17 (required)
- Android Studio
- Android SDK API 33 or 34
- Android Platform Tools (adb)

Verify installations:
node -v  
java -version  
adb --version

---

## Step-by-Step Setup

### 1. Clone the repository and checkout branch
git clone https://github.com/opencodeiiita/SnapMap.git  
cd SnapMap  
git checkout crop-feature

---

### 2. Navigate to the Expo app directory
cd backend

Do NOT run Expo commands from the repo root.

---

### 3. Install dependencies
npm install

---

### 4. Convert Expo app to Native Android (Bare Workflow)
npx expo prebuild --platform android

Result:
- android/ directory is generated
- Native dependencies are linked
- Expo Go is no longer required

---

### 5. Open the project in Android Studio
- Open Android Studio
- Select Open
- Open the folder: SnapMap/backend/android

Let Gradle sync completely.
If prompted, set Gradle JDK = Java 17.

---

### 6. Build / Run the app
You can run the app using either:

npx expo run:android

OR directly from Android Studio using the Run button.

---

## What Works Successfully

- Expo Go → Expo Native transition works
- expo prebuild succeeds
- Android Studio build succeeds
- Native libraries are correctly linked
- App runs without Expo Go

This confirms that SnapMap can be built as a native Android app.

---

## Common Runtime Error

Unable to resolve module "node:events" from node_modules/express

---

## Why This Error Happens (Core Issue)

Root Cause:
The mobile app imports Node.js backend code.

- server.js is imported into the Expo app
- server.js uses Express
- Express depends on Node standard libraries such as events

React Native does not support Node.js APIs.
This applies to both Expo Go and Expo Native.

This causes Metro bundling to fail.

---

## Important Clarification

This is NOT:
- an Android Studio issue
- an Expo prebuild issue
- a dependency installation issue

This IS an architecture conflict:
Node/Express backend code is mixed into the React Native mobile bundle.

---

## Required Fix

To fully run the app at runtime, one of the following is required:

1. Separate backend and mobile app
   - Express server runs independently
   - Mobile app communicates via API calls

OR

2. Remove or isolate server imports from the mobile entry point

These changes require architectural decisions.

---

## Common Mistakes & Fixes

- Running Expo commands from repo root → Always use backend/
- Using Java versions other than 17 → Use JDK 17 only
- Expecting Express to work inside React Native → Backend must be separate
- Unable to load script error → Run: npx expo start --dev-client

---

## Conclusion

- Native Android build and setup works correctly
- Remaining runtime errors are due to backend/mobile architecture, not setup
- This guide enables contributors to reproduce the native setup and understand current limitations

---

## Environment Used

- OS: Windows
- Node.js: 18+
- Java: JDK 17
- Expo CLI: 54.x
- Android SDK: API 33/34
