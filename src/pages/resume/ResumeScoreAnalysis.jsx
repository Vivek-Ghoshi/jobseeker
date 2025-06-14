import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const ResumeScoreAnalysis = () => {
  const { resumeScore } = useSelector(state => state.employer);

  const {
    applicant_name,
    job_title,
    application_id,
    score_result: {
      overall_score,
      skill_match_score,
      experience_match_score,
      location_match_score,
      skill_matches,
      missing_skills,
      feedback,
    },
    scored_at,
    is_cached,
  } = resumeScore;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] rounded-2xl shadow-[0_0_15px_#06b6d4] p-6 md:p-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 text-center">
          Resume Score Analysis
        </h1>

        <div className="mb-6 text-center space-y-2">
          <p className="text-lg text-gray-300">👤 Applicant: <span className="font-semibold text-white">{applicant_name}</span></p>
          <p className="text-lg text-gray-300">💼 Job Title: <span className="font-semibold text-white">{job_title}</span></p>
          <p className="text-sm text-gray-500">🆔 Application ID: {application_id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Score Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0f172a] border border-cyan-700 rounded-xl p-6 shadow-md hover:shadow-cyan-600/40 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-cyan-300 mb-3">📊 Scores</h2>
            <ul className="space-y-2 text-gray-200">
              <li>⭐ Overall Score: <span className="text-cyan-400 font-semibold">{overall_score ?? 'N/A'}</span></li>
              <li>🧠 Skill Match Score: {skill_match_score ?? 'N/A'}</li>
              <li>📈 Experience Match Score: {experience_match_score ?? 'N/A'}</li>
              <li>📍 Location Match Score: {location_match_score ?? 'N/A'}</li>
            </ul>
          </motion.div>

          {/* Skill Analysis Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0f172a] border border-cyan-700 rounded-xl p-6 shadow-md hover:shadow-cyan-600/40 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-cyan-300 mb-3">🧩 Skills Analysis</h2>

            <div className="mb-3">
              <p className="text-gray-200 mb-1">✅ Matched Skills:</p>
              <ul className="list-disc list-inside text-green-400 space-y-1">
                {Object.entries(skill_matches)
                  .filter(([_, matched]) => matched)
                  .map(([skill]) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>

            <div>
              <p className="text-gray-200 mb-1">❌ Missing Skills:</p>
              <ul className="list-disc list-inside text-red-400 space-y-1">
                {missing_skills.length > 0 ? (
                  missing_skills.map(skill => <li key={skill}>{skill}</li>)
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Feedback Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-[#0f172a] border border-cyan-700 rounded-xl p-6 shadow-md hover:shadow-cyan-600/40 transition-all duration-300 mb-6"
        >
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">📝 Feedback</h2>
          <p className="text-gray-200 leading-relaxed">{feedback}</p>
        </motion.div>

        {/* Timestamp */}
        <p className="text-sm text-gray-500 text-center">
          🕒 Scored At: {new Date(scored_at).toLocaleString()} {is_cached && '(Cached)'}
        </p>
      </motion.div>
    </div>
  );
};

export default ResumeScoreAnalysis;
