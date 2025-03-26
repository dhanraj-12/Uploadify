const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    fileName: String,
    s3Url: String,
    assignedTo: String, // Editor's email
    uploadedAt: { type: Date, default: Date.now }
});

const video =  mongoose.model('Video', videoSchema);


module.exports = video