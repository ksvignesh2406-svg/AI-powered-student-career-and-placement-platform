import { AlertCircle, Check, FileText, X } from "lucide-react";

export default function FacultyIntelligenceSidebar({ atRiskStudents, leaveRequests, onApprove, onReject }) {
  return (
    <aside className="faculty-sidebar">
      <section className="faculty-panel">
        <div className="faculty-panel-heading">
          <div><span className="faculty-section-kicker">Class intelligence</span><h2>At-risk students</h2></div>
          <AlertCircle size={18} className="faculty-risk-icon" />
        </div>
        <p className="faculty-panel-note">AI flags students who need a check-in during lab.</p>
        <div className="faculty-risk-list">
          {atRiskStudents.map((student) => (
            <div className="faculty-risk-item" key={student.name}>
              <span className="faculty-risk-avatar">{student.initials}</span>
              <div><strong>{student.name}</strong><span>{student.signal}</span></div>
              <button type="button" className="faculty-secondary-action">Check in</button>
            </div>
          ))}
        </div>
      </section>

      <section className="faculty-panel">
        <div className="faculty-panel-heading">
          <div><span className="faculty-section-kicker">Academic workflow</span><h2>Leave approvals</h2></div>
          <span className="faculty-count-badge">{leaveRequests.length}</span>
        </div>
        <div className="faculty-leave-list">
          {leaveRequests.map((request) => (
            <article className="faculty-leave-item" key={request.id}>
              <div className="faculty-leave-meta"><strong>{request.studentName}</strong><span>{request.course} · {request.type}</span></div>
              <p>{request.details}</p>
              {request.status === "approved" ? (
                <div className="faculty-approved"><Check size={15} /> Approved</div>
              ) : (
                <div className="faculty-action-row">
                  <button type="button" className="faculty-primary-action" onClick={() => onApprove(request.id)}><Check size={15} /> Approve</button>
                  <button type="button" className="faculty-danger-action" onClick={() => onReject(request.id)}><X size={15} /> Reject</button>
                </div>
              )}
            </article>
          ))}
          {leaveRequests.length === 0 && <p className="faculty-empty-state"><FileText size={18} /> No pending requests.</p>}
        </div>
      </section>
    </aside>
  );
}
