import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Info, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import {
  cancelTimeSlot,
  listTimeSlots,
} from '../../redux/slices/interviewSlice';
import { useParams } from 'react-router';

const EmployerCreatedTimeSlots = () => {
  const dispatch = useDispatch();
  const {id:jobId} = useParams();
  const { timeSlots, loading, error } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(listTimeSlots(jobId));
  }, [dispatch]);

  const handleCancel = (slotId) => {
    if (window.confirm('Are you sure you want to cancel this time slot?')) {
      dispatch(cancelTimeSlot(slotId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-cyan-400"
        >
          Loading time slots...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-red-400"
        >
          Failed to load time slots. Please try again.
        </motion.p>
      </div>
    );
  }

  if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-400"
        >
          No time slots have been created yet.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold text-cyan-400 text-center mb-10"
      >
        All Scheduled Time Slots
      </motion.h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {timeSlots.map((slot, index) => {
          const formattedStart = dayjs(slot.start_time).format(
            'MMMM D, YYYY - h:mm A'
          );
          const formattedEnd = dayjs(slot.end_time).format('h:mm A');

          return (
            <motion.div
              key={slot.id}
              className="bg-[#1e293b] border border-cyan-700 rounded-2xl shadow-xl p-5 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Title */}
              <div className="flex items-center gap-3 mb-3">
                <Info className="text-cyan-400 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Title</p>
                  <h2 className="text-lg font-semibold text-cyan-300">
                    {slot.title}
                  </h2>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="text-cyan-400 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Date & Time</p>
                  <p className="text-base text-white">
                    {formattedStart} - {formattedEnd}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-cyan-400 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-base text-white">
                    {dayjs(slot.end_time).diff(dayjs(slot.start_time), 'minute')} minutes
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-1">Description</p>
                <p className="text-white">{slot.description}</p>
              </div>

              {/* Status and Created Time */}
              <div className="flex items-center justify-between text-sm mt-2 mb-4">
                <span className="bg-green-700 px-3 py-1 rounded-full text-white font-semibold">
                  {slot.status}
                </span>
                <span className="text-xs text-gray-400">
                  Created at:{' '}
                  {dayjs(slot.created_at).format('MMM D, YYYY h:mm A')}
                </span>
              </div>

              {/* Cancel Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCancel(slot.id)}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                <XCircle className="w-5 h-5" />
                Cancel Time Slot
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployerCreatedTimeSlots;
