const express = require("express");
const multer = require("multer");
const ed_upload = require("../Functions/ed_uploadtos3");
const video = require("../Models/video_model")

const router = express.Router();

const upload = multer({
    dest : "uploads_edited/"
})


router.post("/upload_edited",upload.single("video"), async(req,res) => {
    console.log("📩 Request received"); // ✅ Log request received
    try {   
        const id = String(req.body.id).trim();
        console.log("uuid: ", id);
        if (!id) {
            return res.status(400).send("ID is required");
        }
        const s3key = await ed_upload(req.file.path, req.file.originalname);
        console.log("✅ File uploaded to S3:", s3key);

        const updatedVideo = await video.findOneAndUpdate(
            {uuid : id},
            {
                ed_s3key: s3key,
                
            },
            { new: true } // Return the updated document
        );

        const find = await video.findOne({uuid : id});
        console.log("Found video:", find);
        console.log("Updated video:", updatedVideo);
        if (updatedVideo) {
            console.log("💾 Database updated successfully:", updatedVideo);
        } else {
            console.warn("⚠️ No matching video found with UUID:", id);
        }
        
        
        console.log("💾 Saving to database...");
        console.log("✅ Video saved!");

        res.json({ message: "Edited File uploaded successfully", s3key});
    }catch(err) {
        console.error("❌ Upload failed:", err);
        res.status(500).json({ error: "Upload failed", details: err.message });
    }

})

module.exports = router