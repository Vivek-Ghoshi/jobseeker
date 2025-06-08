import {
  Pencil,
  Trash2,
  Briefcase,
  IndianRupee,
  Users,
  FileText,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteJob, listEmployerJobs } from "../../redux/slices/employerSlice";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion'

const truncateDescription = (text, wordLimit) =>
  text.split(" ").slice(0, wordLimit).join(" ") +
  (text.split(" ").length > wordLimit ? "..." : "");

const EmployerCreatedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs } = useSelector((state) => state.employer);
  useEffect(() => {
    dispatch(listEmployerJobs());
  }, [dispatch]);

  const deleteHandler = (id) => {
    dispatch(deleteJob(id));
  };
  return (
    <div className="min-h-screen bg-black px-4 py-10 flex flex-col gap-6 items-center">
      <h2 className="font-semibold capitalize text-blue-400 text-center text-lg md:text-xl">
        all job openings created by you...
      </h2>

      {jobs &&
        jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full  max-w-6xl backdrop-blur-md bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-800/40 rounded-2xl shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 p-4 sm:p-6 md:p-8 flex flex-col md:flex-col justify-between items-start md:items-center gap-6"
          >
            <div className="w-full">
              <button
                onClick={() => navigate(`/job/${job.id}/evaluations`)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-400 transition-all text-white text-md font-semibold shadow-md hover:shadow-emerald-400/50"
              >
                See Evaluation
              </button>
            </div>
            <div className="flex w-full">
            {/* Job Info */}
            <div className="flex-1 w-full space-y-2">
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-cyan-400 flex items-center gap-2 flex-wrap drop-shadow-lg">
                <Briefcase className="w-6 h-6 text-cyan-500" />
                {job.title}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mt-2">
                {truncateDescription(job.description, 20)}
              </p>
              <div className="flex items-center gap-2 mt-3 text-white text-sm">
                <IndianRupee className="text-cyan-400 w-4 h-4" />
                <span className="font-medium">
                  ₹{job.salary_min} - ₹{job.salary_max}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate(`/employer/update-job/${job.id}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-400 text-white text-sm font-semibold transition-all shadow-md hover:shadow-cyan-300/50"
              >
                <Pencil className="w-4 h-4" />
                Update
              </button>
              <button
                onClick={() =>
                  navigate(`/applications/report-card/all/${job.id}`)
                }
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-yellow-400 transition text-white text-sm font-semibold shadow-md hover:shadow-yellow-300/50"
              >
                <FileText className="w-4 h-4" />
                ReportCards
              </button>
              <button
                onClick={() => deleteHandler(job.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-md hover:shadow-red-400/50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => navigate(`/applications/employer/job/${job.id}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md hover:shadow-indigo-400/50"
              >
                <Users className="w-4 h-4" />
                View Applications
              </button>
            </div>
             </div>
          </motion.div>
        ))}
    </div>
  );
};

export default EmployerCreatedJobs;
