import { AlertTriangle, ArrowUpRight, Clock, Users } from "lucide-react";

export default function FacultyClassConsole() {
  return (
    <section className="faculty-console">
      <div className="faculty-alert">
        <AlertTriangle size={18} />
        <div>
          <strong>Timetable conflict</strong>
          <p>CS301 Lab and the department meeting overlap at 02:00 PM today.</p>
        </div>
      </div>

      <div className="faculty-panel">
        <div className="faculty-panel-heading">
          <div>
            <span className="faculty-section-kicker">Today</span>
            <h2>Class management</h2>
          </div>
          <span className="faculty-next-label">2 classes</span>
        </div>

        <article className="faculty-active-class">
          <div className="faculty-class-status">Next class</div>
          <div className="faculty-class-row">
            <div>
              <h3>CS301: Data Structures &amp; Algorithms</h3>
              <p><Clock size={15} /> 10:00 AM - 11:30 AM <span>Hall 4B</span></p>
            </div>
            <button type="button" className="faculty-primary-action" onClick={() => window.alert("Attendance portal ready for CS301.")}>
              Mark attendance <ArrowUpRight size={16} />
            </button>
          </div>
        </article>

        <article className="faculty-class-row faculty-upcoming-class">
          <div>
            <h3>CS502: Advanced Operating Systems</h3>
            <p><Clock size={15} /> 02:00 PM - 03:30 PM <span>Lab 2</span></p>
          </div>
          <button type="button" className="faculty-secondary-action"><Users size={15} /> View roster</button>
        </article>
      </div>
    </section>
  );
}
