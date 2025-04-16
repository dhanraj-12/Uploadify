const express = require("express");
const router = express.Router();
const {uploadVideotoYoutube} = require("../Controllers/youtubecontroller");
const authMiddleware = require("../Middleware/authmiddelware");

router.post("/upload",authMiddleware,uploadVideotoYoutube);

module.exports = router;