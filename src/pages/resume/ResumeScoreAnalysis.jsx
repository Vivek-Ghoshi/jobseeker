import { useSelector } from 'react-redux';

const ResumeScoreAnalysis = () => {
  const {resumeScore} = useSelector(state => state.employer);
  
  // Destructure analysis data
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">Resume Score Analysis</h1>
        <p className="text-gray-300 mb-2">Applicant: {applicant_name}</p>
        <p className="text-gray-300 mb-2">Job Title: {job_title}</p>
        <p className="text-gray-500 text-sm mb-4">Application ID: {application_id}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Scores</h2>
            <ul className="text-gray-200">
              <li>Overall Score: {overall_score ?? 'N/A'}</li>
              <li>Skill Match Score: {skill_match_score ?? 'N/A'}</li>
              <li>Experience Match Score: {experience_match_score ?? 'N/A'}</li>
              <li>Location Match Score: {location_match_score ?? 'N/A'}</li>
            </ul>
          </div>

          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">Skills Analysis</h2>
            <p className="text-gray-200 mb-1">Matched Skills:</p>
            <ul className="list-disc list-inside text-green-400 mb-2">
              {Object.entries(skill_matches)
                .filter(([_, matched]) => matched)
                .map(([skill]) => (
                  <li key={skill}>{skill}</li>
                ))}
            </ul>
            <p className="text-gray-200 mb-1">Missing Skills:</p>
            <ul className="list-disc list-inside text-red-400">
              {missing_skills.length > 0 ? (
                missing_skills.map((skill) => <li key={skill}>{skill}</li>)
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">Feedback</h2>
          <p className="text-gray-200">{feedback}</p>
        </div>

        <p className="text-gray-500 text-sm">
          Scored At: {new Date(scored_at).toLocaleString()} {is_cached && '(Cached)'}
        </p>
      </div>
    </div>
  );
};

export default ResumeScoreAnalysis;
