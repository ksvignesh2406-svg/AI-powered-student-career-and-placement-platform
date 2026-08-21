import { Bell, LogOut, Sparkles } from "lucide-react";

export default function ParentHeader({ user, onLogout }) {
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="parent-header">
      <div className="parent-header-inner">
        <div className="parent-brand"><span className="parent-brand-mark"><Sparkles size={18} /></span><span>Campus OS</span></div>
        <div className="parent-header-actions">
          <button type="button" className="parent-icon-button" aria-label="Notifications"><Bell size={18} /><span className="parent-notification-dot" /></button>
          <div className="parent-user-copy"><strong>{user.name}</strong><span>{user.relationship || "Parent"} · {user.childName || "Student account"}</span></div>
          <span className="parent-avatar">{initials}</span>
          <button type="button" className="parent-icon-button" onClick={onLogout} aria-label="Sign out"><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
}
