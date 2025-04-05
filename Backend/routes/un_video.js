const express = require("express")
const Video = require("../Models/video_model");

const router = express.Router();

router.get('/assigned/:email', async (req, res) => {
    const { email } = req.params;
    const videos = await Video.find({ assignedTo: email });

    res.status(200).json(videos);
});

module.exports = router;