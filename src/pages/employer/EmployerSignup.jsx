import React from 'react';
import RoleBasedSignup from '../../components/RoleBasedSignup';


export default function JobseekerSignup() {
   return <RoleBasedSignup role="jobseeker" />;
   }


// import React from 'react';
// import { useForm } from 'react-hook-form';

// const EmployerSignup = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm({ mode: 'onChange' });

//   const onSubmit = (data) => {
//     console.log('Employer Signup Data:', data);
//     // Call your signup API here
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-lg p-8">
//         <h2 className="text-3xl font-bold text-center mb-6">Employer Registration</h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* First Name */}
//           <div>
//             <label className="block mb-1 text-sm">First Name</label>
//             <input
//               type="text"
//               {...register('first_name', { required: 'First name is required' })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="John"
//             />
//             {errors.first_name && <p className="text-red-400 text-sm">{errors.first_name.message}</p>}
//           </div>

//           {/* Last Name */}
//           <div>
//             <label className="block mb-1 text-sm">Last Name</label>
//             <input
//               type="text"
//               {...register('last_name', { required: 'Last name is required' })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Smith"
//             />
//             {errors.last_name && <p className="text-red-400 text-sm">{errors.last_name.message}</p>}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block mb-1 text-sm">Email</label>
//             <input
//               type="email"
//               {...register('email', {
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                   message: 'Invalid email',
//                 },
//               })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="employer@example.com"
//             />
//             {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
//           </div>

//           {/* Phone Number */}
//           <div>
//             <label className="block mb-1 text-sm">Phone Number</label>
//             <input
//               type="tel"
//               {...register('phone_number', {
//                 required: 'Phone number is required',
//                 minLength: { value: 10, message: 'Enter a valid phone number' },
//               })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="+12345678901"
//             />
//             {errors.phone_number && <p className="text-red-400 text-sm">{errors.phone_number.message}</p>}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-1 text-sm">Password</label>
//             <input
//               type="password"
//               {...register('password', {
//                 required: 'Password is required',
//                 minLength: {
//                   value: 6,
//                   message: 'Password must be at least 6 characters',
//                 },
//               })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="password123"
//             />
//             {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
//           </div>

//           {/* Company Name */}
//           <div>
//             <label className="block mb-1 text-sm">Company Name</label>
//             <input
//               type="text"
//               {...register('company_name', { required: 'Company name is required' })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Tech Solutions Ltd"
//             />
//             {errors.company_name && <p className="text-red-400 text-sm">{errors.company_name.message}</p>}
//           </div>

//           {/* Company Website */}
//           <div>
//             <label className="block mb-1 text-sm">Company Website</label>
//             <input
//               type="url"
//               {...register('company_website', { required: 'Website is required' })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="https://techsolutions.example.com"
//             />
//             {errors.company_website && <p className="text-red-400 text-sm">{errors.company_website.message}</p>}
//           </div>

//           {/* Company Size */}
//           <div>
//             <label className="block mb-1 text-sm">Company Size</label>
//             <select
//               {...register('company_size', { required: 'Company size is required' })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select size</option>
//               <option value="1-10">1-10</option>
//               <option value="11-50">11-50</option>
//               <option value="51-200">51-200</option>
//               <option value="201-500">201-500</option>
//               <option value="500+">500+</option>
//             </select>
//             {errors.company_size && <p className="text-red-400 text-sm">{errors.company_size.message}</p>}
//           </div>

//           {/* Role in Company */}
//           <div>
//             <label className="block mb-1 text-sm">Your Role in Company</label>
//             <input
//               type="text"
//               {...register('role_in_company', { required: 'Role is required' })}
//               className="w-full px-4 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="HR Manager"
//             />
//             {errors.role_in_company && <p className="text-red-400 text-sm">{errors.role_in_company.message}</p>}
//           </div>

//           {/* Submit Button */}
//           <div className="md:col-span-2">
//             <button
//               type="submit"
//               disabled={!isValid}
//               className={`w-full py-3 rounded font-semibold transition text-white ${
//                 isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
//               }`}
//             >
//               Sign Up as Employer
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EmployerSignup;
