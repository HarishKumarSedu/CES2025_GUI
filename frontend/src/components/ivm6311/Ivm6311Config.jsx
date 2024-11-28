import React from "react";
import { motion } from "framer-motion";
import { Forward } from 'lucide-react';

const Ivm6311Config = () => {
  return (
    <motion.div
      className="flex flex-col gap-6 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg  border border-gray-700  rounded-xl p-10 "
      whileHover={{ y: -5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)" }}
    >
      <div className="flex items-center gap-6 ">
        <button className="w-7 h-7 rounded-full bg-green-600 shadow-xl shadow-green-300 border-5 border-emerald-300"></button>
        <h1 className="mt-1 text-xl font-semibold text-gray-400">
          Config IVM6311 :
        </h1>
      </div>
      <form action="" className="flex flex-row gap-6 items-center">
        <div>
          <p className="text-lg font-bold text-custom-pink">5.5 V</p>
        </div>
        <input type="number" placeholder="Set Vbais 5.0 .." className="p-2 px-4 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-custom-light-blue hover:border-collapse hover:bg-custom-light-blue hover:text-gray-100 ">
            Update</button>
      </form>
      <form action="" className="flex flex-row gap-6 items-center">
        <div>
          <p className="text-lg font-bold text-custom-light-inventvm-color">5.5 V</p>
        </div>
        <input type="number" placeholder="Set Vbso 5.0 ..." className="p-2 px-4 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-custom-blue hover:border-collapse hover:bg-custom-blue hover:text-gray-100 ">Update</button>
      </form>
      <form action="" className="flex flex-col gap-0 items-start">
      <p className="text-sm font-bold text-gray-400" for='startup_script'>IVM6311 Startup script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  placeholder="" className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" id="startup_script" type="file"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-fuchsia-500 hover:border-collapse hover:bg-fuchsia-500 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      <form action="" className="flex flex-col gap-0 items-start">
      <p className="text-sm font-bold text-gray-400" for='startup_script'>IVM6311 Shutdown script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  placeholder="" className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" id="startup_script" type="file"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-pink-600 hover:border-collapse hover:bg-pink-600 hover:text-gray-100 ">Update</button>
        </div>
      </form>

    <div className="flex place-items-end">
       <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" />
          <div class="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2
           peer-focus:ring-slate-500 dark:peer-focus:ring-bg-rose-700 rounded-full peer
            dark:bg-rose-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
             peer-checked:after:border-white after:content-[''] after:absolute 
             after:top-[2px] after:start-[2px] after:bg-white 
             after:border-gray-300 after:border after:rounded-full after:h-5 
             after:w-5 after:transition-all
           dark:border-gray-600 peer-checked:bg-emerald-500"></div>
          <span class="ms-3 text-sm font-bold text-gray-400 dark:text-gray-300">Start / End</span>
        </label>
    </div>
    </motion.div>
  );
};

export default Ivm6311Config;
