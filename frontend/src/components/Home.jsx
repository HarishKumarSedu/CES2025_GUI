import React from 'react'
import {motion} from 'framer-motion'
import Header  from './Header'
import { House } from 'lucide-react'
import Carousel from './home/Carousel'
import HeroContent from './home/HeroContent'
import Profiles from './home/Profiles'


const Home = () => {
  return (
    
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="" color='text-custom-light-blue' icon={House} />
      <div className='m-5 mt-0 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 '>
        <HeroContent />
        <Carousel />
        <Profiles/>
      </div>
    </div>

    
  )
}

export default Home

