import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProctoringDemo from "./ProctoringDemo";
import InterviewQuestions from "./InterviewQuestions";
import { setCameraStatus } from "../../redux/slices/candidateVerificationSlice";

const ExamPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cameraActive = useSelector(
    (state) => state.candidateVerification.cameraActive
  );

  // 1. Block back navigation
  useEffect(() => {
    const handlePopState = (e) => {
      if (cameraActive) {
        alert("🚫 You cannot leave the exam while the camera is active.");
        navigate(0); // Reload current page
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [cameraActive, navigate]);


  // 3. Optional: Warn before closing tab or reloading
  useEffect(() => {
    const beforeUnload = (e) => {
      if (cameraActive) {
        e.preventDefault();
        e.returnValue = "Camera is active. You can't leave the exam.";
        return e;
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [cameraActive]);

  return (
    <div className="relative min-h-screen bg-black text-white p-4">
      <ProctoringDemo />{" "}
      {/* This should dispatch setCameraStatus(false) when camera is stopped */}
      <InterviewQuestions />
    </div>
  );
};

export default ExamPage;
