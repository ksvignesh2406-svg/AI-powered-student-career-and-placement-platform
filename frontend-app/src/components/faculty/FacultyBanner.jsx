import { GraduationCap } from 'lucide-react';

export default function FacultyBanner({ pendingLeaves }) {
  return (
    <section className="relative bg-gradient-to-r from-[#007a55] to-[#00875a] text-white p-8 mx-8 mt-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg shadow-emerald-800/10 overflow-hidden gap-6">
      <div className="z-10">
        <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
          <GraduationCap className="w-3.5 h-3.5" />
          Faculty Portal
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Good Morning, Prof. Sharma.</h1>
        <p className="text-sm opacity-90">You have 2 classes scheduled for today.</p>
      </div>
      
      <div className="flex gap-4 z-10">
        <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-xl text-center border border-white/10">
          <span className="block text-2xl font-extrabold">2</span>
          <span className="text-[10px] opacity-85 uppercase tracking-wider">Classes Today</span>
        </div>
        <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-xl text-center border border-white/10">
          <span className="block text-2xl font-extrabold">{pendingLeaves}</span>
          <span className="text-[10px] opacity-85 uppercase tracking-wider">Pending Leaves</span>
        </div>
      </div>

      {/* Decorative background shape */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
    </section>
  );
}
