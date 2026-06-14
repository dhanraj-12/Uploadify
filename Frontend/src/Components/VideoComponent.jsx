import { FiEye, FiDownload, FiTag } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const VideoCard = ({ video, darkMode = false }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
      case "in-progress":
        return darkMode ? "bg-yellow-900/30 text-yellow-200" : "bg-yellow-100 text-yellow-800";
      case "completed":
        return darkMode ? "bg-green-900/30 text-green-200" : "bg-green-100 text-green-800";
      case "verified":
        return darkMode ? "bg-blue-900/30 text-blue-200" : "bg-blue-100 text-blue-800";
      case "needs-review":
        return darkMode ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-800";
      default:
        return darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in-progress":
        return "In Editing";
      case "completed":
        return "Ready";
      case "verified":
        return "Verified";
      case "needs-review":
        return "Needs Review";
      default:
        return "Pending";
    }
  };

  const handleVerify = async (video) => {
    setShowModal(true);
    // Commenting out the actual verify functionality for now
    /*
    const userInfo = localStorage.getItem("user-info");
    const parsedUserInfo = JSON.parse(userInfo);
    if (!parsedUserInfo.token) {
      console.error("No user token found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/yt/upload",
        {
          videoId: video.uuid,
          status: "verified",
          s3Key: video.ed_s3key
        },
        {
          headers: {
            Authorization: parsedUserInfo.token,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Verification successful:", response.data);
    } catch (error) {
      console.error("Error verifying video:", error);
    }
    */
  };

  const handleView = (video) => {
    navigate(`/video/${video.uuid}`, { state: { video } });
  };

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Feature in Development
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              The verify feature is currently under development. Please contact the developer for more information.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Card */}
      <div className={`rounded-xl shadow-sm p-4 border ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-700/50' : 'bg-white border-gray-200 hover:border-blue-200'} transition-all flex flex-col h-full`}>
        {/* Thumbnail */}
        <div className="relative w-full rounded-lg overflow-hidden mb-3">
          <img
            src={
              video.thumbnail ||
                 "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUOzef86a5o6mmqmxvHwGrJzztIXgSF1gHfA&s"
            }
            alt={video.title}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.src =    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUOzef86a5o6mmqmxvHwGrJzztIXgSF1gHfA&s";
            }}
          />
          <div className="absolute bottom-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(video.status)}`}>
              {getStatusText(video.status)}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className={`font-semibold text-lg line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {video.title}
        </h3>
        
        {/* Description */}
        {video.description && (
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 my-2`}>
            description: {video.description}
          </p>
        )}
        
        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            <FiTag className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 mr-1`} />
            {video.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Upload Date */}
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>
          Uploaded: {new Date(video.uploadedDate).toLocaleDateString()}
        </p>
        
        {/* Notes */}
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 mb-2`}>
          <span className="font-medium">Notes: </span>
          {video.clientNotes || video.notes || "No notes provided"}
        </p>
        
        {/* Editor Notes */}
        {video.editorNotes && (
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2 mt-1 mb-2`}>
            <span className="font-medium">Editor Notes: </span>
            {video.editorNotes}
          </p>
        )}
        
        {/* Status and Actions */}
        <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {video.status !== "verified" && (
              <button
                className={`text-sm px-3 py-1 rounded-lg flex items-center gap-1 ${darkMode ? 'bg-yellow-900/30 hover:bg-yellow-900/40 text-yellow-200' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'}`}
                onClick={() => handleVerify(video)}
              >
                Verify
              </button>
            )}
            <button 
              onClick={() => handleView(video)}
              className={`text-sm px-3 py-1 rounded-lg flex items-center gap-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              <FiEye size={14} /> View
            </button>
          </div>
          {(video.status === "completed" || video.status === "verified") && (
            <button className={`text-sm px-3 py-1 rounded-lg flex items-center gap-1 ${darkMode ? 'bg-blue-900/30 hover:bg-blue-900/40 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}>
              <FiDownload size={14} /> Download
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCard;