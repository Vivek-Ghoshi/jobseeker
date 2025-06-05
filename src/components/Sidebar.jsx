import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Briefcase,
  Pencil,
  UserPlus,
  FolderOpen,
  FileEdit,
  DockIcon,
} from 'lucide-react';

const Sidebar = ({ role = 'jobseeker' }) => {
  const commonLinks = [
    {
      name: 'Create Resume',
      path: '/resume/builder',
      icon: <FileEdit size={20} />,
    },
  ];

  const employerLinks = [
    {
      name: 'Create Job',
      path: '/employer/create-openings',
      icon: <PlusCircle size={20} />,
    },
    {
      name: 'Resume Templates',
      path: '/resume-builder/templates/list',
      icon: <Pencil size={20} />,
    },
    {
      name: 'Your Listed Jobs',
      path: '/employer/created-jobs',
      icon: <FolderOpen size={20} />,
    },
  ];

  const jobseekerLinks = [
    {
      name: 'Track Applications',
      path: '/jobseeker/all-applications',
      icon: <UserPlus size={20} />,
    },
    {
      name: 'View Listed Jobs',
      path: '/jobs/all',
      icon: <Briefcase size={20} />,
    },
    {
      name: 'Update profile',
      path: '/jobseeker/update-profile',
      icon: <Pencil size={20} />,
    },
    {
      name: 'Resume Templates',
      path: '/resume-builder/templates/list',
      icon: <FolderOpen size={20} />,
    },
    {
      name: 'Your Resumes',
      path: '/all-resumelist',
      icon: <DockIcon size={20} />,
    },
  ];

  const links = role === 'employer'
    ? [...employerLinks, ...commonLinks]
    : [...jobseekerLinks, ...commonLinks];

  return (
    // Sidebar only visible on md+ screens
    <div className="hidden md:flex flex-col w-64 h-screen bg-black text-white shadow-lg  py-2 border-r border-zinc-800">
      <div className="text-2xl font-extrabold p-6 border-b border-zinc-800 tracking-wide text-cyan-400">
        {role === 'employer' ? 'Employer Panel' : 'JobSeeker Panel'}
      </div>
      <div className="flex-1 p-4 space-y-2">
        {links.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 bg-zinc-900 hover:bg-cyan-700/20 hover:scale-[1.02] hover:shadow-md"
          >
            <div className="text-cyan-400">{item.icon}</div>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
