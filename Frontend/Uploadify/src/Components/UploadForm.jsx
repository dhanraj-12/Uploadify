import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
    const [video, setVideo] = useState(null);
    const [email, setEmail] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', video);
        formData.append('editorEmail', email);

        try {
            await axios.post('http://localhost:5000/api/upload', formData);
            alert("Video uploaded & assigned successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <form onSubmit={handleUpload}>
            <input type="file" onChange={(e) => setVideo(e.target.files[0])} required />
            <input type="email" placeholder="Editor Email" onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Upload</button>
        </form>
    );
};

export default UploadForm;
