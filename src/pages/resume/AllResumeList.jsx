import { useEffect, useState } from "react";
import {
  FileText,
  FileDown,
  Eye,
  Trash2,
  Loader,
  AlertCircle,
  UploadCloud,
  File,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteResume,
  getResumeURL,
  getUserResumes,
} from "../../redux/slices/resumeBuilderSlice";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import UploadResume from "../../components/UploadResume";

const AllResumeList = () => {
  const dispatch = useDispatch();
  const { resumes, uploadedResumeUrl } = useSelector(
    (state) => state.resumebuilder
  );
  console.log(resumes[0].pdf_url);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [viewPdfUrl, setViewPdfUrl] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    try {
      dispatch(getUserResumes());
      dispatch(getResumeURL());
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    try {
      dispatch(deleteResume(resumeToDelete.id));
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("Failed to delete resume.");
    } finally {
      setResumeToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 md:px-12 relative">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10 text-center">
        <FileText className="inline-block w-8 h-8 mr-2 text-cyan-500" />
        My Resumes
      </h1>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader className="animate-spin w-8 h-8 text-cyan-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : (
        <>
          {/* Uploaded Resume Card */}
          <div className="mb-10">
            {uploadedResumeUrl ? (
              <div className="bg-[#1e293b] border border-cyan-700 rounded-xl p-6 shadow-md text-white max-w-xl mx-auto">
                <h2 className="text-xl font-bold text-cyan-400 mb-2">
                  <File className="inline-block w-5 h-5 mr-1" />
                  Uploaded Resume
                </h2>
                <p className="text-gray-400 mb-4">
                  Your uploaded resume is available for download/view.
                </p>
                <div className="flex gap-4">
                  <a
                    href={uploadedResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md text-white font-semibold transition"
                  >
                    Download Resume
                  </a>
                  <button
                    onClick={() => {
                      if (typeof uploadedResumeUrl === "string") {
                        console.log("chala");
                        setViewPdfUrl(uploadedResumeUrl);
                      }
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-md text-white font-semibold transition"
                  >
                    View Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-10">
                <button
                  onClick={() => setShowUploadPopup(true)}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 px-5 py-2 rounded-md text-white font-semibold transition"
                >
                  <UploadCloud className="w-5 h-5" />
                  Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* Resume Cards */}
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
              <AlertCircle className="w-12 h-12 text-cyan-600 mb-4" />
              <p className="text-lg">No resumes created by you yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-[#1e293b] border border-cyan-700 rounded-xl p-6 shadow-md hover:shadow-cyan-600/40 transition-all duration-300"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-cyan-300">
                      {resume.personal_info.full_name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {resume.target_role}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    <p>Email: {resume.personal_info.email}</p>
                    <p>Phone: {resume.personal_info.phone}</p>
                    <p>Location: {resume.personal_info.location}</p>
                  </div>
                  <p className="text-teal-400 text-xs mb-4 uppercase tracking-wide">
                    Template: {resume.template}
                  </p>

                  <div className="flex flex-col gap-2">
                    {resume.pdf_url && (
                      <button
                        onClick={() => {
                          if (typeof resume.pdf_url === "string") {
                            setViewPdfUrl(resume.pdf_url);
                          }
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Resume
                      </button>
                    )}
                    <a
                      href={resume.markdown_url}
                      download
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                    >
                      <FileDown className="w-4 h-4" />
                      Download Markdown
                    </a>
                    <button
                      onClick={() => setResumeToDelete(resume)}
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Resume Viewer Modal */}
      {viewPdfUrl && typeof viewPdfUrl === "string" && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] overflow-hidden relative">
            <button
              onClick={() => setViewPdfUrl(null)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
            >
              Close
            </button>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={viewPdfUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </div>
      )}

      {/* Upload Resume Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-cyan-600 rounded-xl p-6 max-w-lg w-full">
            <UploadResume onClose={() => setShowUploadPopup(false)} />
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {resumeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] border border-cyan-700 rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {resumeToDelete.personal_info.full_name}'s
              </span>{" "}
              resume?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setResumeToDelete(null)}
                className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllResumeList;

// import { useEffect, useState } from "react";
// import { FileText, FileDown, Eye, Trash2, Loader, AlertCircle } from "lucide-react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteResume, getResumeURL, getUserResumes } from "../../redux/slices/resumeBuilderSlice";

// const AllResumeList = () => {
//   const dispatch = useDispatch();
//   const {resumes,uploadedResumeUrl} = useSelector(state => state.resumebuilder);
//   console.log("uploaded url",uploadedResumeUrl);
//   console.log(resumes);
//   const [loading, setLoading] = useState(true);
//   const [resumeToDelete, setResumeToDelete] = useState(null); // for modal
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     try {
//       dispatch(getUserResumes());
//       dispatch(getResumeURL());
//     } catch (error) {
//       setLoading(false);
//       setError(err)
//     }
//   }, [dispatch]);

//   setTimeout(()=>{
//   setLoading(false);
//   },3000)

//   const confirmDelete = async () => {
//     if (!resumeToDelete) return;
//     try {
//        dispatch(deleteResume(resumeToDelete.id));
//     } catch (err) {
//       console.error("Error deleting resume:", err);
//       alert("Failed to delete resume.");
//     } finally {
//       setResumeToDelete(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white py-12 px-4 md:px-12 relative">
//       {/* Title */}
//       <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10 text-center">
//         <FileText className="inline-block w-8 h-8 mr-2 text-cyan-500" />
//         My Resumes
//       </h1>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex justify-center mt-20">
//           <Loader className="animate-spin w-8 h-8 text-cyan-500" />
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-400">{error}</div>
//       ) : resumes.length === 0 ? (
//         <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
//           <AlertCircle className="w-12 h-12 text-cyan-600 mb-4" />
//           <p className="text-lg">No resumes created by you yet.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {resumes && resumes.map((resume) => (
//             <div
//               key={resume.id}
//               className="bg-[#1e293b] border border-cyan-700 rounded-xl p-6 shadow-md hover:shadow-cyan-600/40 transition-all duration-300"
//             >
//               {/* Header */}
//               <div className="mb-4">
//                 <h2 className="text-xl font-semibold text-cyan-300">
//                   {resume.personal_info.full_name}
//                 </h2>
//                 <p className="text-gray-400 text-sm mt-1">{resume.target_role}</p>
//               </div>

//               {/* Contact Info */}
//               <div className="text-sm text-gray-400 space-y-1 mb-4">
//                 <p>Email: {resume.personal_info.email}</p>
//                 <p>Phone: {resume.personal_info.phone}</p>
//                 <p>Location: {resume.personal_info.location}</p>
//               </div>

//               {/* Template Info */}
//               <p className="text-teal-400 text-xs mb-4 uppercase tracking-wide">
//                 Template: {resume.template}
//               </p>

//               {/* Buttons */}
//               <div className="flex flex-col gap-2">
//                 <a
//                   href={resume.html_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
//                 >
//                   <Eye className="w-4 h-4" />
//                   View Resume
//                 </a>

//                 <a
//                   href={resume.markdown_url}
//                   download
//                   className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
//                 >
//                   <FileDown className="w-4 h-4" />
//                   Download Markdown
//                 </a>

//                 {resume.pdf_url && (
//                   <a
//                     href={resume.pdf_url}
//                     download
//                     className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
//                   >
//                     <FileDown className="w-4 h-4" />
//                     Download PDF
//                   </a>
//                 )}

//                 <button
//                   onClick={() => setResumeToDelete(resume)}
//                   className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete Resume
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Custom Delete Modal */}
//       {resumeToDelete && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-[#1e293b] border border-cyan-700 rounded-lg p-6 max-w-md w-full shadow-lg">
//             <h3 className="text-lg font-semibold text-cyan-300 mb-4">Confirm Delete</h3>
//             <p className="text-gray-400 mb-6">
//               Are you sure you want to delete <span className="text-white font-medium">{resumeToDelete.personal_info.full_name}'s</span> resume?
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setResumeToDelete(null)}
//                 className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllResumeList;
