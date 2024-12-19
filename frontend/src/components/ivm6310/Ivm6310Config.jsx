import React,{useState,useRef,useEffect} from "react";
import { motion } from "framer-motion";
import { Forward } from 'lucide-react';
import { ToastContainer, toast,Bounce } from 'react-toastify';
import {toastoptions} from "../toast/constants";
import axios from "axios";
import {DRAGON_FLY_RIGHT_SPEAKER_SCRIPT_URL, DRAGON_FLY_LEFT_SPEAKER_SCRIPT_URL,DRAGON_FLY_SETUP_STATE,START_END_URL} from './Ivm6310Constants'
// const DRAGON_FLY_LEFT_SPEAKER_SCRIPT_URL = 'http://localhost:5000/ivm6310/dragon-fly-left-script';
// const DRAGON_FLY_RIGHT_SPEAKER_SCRIPT_URL = 'http://localhost:5000/ivm6310/dragon-fly-right-script';
// const DRAGON_FLY_SETUP_STATE = 'http://localhost:5000/ivm6310/dragon-fly-setup-state';
const Ivm6310Config = () => {
  const [deviceSweep, setdeviceSweep] = useState({})
  const [deviceSweepIntervalCount, setdeviceSweepSweepIntervalCount] = useState(0)
  const [dragonFlyLeftScript, setdragonFlyLeftScript] = useState('')
  const [dragonFlyRightScript, setdragonFlyRightScript] = useState('')
  const dragonFlyLeftScriptRef = useRef();
  const dragonFlyRightScriptRef = useRef();
  const intervalID = useRef(null);
  const [deviceState, setDeviceState] = useState(false)

  const setupState = (e) => {
    
    axios.get(DRAGON_FLY_SETUP_STATE)
      .then(response=>{
        if (response.statusText == 'OK'){
          setdeviceSweepSweepIntervalCount(0)
          setdeviceSweep(response.data.success.Deviceses)
          setDeviceState(response.data.success.state)
          toast.success(`🕺💕🦋 ${response.data.success.message}`,toastoptions);
        }
        else{
          setdeviceSweep({})
          setdeviceSweepSweepIntervalCount(state => state+1)
          toast.error(` 👹🛑 ${response.data.success.message}!..${response.data.success.Deviceses}`,toastoptions);
        }
      })
      .catch(err=> 
      {
        // check for the server termination 
        setdeviceSweepSweepIntervalCount(state => state+1)
        setdeviceSweep({})
        if(err.code == 'ERR_NETWORK'){
          toast.error(` ✋🛑 Server Stoped`,toastoptions);
        }
       else{
        if(err.response.data.error){
          const error = err.response.data.error
          if (error.message){
            
            toast.error(` ✋🛑 ${error.message}!..${error.Deviceses}`,toastoptions);
          }
          
          else{
            toast.error(` ✋🥵💩 ${error}!..`,toastoptions);
            
          }
        }
       }
      }
      )
  }
    // dragonFlyLeftScriptSubmit 
    const dragonFlyLeftScriptSubmit = e => {
      e.preventDefault()
      const url = DRAGON_FLY_LEFT_SPEAKER_SCRIPT_URL;
      const formData = new FormData();
      formData.append('file', dragonFlyLeftScript);
      formData.append('fileName', dragonFlyLeftScript.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      axios.post(url, formData, config).then((response) => {
        if (response.statusText == 'OK'){
          dragonFlyLeftScriptRef.current.value = ''
          toast.success(`💖💃 ${response.data.success}`,toastoptions);
        }
        else{
          toast.error(' 👹🛑 Error in uploading file!..',toastoptions);
        }
      })
      .catch(error=> 
        
      {
        if(error.code == 'ERR_NETWORK'){
          toast.error(` ✋🛑 Server Stoped`,toastoptions);
        }
        else{

          toast.error(' 👻 Somthing went wrong!..', toastoptions);
        }
      }
      )
  
    }
    const dragonFlyRightScriptSubmit = e => {
      e.preventDefault()
      const url = DRAGON_FLY_RIGHT_SPEAKER_SCRIPT_URL;
      const formData = new FormData();
      formData.append('file', dragonFlyRightScript);
      formData.append('fileName', dragonFlyRightScript.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      axios.post(url, formData, config).then((response) => {
        if (response.statusText == 'OK'){
          dragonFlyRightScriptRef.current.value = ''
          toast.success(`💝🏖️🥳 ${response.data.success}`,toastoptions);
        }
        else{
          toast.error(' 👹🛑 Error in uploading file!..',toastoptions);
        }
      })
      .catch(error=> 
        
      {
        if(error.code == 'ERR_NETWORK'){
          toast.error(` ✋🛑 Server Stoped`,toastoptions);
        }
        else{

          toast.error(' 👻 Somthing went wrong!..', toastoptions);
        }
      }
      )
  
    }
    useEffect(() => {
      intervalID.current = setInterval(() => {
        if(deviceSweepIntervalCount < 5){
          setupState()
        }
        else{
          clearInterval(intervalID.current)
          intervalID.current = null
          setDeviceState(false)
        }
     }, 10000);
     return () => clearInterval(intervalID.current);
    }, [setupState])

    const startEnd = (e) => {
        // use the device update fucntion instead of the setStateDeviceState
        setDeviceState( e.target.checked);
        const state = e.target.checked
        axios
          .post(DRAGON_FLY_SETUP_STATE, {'state': state})
          .then((response) => {
            const data = response.data;
            if (response.statusText !== "OK") {
            } else {
              if (data.success) {
                if (deviceState.state) {
                  toast.warning(
                    `🥳👏 Dragon fly demo is running`,
                    toastoptions
                  );
                } else {
                  toast.info(
                    `🥳👏 Dragon fly demo is running`,
                    toastoptions
                  );
                }
              }
            }
          })
          .catch((error) => {
            if (error.code == "ERR_NETWORK") {
              toast.error(` ✋🛑 Server Stoped`, toastoptions);
              setDeviceState(false)
            } else {
              toast.error(" 👻 Somthing went wrong!..", toastoptions);
              setDeviceState(false)
            }
          });
      };
  return (
    <motion.div
      className="flex flex-col gap-6 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg  border border-gray-700  rounded-xl p-10 "
      whileHover={{ y: -5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)" }}
    >
      <div className="flex items-center gap-6 ">
        <button className= {` w-7 h-7 rounded-full  shadow-xl   ${Object.keys(deviceSweep).length == 0 ? "bg-red-500 shadow-rose-400  border-5 border-rose-400" :"bg-green-600 shadow-green-300 border-5 border-emerald-300"  } `} onClick={setupState}></button>
        <h1 className="mt-1 text-xl font-semibold text-gray-400">
          Config Dragon fly IVM6310 :
        </h1>
      </div>
      <form action="" className="flex flex-col gap-0 items-start" onSubmit={dragonFlyLeftScriptSubmit}>
      <p className="text-sm font-bold text-gray-400" htmlFor='startup_script'>IVM6310 Left Speaker .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  
          onChange={(e) => setdragonFlyLeftScript(e.target.files[0])}
          placeholder="" 
          ref={dragonFlyLeftScriptRef}
        className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" id="startup_script" type="file"/>
        <button 
        type="submit"
        className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-fuchsia-500 hover:border-collapse hover:bg-fuchsia-500 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      <form action="" className="flex flex-col gap-0 items-start" onSubmit={dragonFlyRightScriptSubmit}>
      <p className="text-sm font-bold text-gray-400" htmlFor='startup_script'>IVM6310 Right Speaker script .csv/.json</p>
        <div className="flex flex-row gap-6 items-center"> 
        <input  
          onChange={(e) => setdragonFlyRightScript(e.target.files[0])}
          placeholder="" 
          ref={dragonFlyRightScriptRef}
          className= "flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue" id="startup_script" type="file"/>
        <button 
        type="submit"
        className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-pink-600 hover:border-collapse hover:bg-pink-600 hover:text-gray-100 ">Update</button>
        </div>
      </form>
      <div className="flex items-center mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={deviceState}
              className="sr-only peer"
              onChange={startEnd}
            />
            <div
              className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2
           peer-focus:ring-slate-500 dark:peer-focus:ring-bg-rose-700 rounded-full peer
            dark:bg-rose-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
             peer-checked:after:border-white after:content-[''] after:absolute 
             after:top-[2px] after:start-[2px] after:bg-white 
             after:border-gray-300 after:border after:rounded-full after:h-5 
             after:w-5 after:transition-all
           dark:border-gray-600 peer-checked:bg-emerald-500"
            ></div>
            <span className="ms-3 text-sm font-bold text-gray-400 dark:text-gray-300">
              {" "}
              Start / End
            </span>
          </label>
        </div>
    </motion.div>
  );
};

export default Ivm6310Config;
