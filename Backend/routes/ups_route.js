const express = require('express');
const router = express.Router();
const Video = require('../Models/video_model');

// Update editor comments
// Update video status
const mongoose = require('mongoose');

router.patch('/videos/status', async (req, res) => {
  const validStatuses = ['pending', 'in-progress', 'needs-review', 'completed', 'rejected'];

  if (!validStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  console.log(req.body);
  const id = req.body.videoId;
  console.log("Status to be updated:", req.body.status);
  console.log("Video ID:", id);


  try {
    const video = await Video.findOneAndUpdate(
      {uuid : id},
      { status: req.body.status },
      { new: true }
    );

    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: 'Status update failed' });
  }
});

  module.exports = router;