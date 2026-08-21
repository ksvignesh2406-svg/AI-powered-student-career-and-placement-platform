import { ShieldAlert } from "lucide-react";
import LeaveApprovalQueue from "./LeaveApprovalQueue";

const fallbackStudents = [
  { initials: "AK", name: "Aarav Kumar", reason: "Missed 3 consecutive classes" },
  { initials: "SR", name: "Sneha Roy", reason: "Attendance below 65%" },
];

function FacultyIntelligenceSidebar({ leaveRequests, onApprove, onReject, students }) {
  const flagCheckIn = (studentName) => {
    window.alert(`Check-in note flagged for ${studentName} during lab.`);
  };

  return (
    <aside className="faculty-v2-sidebar">
      <section className="faculty-v2-panel">
        <div className="faculty-v2-risk-heading">
          <h2><ShieldAlert size={20} /> At-Risk Students</h2>
          <span>AI Flagged</span>
        </div>
        <p className="faculty-v2-panel-description">Prompting check-in during upcoming lab session.</p>

        <div className="faculty-v2-risk-list">
          {(students.length ? students : fallbackStudents).map((student) => (
            <div className="faculty-v2-risk-item" key={student.name}>
              <div className="faculty-v2-student">
                <div className="faculty-v2-student-avatar">{student.initials}</div>
                <div>
                  <strong>{student.name}</strong>
                  <span>{student.reason}</span>
                </div>
              </div>
              <button type="button" onClick={() => flagCheckIn(student.name)}>Check-in</button>
            </div>
          ))}
        </div>
      </section>

      <LeaveApprovalQueue
        requests={leaveRequests}
        onApprove={onApprove}
        onReject={onReject}
      />
    </aside>
  );
}

export default FacultyIntelligenceSidebar;