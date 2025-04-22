"use client"

import { useState, useEffect } from "react"
import { FiClock, FiEdit, FiCheck, FiUpload, FiPlay, FiSend, FiDownload, FiX, FiTag } from "react-icons/fi"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import config from "../../config"

const API = config.url;


const EditorVideoCard = ({ video: propVideo, onStatusUpdate, darkMode = false }) => {
  const navigate = useNavigate()
  // Initialize with prop data or empty defaults
  const [video, setVideo] = useState({
    id: propVideo?.id || "",
    title: propVideo?.title || "Untitled Project",
    status: propVideo?.status || "pending",
    thumbnail: propVideo?.thumbnail || "data:image/jpeg;base64,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",
    assignedDate: propVideo?.createdAt || new Date().toISOString().split("T")[0],
    deadline: propVideo?.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    clientNotes: propVideo?.clientNotes || "No client notes provided",
    uned_s3Key: propVideo?.uned_s3Key || "#",
    editedVideoUrl: propVideo?.editedVideoUrl || null,
    editorComments: propVideo?.editorComments || "",
    uuid: propVideo?.uuid || "",
  })

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadComments, setUploadComments] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Update internal state when prop changes
  useEffect(() => {
    if (propVideo) {
      setVideo({
        id: propVideo.uuid,
        title: propVideo.title,
        status: propVideo.status,
        thumbnail: propVideo.thumbnail || "data:image/jpeg;base64,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",
        assignedDate: propVideo.createdAt,
        deadline: propVideo.deadline,
        clientNotes: propVideo.clientNotes,
        uned_s3Key: propVideo.uned_s3Key,
        editedVideoUrl: propVideo.editedVideoUrl,
        editorComments: propVideo.editorComments,
        uuid: propVideo.uuid,
      })
    }
  }, [propVideo])

  // Status configuration with dark mode variants
  const statusConfig = {
    pending: {
      icon: <FiClock className="mr-1 text-yellow-500" />,
      text: "Pending Acceptance",
      bgColor: darkMode ? "bg-yellow-900/30" : "bg-yellow-100",
      textColor: darkMode ? "text-yellow-200" : "text-yellow-800",
    },
    "in-progress": {
      icon: <FiEdit className="mr-1 text-blue-500" />,
      text: "Editing",
      bgColor: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      textColor: darkMode ? "text-blue-200" : "text-blue-800",
    },
    "needs-review": {
      icon: <FiSend className="mr-1 text-purple-500" />,
      text: "Client Review",
      bgColor: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      textColor: darkMode ? "text-purple-200" : "text-purple-800",
    },
    completed: {
      icon: <FiCheck className="mr-1 text-green-500" />,
      text: "Completed",
      bgColor: darkMode ? "bg-green-900/30" : "bg-green-100",
      textColor: darkMode ? "text-green-200" : "text-green-800",
    },
    verified: {
      icon: <FiCheck className="mr-1 text-green-500" />,
      text: "verfication completed",
      bgColor: darkMode ? "bg-green-900/30" : "bg-green-100",
      textColor: darkMode ? "text-green-200" : "text-green-800",
    },
  }

  const { icon, text, bgColor, textColor } = statusConfig[video.status] || statusConfig.pending

  // Action handlers (same as before)
  const handleAccept = async () => {
    try {
      setLoading(true)
      console.log("Sending update for video:", {
        status: "in-progress",
        videoId: video.uuid,
      })

      await axios.patch(
        `${API}/api/videos/status`,
        {
          status: "in-progress",
          videoId: video.uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setVideo({ ...video, status: "in-progress" })
      if (onStatusUpdate) onStatusUpdate(video.uuid, "in-progress")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept project")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (confirm("Are you sure you want to reject this assignment?")) {
      try {
        setLoading(true)
        await axios.patch(
          `${API}/api/videos/status`,
          {
            status: "rejected",
            videoId: video.uuid,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )

        if (onStatusUpdate) onStatusUpdate(video.uuid, "rejected")
        alert("Assignment rejected. Admin will be notified.")
      } catch (err) {
        setError(err.response?.data?.message || "Failed to reject project")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFileChange = (e) => {
    setUploadedFile(e.target.files[0])
  }

  const [videoTitle, setVideoTitle] = useState(propVideo?.title || "")
  const [videoDescription, setVideoDescription] = useState(propVideo?.description || "")
  const [videoTags, setVideoTags] = useState(propVideo?.tags?.join(", ") || "")

  const handleSubmitForReview = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append("video", uploadedFile)
      formData.append("comments", uploadComments)
      formData.append("title", videoTitle)
      formData.append("description", videoDescription)
      formData.append("tags", videoTags)
      formData.append("id", video.uuid)

      const response = await axios.post(`${API}/api/upload_edited`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        },
      })

      setVideo({
        ...video,
        title: videoTitle,
        description: videoDescription,
        tags: videoTags.split(",").map((tag) => tag.trim()),
        editedVideoUrl: response.data.fileUrl,
        status: "needs-review",
        editorComments: uploadComments || video.editorComments,
      })

      if (onStatusUpdate) onStatusUpdate(video.uuid, "needs-review")

      setShowUploadModal(false)
      setUploadedFile(null)
      setUploadComments("")
      setUploadProgress(0)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit video")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    try {
      setLoading(true)
      await axios.patch(
        `/api/videos/${video.uuid}/status`,
        {
          status: "completed",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setVideo({ ...video, status: "completed" })
      if (onStatusUpdate) onStatusUpdate(video.uuid, "completed")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete project")
    } finally {
      setLoading(false)
    }
  }

  const handleAddComments = async () => {
    const comments = prompt("Add your editor's notes:", video.editorComments)
    if (comments !== null) {
      try {
        setLoading(true)
        await axios.patch(
          `/api/videos/${video.uuid}/comments`,
          {
            comments,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        setVideo({ ...video, editorComments: comments })
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update comments")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleView = (video) => {
    navigate(`/editorvideo/${video.uuid}`, { state: { video } })
  }

  return (
    <>
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Upload Edited Video
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className={darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}
                disabled={loading}
              >
                <FiX size={20} />
              </button>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-md text-sm border flex items-start ${
                darkMode ? 'bg-red-900/30 text-red-200 border-red-700' : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                <FiX className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Video Title */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                placeholder="Enter video title"
                disabled={loading}
              />
            </div>

            {/* Video Description */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Enter video description"
                disabled={loading}
              />
            </div>

            {/* Video Tags */}
            <div className="mb-4">
              <label className={`text-sm font-medium mb-1 flex items-center ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiTag className="mr-1" /> Tags (comma separated)
              </label>
              <input
                type="text"
                value={videoTags}
                onChange={(e) => setVideoTags(e.target.value)}
                className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                placeholder="e.g., travel, vlog, summer"
                disabled={loading}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Separate tags with commas
              </p>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={loading}
                className={`block w-full text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold ${
                  darkMode 
                    ? 'file:bg-blue-900/30 file:text-blue-200 hover:file:bg-blue-800/40' 
                    : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                } transition-colors`}
              />
              {uploadedFile && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selected: {uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Editor Comments */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Editor Notes
              </label>
              <textarea
                value={uploadComments}
                onChange={(e) => setUploadComments(e.target.value)}
                disabled={loading}
                className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Add any notes about your edits..."
              />
            </div>

            {/* Upload Progress */}
            {loading && (
              <div className="mb-4">
                <div className={`flex justify-between text-xs mb-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className={`w-full rounded-full h-2.5 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={loading}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForReview}
                disabled={loading || !uploadedFile}
                className={`px-4 py-2 text-sm text-white rounded-md flex items-center transition-colors ${
                  loading 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : darkMode 
                      ? 'bg-purple-700 hover:bg-purple-600' 
                      : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" /> Submit for Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !showUploadModal && (
        <div className={`mb-2 p-2 rounded text-sm ${
          darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-700'
        }`}>
          {error}
        </div>
      )}

      {/* Video Card */}
      <div className={`max-w-sm rounded-lg shadow-md overflow-hidden border transition-all duration-300 hover:shadow-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Thumbnail with status */}
        <div className="relative">
          <img 
            src={video.thumbnail || "/placeholder.svg"} 
            alt={video.title} 
            className="w-full h-48 object-cover"
          />
          <div
            className={`absolute top-2 left-2 ${bgColor} ${textColor} px-2 py-1 rounded-md text-xs flex items-center shadow-sm`}
          >
            {icon}
            {text}
          </div>
          {new Date(video.deadline) < new Date() && video.status !== "completed" && (
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs shadow-sm ${
              darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              Overdue
            </div>
          )}
        </div>

        {/* Video info */}
        <div className="p-4">
          <h3 className={`font-semibold text-lg mb-1 line-clamp-1 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {video.title}
          </h3>

          <div className="flex justify-between text-sm mb-2">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Assigned: {video.createdAt}
            </span>
            <span className={`font-medium ${
              new Date(video.deadline) < new Date() && video.status !== "completed" 
                ? darkMode ? 'text-red-400' : 'text-red-600' 
                : darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Deadline: {video.deadline}
            </span>
          </div>

          {/* Client notes */}
          <div className={`mb-3 p-2 rounded-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-sm line-clamp-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span className="font-medium">Client Notes: </span>
              {video.clientNotes}
            </p>
          </div>

          {/* Editor comments (if any) */}
          {video.editorComments && (
            <div className={`mb-3 p-2 rounded-md ${
              darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}>
              <p className={`text-sm line-clamp-2 ${
                darkMode ? 'text-blue-200' : 'text-blue-700'
              }`}>
                <span className="font-medium">Your Comments: </span>
                {video.editorComments}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Preview/download buttons */}
            <button
              onClick={() => handleView(video)}
              className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              <FiPlay className="mr-1" /> Preview
            </button>

            {video.editedVideoUrl && (
              <button
                onClick={() => handleDownload(video.editedVideoUrl, `${video.title}-edited.mp4`)}
                className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                  darkMode ? 'bg-green-900/30 hover:bg-green-800/40 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}
                disabled={loading}
              >
                <FiDownload className="mr-1" /> Download Edits
              </button>
            )}

            {/* Status-specific buttons */}
            {video.status === "pending" && (
              <>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                    darkMode ? 'bg-green-900/30 hover:bg-green-800/40 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-1" /> Accept
                    </>
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                    darkMode ? 'bg-red-900/30 hover:bg-red-800/40 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-800'
                  }`}
                >
                  <FiX className="mr-1" /> Reject
                </button>
              </>
            )}

            {video.status === "in-progress" && (
              <button
                onClick={() => setShowUploadModal(true)}
                disabled={loading}
                className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                  darkMode ? 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
              >
                <FiUpload className="mr-1" /> Upload Edits
              </button>
            )}

            {video.status === "needs-review" && (
              <button
                onClick={handleMarkComplete}
                disabled={loading}
                className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                  darkMode ? 'bg-green-900/30 hover:bg-green-800/40 text-green-200' : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Completing...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-1" /> Mark Complete
                  </>
                )}
              </button>
            )}

            {/* Always show comments button */}
            <button
              onClick={handleAddComments}
              disabled={loading}
              className={`text-sm px-3 py-1 rounded-md flex items-center transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FiEdit className="mr-1" /> Add Notes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditorVideoCard