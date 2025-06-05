import {
  Building2,
  Mail,
  Phone,
  User,
  Globe,
  Briefcase,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const { profile } = useSelector(state => state.employer);

  return (
    <div className="flex h-[42.1vw] bg-[#0f172a] text-white">
      {/* Sidebar */}
      <div className="w-[250px] hidden md:block border-r border-[#1e293b] bg-[#0f172a]">
        <Sidebar role="employer" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative bg-[#1e293b] w-full max-w-4xl rounded-xl shadow-lg p-6 md:p-10 hover:shadow-cyan-700/30 transition-all duration-300">

          {/* Update Profile Button */}
          <div className="absolute top-4 right-4">
            <Link
              to="/employer/update-profile"
              className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm md:text-base font-semibold rounded-lg shadow-md transition-all duration-200"
            >
              Update Profile
            </Link>
          </div>

          {/* Company Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-8 text-center flex items-center justify-center gap-2">
            <Building2 className="w-8 h-8 text-cyan-500" />
            {profile.company_name}
          </h1>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
            {/* Full Name */}
            <div className="flex gap-3 items-start">
              <User className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Full Name</p>
                <p className="text-white font-medium">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3 items-start">
              <Mail className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Email</p>
                <p className="text-white font-medium">{profile.email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex gap-3 items-start">
              <Phone className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Phone Number</p>
                <p className="text-white font-medium">{profile.phone_number}</p>
              </div>
            </div>

            {/* Role in Company */}
            <div className="flex gap-3 items-start">
              <Briefcase className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Role in Company</p>
                <p className="text-white font-medium">{profile.role_in_company}</p>
              </div>
            </div>

            {/* Website */}
            <div className="flex gap-3 items-start md:col-span-2">
              <Globe className="w-5 h-5 text-cyan-400 mt-1" />
              <div>
                <p className="text-gray-400 mb-1">Company Website</p>
                <a
                  href={profile.company_website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 font-medium underline hover:text-cyan-300 transition-all duration-200 break-words"
                >
                  {profile.company_website}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
