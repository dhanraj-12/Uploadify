import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

function UserRole () {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleRoleSelect = role => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      if (selectedRole === 'youtuber') {
        navigate('/YouTuberDashboard')
      } else {
        navigate('/EditorDashboard')
      }
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-900'>
    {/* Navigation Bar */}
    <NavBar />
  
    {/* Main Content */}
    <main className='flex-grow flex justify-center items-center p-4'>
      <div className='bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='w-16 h-16 rounded-full bg-blue-900 bg-opacity-20 flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-8 text-blue-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
          </div>
          <h2 className='text-3xl font-bold text-gray-100 mb-2'>
            Select Your Role
          </h2>
          <p className='text-gray-400'>Choose how you'll use Uploadify</p>
        </div>
  
        <div className='space-y-4 mb-6'>
          {/* YouTuber Card */}
          <div
            onClick={() => handleRoleSelect('youtuber')}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRole === 'youtuber'
                ? 'border-red-500 bg-red-900 bg-opacity-20'
                : 'border-gray-700 hover:border-red-400'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-red-900 bg-opacity-30 p-3 rounded-full'>
                <svg
                  className='h-6 w-6 text-red-400'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-100'>
                  YouTuber
                </h3>
                <p className='text-sm text-gray-400'>
                  Upload raw videos and manage your content
                </p>
              </div>
            </div>
          </div>
  
          {/* Editor Card */}
          <div
            onClick={() => handleRoleSelect('editor')}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRole === 'editor'
                ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                : 'border-gray-700 hover:border-blue-400'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-blue-900 bg-opacity-30 p-3 rounded-full'>
                <svg
                  className='h-6 w-6 text-blue-400'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </div>
              <div className='ml-4'>
                <h3 className='text-lg font-medium text-gray-100'>Editor</h3>
                <p className='text-sm text-gray-400'>
                  Download, edit, and upload videos for creators
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            selectedRole
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
        >
          Continue
        </button>
      </div>
    </main>
  
    {/* Footer */}
    <Footer />
  </div>
  )
}

export default UserRole
