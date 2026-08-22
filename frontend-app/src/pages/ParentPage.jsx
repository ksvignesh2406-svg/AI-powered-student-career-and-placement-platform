import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Calendar,
  CreditCard,
  Download,
  FileText,
  HeartPulse,
  MessageSquare,
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
  const [activeFeature, setActiveFeature] = useState("overview");

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
      label: "Academic Overview",
      icon: TrendingUp,
      badge: "8.4 CGPA",
      tooltip: "Semester performance summary",
      action: () => {
        document.querySelector(".parent-metric-grid")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "schedule",
      label: "Classes & Attendance",
      icon: Calendar,
      badge: "92% Safe",
      tooltip: "Weekly timetable and attendance records",
      action: () => {
        document.querySelector(".parent-academic-panel")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "finance",
      label: "Fee Dues & Receipts",
      icon: CreditCard,
      badge: "Cleared",
      badgeVariant: "emerald",
      tooltip: "Tuition and hostel fee receipts",
      action: () => {
        document.querySelector(".parent-finance-card")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "wellbeing",
      label: "Safety & Wellbeing",
      icon: HeartPulse,
      badge: "Optimal",
      badgeVariant: "emerald",
      tooltip: "Hostel check-ins and campus safety signals",
      action: () => {
        document.querySelector(".parent-wellbeing-card")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "mentor",
      label: "Connect with Faculty",
      icon: MessageSquare,
      tooltip: "Request one-on-one session with student proctor",
      action: () => alert("Direct mentor request submitted to Dr. Ramanathan (Proctor)."),
    },
    {
      id: "docs",
      label: "Transcripts & Reports",
      icon: FileText,
      tooltip: "Download official grade sheets and leave slips",
      action: () => alert("Official semester report card PDF generated."),
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
        <ParentMetricCards metrics={dashboard.metrics} />
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%", marginTop: "24px" }}>
          <DashboardFeatureSidebar
            role="parent"
            kicker="Parent Portal"
            title="Ward Navigation"
            items={parentSidebarItems}
            activeItem={activeFeature}
            onSelectItem={setActiveFeature}
            footerTitle="Ward: Ananya Sharma"
            footerText="Enrolled in B.Tech CSE (3rd Year)"
          />
          <div className="parent-grid" style={{ flex: 1, margin: 0 }}>
            <div className="parent-content">
              <ParentAcademicPanel subjects={dashboard.subjects} />
              <ParentSchedulePanel schedule={dashboard.schedule} />
              <ParentDocumentsPanel documents={dashboard.documents} />
            </div>
            <ParentSupportSidebar
              finance={dashboard.finance}
              wellbeing={dashboard.wellbeing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
