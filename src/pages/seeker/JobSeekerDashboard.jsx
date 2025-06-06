import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  User,
  BookOpen,
  Code,
  Briefcase,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import UploadResume from "../../components/UploadResume";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getJobSeekerProfile } from "../../redux/slices/jobSeekerSlice";

const JobseekerDashboard = () => {
  const { profile } = useSelector((state) => state.jobseeker);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(()=>{
     dispatch(getJobSeekerProfile());
  },[dispatch])
  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Sidebar */}
      <div className="w-[250px] hidden md:block border-r border-[#1e293b] bg-[#0f172a]">
      <Sidebar role="jobseeker" />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 pt-10 sm:pt-10 mt-20 md:mt-0 md:ml-0 px-4 py-6 sm:px-6 md:px-30 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto bg-[#0d1117] rounded-2xl shadow-xl border border-[#1e293b] px-6 py-8 sm:px-10 sm:py-10"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-400 flex items-center justify-center sm:justify-start gap-2">
                <User className="w-7 h-7 text-cyan-500" />
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base italic">
                {profile.title}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 hover:scale-105 transition-all px-5 py-2 text-sm rounded-md shadow-lg font-semibold"
            >
              Upload Resume
            </button>
          </div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base"
          >
            <ProfileItem icon={<Mail />} label="Email" value={profile.email} />
            <ProfileItem icon={<Phone />} label="Phone" value={profile.phone_number} />
            <ProfileItem icon={<Briefcase />} label="Experience" value={`${profile.profile.experience_years} years`} />
            <SkillItem icon={<Code />} skills={profile.profile.skills} />
            <BioItem icon={<BookOpen />} bio={profile.profile.bio} />
          </motion.div>
        </motion.div>
      </div>

      {showModal && <UploadResume onClose={() => setShowModal(false)} />}
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-start gap-3 bg-[#1f2937] rounded-xl p-4 hover:bg-[#273344] transition"
  >
    <div className="text-cyan-400 mt-1">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold break-all">{value}</p>
    </div>
  </motion.div>
);

const SkillItem = ({ icon, skills }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex flex-col items-start gap-3 bg-[#1f2937] rounded-xl p-4 hover:bg-[#273344] transition"
  >
    <div className="flex items-center gap-2">
      <div className="text-cyan-400">{icon}</div>
      <p className="text-gray-400 text-xs">Skills</p>
    </div>
    <div className="flex flex-wrap gap-2 mt-1">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded-full text-sm transition-all"
        >
          {skill}
        </span>
      ))}
    </div>
  </motion.div>
);

const BioItem = ({ icon, bio }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-start gap-3 bg-[#1f2937] rounded-xl p-4 md:col-span-2 hover:bg-[#273344] transition"
  >
    <div className="text-cyan-400 mt-1">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs mb-1">Bio</p>
      <p className="text-white font-medium leading-relaxed">{bio}</p>
    </div>
  </motion.div>
);

export default JobseekerDashboard;
