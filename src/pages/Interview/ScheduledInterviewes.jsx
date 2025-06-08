import { motion } from 'framer-motion';
import { CalendarDays, Clock, Briefcase, Pencil, Trash2, ExternalLink, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cancelMeeting, getMeeting, MeetingsList, updateMeeting } from '../../redux/slices/interviewSlice';

const ScheduledMeetings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {meetingsData} = useSelector((state) => state.interview);
    useEffect(()=>{
       dispatch(MeetingsList());
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
       await dispatch(cancelMeeting(id));  
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
      <div className="grid gap-6 md:grid-cols-2">
        {meetingsData.meetings.map((meeting, index) => (
          <motion.div
            key={meeting.meeting_id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-[#0f172a] border border-cyan-700 rounded-2xl shadow-lg hover:shadow-cyan-500/20 p-5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="text-cyan-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">{meeting.title}</h2>
                <p className="text-sm text-gray-400">Status: {meeting.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-cyan-500" />{' '}
                {new Date(meeting.scheduled_start).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-500" />{' '}
                {new Date(meeting.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 font-semibold">
              <button
                onClick={() => handleUpdate(meeting.meeting_id)}
                className="bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl py-2 flex items-center justify-center gap-2 text-sm"
              >
                <Pencil className="w-4 h-4" /> Update
              </button>
              <button
                onClick={() => handleCancel(meeting.meeting_id)}
                className="bg-red-600 hover:bg-red-500 text-white rounded-xl py-2 flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={() => handleView(meeting.meeting_id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 flex items-center justify-center gap-2 text-sm"
              >
                <Eye className="w-4 h-4" /> View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledMeetings;
