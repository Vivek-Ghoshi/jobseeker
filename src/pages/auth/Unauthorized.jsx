import React from "react";
import { motion } from "framer-motion";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-[#111827] rounded-2xl p-8 shadow-xl shadow-red-800/20 text-center border border-red-500"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="flex justify-center mb-6"
        >
          <LockKeyhole className="h-14 w-14 text-red-500" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-red-500 mb-3">
          Unauthorized Access
        </h1>
        <p className="text-gray-300 text-base md:text-lg mb-6">
          You do not have permission to view this page. Please login with appropriate credentials.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 transition duration-300 shadow hover:shadow-red-500/30 w-full"
        >
          Go to Login <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
