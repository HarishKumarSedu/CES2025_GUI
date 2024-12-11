import React from 'react'
import logo from '../assets/logo.png'
import { useState,useEffect } from 'react';
import { House } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

const Header = ({title,icon:Icon,color='text-gray-50' }) => {
  return (
    <div className = 'flex flex-row justify-between bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 lg:flex-row sm:flex-col'>
      <div className='max-w-lg mx-1 py-4 px-4 sm:px-4 lg:px-8 md:px-6 '>
      <img src={logo} alt="Inventvm" 
                    className='object-contain relative h-auto w-auto lg:h-8 sm:h-4 md:h-6 hover:opacity-70 '
                />
			</div>
      <div className='max-w-7xl mx-1 py-4 px-4 hidden lg:block lg:px-8 md:px-4 md:block '>
				{/* <h1 className={`text-2xl font-semibold ${color}`} >{title}</h1>  */}
        <span className="flex items-center text-sm font-medium text-gray-400">
          
          <Icon size={30} className={`mr-2 text-2xl font-semibold ${color}`}  />
          <p className={`text-xl font-semibold ${color}`}> {title}</p>
        </span>
			</div>
    </div>
  )
}

export default Header
Header