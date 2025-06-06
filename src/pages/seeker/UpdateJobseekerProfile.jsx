import { useForm } from "react-hook-form";
import {
  User,
  Phone,
  BadgeCheck,
  BookOpen,
  Code,
  Briefcase,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  updateJobSeekerProfile,
  updateJobSeekerProfileExtended,
} from "../../redux/slices/jobSeekerSlice";

const UpdateJobseekerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.jobseeker);
  const [activeSection, setActiveSection] = useState("basic");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
      title: profile.profile.title,
      bio: profile.profile.bio,
      skills: profile.profile.skills?.join(", ") || "",
      experience_years: profile.profile.experience_years,
    },
  });

  const handleBasicSubmit = async (data) => {
    const basicData = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
    };

    const res = await dispatch(updateJobSeekerProfile(basicData));

    if (updateJobSeekerProfile.fulfilled.match(res)) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleProfessionalSubmit = async (data) => {
    const professionalData = {
      title: data.title,
      bio: data.bio,
      skills: data.skills.split(",").map((s) => s.trim()),
      experience_years: data.experience_years,
    };

    const res = await dispatch(updateJobSeekerProfileExtended(professionalData));
    if (updateJobSeekerProfileExtended.fulfilled.match(res)) {
      navigate("/dashboard/jobseeker");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white relative">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity animate-fadeIn">
          ✅ Basic Profile Updated Successfully!
        </div>
      )}

      <div className="w-full max-w-4xl bg-[#1e293b] p-6 md:p-10 rounded-xl shadow-lg">
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveSection("basic")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeSection === "basic"
                ? "bg-cyan-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveSection("professional")}
            className={`px-4 py-2 rounded-md font-semibold ${
              activeSection === "professional"
                ? "bg-cyan-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Professional Info
          </button>
        </div>

        <form
          onSubmit={handleSubmit(
            activeSection === "basic"
              ? handleBasicSubmit
              : handleProfessionalSubmit
          )}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {activeSection === "basic" && (
            <>
              {/* First Name */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" /> First Name
                </label>
                <input
                  {...register("first_name", { required: true })}
                  className="bg-[#334155] rounded px-3 py-1 text-sm"
                  placeholder="Jane"
                />
                {errors.first_name && (
                  <span className="text-red-500 text-xs">Required</span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" /> Last Name
                </label>
                <input
                  {...register("last_name", { required: true })}
                  className="bg-[#334155] rounded px-3 py-1 text-sm"
                  placeholder="Doe"
                />
                {errors.last_name && (
                  <span className="text-red-500 text-xs">Required</span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" /> Phone Number
                </label>
                <input
                  {...register("phone_number", { required: true })}
                  className="bg-[#334155] rounded px-3 py-1 text-sm"
                  placeholder="+1234567890"
                />
                {errors.phone_number && (
                  <span className="text-red-500 text-xs">Required</span>
                )}
              </div>
            </>
          )}

          {activeSection === "professional" && (
            <>
              {/* Title */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-cyan-400" /> Job Title
                </label>
                <input
                  {...register("title", { required: true })}
                  className="bg-[#334155] rounded px-3 py-1 text-sm"
                  placeholder="Software Developer"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" /> Experience
                  (Years)
                </label>
                <input
                  type="number"
                  {...register("experience_years", { required: true })}
                  className="bg-[#334155] rounded px-3 py-1 text-sm"
                  placeholder="5"
                />
              </div>

              {/* Skills */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" /> Skills
                  (comma-separated)
                </label>
                <input
                  {...register("skills", { required: true })}
                  className="bg-[#334155] rounded px-3 py-1 text-sm"
                  placeholder="React, JavaScript"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Bio
                </label>
                <textarea
                  {...register("bio", { required: true })}
                  rows={3}
                  className="bg-[#334155] rounded px-3 py-2 text-sm resize-none"
                  placeholder="Your professional summary..."
                />
              </div>
            </>
          )}

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="mt-4 bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save {activeSection === "basic" ? "Basic" : "Professional"} Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobseekerProfile;
