import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Calendar,
  CreditCard,
  Download,
  FileText,
  HeartPulse,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import ParentAcademicPanel, {
  ParentDocumentsPanel,
  ParentSchedulePanel,
} from "../components/parent/ParentAcademicPanel";
import ParentHeader from "../components/parent/ParentHeader";
import ParentOverview, {
  ParentMetricCards,
} from "../components/parent/ParentOverview";
import ParentSupportSidebar from "../components/parent/ParentSupportSidebar";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/parent-dashboard.css";

const defaultDashboard = {
  child: {
    name: "your child",
  },
  overview: {
    lastUpdated: "--",
  },
  metrics: [],
  subjects: [],
  schedule: [],
  documents: [],
  finance: {
    due: "Rs. 0",
    dueDate: "No payment due",
    paid: "Rs. 0 paid",
    total: "Rs. 0 total",
    paidPercent: 0,
  },
  wellbeing: {
    title: "Loading",
    message: "Loading student wellbeing details.",
    rows: [],
  },
};

export default function ParentPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== "parent") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("parent").then((result) => {
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

  const parentSidebarItems = [
    {
      id: "overview",
      label: "Home Overview",
      icon: Sparkles,
      tooltip: "Ward snapshot summary",
    },
    {
      id: "academics",
      label: "Academic Progress",
      icon: TrendingUp,
      badge: "8.4 CGPA",
      tooltip: "Semester performance summary",
    },
    {
      id: "schedule",
      label: "Classes & Timetable",
      icon: Calendar,
      badge: "92% Safe",
      tooltip: "Weekly timetable and attendance records",
    },
    {
      id: "finance",
      label: "Fee Receipts & Dues",
      icon: CreditCard,
      badge: "Cleared",
      badgeVariant: "emerald",
      tooltip: "Tuition and hostel fee receipts",
    },
    {
      id: "wellbeing",
      label: "Safety & Wellbeing",
      icon: HeartPulse,
      badge: "Optimal",
      badgeVariant: "emerald",
      tooltip: "Hostel check-ins and campus safety signals",
    },
    {
      id: "mentor",
      label: "Connect with Faculty",
      icon: MessageSquare,
      tooltip: "Request one-on-one session with student proctor",
    },
    {
      id: "documents",
      label: "Transcripts & Reports",
      icon: FileText,
      tooltip: "Download official grade sheets and leave slips",
    },
  ];

  return (
    <div className="parent-dashboard">
      <ParentHeader user={user} onLogout={handleLogout} />
      <main className="parent-main">
        {error && <p className="faculty-empty-state">{error}</p>}

        <ParentOverview
          user={user}
          child={dashboard.child}
          overview={dashboard.overview}
        />

        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%", marginTop: "24px" }}>
          {/* Feature Sidebar */}
          <DashboardFeatureSidebar
            role="parent"
            kicker="Parent Portal"
            title="Ward Navigation"
            items={parentSidebarItems}
            activeItem={activeTab}
            onSelectItem={setActiveTab}
            footerTitle={`Ward: ${dashboard.child?.name || "Ananya"}`}
            footerText="Enrolled in B.Tech CSE (3rd Year)"
          />

          {/* Dynamic Main Workspace */}
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            {/* VIEW: OVERVIEW (HOME) */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <ParentMetricCards metrics={dashboard.metrics} />
                <div className="parent-grid" style={{ margin: 0 }}>
                  <div className="parent-content">
                    <ParentAcademicPanel subjects={dashboard.subjects} />
                    <ParentSchedulePanel schedule={dashboard.schedule} />
                  </div>
                  <ParentSupportSidebar
                    finance={dashboard.finance}
                    wellbeing={dashboard.wellbeing}
                  />
                </div>
              </div>
            )}

            {/* VIEW: ACADEMIC PROGRESS */}
            {activeTab === "academics" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Academic Grades &amp; Assessment Report</h2>
                      <p className="dashboard-view-subtitle">Course-by-course breakdown of internal scores and grade point averages</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <ParentAcademicPanel subjects={dashboard.subjects} />
              </div>
            )}

            {/* VIEW: SCHEDULE & TIMETABLE */}
            {activeTab === "schedule" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Weekly Lecture &amp; Lab Schedule</h2>
                      <p className="dashboard-view-subtitle">Daily classroom timings, attendance hours and instructor details</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <ParentSchedulePanel schedule={dashboard.schedule} />
              </div>
            )}

            {/* VIEW: FEE MANAGEMENT */}
            {activeTab === "finance" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Tuition &amp; Hostel Fee Management</h2>
                      <p className="dashboard-view-subtitle">Official payment records, cleared invoices and upcoming semester deadlines</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "14px", border: "1px solid #a7f3d0" }}>
                  <h3 style={{ fontSize: "16px", color: "#065f46", margin: "0 0 6px" }}>Term 2 Fees 100% Cleared</h3>
                  <p style={{ fontSize: "13px", color: "#047857", margin: "0 0 16px" }}>
                    Total: Rs. 1,45,000 · Paid: Rs. 1,45,000 · Next billing cycle: January 2027
                  </p>
                  <button
                    type="button"
                    onClick={() => alert("Payment receipt #RCP-9022 downloaded.")}
                    style={{ padding: "10px 18px", background: "#059669", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                  >
                    Download Clearance Receipt PDF
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: SAFETY & WELLBEING */}
            {activeTab === "wellbeing" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <HeartPulse size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Ward Safety &amp; Campus Wellbeing</h2>
                      <p className="dashboard-view-subtitle">Hostel curfew check-in records and safe walk companion status</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { date: "Yesterday, 09:45 PM", status: "Hostel Check-in Verified", by: "Warden biometric scan" },
                    { date: "Yesterday, 07:15 PM", status: "SafeWalk Escort Completed", by: "Library to Hostel B" },
                    { date: "20 Aug 2026, 09:30 PM", status: "Hostel Check-in Verified", by: "Warden biometric scan" },
                  ].map((log, idx) => (
                    <div key={idx} style={{ padding: "14px 18px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: "13.5px", color: "#0f172a" }}>{log.status}</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>Route/Method: {log.by}</p>
                      </div>
                      <span style={{ fontSize: "11px", color: "#059669", fontWeight: "750" }}>{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: MENTOR CONNECT */}
            {activeTab === "mentor" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Connect with Student Proctor</h2>
                      <p className="dashboard-view-subtitle">Schedule an online or on-campus meeting with Dr. Ramanathan</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); alert("Meeting request submitted to Proctor Dr. Ramanathan."); setActiveTab("overview"); }} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>Preferred Date &amp; Time</label>
                    <input type="datetime-local" required style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>Discussion Topic</label>
                    <textarea rows={3} placeholder="e.g. Academic progress, upcoming semester internship preparations..." required style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }} />
                  </div>
                  <button type="submit" style={{ padding: "12px 20px", background: "#059669", color: "white", border: "none", borderRadius: "10px", fontWeight: "750", cursor: "pointer", width: "fit-content" }}>
                    Send Meeting Request
                  </button>
                </form>
              </div>
            )}

            {/* VIEW: DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="dashboard-view-card">
                <div className="dashboard-view-header" style={{ margin: 0 }}>
                  <div className="dashboard-view-header-left">
                    <div className="dashboard-view-header-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="dashboard-view-title">Official Transcripts &amp; Records</h2>
                      <p className="dashboard-view-subtitle">Verified institutional certificates and semester transcripts</p>
                    </div>
                  </div>
                  <button type="button" className="dashboard-back-btn" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft size={14} /> Back to Overview
                  </button>
                </div>
                <ParentDocumentsPanel documents={dashboard.documents} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
