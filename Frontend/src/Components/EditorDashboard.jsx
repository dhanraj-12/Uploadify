"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiMoon,
  FiSun,
  FiAlertCircle,
  FiInbox,
  FiClock,
  FiEdit,
  FiSend,
  FiCheck,  
} from "react-icons/fi"
import EditorVideoCard from "./EditorVideoCard"
import Footer from "./Footer"
import NavBar from "./NavBar"
import config from "../../config"


const API = config.url;


const EditorDashboard = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [theme, setTheme] = useState("light") // 'light' or 'dark'

  const [viewMode, setViewMode] = useState("grid") // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'pending', etc.

  // Theme toggle effect
  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem("editor-theme")
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("editor-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  useEffect(() => {
    // Get user email from localStorage
    const userInfo = JSON.parse(localStorage.getItem("user-info"))
    if (userInfo && userInfo.email) {
      setUserEmail(userInfo.email)
    } else {
      setError("User email not found in localStorage")
      setLoading(false)
    }
  }, [])

  const fetchAssignedVideos = async () => {
    if (!userEmail) return

    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API}/api/assigned`, {
        params: {
          email: userEmail,
        },
      })
      console.log("Assigned videos response:", response.data)
      setVideos(response.data)
    } catch (err) {
      console.error("Error fetching assigned videos:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch videos")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (userEmail) {
      fetchAssignedVideos()
    }
  }, [userEmail])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAssignedVideos()
  }

  const handleStatusUpdate = async (videoId, newStatus) => {
    try {
      // Optimistic UI update
      setVideos(videos.map((video) => (video.uuid === videoId ? { ...video, status: newStatus } : video)))

      // API call to update status
      await axios.patch(
        `${API}/api/videos/status`,
        {
          status: newStatus,
          videoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Refresh the list to ensure consistency
      fetchAssignedVideos()
    } catch (err) {
      console.error("Error updating video status:", err)
      // Revert the change if the API call fails
      fetchAssignedVideos()
    }
  }

  // Filter videos based on search and status
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.clientNotes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || video.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Status counts for dashboard stats
  const statusCounts = videos.reduce(
    (acc, video) => {
      const status = video.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { pending: 0, "in-progress": 0, "needs-review": 0, completed: 0 },
  )

  if (!userEmail && !error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading user information...</p>
        </div>
      </div>
    )
  }

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your assigned videos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md text-center transition-colors duration-200">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Videos</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <NavBar />
      <div className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Theme Toggle & Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Editor Dashboard</h1>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredVideos.length} {filteredVideos.length === 1 ? "project" : "projects"} assigned
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="needs-review">Needs Review</option>
              <option value="completed">Completed</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-400 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{statusCounts.pending || 0}</p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-400 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{statusCounts["in-progress"] || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FiEdit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-purple-400 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Needs Review</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{statusCounts["needs-review"] || 0}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <FiSend className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-400 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{statusCounts.completed || 0}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-colors">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Showing: {statusFilter === "all" ? "All projects" : `${statusFilter} projects`}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Grid view"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="List view"
            >
              <FiList />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredVideos.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4 divide-y divide-gray-200 dark:divide-gray-700"
            }
          >
            {filteredVideos.map((video) => (
              <div key={video.uuid} className={viewMode === "list" ? "pt-4 first:pt-0" : ""}>
                <EditorVideoCard video={video} onStatusUpdate={handleStatusUpdate} viewMode={viewMode} darkMode ={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center transition-colors">
            <FiInbox className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "No projects match your filters"
                : "You have no assigned projects"}
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}
            >
              {searchTerm || statusFilter !== "all" ? "Reset filters" : "Check for new assignments"}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default EditorDashboard
