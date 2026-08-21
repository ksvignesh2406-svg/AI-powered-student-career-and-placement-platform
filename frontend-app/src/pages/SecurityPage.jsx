import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertOctagon,
  Bell,
  CheckCircle,
  Clock,
  LogOut,
  MapPin,
  Moon,
  Navigation,
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/security-dashboard.css";

const defaultDashboard = {
  summary: {
    activeGuards: 0,
    openAlerts: 0,
    activeSafeWalks: 0,
    gateCheckinsToday: 0,
  },
  activeAlerts: [],
  safeWalks: [],
  patrolZones: [],
  incidentLogs: [],
};

export default function SecurityPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [alerts, setAlerts] = useState([]);
  const [safeWalks, setSafeWalks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "security") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("security").then((result) => {
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
      setAlerts(result.dashboard.activeAlerts || []);
      setSafeWalks(result.dashboard.safeWalks || []);
    });

    return () => {
      isMounted = false;
    };
  }, [navigate, user?.role]);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  const handleDispatch = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: "EN_ROUTE",
              assignedUnit: "Patrol Unit Alpha Dispatched (ETA 2m)",
            }
          : a
      )
    );
  };

  const handleResolveAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleCompleteWalk = (walkId) => {
    setSafeWalks((prev) => prev.filter((w) => w.id !== walkId));
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SC";

  return (
    <div className="security-dashboard">
      <header className="security-header">
        <div className="security-header-inner">
          <div className="security-brand">
            <span className="security-brand-mark">
              <ShieldAlert size={18} />
            </span>
            <span>Campus OS</span>
          </div>

          <div className="security-user-menu">
            <div className="security-user-copy">
              <strong>{user.name}</strong>
              <span>Security Command Center</span>
            </div>
            <span className="security-avatar">{initials}</span>
            <button
              type="button"
              className="security-icon-button"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="security-main">
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

        <section className="security-banner">
          <div>
            <span className="security-eyebrow">
              <Radio size={14} /> Live Command Feed
            </span>
            <h1>Campus Security Center</h1>
            <p>
              <ShieldCheck size={16} /> Campus perimeter secure · Real-time spatial monitoring active
            </p>
          </div>

          <div className="security-stats-grid">
            <div className="security-stat-card">
              <strong>{dashboard.summary.activeGuards}</strong>
              <span>Patrol Units</span>
            </div>
            <div className="security-stat-card">
              <strong>{alerts.length}</strong>
              <span>SOS Alerts</span>
            </div>
            <div className="security-stat-card">
              <strong>{safeWalks.length}</strong>
              <span>Active SafeWalks</span>
            </div>
            <div className="security-stat-card">
              <strong>{dashboard.summary.gateCheckinsToday}</strong>
              <span>Gate Passes</span>
            </div>
          </div>
        </section>

        <div className="security-grid">
          <div className="security-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Live SOS Emergencies */}
            <section className="security-panel">
              <div className="security-panel-heading">
                <div>
                  <span className="security-section-kicker">Emergency Triage</span>
                  <h2>Active SOS Broadcasts</h2>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "800", color: alerts.length > 0 ? "#dc2626" : "#16a34a" }}>
                  {alerts.length > 0 ? `${alerts.length} Incident Active` : "All Clear"}
                </span>
              </div>

              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="sos-alert-card">
                    <div className="sos-alert-header">
                      <span className="sos-badge-pulse">
                        <AlertOctagon size={14} /> {alert.type}
                      </span>
                      <span style={{ fontSize: "11px", color: "#b91c1c", fontWeight: "700" }}>
                        {alert.time}
                      </span>
                    </div>

                    <div className="sos-alert-body">
                      <h3>
                        {alert.senderName} ({alert.registerNumber})
                      </h3>
                      <div className="sos-alert-meta">
                        <span>
                          <MapPin size={14} color="#dc2626" /> {alert.location}
                        </span>
                        <span>
                          <Shield size={14} color="#dc2626" /> {alert.assignedUnit}
                        </span>
                      </div>
                    </div>

                    <div className="sos-actions">
                      {alert.status === "DISPATCHED" && (
                        <button
                          type="button"
                          className="btn-dispatch"
                          onClick={() => handleDispatch(alert.id)}
                        >
                          <Navigation size={14} /> Dispatch Nearest Patrol Unit
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-resolve"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        <CheckCircle size={14} /> Resolve False Alarm / Incident
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                  <ShieldCheck size={40} color="#16a34a" style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontWeight: "700", fontSize: "14px", color: "#334155" }}>
                    No active emergency broadcasts
                  </p>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    All SOS channels and student beacons are quiet.
                  </span>
                </div>
              )}
            </section>

            {/* Active SafeWalk Tracking */}
            <section className="security-panel">
              <div className="security-panel-heading">
                <div>
                  <span className="security-section-kicker">Companion Monitoring</span>
                  <h2>Active Night SafeWalks</h2>
                </div>
                <Moon size={18} color="#0f172a" />
              </div>

              <div className="safewalk-list">
                {safeWalks.map((walk) => (
                  <div key={walk.id} className="safewalk-card">
                    <div className="safewalk-info">
                      <h4>{walk.studentName}</h4>
                      <p>
                        <MapPin size={13} /> Destination: {walk.destination}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className="safewalk-timer">
                        <Clock size={14} /> {walk.remainingMins}m left
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCompleteWalk(walk.id)}
                        style={{
                          border: "1px solid #cbd5e1",
                          borderRadius: "10px",
                          background: "white",
                          padding: "6px 12px",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          color: "#475569",
                        }}
                      >
                        Mark Arrived
                      </button>
                    </div>
                  </div>
                ))}
                {safeWalks.length === 0 && (
                  <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "13px", padding: "16px" }}>
                    No active night walk sessions at this time.
                  </p>
                )}
              </div>
            </section>
          </div>

          <aside className="security-sidebar" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Patrol Zones */}
            <section className="security-panel">
              <div className="security-panel-heading">
                <div>
                  <span className="security-section-kicker">Deployment</span>
                  <h2>Patrol Zones</h2>
                </div>
                <Navigation size={18} color="#dc2626" />
              </div>

              <div className="patrol-list">
                {dashboard.patrolZones.map((zone) => (
                  <div key={zone.id} className="patrol-card">
                    <div className="patrol-card-header">
                      <strong>{zone.name}</strong>
                      <span className="patrol-status-pill">{zone.status}</span>
                    </div>
                    <div className="patrol-meta">
                      <span>👮 {zone.officer}</span>
                      <span>⏱️ {zone.lastCheckin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Incident Logs */}
            <section className="security-panel">
              <div className="security-panel-heading">
                <div>
                  <span className="security-section-kicker">Logbook</span>
                  <h2>Recent Incidents</h2>
                </div>
                <Shield size={18} color="#64748b" />
              </div>

              <div className="incident-list">
                {dashboard.incidentLogs.map((inc) => (
                  <div key={inc.id} className="incident-card">
                    <strong>{inc.title}</strong>
                    <div className="incident-meta">
                      <span>Reported by: {inc.reporter}</span>
                      <span>{inc.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}