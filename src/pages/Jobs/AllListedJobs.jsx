import {
  Briefcase,
  MapPin,
  DollarSign,
  IndianRupee,
  ClipboardList,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { listAllJobs } from '../../redux/slices/jobSeekerSlice';


const AllListedJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {jobs}= useSelector(state => state.jobseeker);
    console.log(jobs)

    useEffect(()=>{
       dispatch(listAllJobs());
    },[dispatch]);

    const applyHandler = (index)=>{
    navigate(`/job-application/${index}`);
}
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10 flex flex-col gap-6 items-center ">
      {jobs && jobs.map((job, index) => (
        <div
          key={index}
          className="w-full max-w-6xl bg-[#1e293b] rounded-xl shadow-md hover:shadow-cyan-600/30 transition-all duration-300 p-6 md:p-8 space-y-4 h-[40vh] flex flex-col justify-between mb-10 "
        >
          {/* Top Row: Title & Status */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-cyan-400 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-red-500" />
              {job.title}
            </h2>
            {job.is_active && (
              <span className="text-green-400 text-xs md:text-sm font-semibold bg-green-900 px-3 py-1 rounded-full">
                Active
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base">{job.description}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="text-cyan-400 w-4 h-4" />
              <span className="text-white">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="text-cyan-400 w-4 h-4" />
              <span className="text-white capitalize">{job.job_type.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="text-cyan-400 w-4 h-4" />
              <span className="text-white">
                {job.salary_min} - {job.salary_max}
              </span>
            </div>
          </div>

          {/* Requirements and Responsibilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-gray-400 text-xs mb-1">Requirements</p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-cyan-700 text-white px-2 py-1 rounded-full hover:bg-cyan-500 transition"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Responsibilities</p>
              <ul className="list-disc list-inside text-gray-300 text-xs">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end mt-2">
            <button onClick={()=> applyHandler(job.id)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium px-5 py-2 rounded-md transition">
              Apply Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllListedJobs;
