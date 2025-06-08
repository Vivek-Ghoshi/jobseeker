import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogIn, Briefcase, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: 'onChange' });
  const {role} = useSelector(state => state.auth);
  const [lrole, setlRole] = useState('jobseeker');

   useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn && role) {
      navigate(`/dashboard/${role}`);
    }
  }, [navigate, role]);

  const onSubmit = async (data) => {
    const response = await dispatch(login(data));
    if(login.fulfilled.match(response)){
      navigate(`/dashboard/${lrole}`);
    }
  };

  const email = watch('email');
  const password = watch('password');

  return (
    <div className="min-h-screen flex justify-center items-start sm:items-center pt-10 sm:pt-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Role Selector */}
        <div className="flex justify-center mb-4 space-x-4">
          <button
            onClick={() => setlRole('jobseeker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition 
              ${lrole === 'jobseeker' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}
              hover:bg-blue-500`}
          >
            <User size={16} /> Job Seeker
          </button>
          <button
            onClick={() => setlRole('employer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition 
              ${lrole === 'employer' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}
              hover:bg-green-500`}
          >
            <Briefcase size={16} /> Employer
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-3">
          {/* Email Field */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded font-semibold transition 
              ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}
              text-white`}
          >
            <LogIn size={18} /> Login
          </button>
        </form>
      <p className='ml-24 text-sm font-semibold text-zinc-300'>Dont have account ? <span className='text-blue-400'><Link to={'/choose-role'}> Signup </Link></span> </p>
      </div>
    </div>
  );
};

export default Login;
