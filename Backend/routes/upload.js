const express = require("express");
const multer = require("multer");
const uploadToS3 = require("../UploadtoS3.")
const video = require("../Models/video");


const router = express.Router();

const upload = multer({
    dest : "uploads/"
})


router.post("/upload",upload.single("video"), async(req,res) => {
    console.log("📩 Request received"); // ✅ Log request received
    try {   
        const editormail  = req.body.editormail;
        if (!editormail) return res.status(400).json({ message: "Editor email is required" })
    
        console.log("🛠 Uploading file to S3...");
        const fileUrl = await uploadToS3(req.file.path, req.file.originalname);
        console.log("✅ File uploaded to S3:", fileUrl);

        const newVideo = new video({
            fileName: req.file.originalname,
            s3Url: fileUrl,
            assignedTo: editormail
        });
        
        console.log("💾 Saving to database...");
        await newVideo.save();
        console.log("✅ Video saved!");

        res.json({ message: "File uploaded successfully", fileUrl });
    }catch(err) {
        console.error("❌ Upload failed:", err);
        res.status(500).json({ error: "Upload failed", details: err.message });
    }

})

module.exports = router