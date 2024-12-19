import React from 'react'
import Header from './Header'
import { CirclePower,Copyright } from 'lucide-react'
import {motion} from 'framer-motion'
import ivm6310_switch_button_demo from '../assets/demos/ivm6310_switch_button_demo.jpg'
import powerhap from '../assets/demos/powerhap.png'
import HapConfig from './Hap/HapConfig'
const Hap = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Haptic" color='text-custom-blue' icon={CirclePower}/>
      <div className="grid grid-cols-1 m-5 lg:grid-cols-2 gap-10 justify-between">
        <HapConfig/>
        <motion.img 
        whileHover={
          { scale: 1.05, 
          }
       } 
       transition={{duration: 0.5}}
        src={ivm6310_switch_button_demo} alt="ivm6310_switch_button_demo" className=' w-[30rem] object-contain rounded-lg' />
        </div>
        <div className='flex flex-col m-5'>
        <div className="flex flex-row gap-1 items-center mt-5 mb-5 text-xl font-semibold text-gray-400 ">
          <Copyright/> <h1>TDK</h1>
        </div>
        <motion.img
                whileHover={
                  { scale: 1.008, 
                  }
               } 
               transition={{duration: 0.5}}
        src={powerhap} alt="powerhap" className='w-max-full object-contain rounded-lg' />
        </div>
      </div>
  )
}

export default Hap