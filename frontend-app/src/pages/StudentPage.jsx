import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  AlertCircle, ArrowRight, Bell, BookOpen, ChevronRight, Clock, Map,
  MessageSquare, Moon, QrCode, Send, Shield, ShieldAlert, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/student-dashboard.css";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

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

function StudentPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [error, setError] = useState("");
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showNightWalk, setShowNightWalk] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const nextClass = dashboard.summary.nextClass;

  return (
    <div className="student-app"><div className="student-shell">
      <header className="student-header">
        <div className="student-brand"><div className="student-brand-icon"><Shield size={20} strokeWidth={2.5} /></div><span>Campus OS</span></div>
        <div className="student-header-actions"><button className="student-icon-button student-notification" type="button" aria-label="Notifications"><Bell size={24} /><span /></button><button className="student-avatar" type="button" onClick={handleLogout} aria-label="Log out"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=f8fafc`} alt="User avatar" /></button></div>
      </header>
      <motion.main className="student-main" variants={containerVariants} initial="hidden" animate="show">
        {error && <p className="student-dashboard-error">{error}</p>}
        <section className="student-safety-section"><motion.div variants={itemVariants}><h1>Welcome back, {user.name} <span className="student-wave">Hi</span></h1><p>Your campus snapshot for today.</p></motion.div><motion.div variants={itemVariants}><SwipeToSOS isSOSActive={isSOSActive} setIsSOSActive={setIsSOSActive} /></motion.div><motion.div className="student-safety-grid" variants={itemVariants}><button className="student-safety-card night-walk-card" type="button" onClick={() => setShowNightWalk(true)}><span className="student-card-icon"><Moon size={24} /></span><span className="student-card-copy"><strong>Night Walk</strong><small>Start timer</small></span></button><button className="student-safety-card safepath-card" type="button"><span className="student-card-icon"><Map size={24} /></span><span className="student-card-copy"><strong>SafePath</strong><small>Live routing</small></span></button></motion.div></section>
        <motion.section className="student-snapshot" variants={itemVariants}><h2>Academic Snapshot</h2><div className="student-next-class"><div className="student-next-icon"><BookOpen size={24} /></div><div><h3>{nextClass.title}</h3><p>Starts in {nextClass.startsIn}</p><span><Map size={16} /> {nextClass.location}</span></div></div><div className="student-status-grid"><div className="student-status-card"><span>Attendance</span><div><strong>{dashboard.summary.attendance.value}</strong><b className="status-safe">{dashboard.summary.attendance.status}</b></div></div><div className="student-status-card"><span>Pending Fees</span><div><strong>{dashboard.summary.fees.value}</strong><b className="status-cleared">{dashboard.summary.fees.status}</b></div></div></div></motion.section>
        <motion.section className="student-utilities" variants={itemVariants}><button type="button"><span className="utility-icon issue-icon"><AlertCircle size={24} /></span><span><strong>Report an Issue</strong><small>Maintenance / Safety</small></span><ChevronRight size={20} /></button><button type="button"><span className="utility-icon id-icon"><QrCode size={24} /></span><span><strong>Digital ID</strong><small>Show at Main Gate</small></span><ChevronRight size={20} /></button></motion.section>
      </motion.main>
      <ChatAssistant greeting={dashboard.assistant.greeting} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} /><AnimatePresence>{showNightWalk && <NightWalkModal onClose={() => setShowNightWalk(false)} />}</AnimatePresence>
    </div></div>
  );
}

function SwipeToSOS({ isSOSActive, setIsSOSActive }) {
  const containerRef = useRef(null); const dragControls = useAnimation(); const [isDragging, setIsDragging] = useState(false);
  const handleDragEnd = (event, info) => { setIsDragging(false); const containerWidth = containerRef.current?.offsetWidth || 0; if (info.offset.x >= containerWidth - 92) setIsSOSActive(true); else dragControls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }); };
  if (isSOSActive) return <motion.div className="sos-active" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1, backgroundColor: ["#ef4444", "#b91c1c", "#ef4444"] }} transition={{ backgroundColor: { repeat: Infinity, duration: 1.5 }, scale: { type: "spring" } }}><div className="sos-overlay" /><ShieldAlert size={48} className="sos-content sos-pulse" /><div className="sos-content"><h3>SOS BROADCASTED</h3><p>Campus Security is on their way.</p></div><button className="sos-cancel sos-content" type="button" onClick={() => setIsSOSActive(false)}>Cancel False Alarm</button></motion.div>;
  return <div ref={containerRef} className="sos-track"><span className={isDragging ? "is-dragging" : ""}>SWIPE TO SOS</span><motion.div drag="x" dragConstraints={containerRef} dragElastic={0.05} dragMomentum={false} onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd} animate={dragControls} whileTap={{ scale: 0.95 }} className="sos-handle"><ArrowRight size={28} /></motion.div></div>;
}

function ChatAssistant({ greeting, isChatOpen, setIsChatOpen }) {
  return <div className="student-chat-wrap"><AnimatePresence>{isChatOpen && <motion.div className="student-chat" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}><div className="student-chat-header"><span><MessageSquare size={20} /> Campus Assistant AI</span><button type="button" onClick={() => setIsChatOpen(false)} aria-label="Close chat"><X size={16} /></button></div><div className="student-chat-body"><p>{greeting}</p></div><div className="student-chat-input"><input type="text" placeholder="Ask anything..." /><button type="button" aria-label="Send message"><Send size={16} /></button></div></motion.div>}</AnimatePresence><button className="student-chat-button" type="button" onClick={() => setIsChatOpen(!isChatOpen)} aria-label={isChatOpen ? "Close chat" : "Open chat"}>{isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}</button></div>;
}

function NightWalkModal({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(600); useEffect(() => { const timer = setInterval(() => setTimeLeft((previous) => Math.max(previous - 1, 0)), 1000); return () => clearInterval(timer); }, []);
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0"); const seconds = (timeLeft % 60).toString().padStart(2, "0");
  return <motion.div className="night-walk-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="night-walk-modal" initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}><div className="modal-handle" /><div className="night-walk-title"><div><Moon size={32} /></div><h2>Night Walk Active</h2><p>We are monitoring your journey. If the timer runs out, Campus Security will be alerted.</p></div><div className="night-walk-timer"><Clock size={24} /><strong>{minutes}:{seconds}</strong></div><div className="security-pin"><label>Security PIN</label><div>{[1, 2, 3, 4].map((number) => <input key={number} type="password" maxLength={1} aria-label={`PIN digit ${number}`} />)}</div></div><button className="end-walk" type="button" onClick={onClose}>End Safe Walk</button><button className="cancel-walk" type="button" onClick={onClose}>Cancel</button></motion.div></motion.div>;
}

export default StudentPage;
