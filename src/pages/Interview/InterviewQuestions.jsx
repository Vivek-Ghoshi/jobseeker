import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, ChevronUp, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { generateInterviewQuestions } from "../../redux/slices/interviewSlice";
import TextToSpeechButton from "../../components/TextToSpeechButton";


   const  questions = {
        "Basic background and introduction questions": [
            {
                "id": "qs-1",
                "question": "Can you walk me through your journey as a developer and how it has prepared you for a role as an Operation Manager?"
            },
            {
                "id": "qs-2",
                "question": "What motivated you to transition from a technical role focused on React, Express, and MongoDB to an operations management position?"
            }
        ],
        "Education and certifications questions": [
            {
                "id": "qs-3",
                "question": "Can you describe how your educational background has contributed to your technical expertise, particularly in full-stack development?"
            },
            {
                "id": "qs-4",
                "question": "Have you pursued any additional certifications or training related to project management, operations, or technical leadership? If so, how have they influenced your work?"
            }
        ],
        "Work experience and projects questions": [
            {
                "id": "qs-5",
                "question": "Please describe a complex project where you utilized React JS, Express JS, and MongoDB together. What were the key technical challenges, and how did you overcome them?"
            },
            {
                "id": "qs-6",
                "question": "Can you share an example of a time when you optimized a web application’s performance, particularly focusing on front-end animations and back-end API responses?"
            }
        ],
        "Technical and skill-based questions": [
            {
                "id": "qs-7",
                "question": "How do you design a scalable system architecture using Express JS and MongoDB to handle high traffic while ensuring data consistency?"
            },
            {
                "id": "qs-8",
                "question": "Explain your approach to debugging and optimizing a React application that suffers from slow rendering and poor animation performance."
            }
        ],
        "Behavioral and situational questions": [
            {
                "id": "qs-9",
                "question": "Imagine you are managing a cross-functional team where developers and operations staff have conflicting priorities. How would you handle this to ensure project success?"
            },
            {
                "id": "qs-10",
                "question": "Describe a situation where a critical deployment failed. How did you manage the technical troubleshooting and communicate with stakeholders during this incident?"
            }
        ]
    };
    
const InterviewQuestions = () => {
  const dispatch = useDispatch();
  // const { questions, loading,error} = useSelector((state) => state.interview);
  const error = null;
  const loading = null;
  const [collapsed, setCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    dispatch(generateInterviewQuestions());
  }, [dispatch]);

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
      className="fixed bottom-4 right-4 z-50 bg-[#0f172a]/95 text-white shadow-2xl rounded-2xl w-[95vw] max-w-xl max-h-[80vh] overflow-hidden flex flex-col border border-cyan-600/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-cyan-700 to-emerald-600 rounded-t-2xl cursor-grab select-none">
        <div className="flex items-center gap-2 font-bold text-lg">
          <GripVertical className="w-4 h-4" />
          Interview Questions
        </div>
        <button onClick={() => setCollapsed((prev) => !prev)}>
          {collapsed ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            key="interview-questions-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar"
          >
            {loading && (
              <div className="flex justify-center items-center mt-10">
                <Loader2 className="animate-spin h-8 w-8 text-cyan-400" />
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center text-red-500 mt-6">
                <AlertTriangle className="w-6 h-6 mb-2" />
                <p className="text-lg font-semibold">Failed to fetch questions.</p>
              </div>
            )}

            {!loading && !error && questions && Object.entries(questions).map(([section, qList]) => (
              <div
                key={section}
                className="border border-cyan-500/30 rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full text-left px-4 py-2 bg-cyan-900/70 hover:bg-cyan-800 transition flex justify-between items-center text-white font-semibold"
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
                      className="px-4 py-3 space-y-3 bg-[#1e293b]/70"
                    >
                      {qList.map((q) => (
                        <div
                          key={q.id}
                          className="p-3 rounded-lg bg-[#0f172a]/80 text-gray-200 border border-cyan-600/20 hover:border-cyan-400 transition"
                        >
                          {q.question}
                          <TextToSpeechButton text={q.question}/>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewQuestions;
