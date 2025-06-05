import { useForm } from 'react-hook-form';
import { FileText, SendHorizonal, AlignLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createApplication } from '../../redux/slices/jobSeekerSlice';
import { useNavigate } from 'react-router';


const userProfile = {
  resume_url: 'https://example.com/resume/jane-doe.pdf', // i will figure out this later
};

const JobApplicationPage = () => {
  const dispatch= useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const coverLetter = watch('cover_letter') || '';

  const onSubmit = (data) => {
    dispatch(createApplication(data));
    navigate("/jobs/all");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-[#1e293b] rounded-xl shadow-lg p-6 md:p-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          <AlignLeft className="w-7 h-7 text-cyan-500" />
          Job Application
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
          {/* Cover Letter */}
          <div className="col-span-2">
            <label className="text-gray-300 font-medium mb-2 block">
              Cover Letter (max 2000 words)
            </label>
            <textarea
              {...register('cover_letter', {
                required: 'Cover letter is required',
                validate: (value) =>
                  value.trim().split(/\s+/).length <= 2000 || 'Word limit exceeded (2000)',
              })}
              className="w-full bg-[#0f172a] border border-cyan-700 rounded-md p-4 text-white resize-none h-60 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300"
              placeholder="Write your cover letter here..."
            ></textarea>
            <div className="flex justify-between mt-1 text-sm">
              <span className="text-red-500">{errors.cover_letter?.message}</span>
              <span className="text-gray-400">{coverLetter.trim().split(/\s+/).length} / 2000 words</span>
            </div>
          </div>

          {/* Resume Container */}
          <div className="col-span-2">
            <label className="text-gray-300 font-medium mb-2 block">Your Resume</label>
            <div className="flex items-center justify-between p-4 border border-cyan-700 rounded-md bg-[#0f172a]">
              <div className="flex items-center gap-3">
                <FileText className="text-cyan-400 w-6 h-6" />
                <span className="text-cyan-300 text-sm">
                  {userProfile.resume_url.split('/').pop()}
                </span>
              </div>
              <a
                href={userProfile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded-md transition-all duration-200"
              >
                View
              </a>
            </div>
          </div>

          {/* Submit */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              <SendHorizonal className="w-4 h-4" />
              Submit Application
            </button>
          </div>
        </form>

        {submitted && (
          <div className="mt-6 text-green-400 font-semibold text-center animate-pulse">
            ✅ Application Submitted Successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationPage;
