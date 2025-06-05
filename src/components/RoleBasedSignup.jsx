import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
// import { registerUserAsync } from "../redux/userSlice";

const jobseekerSteps = [
  {
    id: "firstName",
    label: "Enter your first name",
    type: "text",
    validation: /^[A-Za-z]{2,}$/,
    audio: "/audios/first-name.mp3",
  },
  {
    id: "lastName",
    label: "Enter your last name",
    type: "text",
    validation: /^[A-Za-z]{2,}$/,
    audio: "/audios/last-name.mp3",
  },
  {
    id: "email",
    label: "Enter your email",
    type: "email",
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    audio: "/audios/email.mp3",
  },
  {
    id: "password",
    label: "Create a password",
    type: "password",
    validation: /^.{6,}$/,
    audio: "/audios/password.mp3",
  },
];

const employerSteps = [
  {
    id: "companyName",
    label: "Enter your company name",
    type: "text",
    validation: /^.{2,}$/,
    audio: "/audios/company-name.mp3",
  },
  {
    id: "contactPerson",
    label: "Contact person full name",
    type: "text",
    validation: /^.{2,}$/,
    audio: "/audios/contact-person.mp3",
  },
  {
    id: "email",
    label: "Company email address",
    type: "email",
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    audio: "/audios/email.mp3",
  },
  {
    id: "password",
    label: "Create a secure password",
    type: "password",
    validation: /^.{6,}$/,
    audio: "/audios/password.mp3",
  },
];

export default function RoleBasedSignup({ role }) {
  const dispatch = useDispatch();
  const steps = role === "employer" ? employerSteps : jobseekerSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const [formData, setFormData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const { handleSubmit } = useForm();

  const step = steps[currentStep];

  useEffect(() => {
    const audio = new Audio(step.audio);
    setInputValue(formData[step.id] || "");
    if (audioPlaying) audio.play();
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [currentStep, audioPlaying]);

  const validateAndProceed = () => {
    if (step.validation.test(inputValue)) {
      setFormData({ ...formData, [step.id]: inputValue });
      setError("");
      setCurrentStep((prev) => prev + 1);
    } else {
      setError(`Please enter a valid ${step.id}`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = () => {
    if (currentStep === steps.length) {
      // dispatch(registerUserAsync({ role, data: formData }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`bg-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-700 relative ${
              shake ? "shake" : ""
            }`}
          >
            {currentStep < steps.length ? (
              <>
                <label className="block text-lg mb-2 font-semibold text-teal-400">
                  {step.label}
                </label>
                <input
                  type={step.type}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") validateAndProceed();
                  }}
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handleBack}
                    className="text-sm text-gray-400 hover:text-teal-400 transition"
                  >
                    ← Back
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAudioPlaying((prev) => !prev)}
                      className="text-sm text-gray-400 hover:text-teal-400 transition"
                    >
                      {audioPlaying ? "Pause 🔇" : "Play 🔊"}
                    </button>
                    <button
                      onClick={validateAndProceed}
                      className="text-sm text-teal-500 hover:text-teal-300 font-semibold transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-center mb-4 text-teal-400">
                  Ready to Submit?
                </h2>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 transition rounded-lg font-semibold"
                >
                  Submit
                </button>
                <button
                  onClick={handleBack}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-teal-400 transition text-center"
                >
                  ← Back to Edit
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
