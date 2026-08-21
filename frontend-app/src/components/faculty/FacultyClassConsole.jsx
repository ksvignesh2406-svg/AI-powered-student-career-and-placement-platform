import { AlertTriangle, ArrowUpRight, Clock, Users } from "lucide-react";

export default function FacultyClassConsole({ classes, conflict }) {
  const [nextClass, ...upcomingClasses] = classes;

  return (
    <section className="faculty-console">
      {conflict && (
        <div className="faculty-alert">
          <AlertTriangle size={18} />
          <div>
            <strong>{conflict.title}</strong>
            <p>{conflict.message}</p>
          </div>
        </div>
      )}

      <div className="faculty-panel">
        <div className="faculty-panel-heading">
          <div>
            <span className="faculty-section-kicker">Today</span>
            <h2>Class management</h2>
          </div>
          <span className="faculty-next-label">{classes.length} classes</span>
        </div>

        {nextClass && (
          <article className="faculty-active-class">
            <div className="faculty-class-status">{nextClass.status}</div>
            <div className="faculty-class-row">
              <div>
                <h3>{nextClass.title}</h3>
                <p><Clock size={15} /> {nextClass.time} <span>{nextClass.location}</span></p>
              </div>
              <button type="button" className="faculty-primary-action" onClick={() => window.alert(`Attendance portal ready for ${nextClass.id}.`)}>
                Mark attendance <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        )}

        {upcomingClasses.map((classItem) => (
          <article className="faculty-class-row faculty-upcoming-class" key={classItem.id}>
            <div>
              <h3>{classItem.title}</h3>
              <p><Clock size={15} /> {classItem.time} <span>{classItem.location}</span></p>
            </div>
            <button type="button" className="faculty-secondary-action"><Users size={15} /> View roster</button>
          </article>
        ))}
      </div>
    </section>
  );
}
