import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CreateMeetingForm = ({ application, onClose, onCreate }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(application);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      scheduled_start: "",
      scheduled_end: "",
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      meeting_type: "INTERVIEW",
      application_id: application.id,
      job_id: application.job_id,
      participants: [application.job_seeker_id, application.employer_id],
    };

    onCreate(payload); // call the parent handler
    onClose(); // close the modal
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 text-white p-6 rounded-2xl w-full max-w-lg shadow-xl relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Create Interview Meeting</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Time</label>
              <input
                type="datetime-local"
                {...register("scheduled_start", { required: "Start time is required" })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.scheduled_start && (
                <p className="text-red-400 text-sm mt-1">{errors.scheduled_start.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Time</label>
              <input
                type="datetime-local"
                {...register("scheduled_end", { required: "End time is required" })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              {errors.scheduled_end && (
                <p className="text-red-400 text-sm mt-1">{errors.scheduled_end.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Schedule Interview
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateMeetingForm;
