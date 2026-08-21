import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, GraduationCap } from "lucide-react";

export default function ParentOverview({ user }) {
  const childName = user.childName || "your child";

  return (
    <section className="parent-overview">
      <div>
        <span className="parent-eyebrow"><GraduationCap size={15} /> Family overview</span>
        <h1>Good morning, {user.name}.</h1>
        <p>Here is how {childName} is doing on campus today.</p>
      </div>
      <div className="parent-overview-meta">
        <div><span>Last updated</span><strong><Clock3 size={14} /> 8:40 AM</strong></div>
        <button type="button" className="parent-light-action">View full report <ArrowUpRight size={15} /></button>
      </div>
    </section>
  );
}

export function ParentMetricCards() {
  return (
    <div className="parent-metrics">
      <article><span className="parent-metric-icon green"><CheckCircle2 size={17} /></span><div><strong>92%</strong><span>Attendance</span><small>+4% this month</small></div></article>
      <article><span className="parent-metric-icon blue"><GraduationCap size={17} /></span><div><strong>8.6</strong><span>Current GPA</span><small>Top 18% of class</small></div></article>
      <article><span className="parent-metric-icon amber"><CalendarDays size={17} /></span><div><strong>3</strong><span>Upcoming tasks</span><small>Next due Friday</small></div></article>
    </div>
  );
}
