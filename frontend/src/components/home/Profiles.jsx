import React from 'react'
import ProfileCard from './ProfileCard'

const Profiles = () => {
  return (
    <div className='grid grid-rows-1 justify-center col-span-1 gap-8  pb-5  ml-10  lg:grid-cols-4 lg:col-span-4 '>
      <ProfileCard image='https://www.inventvm.com/wp-content/uploads/2022/10/Michele-Chiabrera-1-300x300.jpg' name='Michele Chiabrera' role='co-founder / CEO'/>
      <ProfileCard image='https://www.inventvm.com/wp-content/uploads/2023/01/Foto-Francesco-Rezzi.jpg' name='Dr. Francesco Rezzi' role='co-founder / CTO'/>
      <ProfileCard image='https://media.licdn.com/dms/image/v2/C5603AQFSIoZjhFEFhA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516268045720?e=1737590400&v=beta&t=xfwiXNyvd_VGhEgL27M-YMPeAjyACPVWTA5qJ4gN3ek' name='Domenico Granozio' role='Application Manager'/>
      <ProfileCard image='https://media.licdn.com/dms/image/v2/D4D03AQFkB4sOuAhjrw/profile-displayphoto-shrink_400_400/B4DZNkIui1GUAo-/0/1732551830383?e=1739404800&v=beta&t=hpNMlMCUsuPlFuTFt-qSo27mJnaGObSbfS1WoPJCCRc' name='Marco Musacci' role='Senior System Engineer'/>
    </div>
  )
}

export default Profiles;
