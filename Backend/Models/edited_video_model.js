const mongoose = require("mongoose");

const editedVideoSchema = new mongoose.Schema({
    filename: String,
    s3Url: String,
    status: String,
    originalVideoId: mongoose.Schema.Types.ObjectId
})

const editedVideo = mongoose.model("EditedVideo",editedVideoSchema)
module.exports = editedVideo