import { motion } from 'framer-motion';
import { CalendarDays, Clock, Briefcase, Link2 } from 'lucide-react';

const interviews = [
  {
    id: 1,
    date: '2025-06-10',
    time: '10:30 AM',
    jobTitle: 'Frontend Developer',
    company: 'TechNova Inc.',
    location: 'Remote',
  },
  {
    id: 2,
    date: '2025-06-12',
    time: '2:00 PM',
    jobTitle: 'Backend Engineer',
    company: 'CloudStack Ltd.',
    location: 'Bangalore',
  },
];

export default function ScheduledInterviews() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl md:text-xl font-bold mb-6 text-white"
      >
        Scheduled Interviews
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2">
        {interviews.map((interview, index) => (
          <motion.div
            key={interview.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-[#0f172a] border border-cyan-700 rounded-2xl shadow-lg hover:shadow-cyan-500/20 p-5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="text-cyan-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">{interview.jobTitle}</h2>
                <p className="text-sm text-gray-400">{interview.company} | {interview.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-cyan-500" /> {interview.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-cyan-500" /> {interview.time}
              </div>
            </div>

            <button
              className="bg-cyan-600 hover:bg-cyan-500 text-white w-full transition rounded-xl py-2 flex items-center justify-center gap-2"
              onClick={() => alert(`Generating meeting link for interview ID ${interview.id}`)}
            >
              <Link2 className="w-4 h-4" /> Generate Meeting Link
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
