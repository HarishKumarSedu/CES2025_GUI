import React from 'react'
import Header from './Header'
import { Settings } from 'lucide-react'

const Setting = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Settings" color='text-custom-blue' icon={Settings}/>
    </div>
  )
}

export default Setting
Settings