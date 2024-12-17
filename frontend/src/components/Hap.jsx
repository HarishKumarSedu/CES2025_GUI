import React from 'react'
import Header from './Header'
import { CirclePower,Copyright } from 'lucide-react'
import {motion} from 'framer-motion'
import ivm6310_switch_button_demo from '../assets/demos/ivm6310_switch_button_demo.jpg'
import powerhap from '../assets/demos/powerhap.png'
const Hap = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Haptic" color='text-custom-blue' icon={CirclePower}/>
      <h1 className=" text-2xl font-semibold text-gray-400  mt-10 m-5">
          IVM6310 Haptic Demo :
        </h1>
      <div className='grid grid-cols-1  justify-center m-5 gap-6'>
        <div>

        <motion.img 
        whileHover={
          { scale: 1.05, 
          }
       } 
       transition={{duration: 0.5}}
        src={ivm6310_switch_button_demo} alt="ivm6310_switch_button_demo" className=' w-[40rem] object-contain rounded-lg' />
        </div>
        <div className='flex flex-col'>
        <span className="m-2 flex flex-row items-center align-middle gap-2 text-xl font-semibold text-gray-400">
                    <Copyright size={20} /> TDK 
                </span>
        <motion.img
                whileHover={
                  { scale: 1.008, 
                  }
               } 
               transition={{duration: 0.5}}
        src={powerhap} alt="powerhap" className='w-max-full object-contain rounded-lg' />
        </div>
      </div>
    </div>
  )
}

export default Hap