import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Components/Login';
import RefreshHandler from './Components/RefreshHandler';
import UploadifyLanding from './Components/UploadifyLanding';
import UserRole from './Components/UserRole';
import YouTuberDashboard from './Components/YouTuberDashboard';
import VideoCard from './Components/VideoComponent';
import EditorVideoCard from './Components/EditorVideoCard';
import EditorDashboard from './Components/EditorDashboard';
import VideoPlayer from './Components/VideoPlayer';
import EditorVideoPlayer from './Components/Editorplayer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const GoogleWrapper = () => {
    return (
      <GoogleOAuthProvider clientId='785899435218-afmvmof1h4jgk3f8s8u3pn89ls8v32cr.apps.googleusercontent.com'>
        <Login />
      </GoogleOAuthProvider>
    );
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<UploadifyLanding />} />
        <Route path="/login" element={<GoogleWrapper />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<UploadifyLanding />} />} />
        <Route path="/UserRole" element={<PrivateRoute element={<UserRole />} />} />
        <Route path="/YouTuberDashboard" element={<PrivateRoute element={<YouTuberDashboard />} />} />
        <Route path="/VideoCard" element={<PrivateRoute element={<VideoCard />} />} />
        <Route path="/EditorVideoCard" element={<PrivateRoute element={<EditorVideoCard />} />} />
        <Route path="/EditorDashboard" element={<PrivateRoute element={<EditorDashboard />} />} />
        <Route path="/video/:id" element={<PrivateRoute element={<VideoPlayer />} />} />
        <Route path="/editorvideo/:id" element={<PrivateRoute element={<EditorVideoPlayer />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;