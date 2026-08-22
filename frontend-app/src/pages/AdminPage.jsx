import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  AlertOctagon,
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
      staggerChildren: 0.1,
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
  const [activeFeature, setActiveFeature] = useState("pulse");

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
      id: "pulse",
      label: "Campus Pulse & Stats",
      icon: Activity,
      badge: "Real-time",
      tooltip: "Live occupancy, active faculty & security numbers",
      action: () => {
        document.querySelector(".adm-pulse-grid")?.scrollIntoView({ behavior: "smooth" });
      },
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
      action: () => {
        document.querySelector(".adm-split-grid")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "triage",
      label: "AI Incident Triage",
      icon: Shield,
      badge: "3 Active",
      tooltip: "Automated alert classification and guard dispatch",
      action: () => {
        document.querySelector(".adm-split-grid")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "broadcast",
      label: "Emergency Broadcast",
      icon: Radio,
      tooltip: "Push instant emergency sirens and SMS advisories",
      action: () => {
        document.querySelector(".adm-broadcast-card")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "departments",
      label: "Campus Departments",
      icon: Building2,
      tooltip: "View academic faculty distributions",
      action: () => flash("6 Academic Departments Active · 42 Faculty Members"),
    },
    {
      id: "telemetry",
      label: "System Network Health",
      icon: Server,
      badge: "99.98%",
      badgeVariant: "emerald",
      tooltip: "Database connection, Redis cache and auth servers status",
      action: () => flash("All 8 Campus OS server nodes operating optimally."),
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
          <DashboardFeatureSidebar
            role="admin"
            kicker="Operations Center"
            title="Admin Console"
            items={adminSidebarItems}
            activeItem={activeFeature}
            onSelectItem={setActiveFeature}
            footerTitle="Administrator Access"
            footerText="Full administrative authorization"
          />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px", minWidth: 0 }}>
            {/* 1. Top Row Widgets */}
            <PulseWidgets itemVariants={itemVariants} />

            {/* 2. Middle Row: Wellbeing Signals + AI Incident Triage */}
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

            {/* 3. Bottom Section: Quick Emergency Broadcast */}
            <EmergencyBroadcast
              itemVariants={itemVariants}
              onBroadcastNotice={flash}
            />
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