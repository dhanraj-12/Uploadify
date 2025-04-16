const express = require("express")
const router = express.Router();
const Video = require("../Models/video_model");

router.get('/assigned', async (req, res) => {
    const { email } = req.query;
    console.log("Email from query:", email);
    
    try {
        const videos = await Video.find({ assignedTo: email });
        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;