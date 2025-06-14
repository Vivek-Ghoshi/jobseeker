import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Volume2, Mic, ChevronRight, Loader2 } from "lucide-react";
import { generateJobDescription } from "../../redux/slices/employerSlice";

const questions = [
  { key: "jobRole", question: "What is the job role?" },
  {
    key: "experience",
    question: "How many years of experience is required for this job?",
  },
  {
    key: "location",
    question: "Where is the job located and is it remote, hybrid, or onsite?",
  },
  {
    key: "workMode",
    question:
      "What is the work mode or schedule (e.g., hybrid, remote, onsite)?",
  },
  {
    key: "requiredSkills",
    question: "What are the required skills for this job?",
  },
  {
    key: "niceToHaveSkills",
    question: "What are the preferred or nice-to-have skills for this job?",
  },
  {
    key: "seniority",
    question:
      "What is the seniority level of the role? (e.g., Junior, Mid, Senior)",
  },
  {
    key: "salaryRange",
    question:
      "What is the salary range offered for this job use(-) as a separator ?",
  },
];

const JobDetailsConvo = () => {
  const { register, setValue, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(12.5);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[questionIndex];
  const currentAnswer = watch(currentQuestion.key) || "";

  const speakQuestion = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert("Speech Recognition not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setTranscript(voiceInput);
      setValue(currentQuestion.key, voiceInput);
    };

    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const nextStep = async () => {
    if (!currentAnswer.trim())
      return alert("Please provide an answer or use voice input.");
    const isLast = questionIndex === questions.length - 1;

    if (isLast) {
      const data = {};
      questions.forEach((q) => {
        data[q.key] = watch(q.key);
      });

      const experienceFormatted =
        data.experience === "1" ? "1 year" : `${data.experience} years`;

      const locationFormatted =
        data.location.charAt(0).toUpperCase() + data.location.slice(1);

      const prompt = `${data.jobRole.trim()} position at a growing company. We are looking for someone with ${experienceFormatted} of experience. The role is ${
        data.workMode
      } (${locationFormatted}). Required skills should include: ${
        data.requiredSkills
      }. Nice to have skills: ${
        data.niceToHaveSkills
      }. Competitive salary range: ${data.salaryRange}`;

      try {
        setLoading(true);
        const res = await dispatch(generateJobDescription(prompt));
        if (generateJobDescription.fulfilled.match(res)) {
          navigate("/employer/create-openings");
        }
      } catch (err) {
        console.error("Error generating job description:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setQuestionIndex((prev) => prev + 1);
      setTranscript("");
      setProgress((prev) => prev + 12.5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10 w-2 h-2"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.1 + Math.random() * 0.3,
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [null, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-xl bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-2xl shadow-[0_0_25px_rgba(128,90,213,0.15)] p-6 sm:p-8 relative z-10 border border-purple-900/20"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-900/30 mr-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-purple-300">
            Question {questionIndex + 1} of {questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              {currentQuestion.question}
            </h2>

            {currentQuestion.key === "workMode" ? (
              <select
                {...register("workMode", { required: true })}
                value={currentAnswer}
                onChange={(e) => setValue("workMode", e.target.value)}
                className="w-full px-5 py-4 bg-[#0f0f1a] text-white rounded-xl border border-gray-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select work mode</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            ) : currentQuestion.key === "seniority" ? (
              <select
                {...register("seniority", { required: true })}
                value={currentAnswer}
                onChange={(e) => setValue("seniority", e.target.value)}
                className="w-full px-5 py-4 bg-[#0f0f1a] text-white rounded-xl border border-gray-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select seniority level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            ) : (
              <input
                {...register(currentQuestion.key, { required: true })}
                value={currentAnswer}
                onChange={(e) => setValue(currentQuestion.key, e.target.value)}
                className="w-full px-5 py-4 text-white bg-gray-800/50 rounded-xl border border-gray-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all placeholder:text-gray-500"
                placeholder="Type your answer or use voice input..."
              />
            )}

            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30"
              >
                <p className="text-sm text-gray-300">
                  <span className="inline-flex items-center text-purple-400 font-medium">
                    <Mic className="w-3 h-3 mr-1" /> Voice input:
                  </span>
                  <span className="italic ml-2 text-gray-400">
                    {transcript}
                  </span>
                </p>
              </motion.div>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
              <motion.button
                onClick={() => speakQuestion(currentQuestion.question)}
                disabled={playing}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {playing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">Hear Question</span>
              </motion.button>

              <motion.button
                onClick={startListening}
                disabled={listening}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700/50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Mic className={`w-4 h-4 ${listening ? "text-red-400" : ""}`} />
                <span className="text-sm font-medium">
                  {listening ? "Listening..." : "Voice Input"}
                </span>
              </motion.button>

              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-60"
              >
                {questionIndex === questions.length - 1 && loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JobDetailsConvo;
