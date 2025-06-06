import { useForm } from 'react-hook-form';
import { Briefcase, MapPin, DollarSign, ClipboardList, ToggleRight, Save } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createJob } from '../../redux/slices/employerSlice';
import { useNavigate } from 'react-router';

const CreateJobForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {

    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formatted = {
      ...data,
      requirements: data.requirements.split(',').map((item) => item.trim()),
      responsibilities: data.responsibilities.split(',').map((item) => item.trim()),
    };
    const res  = await dispatch(createJob(formatted));
    if(createJob.fulfilled.match(res)){
     navigate("/employer/created-jobs");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1e293b] text-white w-full max-w-5xl rounded-xl shadow-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn"
      >
        <h2 className="md:col-span-2 text-3xl font-bold text-cyan-400 text-center mb-4">
          Create New Job
        </h2>

        {/* Job Title */}
        <div>
          <label className="text-sm text-gray-400 flex gap-2 items-center mb-1">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Job Title
          </label>
          <input
            {...register('title', { required: true })}
            className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
            placeholder="e.g. Software Engineer"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-gray-400 flex gap-2 items-center mb-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Location
          </label>
          <input
            {...register('location', { required: true })}
            className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
            placeholder="e.g. Remote"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">Job Type</label>
          <select
            {...register('job_type')}
            className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="text-sm text-gray-400 block mb-1">Salary Min</label>
            <input
              type="number"
              {...register('salary_min')}
              className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
              placeholder="80,000"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm text-gray-400 block mb-1">Salary Max</label>
            <input
              type="number"
              {...register('salary_max')}
              className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
              placeholder="120,000"
            />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="text-sm text-gray-400 flex gap-2 items-center mb-1">
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            Requirements (comma-separated)
          </label>
          <input
            {...register('requirements')}
            className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
            placeholder="e.g. React, Node.js"
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label className="text-sm text-gray-400 block mb-1">
            Responsibilities (comma-separated)
          </label>
          <input
            {...register('responsibilities')}
            className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition"
            placeholder="e.g. Code Reviews, Deployments"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-400 block mb-1">Job Description</label>
          <textarea
            rows={4}
            {...register('description')}
            className="w-full bg-[#334155] text-sm px-3 py-2 rounded-md outline-none border border-transparent focus:border-cyan-400 transition resize-none"
            placeholder="Short job summary..."
          />
        </div>

        {/* Active Toggle */}
        <div className="md:col-span-2 flex items-center gap-2 mt-4">
          <ToggleRight className="text-cyan-400 w-5 h-5" />
          <label className="text-sm text-gray-300">Is this job active?</label>
          <input
            type="checkbox"
            {...register('is_active')}
            className="ml-2 w-4 h-4 text-cyan-500 rounded focus:ring-cyan-500 transition"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;
