import React,{useEffect, useState} from "react";
import {
  Cpu,
  BrainCircuit,
  NotebookText,
  CircuitBoard,

} from "lucide-react";
import Header from "./Header";
import { motion } from "framer-motion";

import StatCard from "./ivm6311/StatCard";
import Ivm6311Config from "./ivm6311/Ivm6311Config";
import ivm6311_funcdigram from '../assets/ivm6311_blockdg.png'
import ivm6311_schematic from '../assets/ivm6311_schematic.png'
import ivm6311_pinout from '../assets/ivm6311_pinout.png'
import ivm6311_note from '../assets/ivm6311_note.png'

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'transparent',
  borderWidth: 0,
  boxShadow: 24,
  focus: {
    borderWidth:0,
  }
};


const IVM6311 = () => {

  const [circuitOpen, setCircuitOpen] = React.useState(false);
  const handleCircuitOpen = () => setCircuitOpen(!circuitOpen);
  const [layoutOpen, setLayoutOpen] = React.useState(false);
  const handleLayoutOpen = () => setLayoutOpen(!layoutOpen);
  const [functionDiagOpen, setFunctionDiagOpen] = React.useState(false);
  const handlesetFunctionDiagOpen = () => setFunctionDiagOpen(!functionDiagOpen);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const handlesetNoteOpen= () => setNoteOpen(!noteOpen);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="IVM6311" color="text-custom-inventvm-color" icon={Cpu} />
      <div className="grid grid-cols-1 m-5 mb-3 lg:grid-cols-2 gap-8 ">
        <Ivm6311Config />
        <div className="flex items-center">
          <motion.img
            className="scale-80 w-full rounded-lg object-cover object-center shadow-xl shadow-gray-800"
            src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
            alt="IVM6311"
            whileHover={{
              y: -6,
              boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:gr-cols-2 lg:grid-cols-4 mb-8 "
          initial={{ opacity: 0, width: 20 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 1 }}
        >
          <div onClick={handleCircuitOpen}>
          <StatCard name="Schematic" icon={CircuitBoard} value="IVM6311" color="#6366f1"/>
          </div>
          <div onClick={handleLayoutOpen}>
          <StatCard name="Layout" icon={Cpu} value="IVM6311" color="#8B5CF6" />
          </div>
          <div onClick={handlesetFunctionDiagOpen}>
          <StatCard name="Functional Daigram" icon={BrainCircuit} value="IVM6311" color="#EC4899"/>
          </div >
          <div onClick={handlesetNoteOpen}>
          <StatCard name="Note" icon={NotebookText} value="IVM6311" color="#10B881"/>
          </div>
          <div>
      <Modal
        open={circuitOpen}
        onClose={handleCircuitOpen}
      >
        <Box sx={style}>
          <div className="grid place-items-end">
          <button variant="gradient" className="-mb-1 -mr-4  text-gray-100 text-xl rounded-full  hover:text-gray-400 lg:text-2xl" 
          onClick={handleCircuitOpen}>
            x
          </button>
            <img src={ivm6311_schematic} alt="" className="rounded-xl" />
          </div>
        </Box>
      </Modal>
      <Modal
        open={layoutOpen}
        onClose={handleLayoutOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid place-items-end">
          <button variant="gradient" className="-mb-1 -mr-4  text-gray-100 text-xl rounded-full  hover:text-gray-400 lg:text-2xl" 
          onClick={handleLayoutOpen}>
            x
          </button>
            <img src={ivm6311_pinout} alt="" className="rounded-xl" />
          </div>
        </Box>
      </Modal>
      <Modal
        open={functionDiagOpen}
        onClose={handlesetFunctionDiagOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid place-items-end">
          <button variant="gradient" className="-mb-1 -mr-4  text-gray-100 text-xl rounded-full  hover:text-gray-400 lg:text-2xl" 
          onClick={handlesetFunctionDiagOpen}>
            x
          </button>
            <img src={ivm6311_funcdigram} alt="" className="rounded-xl" />
          </div>
        </Box>
      </Modal>
      <Modal
        open={noteOpen}
        onClose={handlesetNoteOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="grid place-items-end">
          <button variant="gradient" className="-mb-1 -mr-4  text-gray-100 text-xl rounded-full  hover:text-gray-400 lg:text-2xl" 
          onClick={handlesetNoteOpen}>
            x
          </button>
            <img src={ivm6311_note} alt="" className="rounded-xl" />
          </div>
        </Box>
      </Modal>
    </div>
        </motion.div>
      </main>
    </div>
  );
};

export default IVM6311;
