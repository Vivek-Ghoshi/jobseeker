import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Star } from 'lucide-react';
import { evaluateApplication } from '../../redux/slices/employerSlice';

const EvaluateApplicationPage = () => {
  const { id:appId } = useParams();

  const dispatch = useDispatch();
  const { evaluatedApplication, loading } = useSelector((state) => state.employer);

  useEffect(() => {
    if (appId) dispatch(evaluateApplication(appId));
  }, [appId]);

  return (
    <div className="min-h-screen p-4 bg-[#0f172a] text-white">
      <motion.h1
        className="text-3xl font-bold text-cyan-400 mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Application Evaluation
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader className="animate-spin w-10 h-10 text-cyan-500" />
        </div>
      ) : evaluatedApplication ? (
        <motion.div
          className="p-6 bg-[#1e293b] rounded-2xl shadow-lg border border-cyan-700"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">
            {evaluatedApplication.name}
          </h2>
          <p className="text-sm mb-2 text-white">Email: {evaluatedApplication.email}</p>
          <p className="text-sm mb-4 text-white">Score: {evaluatedApplication.score}</p>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 font-medium">
              {evaluatedApplication.score >= 90
                ? 'Excellent Fit'
                : evaluatedApplication.score >= 70
                ? 'Good Match'
                : 'Needs Improvement'}
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.p
          className="text-center text-cyan-400 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No evaluation data available.
        </motion.p>
      )}
    </div>
  );
};

export default EvaluateApplicationPage;
