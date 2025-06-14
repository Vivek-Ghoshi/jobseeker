import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { createResume } from "../../redux/slices/resumeBuilderSlice";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";

const sections = [
  "Personal Info",
  "Experience",
  "Education",
  "Projects",
  "Skills",
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!document.getElementById("shake-style")) {
      const style = document.createElement("style");
      style.id = "shake-style";
      style.innerHTML = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      personal_info: {},
      experience: [{}],
      education: [{}],
      projects: [{}],
      skills: "",
      target_role: "",
      template: "modern",
    },
  });

  const experienceArray = useFieldArray({ control, name: "experience" });
  const educationArray = useFieldArray({ control, name: "education" });
  const projectArray = useFieldArray({ control, name: "projects" });

  const sectionFieldNames = {
    "Personal Info": [
      "personal_info.full_name",
      "personal_info.email",
      "personal_info.phone",
    ],
    Experience: experienceArray.fields.flatMap((_, i) => [
      `experience.${i}.company`,
      `experience.${i}.position`,
      `experience.${i}.start_date`,
      `experience.${i}.end_date`,
      `experience.${i}.location`,
      `experience.${i}.description.0`,
    ]),
    Education: educationArray.fields.flatMap((_, i) => [
      `education.${i}.institution`,
      `education.${i}.degree`,
      `education.${i}.field_of_study`,
      `education.${i}.graduation_date`,
    ]),
    Projects: projectArray.fields.flatMap((_, i) => [
      `projects.${i}.name`,
      `projects.${i}.description`,
      `projects.${i}.technologies.0`,
    ]),
    Skills: ["skills", "target_role"],
  };

  const handleNext = async () => {
    const currentSection = sections[currentStep];
    const fieldsToValidate = sectionFieldNames[currentSection] || [];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const transformData = (data) => ({
    ...data,
    skills: data.skills
      ? data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    experience: data.experience.map((exp) => ({
      ...exp,
      description: [
        exp.description?.[0],
        exp.description?.[1],
        exp.description?.[2],
      ].filter(Boolean),
    })),
    projects: data.projects.map((proj) => ({
      ...proj,
      technologies: [
        proj.technologies?.[0],
        proj.technologies?.[1],
        proj.technologies?.[2],
      ].filter(Boolean),
    })),
  });

  const onSubmit = async (formData) => {
    const isValid = await trigger();
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    const formattedData = transformData(formData);
    setLoading(true);
    const res = await dispatch(createResume(formattedData));
    if (createResume.fulfilled.match(res)) {
      setLoading(false);
      navigate("/all-resumelist");
    }
  };

  const inputClass =
    "w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500";
  const textAreaClass =
    "w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500";

  const sectionUI = {
    "Personal Info": (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">
          Personal Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            {...register("personal_info.full_name", { required: true })}
            placeholder="Full Name"
            className={inputClass}
          />
          <input
            {...register("personal_info.email", { required: true })}
            placeholder="Email"
            className={inputClass}
          />
          <input
            {...register("personal_info.phone", { required: true })}
            placeholder="Phone"
            className={inputClass}
          />
          <input
            {...register("personal_info.location")}
            placeholder="Location"
            className={inputClass}
          />
          <input
            {...register("personal_info.linkedin")}
            placeholder="LinkedIn"
            className={inputClass}
          />
          <input
            {...register("personal_info.github")}
            placeholder="GitHub"
            className={inputClass}
          />
          <input
            {...register("personal_info.portfolio")}
            placeholder="Portfolio"
            className={inputClass}
          />
        </div>
      </>
    ),
    Experience: (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">
          Experience
        </h2>
        {experienceArray.fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-6 p-4 rounded-lg border border-cyan-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                {...register(`experience.${index}.company`)}
                placeholder="Company"
                className={inputClass}
              />
              <input
                {...register(`experience.${index}.position`)}
                placeholder="Position"
                className={inputClass}
              />
              <input
                {...register(`experience.${index}.start_date`)}
                placeholder="Start Date"
                className={inputClass}
              />
              <input
                {...register(`experience.${index}.end_date`)}
                placeholder="End Date"
                className={inputClass}
              />
              <input
                {...register(`experience.${index}.location`)}
                placeholder="Location"
                className={inputClass}
              />
            </div>
            <textarea
              {...register(`experience.${index}.description.0`)}
              placeholder="Description"
              className={textAreaClass}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => experienceArray.append({})}
          className="text-sm text-teal-400 mt-2"
        >
          + Add More
        </button>
      </>
    ),
    Education: (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">
          Education
        </h2>
        {educationArray.fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-6 p-4 rounded-lg border border-cyan-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                {...register(`education.${index}.institution`)}
                placeholder="Institution"
                className={inputClass}
              />
              <input
                {...register(`education.${index}.degree`)}
                placeholder="Degree"
                className={inputClass}
              />
              <input
                {...register(`education.${index}.field_of_study`)}
                placeholder="Field of Study"
                className={inputClass}
              />
              <input
                {...register(`education.${index}.graduation_date`)}
                placeholder="Graduation Date"
                className={inputClass}
              />
              <input
                {...register(`education.${index}.gpa`)}
                placeholder="GPA"
                className={inputClass}
              />
              <input
                {...register(`education.${index}.location`)}
                placeholder="Location"
                className={inputClass}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => educationArray.append({})}
          className="text-sm text-teal-400 mt-2"
        >
          + Add More
        </button>
      </>
    ),
    Projects: (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">
          Projects
        </h2>
        {projectArray.fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-6 p-4 rounded-lg border border-cyan-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                {...register(`projects.${index}.name`)}
                placeholder="Project Name"
                className={inputClass}
              />
              <input
                {...register(`projects.${index}.url`)}
                placeholder="Project URL"
                className={inputClass}
              />
              <input
                {...register(`projects.${index}.technologies.0`)}
                placeholder="Tech Stack"
                className={inputClass}
              />
            </div>
            <textarea
              {...register(`projects.${index}.description`)}
              placeholder="Project Description"
              className={textAreaClass}
              rows={4}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => projectArray.append({})}
          className="text-sm text-teal-400 mt-2"
        >
          + Add More
        </button>
      </>
    ),
    Skills: (
      <div className="mb-6 p-4 rounded-lg border border-teal-700">
        <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">
          Skills & Role Target
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Skills</label>
            <textarea
              {...register("skills")}
              placeholder="Comma separated skills like React, Node.js, AWS"
              className={textAreaClass}
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">
              Target Role
            </label>
            <input
              {...register("target_role", { required: true })}
              placeholder="Frontend Developer, DevOps Engineer, etc."
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-500 transition rounded-lg font-semibold text-white shadow-md"
        >
          Submit Resume
        </button>
      </div>
    ),
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white px-4 py-10 flex flex-col items-center justify-center">
  {loading ? (
    <div className="flex justify-center mt-20">
      <Loader className="animate-spin w-8 h-8 text-cyan-500" />
    </div>
  ) : (
    <>
      {/* Header Section */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse tracking-wide drop-shadow-lg">
          🚀 Create Your Professional Resume
        </h1>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          Stand out from the crowd. Build a resume that reflects your unique skills and experience.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`bg-gray-950 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-700 w-full ${
              shake ? "animate-shake" : ""
            }`}
          >
            {sectionUI[sections[currentStep]]}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-gray-400 hover:text-teal-400 transition"
              >
                ← Back
              </button>
              {currentStep < sections.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-sm text-teal-400 hover:text-teal-300 font-medium transition"
                >
                  Next →
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </>
  )}
</div>

  );
};

export default ResumeBuilder;
