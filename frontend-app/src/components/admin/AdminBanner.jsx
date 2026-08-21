import { Clock, Shield, TrendingUp } from "lucide-react";

export default function AdminBanner({
  totalStudents = "8,432",
  capacity = "9,000",
  activeIncidents = 3,
  attendanceRate = "89%",
}) {
  return (
    <section className="admin-banner">
      <div>
        <span className="admin-eyebrow">
          <Shield size={14} /> Counselor &amp; Admin Overview
        </span>
        <h1>Campus Pulse</h1>
        <p>
          <Clock size={16} /> Real-time behavioral signals, incident triage, and emergency broadcast.
        </p>
      </div>

      <div className="admin-stats" aria-label="Campus metrics summary">
        <div>
          <strong>{totalStudents}</strong>
          <span>Students on Campus</span>
        </div>
        <div>
          <strong>{activeIncidents}</strong>
          <span>Active Incidents</span>
        </div>
        <div>
          <strong>{attendanceRate}</strong>
          <span>Attendance Rate</span>
        </div>
      </div>
    </section>
  );
}

