const express = require("express")
const Video = require("../Models/edited_video_model");

const router = express.Router();



// ✅ Route: YouTuber retrieves the final edited video
router.get("/final", async (req, res) => {

    const videoId = req.body.id;
    try {
        const video = await Video.findOne({originalVideoId: videoId});
        console.log(video)
        if (!video || !video.s3Url) {
            return res.status(404).json({ message: "Final edited video not found." });
        }

        res.json({ s3Url: video.s3Url });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving final edited video" });
    }
});

module.exports = router;
