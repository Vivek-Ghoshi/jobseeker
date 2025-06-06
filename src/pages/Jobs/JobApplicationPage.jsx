import { useForm } from "react-hook-form";
import { FileText, SendHorizonal, AlignLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createApplication } from "../../redux/slices/jobSeekerSlice";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import UploadResume from "../../components/UploadResume";
import { getResumeURL } from "../../redux/slices/resumeBuilderSlice";

const JobApplicationPage = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadedResumeUrl } = useSelector((state) => state.resumebuilder);
  const { error } = useSelector((state) => state.jobseeker);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [resumeName, setResumeName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const coverLetter = watch("cover_letter") || "";

  const onSubmit = async (data) => {
    const jobData = {
      job_id: jobId,
      cover_letter: data.cover_letter,
    };
    const res = await dispatch(createApplication(jobData));
    if (createApplication.fulfilled.match(res)) {
      navigate("/jobs/all");
      setSubmitted(true);
    } 
  };

  useEffect(() => {
    if (uploadedResumeUrl && showUpload) {
      if (
        typeof uploadedResumeUrl === "object" &&
        uploadedResumeUrl.resume_url
      ) {
        window.open(uploadedResumeUrl.resume_url, "_blank");
        setResumeName(uploadedResumeUrl.resume_filename || "Resume");
        setShowUpload(false);
        setUploadMessage("");
      }
    }
  }, [uploadedResumeUrl, showUpload]);

 const previewHandler = async () => {
  setIsLoading(true);
  const res = await dispatch(getResumeURL());
  

  // 👉 If the resume fetch fails with "Rejected"
  if (res.error?.message === "Rejected") {
    setIsLoading(false);
    setUploadMessage("You have not uploaded the resume yet. Please upload first.");
    setShowUpload(true);
    return;
  }

  // 👉 If resume fetch succeeds
  if (getResumeURL.fulfilled.match(res)) {
    if (!res.payload || !res.payload.resume_url) {
      setUploadMessage("You have not uploaded the resume yet. Please upload first.");
      setShowUpload(true);
    } else {
      setIsLoading(false);
      setResumeName(res.payload.resume_filename || "Resume");
      window.open(res.payload.resume_url, "_blank");
    }
  }
};

  return (
    <motion.div
      className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center items-start sm:items-center pt-10 sm:pt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {error && (
        <div className="bg-red-900 text-red-300 p-3 rounded-md text-center mb-4 border border-red-700">
          <h1>❌ Failed to apply: {error}</h1>
        </div>
      )}
      <motion.div
        className="w-full max-w-3xl bg-[#111827] rounded-xl shadow-2xl border border-sky-700/30 p-6 sm:p-10 space-y-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-4">
          <AlignLeft className="w-6 h-6 text-sky-500" />
          Job Application
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Cover Letter (max 2000 words)
            </label>
            <textarea
              {...register("cover_letter", {
                required: "Cover letter is required",
                validate: (value) =>
                  value.trim().split(/\s+/).length <= 2000 ||
                  "Word limit exceeded (2000)",
              })}
              className="w-full bg-[#0f172a] border border-sky-700 focus:ring-2 focus:ring-sky-500 rounded-md p-4 text-sm text-white placeholder:text-gray-500 resize-none h-60 transition duration-300"
              placeholder="Write your cover letter here..."
            ></textarea>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span className="text-red-500">
                {errors.cover_letter?.message}
              </span>
              <span>{coverLetter.trim().split(/\s+/).length} / 2000 words</span>
            </div>
          </div>

          {/* Resume Preview / Upload */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Your Resume
            </label>
            <div className="flex items-center justify-between bg-[#0f172a] p-4 rounded-md border border-sky-700">
              <div className="flex items-center gap-3 text-white">
                <FileText className="text-sky-500 w-5 h-5" />
                <span className="text-sm truncate max-w-[200px]">
                  {resumeName || "No resume selected"}
                </span>
              </div>
              <button
                type="button"
                onClick={previewHandler}
                className="text-xs sm:text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-md transition flex items-center gap-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    opening...
                  </>
                ) : (
                  "View"
                )}
              </button>
            </div>

            {showUpload && (
              <div className="mt-3 space-y-2">
                <p className="text-red-400 text-sm">{uploadMessage}</p>
                <UploadResume onClose={() => setShowUpload(false)}/>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SendHorizonal className="w-4 h-4" />
              Submit Application
            </motion.button>
          </div>
        </form>

        {/* Submission Success Message */}
        {submitted && (
          <motion.div
            className="mt-6 text-green-400 font-semibold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            ✅ Application Submitted Successfully!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default JobApplicationPage;

// import { useForm } from 'react-hook-form';
// import { FileText, SendHorizonal, AlignLeft } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createApplication } from '../../redux/slices/jobSeekerSlice';
// import { useNavigate } from 'react-router';
// import { motion } from 'framer-motion';

// const JobApplicationPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {uploadedResumeUrl} = useSelector(state=> state.resumebuilder);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();
//   const [submitted, setSubmitted] = useState(false);
//   const coverLetter = watch('cover_letter') || '';

//   const onSubmit = (data) => {
//     dispatch(createApplication(data));
//     navigate("/jobs/all");
//     setSubmitted(true);
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center items-start sm:items-center pt-10 sm:pt-0"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <motion.div
//         className="w-full max-w-3xl bg-[#111827] rounded-xl shadow-2xl border border-sky-700/30 p-6 sm:p-10 space-y-6"
//         initial={{ y: 40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: 'easeOut' }}
//       >
//         <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-4">
//           <AlignLeft className="w-6 h-6 text-sky-500" />
//           Job Application
//         </h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Cover Letter */}
//           <div>
//             <label className="text-sm font-medium text-gray-300 block mb-2">
//               Cover Letter (max 2000 words)
//             </label>
//             <textarea
//               {...register('cover_letter', {
//                 required: 'Cover letter is required',
//                 validate: (value) =>
//                   value.trim().split(/\s+/).length <= 2000 || 'Word limit exceeded (2000)',
//               })}
//               className="w-full bg-[#0f172a] border border-sky-700 focus:ring-2 focus:ring-sky-500 rounded-md p-4 text-sm text-white placeholder:text-gray-500 resize-none h-60 transition duration-300"
//               placeholder="Write your cover letter here..."
//             ></textarea>
//             <div className="flex justify-between mt-1 text-xs text-gray-400">
//               <span className="text-red-500">{errors.cover_letter?.message}</span>
//               <span>{coverLetter.trim().split(/\s+/).length} / 2000 words</span>
//             </div>
//           </div>

//           {/* Resume Preview */}
//           <div>
//             <label className="text-sm font-medium text-gray-300 block mb-2">Your Resume</label>
//             <div className="flex items-center justify-between bg-[#0f172a] p-4 rounded-md border border-sky-700">
//               <div className="flex items-center gap-3 text-white">
//                 <FileText className="text-sky-500 w-5 h-5" />
//                 <span className="text-sm truncate max-w-[200px]">
//                   {userProfile.resume_url.split('/').pop()}
//                 </span>
//               </div>
//               <a
//                 href={userProfile.resume_url}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-xs sm:text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded-md transition"
//               >
//                 View
//               </a>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <motion.button
//               type="submit"
//               className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <SendHorizonal className="w-4 h-4" />
//               Submit Application
//             </motion.button>
//           </div>
//         </form>

//         {/* Submission Success Message */}
//         {submitted && (
//           <motion.div
//             className="mt-6 text-green-400 font-semibold text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.4 }}
//           >
//             ✅ Application Submitted Successfully!
//           </motion.div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default JobApplicationPage;
