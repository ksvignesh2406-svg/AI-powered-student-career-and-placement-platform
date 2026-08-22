import { Sparkles, Shield, ChevronRight } from "lucide-react";
import "../../styles/feature-sidebar.css";

export default function DashboardFeatureSidebar({
  role = "student",
  title = "Navigation",
  kicker = "Features",
  items = [],
  activeItem,
  onSelectItem,
  footerTitle,
  footerText,
}) {
  return (
    <aside className="dashboard-feature-sidebar" aria-label="Feature navigation">
      <div className="sidebar-header">
        <div className="sidebar-heading-group">
          <span className="sidebar-kicker">{kicker}</span>
          <h3 className="sidebar-title">{title}</h3>
        </div>
        <div className="sidebar-live-pill">
          <span className="dot" />
          <span>Active</span>
        </div>
      </div>

      <p className="sidebar-category-label">Quick Actions &amp; Tools</p>

      <ul className="sidebar-nav-list">
        {items.map((item) => {
          const Icon = item.icon || Sparkles;
          const isActive = activeItem === item.id;

          return (
            <li key={item.id}>
              <button
                type="button"
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  }
                  if (onSelectItem) {
                    onSelectItem(item.id);
                  }
                }}
                title={item.tooltip || item.label}
              >
                <span className="sidebar-icon-wrap">
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="sidebar-item-text">{item.label}</span>
                {item.badge && (
                  <span
                    className={`sidebar-badge ${
                      item.badgeVariant || (isActive ? "" : "emerald")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {!item.badge && <ChevronRight size={13} style={{ opacity: 0.6 }} />}
              </button>
            </li>
          );
        })}
      </ul>

      {footerText && (
        <div className="sidebar-footer-card">
          <strong>
            <Shield size={14} />
            {footerTitle || "Campus OS Pro"}
          </strong>
          <p>{footerText}</p>
        </div>
      )}
    </aside>
  );
}
