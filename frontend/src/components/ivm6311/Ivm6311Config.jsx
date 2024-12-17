import React, { useEffect, useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import StatePool from "state-pool";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  GET_SETUP_STATE,
  SLAVE_DEVICES,
  START_END_IVM_ONLY_URL,
  ADC_CHECK_URL,
  POWERUP_ALL_SCRIPT_URL,
  POWERDOWN_ALL_SCRIPT_URL,
  DEVICE_SWEEP_URL,
  IVM_POWERDOWN_SCRIPT_URL,
  IVM_POWERUP_SCRIPT_URL,
  SET_POTVALUE_URL,
  START_END_URL,
} from "./Ivm6311Constants";
// import the device state
import { initialDeviceStatus } from "../context/Globalstate";
import { toastoptions } from "../toast/constants";

const Ivm6311Config = () => {
  const [deviceState, setDeviceState, updateDeviceState] =
    StatePool.useState(initialDeviceStatus);
  const [deviceSweep, setdeviceSweep] = useState({});
  const [deviceSweepCount, setdeviceSweepCount] = useState(0);
  const [vbsoAdcValue, setvbsoAdcValue] = useState(0.01);
  const [vbiasAdcValue, setvbiasAdcValue] = useState(0.01);
  const [vbaisPotValue, setvbaisPotValue] = useState("");
  const [vbsoPotValue, setvbsoPotValue] = useState("");
  const [ivmPowerupScript, setivmPowerupScript] = useState("");
  const [ivmPowerdownScript, setivmPowerdownScript] = useState("");
  const ivmPowerupScriptRef = useRef();
  const ivmPowerdownScriptRef = useRef();
  // adi powerupAll/powerupdownAll device file settings
  const [powerupAllScript, setpowerupAllScript] = useState("");
  const [powerupdownAllScript, setpowerupdownAllScript] = useState("");
  const powerupAllScriptRef = useRef();
  const powerupdownAllScriptRef = useRef();

  const setupState = () => {
    axios
      .get(GET_SETUP_STATE)
      .then((response) => {
        const data = response.data;
        if (response.statusText !== "OK") {
        } else {
          if (data.success) {
            updateDeviceState((state) => {
              state.onlyivm = data.success.deviceState.onlyivm;
              state.state = data.success.deviceState.state;
            });
          }
        }
      })
      .catch((error) => {});
  };

  // Device state
  const statusCheck = () => {
    axios
      .get(DEVICE_SWEEP_URL)
      .then((response) => {
        const data = response.data;
        if (response.statusText !== "OK") {
        } else {
          if (data.success) {
            setdeviceSweep(data.success.Deviceses);
            setdeviceSweepCount(0);
            setvbsoAdcValue(data.success.vbso);
            setvbiasAdcValue(data.success.vbias);
            updateDeviceState((state) => {
              state.state = data.success.state[1];
              state.onlyivm = data.success.state[2];
            });
            // console.log(data.success)
          }
        }
      })
      .catch((error) => {
        
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
        } else {
          if (error.response.data.error == "MCP not Connected") {
            setdeviceSweepCount((count) => count + 1);
            if (deviceSweepCount > 10) {
              setdeviceSweep({});
              setvbsoAdcValue(0.01);
              setvbiasAdcValue(0.01);
            }
          }
        }
      });
  };

  const AdcCheck = (addr = SLAVE_DEVICES.VBSOADC) => {
    if (addr === SLAVE_DEVICES.VBSOADC) {
      axios
        .get(ADC_CHECK_URL + parseInt(SLAVE_DEVICES.VBSOADC, 16))
        .then((response) => {
          const data = response.data;
          if (data.success) {
            setvbsoAdcValue(data.success.adc);
          } else {
            setvbsoAdcValue(0.01);
          }
        })
        .catch((error) => {
          // if (error.response.data == 'MCP not Connected'){
          //   setvbsoAdcValue(0.01)
          // }
          if (error.code == "ERR_NETWORK") {
            toast.error(` ✋🛑 Server Stoped`, toastoptions);
          }
        });
    } else if (addr === SLAVE_DEVICES.VBAISADC) {
      axios
        .get(ADC_CHECK_URL + parseInt(SLAVE_DEVICES.VBAISADC, 16))
        .then((response) => {
          const data = response.data;
          if (data.success) {
            setvbiasAdcValue(data.success.adc);
            setVbiasPotValue(null);
          } else {
            setvbiasAdcValue(0.01);
          }
        })
        .catch((error) => {
          // if (error.response.data){
          //   setvbsoAdcValue(0.01)
          // }
          if (error.code == "ERR_NETWORK") {
            toast.error(` ✋🛑 Server Stoped`, toastoptions);
          }
        });
    }
  };

  const setVbsoPotValue = (e) => {
    e.preventDefault();
    const vbso = {
      potAddr: SLAVE_DEVICES.VBSOPOT,
      adcAddr: SLAVE_DEVICES.VBSOADC,
      value: vbsoPotValue.toString("hex"),
    };
    axios
      .post(SET_POTVALUE_URL, vbso)
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setvbsoAdcValue(data.success.adc);
          setvbsoPotValue("");
        }
      })
      .catch((error) => {
        console.log(error)
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
        } else {
          if (error.success) {
            setvbsoAdcValue(error.success.adc);
            setvbsoPotValue("");
          }
        }
      });
  };

  const setVbiasPotValue = (e) => {
    e.preventDefault();
    const vbias = {
      potAddr: SLAVE_DEVICES.VBAISPOT,
      adcAddr: SLAVE_DEVICES.VBAISADC,
      value: vbaisPotValue,
    };

    axios
      .post(SET_POTVALUE_URL, vbias)
      .then((response) => {
        const data = response.data;
        if (response.statusText !== "OK") {
        } else {
          if (data.success) {
            setvbiasAdcValue(data.success.adc);
            setvbaisPotValue("");
          }
        }
      })
      .catch((error) => {
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
        } else {
          if (data.success) {
            setvbiasAdcValue(data.success.adc);
            setvbaisPotValue("");
          }
        }
      });
  };

  useEffect(() => {
    // const setupStatus = setInterval(() => {
    //   setupState();
    // }, 10000);
    const statuscheckInterval = setInterval(() => {
      statusCheck();
    }, 10000);
    // const vbsoADCkInterval = setInterval(() => {
    //   AdcCheck(SLAVE_DEVICES.VBSOADC);
    // }, 6000);
    // const vbiasADCkInterval = setInterval(() => {
    //   AdcCheck(SLAVE_DEVICES.VBAISADC);
    // }, 6000);

    return () => {
      // clearInterval(setupStatus);
      clearInterval(statuscheckInterval);
      // clearInterval(vbsoADCkInterval);
      // clearInterval(vbiasADCkInterval);
    };
  }, [statusCheck, AdcCheck]);

  // power up script for the ivm device
  const ivmPowerupScriptSubmit = (e) => {
    e.preventDefault();
    const url = IVM_POWERUP_SCRIPT_URL;
    const formData = new FormData();
    formData.append("file", ivmPowerupScript);
    formData.append("fileName", ivmPowerupScript.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, formData, config)
      .then((response) => {
        if (response.statusText == "OK") {
          ivmPowerupScriptRef.current.value = "";
          toast.success(`💖💃 ${response.data.success}`, toastoptions);
        } else {
          toast.error(" 👹🛑 Error in uploading file!..", toastoptions);
        }
      })
      .catch((error) => {
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
        } else {
          toast.error(" 👻 Somthing went wrong!..", toastoptions);
        }
      });
  };
  // adi mute  script for the ivm device
  const powerupAllScriptSubmit = (e) => {
    e.preventDefault();
    const url = POWERUP_ALL_SCRIPT_URL;
    const formData = new FormData();
    formData.append("file", powerupAllScript);
    formData.append("fileName", powerupAllScript.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, formData, config)
      .then((response) => {
        if (response.statusText == "OK") {
          powerupAllScriptRef.current.value = "";
          toast.success(`💖💃 ${response.data.success}`, toastoptions);
        } else {
          toast.error(" 👹🛑 Error in uploading file!..", toastoptions);
        }
      })
      .catch((error) => {
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
        } else {
          toast.error(" 👻 Somthing went wrong!..", toastoptions);
        }
      });
  };
  // power down script for the ivm device
  const ivmPowerdownScriptSubmit = (e) => {
    e.preventDefault();
    const url = IVM_POWERDOWN_SCRIPT_URL;
    const formData = new FormData();
    formData.append("file", ivmPowerdownScript);
    formData.append("fileName", ivmPowerdownScript.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, formData, config)
      .then((response) => {
        if (response.statusText == "OK") {
          ivmPowerdownScriptRef.current.value = "";
          toast.success(`💖💃 ${response.data.success}`, toastoptions);
        } else {
          toast.error(" 👹🛑 Error in uploading file!..", toastoptions);
        }
      })
      .catch((error) => {
        toast.error(" 👻 Somthing went wrong!..", toastoptions);
      });
  };
  // adi unmute script for the ivm device
  const powerupdownAllScriptSubmit = (e) => {
    e.preventDefault();
    const url = POWERDOWN_ALL_SCRIPT_URL;
    const formData = new FormData();
    formData.append("file", powerupdownAllScript);
    formData.append("fileName", powerupdownAllScript.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, formData, config)
      .then((response) => {
        if (response.statusText == "OK") {
          powerupdownAllScriptRef.current.value = "";
          toast.success(`💖💃 ${response.data.success}`, toastoptions);
        } else {
          toast.error(" 👹🛑 Error in uploading file!..", toastoptions);
        }
      })
      .catch((error) => {
        toast.error(" 👻 Somthing went wrong!..", toastoptions);
      });
  };

  const startEnd = (e) => {
    // use the device update fucntion instead of the setStateDeviceState
    updateDeviceState((state) => {
      state.state = e.target.checked;
      state.onlyivm = state.state;
    });
    axios
      .post(START_END_URL, deviceState)
      .then((response) => {
        const data = response.data;
        if (response.statusText !== "OK") {
        } else {
          if (data.success) {
            setvbsoAdcValue(data.success.vbso);
            setvbiasAdcValue(data.success.vbias);
            if (deviceState.state) {
              toast.warning(
                `🥳👏 All Devices Truned off > vbso : ${response.data.success.vbso}V  vbais : ${response.data.success.vbias}V`,
                toastoptions
              );
            } else {
              toast.info(
                `🥳👏 All Devices Started > vbso : ${response.data.success.vbso}V  vbais : ${response.data.success.vbias}V`,
                toastoptions
              );
            }
          }
        }
      })
      .catch((error) => {
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
          updateDeviceState((state) => {
            state.state = false;
            state.onlyivm = false;
          });
        } else {
          toast.error(" 👻 Somthing went wrong!..", toastoptions);
          updateDeviceState((state) => {
            state.state = false;
            state.onlyivm = false;
          });
        }
      });
  };
  const startEndIvmOnly = (e) => {
    // use the device update fucntion instead of the setStateDeviceState
    updateDeviceState((state) => {
      state.onlyivm = e.target.checked;
    });
    axios
      .post(START_END_IVM_ONLY_URL, deviceState)
      .then((response) => {
        const data = response.data;
        if (response.statusText !== "OK") {
        } else {
          if (data.success) {
            setvbsoAdcValue(data.success.vbso);
            setvbiasAdcValue(data.success.vbias);
            if (deviceState.onlyivm) {
              toast.warning(
                `🥳👏 IVM6311 Truned off > vbso : ${response.data.success.vbso}V  vbais : ${response.data.success.vbias}V`,
                toastoptions
              );
            } else {
              toast.info(
                `🥳👏 IVM6311 Started > vbso : ${response.data.success.vbso}V  vbais : ${response.data.success.vbias}V`,
                toastoptions
              );
            }
          }
        }
      })
      .catch((error) => {
        if (error.code == "ERR_NETWORK") {
          toast.error(` ✋🛑 Server Stoped`, toastoptions);
          updateDeviceState((state) => {
            state.state = false;
            state.onlyivm = false;
          });
        } else {
          toast.error(" 👻 Somthing went wrong!..", toastoptions);
          updateDeviceState((state) => {
            state.state = false;
            state.onlyivm = false;
          });
        }
      });
  };
  return (
    <motion.div
      className="flex flex-col gap-6 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg  border border-gray-700  rounded-xl p-10 "
      whileHover={{ y: -5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)" }}
    >
      <div className="flex items-center gap-6 ">
        <button
          className={` w-7 h-7 rounded-full  shadow-xl   ${
            Object.keys(deviceSweep).length == 0
              ? "bg-red-500 shadow-rose-400  border-5 border-rose-400"
              : "bg-green-600 shadow-green-300 border-5 border-emerald-300"
          } `}
          onClick={() => statusCheck()}
        ></button>
        <h1 className="mt-1 text-xl font-semibold text-gray-400">
          Config IVM6311 :
        </h1>
      </div>
      {/* Vbias value set form  */}
      <form
        action=""
        className="flex flex-row gap-6 items-center"
        onSubmit={setVbiasPotValue}
      >
        <div>
          <p className="text-lg font-bold text-custom-pink items-start">
            {parseFloat(vbiasAdcValue)}V
          </p>
        </div>
        <input
          name="vbias"
          type="text"
          placeholder="Set Vbais code .."
          pattern="[a-fA-F0-9]+"
          value={vbaisPotValue}
          onChange={(e) => setvbaisPotValue(e.target.value)}
          className="p-2 px-4 bg-gray-900 
        rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        
        "
        />
        <button
          type="submit"
          className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-custom-light-blue hover:border-collapse hover:bg-custom-light-blue hover:text-gray-100 "
        >
          Update
        </button>
      </form>
      {/* Vbso value set form  */}
      <form
        action=""
        className="flex flex-row gap-6 items-center"
        onSubmit={setVbsoPotValue}
      >
        <div>
          <p className="text-lg font-bold text-custom-light-inventvm-color items-start">
            {parseFloat(vbsoAdcValue)}V
          </p>
        </div>
        <input
          type="text"
          placeholder="Set Vbso code ..."
          pattern="[a-fA-F0-9]+"
          value={vbsoPotValue}
          onChange={(e) => setvbsoPotValue(e.target.value)}
          className="p-2 px-4 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"
        />
        <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-custom-blue hover:border-collapse hover:bg-custom-blue hover:text-gray-100 ">
          Update
        </button>
      </form>
      {/* powerup Script uploading form */}
      <form
        action=""
        className="flex flex-col gap-0 items-start"
        onSubmit={ivmPowerupScriptSubmit}
      >
        <p className="text-sm font-bold text-gray-400" htmlFor="startup_script">
          IVM6311 Power up script .csv/.json
        </p>
        <div className="flex flex-row gap-6 items-center">
          <input
            onChange={(e) => setivmPowerupScript(e.target.files[0])}
            placeholder=""
            ref={ivmPowerupScriptRef}
            id="startup_script"
            className=" flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"
            type="file"
          />
          <button
            type="submit"
            className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-fuchsia-500 hover:border-collapse hover:bg-fuchsia-500 hover:text-gray-100 "
          >
            Update
          </button>
        </div>
      </form>
      {/* Power down script uploading form  */}
      <form
        action=""
        className="flex flex-col gap-0 items-start"
        onSubmit={ivmPowerdownScriptSubmit}
      >
        <p className="text-sm font-bold text-gray-400" htmlFor="startup_script">
          IVM6311 Powerdown script .csv/.json
        </p>
        <div className="flex flex-row gap-6 items-center">
          <input
            onChange={(e) => setivmPowerdownScript(e.target.files[0])}
            ref={ivmPowerdownScriptRef}
            placeholder=""
            className="flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"
            id="startup_script"
            type="file"
          />
          <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-pink-600 hover:border-collapse hover:bg-pink-600 hover:text-gray-100 ">
            Update
          </button>
        </div>
      </form>
      {/* powerupAll powerup Script uploading form */}
      <form
        action=""
        className="flex flex-col gap-0 items-start"
        onSubmit={powerupAllScriptSubmit}
      >
        <p className="text-sm font-bold text-gray-400" htmlFor="startup_script">
          Powerup all script .csv/.json
        </p>
        <div className="flex flex-row gap-6 items-center">
          <input
            onChange={(e) => setpowerupAllScript(e.target.files[0])}
            placeholder=""
            ref={powerupAllScriptRef}
            id="startup_script"
            className="flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"
            type="file"
          />
          <button
            type="submit"
            className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-orange-600 hover:border-collapse hover:bg-orange-600 hover:text-gray-100 "
          >
            Update
          </button>
        </div>
      </form>
      {/* powerupAll Power down script uploading form  */}
      <form
        action=""
        className="flex flex-col gap-0 items-start"
        onSubmit={powerupdownAllScriptSubmit}
      >
        <p className="text-sm font-bold text-gray-400" htmlFor="startup_script">
          Powerdown all script .csv/.json
        </p>
        <div className="flex flex-row gap-6 items-center">
          <input
            onChange={(e) => setpowerupdownAllScript(e.target.files[0])}
            ref={powerupdownAllScriptRef}
            placeholder=""
            className="flex text-gray-400 dark:placeholder-gray-700 p-2 px-1 bg-gray-900 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none  focus:ring-2 focus:border-custom-blue"
            id="startup_script"
            type="file"
          />
          <button className="w-20 p-1 text-gray-400 bg-gray-800 rounded-full border-2 border-emerald-600 hover:border-collapse hover:bg-emerald-600 hover:text-gray-100 ">
            Update
          </button>
        </div>
      </form>
      {/* Start/Stop button  */}
      <div className="flex place-items-end gap-2">
        {/* 
    <div className="flex items-center mb-4">
    <input id="default-checkbox" type="checkbox" 
    checked={deviceState.onlyivm}
    onChange={(e)=> updateDeviceState(state=>{
      state.onlyivm = !state.onlyivm
    })}
    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label htmlFor="default-checkbox" className="ms-2 text-sm font-bold text-gray-900 dark:text-gray-400">only Ivm</label>
    </div> */}
        <div className="flex items-center mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={deviceState.onlyivm}
              className="sr-only peer"
              onChange={startEndIvmOnly}
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
              IVM Turn ON/ OFF
            </span>
          </label>
        </div>
        <div className="flex items-center mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={deviceState.state}
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
              All Start / End
            </span>
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default Ivm6311Config;
