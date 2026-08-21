import { ArrowUpRight, BookOpen, CalendarCheck2, ChevronRight, FileText } from "lucide-react";

export default function ParentAcademicPanel({ subjects }) {
  return (
    <section className="parent-panel">
      <div className="parent-panel-heading"><div><span className="parent-section-kicker">Academic pulse</span><h2>Progress by subject</h2></div><button type="button" className="parent-text-action">View grades <ArrowUpRight size={14} /></button></div>
      <div className="parent-subject-list">
        {subjects.map((subject) => (
          <article className="parent-subject" key={subject.code}>
            <span className={`parent-subject-icon ${subject.tone}`}><BookOpen size={16} /></span>
            <div className="parent-subject-info"><strong>{subject.name}</strong><span>{subject.code}</span><div className="parent-progress"><i style={{ width: `${subject.progress}%` }} /></div></div>
            <strong className="parent-score">{subject.score}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ParentSchedulePanel({ schedule }) {
  return (
    <section className="parent-panel">
      <div className="parent-panel-heading"><div><span className="parent-section-kicker">This week</span><h2>Campus schedule</h2></div><CalendarCheck2 size={18} className="parent-heading-icon" /></div>
      <div className="parent-schedule-list">
        {schedule.map((item) => (
          <div key={`${item.day}-${item.title}`}>
            <span className={item.active ? "parent-day active" : "parent-day"}>{item.day}<small>{item.date}</small></span>
            <p><strong>{item.title}</strong><span>{item.time} - {item.location}</span></p>
            {item.status ? <span className="parent-schedule-status">{item.status}</span> : <ChevronRight size={17} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ParentDocumentsPanel({ documents }) {
  return (
    <section className="parent-panel parent-documents">
      <div className="parent-panel-heading"><div><span className="parent-section-kicker">Documents</span><h2>Recent updates</h2></div><FileText size={18} className="parent-heading-icon" /></div>
      {documents.map((document) => (
        <div className="parent-document-row" key={document.title}>
          <span><FileText size={16} /></span>
          <div><strong>{document.title}</strong><small>{document.added}</small></div>
          <ArrowUpRight size={15} />
        </div>
      ))}
    </section>
  );
}
