import React from 'react'
import { motion } from 'framer-motion'
import { Copyright } from 'lucide-react';
import flora from '../../assets/flora/flora.png'
import conventional_speaker from '../../assets/flora/conventional_speaker.jpg'
import dragonfly_speaker from '../../assets/flora/dragonfly_speaker.jpg'
const FloraTech = () => {
    return (
        <motion.div
            className="flex flex-col"
            whileHover={{ y: -5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)" }}
        >
            <div className='flex flex-col  '>
                <span className="m-2 flex flex-row items-center align-middle gap-2 text-xl font-semibold text-gray-400">
                    <Copyright size={20} />  <img src={flora} alt="flora" className='h-[3rem] w-[8rem]' />
                </span>
            </div>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-2  mr-5 '>
            <div className='flex flex-col align-middle justify-center items-center'>
                    <h1 className="mt-1 text-2xl font-semibold text-gray-400 ">
                        Conventional piezo Frequency Response
                    </h1>
                    {/* <hr className="w-full m-2  h-1 bg-gray-700 border-0 rounded  dark:bg-gray-700" /> */}
                    <h4 className='text-gray-300 font-semibold font-sans text-lg text-wrap indent-4 ml-5 mt-5'>
                        {'\t'} Piezo actuators have served as alarms and speakers for decades, offering advantages such as a slim profile and low power consumption. Yet, their effectiveness hinges on their capability to reproduce low frequencies. Unfortunately, conventional piezo speakers struggle to produce audio frequencies below 400Hz, leading to minimal or even nonexistent bass output.
                    </h4>
                    <img src={conventional_speaker} alt=" dragon fly speaker" className='rounded-lg m-2 scale-75 mt-4 mb-4' />
                </div>
                <div className='flex flex-col align-middle justify-center items-center'>
                    <h1 className="mt-1 text-2xl font-semibold text-gray-400 ">
                        Dragonfly™ Frequency Response
                    </h1>
                    {/* <hr className="w-full m-2  h-1 bg-gray-700 border-0 rounded  dark:bg-gray-700" /> */}
                    <h4 className='text-gray-300 font-semibold font-sans text-lg indent-4 text-wrap mt-5'>
                        {'\t'} Dragonfly™ is meticulously designed and optimized by top minds in Silicon Valley, employing state-of-the-art DOE and numerical simulation techniques. This effort has resulted in a flat frequency response ranging from 60 to 20 kHz. Furthermore, it provides customization capabilities to adjust the frequency response range and output power to align with the specific needs of any application.
                    </h4>
                    <img src={dragonfly_speaker} alt=" dragon fly speaker" className='rounded-lg m-2 scale-75 mt-4 mb-4' />
                </div>
            </div>
        </motion.div>
    )
}

export default FloraTech
