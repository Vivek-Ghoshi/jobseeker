import {
  Building2,
  Mail,
  Phone,
  User,
  Pencil,
  Globe,
  Briefcase,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { getEmployerProfile } from '../../redux/slices/employerSlice';

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.employer);
  useEffect(()=>{
        dispatch(getEmployerProfile());
  },[dispatch]);
  return (
    <div className="flex bg-black text-white min-h-screen items-start sm:items-center pt-10 sm:pt-0">
      {/* Sidebar - Hidden on mobile */}
      <div className="w-[250px] hidden md:block border-r border-[#1e293b] bg-[#0f172a]">
        <Sidebar role="employer" />
      </div>

      {/* Main Content */}
     <div className="flex-1 flex items-center justify-center p-4">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] w-full max-w-4xl rounded-2xl shadow-[0_0_20px_#06b6d4] p-6 md:p-10 transition-all duration-300"
  >
    {/* Update Profile Button */}
    <div className="md:absolute md:top-4 md:right-4 flex justify-center md:justify-end mb-4 md:mb-0">
      <Link
        to="/employer/update-profile"
        className="inline-block px-4 flex py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm md:text-base font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
      >
       
         Update Profile
      </Link>
    </div>

    {/* Company Name */}
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 md:mb-10 text-center flex items-center justify-center gap-2 capitalize">
      <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
      {profile.company_name}
    </h1>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-sm md:text-base">
      <InfoItem label="Full Name" value={`${profile.first_name} ${profile.last_name}`} icon={<User />} />
      <InfoItem label="Email" value={profile.email} icon={<Mail />} />
      <InfoItem label="Phone Number" value={profile.phone_number} icon={<Phone />} />
      <InfoItem label="Role in Company" value={profile.role_in_company} icon={<Briefcase />} />
      
      {/* Website */}
      <div className="flex gap-4 items-start md:col-span-2">
        <Globe className="w-5 h-5 text-cyan-400 mt-1" />
        <div>
          <p className="text-gray-400 mb-1">Company Website</p>
          <a
            href={profile.company_website}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 font-semibold underline hover:text-cyan-300 transition-all duration-200 break-words"
          >
            {profile.company_website}
          </a>
        </div>
      </div>
    </div>
  </motion.div>
</div>

    </div>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex gap-4 items-start bg-[#0f172a] border border-zinc-800 p-4 rounded-lg hover:shadow-md hover:shadow-cyan-500/20 transition duration-200"
  >
    <div className="text-cyan-400 mt-1">{icon}</div>
    <div>
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </motion.div>
);

export default EmployerDashboard;
