import { User, FileText, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplicantResume,
  getApplication,
  updateApplicationStatus,
} from "../../redux/slices/employerSlice";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";

const ViewApplicationPage = () => {
  const { id: appId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedApplication, applicantResume } = useSelector(
    (state) => state.employer
  );
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownLoading] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoadingApp(true);
        setError(null);
        const result = await dispatch(getApplication(appId));
        if (!getApplication.fulfilled.match(result)) {
          throw new Error("Failed to fetch application");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoadingApp(false);
      }
    };

    fetchApp();
  }, [dispatch, appId]);

  useEffect(() => {
    if (status) {
      setLoadingStatus(true);
      dispatch(updateApplicationStatus({ id: appId, data: { status } }))
        .then((res) => {
          if (updateApplicationStatus.fulfilled.match(res)) {
            setLoadingStatus(false);
          }
        })
        .catch(() => setLoadingStatus(false));
    }
  }, [status]);

  //resume downloadHandler
  const resumeDownloadHandler = async (appId) => {
    try {
      setDownLoading(true);
      const res = await dispatch(getApplicantResume(appId));
      if (getApplicantResume.fulfilled.match(res)) {
        const { resume_url, resume_filename } = res.payload;

        // Fetch the file as a blob
        const response = await fetch(resume_url);
        const blob = await response.blob();

        // Create a blob URL and force download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = resume_filename || "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert("failed to fetch resume");
      }
    } catch (error) {
      console.error("Error downloading resume : ", error);
    } finally {
      setTimeout(() => setDownLoading(false), 1000);
    }
  };
  if (loadingApp) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p className="text-cyan-400 animate-pulse text-lg">
          Loading Application...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-black text-white px-4 py-10 flex justify-center items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-2xl bg-[#1e293b] rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-cyan-700/30">
        <div className="w-full h-20 flex  items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <User className="w-6 h-6 text-zinc-200" />
            Application Details
          </h1>
          <div className="w-1/2 h-full flex items-end flex-col gap-2">
          <button onClick={navigate('/sheduled/interviews')} className="px-3 py-2 bg-emerald-400 rounded-md font-semibold text-sm">
            Schedule Interview
          </button>
          <button className="px-3 py-2  bg-yellow-600 rounded-md font-semibold text-sm">
            Generate questions
          </button>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-auto bg-[#1e293b] text-white text-sm sm:text-base font-medium p-3 sm:p-2 rounded-md border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:border-cyan-400 transition duration-300 shadow-md hover:shadow-cyan-700/30"
          >
            <option value="">Update Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
            <option value="interview">Interview</option>
          </select>
          {loadingStatus && (
            <p className="text-sm text-cyan-400 mt-2">Updating status...</p>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-cyan-400 w-5 h-5" />
            <p className="text-gray-400 text-sm">Cover Letter</p>
          </div>
          <motion.div
            className={`relative text-white font-normal text-sm md:text-base transition-all duration-300 ${
              expanded ? "max-h-[300px] overflow-y-auto pr-2" : "line-clamp-6"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selectedApplication?.cover_letter || "No cover letter provided."}
          </motion.div>
          <button
            className="mt-3 text-cyan-400 text-sm hover:text-cyan-300 underline transition"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show Less" : "See More"}
          </button>
        </div>

        {/* Resume Download */}
        <div className="flex justify-between items-center border-t border-cyan-800 pt-5 mt-6">
          <p className="text-sm text-gray-400">Resume</p>
          {selectedApplication ? (
            <button
              onClick={() => resumeDownloadHandler(selectedApplication.id)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-cyan-500 transition duration-200 flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Resume
                </>
              )}
            </button>
          ) : (
            <span className="text-red-400 text-sm">Resume not available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ViewApplicationPage;
