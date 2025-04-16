const express = require('express');
const router = express.Router();
const Video = require('../Models/video_model');


router.patch('/videos/:id/comments',  async (req, res) => {
    try {
      const video = await Video.findOneAndUpdate(
        { _id: req.params.id, editorEmail: req.user.email },
        { editorComments: req.body.comments },
        { new: true }
      );
      
      if (!video) return res.status(404).json({ message: 'Video not found' });
      res.json(video);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update comments' });
    }
  });

module.exports = router;