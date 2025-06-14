import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const FaceValidation = () => {
  const navigate = useNavigate();
  const webcamRef = useRef();
  const uploadedImage = useSelector(
    (state) => state.candidateVerification.uploadedImage
  );
  const [status, setStatus] = useState("Loading models...");

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

      setStatus("Analyzing faces...");
      validateFace();
    };

    const validateFace = async () => {
      const uploadedImg = await faceapi.fetchImage(uploadedImage);
      const uploadedDescriptor = await faceapi
        .detectSingleFace(uploadedImg, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!uploadedDescriptor) {
        setStatus("No face detected in uploaded image.");
        return;
      }
      const interval = setInterval(async () => {
        if (!webcamRef.current) {
          console.warn("Webcam is not ready yet.");
          return;
        }

        const screenshot = webcamRef.current.getScreenshot();
        if (!screenshot) {
          console.warn("No screenshot available.");
          return;
        }

        try {
          const webcamImg = await faceapi.fetchImage(screenshot);

          const webcamDescriptor = await faceapi
            .detectSingleFace(webcamImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (webcamDescriptor) {
            const distance = faceapi.euclideanDistance(
              uploadedDescriptor.descriptor,
              webcamDescriptor.descriptor
            );

            if (distance < 0.5) {
              clearInterval(interval);
              setStatus("Face validated ✅");
              setTimeout(() => {
                navigate("/exam");
                window.close();
              }, 2000);
            } else {
              setStatus("Face does not match. Please try again.");
            }
          }
        } catch (err) {
          console.error("Error during face validation:", err);
        }
      }, 1500);
    };

    loadModels();
  }, [uploadedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-[#0f0f1a] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold mb-4">Face Validation</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border border-cyan-400 w-72 h-72"
      />
      <p className="mt-4 text-sm text-cyan-400">{status}</p>
    </div>
  );
};

export default FaceValidation;
