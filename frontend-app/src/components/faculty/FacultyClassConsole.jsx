import { AlertTriangle, CheckSquare, Clock, PlayCircle } from "lucide-react";

function FacultyClassConsole() {
  const launchAttendance = () => {
    window.alert("Launching Attendance Portal for CS301...");
  };

  const viewRoster = () => {
    window.alert("Opening roster for CS502...");
  };

  return (
    <section className="faculty-v2-console">
      <div className="faculty-v2-alert" role="alert">
        <AlertTriangle size={20} />
        <div>
          <strong>Timetable Conflict Alert (Smart Timetable)</strong>
          <p>
            Overlapping slot detected: <b>CS301 Lab</b> and <b>Dept. Meeting</b>{" "}
            both scheduled for 02:00 PM today.
          </p>
        </div>
      </div>

      <div className="faculty-v2-panel">
        <div className="faculty-v2-panel-heading">
          <h2><PlayCircle size={20} /> Active / Upcoming Class</h2>
          <span>Next Up</span>
        </div>

        <div className="faculty-v2-class-feature">
          <div>
            <h3>CS301: Data Structures &amp; Algorithms</h3>
            <p><Clock size={14} /> 10:00 AM - 11:30 AM <b>|</b> Hall 4B</p>
          </div>
          <button type="button" onClick={launchAttendance}>
            <CheckSquare size={16} />
            Mark Attendance for CS301
          </button>
        </div>

        <div className="faculty-v2-subsequent-class">
          <div>
            <strong>CS502: Advanced Operating Systems</strong>
            <span>02:00 PM - 03:30 PM <b>•</b> Lab 2</span>
          </div>
          <button type="button" onClick={viewRoster}>View Roster</button>
        </div>
      </div>
    </section>
  );
}

export default FacultyClassConsole;