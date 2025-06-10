import {
  User,
  FileText,
  Download,
  Loader2,
  Mail,
  Phone,
  BookOpen,
  Award,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplicantResume,
  getApplication,
  updateApplicationStatus,
} from "../../redux/slices/employerSlice";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import CreateMeetingForm from "../Interview/CreateMeetingForm";
import {
  createTimeSlots,
  scheduleInterview,
} from "../../redux/slices/interviewSlice";
import CreateTimeSlots from "../timeSlots/CreateTimeSlots";

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
  const [showScheduleInterviewModal, setShowScheduleInterviewModal] =
    useState(false);
  const [showCreateTimeSlotsModal, setShowCreateTimeSlotsModal] =
    useState(false);
  const [statusAlert, setStatusAlert] = useState(false);

  // Fetch application and set initial status
  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoadingApp(true);
        setError(null);
        const result = await dispatch(getApplication(appId));
        if (!getApplication.fulfilled.match(result)) {
          throw new Error("Failed to fetch application");
        } else {
          const fetchedStatus = result.payload?.status || "";
          setStatus(fetchedStatus); // Set status from API
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoadingApp(false);
      }
    };

    fetchApp();
  }, [dispatch, appId]);

  // Update status if changed
  useEffect(() => {
    if (status && status !== selectedApplication?.status) {
      setLoadingStatus(true);
      dispatch(updateApplicationStatus({ id: appId, data: { status } }))
        .then((res) => {
          if (updateApplicationStatus.fulfilled.match(res)) {
            setLoadingStatus(false);
          }
        })
        .catch(() => setLoadingStatus(false));
    }
  }, [status, appId, dispatch, selectedApplication?.status]);

  const handleCreateTimeSlot = () => {
    if ((status || selectedApplication?.status) !== "interview") {
      return setStatusAlert(true);
    }
    setShowCreateTimeSlotsModal(true);
  };

  const handleFormSubmit = async (data) => {
    await dispatch(createTimeSlots(data));
    setShowCreateTimeSlotsModal(false);
  };

  const createHandler = async (payload) => {
    if ((status || selectedApplication?.status) !== "interview") {
      return setStatusAlert(true);
    }
    try {
      const res = await dispatch(scheduleInterview(payload));
      if (scheduleInterview.fulfilled.match(res)) {
        navigate("/scheduled/interviews"); // Corrected typo here
      }
    } catch (error) {
      console.error("createHandler : ", error);
    }
  };
  const applicant = selectedApplication; 

  const resumeDownloadHandler = async (appId) => {
    try {
      setDownLoading(true);
      window.open(applicant.resume_url,"_blank");
    } catch (error) {

      console.error("Error downloading resume : ", error);
    } finally {
      setTimeout(() => setDownLoading(false), 1000);
    }
  };

  if (loadingApp) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <Loader2 className="animate-spin w-8 h-8 text-cyan-400 mr-3" />
        <p className="text-cyan-400 text-lg">Loading Application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-red-500">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }


  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white px-4 py-10 flex justify-center items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-4 md:mb-0">
            <User className="w-8 h-8 text-purple-400" />
            Applicant Details
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                status === "interview"
                  ? setShowScheduleInterviewModal(true)
                  : setStatusAlert(true)
              }
              className="px-5 py-2 bg-emerald-600 rounded-lg font-semibold text-white shadow-md hover:bg-emerald-700 transition duration-300 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" /> Schedule Interview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateTimeSlot}
              className="px-5 py-2 bg-yellow-600 rounded-lg font-semibold text-white shadow-md hover:bg-yellow-700 transition duration-300 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" /> Create Time Slots
            </motion.button>
          </div>
        </div>

        {statusAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center space-y-6 border border-red-500">
              <p className="text-white text-xl font-bold">
                Please update status to{" "}
                <span className="text-cyan-400">Interview</span> first.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusAlert(false)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition duration-300 shadow-lg"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}

        {showScheduleInterviewModal && (
          <CreateMeetingForm
            onClose={() => setShowScheduleInterviewModal(false)}
            application={selectedApplication}
            onCreate={createHandler}
          />
        )}

        {showCreateTimeSlotsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8"
            >
              <CreateTimeSlots
                details={selectedApplication}
                onSubmit={handleFormSubmit}
              />
              <button
                onClick={() => setShowCreateTimeSlotsModal(false)}
                className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition duration-300"
              >
                ×
              </button>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Applicant Info */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-400" />
              Applicant Information
            </h2>
            <p className="text-gray-300 mb-2">
              <strong className="text-white">Full Name:</strong>{" "}
              {applicant?.fullname || "N/A"}
            </p>
            <p className="text-gray-300 mb-2">
              <strong className="text-white flex items-center gap-1">
                <Mail className="w-4 h-4" /> Email:
              </strong>{" "}
              {applicant?.email || "N/A"}
            </p>
            <p className="text-gray-300 mb-2">
              <strong className="text-white flex items-center gap-1">
                <Phone className="w-4 h-4" /> Phone:
              </strong>{" "}
              {applicant?.phone_number || "N/A"}
            </p>
            <p className="text-gray-300 mb-2">
              <strong className="text-white">Years of Experience:</strong>{" "}
              {applicant?.experience_years !== null
                ? applicant?.experience_years
                : "N/A"}
            </p>
            <p className="text-gray-300 mb-2">
              <strong className="text-white">Applied On:</strong>{" "}
              {applicant?.created_at
                ? new Date(applicant.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {/* Application Status */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" />
              Application Status
            </h2>
            <label className="block text-sm text-gray-400 mb-2">
              Update Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-900 text-white text-base font-medium p-3 rounded-lg border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:border-purple-400 transition duration-300 shadow-md appearance-none pr-10"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="interview">Interview</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {loadingStatus && (
              <p className="text-sm text-cyan-400 mt-3 flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Updating status...
              </p>
            )}
            <p className="text-gray-400 text-sm mt-3">
              Current Status:{""}
              <span className="text-purple-300 font-semibold capitalize">
                {selectedApplication?.status || "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8 bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-lime-400" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {applicant?.skills && applicant.skills.length > 0 ? (
              applicant.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  className="bg-purple-700 text-white text-sm px-4 py-1 rounded-full shadow-md hover:bg-purple-600 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.span>
              ))
            ) : (
              <p className="text-gray-400">No skills listed.</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8 bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Education
          </h2>
          <ul className="list-disc list-inside text-gray-300">
            {applicant?.education && applicant.education.length > 0 ? (
              applicant.education.map((edu, index) => (
                <li key={index} className="mb-1">
                  {edu}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No education details provided.</p>
            )}
          </ul>
        </div>

        {/* Cover Letter */}
        <div className="mb-8 bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="text-cyan-400 w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Cover Letter</h2>
          </div>
          <motion.div
            className={`relative text-gray-200 font-light text-base leading-relaxed transition-all duration-500 ${
              expanded ? "max-h-96 overflow-y-auto pr-2" : "line-clamp-6"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {applicant?.cover_letter || "No cover letter provided."}
          </motion.div>
          {applicant?.cover_letter &&
            applicant.cover_letter.split(" ").length > 50 && ( // Simple check to decide if "See More" is needed
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 text-cyan-400 text-sm hover:text-cyan-300 underline transition-colors duration-300 font-semibold"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Show Less" : "See More"}
              </motion.button>
            )}
        </div>
        
        {/* Resume Download */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-600 pt-6 mt-8">
          <p className="text-lg text-gray-300 mb-4 sm:mb-0">
            Applicant's Resume
          </p>
          {selectedApplication ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => resumeDownloadHandler(selectedApplication.id)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-purple-700 transition duration-300 flex items-center gap-3 shadow-lg"
            >
              {downloading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Resume
                </>
              )}
            </motion.button>
          ) : (
            <span className="text-red-400 text-base font-semibold">
              Resume not available
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ViewApplicationPage;



// import { User, FileText, Download, Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getApplicantResume,
//   getApplication,
//   updateApplicationStatus,
// } from "../../redux/slices/employerSlice";
// import { useNavigate, useParams } from "react-router";
// import { motion } from "framer-motion";
// import CreateMeetingForm from "../Interview/CreateMeetingForm";
// import { createTimeSlots, scheduleInterview } from "../../redux/slices/interviewSlice";
// import CreateTimeSlots from "../timeSlots/CreateTimeSlots";

// const ViewApplicationPage = () => {
//   const { id: appId } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { selectedApplication, applicantResume } = useSelector(
//     (state) => state.employer
//   );

//   const [status, setStatus] = useState("");
//   const [expanded, setExpanded] = useState(false);
//   const [loadingStatus, setLoadingStatus] = useState(false);
//   const [loadingApp, setLoadingApp] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloading, setDownLoading] = useState(false);
//   const [show, setShow] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [statusAlert, setStatusAlert] = useState(false);

//   // Fetch application and set initial status
//   useEffect(() => {
//     const fetchApp = async () => {
//       try {
//         setLoadingApp(true);
//         setError(null);
//         const result = await dispatch(getApplication(appId));
//         if (!getApplication.fulfilled.match(result)) {
//           throw new Error("Failed to fetch application");
//         } else {
//           const fetchedStatus = result.payload?.status || "";
//           setStatus(fetchedStatus); // Set status from API
//         }
//       } catch (err) {
//         setError(err.message || "Something went wrong.");
//       } finally {
//         setLoadingApp(false);
//       }
//     };

//     fetchApp();
//   }, [dispatch, appId]);

//   // Update status if changed
//   useEffect(() => {
//     if (status && status !== selectedApplication?.status) {
//       setLoadingStatus(true);
//       dispatch(updateApplicationStatus({ id: appId, data: { status } }))
//         .then((res) => {
//           if (updateApplicationStatus.fulfilled.match(res)) {
//             setLoadingStatus(false);
//           }
//         })
//         .catch(() => setLoadingStatus(false));
//     }
//   }, [status]);

//   const handleCreateTimeSlot = () => {
//     if ((status || selectedApplication?.status) !== "interview") {
//       return setStatusAlert(true);
//     }
//     setShowForm(true);
//   };

//   const handleFormSubmit = async (data) => {
//     await dispatch(createTimeSlots(data));
//     setShowForm(false);
//   };

//   const createHandler = async (payload) => {
//     if ((status || selectedApplication?.status) !== "interview") {
//       return setStatusAlert(true);
//     }
//     try {
//       const res = await dispatch(scheduleInterview(payload));
//       if (scheduleInterview.fulfilled.match(res)) {
//         navigate("/sheduled/interviews");
//       }
//     } catch (error) {
//       console.error("createHandler : ", error);
//     }
//   };

//   const resumeDownloadHandler = async (appId) => {
//     try {
//       setDownLoading(true);
//       const res = await dispatch(getApplicantResume(appId));
//       if (getApplicantResume.fulfilled.match(res)) {
//         const { resume_url, resume_filename } = res.payload;
//         const response = await fetch(resume_url);
//         const blob = await response.blob();
//         const blobUrl = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = blobUrl;
//         link.download = resume_filename || "resume.pdf";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(blobUrl);
//       } else {
//         alert("Failed to fetch resume");
//       }
//     } catch (error) {
//       console.error("Error downloading resume : ", error);
//     } finally {
//       setTimeout(() => setDownLoading(false), 1000);
//     }
//   };

//   if (loadingApp) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-black text-white">
//         <p className="text-cyan-400 animate-pulse text-lg">
//           Loading Application...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-black text-red-500">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="min-h-screen bg-black text-white px-4 py-10 flex justify-center items-start"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="w-full max-w-2xl bg-[#1e293b] rounded-xl shadow-lg p-6 md:p-8">
//         <div className="w-full h-20 flex items-center justify-between">
//           <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
//             <User className="w-6 h-6 text-zinc-200" />
//             Application Details
//           </h1>
//           <div className="w-1/2 h-full flex items-end flex-col gap-2">
//             <button
//               onClick={() => (status === "interview" ? setShow(true) : setStatusAlert(true))}
//               className="px-3 py-2 bg-emerald-400 rounded-md font-semibold text-sm"
//             >
//               Schedule Interview
//             </button>
//             <button
//               onClick={handleCreateTimeSlot}
//               className="px-3 py-2 bg-yellow-600 rounded-md font-semibold text-sm"
//             >
//               Create Time Slots
//             </button>
//           </div>
//         </div>

//         {statusAlert && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//             <div className="bg-[#1e293b] p-6 rounded-xl shadow-md text-center space-y-4">
//               <p className="text-white text-lg font-semibold">
//                 Please update status to <span className="text-cyan-400">Interview</span> first.
//               </p>
//               <button
//                 onClick={() => setStatusAlert(false)}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {show && (
//           <CreateMeetingForm
//             onClose={() => setShow(false)}
//             application={selectedApplication}
//             onCreate={createHandler}
//           />
//         )}

//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//             <div className="relative">
//               <CreateTimeSlots details={selectedApplication} onSubmit={handleFormSubmit} />
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mb-6 mt-6">
//           <label className="block text-sm text-gray-400 mb-1">Status</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full sm:w-auto bg-[#1e293b] text-white text-sm sm:text-base font-medium p-3 sm:p-2 rounded-md border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:border-cyan-400 transition duration-300 shadow-md"
//           >
//             <option value="">Update Status</option>
//             <option value="pending">Pending</option>
//             <option value="reviewed">Reviewed</option>
//             <option value="rejected">Rejected</option>
//             <option value="accepted">Accepted</option>
//             <option value="interview">Interview</option>
//           </select>
//           {loadingStatus && (
//             <p className="text-sm text-cyan-400 mt-2">Updating status...</p>
//           )}
//         </div>

//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-2">
//             <FileText className="text-cyan-400 w-5 h-5" />
//             <p className="text-gray-400 text-sm">Cover Letter</p>
//           </div>
//           <motion.div
//             className={`relative text-white font-normal text-sm md:text-base transition-all duration-300 ${
//               expanded ? "max-h-[300px] overflow-y-auto pr-2" : "line-clamp-6"
//             }`}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             {selectedApplication?.cover_letter || "No cover letter provided."}
//           </motion.div>
//           <button
//             className="mt-3 text-cyan-400 text-sm hover:text-cyan-300 underline transition"
//             onClick={() => setExpanded((prev) => !prev)}
//           >
//             {expanded ? "Show Less" : "See More"}
//           </button>
//         </div>

//         <div className="flex justify-between items-center border-t border-cyan-800 pt-5 mt-6">
//           <p className="text-sm text-gray-400">Resume</p>
//           {selectedApplication ? (
//             <button
//               onClick={() => resumeDownloadHandler(selectedApplication.id)}
//               className="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-cyan-500 transition duration-200 flex items-center gap-2"
//             >
//               {downloading ? (
//                 <>
//                   <Loader2 className="animate-spin w-4 h-4" />
//                   Downloading...
//                 </>
//               ) : (
//                 <>
//                   <Download className="w-4 h-4" />
//                   Download Resume
//                 </>
//               )}
//             </button>
//           ) : (
//             <span className="text-red-400 text-sm">Resume not available</span>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ViewApplicationPage;


