import React from 'react'
import { FiMenu, FiUser } from 'react-icons/fi';
  
function NavBar () {
  return (
    <>
      <nav className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='flex items-center justify-between px-4 h-14'>
          {/* Left side - Logo and menu */}
          <div className='flex items-center space-x-4'>
            <button className='p-2 rounded-full hover:bg-gray-200'>
              <FiMenu className='text-xl' />
            </button>
            <div className='flex items-center'>
              <span className='text-2xl font-bold text-red-600'>U</span>
              <span className='text-2xl font-bold'>ploadify</span>
            </div>
          </div>

          {/* Right side - User icon */}
          <div className='flex items-center space-x-2'>
            <button className='p-2 rounded-full hover:bg-gray-200'>
              <FiUser className='text-xl' />
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar
