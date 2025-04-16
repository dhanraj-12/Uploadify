const {google} = require("googleapis");
const stream = require("stream");
const User = require("../Models/user_mode");
const {oauth2client} = require("../uitl/googleconfig");
const {s3} = require("../Functions/s3client");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const video = require("../Models/video_model");

function isTokenExpired(credentials) {
    if (!credentials.expiry_date) return true; // Assume expired if no expiry date
    const now = new Date().getTime();
    return now >= credentials.expiry_date;
  }

exports.uploadVideotoYoutube = async (req,res)=> {
    console.log("📩 Upload request received");
    try {
        const userid = req.userId;
        console.log("User ID from request body:", userid);
        const {title,description, tags = [], privacyStatus = 'public',s3Key} = req.body;

        const user = await User.findById(userid);
        if(!user) {
            return res.status(404).json ({
                error : "User not found"
            });
        }

        console.log("User found:", user);

        const credentials = {
            access_token: user.googleAcccessToken,
            refresh_token: user.googleRefreshToken,
            expiry_date: user.googleExpiryDate.getTime(),
          };


        oauth2client.setCredentials(credentials);


        // console.log("OAuth2 client credentials set:", credentials);


        if(isTokenExpired(credentials)) {
            const {credentials : newtokens} = await oauth2client.refreshAccessToken();
            await User.findByIdAndUpdate(userid, {
                googleAcccessToken : newtokens.access_token,
                googleRefreshToken : newtokens.refresh_token || user.googleRefreshToken,
                googleExpiryDate : new Date(newtokens.expiry_date)
            });

            oauth2client.setCredentials(newtokens);
        }

        const youtube = google.youtube ({
            version : "v3",
            auth : oauth2client
        });

        console.log("YouTube API client initialized:", youtube);

        const s3Response = await s3.send(
            new GetObjectCommand({
                Bucket : process.env.S3_BUCKET_NAME,
                Key : s3Key,
            })
        );


        const response = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
              snippet: {
                title,
                description,
                tags: Array.isArray(tags) ? tags : tags.split(','),
              },
              status: {
                privacyStatus, // 'public', 'private', or 'unlisted'
              },
            },
            media: {
              body: s3Response.Body, // Stream directly from S3
              mimeType: s3Response.ContentType,
            },
          });

          console.log("YouTube upload response:", response.data);
          res.status(200).json({
            success : true,
            videoId : response.data.id,
            videoUrl: `https://youtu.be/${response.data.id}`,
          });
    }catch (error) {
        console.error('YouTube upload error:', error);
        res.status(500).json({
          error: 'Failed to upload video',
          details: error.message,
        });
      }
};

