import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  AlertCircle,
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
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import CampusHeatmap3D from "../components/CampusHeatmap3D";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import "../styles/student-dashboard.css";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
    <div className="student-performance" id="performance-radar-section">
      <div className="student-performance-heading">
        <div>
          <span>Performance map</span>
          <strong>Term progress</strong>
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

function SwipeToSOS({ isSOSActive, setIsSOSActive }) {
  const containerRef = useRef(null);
  const dragControls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || 0;
    if (info.offset.x >= containerWidth - 92) setIsSOSActive(true);
    else
      dragControls.start({
        x: 0,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      });
  };

  if (isSOSActive)
    return (
      <motion.div
        className="sos-active"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          backgroundColor: ["#ef4444", "#b91c1c", "#ef4444"],
        }}
        transition={{
          backgroundColor: { repeat: Infinity, duration: 1.5 },
          scale: { type: "spring" },
        }}
      >
        <div className="sos-overlay" />
        <ShieldAlert size={48} className="sos-content sos-pulse" />
        <div className="sos-content">
          <h3>SOS BROADCASTED</h3>
          <p>Campus Security is on their way.</p>
        </div>
        <button
          className="sos-cancel sos-content"
          type="button"
          onClick={() => setIsSOSActive(false)}
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

function ChatAssistant({ studentName, greeting, isChatOpen, setIsChatOpen }) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        greeting ||
        `Hi ${studentName || "there"}! I can help with your classes, performance, campus safety, or the fastest route to your next class.`,
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
    <div className="student-chat-wrap">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="student-chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="student-chat-header">
              <span>
                <MessageSquare size={20} /> Campus Assistant AI
              </span>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
            <div className="student-chat-body">
              {messages.map((message, index) => (
                <p
                  className={
                    message.role === "user" ? "student-chat-message-user" : ""
                  }
                  key={`${message.role}-${index}`}
                >
                  {message.text}
                </p>
              ))}
              {isLoading && <p className="student-chat-loading">Thinking...</p>}
            </div>
            <form className="student-chat-input" onSubmit={sendMessage}>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                type="text"
                placeholder="Ask anything..."
                aria-label="Ask Campus Assistant AI"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={isLoading}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="student-chat-button"
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}

function NightWalkModal({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(600);
  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((previous) => Math.max(previous - 1, 0)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <motion.div
      className="night-walk-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="night-walk-modal"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="modal-handle" />
        <div className="night-walk-title">
          <div>
            <Moon size={32} />
          </div>
          <h2>Night Walk Active</h2>
          <p>
            We are monitoring your journey. If the timer runs out, Campus Security
            will be alerted.
          </p>
        </div>
        <div className="night-walk-timer">
          <Clock size={24} />
          <strong>
            {minutes}:{seconds}
          </strong>
        </div>
        <div className="security-pin">
          <label>Security PIN</label>
          <div>
            {[1, 2, 3, 4].map((number) => (
              <input
                key={number}
                type="password"
                maxLength={1}
                aria-label={`PIN digit ${number}`}
              />
            ))}
          </div>
        </div>
        <button className="end-walk" type="button" onClick={onClose}>
          End Safe Walk
        </button>
        <button className="cancel-walk" type="button" onClick={onClose}>
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}

function StudentCampusMapModal({ onClose }) {
  const [start, setStart] = useState("Main Gate");
  const [end, setEnd] = useState("Dorm A");
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const route = calculateSafeRoute(start, end, ROUTE_INCIDENTS);
  const routePath = route.map((node) => ROUTE_POINTS[node]);
  const selectedIncident = ROUTE_INCIDENTS.find(
    (incident) => incident.id === activeIncidentId
  );

  return (
    <motion.div
      className="student-map-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="student-map-modal"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
      >
        <div className="student-map-modal-header">
          <div>
            <span>SafePath / Nexus Routing</span>
            <h2>Live campus 3D map</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close campus map"
          >
            <X size={18} />
          </button>
        </div>
        <div className="student-map-route-controls">
          <label>
            From
            <select
              value={start}
              onChange={(event) => setStart(event.target.value)}
            >
              {Object.keys(ROUTE_POINTS).map((node) => (
                <option key={node}>{node}</option>
              ))}
            </select>
          </label>
          <label>
            To
            <select
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            >
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
                ? `${selectedIncident.type} selected`
                : "Route avoids active incident zones"}
            </span>
          </div>
        </div>
        <div className="student-map-viewport">
          <CampusHeatmap3D
            incidents={ROUTE_INCIDENTS}
            activeIncidentId={activeIncidentId}
            onIncidentSelect={setActiveIncidentId}
            routePath={routePath}
          />
        </div>
        <div className="student-map-footer">
          <span>
            <b /> Campus grid online
          </span>
          <span>
            {ROUTE_INCIDENTS.length} active safety signals · click a marker for
            details
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StudentPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [error, setError] = useState("");
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showNightWalk, setShowNightWalk] = useState(false);
  const [showCampusMap, setShowCampusMap] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState("academic");

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
      id: "academic",
      label: "Academic Snapshot",
      icon: BookOpen,
      badge: "82%",
      tooltip: "Next class and attendance summary",
      action: () => {
        document.getElementById("academic-snapshot-section")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "radar",
      label: "Term Progress Radar",
      icon: Sparkles,
      tooltip: "Academic skill and performance map",
      action: () => {
        document.getElementById("performance-radar-section")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "safepath",
      label: "SafePath 3D Routing",
      icon: Map,
      badge: "3D Live",
      tooltip: "Open 3D campus routing map",
      action: () => setShowCampusMap(true),
    },
    {
      id: "nightwalk",
      label: "Night SafeWalk",
      icon: Moon,
      badge: "Timer",
      tooltip: "Start companion safe walk timer",
      action: () => setShowNightWalk(true),
    },
    {
      id: "sos",
      label: "Emergency SOS Beacon",
      icon: ShieldAlert,
      badge: isSOSActive ? "ACTIVE" : "Ready",
      badgeVariant: isSOSActive ? "highlight" : "emerald",
      tooltip: "Trigger campus security SOS alert",
      action: () => setIsSOSActive((prev) => !prev),
    },
    {
      id: "assistant",
      label: "Campus Assistant AI",
      icon: MessageSquare,
      badge: "Online",
      tooltip: "Ask Campus AI for routes, grades & study tips",
      action: () => setIsChatOpen((prev) => !prev),
    },
    {
      id: "digital-id",
      label: "Digital ID & Gate Pass",
      icon: QrCode,
      tooltip: "Show Digital ID for Main Gate Scanner",
      action: () => alert("Digital ID verified: Pass valid for Main Gate entry/exit."),
    },
    {
      id: "report",
      label: "Report Issue",
      icon: AlertCircle,
      tooltip: "Report safety or facility issue",
      action: () => alert("Campus Facilities ticket window logged."),
    },
  ];

  return (
    <div className="student-app">
      <div className="student-shell" style={{ maxWidth: "1280px" }}>
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
          <DashboardFeatureSidebar
            role="student"
            kicker="Student Hub"
            title="Features & Tools"
            items={studentSidebarItems}
            activeItem={activeSidebarItem}
            onSelectItem={setActiveSidebarItem}
            footerTitle="Safety Beacon Active"
            footerText="Connected to Campus Security Command"
          />

          <motion.main
            className="student-main"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ flex: 1, maxWidth: "100%", width: "100%" }}
          >
            {error && <p className="student-dashboard-error">{error}</p>}

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
                  setIsSOSActive={setIsSOSActive}
                />
              </motion.div>
              <motion.div className="student-safety-grid" variants={itemVariants}>
                <button
                  className="student-safety-card night-walk-card"
                  type="button"
                  onClick={() => setShowNightWalk(true)}
                >
                  <span className="student-card-icon">
                    <Moon size={24} />
                  </span>
                  <span className="student-card-copy">
                    <strong>Night Walk</strong>
                    <small>Start timer</small>
                  </span>
                </button>
                <button
                  className="student-safety-card safepath-card"
                  type="button"
                  onClick={() => setShowCampusMap(true)}
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

            <motion.section className="student-snapshot" id="academic-snapshot-section" variants={itemVariants}>
              <h2>Academic Snapshot</h2>
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
              <PerformanceRadar />
            </motion.section>

            <motion.section className="student-utilities" variants={itemVariants}>
              <button type="button" onClick={() => alert("Campus Facilities ticket window logged.")}>
                <span className="utility-icon issue-icon">
                  <AlertCircle size={24} />
                </span>
                <span>
                  <strong>Report an Issue</strong>
                  <small>Maintenance / Safety</small>
                </span>
                <ChevronRight size={20} />
              </button>
              <button type="button" onClick={() => alert("Digital ID verified for Main Gate Scanner.")}>
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
        </div>

        <ChatAssistant
          studentName={user.name}
          greeting={dashboard.assistant?.greeting}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />

        <AnimatePresence>
          {showNightWalk && (
            <NightWalkModal onClose={() => setShowNightWalk(false)} />
          )}
          {showCampusMap && (
            <StudentCampusMapModal onClose={() => setShowCampusMap(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
