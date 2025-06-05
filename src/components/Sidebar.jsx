import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  FileText,
  Briefcase,
  Pencil,
  ClipboardList,
  UserPlus,
  FolderOpen,
  FileEdit,
  DockIcon,
} from 'lucide-react';

const Sidebar = ({ role = 'jobseeker' }) => {
  const [open, setOpen] = useState(false);

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
      name: 'Update profile',
      path: '/employer/update-profile',
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
    <>
      {/* Sidebar for large screens */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-[#0f172a] text-white shadow-lg fixed py-2 border-r-[1px] border-zinc-400 ">
        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          {role === 'employer' ? 'Employer Panel' : 'JobSeeker Panel'}
        </div>
        <div className="flex-1 p-4 space-y-4">
          {links.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-cyan-700 hover:scale-[1.02] transition-all duration-200"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={30} className="text-white" /> : <Menu size={30} className="text-white" />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="md:hidden fixed top-0 left-0 w-64 h-full bg-[#0f172a] z-40 p-6 space-y-4 shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4">
            {role === 'employer' ? 'Employer Panel' : 'JobSeeker Panel'}
          </h2>
          {links.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-cyan-700 hover:scale-[1.02] transition-all duration-200"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Sidebar;
