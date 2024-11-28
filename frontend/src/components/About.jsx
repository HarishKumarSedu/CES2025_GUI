import React from 'react'
import Header from './Header'
import { ShieldQuestion } from 'lucide-react'
const About = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="About" color='text-custom-green' icon={ShieldQuestion}/>
    </div>
  )
}

export default About
