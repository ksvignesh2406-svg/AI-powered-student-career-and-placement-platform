import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
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
  const [notice, setNotice] = useState("");
  const [layers, setLayers] = useState({ heatmap: true, patrols: false, cctv: false });

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  useEffect(() => {
    if (!user || (user.role !== "security" && user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  // Live Clock Ticker
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timers for Night Walks
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
    setLayers((current) => ({ ...current, [layer]: typeof value === "boolean" ? value : !current[layer] }));
  };

  return (
    <div className="security-app">
      <div className="security-shell">
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

        {/* 4. THREE-COLUMN DASHBOARD GRID */}
        <div className="sec-grid">
          {/* LEFT PANEL: SAFETY ALERTS & REPORTS */}
          <SafetyAlertsPanel
            alerts={filteredAlerts}
            filterPriority={filterPriority}
            onFilterChange={setFilterPriority}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
          />

          {/* CENTER PANEL: 3D CAMPUS MAP CONTAINER */}
          <CampusMapPanel
            mapMode={mapMode}
            onMapModeChange={setMapMode}
            selectedAlert={selectedAlert}
            onAssignGuard={handleAssignGuard}
            layers={layers}
            focusIncident={selectedAlert?.id}
          />

          {/* RIGHT PANEL: NIGHT WALKS & GUARDS ON DUTY */}
          <div className="sec-right-col">
            <SecurityCommandPanel
              layers={layers}
              onLayerChange={handleLayerChange}
              onFocusIncident={() => setSelectedAlert(initialAlerts[0])}
            />
            <NightWalkPanel nightWalks={nightWalks} />
            <GuardsOnDutyPanel guards={guards} />
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