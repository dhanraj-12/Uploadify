import React from 'react'

function Footer () {
  return (
    <>
      <footer className='bg-white border-t border-gray-200 py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center mb-4 md:mb-0'>
              <span className='text-2xl font-bold text-red-600'>U</span>
              <span className='text-xl font-bold'>ploadify</span>
            </div>

            <div className='flex space-x-6'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                About
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Terms
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Privacy
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Contact
              </a>
            </div>

            <div className='mt-4 md:mt-0 text-gray-500 text-sm'>
              © {new Date().getFullYear()} Uploadify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
