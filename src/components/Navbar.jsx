import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AnimatePresence} from "framer-motion"
import {
  Menu,
  X,
  ArrowLeftCircle,
  LayoutDashboard,
  Briefcase,
  LogIn,
  FileEdit,
  PlusCircle,
  Pencil,
  FolderOpen,
  UserPlus,
  DockIcon,
} from "lucide-react";
import { persistor } from "../redux/store";
import { useSelector } from "react-redux";
import WorkSpace from "./WorkSpace";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isLoggedIn = Boolean(user?.role);

  const commonLinks = [
    {
      name: "Create Resume",
      path: "/resume/builder",
      icon: <FileEdit size={20} />,
    },
  ];

  const employerLinks = [
    {
      name: "Create Job",
      path: "/employer/create-openings",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "Resume Templates",
      path: "/resume-builder/templates/list",
      icon: <Pencil size={20} />,
    },
    {
      name: "Update profile",
      path: "/employer/update-profile",
      icon: <Pencil size={20} />,
    },
    {
      name: "Your Listed Jobs",
      path: "/employer/created-jobs",
      icon: <FolderOpen size={20} />,
    },
  ];

  const jobseekerLinks = [
    {
      name: "Track Applications",
      path: "/jobseeker/all-applications",
      icon: <UserPlus size={20} />,
    },
    {
      name: "View Listed Jobs",
      path: "/jobs/all",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Update profile",
      path: "/jobseeker/update-profile",
      icon: <Pencil size={20} />,
    },
    {
      name: "Resume Templates",
      path: "/resume-builder/templates/list",
      icon: <FolderOpen size={20} />,
    },
    {
      name: "Your Resumes",
      path: "/all-resumelist",
      icon: <DockIcon size={20} />,
    },
  ];

  const links =
    role === "employer"
      ? [...employerLinks, ...commonLinks]
      : [...jobseekerLinks, ...commonLinks];

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      if (role === "job_seeker") {
        navigate("/jobseeker/dashboard");
      } else if (role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <nav className="bg-[#0f172a] text-white w-full z-40 shadow-md border-b border-zinc-700 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Briefcase size={26} className="text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              JobSeeker
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {!isLoggedIn ? (
              <Link
                to="/"
                className="flex items-center hover:text-cyan-400 transition"
              >
                <LogIn className="mr-2" size={20} />
                Login
              </Link>
            ) : (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center hover:text-cyan-400 transition"
                >
                  <ArrowLeftCircle className="mr-2" size={20} />
                  Back
                </button>

                <button
                  onClick={() => setShowWorkspace((prev) => !prev)}
                  className="flex items-center hover:text-cyan-400 transition"
                >
                  WorkSpace
                </button>
                <AnimatePresence>
                  {showWorkspace && (
                    <WorkSpace
                      key="workspace"
                      onClose={() => setShowWorkspace(false)}
                    />
                  )}
                </AnimatePresence>
                <Link
                  to={`/dashboard/${role}`}
                  className="flex items-center hover:text-cyan-400 transition"
                >
                  <LayoutDashboard className="mr-2" size={20} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-red-400 transition"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Drawer */}
      {isOpen && (
        <div className="absolute top-0 right-0 w-64 h-screen bg-black shadow-2xl z-50 p-6 space-y-4 transition-all duration-300 animate-slide-left">
          {!isLoggedIn ? (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center hover:text-cyan-400 transition"
            >
              <LogIn className="mr-2" size={20} />
              Login
            </Link>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate(-1);
                  setIsOpen(false);
                }}
                className="flex items-center hover:text-cyan-400 transition"
              >
                <ArrowLeftCircle className="mr-2" size={20} />
                Back
              </button>

              <Link
                to={`/dashboard/${role}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center hover:text-cyan-400 transition"
              >
                <LayoutDashboard className="mr-2" size={20} />
                Dashboard
              </Link>

              {/* Sidebar links */}
              <div className="pt-2 space-y-2 border-t border-zinc-600">
                {links.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-200 bg-zinc-800 hover:bg-cyan-700/20 hover:scale-[1.02] hover:shadow-md"
                  >
                    <div className="text-cyan-400">{item.icon}</div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center hover:text-red-400 transition pt-2"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
