import React from 'react'

function Leftarrow() {
  return (
    <div className="specialdeal-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/60 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
  )
}

export default Leftarrow
