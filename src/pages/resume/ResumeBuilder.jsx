import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { createResume } from "../../redux/slices/resumeBuilderSlice";
import { useNavigate } from "react-router";

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
  const [loading,setLoading] = useState(false);

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
    getValues,
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

  const transformData = (data) => {
    return {
      ...data,
      skills: data.skills
        ? data.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
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
    };
  };

  const onSubmit = async (formData) => {
    const isValid = await trigger(); // Final validation
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    const formattedData = transformData(formData);
    setLoading(true);
   const res = await dispatch(createResume(formattedData));
   if(createResume.fulfilled.match(res)){
      setLoading(false);
      navigate("/all-resumelist");

   }

  };

  const sectionUI = {
    "Personal Info": (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-4">
          Personal Info
        </h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-10 ">
          <input
            {...register("personal_info.full_name", { required: true })}
            placeholder="Full Name"
            className="input"
          />
          <input
            {...register("personal_info.email", { required: true })}
            placeholder="Email"
            className="input"
          />
          <input
            {...register("personal_info.phone", { required: true })}
            placeholder="Phone"
            className="input"
          />
          <input
            {...register("personal_info.location")}
            placeholder="Location"
            className="input"
          />
          <input
            {...register("personal_info.linkedin")}
            placeholder="LinkedIn"
            className="input"
          />
          <input
            {...register("personal_info.github")}
            placeholder="GitHub"
            className="input"
          />
          <input
            {...register("personal_info.portfolio")}
            placeholder="Portfolio"
            className="input"
          />
        </div>
      </>
    ),
    Experience: (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-4">Experience</h2>
        {experienceArray.fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-8 p-6 rounded-lg border border-cyan-700 shadow-md"
          >
            {/* First Section: Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                {...register(`experience.${index}.company`)}
                placeholder="Company"
                className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`experience.${index}.position`)}
                placeholder="Position"
                className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`experience.${index}.start_date`)}
                placeholder="Start Date"
                className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`experience.${index}.end_date`)}
                placeholder="End Date"
                className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`experience.${index}.location`)}
                placeholder="Location"
                className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 md:col-span-2"
              />
            </div>

            {/* Second Section: Description Lines */}
            <div className="space-y-3">
              <textarea
                {...register(`experience.${index}.description.0`)}
                placeholder="Description"
                className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {/* <textarea
                {...register(`experience.${index}.description.1`)}
                placeholder="Description Line 2"
                className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              /> */}
              {/* <textarea
                {...register(`experience.${index}.description.2`)}
                placeholder="Description Line 3"
                className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              /> */}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => experienceArray.append({})}
          className="text-sm text-teal-400"
        >
          + Add More
        </button>
      </>
    ),
    Education: (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-4">Education</h2>
        {educationArray.fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-8 p-6 rounded-lg border border-cyan-700 shadow-md"
          >
            {/* First Section: Basic Education Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                {...register(`education.${index}.institution`)}
                placeholder="Institution"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`education.${index}.degree`)}
                placeholder="Degree"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`education.${index}.field_of_study`)}
                placeholder="Field of Study"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`education.${index}.graduation_date`)}
                placeholder="Graduation Date"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`education.${index}.gpa`)}
                placeholder="GPA"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`education.${index}.location`)}
                placeholder="Location"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => educationArray.append({})}
          className="text-sm text-teal-400"
        >
          + Add More
        </button>
      </>
    ),
    Projects: (
      <>
        <h2 className="text-xl font-semibold text-teal-400 mb-4">Projects</h2>
        {projectArray.fields.map((item, index) => (
          <div
            key={item.id}
            className="mb-8 p-6 rounded-lg border border-cyan-700 shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Project Name */}
              <input
                {...register(`projects.${index}.name`)}
                placeholder="Project Name"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {/* Project URL */}
              <input
                {...register(`projects.${index}.url`)}
                placeholder="Project URL"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              {/* Technologies */}
              <input
                {...register(`projects.${index}.technologies.0`)}
                placeholder="Tech Stack"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {/* <input
                {...register(`projects.${index}.technologies.1`)}
                placeholder="Tech Stack 2"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                {...register(`projects.${index}.technologies.2`)}
                placeholder="Tech Stack 3"
                className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              /> */}
            </div>

            {/* Description Full Width */}
            <div>
              <textarea
                {...register(`projects.${index}.description`)}
                placeholder="Project Description"
                className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={4}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => projectArray.append({})}
          className="text-sm text-teal-400"
        >
          + Add More
        </button>
      </>
    ),
    Skills: (
      <div className="mb-8 p-6 rounded-lg border border-teal-700  shadow-md">
  <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">Skills & Role Target</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Skills */}
    <div className="col-span-1 md:col-span-2">
      <label className="text-sm text-gray-300 mb-1 block">Skills</label>
      <textarea
        {...register("skills")}
        placeholder="Comma separated skills like React, Node.js, AWS"
        className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
        rows={3}
      />
    </div>

    {/* Target Role */}
    <div className="col-span-1 md:col-span-2">
      <label className="text-sm text-gray-300 mb-1 block">Target Role</label>
      <input
        {...register("target_role", { required: true })}
        placeholder="Frontend Developer, DevOps Engineer, etc."
        className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  </div>

  {/* Submit Button */}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center px-4 py-12">
      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader className="animate-spin w-8 h-8 text-cyan-500" />
        </div>
      ) : (<form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`bg-gray-950 rounded-2xl p-6 shadow-xl border border-gray-700 ${
              shake ? "animate-shake" : ""
            }`}
          >
            {sectionUI[sections[currentStep]]}
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-gray-400 hover:text-teal-400"
              >
                ← Back
              </button>
              {currentStep < sections.length - 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-sm text-teal-400 hover:text-teal-300 font-medium"
                >
                  Next →
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </form>)}
      
    </div>
  );
};

export default ResumeBuilder;


// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { motion, AnimatePresence } from "framer-motion";
// import { useDispatch } from "react-redux";
// import { createResume } from "../../redux/slices/resumeBuilderSlice";

// const sections = [
//   "Personal Info",
//   "Experience",
//   "Education",
//   "Projects",
//   "Skills",
// ];

// const ResumeBuilder = () => {
//   const dispatch = useDispatch();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [shake, setShake] = useState(false);

//   // Inject shake animation CSS
//   useEffect(() => {
//     if (!document.getElementById("shake-style")) {
//       const style = document.createElement("style");
//       style.id = "shake-style";
//       style.innerHTML = `
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           50% { transform: translateX(5px); }
//           75% { transform: translateX(-5px); }
//         }
//         .animate-shake {
//           animation: shake 0.4s ease;
//         }
//       `;
//       document.head.appendChild(style);
//     }
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     control,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       personal_info: {},
//       experience: [{}],
//       education: [{}],
//       projects: [{}],
//       skills: [],
//       target_role: "",
//       template: "modern",
//     },
//   });

//   const experienceArray = useFieldArray({ control, name: "experience" });
//   const educationArray = useFieldArray({ control, name: "education" });
//   const projectArray = useFieldArray({ control, name: "projects" });

//   const sectionFieldNames = {
//     "Personal Info": [
//       "personal_info.full_name",
//       "personal_info.email",
//       "personal_info.phone",
//       "personal_info.location",
//       "personal_info.linkedin",
//       "personal_info.github",
//       "personal_info.portfolio",
//     ],
//     Experience: experienceArray.fields.flatMap((_, i) => [
//       `experience.${i}.company`,
//       `experience.${i}.position`,
//       `experience.${i}.start_date`,
//       `experience.${i}.end_date`,
//       `experience.${i}.location`,
//       `experience.${i}.description.0`,
//       `experience.${i}.description.1`,
//       `experience.${i}.description.2`,
//     ]),
//     Education: educationArray.fields.flatMap((_, i) => [
//       `education.${i}.institution`,
//       `education.${i}.degree`,
//       `education.${i}.field_of_study`,
//       `education.${i}.graduation_date`,
//       `education.${i}.gpa`,
//       `education.${i}.location`,
//     ]),
//     Projects: projectArray.fields.flatMap((_, i) => [
//       `projects.${i}.name`,
//       `projects.${i}.description`,
//       `projects.${i}.technologies.0`,
//       `projects.${i}.technologies.1`,
//       `projects.${i}.technologies.2`,
//       `projects.${i}.url`,
//     ]),
//     Skills: ["skills", "target_role"],
//   };

//   const handleNext = async () => {
//     const currentSection = sections[currentStep];
//     const fieldsToValidate = sectionFieldNames[currentSection] || [];
//     const isValid = await trigger(fieldsToValidate);
//     if (isValid) {
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       setShake(true);
//       setTimeout(() => setShake(false), 400);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) setCurrentStep((prev) => prev - 1);
//   };

//   const onSubmit = (data) => {
//     console.log("Submitted Resume:", data);
//     dispatch(createResume(data));
//   };

//   const sectionUI = {
//     "Personal Info": (
//       <>
//         <h2 className="text-xl font-semibold text-teal-400 mb-4">
//           Personal Info
//         </h2>
//         <div className="grid grid-cols-2 gap-y-4 gap-x-10 ">
//           <input
//             {...register("personal_info.full_name", { required: true })}
//             placeholder="Full Name"
//             className="input"
//           />
//           <input
//             {...register("personal_info.email", { required: true })}
//             placeholder="Email"
//             className="input"
//           />
//           <input
//             {...register("personal_info.phone", { required: true })}
//             placeholder="Phone"
//             className="input"
//           />
//           <input
//             {...register("personal_info.location")}
//             placeholder="Location"
//             className="input"
//           />
//           <input
//             {...register("personal_info.linkedin")}
//             placeholder="LinkedIn"
//             className="input"
//           />
//           <input
//             {...register("personal_info.github")}
//             placeholder="GitHub"
//             className="input"
//           />
//           <input
//             {...register("personal_info.portfolio")}
//             placeholder="Portfolio"
//             className="input"
//           />
//         </div>
//       </>
//     ),
//     Experience: (
//       <>
//         <h2 className="text-xl font-semibold text-teal-400 mb-4">Experience</h2>
//         {experienceArray.fields.map((item, index) => (
//           <div
//             key={item.id}
//             className="mb-8 p-6 rounded-lg border border-cyan-700 shadow-md"
//           >
//             {/* First Section: Company Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <input
//                 {...register(`experience.${index}.company`)}
//                 placeholder="Company"
//                 className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`experience.${index}.position`)}
//                 placeholder="Position"
//                 className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`experience.${index}.start_date`)}
//                 placeholder="Start Date"
//                 className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`experience.${index}.end_date`)}
//                 placeholder="End Date"
//                 className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`experience.${index}.location`)}
//                 placeholder="Location"
//                 className="input bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 md:col-span-2"
//               />
//             </div>

//             {/* Second Section: Description Lines */}
//             <div className="space-y-3">
//               <textarea
//                 {...register(`experience.${index}.description.0`)}
//                 placeholder="Description"
//                 className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               {/* <textarea
//                 {...register(`experience.${index}.description.1`)}
//                 placeholder="Description Line 2"
//                 className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               /> */}
//               {/* <textarea
//                 {...register(`experience.${index}.description.2`)}
//                 placeholder="Description Line 3"
//                 className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               /> */}
//             </div>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => experienceArray.append({})}
//           className="text-sm text-teal-400"
//         >
//           + Add More
//         </button>
//       </>
//     ),
//     Education: (
//       <>
//         <h2 className="text-xl font-semibold text-teal-400 mb-4">Education</h2>
//         {educationArray.fields.map((item, index) => (
//           <div
//             key={item.id}
//             className="mb-8 p-6 rounded-lg border border-cyan-700 shadow-md"
//           >
//             {/* First Section: Basic Education Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <input
//                 {...register(`education.${index}.institution`)}
//                 placeholder="Institution"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`education.${index}.degree`)}
//                 placeholder="Degree"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`education.${index}.field_of_study`)}
//                 placeholder="Field of Study"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`education.${index}.graduation_date`)}
//                 placeholder="Graduation Date"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`education.${index}.gpa`)}
//                 placeholder="GPA"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`education.${index}.location`)}
//                 placeholder="Location"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//             </div>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => educationArray.append({})}
//           className="text-sm text-teal-400"
//         >
//           + Add More
//         </button>
//       </>
//     ),
//     Projects: (
//       <>
//         <h2 className="text-xl font-semibold text-teal-400 mb-4">Projects</h2>
//         {projectArray.fields.map((item, index) => (
//           <div
//             key={item.id}
//             className="mb-8 p-6 rounded-lg border border-cyan-700 shadow-md"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               {/* Project Name */}
//               <input
//                 {...register(`projects.${index}.name`)}
//                 placeholder="Project Name"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />

//               {/* Project URL */}
//               <input
//                 {...register(`projects.${index}.url`)}
//                 placeholder="Project URL"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />

//               {/* Technologies */}
//               <input
//                 {...register(`projects.${index}.technologies.0`)}
//                 placeholder="Tech Stack"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               {/* <input
//                 {...register(`projects.${index}.technologies.1`)}
//                 placeholder="Tech Stack 2"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//               <input
//                 {...register(`projects.${index}.technologies.2`)}
//                 placeholder="Tech Stack 3"
//                 className="bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               /> */}
//             </div>

//             {/* Description Full Width */}
//             <div>
//               <textarea
//                 {...register(`projects.${index}.description`)}
//                 placeholder="Project Description"
//                 className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                 rows={4}
//               />
//             </div>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => projectArray.append({})}
//           className="text-sm text-teal-400"
//         >
//           + Add More
//         </button>
//       </>
//     ),
//     Skills: (
//       <div className="mb-8 p-6 rounded-lg border border-teal-700  shadow-md">
//   <h2 className="text-xl font-semibold text-teal-400 mb-6 text-center">Skills & Role Target</h2>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     {/* Skills */}
//     <div className="col-span-1 md:col-span-2">
//       <label className="text-sm text-gray-300 mb-1 block">Skills</label>
//       <textarea
//         {...register("skills")}
//         placeholder="Comma separated skills like React, Node.js, AWS"
//         className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
//         rows={3}
//       />
//     </div>

//     {/* Target Role */}
//     <div className="col-span-1 md:col-span-2">
//       <label className="text-sm text-gray-300 mb-1 block">Target Role</label>
//       <input
//         {...register("target_role", { required: true })}
//         placeholder="Frontend Developer, DevOps Engineer, etc."
//         className="w-full bg-[#0f172a] text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
//       />
//     </div>
//   </div>

//   {/* Submit Button */}
//   <button
//     type="submit"
//     className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-500 transition rounded-lg font-semibold text-white shadow-md"
//   >
//     Submit Resume
//   </button>
// </div>

//     ),
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center px-4 py-12">
//       <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl w-full">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentStep}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.3 }}
//             className={`bg-gray-950 rounded-2xl p-6 shadow-xl border border-gray-700 ${
//               shake ? "animate-shake" : ""
//             }`}
//           >
//             {sectionUI[sections[currentStep]]}
//             <div className="flex justify-between items-center mt-6">
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="text-sm text-gray-400 hover:text-teal-400"
//               >
//                 ← Back
//               </button>
//               {currentStep < sections.length - 1 && (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="text-sm text-teal-400 hover:text-teal-300 font-medium"
//                 >
//                   Next →
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </form>
//     </div>
//   );
// };

// export default ResumeBuilder;
