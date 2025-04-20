"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { 
  FiArrowLeft, 
  FiClock, 
  FiCalendar,
  FiDownload,
  FiUpload,
  FiEdit2,
  FiCheckCircle,
  FiMessageSquare,
  FiShare2,
  FiThumbsUp
} from "react-icons/fi"
import { useState } from "react"

const EditorVideoPlayer = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const video = state?.video
  const [editorNotes, setEditorNotes] = useState(video?.editorNotes || "")
  const [currentStatus, setCurrentStatus] = useState(video?.status || "pending")

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300 bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Video not found</h2>
          <p className="mb-4">The requested video could not be loaded</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }
  console.log(video)
  const videoUrl = video.uned_s3Key 
    ? `https://uploadifybucket.s3.ap-south-1.amazonaws.com/${video.uned_s3Key}`
    : null
  console.log(videoUrl)
  const handleStatusChange = async (newStatus) => {
    try {
      // Optimistic UI update
      setCurrentStatus(newStatus)
      
      // API call to update status would go here
      // await axios.patch(`/api/videos/${video.id}/status`, { status: newStatus })
      
    } catch (error) {
      console.error("Error updating status:", error)
      // Revert on error
      setCurrentStatus(video.status)
    }
  }

  const handleSaveNotes = async () => {
    try {
      // API call to save notes would go here
      // await axios.patch(`/api/videos/${video.id}/notes`, { editorNotes })
    } catch (error) {
      console.error("Error saving notes:", error)
    }
  }

  return (
    <div className="p-4 max-w-full mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          <span className="group-hover:underline">Back to dashboard</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl">
            {videoUrl ? (
              <div className="relative">
                <video 
                  controls 
                  autoPlay 
                  className="w-full aspect-video bg-black"
                  src={videoUrl}
                  poster={video.thumbnailUrl}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                Video file not available
              </div>
            )}
          </div>

          {/* Video Actions */}
          <div className="flex flex-wrap gap-3">
            <button 
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              onClick={() => document.querySelector('video')?.requestFullscreen()}
            >
              <FiDownload size={18} />
              <span>Download Source</span>
            </button>
            
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              <FiUpload size={18} />
              <span>Upload Edit</span>
            </button>
            
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="needs-review">Needs Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Editor Notes Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FiEdit2 />
              Editor Notes
            </h3>
            <textarea
              value={editorNotes}
              onChange={(e) => setEditorNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              rows="5"
              placeholder="Add your notes about this edit..."
            />
            <div className="flex justify-end mt-3">
              <button 
                onClick={handleSaveNotes}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
        
        {/* Video Info Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors hover:shadow-md">
            <h1 className="text-2xl font-bold mb-3">{video.title}</h1>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Client Notes</h3>
                <p className="whitespace-pre-line bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  {video.clientNotes || "No client notes provided"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Uploaded</h3>
                  <p className="flex items-center gap-2">
                    <FiCalendar className="text-blue-500 dark:text-blue-400" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</h3>
                  <p className="flex items-center gap-2">
                    <FiClock className="text-blue-500 dark:text-blue-400" />
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                  </p>
                </div>
              </div>
              
              {video.tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors hover:shadow-md">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <FiThumbsUp size={20} className="mb-1" />
                <span>Approve</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <FiMessageSquare size={20} className="mb-1" />
                <span>Request Changes</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <FiCheckCircle size={20} className="mb-1" />
                <span>Mark Complete</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <FiShare2 size={20} className="mb-1" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors hover:shadow-md">
            <h3 className="text-lg font-semibold mb-3">Version History</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div>
                  <p className="text-sm font-medium">Current Version</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Today, 14:32</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div>
                  <p className="text-sm font-medium">Revision 1</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 09:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditorVideoPlayer