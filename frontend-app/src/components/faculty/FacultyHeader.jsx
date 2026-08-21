import { Sparkles } from 'lucide-react';

export default function FacultyHeader() {
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2.5 font-extrabold text-xl text-[#00875a]">
        <div className="bg-[#00875a] text-white p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <span>Campus OS</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-bold text-sm">Prof. Sharma</div>
          <div className="text-xs text-slate-500">Computer Science Dept.</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#00875a] flex items-center justify-center font-bold border-2 border-[#00875a]">
          PS
        </div>
      </div>
    </header>
  );
}
