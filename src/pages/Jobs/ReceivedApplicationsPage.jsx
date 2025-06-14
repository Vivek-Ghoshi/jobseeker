import {
  FileText,
  MailOpen,
  User,
  Download,
  Eye,
  GaugeCircle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import {
  getApplicantResume,
  listApplicationsForJob,
  scoreApplicationResume,
} from "../../redux/slices/employerSlice";
import { useNavigate, useParams } from "react-router";

const ReceivedApplicationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const { applications = [], scores = [] } = useSelector((state) => state.employer);
  const [loadingId, setLoadingId] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");

  const scoreMap = useMemo(() => {
    const map = {};
    scores.forEach(({ application_id, overall_score }) => {
      map[application_id] = overall_score;
    });
    return map;
  }, [scores]);

  useEffect(() => {
    dispatch(listApplicationsForJob(jobId));
  }, [dispatch, jobId]);

  const getScore = async (applicationId) => {
    try {
      setLoadingId(applicationId);
      const res = await dispatch(scoreApplicationResume(applicationId));
      if (scoreApplicationResume.fulfilled.match(res)) {
        navigate("/employer/resume-score");
      }
    } catch (err) {
      console.error("Failed to get score", err);
      alert("Failed to fetch resume score.");
    } finally {
      setLoadingId(null);
    }
  };


  const sortedApplications = useMemo(() => {
    const withScores = [...applications];
    if (sortOrder === "high") {
      return withScores.sort(
        (a, b) => (scoreMap[b.id] ?? -1) - (scoreMap[a.id] ?? -1)
      );
    } else if (sortOrder === "low") {
      return withScores.sort(
        (a, b) => (scoreMap[a.id] ?? -1) - (scoreMap[b.id] ?? -1)
      );
    }
    return withScores;
  }, [applications, scoreMap, sortOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10 flex items-center gap-3 justify-center">
        <MailOpen className="w-7 h-7 text-cyan-500" />
        Received Job Applications
      </h1>

      {/* Sort Filter */}
      <div className="flex justify-center mb-8">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-md border border-cyan-700 focus:outline-none"
        >
          <option value="default">Sort by</option>
          <option value="high">Score: High to Low</option>
          <option value="low">Score: Low to High</option>
        </select>
      </div>

      <div className="space-y-8 max-w-6xl mx-auto">
        {sortedApplications.length > 0 ? (
          sortedApplications.map((app) => {
            const score = scoreMap[app.id];
            return (
              <div
                key={app.id}
                className="bg-[#1e293b] border border-cyan-700 rounded-xl shadow-lg p-6 md:p-8 hover:shadow-cyan-600/30 transition-all duration-300"
              >
                 <div className="w-full mb-3 ml-2">
              <button
                onClick={() => navigate(`/application/${app.id}/evaluate`)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-400 transition-all text-white text-md font-semibold shadow-md hover:shadow-emerald-400/50"
              >
                Suitability
              </button>
            </div>
                <div className="flex flex-col gap-5">
                  {/* Name & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="text-cyan-400 w-5 h-5" />
                      <p className="text-xl font-semibold text-cyan-300">
                        {app.job_seeker_name}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 capitalize rounded-full text-xs font-semibold text-white
                        ${
                          app.status === "REVIEWED"
                            ? "bg-emerald-700"
                            : app.status === "REJECTED"
                            ? "bg-red-700 text-red-400"
                            : "bg-yellow-700"
                        }`}
                    >
                      {app.status}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="flex items-start gap-3">
                    <FileText className="text-cyan-400 w-5 h-5 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Cover Letter</p>
                      <p className="text-white font-normal text-sm md:text-base line-clamp-5">
                        {app.cover_letter}
                      </p>
                    </div>
                  </div>
        
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-between gap-4 mt-4">
                    <button
                      onClick={() => navigate(`/application/${app.id}`)}
                      className="bg-cyan-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-cyan-500 transition duration-200 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Application
                    </button>

                    <button
                      onClick={() => getScore(app.id)}
                      disabled={loadingId === app.id}
                      className="bg-teal-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-teal-500 transition duration-200 flex items-center gap-2"
                    >
                      {loadingId === app.id ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          Scoring...
                        </>
                      ) : (
                        <>
                          <GaugeCircle className="w-4 h-4" />
                          Get Resume Score
                        </>
                      )}
                    </button>
                  </div>

                  {/* Score Display */}
                  {typeof score === "number" ? (
                    <div className="mt-3 text-sm text-cyan-400 font-semibold">
                      Resume Score: <span className="text-white">{score}</span>/100
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-gray-500 italic">
                      Resume score not available.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No applications received yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReceivedApplicationsPage;



// import {
//   FileText,
//   MailOpen,
//   User,
//   Download,
//   Eye,
//   GaugeCircle,
//   Loader2,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   getApplicantResume,
//   listApplicationsForJob,
//   scoreApplicationResume,
// } from "../../redux/slices/employerSlice";
// import { useNavigate, useParams } from "react-router";

// const ReceivedApplicationsPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id: jobId } = useParams();
//   const { applications,scores} = useSelector(
//     (state) => state.employer
//   );
//   console.log(scores);
//   const [loadingId, setLoadingId] = useState(null);

//   useEffect(() => {
//     console.log("useEffect chala")
//     dispatch(listApplicationsForJob(jobId));
//   }, [dispatch]);

//   const getScore = async (applicationId) => {
//     try {
//       setLoadingId(applicationId);
//       const res = await dispatch(scoreApplicationResume(applicationId));
//       if (scoreApplicationResume.fulfilled.match(res)) {
//         navigate("/employer/resume-score");
//       }
//     } catch (err) {
//       console.error("Failed to get score", err);
//       alert("Failed to fetch resume score.");
//     } finally {
//       setLoadingId(null);
//     }
//   };
//   const resumeUrlHandler = async (id) => {
//     const res = await dispatch(getApplicantResume(id));
//     if (getApplicantResume.fulfilled.match(res)) {
//       const url = res.payload;
//       if(url){
//         window.open(url, "_blank");
//       }
//     } else {
//       throw new Error("resume fetched failed");
//     }
//   };
//   return (
//     <div className="min-h-screen bg-black text-white px-4 py-10">
//       <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10 flex items-center gap-3 justify-center">
//         <MailOpen className="w-7 h-7 text-cyan-500" />
//         Received Job Applications
//       </h1>

//       <div className="space-y-8 max-w-6xl mx-auto">
//         {applications?.length > 0 ? (
//           applications.map((app) => (
//             <div
//               key={app.id}
//               className="bg-[#1e293b] border border-cyan-700 rounded-xl shadow-lg p-6 md:p-8 hover:shadow-cyan-600/30 transition-all duration-300"
//             >
//               <div className="flex flex-col gap-5">
//                 {/* Name & Status */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <User className="text-cyan-400 w-5 h-5" />
//                     <p className="text-xl font-semibold text-cyan-300">
//                       {app.job_seeker_name}
//                     </p>
//                   </div>
//                   <div
//                     className={`px-3 py-1 capitalize rounded-full text-xs font-semibold text-white font-semibold
//                     ${
//                       app.status === "REVIEWED"
//                         ? "bg-emerald-700 "
//                         : app.status === "REJECTED"
//                         ? "bg-red-700 text-red-400 "
//                         : "bg-yellow-700 "
//                     }`}
//                   >
//                     {app.status}
//                   </div>
//                 </div>

//                 {/* Cover Letter */}
//                 <div className="flex items-start gap-3">
//                   <FileText className="text-cyan-400 w-5 h-5 mt-1" />
//                   <div>
//                     <p className="text-gray-400 text-sm mb-1">Cover Letter</p>
//                     <p className="text-white font-normal text-sm md:text-base line-clamp-5">
//                       {app.cover_letter}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Resume Link */}
//                 <div className="flex items-center gap-3">
//                   <Download className="text-cyan-400 w-5 h-5" />
//                   <button
//                     onClick={() => resumeUrlHandler(app.id)}
//                     className="text-emerald-400 underline hover:text-emerald-300 transition duration-200 text-sm md:text-base"
//                   >
//                     View Resume
//                   </button>
//                 </div>
//                 {/* Actions */}
//                 <div className="flex flex-wrap justify-between gap-4 mt-4">
//                   <button
//                     onClick={() => navigate(`/application/${app.id}`)}
//                     className="bg-cyan-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-cyan-500 transition duration-200 flex items-center gap-2"
//                   >
//                     <Eye className="w-4 h-4" />
//                     View Application
//                   </button>

//                   <button
//                     onClick={() => getScore(app.id)}
//                     disabled={loadingId === app.id}
//                     className="bg-teal-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-teal-500 transition duration-200 flex items-center gap-2"
//                   >
//                     {loadingId === app.id ? (
//                       <>
//                         <Loader2 className="animate-spin w-4 h-4" />
//                         Scoring...
//                       </>
//                     ) : (
//                       <>
//                         <GaugeCircle className="w-4 h-4" />
//                         Get Resume Score
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Score Display */}
//                 {/* {scores[app.id] !== undefined && (
//                   <div className="mt-3 text-sm text-cyan-400 font-semibold">
//                     Resume Score:{" "}
//                     <span className="text-white">{scores[app.id]}</span>/100
//                   </div>
//                 )} */}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-400">
//             No applications received yet.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReceivedApplicationsPage;
