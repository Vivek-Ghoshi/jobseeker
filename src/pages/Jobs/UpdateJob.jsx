import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateJob } from "../../redux/slices/employerSlice"; // replace with actual slice method
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UpdateJob = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await dispatch(updateJob({ id, data }));
    if (updateJob.fulfilled.match(res)) {
      setSuccess(true);
      setTimeout(() => navigate("/employer/created-jobs"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-[#1e293b] p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Update Job Posting
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Job Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Senior Software Developer"
              className="w-full bg-[#334155] text-white px-4 py-2 rounded-md border border-transparent focus:outline-none focus:border-cyan-500 transition"
            />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              placeholder="Enter job description..."
              rows={4}
              className="w-full bg-[#334155] text-white px-4 py-2 rounded-md border border-transparent focus:outline-none focus:border-cyan-500 transition"
            />
            {errors.description && (
              <p className="text-sm text-red-400 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-gray-300">Minimum Salary</label>
              <input
                type="number"
                {...register("salary_min", { required: "Minimum salary is required" })}
                placeholder="90000"
                className="w-full bg-[#334155] text-white px-4 py-2 rounded-md border border-transparent focus:outline-none focus:border-cyan-500 transition"
              />
              {errors.salary_min && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.salary_min.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-300">Maximum Salary</label>
              <input
                type="number"
                {...register("salary_max", { required: "Maximum salary is required" })}
                placeholder="130000"
                className="w-full bg-[#334155] text-white px-4 py-2 rounded-md border border-transparent focus:outline-none focus:border-cyan-500 transition"
              />
              {errors.salary_max && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.salary_max.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-md transition"
          >
            {isSubmitting ? "Updating..." : "Update Job"}
          </button>
        </form>
      </motion.div>

      {/* Success Popup */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50"
          >
            ✅ Job updated successfully! Redirecting...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpdateJob;
