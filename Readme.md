# Uploadify

**Uploadify** is a web application designed to streamline the video editing and uploading process for YouTubers. The platform allows YouTubers to upload raw videos, assign editors for video editing, and easily manage the entire workflow, from video upload to final upload on the YouTube channel.

## Features

- **Raw Video Upload:** YouTubers can upload raw video files to an S3 bucket cloud storage
- **Editor Assignment:** YouTubers can assign an editor's email to a video for editing
- **Download Videos for Editing:** Editors can download raw videos from cloud storage to their device for editing
- **Video Editing:** Editors can edit videos offline and reupload them once completed
- **Video Verification:** After editing, YouTubers can verify the videos before final uploading
- **Direct Upload to YouTube:** After verification, videos are automatically uploaded to the YouTuber's channel using the YouTube Data API
- **Authentication:** OAuth authentication via Google Cloud Console for secure logins

## Technologies Used

- **Frontend:** React (with Tailwind CSS)
- **Backend:** MERN Stack (MongoDB, Express.js, React, Node.js)
- **Storage:** Amazon S3
- **Authentication:** Google OAuth
- **Video Upload:** YouTube Data API

## Requirements

- Node.js
- MongoDB
- Google Cloud Console for OAuth setup
- YouTube API access

## Installation

### Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uploadify.git
   cd uploadify
   ```

2. Install dependencies:
   ```bash
   cd Frontend
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd ../server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following environment variables:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   S3_BUCKET_NAME=your_bucket_name
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Project Structure

```
uploadify/
├── client/            # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── server/            # Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── ...
└── README.md
```

## How It Works

1. **Upload:** YouTubers upload raw videos which are stored in an S3 bucket
2. **Assign:** The video is assigned to an editor using their email address
3. **Download/Edit:** The editor downloads the raw video, edits it offline, and reuploads the edited video
4. **Verify:** The YouTuber verifies the final edit
5. **Upload to YouTube:** Upon verification, the video is uploaded directly to the YouTube channel using the YouTube Data API

## Known Issues

- Large video files may take time to upload/download without high-speed internet
- Mobile support for video editing is not yet implemented

## Contributing

We welcome contributions!

To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them
4. Push to your fork: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Amazon Web Services (S3)
- YouTube Data API
- Google OAuth 2.0
- MongoDB