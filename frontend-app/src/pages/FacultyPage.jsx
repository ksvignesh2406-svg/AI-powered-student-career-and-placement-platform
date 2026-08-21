import { useState } from "react";
import FacultyBanner from "../components/faculty/FacultyBanner";
import FacultyClassConsole from "../components/faculty/FacultyClassConsole";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyIntelligenceSidebar from "../components/faculty/FacultyIntelligenceSidebar";

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

function FacultyPage() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const handleApprove = (requestId) => {
    setLeaveRequests((requests) =>
      requests.map((request) =>
        request.id === requestId ? { ...request, status: "approved" } : request
      )
    );
  };

  const handleReject = (requestId) => {
    setLeaveRequests((requests) =>
      requests.filter((request) => request.id !== requestId)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 p-6 flex justify-center items-center text-slate-900 font-sans">
      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/80 overflow-hidden flex flex-col">
        
        <FacultyHeader />
        <FacultyBanner pendingLeaves={leaveRequests.length} />

        {/* Dashboard Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 p-8">
          <FacultyClassConsole />
          <FacultyIntelligenceSidebar 
            leaveRequests={leaveRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </main>
      </div>
    </div>
  );
}

export default FacultyPage;