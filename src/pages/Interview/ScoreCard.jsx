import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

const Scorecard = ({ questions, onSubmit }) => {
  const [scores, setScores] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleScoreChange = (id, value) => {
    setScores((prev) => ({
      ...prev,
      [id]: parseInt(value),
    }));
  };

  const handleSubmit = () => {
    const formatted = { question: scores };
    onSubmit(formatted);
  };

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.2}
      onDragEnd={(_, info) =>
        setPosition((prev) => ({
          x: prev.x + info.offset.x,
          y: prev.y + info.offset.y,
        }))
      }
      animate={{ x: position.x, y: position.y }}
      className="fixed bottom-4 right-4 z-50 bg-transparent text-white border border-emerald-500/20 shadow-2xl rounded-2xl w-[95vw] max-w-lg max-h-[70vh] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-t-2xl cursor-grab select-none">
        <div className="flex items-center gap-2 font-bold text-lg">
          <GripVertical className="w-4 h-4" />
          Candidate Scorecard
        </div>
        <button onClick={() => setCollapsed((prev) => !prev)}>
          {collapsed ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      {/* Main Content */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="scorecard-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar"
          >
            {Object.entries(questions).map(([section, qList]) => (
              <div
                key={section}
                className="border border-emerald-500/30 rounded-lg overflow-hidden shadow-inner"
              >
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full text-left px-4 py-2 bg-emerald-900/70 hover:bg-emerald-800 transition flex justify-between items-center text-white font-semibold"
                >
                  {section}
                  {openSection === section ? <ChevronUp /> : <ChevronDown />}
                </button>

                <AnimatePresence>
                  {openSection === section && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-3 space-y-4 bg-[#0f172a]/80"
                    >
                      {qList.map((q) => (
                        <div
                          key={q.id}
                          className="flex flex-col gap-2 p-3 rounded-xl bg-[#1e293b]/60 border border-emerald-500/30 hover:border-emerald-400 transition"
                        >
                          <label className="text-sm font-medium text-emerald-300">
                            {q.question}
                          </label>
                          <select
                            value={scores[q.id] || ""}
                            onChange={(e) =>
                              handleScoreChange(q.id, e.target.value)
                            }
                            className="w-1/3 bg-black/80 border border-emerald-500 text-white text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                          >
                            <option value="">Select Score</option>
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 transition rounded-md py-2 font-semibold text-white shadow-lg hover:shadow-cyan-500/40"
            >
              Submit Scores
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Scorecard;



// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   GripVertical,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";

// const Scorecard = ({ questions, onSubmit }) => {
//   const [scores, setScores] = useState({});
//   const [collapsed, setCollapsed] = useState(false);
//   const [openSection, setOpenSection] = useState(null);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const handleScoreChange = (id, value) => {
//     setScores((prev) => ({
//       ...prev,
//       [id]: parseInt(value),
//     }));
//   };

//   const handleSubmit = () => {
//     const formatted = { question: scores };
//     onSubmit(formatted);
//   };

//   const toggleSection = (section) => {
//     setOpenSection((prev) => (prev === section ? null : section));
//   };

//   return (
//     <motion.div
//       drag
//       dragMomentum={false}
//       dragElastic={0.2}
//       onDragEnd={(_, info) =>
//         setPosition((prev) => ({
//           x: prev.x + info.offset.x,
//           y: prev.y + info.offset.y,
//         }))
//       }
//       animate={{ x: position.x, y: position.y }}
//       className="fixed bottom-4 right-4 z-50 bg-[#0f172a] text-white shadow-2xl rounded-2xl w-[95vw] max-w-lg max-h-[70vh] overflow-hidden flex flex-col"
//     >
//       {/* Header with drag handle and collapse toggle */}
//       <div className="flex items-center justify-between px-4 py-2 bg-emerald-600 rounded-t-2xl cursor-grab select-none">
//         <div className="flex items-center gap-2 font-bold text-lg">
//           <GripVertical className="w-4 h-4" />
//           Candidate Scorecard
//         </div>
//         <button onClick={() => setCollapsed((prev) => !prev)}>
//           {collapsed ? <ChevronDown /> : <ChevronUp />}
//         </button>
//       </div>

//       {/* Main content */}
//       <AnimatePresence>
//         {!collapsed && (
//           <motion.div
//             key="scorecard-content"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar"
//           >
//             {Object.entries(questions).map(([section, qList]) => (
//               <div
//                 key={section}
//                 className="border border-emerald-700 rounded-lg overflow-hidden"
//               >
//                 {/* Section Header */}
//                 <button
//                   onClick={() => toggleSection(section)}
//                   className="w-full text-left px-4 py-2 bg-emerald-800 hover:bg-emerald-700 transition flex justify-between items-center text-white font-semibold"
//                 >
//                   {section}
//                   {openSection === section ? <ChevronUp /> : <ChevronDown />}
//                 </button>

//                 {/* Section Questions */}
//                 <AnimatePresence>
//                   {openSection === section && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="px-4 py-3 space-y-4 bg-[#1e293b]"
//                     >
//                       {qList.map((q) => (
//                         <div
//                           key={q.id}
//                           className="flex flex-col gap-2 p-3 rounded-lg bg-[#0f172a] border border-emerald-700 hover:bg-[#152035] transition"
//                         >
//                           <label className="text-sm font-medium text-emerald-300">
//                             {q.question}
//                           </label>
//                           <select
//                             value={scores[q.id] || ""}
//                             onChange={(e) =>
//                               handleScoreChange(q.id, e.target.value)
//                             }
//                             className="bg-black border border-emerald-500 text-white text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
//                           >
//                             <option value="">Select Score</option>
//                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                               <option key={num} value={num}>
//                                 {num}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}

//             {/* Submit button */}
//             <button
//               onClick={handleSubmit}
//               className="w-full bg-emerald-600 hover:bg-emerald-500 transition rounded-md py-2 font-semibold text-white shadow hover:shadow-emerald-500/30"
//             >
//               Submit Scores
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default Scorecard;
