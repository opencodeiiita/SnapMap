# SnapMap – Setup Guide

This document explains how to set up SnapMap completely on your local system.
⚠️ Note: To run SnapMap properly, you must create:

> an Azure account (for image storage)
> a Clerk account (for authentication)
> If you have the GitHub Student Developer Pack, you’ll get free Azure credits, which is more than enough.

## Prerequisites

Make sure these are installed before starting:

```bash
Node.js (v16 or above)

npm

Git
```

Check using:

```
node -v
npm -v
git --version
```

Azure Blob Storage Setup (Required)

SnapMap stores uploaded images in Azure Blob Storage.
This is required because the backend uses Azure SDK functions added in PR #174.

### Step 1: Create Azure Account

Go to https://portal.azure.com

Sign in or create an account.

(Students can activate Azure credits via GitHub Student Pack.)

### Step 2: Create Storage Account

Azure Portal → Create a resource

Search Storage account

Fill required fields:

```md
- Resource Group → create new

- Storage account name → any unique name

- Region → any

- Click Create
```

### Step 3: Create Blob Container

```
- Open the Storage Account
- Go to Containers
- Click Create
- Set:
Name: snapmap-images
Public access level: Blob
```

This is important — images must be publicly readable.

### Step 4: Get Connection String

Storage Account → Access keys

Copy Connection string (Key1)

### Step 5: Backend Environment Variables

Create a .env file inside the backend folder:

```
AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
AZURE_BLOB_CONTAINER=snapmap-images
```

⚠️ Do not commit this file.

Clerk Authentication Setup

SnapMap uses Clerk for authentication.

#### Step 6: Create Clerk App

```
Go to https://clerk.com
```

Create a new application.

### Step 7: Get Clerk Keys

In Clerk dashboard → API Keys

You will find:

```md
Publishable key (for frontend)

Secret key (for backend)
```

### Step 8: Backend Clerk Config

Add to backend/.env:

```
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Step 9: Frontend Clerk Config

Create or update frontend/.env:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

> **Note:** If deploying backend to production, update `EXPO_PUBLIC_API_BASE_URL` to your deployed backend URL.

Backend Setup

### Step 10: Install & Run Backend

```
cd backend
npm install
npm run dev
```

Expected output:

```
Server running on port 5000
MongoDB connected successfully
```

### Step 11: Test Backend

Open in browser:

```
http://localhost:5000
```

You should see:

Welcome to SnapMap API

Frontend Setup

### Step 12: Install Dependencies

```
cd frontend
npm install
```

### Step 13: Start Frontend\

```
npx expo start --tunnel
```

Final Notes

```
Do not commit .env files
```

Azure Blob container must be public

Clerk keys must match frontend/backend usage

Backend image upload relies on Azure setup from PR #174
