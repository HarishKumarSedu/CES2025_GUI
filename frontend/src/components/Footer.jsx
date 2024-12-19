import React from 'react'
import {MapPinHouse,Copyright } from 'lucide-react'
const Footer = () => {
  return (
    <div className = 'flex flex-row justify-between bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 lg:flex-row sm:flex-col'>
        <span className="ml-5 mt-2 flex items-start text-sm font-medium text-gray-400 gap-2">
          <Copyright   size={20} className={`mr-2 text-2xl font-semibold `}  />
          <p className={`text-lg font-semibold text-gray-300`}> 
            <span className='italic text-gray-200 font-semibold'>Inventvm Semiconductor SRL, </span> 
          </p>
        </span>
      <div className='max-w-7xl mx-1 py-4 px-4 hidden lg:block lg:px-8 md:px-4 md:block '>
        <span className="flex items-center text-sm font-medium text-gray-400 gap-2">
          <MapPinHouse  size={30} className={`mr-2 text-2xl font-semibold  `}  />
          <p className={`text-xl font-semibold text-gray-300`}> 
            <span className='italic text-gray-200 font-semibold'>Inventvm Semiconductor SRL, </span> 
          <br/>  Viale Alessandro Brambilla 60,
          <br/>  27100 Pavia, Italy +39 0382 189 0600 ,
          <br/>  info@inventvm.com  </p>
        </span>
            </div>
    </div>
  )
}

export default Footer