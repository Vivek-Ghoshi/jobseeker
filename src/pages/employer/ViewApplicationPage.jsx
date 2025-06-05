import { User, FileText, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplication,
  updateApplicationStatus,
} from "../../redux/slices/employerSlice";
import { useParams } from "react-router";

const ViewApplicationPage = () => {
  const { id: appId } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { selectedApplication } = useSelector((state) => state.employer);

  useEffect(() => {
    dispatch(getApplication(appId));
  }, [dispatch]);

  useEffect(() => {
    if (status) {
      setLoading(true);
      handleUpdate();
    }
  }, [dispatch,status]);

  const handleUpdate = async () => {
    const res = await dispatch(
      updateApplicationStatus({ id: appId, data: { status } })
    );
    if (updateApplicationStatus.fulfilled.match(res)) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#1e293b] rounded-xl shadow-lg p-6 md:p-10 transition-all duration-300 hover:shadow-cyan-700/30">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          <User className="w-7 h-7 text-cyan-500" />
          Application Details
        </h1>

        {/* Applicant Info */}
        {/* <div className="mb-6">
          <p className="text-gray-400 text-sm">Candidate Name</p>
          <p className="text-white font-medium text-lg">
            {application.applicant_name}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Mail className="text-cyan-400 w-5 h-5" />
            <p className="text-white font-medium">{application.email}</p>
          </div>
        </div> */}

        {/* Status Dropdown */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full md:w-1/2 bg-[#334155] text-white p-2 rounded-md border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
            <option value="interview">Interview</option>
          </select>
          {loading && (
            <p className="text-sm text-cyan-400 mt-2">Updating status...</p>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-cyan-400 w-5 h-5" />
            <p className="text-gray-400 text-sm">Cover Letter</p>
          </div>

          <div
            className={`relative text-white font-normal text-sm md:text-base transition-all duration-300 ${
              expanded ? "max-h-[300px] overflow-y-auto pr-2" : "line-clamp-6"
            }`}
          >
            {selectedApplication.cover_letter}
          </div>

          {/* See More / Less Button */}
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
          <a
            href={selectedApplication.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-cyan-500 transition duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationPage;
