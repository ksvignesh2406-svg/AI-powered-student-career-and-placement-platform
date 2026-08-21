import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  LogOut,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/placement-dashboard.css";

const defaultDashboard = {
  summary: {
    placementRate: "0%",
    highestPackage: "0 LPA",
    averagePackage: "0 LPA",
    ongoingDrives: 0,
    totalOffers: 0,
  },
  drives: [],
  upcomingInterviews: [],
  topRecruiters: [],
};

export default function PlacementPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "placement") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("placement").then((result) => {
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

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PL";

  return (
    <div className="placement-dashboard">
      <header className="placement-header">
        <div className="placement-header-inner">
          <div className="placement-brand">
            <span className="placement-brand-mark">
              <Briefcase size={18} />
            </span>
            <span>Campus OS</span>
          </div>

          <div className="placement-user-menu">
            <div className="placement-user-copy">
              <strong>{user.name}</strong>
              <span>Corporate Relations & Placements</span>
            </div>
            <span className="placement-avatar">{initials}</span>
            <button
              type="button"
              className="placement-icon-button"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="placement-main">
        {error && (
          <p
            style={{
              padding: "12px 16px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "12px",
              marginBottom: "20px",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            {error}
          </p>
        )}

        <section className="placement-banner">
          <div>
            <span className="placement-eyebrow">
              <TrendingUp size={14} /> Career & Placement Cell
            </span>
            <h1>Placement Operations</h1>
            <p>
              <Award size={16} /> Campus Placement Season 2026 · {dashboard.summary.totalOffers} offers rolled out
            </p>
          </div>

          <div className="placement-stats-grid">
            <div className="placement-stat-card">
              <strong>{dashboard.summary.placementRate}</strong>
              <span>Placed Rate</span>
            </div>
            <div className="placement-stat-card">
              <strong>{dashboard.summary.highestPackage}</strong>
              <span>Peak CTC</span>
            </div>
            <div className="placement-stat-card">
              <strong>{dashboard.summary.averagePackage}</strong>
              <span>Average CTC</span>
            </div>
            <div className="placement-stat-card">
              <strong>{dashboard.summary.ongoingDrives}</strong>
              <span>Active Drives</span>
            </div>
          </div>
        </section>

        <div className="placement-grid">
          <div className="placement-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Active Recruitment Drives */}
            <section className="placement-panel">
              <div className="placement-panel-heading">
                <div>
                  <span className="placement-section-kicker">Hiring Season</span>
                  <h2>Active Recruitment Drives</h2>
                </div>
                <span style={{ fontSize: "12px", color: "#9333ea", fontWeight: "750" }}>
                  {dashboard.drives.length} Ongoing Drives
                </span>
              </div>

              <div className="drive-list">
                {dashboard.drives.map((drive) => (
                  <div key={drive.id} className="drive-card">
                    <div className="drive-card-header">
                      <div className="drive-company-info">
                        <h3>{drive.company}</h3>
                        <p>{drive.role}</p>
                      </div>
                      <span className="drive-ctc-pill">{drive.ctc}</span>
                    </div>

                    <div className="drive-meta-grid">
                      <div className="drive-meta-item">
                        <strong>📅 Drive Date</strong>
                        <span>{drive.date}</span>
                      </div>
                      <div className="drive-meta-item">
                        <strong>🎓 Eligible Pool</strong>
                        <span>{drive.eligibleCount} Candidates</span>
                      </div>
                      <div className="drive-meta-item">
                        <strong>📝 Registered</strong>
                        <span>{drive.registeredCount} Applied</span>
                      </div>
                    </div>

                    <div className="drive-actions-row">
                      <span className="drive-stage-tag">
                        <CheckCircle2 size={15} /> Stage: {drive.stage}
                      </span>
                      <button
                        type="button"
                        className="btn-drive-action"
                        onClick={() => window.alert(`Shortlisting roster opened for ${drive.company}.`)}
                      >
                        View Applicant Roster <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Interview Rosters */}
            <section className="placement-panel">
              <div className="placement-panel-heading">
                <div>
                  <span className="placement-section-kicker">Assessment Schedule</span>
                  <h2>Upcoming Interview Rounds</h2>
                </div>
                <Calendar size={18} color="#9333ea" />
              </div>

              <div className="interview-list">
                {dashboard.upcomingInterviews.map((intItem) => (
                  <div key={intItem.id} className="interview-card">
                    <div>
                      <strong>{intItem.candidate}</strong>
                      <p>
                        🏢 {intItem.company} · {intItem.role}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: "#f3e8ff",
                          color: "#7e22ce",
                          fontSize: "10px",
                          fontWeight: "800",
                        }}
                      >
                        {intItem.mode}
                      </span>
                      <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                        🕒 {intItem.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="placement-sidebar" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Top Recruiters */}
            <section className="placement-panel">
              <div className="placement-panel-heading">
                <div>
                  <span className="placement-section-kicker">Partnerships</span>
                  <h2>Top Recruiters</h2>
                </div>
                <Building2 size={18} color="#9333ea" />
              </div>

              <div className="recruiter-list">
                {dashboard.topRecruiters.map((rec) => (
                  <div key={rec.name} className="recruiter-item">
                    <div>
                      <strong>{rec.name}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                        Avg Package: {rec.avgCtc}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "#dcfce7",
                        color: "#15803d",
                        borderRadius: "8px",
                        fontWeight: "800",
                        fontSize: "11px",
                      }}
                    >
                      {rec.hires} Hires
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Placement Tools */}
            <section className="placement-panel">
              <div className="placement-panel-heading">
                <div>
                  <span className="placement-section-kicker">Quick Actions</span>
                  <h2>Placement Toolkit</h2>
                </div>
                <Sparkles size={18} color="#9333ea" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#334155",
                    cursor: "pointer",
                  }}
                  onClick={() => window.alert("Batch resume validation scheduled.")}
                >
                  <span>📄 Verify Pending Resumes</span>
                  <ChevronRight size={14} color="#94a3b8" />
                </button>
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#334155",
                    cursor: "pointer",
                  }}
                  onClick={() => window.alert("Exporting CSV placement report.")}
                >
                  <span>📊 Export 2026 Batch Report</span>
                  <ChevronRight size={14} color="#94a3b8" />
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}