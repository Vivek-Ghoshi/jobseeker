import { Star, ThumbsDown } from 'lucide-react';

import { motion } from 'framer-motion';
import Progress from '../../components/Progress';

const applications = [
  {
    _id: "1",
    applicant_name: "Vivek Developer",
    applicant_email: "vivek@example.com",
    interview_score: 78,
    interview_max_score: 100,
  },
  {
    _id: "2",
    applicant_name: "Anjali Sharma",
    applicant_email: "anjali.sharma@example.com",
    interview_score: 92,
    interview_max_score: 100,
  },
  {
    _id: "3",
    applicant_name: "Rahul Mehta",
    applicant_email: "rahul.mehta@example.com",
    interview_score: 58,
    interview_max_score: 100,
  },
  {
    _id: "4",
    applicant_name: "Sneha Kapoor",
    applicant_email: "sneha.k@example.com",
    interview_score: 85,
    interview_max_score: 100,
  },
  {
    _id: "5",
    applicant_name: "Amit Jadhav",
    applicant_email: "amitjadhav@example.com",
    interview_score: 95,
    interview_max_score: 100,
  },
  {
    _id: "6",
    applicant_name: "Priya Singh",
    applicant_email: "priya.singh@example.com",
    interview_score: 63,
    interview_max_score: 100,
  },
  {
    _id: "7",
    applicant_name: "Yash Patel",
    applicant_email: "yashpatel@example.com",
    interview_score: 88,
    interview_max_score: 100,
  },
];

const AllScoreCards = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-6 md:px-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-cyan-400">
        Candidate Interview Scores
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app, idx) => {
          const percent = (app.interview_score / app.interview_max_score) * 100;
          const isExcellent = percent >= 90;
          const isGood = percent >= 70 && percent < 90;
          const isPoor = percent < 60;

          let colorClass = 'from-cyan-500 to-blue-500';
          if (isExcellent) colorClass = 'from-green-400 to-green-600';
          else if (isGood) colorClass = 'from-emerald-400 to-emerald-600';
          else if (isPoor) colorClass = 'from-red-500 to-pink-600';

          return (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#1e293b] rounded-2xl p-5 shadow-lg border border-cyan-700 hover:shadow-cyan-500/30 transition-all"
            >
              <h2 className="text-xl font-semibold mb-1 text-white">
                {app.applicant_name}
              </h2>
              <p className="text-sm text-cyan-300 mb-4">{app.applicant_email}</p>

              <div className="mb-2 text-sm text-white">
                <span className="font-medium">Score: </span>
                {app.interview_score}/{app.interview_max_score}
              </div>

              <Progress
                value={percent}
                className="h-3 bg-gray-800 border border-cyan-700"
              />

              <div className="mt-4 flex items-center gap-2">
                {isExcellent && (
                  <span className="flex items-center text-green-400 font-semibold">
                    <Star className="w-4 h-4 mr-1 fill-green-400" /> Excellent
                  </span>
                )}
                {isGood && !isExcellent && (
                  <span className="text-emerald-400 font-semibold">Strong Candidate</span>
                )}
                {isPoor && (
                  <span className="flex items-center text-red-400 font-semibold">
                    <ThumbsDown className="w-4 h-4 mr-1" /> Below Expectation
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AllScoreCards;
