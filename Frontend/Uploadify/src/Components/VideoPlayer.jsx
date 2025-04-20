import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiCalendar } from "react-icons/fi";

const VideoPlayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const video = state?.video;

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-gray-900">
        Video not found
      </div>
    );
  }

  const videoUrl = video.ed_s3key 
    ? `https://uploadifybucket.s3.ap-south-1.amazonaws.com/${video.ed_s3key}`
    : null;

  return (
    <div className="p-4 max-w-full mx-auto min-h-screen bg-gray-900 text-gray-100">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 ease-in-out transform hover:-translate-x-1 mb-4 group"
        >
          <FiArrowLeft className="mr-2 group-hover:scale-110 transition-transform duration-200" size={20} /> 
          <span className="group-hover:underline">Back to videos</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {videoUrl ? (
              <video 
                controls 
                autoPlay 
                className="w-full aspect-video hover:brightness-95 transition-all duration-300"
                src={videoUrl}
                poster={video.thumbnailUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-750 transition-colors duration-300">
                Video file not available
              </div>
            )}
          </div>

          {/* Engagement Buttons */}
          <div className="flex space-x-4 mt-4">
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300">
              <span>👍 Like</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300">
              <span>💬 Comment</span>
            </button>
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300">
              <span>↗️ Share</span>
            </button>
          </div>
        </div>
        
        {/* Video Info Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h1 className="text-2xl font-bold mb-4 text-white hover:text-blue-400 transition-colors duration-300">
              {video.title}
            </h1>
            
            {video.description && (
              <div className="mb-6 group">
                <h2 className="text-lg font-semibold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
                  Description
                </h2>
                <p className="text-gray-400 whitespace-pre-line hover:text-gray-300 transition-colors duration-300">
                  {video.description}
                </p>
              </div>
            )}
            
            <div className="mb-6 group">
              <h2 className="text-lg font-semibold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
                Details
              </h2>
              <div className="text-gray-400 space-y-2">
                {video.createdAt && (
                  <div className="flex items-center hover:text-gray-300 transition-colors duration-300">
                    <FiCalendar className="mr-2 text-blue-400" />
                    <span>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {video.duration && (
                  <div className="flex items-center hover:text-gray-300 transition-colors duration-300">
                    <FiClock className="mr-2 text-blue-400" />
                    <span>Duration: {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            </div>
            
            {video.tags?.length > 0 && (
              <div className="group">
                <h2 className="text-lg font-semibold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-gray-700 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Videos Placeholder */}
            <div className="mt-8 group">
              <h2 className="text-lg font-semibold text-gray-300 mb-4 group-hover:text-white transition-colors duration-300">
                More Videos
              </h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="w-16 h-10 bg-gray-700 rounded-md hover:opacity-90 transition-opacity duration-300"></div>
                    <div>
                      <p className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Suggested video {item}</p>
                      <p className="text-xs text-gray-500">Channel Name</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;