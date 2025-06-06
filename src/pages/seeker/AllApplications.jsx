import { Briefcase, BadgeDollarSign, AlignLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listJobSeekerApplications } from '../../redux/slices/jobSeekerSlice';
import { motion } from 'framer-motion';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'reviewed':
      return 'bg-green-700 text-white-300';
    case 'rejected':
      return 'bg-red-700 text-white-300';
    case 'pending':
      return 'bg-blue-700 text-white-300';
    default:
      return 'bg-yellow-700 text-white-200';
  }
};

const AllApplications = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.jobseeker);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
 
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        await dispatch(listJobSeekerApplications()).unwrap();
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setFetchError(true);
      } finally {
        setTimeout(() => setLoading(false), 1500); // subtle load effect
      }
    };
    fetchApps();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 w-full">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-3 justify-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AlignLeft className="w-7 h-7 text-purple-400" />
        My Job Applications
      </motion.h1>

      <div className="space-y-8 max-w-6xl mx-auto">
        {loading && (
          <motion.div
            className="text-center text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Fetching your applications...
          </motion.div>
        )}

        {!loading && fetchError && (
          <motion.div
            className="text-center text-red-400 font-medium text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ Failed to load applications. Please try again later.
          </motion.div>
        )}

        {!loading && !fetchError && applications.length === 0 && (
          <motion.div
            className="text-center text-gray-500 font-medium text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            You haven’t applied to any jobs yet.
          </motion.div>
        )}

        {!loading &&
          applications.map((job,i) => (
            
            <motion.div
              key={job.id}
              className="bg-[#12151f] border border-zinc-700 rounded-lg p-6 md:p-8 shadow-lg hover:shadow-purple-700/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-white-400" />
                    {job.job_title} 
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 max-w-xl">
                    {job.cover_letter}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  {/* <div className="flex items-center gap-2 text-emerald-300 bg-emerald-900/40 px-4 py-1.5 rounded-md text-sm font-medium">
                    <BadgeDollarSign className="w-4 h-4" />
                    ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                  </div> */}

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default AllApplications;
