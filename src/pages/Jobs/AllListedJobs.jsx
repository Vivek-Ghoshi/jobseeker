import {
  Briefcase,
  MapPin,
  IndianRupee,
  ClipboardList,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { listAllJobs } from '../../redux/slices/jobSeekerSlice';
import { motion } from 'framer-motion';

const AllListedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobs, applications } = useSelector((state) => state.jobseeker); 
  useEffect(() => {
    dispatch(listAllJobs());
  }, [dispatch]);

  const applyHandler = (jobId) => {
    navigate(`/job-application/${jobId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] px-4 py-10 flex flex-col items-center gap-10">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        All Available Jobs
      </motion.h1>

      {jobs &&
        jobs.map((job, index) => {
const appliedJobIds = applications?.map((job) => String(job.job_id)) || [];

const isApplied = appliedJobIds.includes(String(job.id));
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full max-w-4xl bg-gradient-to-bl from-black via-gray-900 to-[#0f0f1a] rounded-xl shadow-lg hover:shadow-sky-500/30 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between gap-6 border border-zinc-700"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-400" />
                  {job.title}
                </h2>

                {job.is_active && (
                  <span className="text-green-400 text-xs sm:text-sm font-semibold bg-green-900 px-3 py-1 rounded-full animate-pulse">
                    Active
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm">{job.description}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="text-sky-400 w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <ClipboardList className="text-sky-400 w-4 h-4" />
                  {job.job_type.replace('_', ' ')}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <IndianRupee className="text-sky-400 w-4 h-4" />
                  {job.salary_min} - {job.salary_max}
                </div>
              </div>

              {/* Requirements and Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs font-medium mb-1">
                    Requirements
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-sky-700 text-white px-2 py-1 rounded-full hover:bg-sky-600 transition duration-200"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-medium mb-1">
                    Responsibilities
                  </p>
                  <ul className="list-disc list-inside text-gray-300 text-xs">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Apply or Applied Button */}
              <div className="flex justify-end">
                {isApplied ? (
                  <motion.button
                    disabled
                    className="flex items-center gap-2 bg-green-700 cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-md"
                    whileHover={{ scale: 1 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Applied
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyHandler(job.id)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 transition text-white text-sm font-medium px-5 py-2 rounded-md"
                  >
                    Apply Now <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
    </div>
  );
};

export default AllListedJobs;


// import {
//   Briefcase,
//   MapPin,
//   IndianRupee,
//   ClipboardList,
//   ChevronRight,
// } from 'lucide-react';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router';
// import { listAllJobs } from '../../redux/slices/jobSeekerSlice';
// import { motion } from 'framer-motion';

// const AllListedJobs = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { jobs } = useSelector((state) => state.jobseeker);

//   useEffect(() => {
//     dispatch(listAllJobs());
//   }, [dispatch]);

//   const applyHandler = (index) => {
//     navigate(`/job-application/${index}`);
//   };

//   return (
//     <div className="min-h-screen w-full bg-black px-4 py-10 flex flex-col items-center gap-10">
//       <motion.h1
//         className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6"
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         All Available Jobs
//       </motion.h1>

//       {jobs &&
//         jobs.map((job, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: index * 0.1 }}
//             className="w-full max-w-4xl bg-[#111827] rounded-xl shadow-lg hover:shadow-sky-500/30 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between gap-6 border border-zinc-700"
//           >
//             {/* Top Row */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//               <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
//                 <Briefcase className="w-5 h-5 text-sky-400" />
//                 {job.title}
//               </h2>

//               {job.is_active && (
//                 <span className="text-green-400 text-xs sm:text-sm font-semibold bg-green-900 px-3 py-1 rounded-full animate-pulse">
//                   Active
//                 </span>
//               )}
//             </div>

//             {/* Description */}
//             <p className="text-gray-400 text-sm">{job.description}</p>

//             {/* Info Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
//               <div className="flex items-center gap-2 text-white">
//                 <MapPin className="text-sky-400 w-4 h-4" />
//                 {job.location}
//               </div>
//               <div className="flex items-center gap-2 text-white">
//                 <ClipboardList className="text-sky-400 w-4 h-4" />
//                 {job.job_type.replace('_', ' ')}
//               </div>
//               <div className="flex items-center gap-2 text-white">
//                 <IndianRupee className="text-sky-400 w-4 h-4" />
//                 {job.salary_min} - {job.salary_max}
//               </div>
//             </div>

//             {/* Requirements and Responsibilities */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-gray-500 text-xs font-medium mb-1">
//                   Requirements
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {job.requirements.map((req, idx) => (
//                     <span
//                       key={idx}
//                       className="text-xs bg-sky-700 text-white px-2 py-1 rounded-full hover:bg-sky-600 transition duration-200"
//                     >
//                       {req}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <p className="text-gray-500 text-xs font-medium mb-1">
//                   Responsibilities
//                 </p>
//                 <ul className="list-disc list-inside text-gray-300 text-xs">
//                   {job.responsibilities.map((resp, idx) => (
//                     <li key={idx}>{resp}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Apply Button */}
//             <div className="flex justify-end">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => applyHandler(job.id)}
//                 className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 transition text-white text-sm font-medium px-5 py-2 rounded-md"
//               >
//                 Apply Now <ChevronRight className="w-4 h-4" />
//               </motion.button>
//             </div>
//           </motion.div>
//         ))}
//     </div>
//   );
// };

// export default AllListedJobs;
