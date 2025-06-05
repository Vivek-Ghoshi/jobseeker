import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { uploadResume } from '../redux/slices/resumeBuilderSlice';

const UploadResume = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleSubmit = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      dispatch(uploadResume(formData));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#1e293b] w-full max-w-md rounded-lg shadow-lg p-6 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Upload Resume</h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-cyan-500 rounded-md p-6 text-center cursor-pointer hover:bg-[#334155]"
        >
          <p className="text-sm text-gray-300 mb-2">Drag and drop your resume here</p>
          <p className="text-sm text-gray-400">or click to select a file</p>
          {file && (
            <p className="mt-4 text-emerald-400 text-sm">Selected: {file.name}</p>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-sm"
            disabled={!file}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
