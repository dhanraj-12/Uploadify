import React from 'react'

function Footer () {
  return (
    <>
      <footer className='bg-gray-900 border-t border-gray-700 py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center mb-4 md:mb-0'>
              <span className='text-2xl font-bold text-red-500'>U</span>
              <span className='text-xl font-bold text-white'>ploadify</span>
            </div>

            <div className='flex space-x-6'>
              <a href='#' className='text-gray-400 hover:text-white'>
                About
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                Terms
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                Privacy
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                Contact
              </a>
            </div>

            <div className='mt-4 md:mt-0 text-gray-400 text-sm'>
              © {new Date().getFullYear()} Uploadify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer