import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// import { Card, CardContent } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getReportCard } from '../../redux/slices/interviewSlice';
import Progress from '../../components/Progress';

const scoreColor = (score) => {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  if(score>0 && score <=5) return 'text-red-500'
  return 'text-red-400';
};
const report = {
    "success": true,
    "application_id": "68431530a190ff99ee044607",
    "questions": {
        "qs-1": {
            "category": "Basic background and introduction questions",
            "question": "Can you walk me through your journey as a developer and how it has prepared you for a role as an Operation Manager?"
        },
        "qs-2": {
            "category": "Basic background and introduction questions",
            "question": "What motivated you to transition from a technical role focused on React, Express, and MongoDB to an operations management position?"
        },
        "qs-3": {
            "category": "Education and certifications questions",
            "question": "Can you describe how your educational background has contributed to your technical expertise, particularly in full-stack development?"
        },
        "qs-4": {
            "category": "Education and certifications questions",
            "question": "Have you pursued any additional certifications or training related to project management, operations, or technical leadership? If so, how have they influenced your work?"
        },
        "qs-5": {
            "category": "Work experience and projects questions",
            "question": "Please describe a complex project where you utilized React JS, Express JS, and MongoDB together. What were the key technical challenges, and how did you overcome them?"
        },
        "qs-6": {
            "category": "Work experience and projects questions",
            "question": "Can you share an example of a time when you optimized a web application’s performance, particularly focusing on front-end animations and back-end API responses?"
        },
        "qs-7": {
            "category": "Technical and skill-based questions",
            "question": "How do you design a scalable system architecture using Express JS and MongoDB to handle high traffic while ensuring data consistency?"
        },
        "qs-8": {
            "category": "Technical and skill-based questions",
            "question": "Explain your approach to debugging and optimizing a React application that suffers from slow rendering and poor animation performance."
        },
        "qs-9": {
            "category": "Behavioral and situational questions",
            "question": "Imagine you are managing a cross-functional team where developers and operations staff have conflicting priorities. How would you handle this to ensure project success?"
        },
        "qs-10": {
            "category": "Behavioral and situational questions",
            "question": "Describe a situation where a critical deployment failed. How did you manage the technical troubleshooting and communicate with stakeholders during this incident?"
        }
    },
    "scores": {
        "qs-1": 8,
        "qs-2": 7,
        "qs-3": 9,
        "qs-4": 5,
        "qs-5": 8,
        "qs-6": 7,
        "qs-7": 9,
        "qs-8": 8,
        "qs-9": 7,
        "qs-10": 9
    },
    "total_score": 78,
    "max_possible_score": 100
}

const InterviewReportCard = () => {
  const dispatch = useDispatch();
  const { id: appId } = useParams();

//   const { scores, loading, error } = useSelector((state) => state.interview);
 const loading = null;
 const error = null;
//   useEffect(() => {
//     dispatch(getReportCard(appId));
//   }, [dispatch, appId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <Loader2 className="animate-spin text-cyan-400 w-10 h-10" />
        <p className="mt-4 text-gray-300">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4">
        <AlertTriangle className="text-red-500 w-10 h-10" />
        <p className="mt-4 text-red-400 text-center">
          Failed to load report. {error?.message || 'Please try again later.'}
        </p>
      </div>
    );
  }

  const { questions, scores, total_score, max_possible_score, application_id } = report;

  const grouped = {};
  Object.entries(questions).forEach(([key, q]) => {
    if (!grouped[q.category]) grouped[q.category] = [];
    grouped[q.category].push({ id: key, ...q, score: scores[key] });
  });

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 sm:px-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-5xl font-bold text-cyan-400 mb-2">Interview Report</h1>
        <p className="text-sm text-gray-400">Application ID: {application_id}</p>
        <div className="mt-4">
          <Progress
            value={(total_score / max_possible_score) * 100}
            className="h-3 bg-gray-800 border border-cyan-700"
          />
          <p className="text-cyan-300 mt-2 text-sm">Score: {total_score} / {max_possible_score}</p>
        </div>
      </motion.div>

      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-cyan-300 border-b border-gray-700 pb-1">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map(({ id, question, score }) => (
                <div key={id} className="bg-gray-900 border border-gray-700 hover:shadow-cyan-500/20 hover:scale-[1.02] transition duration-300 rounded-2xl">
                  <section className="p-4 space-y-2">
                    <p className="text-sm text-gray-300">{question}</p>
                    <p className={`text-lg font-bold ${scoreColor(score)}`}>Score: {score}/10</p>
                  </section>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewReportCard;
