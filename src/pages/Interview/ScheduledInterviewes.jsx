import { Briefcase, CalendarDays, Clock, Eye, Pencil, Trash2, CalendarX2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelMeeting, getMeeting, MeetingsList, updateMeeting } from '../../redux/slices/interviewSlice';
  
const ScheduledMeetings = () => {
  const {id:jobId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {meetingsData} = useSelector((state) => state.interview);
    useEffect(()=>{
       dispatch(MeetingsList(jobId));
  },[dispatch])

   const handleUpdate = async (id) => {
    try {
      await dispatch(updateMeeting({ meetingId: id, value: "COMPLETED" }));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      console.log("chala",id);
       await dispatch(cancelMeeting(id));  
       console.log("waps aaya");
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const handleView = async(id) => {
    try {
      const res = await dispatch(getMeeting(id));
      if(getMeeting.fulfilled.match(res)){
        navigate("/meeting/details");
      }
    } catch (error) {
      console.error("handleView : ",error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl md:text-2xl font-bold mb-6 text-white"
      >
        Scheduled Meetings   
      </motion.h1>
      <h3 className='text-orange-400 mb-4 font-semibold'>Total Meetings : {meetingsData.total}</h3>
        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
        <AnimatePresence>
          {meetingsData?.meetings?.length > 0 ? (
            meetingsData?.meetings.map((meeting, index) => (
              <motion.div
                key={meeting.meeting_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#0f172a] to-[#112a4d] border border-cyan-700 rounded-2xl shadow-lg hover:shadow-cyan-500/30 p-6 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="text-cyan-400 w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{meeting.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">Status: <span className="text-white">{meeting.status}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-300 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-cyan-500" />
                    {new Date(meeting.scheduled_start).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    {new Date(meeting.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-semibold text-sm">
                  <button
                    onClick={() => handleUpdate(meeting.meeting_id)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl py-2 flex items-center justify-center gap-2 transition"
                  >
                    <Pencil className="w-4 h-4" /> Update
                  </button>
                  <button
                    onClick={() => handleCancel(meeting.meeting_id)}
                    className="bg-red-600 hover:bg-red-500 text-white rounded-xl py-2 flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={() => handleView(meeting.meeting_id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full flex flex-col items-center justify-center mt-20 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CalendarX2 className="text-cyan-500 w-16 h-16 mb-4 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mb-2">
                No Pending Meetings
              </h2>
              <p className="text-gray-400">
                You currently have no scheduled interviews. Please check back later.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScheduledMeetings;
