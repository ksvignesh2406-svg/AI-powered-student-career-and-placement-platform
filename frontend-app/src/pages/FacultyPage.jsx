import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultyBanner from "../components/faculty/FacultyBanner";
import FacultyClassConsole from "../components/faculty/FacultyClassConsole";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyIntelligenceSidebar from "../components/faculty/FacultyIntelligenceSidebar";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/faculty-dashboard.css";

const initialLeaveRequests = [
  { id: 1, studentName: "Rohan Verma", course: "CS301", type: "Medical", details: "Requested 2 days leave (22 Aug - 24 Aug)", status: "pending" },
  { id: 2, studentName: "Priya Patel", course: "CS502", type: "Event", details: "Hackathon participation (23 Aug)", status: "pending" },
];

export default function FacultyPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getSessionUser());
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  useEffect(() => {
    if (!user || user.role !== "faculty") {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="faculty-dashboard">
      <FacultyHeader user={user} onLogout={handleLogout} />
      <main className="faculty-main">
        <FacultyBanner user={user} pendingLeaves={leaveRequests.length} />
        <div className="faculty-grid">
          <FacultyClassConsole />
          <FacultyIntelligenceSidebar
            leaveRequests={leaveRequests}
            onApprove={(id) => setLeaveRequests((requests) => requests.map((request) => request.id === id ? { ...request, status: "approved" } : request))}
            onReject={(id) => setLeaveRequests((requests) => requests.filter((request) => request.id !== id))}
          />
        </div>
      </main>
    </div>
  );
}
