import {BlobServiceClient} from "@azure/storage-blob"
import { configDotenv } from "dotenv"

configDotenv()

const CONTAINER_NAME = process.env.CONTAINER_NAME

async function uploadToAzure(buffer, fileName) {
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

export default uploadToAzure
