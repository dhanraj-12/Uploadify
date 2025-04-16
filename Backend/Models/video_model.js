const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    id : {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    uuid : String,
    title: String,
    description: String,
    tags: [String],
    fileName: String,
    uned_s3Key: String,
    ed_s3key: {
        type: String,
        validate: {
            validator: function(v) {
                console.log("Validating ed_s3key:", v); // Debugging
                return true; // Custom validation if needed
            }
        }
    },
    assignedTo: String, // Consider changing to ObjectId ref later
    clientNotes: String,
    ytmail: String,    
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'needs-review', 'completed'],
        default: 'pending'
    },
    metadata: {
        size: Number,
        mimetype: String
    }
}, { timestamps: true });

const video =  mongoose.model('UneditedVideo', videoSchema);


module.exports = video