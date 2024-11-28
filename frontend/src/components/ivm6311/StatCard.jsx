import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
  console.log(name);
  return (
    <motion.div
      className=" bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 "
      whileHover={{ y: -5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.6)" }}
    >
      <div className="px-4 py-5 sm:p-6 grid grid-rows-2  justify-center">
        <span className="flex items-center text-sm font-medium text-gray-400">
          <Icon size={40} className="mr-4" style={{ color }} />
          {value}
          {/* <p className="mt-1 text-xl font-semibold text-gray-400">{name}</p> */}
        </span>
        <p className="mt-1 text-xl font-semibold text-gray-400">{name}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;