import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiGrid, FiList, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import EditorVideoCard from './EditorVideoCard';
import Footer from './Footer';
import NavBar from './NavBar';


const EditorDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', etc.

  useEffect(() => {
    // Get user email from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (userInfo && userInfo.email) {
      setUserEmail(userInfo.email);
    } else {
      setError('User email not found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchAssignedVideos = async () => {
    if (!userEmail) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/assigned', {
        params: {
          email: userEmail
        },
        
      });
      console.log("Assigned videos response:", response.data);
      setVideos(response.data);
    } catch (err) {
      console.error('Error fetching assigned videos:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchAssignedVideos();
    }
  }, [userEmail]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAssignedVideos();
  };

  const handleStatusUpdate = async (videoId, newStatus) => {
    try {
      // Optimistic UI update
      setVideos(videos.map(video => 
        video.uuid === videoId ? { ...video, status: newStatus } : video
      ));
      
      // API call to update status
      await axios.patch(`http://localhost:3000/api/videos/status`, {
        status: newStatus,
        videoId 
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh the list to ensure consistency
      fetchAssignedVideos();
    } catch (err) {
      console.error('Error updating video status:', err);
      // Revert the change if the API call fails
      fetchAssignedVideos();
    }
  };

  // Filter videos based on search and status
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.clientNotes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!userEmail && !error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assigned videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Videos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <NavBar></NavBar>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Editor Dashboard</h1>
          <p className="text-gray-600">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'project' : 'projects'} assigned
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-50"
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <span className="text-sm text-gray-600">
            Showing: {statusFilter === 'all' ? 'All projects' : `${statusFilter} projects`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500'}`}
            title="Grid view"
          >
            <FiGrid />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500'}`}
            title="List view"
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredVideos.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredVideos.map(video => (
            <EditorVideoCard
              video={video}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? "No projects match your filters" 
              : "You have no assigned projects"}
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            {searchTerm || statusFilter !== 'all' ? 'Reset filters' : 'Check for new assignments'}
          </button>
        </div>
      )}
    </div>
      <Footer></Footer>
    </>
  );
};

export default EditorDashboard;