import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Speaker, Loader2, X, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import {
  fetchProjectEstimate,
} from "../../redux/slices/employerSlice";

const questions = [
  {
    name: "project_description",
    label: "Describe your project in detail (scope, tech stack, goals)",
    type: "text",
  },
  {
    name: "duration",
    label: "What is the expected duration of the project?",
    type: "text",
  },
  {
    name: "urgency",
    label: "How urgent is this project? (Low, Medium, High)",
    type: "select",
    options: ["Low", "Medium", "High"],
  },
  {
    name: "currency",
    label: "Which currency should we use for the estimate?",
    type: "select",
    options: ["USD", "INR", "EUR"],
  },
];

export default function ProjectEstimator() {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, trigger, reset } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [justEstimated, setJustEstimated] = useState(false); // new state
  const estimateRef = useRef(null);
  const { estimatedCost, loading } = useSelector((state) => state.employer);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!estimatedCost && currentStep < questions.length) {
      speak(questions[currentStep].label);
    }
  }, [currentStep]);

  useEffect(() => {
    if (estimatedCost?.[0]?.output?.cost_estimate && justEstimated) {
      setShowPopup(true); // auto-open on new estimate
      setJustEstimated(false); // ensure only opens once
    }
  }, [estimatedCost, justEstimated]);

  const onSubmit = async (data) => {
    setLocalLoading(true);
    await dispatch(fetchProjectEstimate(data));
    setLocalLoading(false);
    setCurrentStep(0);
    reset();
    setJustEstimated(true); // trigger auto-popup next render
  };

  const handleNext = async () => {
    const field = questions[currentStep].name;
    const valid = await trigger(field);
    if (!valid) return;

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const parseMarkdown = (md) => {
    return md.split("\n").map((line, index) => {
      if (line.startsWith("##")) {
        return (
          <h2 key={index} className="text-lg font-bold mt-4 text-purple-400">
            {line.replace(/^##\s*/, "")}
          </h2>
        );
      } else if (line.startsWith("###")) {
        return (
          <h3 key={index} className="text-md font-semibold mt-3 text-purple-300">
            {line.replace(/^###\s*/, "")}
          </h3>
        );
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.replace(/^- /, "")}
          </li>
        );
      } else if (line.startsWith("*")) {
        return (
          <p key={index} className="mt-2 font-medium">
            {line.replace(/^\*/, "")}
          </p>
        );
      } else {
        return <p key={index}>{line}</p>;
      }
    });
  };

  const downloadPDF = () => {
    const element = estimateRef.current;
    if (!element) return;

    const cloned = element.cloneNode(true);
    cloned.style.background = "white";
    cloned.style.color = "black";
    cloned.style.padding = "20px";
    cloned.style.width = "800px";

    cloned.querySelectorAll("*").forEach((el) => {
      el.style.background = "white";
      el.style.color = "black";
      el.style.border = "none";
      el.style.boxShadow = "none";
    });

    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.top = "-9999px";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.appendChild(cloned);
    document.body.appendChild(hiddenContainer);

    const opt = {
      margin: 0.5,
      filename: "project_estimate.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, scrollY: 0, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(cloned)
      .save()
      .then(() => document.body.removeChild(hiddenContainer))
      .catch((err) => {
        console.error("PDF generation error:", err);
        document.body.removeChild(hiddenContainer);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white flex items-center justify-center p-4 relative">
      <motion.div
        className="w-full max-w-xl bg-gradient-to-bl from-black via-gray-900 to-[#0f0f1a] rounded-2xl shadow-xl p-8 space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {questions.map(
            (q, index) =>
              index === currentStep && (
                <motion.div
                  key={q.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <label className="block text-lg font-medium">{q.label}</label>
                  <div className="flex items-center gap-2">
                    {q.type === "select" ? (
                      <select
                        {...register(q.name, { required: true })}
                        className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600"
                      >
                        <option value="">Select</option>
                        {q.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        {...register(q.name, { required: true })}
                        className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-600"
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      />
                    )}
                    <button
                      onClick={() => speak(q.label)}
                      className="text-purple-400"
                    >
                      <Speaker size={20} />
                    </button>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleNext}
          disabled={isSpeaking || localLoading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold"
        >
          {localLoading ? (
            <Loader2 className="animate-spin mx-auto" size={20} />
          ) : currentStep < questions.length - 1 ? (
            "Next"
          ) : (
            "Get Estimate"
          )}
        </motion.button>

        {estimatedCost?.[0]?.output?.cost_estimate && !showPopup && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowPopup(true)}
              className="text-sm text-purple-300 hover:underline"
            >
              See Previous Estimate
            </button>
          </div>
        )}
      </motion.div>

      {/* Estimate Popup */}
      {showPopup && estimatedCost?.[0]?.output?.cost_estimate && (
        <motion.div className="fixed inset-0  bg-opacity-80 z-50 flex items-center justify-center p-4">
          <motion.div className="custom-scrollbar bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
            >
              <X />
            </button>

            <h3 className="text-xl font-bold text-purple-400 mb-2">
              Project Estimate
            </h3>

            <div
              ref={estimateRef}
              className="text-sm space-y-2 bg-white text-black p-4 rounded-md"
            >
              {parseMarkdown(estimatedCost[0].output.cost_estimate)}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              >
                <Download size={18} /> Download PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
