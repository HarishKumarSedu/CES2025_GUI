import React, { useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Home from './components/Home'
import IVM6311 from './components/IVM6311'
import IVM6310 from './components/IVM6310'
import Devices from './components/Devices'
import Setting from './components/Setting'
import { ToastContainer } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
// CALL IT ONCE IN YOUR APP
if (typeof window !== "undefined") {
  injectStyle();
}

const App = () => {

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition: Bounce
      />
    <div className="flex h-screen bg-gray-900 text-gray-50 overflow-hidden min-w-720px">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gra-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/ivm6311' element={<IVM6311 />} />
          <Route path='/ivm6310' element={<IVM6310 />} />
          <Route path='/products' element={<Devices />} />
          <Route path='/settings' element={<Setting />} />
      </Routes>
    </div>
    </>
  )
}

export default App

// import React from 'react';
// import Carousel from './components/Carousel';

// const App = () => {
// const images = [
//     'https://media.istockphoto.com/id/1802021960/it/foto/sfondo-verde-sfumato-4k-piccoli-pixel.webp?s=2048x2048&w=is&k=20&c=rdQ8NV8XxiglXEtNjzwcq0_OpvbZn-S-q36q3_tWqgQ=',
//     'https://plus.unsplash.com/premium_photo-1673688152102-b24caa6e8725?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     '<https://via.placeholder.com/800x400.png?text=Slide+3>',
//   ];

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1 className="text-4xl font-bold text-center my-6">Tailwind CSS Carousel with React</h1>
//       </header>
//       <main className="flex justify-center items-center min-h-screen bg-gray-100">
//         <Carousel images={images} />
//       </main>
//     </div>
//   );
// };

// export default App;