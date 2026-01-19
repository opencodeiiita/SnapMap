import User from "../models/User.js"
import { createClerkClient } from "@clerk/backend"
import crypto from "crypto";
import path from "path";
import uploadToAzure from "../utils/azure.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const registerUser = async(req,res) => {
    try {
        console.log("REGISTER USER CALLED")
        console.log(req.body)
        
        const clerkUserId = req.userId

        const{name, email, collegeName, phoneNumber, year, gender} = req.body

        if(!name || !email || !collegeName) 
            return res.status(400).json({message: "Please fill in all required fields"})

        const existingUser = await User.findOne({clerkUserId})

        if(existingUser)
            return res.status(400).json({message: "User already exists"})

        const user = await User.create({
        clerkUserId,
        name,
        email,
        collegeName,
        phoneNumber,
        year,
        gender,
        })

        // Update Clerk publicMetadata to mark user as registered
        try {
            await clerkClient.users.updateUser(clerkUserId, {
                publicMetadata: {
                    isRegistered: true,
                },
            });
            console.log("Clerk publicMetadata updated successfully");
        } catch (clerkError) {
            console.error("Failed to update Clerk metadata:", clerkError);
            // Continue anyway since database registration succeeded
        }

        return res.status(201).json({message: "User registered successfully",user,});

        
    } catch (error) {
    console.error("REGISTER USER ERROR", error);
    return res.status(500).json({message: "Internal server error" })

    }
}

export const profileUpdate = async (req, res) => {
    try {
        console.log("PROFILE UPDATE CALLED");
        console.log("Request body:", req.body);
        console.log("File info:", req.file ? { size: req.file.size, mimetype: req.file.mimetype } : "No file");
        
        const clerkUserId = req.userId;
        
        if (!clerkUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        // Find the user
        const user = await User.findOne({ clerkUserId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Extract fields from request body
        const { name, bio, phoneNo, collegeName, year } = req.body;
        
        // Prepare update object with only provided fields
        const updateFields = {};
        
        if (name !== undefined) {
            updateFields.name = name;
        }
        
        if (bio !== undefined) {
            updateFields.bio = bio;
        }
        
        if (phoneNo !== undefined) {
            updateFields.phoneNumber = phoneNo;
        }
        
        if (collegeName !== undefined) {
            updateFields.collegeName = collegeName;
        }
        
        if (year !== undefined) {
            updateFields.year = year;
        }
        
        // Handle profile image upload if provided
        if (req.file && req.file.buffer) {
            try {
                const ext = path.extname(req.file.originalname || "").toLowerCase();
                const safeExt = ext && ext.length <= 10 ? ext : ".jpg";
                const id = crypto.randomUUID();
                const fileName = `${clerkUserId}/profile/${Date.now()}-${id}${safeExt}`;
                
                const imageUrl = await uploadToAzure(req.file.buffer, fileName);
                console.log("Profile image uploaded successfully:", imageUrl);
                updateFields.profileImage = imageUrl;
            } catch (uploadError) {
                console.error("Error uploading profile image:", uploadError);
                return res.status(500).json({ message: "Failed to upload profile image: " + uploadError.message });
            }
        }
        
        // Check if there are any fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }
        
        // Update the user
        const updatedUser = await User.findOneAndUpdate(
            { clerkUserId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        
        console.log("User profile updated successfully:", updatedUser._id);
        
        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
        
    } catch (error) {
        console.error("PROFILE UPDATE ERROR", error);
        return res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

