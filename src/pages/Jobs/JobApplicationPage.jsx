import { useForm } from "react-hook-form";
import {
  FileText,
  SendHorizonal,
  AlignLeft,
  Loader2,
  UploadCloud,
  GraduationCap,
  Briefcase,
  Star,
} from "lucide-react";
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

  const { resumeDetails, uploadedResumeUrl } = useSelector(
    (state) => state.resumebuilder
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [submitted, setSubmitted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [resumeName, setResumeName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoFill, setAutoFill] = useState(false);

  useEffect(() => {
    if (resumeDetails) {
      setAutoFill(true);
      setTimeout(() => {
        setValue(
          "full_name",
          `${resumeDetails.first_name} ${resumeDetails.last_name}`
        );
        setValue("email", resumeDetails.email);
        setValue("phone_number", resumeDetails.phone_number);
        setValue("skills", resumeDetails.profile?.skills?.join(", "));
        setValue("education", resumeDetails.education?.join("\n"));
        setValue("experience", resumeDetails.profile?.experience_years || "");
        setAutoFill(false);
      }, 1000);
    }
  }, [resumeDetails, setValue]);

  const handleResumeView = async () => {
    setIsLoading(true);
    const res = await dispatch(getResumeURL());
    setIsLoading(false);

    if (getResumeURL.fulfilled.match(res)) {
      const payload = res.payload;
      if (!payload?.resume_url) {
        setUploadMessage("You have not uploaded a resume yet.");
        setShowUpload(true);
      } else {
        setResumeName(payload.resume_filename || "Resume");
        window.open(payload.resume_url, "_blank");
      }
    } else {
      setUploadMessage("Error retrieving resume. Please upload.");
      setShowUpload(true);
    }
  };

  const handleChangeResume = () => {
    setUploadMessage("You can upload a new resume below.");
    setShowUpload(true);
    setAutoFill(true);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const res = await dispatch(getResumeURL());
    setIsLoading(false);

    const resume_url = res.payload?.resume_url || uploadedResumeUrl;

    if (!resume_url) {
      setUploadMessage("You have not uploaded a resume yet.");
      setShowUpload(true);
      return;
    }

    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("cover_letter", data.cover_letter.trim());
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    formData.append("skills", data.skills);
    formData.append("education", data.education);
    formData.append("experience", data.experience);
    
    const result = await dispatch(createApplication(formData));
    if (createApplication.fulfilled.match(result)) {
      setSubmitted(true);
      navigate("/jobs/all");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center pt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-full max-w-4xl bg-[#111827] rounded-xl shadow-2xl border border-sky-700/30 p-6 sm:p-10 space-y-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <AlignLeft className="w-6 h-6 text-sky-500" />
            Job Application
          </h1>
          {autoFill && (
            <div className="flex items-center text-sm text-gray-400 gap-2 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Autofilling from resume...
            </div>
          )}
          <div className="flex gap-2">
            {resumeDetails ? (
              <>
                <button
                  onClick={handleResumeView}
                  className="bg-sky-700 hover:bg-sky-600 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" /> Opening...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      View Resume
                    </>
                  )}
                </button>
                <button
                  onClick={handleChangeResume}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  Change Resume
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowUpload(true)}
                className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Resume
              </button>
            )}
          </div>
        </div>

        {uploadMessage && (
          <p className="text-red-400 text-sm -mt-4">{uploadMessage}</p>
        )}

        {showUpload && (
          <div className="mt-4">
            <UploadResume onClose={() => setShowUpload(false)} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">Full Name</label>
              <input
                {...register("full_name", { required: "Name is required" })}
                className="w-full bg-[#0f172a] border border-sky-600 rounded-md p-3 text-white placeholder:text-gray-400"
                placeholder="Your Name"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.full_name?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input
                {...register("email", { required: "Email is required" })}
                className="w-full bg-[#0f172a] border border-sky-600 rounded-md p-3 text-white placeholder:text-gray-400"
                placeholder="Email"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Phone Number
              </label>
              <input
                {...register("phone_number", {
                  required: "Phone number is required",
                })}
                className="w-full bg-[#0f172a] border border-sky-600 rounded-md p-3 text-white placeholder:text-gray-400"
                placeholder="Phone Number"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.phone_number?.message}
              </p>
            </div>

            <div>
              <label className="custom-scrollbar text-sm font-medium block mb-1 flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-sky-400" /> Education
              </label>
              <textarea
                {...register("education")}
                rows={3}
                className="custom-scrollbar w-full bg-[#0f172a] border border-sky-600 rounded-md p-3 text-white placeholder:text-gray-400"
                placeholder="List your education here"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-sky-400" /> Experience
              </label>
              <textarea
                {...register("experience")}
                rows={5}
                className="custom-scrollbar w-full bg-[#0f172a] border border-sky-600 rounded-md p-3 text-white placeholder:text-gray-400"
                placeholder="Your experience details"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-sky-400" /> Skills (comma saperated)
              </label>
              <input
                {...register("skills")}
                className="w-full bg-[#0f172a] border border-sky-600 rounded-md p-3 text-white placeholder:text-gray-400"
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Cover Letter
            </label>
            <textarea
              {...register("cover_letter", {
                required: "Cover letter is required",
                validate: (value) =>
                  value.trim().split(/\s+/).length <= 2000 ||
                  "Word limit exceeded (2000)",
              })}
              rows={6}
              className="custom-scrollbar w-full bg-[#0f172a] border border-sky-600 rounded-md p-4 text-sm text-white placeholder:text-gray-400"
              placeholder="Write your cover letter here..."
            ></textarea>
            <p className="text-red-500 text-xs mt-1">
              {errors.cover_letter?.message}
            </p>
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SendHorizonal className="w-4 h-4" />
              Submit Application
            </motion.button>
          </div>
        </form>

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

