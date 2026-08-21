import { useState, useMemo } from "react";
import { Download, Plus, Search, Trash2, X, Users, UserCheck } from "lucide-react";
import { addUser, getUsers, removeUser, updateUser } from "../../utils/authStorage";

export default function UserDirectoryModal({ onClose, onNotice }) {
  const [users, setUsers] = useState(() => getUsers());
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((candidate) => {
      const text = `${candidate.name || ""} ${candidate.email || ""} ${
        candidate.department || ""
      }`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesRole = roleFilter === "all" || candidate.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [query, roleFilter, users]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = addUser({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role"),
      department: form.get("department"),
    });

    if (result.error) {
      if (onNotice) onNotice(result.error);
      return;
    }

    setUsers(getUsers());
    setShowAddForm(false);
    if (onNotice) onNotice(`Added ${result.user.name} to directory`);
  };

  const handleRemove = (candidate) => {
    if (!window.confirm(`Remove ${candidate.name}'s account?`)) return;
    removeUser(candidate.id);
    setUsers(getUsers());
    if (onNotice) onNotice(`Removed ${candidate.name}`);
  };

  const handleToggleStatus = (candidate) => {
    const nextStatus =
      candidate.status === "suspended" ? "active" : "suspended";
    updateUser(candidate.id, { status: nextStatus });
    setUsers(getUsers());
    if (onNotice) {
      onNotice(`Account ${candidate.name} is now ${nextStatus}`);
    }
  };

  const exportCSV = () => {
    const csv = [
      "Name,Email,Role,Department,Status",
      ...users.map((c) =>
        [c.name, c.email, c.role, c.department || "", c.status || "active"]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "campus-os-users.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    if (onNotice) onNotice("User directory exported to CSV");
  };

  return (
    <div
      className="adm-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="adm-modal-box">
        {/* Modal Header */}
        <div className="adm-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="adm-modal-icon-badge">
              <Users size={22} />
            </div>
            <div>
              <h3 className="adm-modal-title">Campus User Directory</h3>
              <p className="adm-modal-subtitle">
                {users.length} total registered accounts in Campus OS
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              className="adm-btn-secondary"
              onClick={exportCSV}
              style={{ height: "36px", padding: "0 12px", fontSize: "11px" }}
            >
              <Download size={13} /> Export CSV
            </button>
            <button
              type="button"
              className="adm-btn-primary"
              onClick={() => setShowAddForm((v) => !v)}
              style={{ height: "36px", padding: "0 14px", fontSize: "11px" }}
            >
              <Plus size={14} /> Add User
            </button>
            <button
              type="button"
              className="adm-modal-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <form onSubmit={handleAddUser} className="adm-add-user-form">
            <div className="adm-add-user-title">Create New Campus Account</div>
            <div className="adm-add-user-grid">
              <input
                name="name"
                required
                placeholder="Full Name (e.g. Arjun Sharma)"
                className="adm-input"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email (e.g. name@campus.edu)"
                className="adm-input"
              />
              <select name="role" defaultValue="student" className="adm-select">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="parent">Parent</option>
                <option value="security">Security</option>
                <option value="admin">Admin</option>
              </select>
              <input
                name="department"
                placeholder="Department (e.g. Computer Science)"
                className="adm-input"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Temporary Password (min 6 chars)"
                className="adm-input"
                style={{ maxWidth: "260px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="adm-btn-secondary"
                  style={{ height: "36px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-btn-primary"
                  style={{ height: "36px" }}
                >
                  <UserCheck size={14} /> Create Account
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Toolbar */}
        <div className="adm-dir-toolbar">
          <div className="adm-search-wrap">
            <Search size={14} style={{ color: "#94a3b8" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, department..."
            />
          </div>

          <div className="adm-filter-pills">
            {["all", "student", "faculty", "parent", "security", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`adm-filter-btn ${roleFilter === r ? "active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table */}
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="adm-user-avatar">
                        {(u.name || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="adm-user-name">{u.name}</div>
                        <div className="adm-user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="adm-role-tag">{u.role}</span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "12px" }}>
                    {u.department || "General"}
                  </td>
                  <td>
                    <span
                      className={`adm-status-tag ${
                        u.status === "suspended" ? "suspended" : "active"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="adm-btn-table-action"
                      onClick={() => handleToggleStatus(u)}
                    >
                      {u.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                    <button
                      type="button"
                      className="adm-btn-delete"
                      onClick={() => handleRemove(u)}
                      title="Remove user"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}
                  >
                    No matching accounts found in directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="adm-modal-footer">
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {filteredUsers.length} of {users.length} accounts
          </span>
          <button
            type="button"
            className="adm-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
