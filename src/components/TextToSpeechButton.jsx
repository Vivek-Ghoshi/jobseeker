import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // Import Loader2 for the loading spinner

const TextToSpeechButton = ({ text }) => { // Revert to original prop name 'text'
  const [language, setLanguage] = useState("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false); // New state for translation loading
  const [error, setError] = useState(null);

  // We'll use the original 'text' prop directly for synthesis after potential translation
  // No need for a local textToSpeak state if we are always translating the 'text' prop.

  const voiceMap = {
    en: "en-IN-NeerjaNeural", // English (India)
    hi: "hi-IN-SwaraNeural", // Hindi (India)
    ml: "ml-IN-SobhanaNeural", // Malayalam (India)
    ta: "ta-IN-PallaviNeural", // Tamil (India)
  };

  const playAudio = async () => {
    setError(null); // Clear previous errors
    setIsTranslating(true); // Start translation loading

    if (!text) {
      setError("No text provided for speech synthesis.");
      setIsTranslating(false);
      return;
    }

    const selectedVoice = voiceMap[language];
    if (!selectedVoice) {
      setError("Selected language voice not available.");
      setIsTranslating(false);
      return;
    }

    let textForSynthesis = text; // Default to original text (English)

    // --- START: Translation Logic using Gemini API ---
    if (language !== "en") {
      try {
        const chatHistory = [];
        const prompt = `Translate the following English text to ${language}: "${text}"`;
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = {
          contents: chatHistory,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                translatedText: { type: "STRING" },
              },
              propertyOrdering: ["translatedText"],
            },
          },
        };

        const apiKey = import.meta.env.VITE_GEMINI_KEY; // Canvas will provide this at runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Translation API HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (
          result.candidates &&
          result.candidates.length > 0 &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0
        ) {
          const jsonString = result.candidates[0].content.parts[0].text;
          const parsedJson = JSON.parse(jsonString);
          if (parsedJson.translatedText) {
            textForSynthesis = parsedJson.translatedText;
          } else {
            throw new Error("Translation API response missing 'translatedText'.");
          }
        } else {
          throw new Error("Translation API response structure is unexpected.");
        }
      } catch (err) {
        console.error("Translation error:", err);
        setError(`Failed to translate text to ${language}. Please try again.`);
        setIsTranslating(false);
        return; // Stop execution if translation fails
      }
    }
    // --- END: Translation Logic using Gemini API ---

    setIsTranslating(false); // Translation done, now start speaking
    setIsSpeaking(true);

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      import.meta.env.VITE_AZURE_KEY, // Your Azure Speech Service key
      "eastus" // Your Azure Speech Service region
    );

    speechConfig.speechSynthesisVoiceName = selectedVoice;

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

    const synthesizer = new SpeechSDK.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

    synthesizer.speakTextAsync(
      textForSynthesis, // Use the (potentially) translated text
      (result) => {
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          // Success
        } else {
          const detailedError = `Speech synthesis failed. Reason: ${result.reason}. Details: ${result.errorDetails || 'No additional details.'}`;
          console.error(detailedError, result);
          setError(detailedError);
        }
        setIsSpeaking(false);
        synthesizer.close();
      },
      (error) => {
        console.error("Critical Speech synthesis error:", error);
        setError(
          "A critical error occurred during speech synthesis. Please check your network and API key."
        );
        setIsSpeaking(false);
        synthesizer.close();
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
      <div className="relative w-full sm:w-auto">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="appearance-none w-full bg-[#0f172a] text-white border border-cyan-600 rounded-xl px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer disabled:opacity-50"
          disabled={isSpeaking || isTranslating} // Disable dropdown while speaking or translating
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ml">Malayalam</option>
          <option value="ta">Tamil</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      <button
        onClick={playAudio}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSpeaking || isTranslating} // Disable button while speaking or translating
      >
        {isTranslating ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Translating...
          </>
        ) : isSpeaking ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Speaking...
          </>
        ) : (
          "🔊 Listen"
        )}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-2 w-full text-center sm:text-left">
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default TextToSpeechButton;


// import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
// import { useState } from "react";
// import { Loader2 } from "lucide-react"; // Import Loader2 for the loading spinner

// const TextToSpeechButton = ({ text }) => {
//   const [language, setLanguage] = useState("en");
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [error, setError] = useState(null);

//   const voiceMap = {
//     en: "en-IN-NeerjaNeural", // English (India)
//     hi: "hi-IN-SwaraNeural", // Hindi (India)
//     ml: "ml-IN-SobhanaNeural", // Malayalam (India)
//     ta: "ta-IN-PallaviNeural", // Tamil (India)
//     // Add more languages/voices if needed and available in Azure Speech Service
//   };

//   const playAudio = () => {
//     setError(null); // Clear previous errors
//     setIsSpeaking(true); // Set speaking state to true

//     // Ensure text is not empty before attempting synthesis
//     if (!text) {
//       setError("No text provided for speech synthesis.");
//       setIsSpeaking(false);
//       return;
//     }

//     // Ensure the selected language has a valid voice mapping
//     const selectedVoice = voiceMap[language];
//     if (!selectedVoice) {
//       setError("Selected language voice not available.");
//       setIsSpeaking(false);
//       return;
//     }

//     // Initialize SpeechConfig with the Azure Speech Service subscription key and region
//     const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
//       "6G5ZtFhP3ArtJ8XfAeaY143eoXt5h3vMuQsytiIYmf3CO03YT5CcJQQJ99BDACYeBjFXJ3w3AAAAACOG9tTT", // Your Azure Speech Service key
//       "eastus" // Your Azure Speech Service region
//     );

//     // Set the voice name based on the selected language
//     speechConfig.speechSynthesisVoiceName = selectedVoice;

//     // Configure audio output to default speaker
//     const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

//     // Create a new SpeechSynthesizer instance
//     const synthesizer = new SpeechSDK.SpeechSynthesizer(
//       speechConfig,
//       audioConfig
//     );

//     // Start synthesizing the text asynchronously
//     synthesizer.speakTextAsync(
//       text,
//       (result) => {
//         // Callback for when synthesis is completed or fails
//         if (
//           result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
//         ) {
//           // console.log("Speech synthesized successfully."); // Removed console.log
//         } else {
//           setError(
//             `Speech synthesis failed: ${result.errorDetails}. Please try again.`
//           );
//         }
//         setIsSpeaking(false); // Reset speaking state
//         synthesizer.close(); // Close the synthesizer to release resources
//       },
//       (error) => {
//         // Callback for any errors during the synthesis process
//         console.error("Speech synthesis error:", error);
//         setError(
//           "An error occurred during speech synthesis. Please check your connection and try again."
//         );
//         setIsSpeaking(false); // Reset speaking state
//         synthesizer.close(); // Close the synthesizer
//       }
//     );
//   };

//   return (
//     <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
//       <div className="relative w-full sm:w-auto">
//         {/* The <select> element was commented out, now uncommented */}
//         <select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="appearance-none w-full bg-[#0f172a] text-white border border-cyan-600 rounded-xl px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer"
//           disabled={isSpeaking} // Disable dropdown while speaking
//         >
//           <option value="en">English</option>
//           <option value="hi">Hindi</option>
//           <option value="ml">Malayalam</option>
//           <option value="ta">Tamil</option>
//         </select>
//         {/* Custom arrow for select dropdown */}
//         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
//           <svg
//             className="fill-current h-4 w-4"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//           </svg>
//         </div>
//       </div>

//       <button
//         onClick={playAudio}
//         className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={isSpeaking} // Disable button while speaking
//       >
//         {isSpeaking ? (
//           <>
//             <Loader2 className="animate-spin w-4 h-4" /> Speaking...
//           </>
//         ) : (
//           "🔊 Listen"
//         )}
//       </button>

//       {error && (
//         <p className="text-red-400 text-sm mt-2 w-full text-center sm:text-left">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// };

// export default TextToSpeechButton;

// import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
// import { useState } from "react";

// const TextToSpeechButton = ({ text }) => {
//   const [language, setLanguage] = useState("en");
//   const voiceMap = {
//     en: "en-IN-NeerjaNeural",
//     hi: "hi-IN-SwaraNeural",
//     ml: "ml-IN-SobhanaNeural",
//     ta: "ta-IN-PallaviNeural",
//   };
//   const playAudio = () => {
//     const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
//       "6G5ZtFhP3ArtJ8XfAeaY143eoXt5h3vMuQsytiIYmf3CO03YT5CcJQQJ99BDACYeBjFXJ3w3AAAAACOG9tTT",
//       "eastus"
//     );
//     speechConfig.speechSynthesisVoiceName = voiceMap[language];
//     const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
//     const synthesizer = new SpeechSDK.SpeechSynthesizer(
//       speechConfig,
//       audioConfig
//     );

//     synthesizer.speakTextAsync(
//       text,
//       (result) => {
//         if (
//           result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
//         ) {
//           console.log("Speech synthesized.");
//         } else {
//           console.error("Speech synthesis failed.", result.errorDetails);
//         }
//         synthesizer.close();
//       },
//       (error) => {
//         console.error(error);
//         synthesizer.close();
//       }
//     );
//   };

//   return (
//    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
//   <div className="relative w-full sm:w-auto">
//     { <select
//       value={language}
//       onChange={(e) => setLanguage(e.target.value)}
//       className="appearance-none w-full bg-[#0f172a] text-white border border-cyan-600 rounded-xl px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
//     >
//       <option value="en">English</option>
//       <option value="hi">Hindi</option>
//       <option value="ml">Malayalam</option>
//       <option value="ta">Tamil</option>
//     </select> }
//   </div>

//   <button
//     onClick={playAudio}
//     className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
//   >
//     🔊 Listen
//   </button>
// </div>
//   );
// };

// export default TextToSpeechButton;
