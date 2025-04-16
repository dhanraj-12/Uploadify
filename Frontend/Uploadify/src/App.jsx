import React, { useState } from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './Components/Login';
import RefrshHandler from './Components/RefreshHandler';
import DashBoard from './Components/DashBoard';
import UserRole from './Components/UserRole';
import YouTuberDashboard from './Components/YouTuberDashboard';
import VideoCard from './Components/VideoComponent';
import EditorVideoCard from './Components/EditorVideoCard';
import EditorDashboard from './Components/EditorDashboard';
import VideoPlayer from './Components/VideoPlayer';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const GoogleWrapper = () => {
    return (
      <>
        <GoogleOAuthProvider clientId='785899435218-afmvmof1h4jgk3f8s8u3pn89ls8v32cr.apps.googleusercontent.com'>
          <Login />
        </GoogleOAuthProvider>
      </>
    )
  };


  const PrivateRoute = ({ element }) => {
		return isAuthenticated ? element : <Navigate to="/login" />
	};



  return (
  <>
    <BrowserRouter>
		    <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
			<Routes>
				<Route path="/login" element={<GoogleWrapper />} />
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path='/DashBoard' element={<PrivateRoute element={<DashBoard/>}/>}/>
        <Route path='/UserRole' element={<UserRole/>} />
        <Route path='/YouTuberDashboard' element = {<YouTuberDashboard/>}/>
        <Route path='/VideoCard' element = {<VideoCard/>}/>
        <Route path='/EditorVideoCard' element = {<EditorVideoCard/>}/>
        <Route path='/EditorDashboard' element = {<EditorDashboard/>}/>
        <Route path="/video/:id" element={<VideoPlayer />} />
			</Routes>
	</BrowserRouter>
  </>
  );
}

export default App;