import { GraduationCap } from "lucide-react";

function FacultyBanner({ pendingLeaves, professorName }) {
  return (
    <section className="faculty-v2-banner">
      <div className="faculty-v2-banner-copy">
        <span className="faculty-v2-eyebrow">
          <GraduationCap size={14} />
          Faculty Portal
        </span>
        <h1>Good Morning, {professorName}.</h1>
        <p>You have 2 classes scheduled for today.</p>
      </div>

      <div className="faculty-v2-banner-stats">
        <div>
          <strong>2</strong>
          <span>Classes Today</span>
        </div>
        <div>
          <strong>{pendingLeaves}</strong>
          <span>Pending Leaves</span>
        </div>
      </div>
      <div className="faculty-v2-banner-shape" aria-hidden="true" />
    </section>
  );
}

export default FacultyBanner;