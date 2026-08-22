import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, GraduationCap } from "lucide-react";

export default function ParentOverview({ user, child, overview }) {
  const childName = child?.name || user.childName || "your child";

  return (
    <section className="parent-overview">
      <div>
        <span className="parent-eyebrow"><GraduationCap size={15} /> Family overview</span>
        <h1>Good morning, {user.name}.</h1>
        <p>Here is how {childName} is doing on campus today.</p>
      </div>
      <div className="parent-overview-meta">
        <div><span>Last updated</span><strong><Clock3 size={14} /> {overview.lastUpdated}</strong></div>
        <button type="button" className="parent-light-action">View full report <ArrowUpRight size={15} /></button>
      </div>
    </section>
  );
}

export function ParentMetricCards({ metrics }) {
  const icons = {
    attendance: CheckCircle2,
    gpa: GraduationCap,
    tasks: CalendarDays,
  };

  return (
    <div className="parent-metrics">
      {metrics.map((metric) => {
        const Icon = icons[metric.id] || CheckCircle2;

        return (
          <article key={metric.id}>
            <span className={`parent-metric-icon ${metric.tone}`}><Icon size={17} /></span>
            <div><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.note}</small></div>
          </article>
        );
      })}
    </div>
  );
}
