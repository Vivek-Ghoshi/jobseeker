import { useState } from "react";
import { Mail, Phone, User, BookOpen, Code, Briefcase } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import UploadResume from "../../components/UploadResume";
import { useSelector } from "react-redux";

const JobseekerDashboard = () => {
  const {profile} = useSelector(state => state.jobseeker);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-[42.1vw] flex bg-[#0f172a] text-white overflow-hidden">
      <Sidebar role="jobseeker" />

      <div className="flex-1 overflow-auto p-6 md:p-10 flex justify-center items-center">
        <div className="ml-64 w-full max-w-4xl bg-[#1e293b] rounded-xl shadow-lg p-6 md:p-10 transition-all duration-300 hover:shadow-cyan-700/30">
          <div className="w-full flex items-center justify-between py-4 px-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 flex items-center justify-center gap-2">
                <User className="w-8 h-8 text-cyan-500" />
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-400 mt-2 text-sm md:text-base">
                {profile.title}
              </p>
            </div>

            {/* Upload Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setShowModal(true)}
                className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-md text-sm font-semibold"
              >
                Upload Resume
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
            <div className="flex items-start gap-3">
              <Mail className="text-cyan-400 w-6 h-6 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Email</p>
                <p className="text-white font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-cyan-400 w-6 h-6 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Phone Number</p>
                <p className="text-white font-medium">
                  {profile.phone_number}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="text-cyan-400 w-6 h-6 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Experience</p>
                <p className="text-white font-medium">
                  {profile.profile.experience_years} years
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Code className="text-cyan-400 w-6 h-6 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm hover:bg-cyan-500 transition duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <BookOpen className="text-cyan-400 w-6 h-6 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Bio</p>
                <p className="text-white font-medium">{profile.profile.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
      {showModal && <UploadResume onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default JobseekerDashboard;
