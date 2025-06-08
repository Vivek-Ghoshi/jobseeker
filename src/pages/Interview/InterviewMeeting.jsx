import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  generateInterviewQuestions,
  saveInterviewScores,
} from "../../redux/slices/interviewSlice";
import Scorecard from "./ScoreCard";

const InterviewMeeting = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const [showQuestions, setShowQuestions] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const { questions } = useSelector((state) => state.interview);
  const meetingURL = location.state?.meetingURL;
  const applicationId = location.state?.appId;

  if (!meetingURL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <p className="text-xl text-red-400 font-semibold text-center">
          ⚠️ No meeting URL provided.
        </p>
      </div>
    );
  }

  useEffect(() => {
    dispatch(generateInterviewQuestions(applicationId));
  }, [dispatch, applicationId]);

  const handleScoreSubmit = async (scores) => {
    try {
      const formatted = {
        question: scores,
      };
      await dispatch(
        saveInterviewScores({ data: formatted, appId: applicationId })
      ).unwrap();

      setShowQuestions(false);
      setSuccessPopup(true);
      setTimeout(() => setSuccessPopup(false), 3000); // Hide after 3 sec
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#0f172a] to-black flex flex-col items-center justify-center px-2 py-2">
      {/* Success Popup */}
      {successPopup && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm md:text-base font-medium z-50"
        >
          ✅ Scores submitted successfully!
        </motion.div>
      )}

      {/* Employer Button to Open ScoreCard */}
      {role === "employer" && (
        <div className="w-full flex justify-end mt-2 mb-2">
          <motion.button
            onClick={() => setShowQuestions(true)}
            className="px-5 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md transition duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            See Interview Questions
          </motion.button>
        </div>
      )}

      {/* Scorecard Popup */}
      {showQuestions && (
        <Scorecard
          questions={questions?.questions}
          onSubmit={handleScoreSubmit}
          onClose={() => setShowQuestions(false)}
        />
      )}

      {/* Video Interview Frame */}
      <motion.div
        className="w-full max-w-7xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-cyan-700"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <iframe
          src={meetingURL}
          allow="camera; microphone; fullscreen; display-capture"
          className="w-full h-full"
          style={{ border: "none" }}
          title="Interview Room"
        />
      </motion.div>

      <motion.p
        className="mt-6 text-gray-400 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        You’re in the interview room. Please ensure your mic and camera are
        working.
      </motion.p>
    </div>
  );
};

export default InterviewMeeting;
