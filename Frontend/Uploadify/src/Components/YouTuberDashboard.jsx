import { useState, useEffect } from "react"
import { FiUpload, FiGrid, FiList, FiSearch, FiEye, FiDownload } from "react-icons/fi"
import VideoCard from "./VideoComponent"
import axios from "axios"
import Footer from "./Footer"
import NavBar from "./NavBar"


const VideoDashboard = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [viewMode, setViewMode] = useState("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: "",
    notes: "",
    file: null,
    email: "",
  })

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const user = localStorage.getItem("user-info")
        const parsedUser = JSON.parse(user)

        const response = await axios.get("http://localhost:3000/api/final", {
          params: {
            ytmail: parsedUser.email,
          },
        })

        setVideos(response.data || [])
        setError(null)

        console.log("Fetched videos:", response)
      } catch (err) {
        console.error("Failed to fetch videos:", err)
        setError("Failed to load videos. Please try again later.")
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const handleUpload = async () => {
    if (!newVideo.file || !newVideo.title || !newVideo.email) {
      alert("Please provide a title, editor email, and select a file")
      return
    }

    try {
      const formData = new FormData()
      const user = localStorage.getItem("user-info")
      const parsedUser = JSON.parse(user)

      formData.append("video", newVideo.file)
      formData.append("editormail", newVideo.email)
      formData.append("title", newVideo.title)
      formData.append("clientNotes", newVideo.notes || "")
      formData.append("ytmail", parsedUser.email || "")

      await axios.post("http://localhost:3000/api/upload_unedited", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Refresh the video list
      const refreshResponse = await axios.get("http://localhost:3000/api/final", {
        params: {
          ytmail: parsedUser.email,
        },
      })

      setVideos(refreshResponse.data || [])
      setNewVideo({ title: "", notes: "", file: null, email: "" })
      setShowUploadModal(false)
      alert("Video uploaded successfully!")
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    }
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.notes && video.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (video.clientNotes && video.clientNotes.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Videos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
    <NavBar></NavBar>
    
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Video Dashboard</h1>
          <p className="text-gray-600">Manage your video projects</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FiUpload /> Upload Video
          </button>
        </div>
      </div>

      {/* View Controls - Only show if there are videos */}
      {videos.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            Showing {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200 text-gray-800" : "text-gray-500"}`}
              title="Grid view"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200 text-gray-800" : "text-gray-500"}`}
              title="List view"
            >
              <FiList />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No videos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a new video project.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                Upload Video
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) =>
              viewMode === "grid" ? (
                <VideoCard key={video._id} video={video} />
              ) : (
                <div key={video._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={
                        video.thumbnail ||
                        "https://images.unsplash.com/photo-1574717024453-3545a7d1d5a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=170&q=80"
                      }
                      alt={video.title}
                      className="w-full md:w-48 h-32 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Uploaded: {new Date(video.uploadedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">Notes: </span>
                        {video.clientNotes || video.notes || "No notes provided"}
                      </p>
                      {video.editorNotes && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          <span className="font-medium">Editor Notes: </span>
                          {video.editorNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(video.status)}`}>
                        {getStatusText(video.status)}
                      </span>
                      <div className="mt-2 flex gap-2">
                        <button className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
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
                </div>
              ),
            )
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No videos match your search</p>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload New Video</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="My Awesome Video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Editor email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newVideo.email}
                  onChange={(e) => setNewVideo({ ...newVideo, email: e.target.value })}
                  placeholder="Please Enter Editor Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Editor</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={newVideo.notes}
                  onChange={(e) => setNewVideo({ ...newVideo, notes: e.target.value })}
                  placeholder="Any special instructions for the editor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="video/*"
                          onChange={(e) => setNewVideo({ ...newVideo, file: e.target.files[0] })}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, MOV up to 1GB</p>
                  </div>
                </div>
                {newVideo.file && <p className="mt-1 text-sm text-gray-700">Selected: {newVideo.file.name}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Upload Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer></Footer>
    </>
  )
}

// Helper functions for status display
const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800"
    case "in-progress":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "verified":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Pending"
    case "in-progress":
      return "In Editing"
    case "completed":
      return "Ready"
    case "verified":
      return "Verified"
    default:
      return "Pending"
  }
}

export default VideoDashboard