# SnapMap Setup

Before you start, you'll need:

- Node.js v16+
- npm
- An Azure account (free credits with GitHub Student Pack)
- A Clerk account
- an Azure account (for image storage)
- a Clerk account (for authentication)
- If you have the GitHub Student Developer Pack, you’ll get free Azure credits, which is more than enough.

1. Go to https://portal.azure.com and create a storage account
2. Inside that, create a container called `snapmap-images`
3. Set the container's access level to "Blob" (so images are publicly readable)
4. Go to Access keys and copy the connection string

## Clerk Setup

1. Create an app at https://clerk.com
2. Grab your publishable key (frontend) and secret key (backend) from the dashboard

## Backend

Git

Check using:

```
node -v
npm -v
git --version
```

### Azure Blob Storage Setup (Required)

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
PORT=5000
MONGODB_URI=your_mongo_uri
AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
AZURE_BLOB_CONTAINER=snapmap-images
CLERK_SECRET_KEY=your_secret_key
```

⚠️ Do not commit this file.

### Kafka Setup (for metadata events)

SnapMap uses Kafka for metadata events (not image payloads). Add these to `backend/.env`:

```
# Comma-separated broker list (local or cloud)
KAFKA_BROKERS=localhost:9092
# Identifier for this app
KAFKA_CLIENT_ID=snapmap-backend
# Optional SASL auth (leave empty if not used)
KAFKA_USERNAME=
KAFKA_PASSWORD=
```

Where to get these values:
- Local broker: set `KAFKA_BROKERS=localhost:9092` (or the host:port you expose when you start Kafka).
- Hosted providers (Confluent, Aiven, Upstash, etc.): use the provider’s bootstrap servers for `KAFKA_BROKERS` (comma-separated if multiple). If the provider gives an API key/secret or service account credentials, map them to `KAFKA_USERNAME` and `KAFKA_PASSWORD`. Leave them empty if your cluster allows unauthenticated access.

Create the topics on your Kafka cluster:
- `photo-uploads`
- `event-updates`
- `photo-dlq` (optional dead-letter queue)

How to install/run Kafka locally (Docker, KRaft single node):
- Prereq: Install Docker Desktop if you don’t have Docker (https://www.docker.com/products/docker-desktop). Verify with `docker --version`.
- Pull image: `docker pull apache/kafka:4.2.0-rc1`
- Run (PowerShell one-liner):
```
docker run -d --name snapmap-kafka -p 9092:9092 -p 9093:9093 -e KAFKA_NODE_ID=1 -e KAFKA_PROCESS_ROLES=broker,controller -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1 -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 -e KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0 -e KAFKA_LOG_DIRS=/tmp/kraft-combined-logs apache/kafka:4.2.0-rc1
```
- Then create the topics (against localhost:9092):
```
docker exec -it snapmap-kafka /opt/kafka/bin/kafka-topics.sh --create --topic photo-uploads --bootstrap-server localhost:9092
docker exec -it snapmap-kafka /opt/kafka/bin/kafka-topics.sh --create --topic event-updates --bootstrap-server localhost:9092
docker exec -it snapmap-kafka /opt/kafka/bin/kafka-topics.sh --create --topic photo-dlq --bootstrap-server localhost:9092
```
- Set `KAFKA_BROKERS=localhost:9092` in `backend/.env`.

If you use a hosted Kafka service, set `KAFKA_BROKERS` to the provider's bootstrap hosts and fill `KAFKA_USERNAME`/`KAFKA_PASSWORD` only if SASL is required.

### Event Clustering Worker: run and test locally

Start the app and upload 5 - 6 photos and note their details 
then in separate terminal do the following
-----------------------:

Env knobs (in `backend/.env`, defaults):
```
EVENT_DISTANCE_THRESHOLD_METERS=75
EVENT_TIME_WINDOW_MINUTES=15
MIN_PHOTOS_FOR_EVENT=5   # lower to 3 for quick local tests
EVENT_CLUSTERING_CONSUMER_GROUP=snapmap-event-clustering
```

Run the worker (from `backend/`):
```
npm run worker:cluster
```
You should see: “Listening on topic photo-uploads …”

Quick manual test (PowerShell):
1) Get photoIds/coords/timestamps already in Mongo:
```
mongosh "mongodb://localhost:27017/snapmap" --eval 'db.photos.find({}, { _id:1, location:1, timestamp:1 }).sort({timestamp:-1}).limit(5).pretty()'
```
2) Produce messages (one line each):
```
docker exec -it snapmap-kafka /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic photo-uploads
{"photoId":"<id1>","timestamp":"...","location":[<lon>,<lat>]}
{"photoId":"<id2>","timestamp":"...","location":[<lon>,<lat>]}
...send at least MIN_PHOTOS_FOR_EVENT...
```
3) Observe worker logs for `action: created/updated`. To view emitted assignments:
```
docker exec -it snapmap-kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic event-updates --from-beginning


### Clerk Authentication Setup

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

## Backend Setup

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

```
Welcome to SnapMap API
```

## Frontend Setup

### Step 12: Install Dependencies

```
cd frontend
npm install
npx expo start
```

### Step 13: Start Frontend

```
npx expo start --tunnel
```

Scan the QR with Expo Go on your phone. Make sure phone and laptop are on same wifi.

## Notes

- Do not commit .env files
- Azure container needs to be public
- Your phone needs to reach your laptop's IP for the app to work
- Backend image upload relies on Azure setup from PR #174
