import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white flex flex-col justify-center items-center px-4 py-10 text-center">
      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-[6rem] md:text-[10rem] select-none"
      >
        😥
      </motion.div>

      {/* Message */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl md:text-4xl font-bold text-gray-300 mt-6"
      >
        Oops! Page Not Found
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-4 text-gray-400 text-sm md:text-lg"
      >
        Try something else instead...
      </motion.p>

      {/* Button */}
      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="mt-8 px-6 py-3 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm md:text-base shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
      >
        Go Back Home
      </motion.button>
    </div>
  );
}
