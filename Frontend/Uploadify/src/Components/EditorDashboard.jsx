import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditorDashboard = ({ editorEmail }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/videos/assigned/${editorEmail}`)
            .then(res => setVideos(res.data))
            .catch(err => console.error(err));
    }, [editorEmail]);

    return (
        <div>
            <h2>Assigned Videos</h2>
            {videos.length > 0 ? (
                videos.map(video => (
                    <div key={video._id}>
                        <p>{video.fileName}</p>
                        <a href={video.s3Url} download>Download</a>
                    </div>
                ))
            ) : (
                <p>No videos assigned</p>
            )}
        </div>
    );
};

export default EditorDashboard;
