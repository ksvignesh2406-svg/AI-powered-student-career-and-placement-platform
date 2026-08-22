import { Clock, GraduationCap } from "lucide-react";

export default function FacultyBanner({ user, pendingLeaves, classesToday }) {
  return (
    <section className="faculty-banner">
      <div>
        <span className="faculty-eyebrow"><GraduationCap size={15} /> Faculty workspace</span>
        <h1>Good morning, {user.name}.</h1>
        <p><Clock size={16} /> You have {classesToday} classes scheduled today.</p>
      </div>
      <div className="faculty-stats" aria-label="Faculty summary">
        <div><strong>{classesToday}</strong><span>Classes today</span></div>
        <div><strong>{pendingLeaves}</strong><span>Leave requests</span></div>
      </div>
    </section>
  );
}
