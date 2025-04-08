import React, { useState } from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './Components/Login';
import RefrshHandler from './Components/RefreshHandler';
import DashBoard from './Components/DashBoard';

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
			</Routes>
	</BrowserRouter>
  </>
  );
}

export default App;