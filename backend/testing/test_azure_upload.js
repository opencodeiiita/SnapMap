import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import uploadToAzure from "../utils/azure.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function testUpload() {
  try {
    
    const imagePath = path.join(__dirname, "test2.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = `test_${Date.now()}.jpg`;
    const imageUrl = await uploadToAzure(imageBuffer, fileName);

    console.log(" Upload successful!");
    console.log(" Image URL:", imageUrl);

    const outputPath = path.join(__dirname, "IMG_URLS.txt");
    fs.appendFileSync(outputPath, imageUrl + "\n");

  } catch (error) {
    console.error(" Azure upload test failed:", error.message);
  }
}

testUpload();
