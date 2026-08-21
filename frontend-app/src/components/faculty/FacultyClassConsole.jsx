import { AlertTriangle, PlayCircle, Clock, CheckSquare } from 'lucide-react';

export default function FacultyClassConsole() {
  return (
    <section className="space-y-6">
      {/* Smart Timetable Conflict Alert */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm mb-0.5">Timetable Conflict Alert (Smart Timetable)</div>
          <div className="text-xs leading-relaxed text-amber-800">
            Overlapping slot detected: <span className="font-semibold">CS301 Lab</span> and <span className="font-semibold">Dept. Meeting</span> both scheduled for 02:00 PM today.
          </div>
        </div>
      </div>

      {/* Active Class & Quick Launch */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-base text-slate-900 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-[#00875a]" />
            Active / Upcoming Class
          </span>
          <span className="text-xs font-bold text-[#00875a] bg-emerald-50 px-2.5 py-1 rounded-md">
            Next Up
          </span>
        </div>

        {/* Quick Launch Card */}
        <div className="border-2 border-[#00875a] bg-emerald-50/60 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">CS301: Data Structures & Algorithms</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 10:00 AM - 11:30 AM &nbsp;|&nbsp; Hall 4B
            </p>
          </div>
          <button 
            onClick={() => alert('Launching Attendance Portal for CS301...')}
            className="bg-[#00875a] hover:bg-[#006c48] text-white font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20 active:scale-95"
          >
            <CheckSquare className="w-4 h-4" />
            Mark Attendance for CS301
          </button>
        </div>

        {/* Subsequent Classes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-slate-50">
            <div>
              <div className="font-bold text-sm">CS502: Advanced Operating Systems</div>
              <div className="text-xs text-slate-500 font-medium">02:00 PM - 03:30 PM &nbsp;•&nbsp; Lab 2</div>
            </div>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              View Roster
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
