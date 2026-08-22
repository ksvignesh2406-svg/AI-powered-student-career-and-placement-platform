import { ArrowUpRight, CreditCard, Headphones, MessageCircle, ShieldCheck } from "lucide-react";

export default function ParentSupportSidebar({ finance, wellbeing }) {
  return (
    <aside className="parent-sidebar">
      <section className="parent-panel parent-fee-card">
        <div className="parent-panel-heading"><div><span className="parent-section-kicker">Finance</span><h2>Fee overview</h2></div><CreditCard size={18} /></div>
        <div className="parent-fee-amount"><strong>{finance.due}</strong><span>{finance.dueDate}</span></div>
        <div className="parent-fee-bar"><i style={{ width: `${finance.paidPercent}%` }} /></div>
        <div className="parent-fee-labels"><span>{finance.paid}</span><span>{finance.total}</span></div>
        <button type="button" className="parent-primary-action">View payment details <ArrowUpRight size={15} /></button>
      </section>

      <section className="parent-panel parent-wellbeing-card">
        <div className="parent-panel-heading"><div><span className="parent-section-kicker">Student wellbeing</span><h2>{wellbeing.title}</h2></div><ShieldCheck size={19} /></div>
        <p>{wellbeing.message}</p>
        {wellbeing.rows.map((row) => (
          <div className="parent-wellbeing-row" key={row.label}><span>{row.label}</span><strong>{row.value}</strong></div>
        ))}
      </section>

      <section className="parent-contact-strip"><span><Headphones size={18} /></span><div><strong>Need help?</strong><small>Connect with the student support team.</small></div><button type="button" aria-label="Contact support"><MessageCircle size={17} /></button></section>
    </aside>
  );
}
