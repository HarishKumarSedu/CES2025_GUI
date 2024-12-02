import React,{useEffect,useState,useRef} from "react";
import { delay, motion } from "framer-motion";
import { Forward } from 'lucide-react';
import { Alert } from "@material-tailwind/react";
import axios from 'axios';
import BASE_URL from '../../App';

const Ivm6311Config = () => {

  const [deviceSweep, setdeviceSweep] = useState({"dummy":"dummy"})
  const [vbsoAdcValue, setvbsoAdcValue] = useState(4.84)
  const [vbiasAdcValue, setvbiasAdcValue] = useState(6.25)
  const [vbaisPotValue, setvbaisPotValue] = useState('')
  const [vbsoPotValue, setvbsoPotValue] = useState('')
  const [powerupScript, setpowerupScript] = useState('')
  const [powerdownScript, setpowerdownScript] = useState('')
  const [muteIvmdevice, setmuteIvmdevice] = useState(false)
  const powerupScriptRef = useRef();
  const powerdownScriptRef = useRef();
  const statusCheck = () =>{
    axios.get('http://localhost:5000/device/sweep')
    .then(response=>{
      const data = response.data
      if (response.statusText !== "OK"){
        throw new Error(data.error);
      }
      else{
        if(data.success){
          setdeviceSweep({})

        } 
        else{
          setdeviceSweep(data.error)
        } 
      }
    })
    .catch()
  }

  const AdcCheck = (addr=41)=>{
    if (addr === 41){
      axios.get('http://127.0.0.1:5000//ivm6311/getadc/41')
      .then(response=>{
        const data = response.data
        if (response.statusText !== "OK"){
          throw new Error(data.error);
        }
        else{
          if(data.success){
            setvbsoAdcValue(data.success.adc)
  
          } 
          else{
            setvbsoAdcValue(0)
          } 
        }
      })
      .catch(()=> <Alert/> )
    }

    else if (addr===24){
      axios.get('http://127.0.0.1:5000//ivm6311/getadc/24')
      .then(response=>{
        const data = response.data
        if (response.statusText !== "OK"){
          throw new Error(data.error);
        }
        else{
          if(data.success){
            setvbiasAdcValue(data.success.adc)
  
          } 
          else{
            setvbiasAdcValue(0)
          } 
        }
      })
      .catch()
    }
    else{
      setvbiasAdcValue(0.01)
      setvbsoAdcValue(0.01)
    }
  }

  const setVbsoPotValue = e =>{
    e.preventDefault();
    const vbias = {
      "potAddr":"0x2F",
      "adcAddr":"0x29",
      "value":vbsoPotValue,
    }

    axios.post(`http://127.0.0.1:5000/ivm6311/setpot`, vbias)
      .then(response => {
        const data = response.data
        if (response.statusText !== "OK"){
          throw new Error(data.error);
        }
        else{
          if(data.success){
            setvbsoAdcValue(data.success.adc)
  
          } 
        }
      })
      .catch()
    setvbsoPotValue('')
  }

  const setVbiasPotValue = e =>{
    e.preventDefault();
    const vbias = {
      "potAddr":"0x2D",
      "adcAddr":"0x18",
      "value":vbaisPotValue,
    }

    axios.post(`http://127.0.0.1:5000/ivm6311/setpot`, vbias)
      .then(response => {
        const data = response.data
        if (response.statusText !== "OK"){
          throw new Error(data.error);
        }
        else{
          if(data.success){
            setvbiasAdcValue(data.success.adc)
  
          } 
        }
      })
      .catch()
    setvbaisPotValue('')
  }

  useEffect(() => {

    const statuscheckInterval = setInterval(() => {
      statusCheck();
     
    }, 6000);
    const vbsoADCkInterval = setInterval(() => {
      AdcCheck(41);
    }, 6000);
    const vbiasADCkInterval = setInterval(() => {
      AdcCheck(24);
    }, 6000);

     return ()=>{
       
       clearInterval(statuscheckInterval);
       clearInterval(vbsoADCkInterval);
       clearInterval(vbiasADCkInterval);
    }
  }, [statusCheck,AdcCheck])


  const powerupScriptSubmit = e => {
    e.preventDefault()
    const url = 'http://127.0.0.1:5000/ivm6311/powerup-script';
    const formData = new FormData();
    formData.append('file', powerupScript);
    formData.append('fileName', powerupScript.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config).then((response) => {
      powerupScriptRef.current.value = ''

    })
    .catch(error=> console.log(error))

  }
  const powerdownScriptSubmit = e => {
    e.preventDefault()
    const url = 'http://127.0.0.1:5000/ivm6311/powerdown-script';
    const formData = new FormData();
    formData.append('file', powerdownScript);
    formData.append('fileName', powerdownScript.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config).then((response) => {
      powerdownScriptRef.current.value = ''
    })
    .catch(error=> console.log(error))

  }

  const startEnd = e =>{
    const startstop = e.target.checked
    const state = {
      "state": startstop,
      "muteivm":muteIvmdevice
    }
    
    axios.post('http://127.0.0.1:5000/ivm6311/start-end', state)
      .then(response => {
        const data = response.data
        if (response.statusText !== "OK"){
          throw new Error(data.error);
        }
        else{
          if(data.success){
              vbsoAdcValue(data.success.vbso)
              vbiasAdcValue(data.success.vbias)
          } 
        }
      })
      .catch()

  }
  return (
    <motion.div
      className="flex flex-col gap-6 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg  border border-gray-700  rounded-xl p-10 "
      whileHover={{ y: -5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)" }}
    >
      <div className="flex items-center gap-6 ">
        <button className= {deviceSweep.length ?  "w-7 h-7 rounded-full bg-green-600 shadow-xl shadow-green-300 border-5 border-emerald-300" : "w-7 h-7 rounded-full bg-red-500 shadow-xl shadow-rose-400  border-5 border-rose-400"} onClick={()=>statusCheck()}></button>
        <h1 className="mt-1 text-xl font-semibold text-gray-400">
          Config IVM6311 :
        </h1>
      </div>
      {/* Vbias value set form  */}
      <form action="" className="flex flex-row gap-6 items-center" onSubmit={setVbiasPotValue}>
        <div>
          <p className="text-lg font-bold text-custom-pink items-start">{vbiasAdcValue}V</p>
        </div>
        <input name="vbias" type="text" 
        placeholder="Set Vbais code .." 
        pattern="[a-fA-F0-9]+"
        value={vbaisPotValue}
        onChange={(e) => setvbaisPotValue(e.target.value)}
        className="p-2 px-4 bg-gray-900 
        rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        
        "/>
        <button 
        type="submit"
        className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-custom-light-blue hover:border-collapse hover:bg-custom-light-blue hover:text-gray-100 ">
            Update</button>
      </form>
      {/* Vbso value set form  */}
      <form action="" className="flex flex-row gap-6 items-center" onSubmit={setVbsoPotValue}>
        <div>
          <p className="text-lg font-bold text-custom-light-inventvm-color items-start">{vbsoAdcValue}V</p>
        </div>
        <input
         type="number" 
         placeholder="Set Vbso code ..." 
         pattern="[a-fA-F0-9]+"
         value={vbsoPotValue}
         onChange={(e) => setvbsoPotValue(e.target.value)}
         className="p-2 px-4 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-custom-blue hover:border-collapse hover:bg-custom-blue hover:text-gray-100 ">Update</button>
      </form>
      {/* powerup Script uploading form */}
      <form action="" className="flex flex-col gap-0 items-start" onSubmit={powerupScriptSubmit}>
        <p className="text-sm font-bold text-gray-400" htmlFor='startup_script'>IVM6311 Power up script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  
        onChange={(e) => setpowerupScript(e.target.files[0])}
        placeholder="" 
        ref={powerupScriptRef}
        id="startup_script" 
        className= " flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" 
        type="file"/>
        <button 
        type="submit"
        className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-fuchsia-500 hover:border-collapse hover:bg-fuchsia-500 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      {/* Power down script uploading form  */}
      <form action="" className="flex flex-col gap-0 items-start" onSubmit={powerdownScriptSubmit}>
      <p className="text-sm font-bold text-gray-400" htmlFor='startup_script'>IVM6311 Powerdown script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  
          onChange={(e) => setpowerdownScript(e.target.files[0])}
          ref={powerdownScriptRef}
          placeholder="" 
          className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" id="startup_script" type="file"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-pink-600 hover:border-collapse hover:bg-pink-600 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      {/* mute powerup Script uploading form */}
      <form action="" className="flex flex-col gap-0 items-start" >
        <p className="text-sm font-bold text-gray-400" htmlFor='startup_script'>mute script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  
        onChange={(e) => setpowerupScript(e.target.files[0])}
        placeholder="" 
        // ref={powerupScriptRef}
        id="startup_script" 
        className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" 
        type="file"/>
        <button 
        type="submit"
        className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-orange-600 hover:border-collapse hover:bg-orange-600 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      {/* mute Power down script uploading form  */}
      <form action="" className="flex flex-col gap-0 items-start" >
      <p className="text-sm font-bold text-gray-400" htmlFor='startup_script'>Unmute script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  
          onChange={(e) => setpowerdownScript(e.target.files[0])}
          ref={powerdownScriptRef}
          placeholder="" 
          className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" id="startup_script" type="file"/>
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-emerald-600 hover:border-collapse hover:bg-emerald-600 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      {/* Start/Stop button  */}
    <div className="flex place-items-end gap-2">
    <div className="flex items-center mb-4">
    <input id="default-checkbox" type="checkbox" 
    value={muteIvmdevice}
    onChange={(e)=> setmuteIvmdevice(e.target.checked)}
    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label htmlFor="default-checkbox" className="ms-2 text-sm font-bold text-gray-900 dark:text-gray-400">Ivm/ mute</label>
    </div>
       <div className="flex items-center mb-4">
       <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" onChange={startEnd} />
          <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2
           peer-focus:ring-slate-500 dark:peer-focus:ring-bg-rose-700 rounded-full peer
            dark:bg-rose-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
             peer-checked:after:border-white after:content-[''] after:absolute 
             after:top-[2px] after:start-[2px] after:bg-white 
             after:border-gray-300 after:border after:rounded-full after:h-5 
             after:w-5 after:transition-all
           dark:border-gray-600 peer-checked:bg-emerald-500"></div>
          <span className="ms-3 text-sm font-bold text-gray-400 dark:text-gray-300">Start / End</span>
        </label>
       </div>
    </div>
    </motion.div>
  );
};

export default Ivm6311Config;