import { LogOut, Sparkles } from "lucide-react";

export default function FacultyHeader({ user, onLogout }) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="faculty-header">
      <div className="faculty-header-inner">
        <div className="faculty-brand">
          <span className="faculty-brand-mark"><Sparkles size={18} /></span>
          <span>Campus OS</span>
        </div>
        <div className="faculty-user-menu">
          <div className="faculty-user-copy">
            <strong>{user.name}</strong>
            <span>{user.department || "Faculty workspace"}</span>
          </div>
          <span className="faculty-avatar">{initials}</span>
          <button type="button" className="faculty-icon-button" onClick={onLogout} aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
