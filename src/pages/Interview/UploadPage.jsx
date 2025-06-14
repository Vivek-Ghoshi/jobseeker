import React, { useState } from "react";
import UploadImage from "../../components/UploadImage";
import { useNavigate } from "react-router";


const UploadPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleContinue = () => {
    navigate("/validate-face")
    // window.open("/validate-face", "width=480,height=640");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Facial Verification</h1>
      <UploadImage image={image} setImage={setImage} />
      <button
        onClick={handleContinue}
        disabled={!image}
        className={`mt-6 w-full max-w-xs py-3 rounded-lg transition ${
          image
            ? "bg-cyan-600 hover:bg-cyan-500"
            : "bg-gray-700 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default UploadPage;
