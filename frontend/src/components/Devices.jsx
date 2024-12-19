import React,{useEffect, useState} from "react";
import Header from "./Header";
import { Expand, ShieldQuestion } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { Maximize2,Minimize2   } from "lucide-react";
import ivm6303 from "../assets/products/IVM6303.png";
import ivm6310 from "../assets/products/IVM6310.png";
import ivm6311 from "../assets/products/IVM6311.png";
import ivm6312 from "../assets/products/IVM6312.png";
import ivm6303_schematic from '../assets/products/IVM6303_Reference_SCH.png'
import ivm6310_schematic from '../assets/products/IVM6310_Reference_SCH.png'
import ivm6311_schematic from '../assets/products/IVM6311_Reference_SCH.png'
import ivm6312_schematic from '../assets/products/IVM6312_Reference_SCH.png'
import ivm6312_reference_layout from '../assets/ivm6312_reference_layout.png'
import ivm6311_reference_layout from '../assets/ivm6311_reference_layout.png'
import ivm6310_reference_layout from '../assets/ivm6310_reference_layout.png'
import ivm6303_reference_layout from '../assets/ivm6303_reference_layout.png'
import {motion} from 'framer-motion'

import Footer from "./Footer";
const content = [
  {
    name: "IVM 6303",
    subtitle:
      "46Vpp Boosted Piezo Speaker Amplifier",
    titleimage: ivm6303,
    data: "The IVM6303 is a high-performance amplifier designed to drive capacitive loads such as piezo transducers up to 10 µF. It features a 25 V boost converter enabling class-H operation through a 512 level – 50 mV step envelop tracking (ET) architecture. The boost converter input supply is 10 V capable, allowing the IVM6303 to be powered by 1-cell or 2-cell battery systems. The Class-D amplifier is capable to drive up to 10 µF capacitive load with an output voltage up 46Vpp with advanced anti-pop protection and 110 dB DNR. The gain structure of the IVM6303 allows both receiver and speaker modes to make the device suitable in smartphone applications.The IVM6303 together with piezo transducer enables surface sound increasing the battery life of portable devices including smartphone, tablet, laptop.",
    images:
        {
          Schematic : ivm6303_schematic,
          Layout : ivm6303_reference_layout
        }

  },
  {
    name: "IVM 6310",
    subtitle:
      "160Vpp Boosted Thin Film Speaker Amplifier",
    titleimage: ivm6310,
    data: "The IVM6311 is a Class AB audio amplifier designed to drive MEMS speakers. It features a DC DC SIDO (Single inductor dual output) boost converter to supply the output stage bias the MEMS. It operates from a 3.6 V Li–Ion battery and it is compatible with PDM, TDM/I2S audio protocol, moreover its analog input can be driven by most Bluetooth® audio SoC.  Its low power consumption and latency makes the IVM6311 the ideal audio amplifier to develop MEMS speakers-based audio products, including true wireless earbuds (TWS), audio glasses, over the counter (OTC) hearing aids, and AR/VR glasses.",
    images:
        {
          Schematic:ivm6310_schematic,
          Layout : ivm6310_reference_layout
        }

  },
  {
    name: "IVM 6311",
    subtitle:
      "30Vpp Ultra low power/low latency MEMS speaker driver with analog and digital interface",
    titleimage: ivm6311,
    data: "The IVM6311 is a Class AB audio amplifier designed to drive MEMS speakers. It features a DC DC SIDO (Single inductor dual output) boost converter to supply the output stage bias the MEMS. It operates from a 3.6 V Li–Ion battery and it is compatible with PDM, TDM/I2S audio protocol, moreover its analog input can be driven by most Bluetooth® audio SoC.  Its low power consumption and latency makes the IVM6311 the ideal audio amplifier to develop MEMS speakers-based audio products, including true wireless earbuds (TWS), audio glasses, over the counter (OTC) hearing aids, and AR/VR glasses.",
    images:
      {
        Schematic:ivm6311_schematic,
        Layout : ivm6311_reference_layout
      }

  },
  {
    name: "IVM 6312",
    subtitle:
      "Ultra-Low Power Class-D Amplifier ",
    titleimage: ivm6312,
    data: "The IVM6312 is an ultra-low power and ultra lo latency Class-D audio amplifier with digital input that is suited for use in wireless headphones. The amplifier can drive resistive loads from 16Ω to 32Ω with a voltage up to 1.15Vrms and a DNR of 113dB. The digital input is compatible with TDM/I2S, PDM single bit, dual bit and 4-bit (dual data line). In PDM 4-Bit its latency is 500nsThe IVM6312 features a low noise modulation scheme that improves the efficiency at any power rate and requires no external inductor/capacitor (LC) output filters. Moreover, the modulation scheme ensures much lower electromagnetic interference (EMI) radiated emissions compared with other Class-D architectures.Its low power consumption and latency makes the IVM63IP the ideal audio amplifier to develop wearable audio products, including true wireless earbuds (TWS), audio glasses, over the counter (OTC) hearing aids, and AR/VR glasses.",
    images:{
      Schematic:ivm6312_schematic,
      Layout : ivm6312_reference_layout
    }
  },
];

const Devices = () => {

  const  [parentExpand, setparentExpand] = useState(false)
  const  [parentExpandCount, setparentExpandCount] = useState(0)
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" color="text-custom-green" icon={ShieldQuestion} />
      <div className="flex flex-row justify-center m-5 2xl:justify-start">
        <h1 className="text-start text-custom-light-inventvm-color font-sans text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mr-2 hover:text-custom-inventvm-color ">
          IVM
        </h1>
        <h1 className="text-start text-custom-light-inventvm-color text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mr-2 hover:text-custom-inventvm-color">
          Products
        </h1>
      </div>
      <div className={ (parentExpand == 0) ?  "grid grid-cols-1 gap-2 xl:grid-cols-2 xl:gap-4 place-content-evenly m-5  ...": "grid grid-cols-1 place-content-evenly m-5 gap-2 ..." }>
        {content.map((content, key) => {
          const  [more, setmore] = useState(false)
          useEffect(() => {
              // console.log(parentExpand, more,parentExpandCount,key)
          })
          return (
            <Card key={key} className={`grid grid-cols-1 ${ more ? "max-w-[100rem]" : "max-w-[50rem]"} bg-gray-850 shadow-lg shadow-gray-700`}>
            <CardBody className="mx-5 mr-5 grid grid-cols-1  ">
              <div className="flex flex-col items-center">
                
                <motion.img
                src={content.titleimage}
                whileHover={
                  { scale: 1.25, 
                  }
               } 
               transition={{duration: 0.5}}
                alt="IVM6303"
                // className={`${ (more&parentExpand) ? "object-scale-down h-[30rem] w-[30rem] rounded-lg " : "object-scale-down h-[30rem] w-[30rem] rounded-lg" } rounded-xl`}
                className="object-scale-down h-[30rem] w-[30rem] rounded-lg " 
              />
              </div>
              {/* <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " /> */}
              <div className="mt-2 mb-3 flex flex-col items-start gap-1">
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="mx-5 -mb-1 font-semibold font-sans text-custom-light-inventvm-color hover:text-custom-inventvm-color"
                >
                  {content.name}
                </Typography>
  
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mx-5 -mb-1 font-semibold font-sans text-gray-400 hover:text-gray-600"
                >
                  {content.subtitle}
                </Typography>
                <hr className="w-full my-2 mx-5 ml-0 h-0.5 bg-gray-100 border-0 rounded  dark:bg-gray-700" />
              </div>
              {/* <Typography className='text-gray-100'> */}
              <ul className="list-disc mx-5 my-5">
                {
                  //  check for the data size and frame open
                  (more&parentExpand) ?   content.data.split('. ').map((point,key) => <li key={key}> {point}</li>) : (content.data.split('. ').length > 3) ? content.data.split('. ').slice(0,3).map((point,key) => <li key={key}> {point}</li>) : content.data.split('. ').map((point,key) => <li key={key}> {point}</li>)
                  
                }
              </ul>
              <div className="grid grid-cols-1 gap-2 xl:grid-cols-2 xl:gap-4 place-content-evenly  ...">
                {
                  (more&parentExpand) ?  Object.entries(content.images).map((image,key) =>
                  {
                    return (
                      <div key={key} className="flex flex-col items-start justify-start ">
                        <h4 className="font-semibold font-sans text-gray-400 text-lg">{image[0]} :
                        <motion.img 
                        src={image[1]} alt="" className=" m-[1rem] rounded-xl w-[25rem] h-[25rem]"  />
                        </h4>
                        
                      </div> 
                    )
                  }

                  )
                    :
                    ""
                }
              </div>
            </CardBody>
            <CardFooter className="pt-3 grid grid-cols-1 justify-items-end mr-5 mb-2"   >
                {
                  (more & parentExpand) ?
                  
                  <Button className="flex flex-row gap-2 text-gray-500 hover:text-gray-600" onClick={e => {
                    e.preventDefault()
                    setmore(false);
                    setparentExpand(e => false)
                    setparentExpandCount(state => (state - 1))
                  }
                  }>
                  Less ...
                  <Minimize2 size={30} />
                  </Button>
                  :
                  <Button className="flex flex-row gap-2 text-gray-500 hover:text-gray-600" onClick={e => {
                    e.preventDefault()
                    setmore(true);
                    setparentExpand( true)
                    setparentExpandCount(state => state+1)
                  }
                  }>
                  More ...
                  <Maximize2 size={30} />
                  </Button>
                }
              
            </CardFooter>
          </Card>
          )
        }
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Devices;
