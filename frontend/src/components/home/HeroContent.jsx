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
          <p className='hover:text-gray-400 indent-4'>
          <span className='text-gray-200 font-bold italic'>INVENTVM</span>  is the leading Italian fabless IC company.
          We are located in Pavia, Italy, in the heart of the Ticino River Silicon Valley. <br/><br/>
            
          Our core strength is simple: continuous innovation through breakthrough ideas. Whether it is our PiezoDrive™ piezo amplifier and DSP technology, VoltaTek™ BMS platform, or turnkey IC services for our commercial partners, we push the boundaries of technology in everything we do, Efficientl, Reliably.<br/><br/>
            
          Founded in 2021 as a result of a management buyout of an existing R&D design center, our specialty is mixed signal IC, DSP algorithms and IP development, with a specific focus on power management and audio.
          </p>
          {/* <p className='hover:text-gray-400'>Vitae porttitor sociosqu posuere eu ac himenaeos proin. Nisl turpis taciti congue eleifend montes massa. </p> */}
          <h1 className='text-start text-custom-light-inventvm-color font-sans text-xl lg:text-3xl font-semibold mr-2 mt-4 mb-2 hover:text-custom-green'>Mission</h1>
          <p className='hover:text-gray-400 indent-4'>
          Sustainable Innovation in Power and Audio Systems
          </p>
        </div>
      </div>
    
  )
}

export default HeroContent
