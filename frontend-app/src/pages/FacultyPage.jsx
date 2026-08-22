import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import FacultyBanner from "../components/faculty/FacultyBanner";
import FacultyClassConsole from "../components/faculty/FacultyClassConsole";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyIntelligenceSidebar from "../components/faculty/FacultyIntelligenceSidebar";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/faculty-dashboard.css";

const defaultDashboard = {
  summary: {
    classesToday: 0,
    conflict: null,
  },
  classes: [],
  atRiskStudents: [],
  leaveRequests: [],
};

export default function FacultyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== "faculty") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("faculty").then((result) => {
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
      setLeaveRequests(result.dashboard.leaveRequests || []);
    });

    return () => {
      isMounted = false;
    };
  }, [navigate, user?.role]);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  const facultySidebarItems = [
    {
      id: "overview",
      label: "Home Overview",
      icon: Sparkles,
      tooltip: "Faculty daily summary",
    },
    {
      id: "classes",
      label: "Today's Schedule",
      icon: Calendar,
      badge: `${dashboard.summary.classesToday} Classes`,
      tooltip: "View scheduled lecture & lab timings",
    },
    {
      id: "risk",
      label: "At-Risk Early Alerts",
      icon: AlertTriangle,
      badge: `${dashboard.atRiskStudents.length} Students`,
      badgeVariant: dashboard.atRiskStudents.length > 0 ? "highlight" : "emerald",
      tooltip: "Monitor students with attendance/grade warnings",
    },
    {
      id: "leaves",
      label: "Leave Approvals",
      icon: FileText,
      badge: `${leaveRequests.filter((r) => r.status !== "approved").length} Pending`,
      tooltip: "Review student medical and on-duty requests",
    },
    {
      id: "conflicts",
      label: "Clash Detector AI",
      icon: BookOpen,
      badge: dashboard.summary.conflict ? "1 Clash" : "Clear",
      badgeVariant: dashboard.summary.conflict ? "highlight" : "emerald",
      tooltip: "Automated schedule conflict monitoring",
    },
    {
      id: "dept",
      label: "Department Directory",
      icon: Users,
      tooltip: "Computer Science faculty and course roster",
    },
  ];

  return (
    <div className="faculty-dashboard">
      <FacultyHeader user={user} onLogout={handleLogout} />
      <main className="faculty-main">
        {error && <p className="faculty-empty-state">{error}</p>}

        <FacultyBanner
          user={user}
          classesToday={dashboard.summary.classesToday}
          pendingLeaves={leaveRequests.length}
        />

        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%", marginTop: "24px" }}>
          {/* Feature Sidebar */}
          <DashboardFeatureSidebar
            role="faculty"
            kicker="Faculty Portal"
            title="Teaching Tools"
            items={facultySidebarItems}
            activeItem={activeTab}
            onSelectItem={setActiveTab}
            footerTitle="Semester Term 2"
            footerText="Curriculum pace on schedule"
          />

          {/* Dynamic Main Workspace */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            {/* VIEW: OVERVIEW (HOME) */}
            {activeTab === "overview" && (
              <div className="faculty-grid" style={{ margin: 0 }}>
                <FacultyClassConsole
                  classes={dashboard.classes}
                  conflict={dashboard.summary.conflict}
                />
                <FacultyIntelligenceSidebar
                  atRiskStudents={dashboard.atRiskStudents}
                  leaveRequests={leaveRequests}
                  onApprove={(id) =>
                    setLeaveRequests((requests) =>
                      requests.map((request) =>
                        request.id === id ? { ...request, status: "approved" } : request
                      )
                    )
                  }
                  onReject={(id) =>
                    setLeaveRequests((requests) =>
                      requests.filter((request) => request.id !== id)
                    )
                  }
                />
              </div>
            )}

            {/* VIEW: CLASSES FULL CONSOLE */}
            {activeTab === "classes" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Today's Class Schedule &amp; Lab Timings</h2>
                      <p className="dashboard-view-subtitle">Manage class lecture halls, batches, and roll call</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <FacultyClassConsole
                  classes={dashboard.classes}
                  conflict={dashboard.summary.conflict}
                />
              </div>
            )}

            {/* VIEW: AT-RISK STUDENTS */}
            {activeTab === "risk" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">At-Risk Student Early Warnings</h2>
                      <p className="dashboard-view-subtitle">Proactively support students with attendance &lt;75% or test grade deficits</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                  {dashboard.atRiskStudents.map((st) => (
                    <div key={st.id} style={{ background: "#fff", padding: "18px", borderRadius: "14px", border: "1px solid #fed7aa", boxShadow: "0 4px 12px rgba(234, 88, 12, 0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <strong style={{ fontSize: "15px", color: "#0f172a" }}>{st.name}</strong>
                        <span style={{ fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "999px", background: "#fee2e2", color: "#b91c1c" }}>
                          {st.riskReason}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px" }}>
                        Roll: {st.rollNo || "26BCE-012"} · Attendance: <b style={{ color: "#dc2626" }}>{st.attendance || "68%"}</b>
                      </p>
                      <button
                        type="button"
                        onClick={() => alert(`Parent advisory notification dispatched for ${st.name}`)}
                        style={{ width: "100%", padding: "8px 12px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#0f172a", cursor: "pointer" }}
                      >
                        Notify Parent &amp; Counselor
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: LEAVE APPROVALS */}
            {activeTab === "leaves" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Student Leave &amp; On-Duty Requests</h2>
                      <p className="dashboard-view-subtitle">Review medical certificates and academic absence passes</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {leaveRequests.map((req) => (
                    <div key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#0f172a" }}>{req.studentName}</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                          Reason: {req.reason} · Dates: {req.dates}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {req.status === "approved" ? (
                          <span style={{ fontSize: "12px", fontWeight: "750", color: "#059669", background: "#d1fae5", padding: "6px 12px", borderRadius: "8px" }}>
                            Approved ✓
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setLeaveRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: "approved" } : r))}
                              style={{ padding: "8px 16px", background: "#059669", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setLeaveRequests((prev) => prev.filter((r) => r.id !== req.id))}
                              style={{ padding: "8px 14px", background: "#ffffff", border: "1px solid #cbd5e1", color: "#64748b", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: CLASH DETECTOR AI */}
            {activeTab === "conflicts" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Timetable Conflict Detector AI</h2>
                      <p className="dashboard-view-subtitle">Automated schedule and hall double-booking analysis</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "14px", border: "1px solid #a7f3d0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46", fontWeight: "800", fontSize: "15px", marginBottom: "8px" }}>
                    <CheckCircle size={18} /> Schedule Matrix Clear
                  </div>
                  <p style={{ fontSize: "13px", color: "#047857", margin: 0 }}>
                    No room clashes detected for your allotted lecture halls (Block B - 302, Lab 4).
                  </p>
                </div>
              </div>
            )}

            {/* VIEW: DEPARTMENT DIRECTORY */}
            {activeTab === "dept" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Users size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Computer Science Department Faculty</h2>
                      <p className="dashboard-view-subtitle">Faculty roster, office hours, and research groups</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {[
                    { name: "Dr. Rajesh Sharma", role: "Head of Department", office: "CS Block #101" },
                    { name: "Prof. Ananya Sen", role: "Associate Professor", office: "CS Block #108" },
                    { name: "Dr. S. Ramanathan", role: "Assistant Professor", office: "CS Block #114" },
                    { name: "Prof. Maya Krishnan", role: "Lab In-Charge", office: "CS Lab 3" },
                  ].map((prof) => (
                    <div key={prof.name} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>{prof.name}</strong>
                      <p style={{ margin: "2px 0", fontSize: "12px", color: "#059669", fontWeight: "650" }}>{prof.role}</p>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>{prof.office}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
