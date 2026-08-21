import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParentAcademicPanel, { ParentDocumentsPanel, ParentSchedulePanel } from "../components/parent/ParentAcademicPanel";
import ParentHeader from "../components/parent/ParentHeader";
import ParentOverview, { ParentMetricCards } from "../components/parent/ParentOverview";
import ParentSupportSidebar from "../components/parent/ParentSupportSidebar";
import { clearSession, getSessionUser } from "../utils/authStorage";
import "../styles/parent-dashboard.css";

export default function ParentPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getSessionUser());

  useEffect(() => {
    if (!user || user.role !== "parent") navigate("/", { replace: true });
  }, [navigate, user]);

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="parent-dashboard">
      <ParentHeader user={user} onLogout={handleLogout} />
      <main className="parent-main">
        <ParentOverview user={user} />
        <ParentMetricCards />
        <div className="parent-grid">
          <div className="parent-content">
            <ParentAcademicPanel />
            <ParentSchedulePanel />
            <ParentDocumentsPanel />
          </div>
          <ParentSupportSidebar />
        </div>
      </main>
    </div>
  );
}
