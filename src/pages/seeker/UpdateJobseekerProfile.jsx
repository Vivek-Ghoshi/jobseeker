import { useForm } from 'react-hook-form';
import {
  User,
  Phone,
  BadgeCheck,
  BookOpen,
  Code,
  Briefcase,
  Save,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobSeekerProfileExtended } from '../../redux/slices/jobSeekerSlice';
import { useNavigate } from 'react-router';

const UpdateJobseekerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {profile}= useSelector(state=> state.jobseeker);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
      title: profile.profile.title,
      bio: profile.profile.bio,
     skills: profile.profile.skills || [],
      experience_years: profile.profile.experience_years,
    },
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      skills: data.skills.split(',').map((s) => s.trim()),
    };
    const res = await dispatch(updateJobSeekerProfileExtended(formattedData));
    if(updateJobSeekerProfileExtended.fulfilled.match(res)){
        navigate("/dashboard/jobseeker")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1e293b] w-full max-w-5xl rounded-2xl shadow-xl p-8 md:p-12 text-white grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn"
      >
        <h2 className="md:col-span-2 text-3xl font-bold text-cyan-400 text-center mb-6">
          Update Jobseeker Profile
        </h2>

        {/* First Name */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            First Name
          </label>
          <input
            {...register('first_name', { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="Jane"
          />
          {errors.first_name && (
            <span className="text-red-500 text-sm mt-1">Required</span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            Last Name
          </label>
          <input
            {...register('last_name', { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="Doe"
          />
          {errors.last_name && (
            <span className="text-red-500 text-sm mt-1">Required</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Phone className="w-5 h-5 text-cyan-400" />
            Phone Number
          </label>
          <input
            {...register('phone_number', { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="+1234567890"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-cyan-400" />
            Job Title
          </label>
          <input
            {...register('title', { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="Software Developer"
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Years of Experience
          </label>
          <input
            type="number"
            {...register('experience_years', { required: true, min: 0 })}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="5"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Skills (comma-separated)
          </label>
          <input
            {...register('skills', { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="React, JavaScript, etc."
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Bio
          </label>
          <textarea
            {...register('bio', { required: true })}
            rows={4}
            className="bg-[#334155] rounded-lg px-4 py-2 outline-none border border-transparent focus:border-cyan-400 transition-all resize-none"
            placeholder="Brief professional summary..."
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateJobseekerProfile;
