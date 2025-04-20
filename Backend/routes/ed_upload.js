const express = require("express");
const multer = require("multer");
const ed_upload = require("../Functions/ed_uploadtos3");
const video = require("../Models/video_model")
const fs = require("fs")


const router = express.Router();

const upload = multer({
    dest : "uploads_edited/"
})


router.post("/upload_edited",upload.single("video"), async(req,res) => {
    console.log("📩 Request received"); // ✅ Log request received
    try {   
        const id = String(req.body.id).trim();
        const {tags,title,description} = req.body;
        console.log("uuid: ", id);
        console.log("title: ", title);
        console.log("description: ", description);
        console.log("tags: ", tags);

        if (!id) {
            return res.status(400).send("ID is required");
        }
        const s3key = await ed_upload(req.file.path, req.file.originalname);
        console.log("✅ File uploaded to S3:", s3key);

        const updatedVideo = await video.findOneAndUpdate(
            {uuid : id},
            {
                ed_s3key: s3key,
                tags: tags,
                title: title,
                description: description,
                
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

        fs.unlink(req.file.path, (err) => {
            if (err) console.error("⚠️ Temp file deletion failed:", err);
        });



        res.json({ message: "Edited File uploaded successfully", s3key});
    }catch(err) {


        if (req.file?.path) {
            fs.unlinkSync(req.file.path);
        }

        console.error("❌ Upload failed:", err);
        res.status(500).json({ error: "Upload failed", details: err.message });
    }

})

module.exports = router