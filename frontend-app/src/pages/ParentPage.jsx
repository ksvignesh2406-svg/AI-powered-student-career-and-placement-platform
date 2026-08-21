import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParentAcademicPanel, { ParentDocumentsPanel, ParentSchedulePanel } from "../components/parent/ParentAcademicPanel";
import ParentHeader from "../components/parent/ParentHeader";
import ParentOverview, { ParentMetricCards } from "../components/parent/ParentOverview";
import ParentSupportSidebar from "../components/parent/ParentSupportSidebar";
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

  return (
    <div className="parent-dashboard">
      <ParentHeader user={user} onLogout={handleLogout} />
      <main className="parent-main">
        {error && <p className="faculty-empty-state">{error}</p>}
        <ParentOverview user={user} child={dashboard.child} overview={dashboard.overview} />
        <ParentMetricCards metrics={dashboard.metrics} />
        <div className="parent-grid">
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
      </main>
    </div>
  );
}
