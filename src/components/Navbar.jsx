import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowLeftCircle,
  LayoutDashboard,
  Briefcase,
  LogIn,
} from 'lucide-react';
import { persistor } from '../redux/store';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await persistor.purge();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isLoggedIn = Boolean(user?.role);

  return (
    <nav className="bg-[#0f172a] text-white w-full z-50 shadow-md border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Briefcase size={26} className="text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wide">
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
                  onClick={() => navigate(-1)}
                  className="flex items-center hover:text-cyan-400 transition"
                >
                  <ArrowLeftCircle className="mr-2" size={20} />
                  Back
                </button>

                <Link
                  to={`/dashboard/${user?.role}`}
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

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1e293b] px-6 py-4 space-y-3 animate-slide-down">
          {!isLoggedIn ? (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full hover:text-cyan-400 transition"
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
                className="flex items-center w-full hover:text-cyan-400 transition"
              >
                <ArrowLeftCircle className="mr-2" size={20} />
                Back
              </button>

              <Link
                to={`/dashboard/${user?.role}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full hover:text-cyan-400 transition"
              >
                <LayoutDashboard className="mr-2" size={20} />
                Dashboard
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center w-full hover:text-red-400 transition"
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

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, X, ArrowLeftCircle, LayoutDashboard } from 'lucide-react';
// import { persistor } from '../redux/store'; // 🔁 Adjust import path based on your store setup
// import { useSelector } from 'react-redux';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useSelector(state => state.auth);
//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleLogout = async () => {
//     try {
//       await persistor.purge(); 
//       localStorage.clear();     
//       sessionStorage.clear();   
//       window.location.replace('/'); 
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//   };

//   return (
//     <nav className="bg-[#0f172a] text-white w-full z-50 shadow-md border-b-[1px] border-zinc-400">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <h1 className="text-2xl font-bold text-cyan-400 tracking-wide">JobSeeker</h1>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex space-x-6 items-center">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center hover:text-cyan-400 transition"
//             >
//               <ArrowLeftCircle className="mr-2" size={20} />
//               Back
//             </button>

//             <Link
//               to={`/dashboard/${user?.role}`}
//               className="flex items-center hover:text-cyan-400 transition"
//             >
//               <LayoutDashboard className="mr-2" size={20} />
//               Dashboard
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="flex items-center hover:text-red-400 transition"
//             >
//               <span className="mr-2">🚪</span>
//               Logout
//             </button>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="md:hidden flex items-center">
//             <button onClick={toggleMenu}>
//               {isOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-[#1e293b] px-6 py-4 space-y-3 animate-slide-down">
//           <button
//             onClick={() => {
//               navigate(-1);
//               setIsOpen(false);
//             }}
//             className="flex items-center w-full hover:text-cyan-400 transition"
//           >
//             <ArrowLeftCircle className="mr-2" size={20} />
//             Back
//           </button>

//           <Link
//             to={`/dashboard/${user?.role}`}
//             onClick={() => setIsOpen(false)}
//             className="flex items-center w-full hover:text-cyan-400 transition"
//           >
//             <LayoutDashboard className="mr-2" size={20} />
//             Dashboard
//           </Link>

//           <button
//             onClick={() => {
//               handleLogout();
//               setIsOpen(false);
//             }}
//             className="flex items-center w-full hover:text-red-400 transition"
//           >
//             <span className="mr-2">🚪</span>
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
