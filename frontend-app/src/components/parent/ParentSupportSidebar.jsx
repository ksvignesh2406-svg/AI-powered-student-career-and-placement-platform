import { ArrowUpRight, CreditCard, Headphones, MessageCircle, ShieldCheck } from "lucide-react";

export default function ParentSupportSidebar() {
  return (
    <aside className="parent-sidebar">
      <section className="parent-panel parent-fee-card">
        <div className="parent-panel-heading"><div><span className="parent-section-kicker">Finance</span><h2>Fee overview</h2></div><CreditCard size={18} /></div>
        <div className="parent-fee-amount"><strong>₹18,500</strong><span>Next payment due 30 Aug</span></div>
        <div className="parent-fee-bar"><i /></div>
        <div className="parent-fee-labels"><span>₹74,000 paid</span><span>₹92,500 total</span></div>
        <button type="button" className="parent-primary-action">View payment details <ArrowUpRight size={15} /></button>
      </section>

      <section className="parent-panel parent-wellbeing-card">
        <div className="parent-panel-heading"><div><span className="parent-section-kicker">Student wellbeing</span><h2>Doing well</h2></div><ShieldCheck size={19} /></div>
        <p>Attendance and academic signals are healthy. No action is needed from you today.</p>
        <div className="parent-wellbeing-row"><span>Academic health</span><strong>Strong</strong></div><div className="parent-wellbeing-row"><span>Campus engagement</span><strong>Active</strong></div>
      </section>

      <section className="parent-contact-strip"><span><Headphones size={18} /></span><div><strong>Need help?</strong><small>Connect with the student support team.</small></div><button type="button" aria-label="Contact support"><MessageCircle size={17} /></button></section>
    </aside>
  );
}
