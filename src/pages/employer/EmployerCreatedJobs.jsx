import { Pencil, Trash2, Briefcase, IndianRupee, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteJob, listEmployerJobs } from '../../redux/slices/employerSlice';
import { useNavigate } from 'react-router-dom';

const truncateDescription = (text, wordLimit) =>
  text.split(' ').slice(0, wordLimit).join(' ') + (text.split(' ').length > wordLimit ? '...' : '');

const EmployerCreatedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs } = useSelector((state) => state.employer);
  useEffect(() => {
    dispatch(listEmployerJobs());
  }, [dispatch,jobs]);
  
  const deleteHandler = (id)=>{
    dispatch(deleteJob(id));
  }
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10 flex flex-col gap-6 items-center">
      <h2 className="font-semibold capitalize text-blue-400">all job openings created by you...</h2>

      {jobs &&
        jobs.map((job) => (
          <div
            key={job._id}
            className="w-full max-w-6xl bg-[#1e293b] rounded-xl shadow-md hover:shadow-cyan-600/30 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            {/* Job Info */}
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-500" />
                {job.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base mt-2">
                {truncateDescription(job.description, 20)}
              </p>
              <div className="flex items-center gap-2 mt-3 text-white text-sm">
                <IndianRupee className="text-cyan-400 w-4 h-4" />
                <span>
                  {job.salary_min} - {job.salary_max}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 md:flex-col">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 transition text-white text-sm font-medium">
                <Pencil className="w-4 h-4" />
                Update
              </button>

              <button onClick={()=> deleteHandler(job.id)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition text-white text-sm font-medium">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              {/* 🔵 View Applications Button */}
              <button
                onClick={() => navigate(`/applications/employer/job/${job.id}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                View Applications
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EmployerCreatedJobs;
