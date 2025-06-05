import { useForm } from "react-hook-form";
import { Building2, Link2, Phone, Users, Briefcase, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateEmployerProfile } from "../../redux/slices/employerSlice";
import { useNavigate } from "react-router";

const UpdateEmployerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "Updated Tech Solutions Ltd",
      company_website: "https://updated-tech.example.com",
      company_size: "LARGE",
      phone_number: "+12345678902",
      role_in_company: "Head of HR",
    },
  });

  const onSubmit = async (data) => {
    const res = await dispatch(updateEmployerProfile(data));
    if (updateEmployerProfile.fulfilled.match(res)) {
      navigate("/dashboard/employer");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1e293b] w-full max-w-5xl rounded-2xl shadow-xl p-8 md:p-12 text-white grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn"
      >
        <h2 className="md:col-span-2 text-3xl font-bold text-cyan-400 text-center mb-6">
          Update Employer Profile
        </h2>

        {/* Company Name */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Company Name
          </label>
          <input
            {...register("company_name", { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 mt-1 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="Enter company name"
          />
          {errors.company_name && (
            <span className="text-red-500 text-sm mt-1">
              This field is required
            </span>
          )}
        </div>

        {/* Website */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            Company Website
          </label>
          <input
            {...register("company_website", { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 mt-1 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="https://your-company.com"
          />
          {errors.company_website && (
            <span className="text-red-500 text-sm mt-1">
              This field is required
            </span>
          )}
        </div>

        {/* Company Size */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Company Size
          </label>
          <select
            {...register("company_size", { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 mt-1 outline-none border border-transparent focus:border-cyan-400 transition-all"
          >
            <option value="1-10">1 - 10 employees</option>
            <option value="11-50">11 - 50 employees</option>
            <option value="51-200">51 - 200 employees</option>
            <option value="201+">201+ employees</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Phone className="w-5 h-5 text-cyan-400" />
            Phone Number
          </label>
          <input
            {...register("phone_number", { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 mt-1 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="+1234567890"
          />
          {errors.phone_number && (
            <span className="text-red-500 text-sm mt-1">
              This field is required
            </span>
          )}
        </div>

        {/* Role in Company */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            Role in Company
          </label>
          <input
            {...register("role_in_company", { required: true })}
            className="bg-[#334155] rounded-lg px-4 py-2 mt-1 outline-none border border-transparent focus:border-cyan-400 transition-all"
            placeholder="Your Role (e.g., HR Manager)"
          />
          {errors.role_in_company && (
            <span className="text-red-500 text-sm mt-1">
              This field is required
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployerProfile;
