import { useState } from "react";
import FacultyBanner from "../components/faculty/FacultyBanner";
import FacultyClassConsole from "../components/faculty/FacultyClassConsole";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyIntelligenceSidebar from "../components/faculty/FacultyIntelligenceSidebar";

import "../styles/faculty-dashboard.css";

const initialLeaveRequests = [
  {
    id: 1,
    studentName: "Rohan Verma",
    course: "CS301",
    type: "Medical",
    details: "Requested 2 days leave (22 Aug - 24 Aug)",
    status: "pending",
  },
  {
    id: 2,
    studentName: "Priya Patel",
    course: "CS502",
    type: "Event",
    details: "Hackathon participation (23 Aug)",
    status: "pending",
  },
];

const defaultProfile = {
  name: "Prof. Sharma",
  department: "Computer Science Dept.",
};

function readProfile() {
  try {
    return JSON.parse(window.localStorage.getItem("campusUser")) || defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function readDepartmentStudents(department) {
  try {
    const students = JSON.parse(window.localStorage.getItem("campusStudents") || "[]");
    return students
      .filter((student) => student.department === department)
      .map((student) => ({
        name: student.name,
        initials: student.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        reason: "New student profile",
      }));
  } catch {
    return [];
  }
}

function FacultyPage() {
  const profile = readProfile();
  const professorName = profile.name || defaultProfile.name;
  const department = profile.department || defaultProfile.department;
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const handleApprove = (requestId) => {
    setLeaveRequests((requests) => requests.map((request) => (
      request.id === requestId ? { ...request, status: "approved" } : request
    )));
  };

  const handleReject = (requestId) => {
    setLeaveRequests((requests) => requests.filter((request) => request.id !== requestId));
  };

  return (
    <div className="faculty-v2-dashboard">
      <div className="faculty-v2-shell">
        <FacultyHeader professorName={professorName} department={department} />
        <FacultyBanner pendingLeaves={leaveRequests.length} professorName={professorName} />
        <main className="faculty-v2-content">
          <FacultyClassConsole />
          <FacultyIntelligenceSidebar
            leaveRequests={leaveRequests}
            students={readDepartmentStudents(department)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </main>
      </div>
    </div>
  );
}

export default FacultyPage;