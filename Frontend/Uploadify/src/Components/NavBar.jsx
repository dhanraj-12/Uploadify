import { useState } from 'react'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()
  const userinfo = JSON.parse(localStorage.getItem('user-info'))
  const userimg = userinfo?.image || 'default-profile.png' // Fallback to a default image if not available
  console.log(userimg)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    localStorage.removeItem('user-info')
    navigate('/');

  }

  return (
    <>
      <nav className='bg-gray-900 border-b border-gray-700 sticky top-0 z-50'>
        <div className='flex items-center justify-between px-4 h-14'>
          {/* Left side - Logo and menu */}
          <div className='flex items-center space-x-4'>
            <button
              className='p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <FiX className='text-xl' />
              ) : (
                <FiMenu className='text-xl' />
              )}
            </button>
            <div className='flex items-center'>
              <Link to='/'>
                <span className='text-2xl font-bold text-red-500'>U</span>
                <span className='text-2xl font-bold text-white'>ploadify</span>
              </Link>
            </div>
          </div>

          {/* Right side - User icon */}
          <div className='flex items-center space-x-2'>
            <button className='p-2 rounded-full hover:bg-gray-700'>
              <img
                src={userimg}
                alt='User Avatar'
                className='w-8 h-8 rounded-full object-cover'
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full p-4'>
          <div className='flex items-center justify-between mb-8 p-2'>
            <div className='flex items-center'>
              <span className='text-2xl font-bold text-red-500'>U</span>
              <span className='text-2xl font-bold text-white'>ploadify</span>
            </div>
            <button
              className='p-1 rounded-md hover:bg-gray-700 text-gray-300'
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX className='text-xl' />
            </button>
          </div>

          <nav className='flex-1'>
            {/* Add your sidebar navigation items here */}
            <div className='space-y-2'>
              <Link
                to='/dashboard'
                className='block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md hover:text-white'
                onClick={() => setIsSidebarOpen(false)}
              >
                Dashboard
              </Link>
             
              
            </div>
          </nav>

          <div className='p-4 border-t border-gray-700'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md hover:text-white'
            >
              <FiLogOut className='text-lg' />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-50'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  )
}

export default NavBar
