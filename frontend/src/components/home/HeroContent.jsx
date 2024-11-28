import React from 'react'
import {motion} from 'framer-motion'

const HeroContent = () => {
  return (
    <div
      className="grid grid-cols-1 gap-1 justify-center m-5 lg:m-10 xl:m-15 "
    > 
      <div className='flex absolute gap-1  tracking-normal '>
          <h1 className='text-start text-custom-green font-serif  text-3xl lg:text-4xl font-bold mr-2 hover:text-custom-light-inventvm-color '>CES</h1>
          <h1 className='text-start text-custom-light-inventvm-color font-sans text-3xl lg:text-4xl font-bold mr-2 hover:text-custom-green'>2025</h1>
      </div>
        <div className='justify-start mt-10  tracking-normal indent-2 font-sans text-xl text-gray-300 text-wrap '>
          <br/>
          <p className='hover:text-gray-400'>Lorem ipsum odor amet, consectetuer adipiscing elit. Dictumst taciti venenatis ante natoque fringilla. Rutrum natoque pharetra cras arcu volutpat habitant augue torquent accumsan. Nostra curae sodales quis egestas primis orci torquent. Suspendisse id cursus vulputate nisi suscipit consectetur nec laoreet vehicula. Feugiat ultricies nascetur tempus pellentesque auctor ante.</p>
          <br/>
          <p className='hover:text-gray-400'>Vitae porttitor sociosqu posuere eu ac himenaeos proin. Nisl turpis taciti congue eleifend montes massa. </p>
        </div>
        <div className='flex'></div>
      </div>
    
  )
}

export default HeroContent
