import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User } from 'lucide-react';

const ChooseRole = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center px-4 py-10 items-start sm:items-center pt-10 sm:pt-0">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Employer Card */}
        <Link
          to="/signup/employer"
          className="group bg-gray-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition hover:scale-105 border border-gray-700 hover:border-blue-500"
        >
          <Briefcase size={48} className="text-blue-500 group-hover:scale-110 transition" />
          <h2 className="text-2xl font-bold mt-4 text-white">Are You an Employer?</h2>
          <p className="mt-2 text-gray-300">
            Post jobs, manage applications and find the best talent for your company.
          </p>
          <span className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold text-sm group-hover:bg-blue-700 transition">
            Register as Employer
          </span>
        </Link>

        {/* Job Seeker Card */}
        <Link
          to="/signup/jobseeker"
          className="group bg-gray-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition hover:scale-105 border border-gray-700 hover:border-green-500"
        >
          <User size={48} className="text-green-500 group-hover:scale-110 transition" />
          <h2 className="text-2xl font-bold mt-4 text-white">Looking for a Job?</h2>
          <p className="mt-2 text-gray-300">
            Discover job opportunities, apply quickly and manage your job applications easily.
          </p>
          <span className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-full font-semibold text-sm group-hover:bg-green-700 transition">
            Register as Job Seeker
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ChooseRole;
