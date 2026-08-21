import { ArrowUpRight, BookOpen, CalendarCheck2, ChevronRight, FileText } from "lucide-react";

const subjects = [
  { name: "Data Structures", code: "CS301", score: "A", progress: 88, tone: "green" },
  { name: "Operating Systems", code: "CS502", score: "A-", progress: 81, tone: "blue" },
  { name: "Discrete Mathematics", code: "MA204", score: "B+", progress: 74, tone: "amber" },
];

export default function ParentAcademicPanel() {
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

export function ParentSchedulePanel() {
  return (
    <section className="parent-panel">
      <div className="parent-panel-heading"><div><span className="parent-section-kicker">This week</span><h2>Campus schedule</h2></div><CalendarCheck2 size={18} className="parent-heading-icon" /></div>
      <div className="parent-schedule-list">
        <div><span className="parent-day active">Today<small>22</small></span><p><strong>Data Structures lab</strong><span>10:00 AM · Lab 4B</span></p><span className="parent-schedule-status">In progress</span></div>
        <div><span className="parent-day">Fri<small>23</small></span><p><strong>Career guidance session</strong><span>2:00 PM · Seminar hall</span></p><ChevronRight size={17} /></div>
        <div><span className="parent-day">Mon<small>26</small></span><p><strong>Internal assessment</strong><span>9:00 AM · Main block</span></p><ChevronRight size={17} /></div>
      </div>
    </section>
  );
}

export function ParentDocumentsPanel() {
  return (
    <section className="parent-panel parent-documents"><div className="parent-panel-heading"><div><span className="parent-section-kicker">Documents</span><h2>Recent updates</h2></div><FileText size={18} className="parent-heading-icon" /></div><div className="parent-document-row"><span><FileText size={16} /></span><div><strong>Fee receipt · Semester 5</strong><small>Added today</small></div><ArrowUpRight size={15} /></div><div className="parent-document-row"><span><FileText size={16} /></span><div><strong>Attendance summary · August</strong><small>Added 2 days ago</small></div><ArrowUpRight size={15} /></div></section>
  );
}
