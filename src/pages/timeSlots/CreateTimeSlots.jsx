import { useState } from "react";
import { motion } from "framer-motion";
import { X, PlusCircle } from "lucide-react";

export default function CreateTimeSlots({ details, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(45);
  const [startTimes, setStartTimes] = useState([""]);
  console.log(details)
  const handleAddSlot = () => setStartTimes([...startTimes, ""]);
  const handleRemoveSlot = (index) => {
    const updated = startTimes.filter((_, i) => i !== index);
    setStartTimes(updated);
  };

  const handleSlotChange = (index, value) => {
    const updated = [...startTimes];
    updated[index] = value;
    setStartTimes(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      job_id: details.job_id,
      application_id: details.id,
      title,
      description,
      duration_minutes: duration,
      meeting_type: "INTERVIEW",
      start_times: startTimes.filter(Boolean),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -50 }}
      className="bg-[#1e293b] text-white p-6 rounded-2xl shadow-xl max-w-xl w-full mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl font-bold">Create Interview Time Slots</h2>

        <div>
          <label className="text-sm mb-1 block">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-[#0f172a] border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Description</label>
          <textarea
            className="w-full p-2 rounded bg-[#0f172a] border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="text-sm mb-1 block">Duration (minutes)</label>
          <input
            type="number"
            min={15}
            max={180}
            step={15}
            className="w-full p-2 rounded bg-[#0f172a] border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Start Times</label>
          <div className="space-y-2">
            {startTimes.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={slot}
                  onChange={(e) => handleSlotChange(idx, e.target.value)}
                  className="flex-1 p-2 rounded bg-[#0f172a] border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                {startTimes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSlot}
              className="flex items-center text-cyan-500 hover:text-cyan-300 gap-1 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Another Time Slot
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold p-2 rounded-lg transition"
        >
          Submit Time Slots
        </button>
      </form>
    </motion.div>
  );
}
