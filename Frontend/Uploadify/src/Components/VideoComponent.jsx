import { FiEye, FiDownload, FiTag } from "react-icons/fi";
import axios from "axios";
import {useNavigate} from 'react-router-dom';




const VideoCard = ({ video }) => {

  console.log(video);

  const navigate = useNavigate();
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
      case "needs-review":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    const userInfo = localStorage.getItem("user-info");
    console.log("User Info:", userInfo);
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
      // You might want to add state update or callback here to refresh the UI
    } catch (error) {
      console.error("Error verifying video:", error);
      // Consider adding error handling feedback to the user
    }
  };




  const handleView = (video) => {
    navigate(`/video/${video.uuid}`, { state: { video } });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col h-full">
      {/* Thumbnail */}
      <img
        src={
          video.thumbnail ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUOzef86a5o6mmqmxvHwGrJzztIXgSF1gHfA&s"
        }
        alt={video.title}
        className="w-full h-32 object-cover rounded mb-2"
        onError={(e) => {
          e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUOzef86a5o6mmqmxvHwGrJzztIXgSF1gHfA&s";
        }}
      />
      
      {/* Title */}
      <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
      
      {/* Description */}
      {video.description && (
        <p className="text-sm text-gray-600 line-clamp-2 my-2">
          description: {video.description}
        </p>
      )}
      
      {/* Tags */}
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          <FiTag className="text-gray-400 mt-1 mr-1" />
          {video.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Upload Date */}
      <p className="text-gray-600 text-sm mb-2">
        Uploaded: {new Date(video.uploadedDate).toLocaleDateString()}
      </p>
      
      {/* Notes */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
        <span className="font-medium">Notes: </span>
        {video.clientNotes || video.notes || "No notes provided"}
      </p>
      
      {/* Editor Notes */}
      {video.editorNotes && (
        <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-2">
          <span className="font-medium">Editor Notes: </span>
          {video.editorNotes}
        </p>
      )}
      
      {/* Status and Actions */}
      <div className="mt-auto pt-2 flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded text-xs ${getStatusStyle(
            video.status
          )}`}
        >
          {getStatusText(video.status)}
        </span>
        <div className="flex gap-2">
          {video.status !== "verified" && (
            <button
              className="text-sm bg-gray-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded"
              onClick={()=>handleVerify(video)}
            >
              Verify
            </button>
          )}
          <button 
          onClick={()=>handleView(video)}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
            <FiEye className="inline mr-1" /> View
          </button>
          {(video.status === "completed" || video.status === "verified") && (
            <button className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded">
              <FiDownload className="inline mr-1" /> Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;