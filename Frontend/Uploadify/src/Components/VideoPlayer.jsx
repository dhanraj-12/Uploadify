import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const VideoPlayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const video = state?.video;

  if (!video) {
    return <div>Video not found</div>;
  }

  // Construct the S3 video URL - adjust this based on how you serve your S3 files
  console.log(video);
  const videoUrl = video.ed_s3key 
    ? `https://uploadifybucket.s3.ap-south-1.amazonaws.com/${video.ed_s3key}`
    : null;

    console.log(videoUrl);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4"
      >
        <FiArrowLeft className="mr-1" /> Back to videos
      </button>
      
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      
      {videoUrl ? (
        <div className="bg-black rounded-lg overflow-hidden">
          <video 
            controls 
            autoPlay 
            className="w-full h-full"
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          Video file not available
        </div>
      )}
      
      <div className="mt-4">
        {video.description && (
          <p className="text-gray-700 mb-2">{video.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4">
          {video.tags?.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;