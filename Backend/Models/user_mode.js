const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String
    },
    googleAcccessToken : String,
    googleRefreshToken : String,
    googleExpiryDate : Date
});

const User = mongoose.model('Users', userSchema);

module.exports = User;