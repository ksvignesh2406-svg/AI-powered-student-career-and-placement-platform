import { useState, useMemo } from "react";
import { Download, Plus, Search, Trash2, X } from "lucide-react";
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
      className="admin-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="admin-modal">
        <div className="admin-modal-head">
          <div>
            <h3>Campus User Directory</h3>
            <p>{users.length} total accounts in Campus OS</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              className="admin-secondary-action"
              onClick={exportCSV}
            >
              <Download size={13} /> Export CSV
            </button>
            <button
              type="button"
              className="admin-primary-action"
              onClick={() => setShowAddForm((v) => !v)}
            >
              <Plus size={14} /> Add User
            </button>
            <button
              type="button"
              className="admin-icon-button"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddUser}
            style={{
              padding: "14px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "14px",
              margin: "14px 0",
              display: "grid",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "8px",
              }}
            >
              <input
                name="name"
                required
                placeholder="Full Name"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Institutional Email"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
              <select
                name="role"
                defaultValue="student"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
              <input
                name="department"
                placeholder="Department"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Password (min 6 chars)"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  flex: 1,
                  maxWidth: "240px",
                }}
              />
              <button type="submit" className="admin-primary-action">
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            alignItems: "center",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              background: "#f8faf9",
              border: "1px solid #e2ebe6",
              borderRadius: "10px",
              flex: 1,
              maxWidth: "320px",
            }}
          >
            <Search size={14} style={{ color: "#94a3b8" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search directory..."
              style={{
                border: "none",
                background: "transparent",
                fontSize: "12px",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            {["all", "student", "faculty", "parent", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "0",
                  fontSize: "11px",
                  fontWeight: "750",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  background: roleFilter === r ? "#059669" : "#f1f5f3",
                  color: roleFilter === r ? "#ffffff" : "#475569",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table className="admin-table">
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
                    <strong>{u.name}</strong>
                    <div style={{ color: "#718096", fontSize: "11px" }}>
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "2px 6px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "capitalize",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department || "General"}</td>
                  <td>
                    <span
                      className={`admin-status-tag ${
                        u.status === "suspended" ? "pending" : "resolved"
                      }`}
                    >
                      {u.status || "active"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="admin-secondary-action"
                      style={{ padding: "4px 8px", fontSize: "10px", marginRight: "6px" }}
                      onClick={() => handleToggleStatus(u)}
                    >
                      {u.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button"
                      style={{ display: "inline-grid", padding: "4px" }}
                      onClick={() => handleRemove(u)}
                      title="Remove"
                    >
                      <Trash2 size={14} style={{ color: "#ef4444" }} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}
                  >
                    No matching accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button type="button" className="admin-secondary-action" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
