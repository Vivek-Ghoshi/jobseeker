import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GripVertical, Mic, Trash2, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { addQuestion, clearAllQuestions, removeQuestion } from '../redux/slices/employerSlice';


const WorkSpace = ({ onClose }) => {
  const dispatch = useDispatch();
  const {workspace}  = useSelector((state) => state.employer);

  const [questionInput, setQuestionInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestionInput((prev) => prev + ' ' + transcript);
    };

    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
  }, []);

  const handleRecord = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleAddQuestion = () => {
    if (questionInput.trim()) {
      dispatch(addQuestion(questionInput.trim()));
      setQuestionInput('');
    }
  };

  const handleClearQuestion = (index) => {
    dispatch(removeQuestion(index));
  };

  return (
   <motion.div
  key="workspace"
  initial={{ opacity: 0, scale: 0.9, y: 30 }}
  animate={{ opacity: 1, scale: 1,  x: position.x, y: position.y }}
  exit={{ opacity: 0, scale: 0.95, y: 40 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
  drag
  dragMomentum={false}
  dragElastic={0.2}
  onDragEnd={(_, info) =>
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }))
  }
  className="fixed z-50 bg-[#0f172a] text-white rounded-2xl w-[95vw] max-w-md max-h-[90vh] bottom-4 right-4 shadow-2xl border border-cyan-500/20"
>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-t-2xl cursor-grab">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <GripVertical className="w-4 h-4" />
         Workspace
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => dispatch(clearAllQuestions())}
            className="text-red-400 hover:text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Input & Controls */}
      <div className="px-4 py-3 overflow-y-auto space-y-4 max-h-[70vh] custom-scrollbar">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="List up your task here"
            className="flex-1 p-2 rounded-md bg-black/60 text-white border border-cyan-500 focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleRecord}
            className={`p-2 rounded-full transition ${
              isRecording ? 'bg-red-500 animate-pulse' : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddQuestion}
            className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Listed Questions */}
        <div className="space-y-3">
          {workspace && workspace.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-start justify-between gap-2 p-3 bg-[#1e293b] border border-cyan-700 rounded-xl shadow-md hover:shadow-cyan-500/20"
            >
              <p className="text-sm text-white leading-relaxed">{q}</p>
              <button
                onClick={() => handleClearQuestion(index)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkSpace;
