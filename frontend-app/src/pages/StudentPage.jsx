import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  Map,
  MessageSquare,
  Moon,
  QrCode,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import {
  publishStudentSOS,
  cancelStudentSOS,
  subscribeEmergencyEvents,
  getActiveSOSEvent,
  getActiveACKEvent,
} from "../utils/emergencyBridge";
import CampusHeatmap3D from "../components/CampusHeatmap3D";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import "../styles/student-dashboard.css";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const defaultDashboard = {
  summary: {
    nextClass: {
      title: "Data Structures Lab",
      startsIn: "15 mins",
      location: "Block B, Room 302",
    },
    attendance: {
      value: "82%",
      status: "Safe",
    },
    fees: {
      value: "Rs. 0",
      status: "Cleared",
    },
  },
  assistant: {
    greeting:
      "I noticed you have Data Structures in 15 mins at Block B. Need the fastest route avoiding the ongoing construction near the library?",
  },
};

const ROUTE_GRAPH = {
  "Main Gate": { "Student Center": 8, Library: 13 },
  "Student Center": { "Main Gate": 8, Library: 7, "Science Block": 8, "Dorm A": 6 },
  Library: { "Main Gate": 13, "Student Center": 7, "Science Block": 9 },
  "Science Block": { "Student Center": 8, Library: 9, "Dorm A": 12, Parking: 10 },
  "Dorm A": { "Student Center": 6, "Science Block": 12, Parking: 8 },
  Parking: { "Science Block": 10, "Dorm A": 8 },
};

const ROUTE_POINTS = {
  "Main Gate": [0, -15],
  "Student Center": [0, 2],
  Library: [4, -3],
  "Science Block": [6, 5],
  "Dorm A": [-6, 6],
  Parking: [15, 10],
};

const ROUTE_INCIDENTS = [
  { id: "INC-001", x: -5.5, z: 6.5, intensity: 3.6, type: "Unauthorized Access", location: "Dorm A" },
  { id: "INC-002", x: 3, z: -2, intensity: 1.8, type: "Motion Sensor", location: "Library" },
];

function calculateSafeRoute(start, end, incidents) {
  const distances = Object.fromEntries(Object.keys(ROUTE_GRAPH).map((node) => [node, Infinity]));
  const previous = {};
  const queue = [{ node: start, distance: 0 }];
  distances[start] = 0;
  while (queue.length) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift();
    if (current.node === end) break;
    Object.entries(ROUTE_GRAPH[current.node] || {}).forEach(([neighbor, baseDistance]) => {
      const incident = incidents.find((item) => item.location === neighbor && item.active !== false);
      const nextDistance = current.distance + baseDistance + (incident ? incident.intensity * 50 : 0);
      if (nextDistance < distances[neighbor]) {
        distances[neighbor] = nextDistance;
        previous[neighbor] = current.node;
        queue.push({ node: neighbor, distance: nextDistance });
      }
    });
  }
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return path.length > 1 && path[0] === start ? path : [];
}

const performanceMetrics = [
  { label: "Attendance", value: 82 },
  { label: "Assignments", value: 76 },
  { label: "Projects", value: 88 },
  { label: "Exams", value: 71 },
  { label: "Participation", value: 64 },
];

function PerformanceRadar() {
  const center = 110;
  const radius = 76;
  const point = (index, value) => {
    const angle = (Math.PI * 2 * index) / performanceMetrics.length - Math.PI / 2;
    const distance = radius * (value / 100);
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
  };
  const outline = performanceMetrics.map((_, index) => point(index, 100)).join(" ");
  const values = performanceMetrics.map((metric, index) => point(index, metric.value)).join(" ");

  return (
    <div className="student-performance" style={{ margin: 0 }}>
      <div className="student-performance-heading">
        <div>
          <span>Performance map</span>
          <strong>Term progress breakdown</strong>
        </div>
        <Sparkles size={18} />
      </div>
      <div className="student-radar-wrap">
        <svg
          className="student-radar"
          viewBox="0 0 220 220"
          role="img"
          aria-label="Radar chart of academic performance"
        >
          <polygon points={outline} className="radar-outline" />
          {[25, 50, 75].map((scale) => (
            <polygon
              key={scale}
              points={performanceMetrics.map((_, index) => point(index, scale)).join(" ")}
              className="radar-grid"
            />
          ))}
          {performanceMetrics.map((_, index) => (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point(index, 100).split(",")[0]}
              y2={point(index, 100).split(",")[1]}
              className="radar-axis"
            />
          ))}
          <polygon points={values} className="radar-value" />
          {performanceMetrics.map((metric, index) => {
            const [x, y] = point(index, 100).split(",");
            return (
              <text
                key={metric.label}
                x={x}
                y={y}
                className="radar-label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {metric.label}
              </text>
            );
          })}
        </svg>
      </div>
      <div className="student-performance-legend">
        {performanceMetrics.map((metric) => (
          <span key={metric.label}>
            <b>{metric.value}%</b> {metric.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SwipeToSOS({ isSOSActive, onActivateSOS, onCancelSOS, sosAck }) {
  const containerRef = useRef(null);
  const dragControls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || 0;
    if (info.offset.x >= containerWidth - 92) {
      onActivateSOS();
    } else {
      dragControls.start({
        x: 0,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      });
    }
  };

  if (isSOSActive)
    return (
      <motion.div
        className="sos-active"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          backgroundColor: sosAck
            ? ["#065f46", "#047857", "#065f46"]
            : ["#ef4444", "#b91c1c", "#ef4444"],
        }}
        transition={{
          backgroundColor: { repeat: Infinity, duration: 1.5 },
          scale: { type: "spring" },
        }}
        style={{ padding: "24px 20px" }}
      >
        <div className="sos-overlay" />
        <ShieldAlert size={48} className="sos-content sos-pulse" />
        <div className="sos-content" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "0.05em", margin: "0 0 6px" }}>
            {sosAck ? "✅ ACKNOWLEDGED BY SECURITY COMMAND" : "🚨 EMERGENCY SOS BROADCASTED"}
          </h3>
          <p style={{ margin: "0 0 12px", fontSize: "13px", opacity: 0.95 }}>
            {sosAck
              ? sosAck.message || "Patrol Unit has been dispatched to your location."
              : "Transmitting emergency coordinates to Security Command Center..."}
          </p>

          {sosAck && (
            <div style={{ background: "rgba(255,255,255,0.18)", padding: "10px 16px", borderRadius: "12px", marginBottom: "14px", display: "inline-flex", flexDirection: "column", gap: "4px", border: "1px solid rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize: "13px", fontWeight: "800" }}>👮 {sosAck.officer}</div>
              <div style={{ fontSize: "12px", color: "#a7f3d0" }}>⏱️ Estimated Arrival: {sosAck.eta || "2 mins"} · Stay where you are</div>
            </div>
          )}
        </div>
        <button
          className="sos-cancel sos-content"
          type="button"
          onClick={onCancelSOS}
          style={{ cursor: "pointer" }}
        >
          Cancel False Alarm
        </button>
      </motion.div>
    );

  return (
    <div ref={containerRef} className="sos-track">
      <span className={isDragging ? "is-dragging" : ""}>SWIPE TO SOS</span>
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={dragControls}
        whileTap={{ scale: 0.95 }}
        className="sos-handle"
      >
        <ArrowRight size={28} />
      </motion.div>
    </div>
  );
}

function EmbeddedChatAssistant({ studentName, greeting }) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        greeting ||
        `Hi ${studentName || "there"}! I am your AI campus companion. Ask me anything about course timings, fastest routes, safe corridors, or study planning.`,
    },
  ]);

  const sendMessage = async (event) => {
    event?.preventDefault();
    const prompt = question.trim();
    if (!prompt || isLoading) return;

    setQuestion("");
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_AI_API_URL;
    try {
      let answer;
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are Campus Assistant AI. Be concise, supportive, and use this student context: attendance 82%, assignments 76%, projects 88%, exams 71%, participation 64%.",
              },
              ...messages.map((m) => ({ role: m.role, content: m.text })),
              { role: "user", content: prompt },
            ],
          }),
        });

        if (!response.ok) throw new Error("AI request failed");
        const data = await response.json();
        answer = data.choices?.[0]?.message?.content || data.message || data.response;
        if (!answer) throw new Error("AI response was empty");
      } else {
        const normalizedPrompt = prompt.toLowerCase();
        if (normalizedPrompt.includes("ghost") || normalizedPrompt.includes("timer")) {
          answer =
            "There are 2 active night-walk timers. One escort is delayed near the Science Block and security has been notified.";
        } else if (normalizedPrompt.includes("route") || normalizedPrompt.includes("safepath")) {
          const route = calculateSafeRoute("Main Gate", "Dorm A", ROUTE_INCIDENTS);
          answer = `SafePath calculated around active incidents: ${route.join(
            " -> "
          )}. Open SafePath to view the route on the 3D map.`;
        } else {
          answer =
            "Your strongest area is projects at 88%. Try a short exam revision session next; exams are currently your biggest opportunity at 71%.";
        }
      }
      setMessages((current) => [...current, { role: "assistant", text: answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I could not reach the AI service right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "480px", background: "white", borderRadius: "18px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", background: "linear-gradient(135deg, #059669 0%, #047857 100%)", color: "white", display: "flex", alignItems: "center", gap: "10px", fontWeight: "700" }}>
        <MessageSquare size={18} />
        <span>Campus Assistant AI</span>
      </div>
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: "14px",
              fontSize: "13px",
              lineHeight: "1.4",
              background: message.role === "user" ? "#059669" : "#ffffff",
              color: message.role === "user" ? "#ffffff" : "#1e293b",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <p style={{ fontSize: "12px", color: "#64748b" }}>Thinking...</p>}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", padding: "12px", background: "#ffffff", borderTop: "1px solid #e2e8f0", gap: "8px" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about courses, routes, or safety..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px" }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ background: "#059669", color: "white", border: "none", borderRadius: "10px", padding: "0 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default function StudentPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [error, setError] = useState("");
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [activeSosId, setActiveSosId] = useState(null);
  const [sosAck, setSosAck] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // SafePath State
  const [start, setStart] = useState("Main Gate");
  const [end, setEnd] = useState("Dorm A");
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const route = calculateSafeRoute(start, end, ROUTE_INCIDENTS);
  const routePath = route.map((node) => ROUTE_POINTS[node]);
  const selectedIncident = ROUTE_INCIDENTS.find(
    (incident) => incident.id === activeIncidentId
  );

  // Night Walk State
  const [timeLeft, setTimeLeft] = useState(600);
  const [walkActive, setWalkActive] = useState(false);

  useEffect(() => {
    if (!walkActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [walkActive]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  // Emergency Bridge Subscription for SOS Acknowledgement
  useEffect(() => {
    const existingSOS = getActiveSOSEvent();
    if (existingSOS && existingSOS.status === "ACTIVE") {
      setIsSOSActive(true);
      setActiveSosId(existingSOS.id);
    }
    const existingAck = getActiveACKEvent();
    if (existingAck) {
      setSosAck(existingAck);
    }

    const unsubscribe = subscribeEmergencyEvents((event) => {
      if (event.type === "SECURITY_ACK_TRIGGERED") {
        setSosAck(event.payload);
      } else if (event.type === "STUDENT_SOS_CANCELLED") {
        setIsSOSActive(false);
        setActiveSosId(null);
        setSosAck(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleActivateSOS = () => {
    const newSosId = `SOS-${Date.now()}`;
    setActiveSosId(newSosId);
    setIsSOSActive(true);
    setSosAck(null);
    publishStudentSOS({
      id: newSosId,
      studentName: user.name || "Student",
      studentId: user.registerNumber || "26BCE1123",
      location: "Academic Block B (Near Lab 302)",
    });
  };

  const handleCancelSOS = () => {
    if (activeSosId) {
      cancelStudentSOS(activeSosId);
    }
    setIsSOSActive(false);
    setActiveSosId(null);
    setSosAck(null);
  };

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("student").then((result) => {
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

  const nextClass =
    dashboard.summary?.nextClass || defaultDashboard.summary.nextClass;

  const studentSidebarItems = [
    {
      id: "overview",
      label: "Home Overview",
      icon: Sparkles,
      tooltip: "Campus overview & essentials",
    },
    {
      id: "academics",
      label: "Academic Snapshot",
      icon: BookOpen,
      badge: "82%",
      tooltip: "Next class & attendance status",
    },
    {
      id: "radar",
      label: "Term Progress Radar",
      icon: Sparkles,
      tooltip: "Skill and performance map",
    },
    {
      id: "safepath",
      label: "SafePath 3D Routing",
      icon: Map,
      badge: "3D Live",
      tooltip: "Full 3D campus routing map",
    },
    {
      id: "nightwalk",
      label: "Night SafeWalk",
      icon: Moon,
      badge: walkActive ? `${minutes}:${seconds}` : "10m",
      badgeVariant: walkActive ? "highlight" : "emerald",
      tooltip: "Live companion escort timer",
    },
    {
      id: "assistant",
      label: "Campus AI Assistant",
      icon: MessageSquare,
      badge: "Online",
      tooltip: "Ask AI for routes, grades & study tips",
    },
    {
      id: "digital-id",
      label: "Digital ID & Pass",
      icon: QrCode,
      tooltip: "Main Gate scanner pass",
    },
    {
      id: "report",
      label: "Report Issue",
      icon: AlertCircle,
      tooltip: "Log safety or facility issues",
    },
  ];

  return (
    <div className="student-app">
      <div className="student-shell" style={{ maxWidth: "1280px" }}>
        {/* Header */}
        <header className="student-header">
          <div className="student-brand">
            <div className="student-brand-icon">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <span>Campus OS</span>
          </div>
          <div className="student-header-actions">
            <button
              className="student-icon-button student-notification"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={24} />
              <span />
            </button>
            <button
              className="student-avatar"
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user.name || "Student"
                )}&backgroundColor=f8fafc`}
                alt="User avatar"
              />
            </button>
          </div>
        </header>

        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%" }}>
          {/* Feature Sidebar */}
          <DashboardFeatureSidebar
            role="student"
            kicker="Student Hub"
            title="Features & Tools"
            items={studentSidebarItems}
            activeItem={activeTab}
            onSelectItem={setActiveTab}
            footerTitle={isSOSActive ? "SOS Beacon Active" : "Safety Beacon Ready"}
            footerText={
              sosAck
                ? `Dispatched: ${sosAck.officer}`
                : "Direct link to Campus Security Command"
            }
          />

          {/* Main Dynamic View Content */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            {error && <p className="student-dashboard-error">{error}</p>}

            {/* TAB: OVERVIEW (HOME) */}
            {activeTab === "overview" && (
              <motion.main
                className="student-main"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ margin: 0 }}
              >
                <section className="student-safety-section">
                  <motion.div variants={itemVariants}>
                    <h1>
                      Welcome back, {user.name}{" "}
                      <span className="student-wave">👋</span>
                    </h1>
                    <p>Your campus snapshot for today.</p>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <SwipeToSOS
                      isSOSActive={isSOSActive}
                      onActivateSOS={handleActivateSOS}
                      onCancelSOS={handleCancelSOS}
                      sosAck={sosAck}
                    />
                  </motion.div>
                  <motion.div className="student-safety-grid" variants={itemVariants}>
                    <button
                      className="student-safety-card night-walk-card"
                      type="button"
                      onClick={() => setActiveTab("nightwalk")}
                    >
                      <span className="student-card-icon">
                        <Moon size={24} />
                      </span>
                      <span className="student-card-copy">
                        <strong>Night Walk</strong>
                        <small>{walkActive ? "Active timer" : "Start timer"}</small>
                      </span>
                    </button>
                    <button
                      className="student-safety-card safepath-card"
                      type="button"
                      onClick={() => setActiveTab("safepath")}
                    >
                      <span className="student-card-icon">
                        <Map size={24} />
                      </span>
                      <span className="student-card-copy">
                        <strong>SafePath</strong>
                        <small>Live 3D routing</small>
                      </span>
                    </button>
                  </motion.div>
                </section>

                <motion.section className="student-snapshot" variants={itemVariants}>
                  <h2>Academic Highlights</h2>
                  <div className="student-next-class">
                    <div className="student-next-icon">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3>{nextClass.title}</h3>
                      <p>Starts in {nextClass.startsIn}</p>
                      <span>
                        <Map size={16} /> {nextClass.location}
                      </span>
                    </div>
                  </div>
                  <div className="student-status-grid">
                    <div className="student-status-card">
                      <span>Attendance</span>
                      <div>
                        <strong>{dashboard.summary.attendance.value}</strong>
                        <b className="status-safe">
                          {dashboard.summary.attendance.status}
                        </b>
                      </div>
                    </div>
                    <div className="student-status-card">
                      <span>Pending Fees</span>
                      <div>
                        <strong>{dashboard.summary.fees.value}</strong>
                        <b className="status-cleared">
                          {dashboard.summary.fees.status}
                        </b>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <motion.section className="student-utilities" variants={itemVariants}>
                  <button type="button" onClick={() => setActiveTab("report")}>
                    <span className="utility-icon issue-icon">
                      <AlertCircle size={24} />
                    </span>
                    <span>
                      <strong>Report an Issue</strong>
                      <small>Maintenance / Safety</small>
                    </span>
                    <ChevronRight size={20} />
                  </button>
                  <button type="button" onClick={() => setActiveTab("digital-id")}>
                    <span className="utility-icon id-icon">
                      <QrCode size={24} />
                    </span>
                    <span>
                      <strong>Digital ID</strong>
                      <small>Show at Main Gate</small>
                    </span>
                    <ChevronRight size={20} />
                  </button>
                </motion.section>
              </motion.main>
            )}

            {/* TAB: ACADEMICS VIEW */}
            {activeTab === "academics" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Academic Snapshot &amp; Timetable</h2>
                      <p className="dashboard-view-subtitle">Today's lectures, attendance thresholds, and clearance records</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div className="student-next-class" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)" }}>
                  <div className="student-next-icon">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h3>{nextClass.title}</h3>
                    <p style={{ fontSize: "14px", color: "#065f46" }}>Starts in {nextClass.startsIn} · Instructor: Dr. Ramanathan</p>
                    <span style={{ fontSize: "13px" }}>
                      <Map size={16} /> Location: {nextClass.location}
                    </span>
                  </div>
                </div>

                <div className="student-status-grid">
                  <div className="student-status-card">
                    <span>Overall Attendance</span>
                    <div>
                      <strong>{dashboard.summary.attendance.value}</strong>
                      <b className="status-safe">{dashboard.summary.attendance.status} (Eligible for Exams)</b>
                    </div>
                  </div>
                  <div className="student-status-card">
                    <span>Tuition Fee Balance</span>
                    <div>
                      <strong>{dashboard.summary.fees.value}</strong>
                      <b className="status-cleared">{dashboard.summary.fees.status} (Receipt #CB-8849)</b>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: PERFORMANCE RADAR VIEW */}
            {activeTab === "radar" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Term Progress Radar</h2>
                      <p className="dashboard-view-subtitle">Multidimensional academic skill &amp; assessment distribution</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <PerformanceRadar />
              </motion.div>
            )}

            {/* TAB: SAFEPATH 3D VIEW */}
            {activeTab === "safepath" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Map size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">SafePath 3D Live Routing</h2>
                      <p className="dashboard-view-subtitle">Dynamic spatial route generation avoiding active campus hazard corridors</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div className="student-map-route-controls" style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                  <label>
                    From
                    <select value={start} onChange={(e) => setStart(e.target.value)}>
                      {Object.keys(ROUTE_POINTS).map((node) => (
                        <option key={node}>{node}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    To
                    <select value={end} onChange={(e) => setEnd(e.target.value)}>
                      {Object.keys(ROUTE_POINTS).map((node) => (
                        <option key={node}>{node}</option>
                      ))}
                    </select>
                  </label>
                  <div className="student-route-result">
                    <strong>
                      {route.length ? route.join(" -> ") : "No safe route found"}
                    </strong>
                    <span>
                      {selectedIncident
                        ? `${selectedIncident.type} active`
                        : "Safe corridor established"}
                    </span>
                  </div>
                </div>

                <div style={{ height: "420px", borderRadius: "16px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                  <CampusHeatmap3D
                    incidents={ROUTE_INCIDENTS}
                    activeIncidentId={activeIncidentId}
                    onIncidentSelect={setActiveIncidentId}
                    routePath={routePath}
                  />
                </div>
              </motion.div>
            )}

            {/* TAB: NIGHT WALK VIEW */}
            {activeTab === "nightwalk" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Moon size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Night SafeWalk Companion</h2>
                      <p className="dashboard-view-subtitle">Automated timed journey tracker monitored by Campus Security Center</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div style={{ textAlign: "center", padding: "30px 20px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white", borderRadius: "18px" }}>
                  <Moon size={42} style={{ color: "#38bdf8", marginBottom: "10px" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 6px" }}>
                    {walkActive ? "SafeWalk Session Active" : "Start SafeWalk Journey"}
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "13px", maxWidth: "460px", margin: "0 auto 20px" }}>
                    If your timer expires before entering your security PIN, Campus Security patrol units are automatically alerted to your coordinates.
                  </p>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 28px", background: "rgba(255,255,255,0.1)", borderRadius: "14px", fontSize: "28px", fontWeight: "900", color: "#38bdf8", marginBottom: "24px" }}>
                    <Clock size={28} />
                    <span>{minutes}:{seconds}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    {!walkActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setTimeLeft(600);
                          setWalkActive(true);
                        }}
                        style={{ padding: "12px 24px", background: "#059669", color: "white", border: "none", borderRadius: "12px", fontWeight: "750", cursor: "pointer", fontSize: "14px" }}
                      >
                        Start 10-Minute Walk
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setWalkActive(false)}
                        style={{ padding: "12px 24px", background: "#38bdf8", color: "#0f172a", border: "none", borderRadius: "12px", fontWeight: "750", cursor: "pointer", fontSize: "14px" }}
                      >
                        Arrived Safely (End Session)
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CAMPUS ASSISTANT AI VIEW */}
            {activeTab === "assistant" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Campus Assistant AI</h2>
                      <p className="dashboard-view-subtitle">Intelligent student assistant for course advice, study tips and campus safety</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <EmbeddedChatAssistant studentName={user.name} greeting={dashboard.assistant?.greeting} />
              </motion.div>
            )}

            {/* TAB: DIGITAL ID VIEW */}
            {activeTab === "digital-id" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Digital Student ID &amp; Gate Pass</h2>
                      <p className="dashboard-view-subtitle">NFC &amp; QR verification for Main Gate and Campus Library scanners</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <div style={{ maxWidth: "380px", margin: "0 auto", padding: "24px", background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", borderRadius: "20px", border: "2px solid #a7f3d0", boxShadow: "0 12px 30px rgba(5, 150, 105, 0.12)", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                    <span style={{ fontWeight: "800", color: "#065f46", fontSize: "14px" }}>CAMPUS OS DIGITAL ID</span>
                    <span style={{ background: "#d1fae5", color: "#047857", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "999px" }}>ACTIVE</span>
                  </div>

                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || "Student")}&backgroundColor=f8fafc`}
                    alt="Student ID photo"
                    style={{ width: "96px", height: "96px", borderRadius: "50%", margin: "0 auto 12px", border: "3px solid #10b981" }}
                  />

                  <h3 style={{ fontSize: "18px", fontWeight: "850", color: "#0f172a", margin: "0 0 4px" }}>{user.name}</h3>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 16px" }}>Register No: {user.registerNumber || "26BCE1123"} · B.Tech CSE</p>

                  <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px dashed #94a3b8", display: "inline-block", marginBottom: "14px" }}>
                    <QrCode size={128} color="#0f172a" />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#059669", fontSize: "12px", fontWeight: "700" }}>
                    <UserCheck size={16} /> Verified Campus Resident Pass
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: REPORT ISSUE VIEW */}
            {activeTab === "report" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="dashboard-view-card"
              >
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Report Maintenance / Safety Issue</h2>
                      <p className="dashboard-view-subtitle">Direct dispatch ticket to Campus Security and Facility Maintenance</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert("Issue reported successfully to Campus Operations."); setActiveTab("overview"); }} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>Category</label>
                    <select className="adm-select" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                      <option>Hostel Safety &amp; Lighting</option>
                      <option>Classroom Equipment / Lab PC</option>
                      <option>Pathway Hazard / Construction</option>
                      <option>Suspicious Activity Report</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>Location</label>
                    <input type="text" placeholder="e.g. Block B, 3rd Floor Water Station" required style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>Description</label>
                    <textarea rows={4} placeholder="Describe the issue in detail..." required style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                  </div>
                  <button type="submit" style={{ padding: "12px 20px", background: "#059669", color: "white", border: "none", borderRadius: "10px", fontWeight: "750", cursor: "pointer", width: "fit-content" }}>
                    Submit Ticket
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
