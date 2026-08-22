import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertOctagon,
  ArrowLeft,
  Building2,
  Check,
  HeartPulse,
  LogOut,
  Radio,
  Server,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { clearSession, getSessionUser, getUsers } from "../utils/authStorage";

import PulseWidgets from "../components/admin/PulseWidgets";
import WellbeingSignals from "../components/admin/WellbeingSignals";
import IncidentTriage from "../components/admin/IncidentTriage";
import EmergencyBroadcast from "../components/admin/EmergencyBroadcast";
import UserDirectoryModal from "../components/admin/UserDirectoryModal";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import "../styles/admin-dashboard.css";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getSessionUser());
  const [notice, setNotice] = useState("");
  const [showDirectory, setShowDirectory] = useState(false);
  const [userCount, setUserCount] = useState(() => getUsers().length);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "security")) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  const adminSidebarItems = [
    {
      id: "overview",
      label: "Home Overview",
      icon: Sparkles,
      tooltip: "Executive pulse & status",
    },
    {
      id: "directory",
      label: "User Directory Hub",
      icon: Users,
      badge: `${userCount} Users`,
      tooltip: "Manage student, staff and security accounts",
      action: () => setShowDirectory(true),
    },
    {
      id: "wellbeing",
      label: "Wellbeing Signals",
      icon: HeartPulse,
      badge: "8 High Risk",
      badgeVariant: "highlight",
      tooltip: "Mental wellbeing and stress radar for counselors",
    },
    {
      id: "triage",
      label: "AI Incident Triage",
      icon: Shield,
      badge: "3 Active",
      tooltip: "Automated alert classification and guard dispatch",
    },
    {
      id: "broadcast",
      label: "Emergency Broadcast",
      icon: Radio,
      tooltip: "Push instant emergency sirens and SMS advisories",
    },
    {
      id: "departments",
      label: "Campus Departments",
      icon: Building2,
      tooltip: "View academic faculty distributions",
    },
    {
      id: "telemetry",
      label: "System Network Health",
      icon: Server,
      badge: "99.98%",
      badgeVariant: "emerald",
      tooltip: "Database connection, Redis cache and auth servers status",
    },
  ];

  return (
    <div className="admin-app">
      <div className="admin-shell">
        {/* Header */}
        <header className="adm-header">
          <div className="adm-brand">
            <div className="adm-brand-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="adm-brand-title">Campus OS</div>
              <div className="adm-brand-subtitle">Counselor &amp; Admin Hub</div>
            </div>
          </div>

          <div className="adm-header-actions">
            <div className="adm-live-badge">
              <span className="adm-live-dot" />
              <span>System Live &amp; Monitoring</span>
            </div>

            <button
              type="button"
              onClick={() => setShowDirectory(true)}
              className="adm-btn-secondary"
            >
              <Users size={14} />
              <span>Directory ({userCount})</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="adm-btn-logout"
              title="Log out"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%" }}>
          {/* Feature Sidebar */}
          <DashboardFeatureSidebar
            role="admin"
            kicker="Operations Center"
            title="Admin Console"
            items={adminSidebarItems}
            activeItem={activeTab}
            onSelectItem={setActiveTab}
            footerTitle="Administrator Access"
            footerText="Full administrative authorization"
          />

          {/* Dynamic Main Workspace */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            {/* VIEW: OVERVIEW (HOME) */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <PulseWidgets itemVariants={itemVariants} />
                <motion.div
                  className="adm-split-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <WellbeingSignals
                    itemVariants={itemVariants}
                    onScheduleNotice={flash}
                  />
                  <IncidentTriage
                    itemVariants={itemVariants}
                    onDispatchNotice={flash}
                  />
                </motion.div>
              </div>
            )}

            {/* VIEW: WELLBEING SIGNALS */}
            {activeTab === "wellbeing" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <HeartPulse size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Student Mental Wellbeing &amp; Stress Signals</h2>
                      <p className="dashboard-view-subtitle">AI early intervention telemetry for campus counselors and proctors</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <WellbeingSignals itemVariants={itemVariants} onScheduleNotice={flash} />
              </div>
            )}

            {/* VIEW: INCIDENT TRIAGE */}
            {activeTab === "triage" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">AI Incident Triage &amp; Guard Dispatch</h2>
                      <p className="dashboard-view-subtitle">Automated severity classification and rapid responder routing</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <IncidentTriage itemVariants={itemVariants} onDispatchNotice={flash} />
              </div>
            )}

            {/* VIEW: EMERGENCY BROADCAST */}
            {activeTab === "broadcast" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Radio size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Emergency Campus Broadcast Dispatcher</h2>
                      <p className="dashboard-view-subtitle">Trigger push notifications, SMS alerts, and acoustic alarm relays</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <EmergencyBroadcast itemVariants={itemVariants} onBroadcastNotice={flash} />
              </div>
            )}

            {/* VIEW: DEPARTMENTS */}
            {activeTab === "departments" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Campus Academic Departments</h2>
                      <p className="dashboard-view-subtitle">Enrollment ratios, allocated faculty, and departmental HODs</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {[
                    { dept: "Computer Science & Engineering", students: "1,240 Students", faculty: "42 Faculty", hod: "Dr. Rajesh Sharma" },
                    { dept: "Electronics & Communication", students: "980 Students", faculty: "34 Faculty", hod: "Dr. K. Venkatesh" },
                    { dept: "Mechanical Engineering", students: "720 Students", faculty: "28 Faculty", hod: "Dr. Arvind Menon" },
                    { dept: "Management Studies (MBA)", students: "450 Students", faculty: "18 Faculty", hod: "Dr. Preeti Verma" },
                  ].map((d) => (
                    <div key={d.dept} style={{ padding: "18px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>{d.dept}</strong>
                      <p style={{ margin: "4px 0", fontSize: "12px", color: "#059669", fontWeight: "700" }}>{d.students} · {d.faculty}</p>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>HOD: {d.hod}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: SYSTEM TELEMETRY */}
            {activeTab === "telemetry" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Server size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">System Health &amp; Telemetry Status</h2>
                      <p className="dashboard-view-subtitle">Real-time status of Campus OS API clusters, Redis sockets, and databases</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
                  {[
                    { name: "MySQL Primary DB", status: "Healthy (12ms latency)", value: "Connected" },
                    { name: "JWT Auth Service", status: "100% operational", value: "Active" },
                    { name: "SafePath Dijkstra Engine", status: "0 incidents dropped", value: "Optimal" },
                    { name: "Emergency Broadcast Relay", status: "GSM & Push Ready", value: "Standby" },
                  ].map((srv) => (
                    <div key={srv.name} style={{ padding: "16px", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #a7f3d0" }}>
                      <strong style={{ fontSize: "13px", color: "#065f46" }}>{srv.name}</strong>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#047857" }}>{srv.status}</p>
                      <span style={{ display: "inline-block", marginTop: "8px", fontSize: "10px", fontWeight: "800", padding: "2px 6px", borderRadius: "999px", background: "#d1fae5", color: "#065f46" }}>
                        {srv.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice Toast */}
      {notice && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "28px",
            zIndex: 70,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 18px",
            color: "#047857",
            background: "#ffffff",
            border: "1px solid #a7f3d0",
            borderRadius: "14px",
            boxShadow: "0 16px 36px rgba(5, 118, 85, 0.15)",
            fontSize: "12px",
            fontWeight: "750",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#059669",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={12} strokeWidth={3} />
          </div>
          <span>{notice}</span>
        </div>
      )}

      {/* User Directory Modal */}
      {showDirectory && (
        <UserDirectoryModal
          onClose={() => {
            setShowDirectory(false);
            setUserCount(getUsers().length);
          }}
          onNotice={flash}
        />
      )}
    </div>
  );
}