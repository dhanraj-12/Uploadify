const express = require("express");
const multer = require("multer");
const ed_upload = require("../Functions/ed_uploadtos3");
const video = require("../Models/edited_video_model")

const router = express.Router();

const upload = multer({
    dest : "uploads_edited/"
})


router.post("/upload_edited",upload.single("video"), async(req,res) => {
    console.log("📩 Request received"); // ✅ Log request received
    try {   
        const video_id = req.body.video_id;
        console.log("🛠 Uploading file to S3...");
        const fileUrl = await ed_upload(req.file.path, req.file.originalname);
        console.log("✅ File uploaded to S3:", fileUrl);

        const newVideo = new video({
            fileName: req.file.originalname,
            s3Url: fileUrl,
            status : "edited",
            originalVideoId : video_id
        });
        
        console.log("💾 Saving to database...");
        await newVideo.save();
        console.log("✅ Video saved!");

        res.json({ message: "Edited File uploaded successfully", fileUrl});
    }catch(err) {
        console.error("❌ Upload failed:", err);
        res.status(500).json({ error: "Upload failed", details: err.message });
    }

})

module.exports = router