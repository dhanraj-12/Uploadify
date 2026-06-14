import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FiMenu, FiUser } from 'react-icons/fi'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { googleAuth } from '../utility/api'
import NavBar from './NavBar'
import Footer from './Footer'

function Login () {
  const navigate = useNavigate()
  // const [user, setUser] = useState(null);

  const googleresponse = async authResult => {
    try {
      console.log(authResult)
      if (authResult['code']) {
        const result = await googleAuth(authResult.code)
        console.log(result)

        if (!result.data || !result.data.user) {
          throw new Error('User data is missing from API response')
        }

        const { email, name, image } = result.data.user
        const token = result.data.token
        const obj = { email, name, token, image }
        localStorage.setItem('user-info', JSON.stringify(obj))
        navigate('/Dashboard')
      } else {
        console.log(authResult)
        throw new Error(authResult)
      }
    } catch (err) {
      console.log('Error while Google Login...', err)
    }
  }

  const googlelogin = useGoogleLogin({
    onSuccess: googleresponse,
    onError: googleresponse,
    flow: 'auth-code'
  })

  return (
    <div className='flex flex-col min-h-screen bg-gray-900'>
      <NavBar></NavBar>
    {/* Navigation would go here */}
    
    <main className="flex-grow flex justify-center items-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-400"
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
        
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Welcome</h2>
        <p className="text-gray-400 mb-8">Sign in with your Google account</p>
        
        <button 
          className="w-full flex items-center justify-center gap-3 bg-gray-700 border border-gray-600 text-gray-100 px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={googlelogin}
        >
          <FcGoogle className="text-xl" />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>
    </main>
    
    {/* Footer would go here */}
    <Footer></Footer>
  </div>
  )
}

export default Login
