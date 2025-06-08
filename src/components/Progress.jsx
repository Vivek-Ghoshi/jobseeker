// components/ui/Progress.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Progress = ({ value = 0, className = '' }) => {
  const progress = Math.min(Math.max(value, 0), 100); // clamp between 0 and 100

  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-inner"
      />
    </div>
  );
};

export default Progress;
