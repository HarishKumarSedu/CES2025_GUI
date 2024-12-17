import React from "react";
import Header from "./Header";
import { Cpu, BarChart2, BrainCircuit , NotebookText , CircuitBoard  } from "lucide-react";
import {motion} from 'framer-motion'
import StatCard from "./ivm6311/StatCard";
import Ivm6310Config from "./ivm6310/Ivm6310Config";
import ivm6310_funcdigram from '../assets/products/IVM6310.png'
import ivm6310_schematic from '../assets/products/IVM6310_Reference_SCH.png'
import ivm6310_reference_layout from '../assets/ivm6310_reference_layout.png'
import ivm6310_note from '../assets/products/IVM6310_Note.png'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FloraTech from "./ivm6310/FloraTech";
import ivm6310_board from '../assets/ivm6310_board.jpg'
import Footer from "./Footer";
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



const IVM6310 = () => {
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
      <Header title="IVM6310" color="text-custom-inventvm-color" icon={Cpu} />
      <div className="grid grid-cols-1 m-5 lg:grid-cols-2 gap-10 justify-between">
        <Ivm6310Config/>

          <img
            className="w-[25rem]  rounded-lg object-cover object-center shadow-xl shadow-gray-800"
            src={ivm6310_board}
            alt="IVM6311"
            whileHover={{
              y: -6,
              boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)",
            }}
          />
      </div>
      {/* add flora tech component  */}
      <div className="grid grid-cols-1 m-5 ">
      <FloraTech/>
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
            <img src={ivm6310_schematic} alt="" className="rounded-xl" />
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
            <img src={ivm6310_reference_layout} alt="" className="rounded-xl" />
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
            <img src={ivm6310_funcdigram} alt="" className="rounded-xl" />
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
            <img src={ivm6310_note} alt="" className="rounded-xl" />
          </div>
        </Box>
      </Modal>
    </div>
        </motion.div>
      </main>
      <Footer/>
    </div>
  );
};

export default IVM6310;
