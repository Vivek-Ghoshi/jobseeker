import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, Video } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getMeeting } from "../../redux/slices/interviewSlice";
import { useNavigate } from "react-router";

const MeetingDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMeeting, setShowMeeting] = useState(false);
  const { currentMeeting, selectedTimeSlot } = useSelector(
    (state) => state.interview
  );
  
 const handleStartMeeting = () => {
  if (currentMeeting?.jitsi_meeting_url) {
    navigate("/meeting/page", {
      state: { meetingURL: currentMeeting?.jitsi_meeting_url ,appId: currentMeeting?.application_id},
    });
  }
};

  const { role } = useSelector((state) => state.auth);
  useEffect(() => {
    if (role === "jobseeker") {
      dispatch(getMeeting(selectedTimeSlot));
    }
  }, [dispatch, role, selectedTimeSlot]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0f172a] text-white p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="w-full max-w-3xl bg-[#1e293b] rounded-2xl p-6 shadow-lg space-y-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 text-center">
          {currentMeeting?.title}
        </h1>

        <div className="space-y-2">
          <p className="text-gray-300">{currentMeeting?.description}</p>
          <p className="text-sm text-cyan-600">
            Meeting Type: {currentMeeting?.meeting_type}
          </p>
          <p className="text-sm text-gray-400">
            Status:{" "}
            <span className="font-semibold text-white">
              {currentMeeting?.status}
            </span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-[#334155] rounded-lg p-4">
            <CalendarDays className="text-cyan-400 w-6 h-6" />
            <div>
              <p className="text-gray-400 text-sm">Start</p>
              <p className="text-white">
                {new Date(currentMeeting?.scheduled_start).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#334155] rounded-lg p-4">
            <Clock className="text-cyan-400 w-6 h-6" />
            <div>
              <p className="text-gray-400 text-sm">End</p>
              <p className="text-white">
                {new Date(currentMeeting?.scheduled_end).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#334155] rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <Users className="w-5 h-5" /> Participants
          </h3>
          {currentMeeting?.participants.map((p) => (
            <div
              key={p._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#1e293b] px-4 py-2 rounded-md"
            >
              <div>
                <p className="font-medium text-white">
                  {p.first_name} {p.last_name}
                </p>
                <p className="text-sm text-gray-400">{p.email}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 md:p-8 h-10 text-white flex flex-col items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartMeeting}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition-all duration-300"
          >
            Start Meeting
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MeetingDetailsPage;
