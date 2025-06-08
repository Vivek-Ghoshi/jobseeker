import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, FileText } from 'lucide-react';
import { getJobEvaluations } from '../../redux/slices/employerSlice';

const JobEvaluationsPage = () => {
  const { id:jobId } = useParams();
  const dispatch = useDispatch();
  const { jobEvaluations, loading } = useSelector((state) => state.employer);

  useEffect(() => {
    if (jobId) dispatch(getJobEvaluations(jobId));
  }, [jobId]);

  return (
    <div className="min-h-screen p-4 bg-[#0f172a] text-white">
      <motion.h1
        className="text-3xl font-bold mb-6 text-cyan-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Job Evaluation Report
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader className="animate-spin w-10 h-10 text-cyan-500" />
        </div>
      ) : jobEvaluations?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobEvaluations.map((evalData, i) => (
            <motion.div
              key={i}
              className="p-4 bg-[#1e293b] rounded-xl border border-cyan-700 shadow-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-lg font-semibold text-cyan-300 mb-2">{evalData.candidate_name}</h2>
              <p className="text-sm mb-1">Score: <span className="text-white">{evalData.score}</span></p>
              <p className="text-sm text-cyan-200">Comments: {evalData.comments}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FileText className="mx-auto text-cyan-500 w-12 h-12 mb-2" />
          <p className="text-lg text-cyan-300">No evaluations found for this job.</p>
        </motion.div>
      )}
    </div>
  );
};

export default JobEvaluationsPage;
