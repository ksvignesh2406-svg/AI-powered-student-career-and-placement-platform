import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Map,
  Moon,
  Radio,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  Users,
  Video,
} from "lucide-react";
import { clearSession, getSessionUser } from "../utils/authStorage";

import SecurityHeader from "../components/security/SecurityHeader";
import SecurityBanner from "../components/security/SecurityBanner";
import UrgentAlertBanner from "../components/security/UrgentAlertBanner";
import SafetyAlertsPanel from "../components/security/SafetyAlertsPanel";
import CampusMapPanel from "../components/security/CampusMapPanel";
import NightWalkPanel from "../components/security/NightWalkPanel";
import GuardsOnDutyPanel from "../components/security/GuardsOnDutyPanel";
import PublicAlertModal from "../components/security/PublicAlertModal";
import SecurityCommandPanel from "../components/security/SecurityCommandPanel";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import "../styles/security-dashboard.css";

const initialAlerts = [
  {
    id: "ALT-1042",
    priority: "URGENT",
    title: "Escort Request & Unsafe Feeling",
    category: "Student Assistance",
    location: "Hostel B Stairwell (Floor 2)",
    time: "Just now",
    timestamp: Date.now(),
    description:
      "Student requested guard escort back to room after studying late. Audio check-in flagged low voice tone.",
    status: "Pending",
    reporter: "Ananya S. (Hostel B, R-204)",
  },
  {
    id: "ALT-1039",
    priority: "ATTENTION",
    title: "Late Night Gathering past Curfew",
    category: "Hostel Rules",
    location: "North Courtyard Bench",
    time: "4 mins ago",
    timestamp: Date.now() - 240000,
    description:
      "Group of 6 students sitting near the fountain past curfew. Mild noise reported by floor warden.",
    status: "Assigned",
    reporter: "AI Smart Cam #04",
  },
  {
    id: "ALT-1035",
    priority: "INFO",
    title: "Pathway Lighting Flickering",
    category: "Maintenance",
    location: "Path between Library & Hostel C",
    time: "20 mins ago",
    timestamp: Date.now() - 1200000,
    description:
      "Solar lamp light #12 is dimming. Maintenance ticket automatically logged.",
    status: "Resolved",
    reporter: "Night Warden Patrol",
  },
];

const initialNightWalks = [
  {
    id: "NW-88",
    name: "Priya R.",
    hostelRoom: "Hostel A - 312",
    destination: "Hostel A Block",
    secondsRemaining: 310,
    totalSeconds: 600,
    status: "normal",
    phone: "+91 98765 43210",
  },
  {
    id: "NW-91",
    name: "Rahul K.",
    hostelRoom: "Hostel C - 108",
    destination: "Main Gate Canteen",
    secondsRemaining: 55,
    totalSeconds: 900,
    status: "check-in",
    phone: "+91 98765 12345",
  },
];

const initialGuards = [
  {
    id: "G-1",
    name: "Suresh Kumar",
    role: "Senior Warden Guard",
    status: "On Duty",
    location: "Hostel B Desk",
    battery: 94,
    initials: "SK",
  },
  {
    id: "G-2",
    name: "Meena Sharma",
    role: "Patrol Staff",
    status: "Assisting",
    location: "North Courtyard",
    battery: 81,
    initials: "MS",
  },
  {
    id: "G-3",
    name: "Ramesh Singh",
    role: "Gate 1 Warden",
    status: "On Duty",
    location: "Main Entrance",
    battery: 88,
    initials: "RS",
  },
];

export default function SecurityPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getSessionUser());
  const [time, setTime] = useState(null);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [nightWalks, setNightWalks] = useState(initialNightWalks);
  const [guards] = useState(initialGuards);

  const [filterPriority, setFilterPriority] = useState("ALL");
  const [selectedAlert, setSelectedAlert] = useState(initialAlerts[0]);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [mapMode, setMapMode] = useState("3D Campus");
  const [layers, setLayers] = useState({ heatmap: true, patrols: true, cctv: false });
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  useEffect(() => {
    if (!user || (user.role !== "security" && user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNightWalks((prev) =>
        prev.map((nw) => {
          const nextSec = Math.max(0, nw.secondsRemaining - 1);
          let status = "normal";
          if (nextSec <= 60 && nextSec > 0) status = "check-in";
          if (nextSec === 0) status = "overdue";
          return { ...nw, secondsRemaining: nextSec, status };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "09:21:52 PM";

  const formattedDate = time
    ? time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Fri, Aug 21";

  const handleAssignGuard = (id) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Assigned" } : item
      )
    );
    if (selectedAlert?.id === id) {
      setSelectedAlert((prev) =>
        prev ? { ...prev, status: "Assigned" } : null
      );
    }
    flash(`Guard dispatched for incident #${id}`);
  };

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  const filteredAlerts = alerts.filter((item) => {
    if (filterPriority === "ALL") return true;
    return item.priority === filterPriority;
  });

  const urgentAlert = alerts.find(
    (a) => a.priority === "URGENT" && a.status === "Pending"
  );

  const handleLayerChange = (layer, value) => {
    setLayers((current) => ({
      ...current,
      [layer]: typeof value === "boolean" ? value : !current[layer],
    }));
  };

  const securitySidebarItems = [
    {
      id: "overview",
      label: "Home Overview",
      icon: Sparkles,
      tooltip: "Command summary & active operations",
    },
    {
      id: "triage",
      label: "SOS Emergency Triage",
      icon: ShieldAlert,
      badge: `${alerts.filter((a) => a.status === "Pending").length} Pending`,
      badgeVariant:
        alerts.filter((a) => a.status === "Pending").length > 0
          ? "highlight"
          : "emerald",
      tooltip: "Active student distress signals and escort calls",
    },
    {
      id: "map",
      label: "3D Spatial Campus Map",
      icon: Map,
      badge: mapMode,
      tooltip: "Interactive 3D building layout with incident heatmap",
    },
    {
      id: "cctv",
      label: "CCTV Telemetry Feeds",
      icon: Video,
      badge: layers.cctv ? "4 Live" : "Standby",
      badgeVariant: layers.cctv ? "emerald" : "",
      tooltip: "Active optical security feeds",
    },
    {
      id: "nightwalk",
      label: "Night SafeWalk Monitor",
      icon: Moon,
      badge: `${nightWalks.length} Active`,
      tooltip: "Live monitoring of student night escort timers",
    },
    {
      id: "patrols",
      label: "Guards & Patrol Zones",
      icon: Users,
      badge: `${guards.filter((g) => g.status === "On Duty").length} On Duty`,
      tooltip: "Check patrol deployments, guard battery and zones",
    },
    {
      id: "broadcast",
      label: "Public Safety Advisory",
      icon: Radio,
      tooltip: "Broadcast audible emergency siren or text alert to campus",
      action: () => setIsBroadcastModalOpen(true),
    },
    {
      id: "nexus",
      label: "Nexus Security AI",
      icon: Terminal,
      badge: "Ready",
      tooltip: "Command-line AI tactical analysis and hazard routing",
    },
  ];

  return (
    <div className="security-app">
      <div className="security-shell" style={{ maxWidth: "1400px" }}>
        {/* 1. TOP NAV BAR */}
        <SecurityHeader
          user={user}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          audioMuted={audioMuted}
          onToggleAudio={() => setAudioMuted(!audioMuted)}
          onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* 2. HERO EMERALD BANNER */}
        <SecurityBanner
          activeAlertsCount={
            alerts.filter((a) => a.status === "Pending").length
          }
          nightWalksCount={nightWalks.length}
          guardsReadyCount={guards.filter((g) => g.status === "On Duty").length}
        />

        {/* 3. URGENT ALERT BANNER */}
        <UrgentAlertBanner
          alert={urgentAlert}
          onAssignGuard={handleAssignGuard}
        />

        {/* 4. SIDEBAR + DYNAMIC VIEW WORKSPACE */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%", marginTop: "24px" }}>
          {/* Feature Sidebar */}
          <DashboardFeatureSidebar
            role="security"
            kicker="Command Center"
            title="Tactical Tools"
            items={securitySidebarItems}
            activeItem={activeTab}
            onSelectItem={setActiveTab}
            footerTitle="Perimeter Secure"
            footerText="All 4 campus gate scanners operational"
          />

          {/* Dynamic Main Workspace */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            {/* VIEW: OVERVIEW (HOME) */}
            {activeTab === "overview" && (
              <div className="sec-grid" style={{ margin: 0 }}>
                <SafetyAlertsPanel
                  alerts={filteredAlerts}
                  filterPriority={filterPriority}
                  onFilterChange={setFilterPriority}
                  selectedAlert={selectedAlert}
                  onSelectAlert={setSelectedAlert}
                />
                <CampusMapPanel
                  mapMode={mapMode}
                  onMapModeChange={setMapMode}
                  selectedAlert={selectedAlert}
                  onAssignGuard={handleAssignGuard}
                  layers={layers}
                  focusIncident={selectedAlert?.id}
                />
                <div className="sec-right-col">
                  <NightWalkPanel nightWalks={nightWalks} />
                  <GuardsOnDutyPanel guards={guards} />
                </div>
              </div>
            )}

            {/* VIEW: EMERGENCY TRIAGE */}
            {activeTab === "triage" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Emergency SOS &amp; Incident Triage Queue</h2>
                      <p className="dashboard-view-subtitle">Live dispatcher queue for escort calls and distress signals</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <SafetyAlertsPanel
                  alerts={filteredAlerts}
                  filterPriority={filterPriority}
                  onFilterChange={setFilterPriority}
                  selectedAlert={selectedAlert}
                  onSelectAlert={setSelectedAlert}
                />
              </div>
            )}

            {/* VIEW: 3D SPATIAL MAP */}
            {activeTab === "map" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Map size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">3D Campus Spatial Awareness Map</h2>
                      <p className="dashboard-view-subtitle">Spatial heatmap overlay, active hazard corridors and Dijkstra routing</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <CampusMapPanel
                  mapMode={mapMode}
                  onMapModeChange={setMapMode}
                  selectedAlert={selectedAlert}
                  onAssignGuard={handleAssignGuard}
                  layers={layers}
                  focusIncident={selectedAlert?.id}
                />
              </div>
            )}

            {/* VIEW: CCTV FEEDS */}
            {activeTab === "cctv" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Video size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Active Optical CCTV Feeds</h2>
                      <p className="dashboard-view-subtitle">Real-time quad surveillance telemetry</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                  {[
                    { cam: "CAM-01 · North Courtyard", loc: "North Quad Fountain", status: "ONLINE (1080p 60fps)" },
                    { cam: "CAM-02 · Science Block", loc: "Ground Floor Corridor", status: "ONLINE (1080p 60fps)" },
                    { cam: "CAM-03 · Main Gate A", loc: "Vehicle Checkpoint", status: "ONLINE (1080p 60fps)" },
                    { cam: "CAM-04 · Library Square", loc: "East Perimeter Path", status: "ONLINE (1080p 60fps)" },
                  ].map((c) => (
                    <div key={c.cam} style={{ background: "#0f172a", borderRadius: "14px", overflow: "hidden", color: "white" }}>
                      <div style={{ height: "160px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <Video size={36} style={{ color: "#10b981", opacity: 0.8 }} />
                        <span style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(239, 68, 68, 0.9)", color: "white", fontSize: "10px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px" }}>
                          ● REC
                        </span>
                      </div>
                      <div style={{ padding: "12px 16px" }}>
                        <strong style={{ fontSize: "13px" }}>{c.cam}</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" }}>{c.loc} · {c.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: NIGHT SAFEWALKS */}
            {activeTab === "nightwalk" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Moon size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Night SafeWalk Live Escort Monitor</h2>
                      <p className="dashboard-view-subtitle">Active student journey countdowns and automated overdue alerts</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <NightWalkPanel nightWalks={nightWalks} />
              </div>
            )}

            {/* VIEW: GUARDS & PATROLS */}
            {activeTab === "patrols" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Users size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Guards On Duty &amp; Zone Deployments</h2>
                      <p className="dashboard-view-subtitle">Active security personnel, comms status, and battery levels</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <GuardsOnDutyPanel guards={guards} />
              </div>
            )}

            {/* VIEW: NEXUS AI COMMAND */}
            {activeTab === "nexus" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Nexus Security Command AI</h2>
                      <p className="dashboard-view-subtitle">Automated spatial query runner and tactical layer controller</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <SecurityCommandPanel
                  layers={layers}
                  onLayerChange={handleLayerChange}
                  onFocusIncident={() => setSelectedAlert(initialAlerts[0])}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. PUBLIC ALERT BROADCAST MODAL */}
      <PublicAlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSendAlert={() =>
          flash("Public advisory alert broadcasted to all residents.")
        }
        operatorName={`${user?.name || "Santhosh K."} (Head Warden)`}
      />

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
    </div>
  );
}