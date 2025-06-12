import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getTTSAudio } from "../redux/slices/textToSpeechSlice";
import { useNavigate } from "react-router-dom";
import { employerSignup, jobSeekerSignup } from "../redux/slices/authSlice";

const jobseekerSteps = [
  {
    id: "first_name",
    label: "Enter your first name",
    type: "text",
    validation: /^[A-Za-z]{2,}$/,
    errorMessage: "First name must contain at least 2 letters without spaces in(start/end/middle).",
    path: "auth.signup.job_seeker.first_name",
  },
  {
    id: "last_name",
    label: "Enter your last name",
    type: "text",
    validation: /^[A-Za-z]{2,}$/,
    errorMessage: "Last name must contain at least 2 letters without spaces in(start/end/middle).",
    path: "auth.signup.job_seeker.last_name",
  },
  {
    id: "email",
    label: "Enter your email",
    type: "email",
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Enter a valid email address (example@mail.com).",
    path: "auth.signup.job_seeker.email",
  },
  {
    id: "password",
    label: "Create a password",
    type: "password",
    validation: /^.{8,}$/,
    errorMessage: "Password must be at least 8 characters long.",
    path: "auth.signup.job_seeker.password",
  },
  {
    id: "phone_number",
    label: "Enter your phone number",
    type: "tel",
    validation: /^\+?\d{10,14}$/,
    errorMessage: "Enter a valid phone number with country code.",
    path: "auth.signup.job_seeker.phone_number",
  },
];

const employerSteps = [
  {
    id: "company_name",
    label: "Enter your company name",
    type: "text",
    validation: /^.{2,}$/,
    errorMessage: "Company name must be at least 2 characters.",
    path: "auth.signup.employer.company_name",
  },
  {
    id: "first_name",
    label: "Enter contact person's first name",
    type: "text",
    validation: /^[A-Za-z]{2,}$/,
    errorMessage: "First name must contain at least 2 letters.",
    path: "auth.signup.employer.first_name",
  },
  {
    id: "last_name",
    label: "Enter contact person's last name",
    type: "text",
    validation: /^[A-Za-z]{2,}$/,
    errorMessage: "at least 2 letters without spaces in (start/middle/end).",
    path: "auth.signup.employer.last_name",
  },
  {
    id: "email",
    label: "Company email address",
    type: "email",
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Enter a valid email address (example@mail.com).",
    path: "auth.signup.employer.email",
  },
  {
    id: "password",
    label: "Create a secure password",
    type: "password",
    validation: /^.{8,}$/,
    errorMessage: "Password must be at least 8 characters long.",
    path: "auth.signup.employer.password",
  },
  {
    id: "company_website",
    label: "Enter your company website",
    type: "url",
    validation: /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
    errorMessage: "Enter a valid URL (e.g., https://example.com).",
    path: "auth.signup.employer.company_website",
  },
  {
    id: "company_size",
    label: "Select your company size",
    type: "select",
    options: ["1-10", "11-50", "51-200", "200+"],
    validation: /^.+$/,
    errorMessage: "Please select a company size.",
    path: "auth.signup.employer.company_size",
  },
  {
    id: "phone_number",
    label: "Enter your contact phone number",
    type: "tel",
    validation: /^\+?[0-9]{10,15}$/,
    errorMessage: "Enter a valid phone number with country code.",
    path: "auth.signup.employer.phone_number",
  },
  {
    id: "role_in_company",
    label: "Your role in the company",
    type: "text",
    validation: /^.{2,}$/,
    errorMessage: "Role must be at least 2 characters.",
    path: "auth.signup.employer.role_in_company",
  },
];

export default function RoleBasedSignup({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const steps = role === "employer" ? employerSteps : jobseekerSteps;
  const { audioData } = useSelector((state) => state.textToSpeech);
  const [currentStep, setCurrentStep] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const [formData, setFormData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [popupError, setPopupError] = useState("");

  const { handleSubmit } = useForm();
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const step = steps[currentStep];
  const timerRef = useRef(null);

  useEffect(() => {
    if (step?.path) dispatch(getTTSAudio({ promptPath: step.path, language }));
  }, [currentStep, language]);

  useEffect(() => {
    if (audioData?.audio_url && audioPlaying) {
      const audio = new Audio(audioData.audio_url);
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (err) {
          console.error("Audio play error:", err);
        }
      };
      playAudio();
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [audioData, audioPlaying]);

  useEffect(() => {
    setInputValue(formData[step?.id] || "");
  }, [currentStep]);

 const validateAndProceed = () => {
  let value = inputValue.trim();

  // Remove all spaces if it's a password field
  if (step.id === "password" || step.id === "last_name" || step.id === "first_name") {
    value = value.replace(/\s+/g, "");
  }

  if (step.validation.test(value)) {
    setFormData((prev) => ({ ...prev, [step.id]: value }));
    setError("");
    setCurrentStep((prev) => prev + 1);
  } else {
    setError(step.errorMessage || `Please enter a valid ${step.id}`);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }
};

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async () => {
    try {
      const payload = { role, ...formData };
      const res =
        role === "jobseeker"
          ? await dispatch(jobSeekerSignup(payload))
          : await dispatch(employerSignup(payload));

      if (
        (role === "jobseeker" && jobSeekerSignup.fulfilled.match(res)) ||
        (role === "employer" && employerSignup.fulfilled.match(res))
      ) {
        setShowSuccess(true);
        setTimeout(() => navigate(`/dashboard/${role}`), 2000);
      } else {
        const details = res?.payload?.detail;
        if (Array.isArray(details) && details.length > 0) {
          const msg = details[0]?.msg || "Something went wrong.";
          setPopupError(msg);
          setTimeout(() => setPopupError(""), 4000);
        }
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const startListening = () => {
    if (audioRef.current) audioRef.current.pause();
    setAudioPlaying(false);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert("Speech recognition not supported.");
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === "en" ? "en-US" : language;
    recognition.interimResults = false;
    recognition.continuous = false;
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      timerRef.current = setTimeout(() => validateAndProceed(), 2000);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      const msg = {
        "not-allowed": "Microphone permission denied.",
        "no-speech": "No speech detected.",
        network: "Network error.",
      }[event.error] || "Voice input failed.";
      alert(msg);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const cancelAutoNext = () => {
    clearTimeout(timerRef.current);
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4 pt-20 sm:pt-0">
      <div className="max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-teal-400 font-bold text-xl">
            {role === "employer" ? "Employer Signup" : "Jobseeker Signup"}
          </h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white p-1 rounded"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ml">Malayalam</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        {popupError && (
          <div className="bg-red-600 text-white p-2 rounded shadow-lg text-sm text-center">
            ❌ {popupError}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`bg-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-700 relative ${shake ? "shake" : ""}`}
          >
            {currentStep < steps.length ? (
              <>
                <label className="block text-lg mb-2 font-semibold text-teal-400">{step.label}</label>
                <div className="flex items-center gap-2">
                  {step.type === "select" ? (
                    <select
                      value={inputValue}
                      onChange={(e) => { setInputValue(e.target.value); cancelAutoNext(); }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      {step.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={step.type}
                      value={inputValue}
                      onChange={(e) => { setInputValue(e.target.value); cancelAutoNext(); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { cancelAutoNext(); validateAndProceed(); } }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
                    />
                  )}
                  <button
                    onClick={() => { cancelAutoNext(); startListening(); }}
                    className={`p-2 text-white rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-700"}`}
                    title="Speak to fill"
                  >🎤</button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <div className="flex justify-between items-center mt-4">
                  <button onClick={handleBack} className="text-sm text-gray-400 hover:text-teal-400">← Back</button>
                  <div className="flex gap-4">
                    <button onClick={() => setAudioPlaying((prev) => !prev)} className="text-sm text-gray-400 hover:text-teal-400">
                      {audioPlaying ? "Pause 🔇" : "Play 🔊"}
                    </button>
                    <button onClick={() => { cancelAutoNext(); validateAndProceed(); }} className="text-sm text-teal-500 hover:text-teal-300 font-semibold">
                      Next →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-center mb-4 text-teal-400">Ready to Submit?</h2>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold"
                >Submit</button>
                <button
                  onClick={handleBack}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-teal-400 text-center"
                >← Back to Edit</button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg bg-green-700 text-center text-white font-semibold shadow-xl"
          >
            ✅ Account created successfully! Redirecting to profile...
          </motion.div>
        )}
      </div>
    </div>
  );
}
