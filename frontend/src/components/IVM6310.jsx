import React from "react";
import Header from "./Header";
import { Cpu, BarChart2, BrainCircuit , NotebookText , CircuitBoard  } from "lucide-react";
import {motion} from 'framer-motion'
import StatCard from "./ivm6311/StatCard";
import Ivm6310Config from "./ivm6310/Ivm6310Config";

const IVM6310 = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="IVM6310" color="text-custom-inventvm-color" icon={Cpu} />
      <div className="grid grid-cols-1 m-5 lg:grid-cols-2 gap-8 ">
        <Ivm6310Config/>
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
          <StatCard
            name="Schematic"
            icon={CircuitBoard}
            value="IVM6310"
            color="#6366f1"
          />
          <StatCard
            name="Layout"
            icon={Cpu}
            value="IVM6310"
            color="#8B5CF6"
          />
          <StatCard
            name="Functional Daigram"
            icon={BrainCircuit }
            value="IVM6310"
            color="#EC4899"
          />
          <StatCard
            name="Note"
            icon={NotebookText }
            value="IVM6310"
            color="#10B881"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default IVM6310;
