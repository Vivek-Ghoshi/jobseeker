import { Briefcase, BadgeDollarSign, AlignLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAllJobs, listJobSeekerApplications } from '../../redux/slices/jobSeekerSlice';


const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'REVIEWED':
      return 'bg-emerald-800 text-emerald-300';
    case 'REJECTED':
      return 'bg-red-800 text-red-300';
    case 'PENDING':
    default:
      return 'bg-yellow-700 text-yellow-200';
  }
};

const AllApplications = () => {
  const dispatch = useDispatch();
  const {applications} = useSelector(state =>state.jobseeker);
  useEffect(()=>{
     dispatch(listJobSeekerApplications());
  },[dispatch])
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10 flex items-center gap-3 justify-center">
        <AlignLeft className="w-7 h-7 text-cyan-500" />
        My Job Applications
      </h1>

      <div className="space-y-8 max-w-6xl mx-auto">
        {applications && applications.map((job) => (
          <div
            key={job.id}
            className="w-full bg-[#1e293b] border border-cyan-700 rounded-lg p-6 md:p-8 shadow-lg hover:shadow-cyan-600/40 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Title + Description */}
              <div>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-1 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" />
                  {job.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2 max-w-xl">
                  {job.description}
                </p>
              </div>

              {/* Right section: Salary + Status */}
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/40 px-4 py-2 rounded-md text-sm font-medium">
                  <BadgeDollarSign className="w-4 h-4" />
                  ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusBadgeColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplications;
