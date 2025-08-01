import dotenv from "dotenv";
dotenv.config({path: "./.env"}); 
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

//DEBUGGING .ENV DATA
// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDINARY_API_KEY)
// console.log(process.env.CLOUDINARY_API_SECRET)

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("❌ File not found at path:", localFilePath);
      return null;
    }

    
    // console.log("📤 Uploading file:", localFilePath);

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log(response)
    //const secure_url = response.secure_url    //it give the secure url of the resources
    // console.log("✅ File uploaded successfully:", secure_url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Clean up
    }

    return null;
  }
};

export { uploadOnCloudinary };
