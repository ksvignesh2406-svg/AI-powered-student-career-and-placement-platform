import { LogOut, Sparkles, Users } from "lucide-react";

export default function AdminHeader({
  user,
  onLogout,
  onOpenDirectory,
  userCount = 0,
}) {
  const adminName = user?.name || "Administrator";
  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="admin-brand">
          <span className="admin-brand-mark">
            <Sparkles size={18} />
          </span>
          <span>Campus OS</span>
        </div>

        <div className="admin-user-menu">
          <span className="admin-live-badge">
            <span className="admin-live-dot" /> Live Monitoring
          </span>

          {onOpenDirectory && (
            <button
              type="button"
              className="admin-secondary-action"
              onClick={onOpenDirectory}
              title="Manage Campus Users"
            >
              <Users size={14} /> Directory ({userCount})
            </button>
          )}

          <div className="admin-user-copy">
            <strong>{adminName}</strong>
            <span>Admin Workspace</span>
          </div>

          <span className="admin-avatar">{initials}</span>

          <button
            type="button"
            className="admin-icon-button"
            onClick={onLogout}
            aria-label="Sign out"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
