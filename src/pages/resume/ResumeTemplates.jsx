import { Eye, FilePlus } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listResumeTemplates } from '../../redux/slices/resumeBuilderSlice';
import { motion } from 'framer-motion';

const ResumeTemplates = () => {
  const dispatch = useDispatch();
  const { templates } = useSelector((state) => state.resumebuilder);

  useEffect(() => {
    dispatch(listResumeTemplates());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <motion.h1
        className="text-center text-3xl sm:text-4xl font-bold text-cyan-400 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Browse Resume Templates
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {templates &&
          templates.map((template, index) => (
            <motion.div
              key={template.id}
              className="bg-[#1e293b] border border-cyan-700 rounded-lg shadow-md p-4 flex flex-col hover:shadow-cyan-600/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Preview Image */}
              <div className="relative overflow-hidden rounded-md border border-gray-600 h-52 sm:h-56 mb-4">
                <motion.img
                  src={template.previewImage}
                  alt={template.name}
                  className="object-cover w-full h-full transform scale-105 blur-[1.5px] contrast-[1.1]"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a] opacity-80" />
                <div className="absolute bottom-2 left-2 text-xs text-gray-300">
                  Partial Preview
                </div>
              </div>

              {/* Details */}
              <h2 className="text-xl font-semibold text-cyan-300 mb-1">{template.name}</h2>
              <p className="text-sm text-gray-400 mb-4">
                Best suited for:{' '}
                <span className="text-white font-medium">
                  {template.description}
                </span>
              </p>

              {/* Buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-sm py-2 px-4 rounded-md transition duration-200"
                >
                  <Eye className="w-4 h-4" />
                  View Full Template
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-sm py-2 px-4 rounded-md transition duration-200"
                >
                  <FilePlus className="w-4 h-4" />
                  Use Template
                </motion.button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;
