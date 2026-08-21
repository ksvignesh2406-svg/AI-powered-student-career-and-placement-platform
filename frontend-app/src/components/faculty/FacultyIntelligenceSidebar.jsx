import { ShieldAlert, FileText } from 'lucide-react';

export default function FacultyIntelligenceSidebar({ leaveRequests, onApprove, onReject }) {
  const handleApprove = (id) => {
    onApprove(id);
  };

  const handleReject = (id) => {
    onReject(id);
  };

  return (
    <aside className="space-y-6">
      {/* At-Risk Students */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            At-Risk Students
          </span>
          <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
            AI Flagged
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">Prompting check-in during upcoming lab session.</p>

        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                AK
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Aarav Kumar</h4>
                <p className="text-xs font-semibold text-rose-600">Missed 3 consecutive classes</p>
              </div>
            </div>
            <button 
              onClick={() => alert('Check-in note flagged for Aarav Kumar during lab.')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Check-in
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                SR
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Sneha Roy</h4>
                <p className="text-xs font-semibold text-rose-600">Attendance below 65%</p>
              </div>
            </div>
            <button 
              onClick={() => alert('Check-in note flagged for Sneha Roy during lab.')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
            >
              Check-in
            </button>
          </div>
        </div>
      </div>

      {/* Leave Approval Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00875a]" />
            Leave Approval Queue
          </span>
        </div>

        <div className="space-y-3">
          {leaveRequests.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No pending requests.</p>
          ) : (
            leaveRequests.map(req => (
              <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>{req.studentName} ({req.course})</span>
                  <span className="text-slate-500 text-[11px] font-normal">{req.type}</span>
                </div>
                <div className="text-xs text-slate-500 mb-3">{req.details}</div>
                
                {req.status === 'approved' ? (
                  <div className="w-full bg-emerald-600 text-white text-center py-1.5 rounded-lg text-xs font-semibold">
                    Approved
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="flex-1 bg-[#00875a] hover:bg-[#006c48] text-white py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
