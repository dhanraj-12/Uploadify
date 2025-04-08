import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiMenu, FiUser } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google'
import {useNavigate} from 'react-router-dom';
import { googleAuth } from "../utility/api";


function Login () {

    const navigate = useNavigate();
    // const [user, setUser] = useState(null);
  
  
    const googleresponse = async( authResult )=> {
      try {
        console.log(authResult)
        if(authResult["code"]) {
          const result = await googleAuth(authResult.code);
          console.log(result)
  
          if (!result.data || !result.data.user) {
            throw new Error("User data is missing from API response");
          }
  
          
                  const {email, name, image} = result.data.user;
                  const token = result.data.token;
                  const obj = {email,name, token, image};
          localStorage.setItem('user-info',JSON.stringify(obj))
          navigate("/Dashboard")
        }else {
          console.log(authResult);
                  throw new Error(authResult);
        }
     
      } catch (err) {
        console.log('Error while Google Login...', err);
      }
    }
  
  
  
    const googlelogin = useGoogleLogin({
      onSuccess: googleresponse,
      onError: googleresponse,
      flow: 'auth-code'
    })



  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* YouTube-inspired Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left side - Logo and menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiMenu className="text-xl" />
            </button>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-red-600">U</span>
              <span className="text-2xl font-bold">ploadify</span>
            </div>
          </div>

          {/* Center - Search bar */}
          {/* <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:border-blue-500"
              />
              <button className="absolute right-0 top-0 h-full px-5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200">
                <FiSearch className="text-xl" />
              </button>
            </div>
            <button className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FiMic className="text-xl" />
            </button>
          </div> */}

          {/* Right side - Icons */}
          <div className="flex items-center space-x-2">
            {/* <button className="p-2 rounded-full hover:bg-gray-200 hidden sm:block">
              <FiVideo className="text-xl" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiBell className="text-xl" />
            </button> */}
            <button className="p-2 rounded-full hover:bg-gray-200">
              <FiUser className="text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Google Sign-in */}
      <main className="flex-grow flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
          <p className="text-gray-600 mb-8">Sign in with your Google account</p>
          
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={googlelogin}
          >
            <FcGoogle className="text-xl" />
                
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl font-bold text-red-600">U</span>
              <span className="text-xl font-bold">ploadify</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
            
            <div className="mt-4 md:mt-0 text-gray-500 text-sm">
              © {new Date().getFullYear()} WriteUploadify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;