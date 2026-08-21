import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  Building,
  CheckCircle2,
  Filter,
  LogOut,
  Plus,
  Search,
  Server,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  createAdminUser,
  fetchAdminUsers,
  fetchDashboard,
  toggleUserStatus,
} from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/admin-dashboard.css";

const defaultDashboard = {
  summary: {
    totalUsers: 0,
    activeFaculty: 0,
    activeStudents: 0,
    securityUnits: 0,
    systemHealth: "Optimal",
  },
  departments: [],
  recentActivity: [],
  systemAlerts: [],
};

const filterRoles = [
  { id: "ALL", label: "All Users" },
  { id: "STUDENT", label: "Students" },
  { id: "FACULTY", label: "Faculty" },
  { id: "PARENT", label: "Parents" },
  { id: "SECURITY", label: "Security" },
  { id: "PLACEMENT", label: "Placement" },
  { id: "ADMIN", label: "Admins" },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("admin").then((result) => {
      if (!isMounted) return;

      if (result.error) {
        setError(result.error);
        return;
      }

      setUser({
        ...result.user,
        role: result.user.role.toLowerCase(),
      });
      setDashboard(result.dashboard);
    });

    return () => {
      isMounted = false;
    };
  }, [navigate, user?.role]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const result = await fetchAdminUsers({
      search: searchQuery,
      role: selectedRole,
    });
    setLoadingUsers(false);

    if (result && !result.error && result.users) {
      setUsers(result.users);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      loadUsers();
    }
  }, [selectedRole, searchQuery, user?.role]);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  const handleToggleStatus = async (targetUser) => {
    const nextStatus = !targetUser.isActive;
    const res = await toggleUserStatus(targetUser.id, nextStatus);
    if (res && res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: nextStatus } : u))
      );
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError("");

    const res = await createAdminUser(newUser);
    setIsSubmitting(false);

    if (res.error) {
      setModalError(res.error);
      return;
    }

    setShowCreateModal(false);
    setNewUser({ name: "", email: "", password: "", role: "STUDENT" });
    loadUsers();
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <span className="admin-brand-mark">
              <Sparkles size={18} />
            </span>
            <span>Campus OS</span>
          </div>

          <div className="admin-user-menu">
            <div className="admin-user-copy">
              <strong>{user.name}</strong>
              <span>System Administrator</span>
            </div>
            <span className="admin-avatar">{initials}</span>
            <button
              type="button"
              className="admin-icon-button"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {error && <p className="admin-alert-item warning" style={{ marginBottom: "20px" }}>{error}</p>}

        <section className="admin-banner">
          <div>
            <span className="admin-eyebrow">
              <Building size={14} /> Campus Operations
            </span>
            <h1>Administration Center</h1>
            <p>
              <Server size={16} /> Campus Network Status: {dashboard.summary.systemHealth}
            </p>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <strong>{dashboard.summary.totalUsers}</strong>
              <span>Total Users</span>
            </div>
            <div className="admin-stat-card">
              <strong>{dashboard.summary.activeStudents}</strong>
              <span>Students</span>
            </div>
            <div className="admin-stat-card">
              <strong>{dashboard.summary.activeFaculty}</strong>
              <span>Faculty</span>
            </div>
            <div className="admin-stat-card">
              <strong>{dashboard.summary.securityUnits}</strong>
              <span>Security</span>
            </div>
          </div>
        </section>

        <div className="admin-grid">
          <div className="admin-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* User Directory Management */}
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-section-kicker">Account Directory</span>
                  <h2>User Management</h2>
                </div>
                <button
                  type="button"
                  className="admin-create-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={16} /> Provision User
                </button>
              </div>

              <div className="admin-controls-row">
                <div className="admin-search-wrap">
                  <Search size={16} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="admin-role-filter">
                  <Filter size={14} color="#94a3b8" style={{ marginRight: "4px" }} />
                  {filterRoles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`admin-filter-btn ${selectedRole === r.id ? "active" : ""}`}
                      onClick={() => setSelectedRole(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Register / ID</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const uInitials = u.name
                        ? u.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "U";

                      const roleClass = `badge-${u.role?.toLowerCase()?.replace("_officer", "")}`;

                      return (
                        <tr key={u.id}>
                          <td>
                            <div className="user-cell">
                              <span className="user-initials">{uInitials}</span>
                              <div>
                                <strong>{u.name}</strong>
                                <div style={{ color: "#64748b", fontSize: "11px" }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`user-role-badge ${roleClass}`}>{u.role}</span>
                          </td>
                          <td style={{ color: "#64748b" }}>{u.registerNumber || "—"}</td>
                          <td>
                            <span
                              className={`status-toggle-btn ${
                                u.isActive ? "status-active" : "status-inactive"
                              }`}
                            >
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              style={{
                                border: "0",
                                background: "transparent",
                                color: u.isActive ? "#dc2626" : "#16a34a",
                                fontSize: "11px",
                                fontWeight: "700",
                                cursor: "pointer",
                              }}
                            >
                              {u.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>
                          {loadingUsers ? "Loading user accounts..." : "No matching users found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Department Structure */}
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-section-kicker">Structure</span>
                  <h2>Campus Departments</h2>
                </div>
                <span style={{ fontSize: "12px", color: "#ea580c", fontWeight: "700" }}>
                  {dashboard.departments.length} Active Departments
                </span>
              </div>

              <div className="admin-departments-grid">
                {dashboard.departments.map((dept) => (
                  <div key={dept.id} className="admin-dept-card">
                    <h3>{dept.name}</h3>
                    <p>Head of Dept: {dept.hod}</p>
                    <div className="admin-dept-meta">
                      <span>👨‍🏫 {dept.facultyCount} Faculty</span>
                      <span>🎓 {dept.studentCount} Students</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="admin-sidebar">
            {/* System Health & Notices */}
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-section-kicker">Status</span>
                  <h2>System Health</h2>
                </div>
                <Activity size={18} color="#ea580c" />
              </div>
              <div className="admin-alerts-list">
                {dashboard.systemAlerts.map((alert) => (
                  <div key={alert.id} className={`admin-alert-item ${alert.level}`}>
                    <strong>{alert.title}</strong>
                    <p>{alert.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Live Campus Audit Stream */}
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="admin-section-kicker">Live Feed</span>
                  <h2>Recent Activity</h2>
                </div>
                <CheckCircle2 size={18} color="#16a34a" />
              </div>
              <div className="admin-activity-list">
                {dashboard.recentActivity.map((act) => (
                  <div key={act.id} className="admin-activity-item">
                    <div>
                      <p>{act.action}</p>
                      <small>{act.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* User Provisioning Modal */}
      {showCreateModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Provision New Campus User</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ border: "0", background: "transparent", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <p className="admin-alert-item warning" style={{ marginBottom: "14px" }}>
                {modalError}
              </p>
            )}

            <form onSubmit={handleCreateUser} className="admin-modal-form">
              <div className="admin-modal-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Officer Ramesh or Dr. Lakshmi"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-field">
                <label>Institutional Email</label>
                <input
                  type="email"
                  placeholder="name@campus.edu"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-field">
                <label>Temporary Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-field">
                <label>Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="PARENT">Parent</option>
                  <option value="SECURITY">Campus Security</option>
                  <option value="PLACEMENT_OFFICER">Placement Officer</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="admin-btn-primary">
                  {isSubmitting ? "Provisioning..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}