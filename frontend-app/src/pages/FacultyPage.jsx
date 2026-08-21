import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultyBanner from "../components/faculty/FacultyBanner";
import FacultyClassConsole from "../components/faculty/FacultyClassConsole";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyIntelligenceSidebar from "../components/faculty/FacultyIntelligenceSidebar";
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
      setLeaveRequests(result.dashboard.leaveRequests);
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
    <div className="faculty-dashboard">
      <FacultyHeader user={user} onLogout={handleLogout} />
      <main className="faculty-main">
        {error && <p className="faculty-empty-state">{error}</p>}
        <FacultyBanner
          user={user}
          classesToday={dashboard.summary.classesToday}
          pendingLeaves={leaveRequests.length}
        />
        <div className="faculty-grid">
          <FacultyClassConsole
            classes={dashboard.classes}
            conflict={dashboard.summary.conflict}
          />
          <FacultyIntelligenceSidebar
            atRiskStudents={dashboard.atRiskStudents}
            leaveRequests={leaveRequests}
            onApprove={(id) => setLeaveRequests((requests) => requests.map((request) => request.id === id ? { ...request, status: "approved" } : request))}
            onReject={(id) => setLeaveRequests((requests) => requests.filter((request) => request.id !== id))}
          />
        </div>
      </main>
    </div>
  );
}
