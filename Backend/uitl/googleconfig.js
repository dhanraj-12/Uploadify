const { google } = require("googleapis")
const dotenv = require("dotenv");
dotenv.config()
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Credential is absent")
    
}

const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
    
)

const SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload", // Required for uploading videos
    "https://www.googleapis.com/auth/userinfo.email", // Optional, to get user's email
  ];
  
  const getAuthURL = () => {
    return oauth2client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });
  };
  
  module.exports = {
    oauth2client,
    getAuthURL
  };