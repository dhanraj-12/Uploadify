import { useState, useEffect } from "react";
import { FiUpload, FiGrid, FiList, FiSearch, FiEye, FiDownload, FiX, FiPlus, FiClock, FiEdit2, FiCheckCircle, FiSun, FiMoon } from "react-icons/fi";
import VideoCard from "./VideoComponent";
import axios from "axios";
import Footer from "./Footer";
import NavBar from "./NavBar";
import  config  from "../../config";



const API = config.url;

const VideoDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    notes: "",
    file: null,
    email: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const user = localStorage.getItem("user-info");
        const parsedUser = JSON.parse(user);

        const response = await axios.get(`${API}/api/final`, {
          params: {
            ytmail: parsedUser.email,
          },
        });

        setVideos(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError("Failed to load videos. Please try again later.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewVideo({ ...newVideo, file: e.dataTransfer.files[0] });
    }
  };

  const handleUpload = async () => {
    console.log("Starting upload...", newVideo);
    
    if (!newVideo.file || !newVideo.title || !newVideo.email) {
      alert("Please provide a title, editor email, and select a file");
      return;
    }

    // Check file size (max 2GB)
    if (newVideo.file.size > 2 * 1024 * 1024 * 1024) {
      alert("File size exceeds 2GB limit");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      const user = localStorage.getItem("user-info");
      const parsedUser = JSON.parse(user);

      formData.append("video", newVideo.file);
      formData.append("editormail", newVideo.email);
      formData.append("title", newVideo.title);
      formData.append("clientNotes", newVideo.notes || "");
      formData.append("ytmail", parsedUser.email || "");

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${API}/api/upload_unedited`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      console.log("Upload response:", response.data);

      // Refresh the video list
      const refreshResponse = await axios.get(`${API}/api/final`, {
        params: {
          ytmail: parsedUser.email,
        },
      });

      setVideos(refreshResponse.data || []);
      setNewVideo({ title: "", notes: "", file: null, email: "" });
      setShowUploadModal(false);
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(`Upload failed: ${error.response.data.message || error.message}`);
      } else {
        alert("Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.notes && video.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (video.clientNotes && video.clientNotes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      selectedFilter === "all" || 
      video.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Videos</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all hover:shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Video Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track your video editing projects</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-md"
              >
                <FiPlus className="text-lg" /> New Project
              </button>
            </div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${selectedFilter === "all" ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              All Projects
            </button>
            <button
              onClick={() => setSelectedFilter("pending")}
              className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${selectedFilter === "pending" ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              <FiClock size={14} /> Pending
            </button>
            <button
              onClick={() => setSelectedFilter("in-progress")}
              className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${selectedFilter === "in-progress" ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              <FiEdit2 size={14} /> In Progress
            </button>
            <button
              onClick={() => setSelectedFilter("completed")}
              className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${selectedFilter === "completed" ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              <FiCheckCircle size={14} /> Ready
            </button>
          </div>
          
          {/* View Toggle - Only show if there are videos */}
          {videos.length > 0 && (
            <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                title="Grid view"
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                title="List view"
              >
                <FiList />
              </button>
            </div>
          )}
        </div>

        {/* Video Count */}
        {videos.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {filteredVideos.length} of {videos.length} {videos.length === 1 ? "project" : "projects"}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}

        {/* Main Content Area */}
        {videos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div className="max-w-md mx-auto">
              <div className="mx-auto h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4">
                <FiUpload size={24} />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No video projects yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading your first video for editing.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-md"
                >
                  <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                  Upload First Video
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {filteredVideos.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredVideos.map((video) =>
                  viewMode === "grid" ? (
                    <VideoCard key={video._id} video={video} darkMode={darkMode} />
                  ) : (
                    <div key={video._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700/50 transition-all">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                          <img
                            src={
                              video.thumbnail ||
                              "https://images.unsplash.com/photo-1574717024453-3545a7d1d5a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=170&q=80"
                            }
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(video.status, darkMode)}`}>
                              {getStatusText(video.status)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{video.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                            Uploaded: {new Date(video.uploadedDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            <span className="font-medium">Notes: </span>
                            {video.clientNotes || video.notes || "No notes provided"}
                          </p>
                          {video.editorNotes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                              <span className="font-medium">Editor Notes: </span>
                              {video.editorNotes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="flex gap-2">
                            <button className="text-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                              <FiEye size={14} /> View
                            </button>
                            {(video.status === "completed" || video.status === "verified") && (
                              <button className="text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-700 flex items-center gap-1">
                                <FiDownload size={14} /> Download
                              </button>
                            )}
                          </div>
                          {video.editedBy && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                              Editor: {video.editedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                <div className="max-w-md mx-auto">
                  <div className="mx-auto h-16 w-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4">
                    <FiSearch size={24} />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No matching projects found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedFilter("all");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
              <button
                onClick={() => {
                  if (!isUploading) {
                    setShowUploadModal(false);
                  }
                }}
                className={`absolute top-4 right-4 p-1 rounded-full ${isUploading ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                disabled={isUploading}
              >
                <FiX size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                {isUploading ? 'Uploading Video...' : 'New Video Project'}
              </h2>
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Progress:</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Please wait while we upload your video...
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Upload your video file and provide details for the editor
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="e.g. Product Launch Video"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Editor Email *</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={newVideo.email}
                        onChange={(e) => setNewVideo({ ...newVideo, email: e.target.value })}
                        placeholder="editor@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions for Editor</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={3}
                        value={newVideo.notes}
                        onChange={(e) => setNewVideo({ ...newVideo, notes: e.target.value })}
                        placeholder="Describe what you need... (style, tone, specific edits, etc.)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video File *</label>
                      <div 
                        className={`mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-2 text-center">
                          <FiUpload className={`mx-auto h-8 w-8 ${dragActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none"
                            >
                              <span>Click to upload</span>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MOV, AVI up to 2GB</p>
                          {newVideo.file && (
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 inline-block">
                              Selected: {newVideo.file.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpload} 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all hover:shadow-md flex items-center gap-2"
                      disabled={!newVideo.file || !newVideo.title || !newVideo.email}
                    >
                      <FiUpload /> Upload Project
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer darkMode={darkMode} />
    </>
  );
};

// Helper functions for status display
const getStatusStyle = (status, darkMode = false) => {
  switch (status) {
    case "pending":
      return darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
    case "in-progress":
      return darkMode ? "bg-yellow-900/30 text-yellow-200" : "bg-yellow-100 text-yellow-800";
    case "completed":
      return darkMode ? "bg-green-900/30 text-green-200" : "bg-green-100 text-green-800";
    case "verified":
      return darkMode ? "bg-blue-900/30 text-blue-200" : "bg-blue-100 text-blue-800";
    default:
      return darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "in-progress":
      return "In Editing";
    case "completed":
      return "Ready for Review";
    case "verified":
      return "Completed";
    default:
      return "Pending";
  }
};

export default VideoDashboard;