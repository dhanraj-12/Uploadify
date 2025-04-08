const express = require("express");
const router = express.Router(); // Corrected this line
const {googleauth} = require("../Controllers/authController")

router.get("/google", googleauth)


module.exports = router;