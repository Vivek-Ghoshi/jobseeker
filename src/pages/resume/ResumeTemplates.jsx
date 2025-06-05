import { Eye, FilePlus } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listResumeTemplates } from '../../redux/slices/resumeBuilderSlice';

const ResumeTemplates = () => {
   const dispatch = useDispatch();
   const {templates} = useSelector(state => state.resumebuilder);
   useEffect(()=>{
     dispatch(listResumeTemplates());
   },[dispatch]);
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10 text-white">
      <h1 className="text-center text-3xl md:text-4xl font-bold text-cyan-400 mb-10">
        Browse Resume Templates
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {templates && templates.map((template) => (
          <div
            key={template.id}
            className="bg-[#1e293b] border border-cyan-700 rounded-lg shadow-md hover:shadow-cyan-600/40 p-4 transition-all duration-300 flex flex-col"
          >
            {/* Preview Image */}
            <div className="relative overflow-hidden rounded-md border border-gray-600 h-56 mb-4">
              <img
                src={template.previewImage}
                alt={template.name}
                className="object-cover w-full h-full transform scale-105 blur-[1.5px] contrast-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a] opacity-80"></div>
              <div className="absolute bottom-2 left-2 text-xs text-gray-300">
                Partial Preview
              </div>
            </div>

            {/* Details */}
            <h2 className="text-xl font-semibold text-cyan-300 mb-1">{template.name}</h2>
            <p className="text-sm text-gray-400 mb-4">
              Best suited for: <span className="text-white">{template.description}</span>
            </p>

            {/* Buttons */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-sm py-2 px-4 rounded-md transition duration-200">
                <Eye className="w-4 h-4" />
                View Full Template
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-sm py-2 px-4 rounded-md transition duration-200">
                <FilePlus className="w-4 h-4" />
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;
