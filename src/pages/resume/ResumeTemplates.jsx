import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listResumeTemplates } from '../../redux/slices/resumeBuilderSlice';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeTemplates = () => {
  const dispatch = useDispatch();
  const { templates } = useSelector((state) => state.resumebuilder);
  const [selectedPDF, setSelectedPDF] = useState(null); // for modal

  useEffect(() => {
    dispatch(listResumeTemplates());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] px-4 py-10 text-white relative">
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
              className="bg-gradient-to-bl from-black via-gray-900 to-[#0f0f1a] border border-cyan-700 rounded-lg shadow-md p-4 flex flex-col hover:shadow-cyan-600/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Embedded PDF Preview */}
              <div className="relative overflow-hidden rounded-md border border-gray-600 h-60 sm:h-64 mb-4">
                <iframe
                  src={`${template.url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full rounded-md"
                  title={template.name}
                />
              </div>

              {/* Details */}
              <h2 className="text-xl font-semibold text-cyan-300 mb-1">
                {template.name}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                <span className="text-white font-medium">
                  {template.description}
                </span>
              </p>

              {/* View Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedPDF(template.url)}
                className="mt-auto flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-sm py-2 px-4 rounded-md transition duration-200"
              >
                <Eye className="w-4 h-4" />
                View Full Template
              </motion.button>
            </motion.div>
          ))}
      </div>

      {/* Modal to view full PDF */}
      <AnimatePresence>
        {selectedPDF && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPDF(null)}
          >
            <motion.div
              className="relative w-[90%] h-[90%] bg-[#0f172a] rounded-lg shadow-lg p-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${selectedPDF}#toolbar=1`}
                className="w-full h-full rounded-md"
                title="Resume Full View"
              />
              <button
                onClick={() => setSelectedPDF(null)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeTemplates;



// import { Eye, FilePlus } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { listResumeTemplates } from '../../redux/slices/resumeBuilderSlice';
// import { motion, AnimatePresence } from 'framer-motion';

// const ResumeTemplates = () => {
//   const dispatch = useDispatch();
//   const { templates } = useSelector((state) => state.resumebuilder);
//   const [selectedImage, setSelectedImage] = useState(null); // for modal

//   useEffect(() => {
//     dispatch(listResumeTemplates());
//   }, [dispatch]);

//   const getPreviewImage = (templateId) => {
//     return `/resume-builder/templates/list${templateId}.png`; // image files: modern.png, professional.png etc.
//   };

//   return (
//     <div className="min-h-screen bg-black px-4 py-10 text-white relative">
//       <motion.h1
//         className="text-center text-3xl sm:text-4xl font-bold text-cyan-400 mb-10"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         Browse Resume Templates
//       </motion.h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
//         {templates &&
//           templates.map((template, index) => (
//             <motion.div
//               key={template.id}
//               className="bg-[#1e293b] border border-cyan-700 rounded-lg shadow-md p-4 flex flex-col hover:shadow-cyan-600/40 transition-all duration-300"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               whileHover={{ scale: 1.02 }}
//             >
//               {/* Preview Image */}
//               <div className="relative overflow-hidden rounded-md border border-gray-600 h-52 sm:h-56 mb-4">
//                 <motion.img
//                   src={getPreviewImage(template.id)}
//                   alt={template.name}
//                   className="object-cover w-full h-full transform scale-105 blur-[1.5px] contrast-[1.1]"
//                   whileHover={{ scale: 1.1 }}
//                   transition={{ duration: 0.3 }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a] opacity-80" />
//                 <div className="absolute bottom-2 left-2 text-xs text-gray-300">
//                   Partial Preview
//                 </div>
//               </div>

//               {/* Details */}
//               <h2 className="text-xl font-semibold text-cyan-300 mb-1">
//                 {template.name}
//               </h2>
//               <p className="text-sm text-gray-400 mb-4">
//                 <span className="text-white font-medium">
//                   {template.description}
//                 </span>
//               </p>

//               {/* Buttons */}
//               <div className="mt-auto flex flex-col sm:flex-row gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.96 }}
//                   onClick={() => setSelectedImage(getPreviewImage(template.id))}
//                   className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-sm py-2 px-4 rounded-md transition duration-200"
//                 >
//                   <Eye className="w-4 h-4" />
//                   View Full Template
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.96 }}
//                   className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-sm py-2 px-4 rounded-md transition duration-200"
//                 >
//                   <FilePlus className="w-4 h-4" />
//                   Use Template
//                 </motion.button>
//               </div>
//             </motion.div>
//           ))}
//       </div>

//       {/* Modal Preview */}
//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelectedImage(null)}
//           >
//             <motion.div
//               className="relative w-[90%] max-w-3xl bg-[#0f172a] rounded-lg shadow-lg p-4"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={selectedImage}
//                 alt="Full Template Preview"
//                 className="w-full h-auto rounded-md"
//               />
//               <button
//                 onClick={() => setSelectedImage(null)}
//                 className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1 rounded"
//               >
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ResumeTemplates;



// // import { Eye, FilePlus } from 'lucide-react';
// // import { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { listResumeTemplates } from '../../redux/slices/resumeBuilderSlice';
// // import { motion } from 'framer-motion';

// // const ResumeTemplates = () => {
// //   const dispatch = useDispatch();
// //   const { templates } = useSelector((state) => state.resumebuilder);
  
// //   useEffect(() => {
// //     dispatch(listResumeTemplates());
// //   }, [dispatch]);

// //   return (
// //     <div className="min-h-screen bg-black px-4 py-10 text-white">
// //       <motion.h1
// //         className="text-center text-3xl sm:text-4xl font-bold text-cyan-400 mb-10"
// //         initial={{ opacity: 0, y: -20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.6 }}
// //       >
// //         Browse Resume Templates
// //       </motion.h1>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
// //         {templates &&
// //           templates.map((template, index) => (
// //             <motion.div
// //               key={template.id}
// //               className="bg-[#1e293b] border border-cyan-700 rounded-lg shadow-md p-4 flex flex-col hover:shadow-cyan-600/40 transition-all duration-300"
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5, delay: index * 0.1 }}
// //               whileHover={{ scale: 1.02 }}
// //             >
// //               {/* Preview Image */}
// //               <div className="relative overflow-hidden rounded-md border border-gray-600 h-52 sm:h-56 mb-4">
// //                 <motion.img
// //                   src={template.previewImage}
// //                   alt={template.name}
// //                   className="object-cover w-full h-full transform scale-105 blur-[1.5px] contrast-[1.1]"
// //                   whileHover={{ scale: 1.1 }}
// //                   transition={{ duration: 0.3 }}
// //                 />
// //                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a] opacity-80" />
// //                 <div className="absolute bottom-2 left-2 text-xs text-gray-300">
// //                   Partial Preview
// //                 </div>
// //               </div>

// //               {/* Details */}
// //               <h2 className="text-xl font-semibold text-cyan-300 mb-1">{template.name}</h2>
// //               <p className="text-sm text-gray-400 mb-4">
// //                 Best suited for:{' '}
// //                 <span className="text-white font-medium">
// //                   {template.description}
// //                 </span>
// //               </p>

// //               {/* Buttons */}
// //               <div className="mt-auto flex flex-col sm:flex-row gap-3">
// //                 <motion.button
// //                   whileHover={{ scale: 1.03 }}
// //                   whileTap={{ scale: 0.96 }}
// //                   className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-sm py-2 px-4 rounded-md transition duration-200"
// //                 >
// //                   <Eye className="w-4 h-4" />
// //                   View Full Template
// //                 </motion.button>

// //                 <motion.button
// //                   whileHover={{ scale: 1.03 }}
// //                   whileTap={{ scale: 0.96 }}
// //                   className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-sm py-2 px-4 rounded-md transition duration-200"
// //                 >
// //                   <FilePlus className="w-4 h-4" />
// //                   Use Template
// //                 </motion.button>
// //               </div>
// //             </motion.div>
// //           ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResumeTemplates;
