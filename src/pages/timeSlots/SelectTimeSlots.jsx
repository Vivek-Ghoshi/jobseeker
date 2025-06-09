import React, { useEffect } from "react";
import { motion } from "framer-motion";

import { CalendarDays, Clock, Info } from "lucide-react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { listTimeSlots, selectTimeSlot } from "../../redux/slices/interviewSlice";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router";

const SelectTimeSlots = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { timeSlots } = useSelector((state) => state.interview);
  console.log(timeSlots);
  useEffect(() => {
    dispatch(listTimeSlots());
  }, [dispatch]);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  const onSelect = async(id)=>{
     const res = await dispatch(selectTimeSlot(id));
     if(selectTimeSlot.fulfilled.match(res)){
        navigate("/meeting/details");
     }
  }
  return (
    <div className="p-4 sm:p-6 bg-[#0f172a] min-h-screen text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-cyan-400">
        Select Available Interview Slot
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {timeSlots.map((slot, index) => (
          <motion.div
            key={slot.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-[#1e293b] shadow-lg p-5 transition duration-300 hover:border-cyan-400 border border-transparent"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-1">
              {slot.title}
            </h3>
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-yellow-400" /> {slot.description}
            </p>
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4 text-green-400" />
              {dayjs.utc(slot.start_time).local().format("dddd, MMMM D YYYY")}
            </p>
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-400" />
              {dayjs.utc(slot.start_time).local().format("hh:mm A")}
            </p>
            <button
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold w-full py-2 rounded-xl"
              onClick={() => onSelect(slot.id)}
            >
              Select Slot
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SelectTimeSlots;
