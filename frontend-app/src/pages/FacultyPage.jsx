import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";
import FacultyBanner from "../components/faculty/FacultyBanner";
import FacultyClassConsole from "../components/faculty/FacultyClassConsole";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyIntelligenceSidebar from "../components/faculty/FacultyIntelligenceSidebar";
import DashboardFeatureSidebar from "../components/common/DashboardFeatureSidebar";
import { fetchDashboard } from "../utils/dashboardApi";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/faculty-dashboard.css";

const defaultDashboard = {
  summary: {
    classesToday: 0,
    conflict: null,
  },
  classes: [],
  atRiskStudents: [],
  leaveRequests: [],
};

export default function FacultyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getSessionUser());
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState("");
  const [activeFeature, setActiveFeature] = useState("classes");

  useEffect(() => {
    if (!user || user.role !== "faculty") {
      navigate("/", { replace: true });
      return;
    }

    let isMounted = true;

    fetchDashboard("faculty").then((result) => {
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
      setLeaveRequests(result.dashboard.leaveRequests || []);
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

  const facultySidebarItems = [
    {
      id: "classes",
      label: "Today's Schedule",
      icon: Calendar,
      badge: `${dashboard.summary.classesToday} Classes`,
      tooltip: "View scheduled lecture & lab timings",
      action: () => {
        document.querySelector(".faculty-console")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "risk",
      label: "At-Risk Early Alerts",
      icon: AlertTriangle,
      badge: `${dashboard.atRiskStudents.length} Students`,
      badgeVariant: "highlight",
      tooltip: "Monitor students with attendance/grade warnings",
      action: () => {
        document.querySelector(".faculty-intelligence")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "leaves",
      label: "Leave Approvals",
      icon: FileText,
      badge: `${leaveRequests.filter((r) => r.status !== "approved").length} Pending`,
      tooltip: "Review student medical and on-duty requests",
      action: () => {
        document.querySelector(".faculty-intelligence")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "conflicts",
      label: "Clash Detector AI",
      icon: BookOpen,
      badge: dashboard.summary.conflict ? "1 Clash" : "Clear",
      badgeVariant: dashboard.summary.conflict ? "highlight" : "emerald",
      tooltip: "Automated schedule and hall conflict monitoring",
    },
    {
      id: "gradebook",
      label: "Live Attendance & Grades",
      icon: CheckCircle,
      tooltip: "Mark lecture attendance and push continuous assessment marks",
      action: () => alert("Attendance console ready. Select a class below to take roll call."),
    },
    {
      id: "dept",
      label: "Department Directory",
      icon: Users,
      tooltip: "View Computer Science department professors and staff",
      action: () => alert("Department: Computer Science & Engineering · Head of Dept: Dr. Rajesh Sharma"),
    },
  ];

  return (
    <div className="faculty-dashboard">
      <FacultyHeader user={user} onLogout={handleLogout} />
      <main className="faculty-main">
        {error && <p className="faculty-empty-state">{error}</p>}
        <FacultyBanner
          user={user}
          classesToday={dashboard.summary.classesToday}
          pendingLeaves={leaveRequests.length}
        />
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%", marginTop: "24px" }}>
          <DashboardFeatureSidebar
            role="faculty"
            kicker="Faculty Portal"
            title="Teaching Tools"
            items={facultySidebarItems}
            activeItem={activeFeature}
            onSelectItem={setActiveFeature}
            footerTitle="Semester Term 2"
            footerText="Course curriculum 64% complete"
          />
          <div className="faculty-grid" style={{ flex: 1, margin: 0 }}>
            <FacultyClassConsole
              classes={dashboard.classes}
              conflict={dashboard.summary.conflict}
            />
            <FacultyIntelligenceSidebar
              atRiskStudents={dashboard.atRiskStudents}
              leaveRequests={leaveRequests}
              onApprove={(id) =>
                setLeaveRequests((requests) =>
                  requests.map((request) =>
                    request.id === id ? { ...request, status: "approved" } : request
                  )
                )
              }
              onReject={(id) =>
                setLeaveRequests((requests) =>
                  requests.filter((request) => request.id !== id)
                )
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
