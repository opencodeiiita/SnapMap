## Kafka-Based Event Clustering Architecture

### Overview
SnapMap uses an event-driven, Kafka-based architecture to enable autonomous and scalable photo event clustering without impacting upload performance. Instead of running heavy periodic database scans, photo uploads emit lightweight events that are asynchronously processed by background workers.
This design ensures near real-time clustering, horizontal scalability, and fault tolerance, while keeping image uploads fast and reliable.

### Why Kafka (and not direct processing)

Upload APIs must stay fast and non-blocking
Event clustering is compute-heavy and should run asynchronously

Kafka provides: Durable message storage, Replayability, Horizontal scaling via partitions, Natural decoupling of services
(Important: Kafka is used only for metadata, not raw image files.)

### Detailed Flow (step-by-step)

1. Photo Upload: User (Mobile/Web) uploads an image to the backend, Backend stores the image in Azure Blob Storage, Photo metadata is stored in the Photo DB.
2. Kafka Event Emission:After a successful upload, the backend publishes a lightweight Kafka event to the photo-uploads topic:

{
  "photoId": "abc123",
  "timestamp": "2026-01-17T13:20:00Z",
  "location": [81.772379, 25.4301623],
  "storageUrl": "azure://bucket/photo.jpg"
}
This keeps Kafka fast and avoids large payloads.

3. Event Consumption (Autonomous Workers):
Kafka consumers (workers) run continuously and independently.
Worker 1: Event Clustering Worker
Consumes photo-upload events
Performs geo-temporal queries:
Radius ≤ 50 meters,
Time window (e.g., +-5 minutes),
Determines:
Join existing event OR
Create a new event
If an event is created or updated, it emits an internal event or message.

Worker 2: Photo Update Worker
Updates all related photos:
Sets photo.eventId,
Keeps photo updates isolated and idempotent
This separation improves reliability and simplifies retries.

4. Sweeper Job

A lightweight scheduled job runs periodically to:
Detect photos without eventId,
Handle edge cases (missed Kafka events, retries exhausted),
Ensure eventual consistency

5. Data Layer:
Photo Collection, Geo-indexed (2dsphere), Indexed on uploadedAt, Contains eventId, Event Collection, Stores event centroid, radius, timestamps, photo count

6. Fault Tolerance & Reliability:

Kafka retry mechanism for transient failures, Consumer groups allow horizontal scaling, (Optional) Dead Letter Queue (DLQ) for malformed or repeatedly failing messages, Idempotent updates prevent duplicate events

7. Pros / Cons vs Batch Processing:
A. Pros - 

Near real-time clustering, No heavy DB scans, Scales horizontally, Upload performance unaffected, Self-healing and replayable

B. Cons - 

Slightly higher architectural complexity, Requires queue infrastructure (Kafka / compatible system)
