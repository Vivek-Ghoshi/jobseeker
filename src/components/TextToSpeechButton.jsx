import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { useState } from "react";

const TextToSpeechButton = ({ text }) => {
  const [language, setLanguage] = useState("en");
  const voiceMap = {
    en: "en-IN-NeerjaNeural",
    hi: "hi-IN-SwaraNeural",
    ml: "ml-IN-SobhanaNeural",
    ta: "ta-IN-PallaviNeural",
  };
  const playAudio = () => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      "6G5ZtFhP3ArtJ8XfAeaY143eoXt5h3vMuQsytiIYmf3CO03YT5CcJQQJ99BDACYeBjFXJ3w3AAAAACOG9tTT",
      "eastus"
    );
    speechConfig.speechSynthesisVoiceName = voiceMap[language];
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          console.log("Speech synthesized.");
        } else {
          console.error("Speech synthesis failed.", result.errorDetails);
        }
        synthesizer.close();
      },
      (error) => {
        console.error(error);
        synthesizer.close();
      }
    );
  };

  return (
   <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
  <div className="relative w-full sm:w-auto">
    {/* <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="appearance-none w-full bg-[#0f172a] text-white border border-cyan-600 rounded-xl px-4 py-2 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
    >
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="ml">Malayalam</option>
      <option value="ta">Tamil</option>
    </select> */}
  </div>

  <button
    onClick={playAudio}
    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
  >
    🔊 Listen
  </button>
</div>
  );
};

export default TextToSpeechButton;
