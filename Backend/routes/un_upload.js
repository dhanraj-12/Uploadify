const express = require("express");
const multer = require("multer");
const uploadToS3 = require("../Functions/UploadtoS3.")
const Video = require("../Models/video_model");
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

const upload = multer({
    dest : "uploads/"
})

router.post("/upload_unedited", upload.single("video"), async (req, res) => {
    console.log("📩 Upload request received");
    
    try {
        // Validate required fields
        const { editormail, title, clientNotes, deadline, ytmail } = req.body;
        if (!editormail || !title) {
            return res.status(400).json({ 
                message: "Editor email and video title are required" 
            });
        }

        // Validate file
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded" });
        }

        console.log("🛠 Uploading file to S3...");
        const s3key = await uploadToS3(
            req.file.path, 
            req.file.originalname,
            req.file.mimetype // Pass MIME type for proper content-type
        );

        console.log(`this is yt mail ${ytmail}`);
        console.log("✅ File uploaded to S3:", s3key);

        // Create video document with additional metadata
        const newVideo = new Video({
            uuid: uuidv4(), // Generate a unique ID
            title,
            fileName: req.file.originalname,
            uned_s3Key: s3key,
            assignedTo: editormail,
            clientNotes,
            ed_s3key: null, // Initially null
            ytmail,
            deadline: deadline || null, // Optional field
            status: "pending",
            metadata: {
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });

        await newVideo.save();

        // Cleanup: Delete temporary file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("⚠️ Temp file deletion failed:", err);
        });

        res.status(201).json({ 
            success: true,
            videoId: newVideo._id,
            s3Key: s3key,
            status: "pending"
        });

    } catch (err) {
        console.error("❌ Upload failed:", err);
        
        // Cleanup on error
        if (req.file?.path) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ 
            success: false,
            error: "Upload processing failed",
            details: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
});

module.exports = router