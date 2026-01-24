import {BlobServiceClient} from "@azure/storage-blob"
import { configDotenv } from "dotenv"
import path from "path";
import crypto from "crypto";

configDotenv()

const CONTAINER_NAME = process.env.CONTAINER_NAME

async function singleUploadToAzure(buffer, fileName) {
    if(!buffer || !fileName)
        throw new Error("Buffer and Filename are required")

    if(!process.env.AZURE_STORAGE_CONNECTION)
        throw new Error("Connection string is required")


    const blobServiceClient = BlobServiceClient.fromConnectionString(         
        process.env.AZURE_STORAGE_CONNECTION                                    // 1. Create a Service Client
    )

    try {
        await blobServiceClient.getAccountInfo();
        console.log(" Azure Blob Storage Connected");
    } catch (err) {
        console.error(" Azure Blob Connection Failed:", err.message);
        throw err;
    }


    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME)  // 2. Get Container Client

    await containerClient.createIfNotExists({                                   // 3. Create Container Client if not exists
        access: "blob",
    })

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);       // 4. Create Blob Client
    await blockBlobClient.uploadData(buffer);                                   // 5. Upload Buffer
    return blockBlobClient.url

}

async function multiUploadToAzure(fileBuffers, fileNames) {
  if (!Array.isArray(fileBuffers) || !Array.isArray(fileNames)) {
    throw new Error("Invalid upload params");
  }

  if (fileBuffers.length !== fileNames.length) {
    throw new Error("Buffers and filenames count mismatch");
  }

  if (!process.env.AZURE_STORAGE_CONNECTION) {
    throw new Error("Connection string is required");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION
  );

  await blobServiceClient.getAccountInfo();

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  await containerClient.createIfNotExists({ access: "blob" });

  const urls = [];

  for (let i = 0; i < fileBuffers.length; i++) {
    const blockBlobClient = containerClient.getBlockBlobClient(fileNames[i]);
    await blockBlobClient.uploadData(fileBuffers[i]);
    urls.push(blockBlobClient.url);
  }

  return urls;
}

async function profileImageUploadToAzure(file, userId) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : ".jpg";
    const id = crypto.randomUUID();
    const fileName = `${userId}/profile/${Date.now()}-${id}${safeExt}`;
    
    const imageUrl = await singleUploadToAzure(file.buffer, fileName);
    console.log("Profile image uploaded successfully:", imageUrl);
    return imageUrl;
}

async function deleteFromAzure(blobUrl) {
    if (!blobUrl || typeof blobUrl !== "string") {
        throw new Error("Blob URL is required");
    }

    if (!process.env.AZURE_STORAGE_CONNECTION) {
        throw new Error("Connection string is required");
    }

    let containerName = CONTAINER_NAME;
    let blobName;

    try {
        const parsedUrl = new URL(blobUrl);
        const parts = parsedUrl.pathname.replace(/^\/+/, "").split("/");
        if (parts.length < 2) {
            throw new Error("Container or blob path missing in URL");
        }
        [containerName, ...blobName] = parts;
        blobName = decodeURIComponent(blobName.join("/"));
    } catch (err) {
        throw new Error(`Invalid blob URL: ${err.message}`);
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION
    );

    await blobServiceClient.getAccountInfo();

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const result = await blobClient.deleteIfExists();

    if (!result.succeeded) {
        console.warn(`Blob not found or already deleted: ${blobUrl}`);
    }
    
    return result.succeeded;
}

export { singleUploadToAzure, multiUploadToAzure, profileImageUploadToAzure, deleteFromAzure };
