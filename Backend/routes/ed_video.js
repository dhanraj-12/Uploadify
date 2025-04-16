const express = require("express");
const Video = require("../Models/video_model");
const router = express.Router();

// ✅ Route: YouTuber retrieves the final edited video
router.get("/final", async (req, res) => {
  const { ytmail } = req.query; // Destructure from query params
  
  // Validate input
  if (!ytmail) {
    return res.status(400).json({ 
      error: "Validation Error",
      message: "ytmail query parameter is required" 
    });
  }

  try {
    const videos = await Video.find({ ytmail }).lean(); // .lean() for better performance
    
    if (videos.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Transform data if needed (example)
    const response = videos.map(video => (video));
    console.log("Videos retrieved successfully:", response);
    res.json(response);
  } catch (error) {
    console.error("Error retrieving videos:", error);
    res.status(500).json({ 
      error: "Server Error",
      message: "Failed to retrieve videos. Please try again later."
    });
  }
});

module.exports = router;