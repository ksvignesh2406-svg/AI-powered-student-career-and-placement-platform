const User = require("../models/User");

const buildUserProfile = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    registerNumber: user.registerNumber,
    role: user.role
});

const dashboardPayloads = {
    STUDENT: {
        summary: {
            nextClass: {
                title: "Data Structures Lab",
                startsIn: "15 mins",
                location: "Block B, Room 302"
            },
            attendance: {
                value: "82%",
                status: "Safe"
            },
            fees: {
                value: "Rs. 0",
                status: "Cleared"
            }
        },
        assistant: {
            greeting:
                "I noticed you have Data Structures in 15 mins at Block B. Need the fastest route avoiding the ongoing construction near the library?"
        }
    },
    FACULTY: {
        summary: {
            classesToday: 2,
            conflict: {
                title: "Timetable conflict",
                message: "CS301 Lab and the department meeting overlap at 02:00 PM today."
            }
        },
        classes: [
            {
                id: "CS301",
                title: "CS301: Data Structures & Algorithms",
                time: "10:00 AM - 11:30 AM",
                location: "Hall 4B",
                status: "Next class"
            },
            {
                id: "CS502",
                title: "CS502: Advanced Operating Systems",
                time: "02:00 PM - 03:30 PM",
                location: "Lab 2",
                status: "Upcoming"
            }
        ],
        atRiskStudents: [
            {
                initials: "AK",
                name: "Aarav Kumar",
                signal: "Missed 3 consecutive classes"
            },
            {
                initials: "SR",
                name: "Sneha Roy",
                signal: "Attendance is at 60%"
            }
        ],
        leaveRequests: [
            {
                id: 1,
                studentName: "Rohan Verma",
                course: "CS301",
                type: "Medical",
                details: "Requested 2 days leave (22 Aug - 24 Aug)",
                status: "pending"
            },
            {
                id: 2,
                studentName: "Priya Patel",
                course: "CS502",
                type: "Event",
                details: "Hackathon participation (23 Aug)",
                status: "pending"
            }
        ]
    },
    PARENT: {
        child: {
            name: "your child"
        },
        overview: {
            lastUpdated: "8:40 AM"
        },
        metrics: [
            {
                id: "attendance",
                value: "92%",
                label: "Attendance",
                note: "+4% this month",
                tone: "green"
            },
            {
                id: "gpa",
                value: "8.6",
                label: "Current GPA",
                note: "Top 18% of class",
                tone: "blue"
            },
            {
                id: "tasks",
                value: "3",
                label: "Upcoming tasks",
                note: "Next due Friday",
                tone: "amber"
            }
        ],
        subjects: [
            {
                name: "Data Structures",
                code: "CS301",
                score: "A",
                progress: 88,
                tone: "green"
            },
            {
                name: "Operating Systems",
                code: "CS502",
                score: "A-",
                progress: 81,
                tone: "blue"
            },
            {
                name: "Discrete Mathematics",
                code: "MA204",
                score: "B+",
                progress: 74,
                tone: "amber"
            }
        ],
        schedule: [
            {
                day: "Today",
                date: "22",
                title: "Data Structures lab",
                time: "10:00 AM",
                location: "Lab 4B",
                status: "In progress",
                active: true
            },
            {
                day: "Fri",
                date: "23",
                title: "Career guidance session",
                time: "2:00 PM",
                location: "Seminar hall"
            },
            {
                day: "Mon",
                date: "26",
                title: "Internal assessment",
                time: "9:00 AM",
                location: "Main block"
            }
        ],
        documents: [
            {
                title: "Fee receipt - Semester 5",
                added: "Added today"
            },
            {
                title: "Attendance summary - August",
                added: "Added 2 days ago"
            }
        ],
        finance: {
            due: "Rs. 18,500",
            dueDate: "Next payment due 30 Aug",
            paid: "Rs. 74,000 paid",
            total: "Rs. 92,500 total",
            paidPercent: 80
        },
        wellbeing: {
            title: "Doing well",
            message: "Attendance and academic signals are healthy. No action is needed from you today.",
            rows: [
                {
                    label: "Academic health",
                    value: "Strong"
                },
                {
                    label: "Campus engagement",
                    value: "Active"
                }
            ]
        }
    },
    ADMIN: {
        summary: {
            totalUsers: 1420,
            activeFaculty: 84,
            activeStudents: 1280,
            securityUnits: 16,
            systemHealth: "99.98% Optimal"
        },
        departments: [
            { id: "CSE", name: "Computer Science & Engineering", facultyCount: 28, studentCount: 460, hod: "Dr. K. Ramanathan" },
            { id: "ECE", name: "Electronics & Communication", facultyCount: 22, studentCount: 380, hod: "Dr. Malini Iyer" },
            { id: "MECH", name: "Mechanical Engineering", facultyCount: 18, studentCount: 290, hod: "Dr. S. Venkatesh" },
            { id: "CIVIL", name: "Civil Engineering", facultyCount: 16, studentCount: 150, hod: "Dr. P. Sundaram" }
        ],
        recentActivity: [
            { id: 1, action: "Security Unit Alpha assigned to North Gate", timestamp: "10 mins ago", type: "security" },
            { id: 2, action: "New faculty member Dr. Priya Nair onboarded to CS Dept", timestamp: "45 mins ago", type: "user" },
            { id: 3, action: "Mid-term examination schedule published for 3rd Year", timestamp: "2 hours ago", type: "system" },
            { id: 4, action: "Placement Drive 2026 Phase 1 activated for Microsoft", timestamp: "5 hours ago", type: "placement" }
        ],
        systemAlerts: [
            { id: 1, level: "info", title: "Automated Backup Completed", description: "Database snapshot taken successfully at 03:00 AM UTC" },
            { id: 2, level: "success", title: "Server Load Low", description: "CPU utilization across all API nodes is below 22%" },
            { id: 3, level: "warning", title: "Scheduled Maintenance", description: "Campus Wi-Fi upgrade scheduled for Saturday 11:00 PM" }
        ]
    },
    SECURITY: {
        summary: {
            activeGuards: 12,
            openAlerts: 1,
            activeSafeWalks: 2,
            gateCheckinsToday: 842
        },
        activeAlerts: [
            {
                id: "SOS-8821",
                type: "EMERGENCY_SOS",
                senderName: "Kavya Menon",
                registerNumber: "22BCS1084",
                location: "Near Central Library (East Walkway)",
                time: "2 mins ago",
                status: "DISPATCHED",
                assignedUnit: "Patrol Unit 3 (Officer Raj)"
            }
        ],
        safeWalks: [
            {
                id: "SW-101",
                studentName: "Aditi Rao",
                destination: "Girls Hostel Block 2",
                startedAt: "10:14 PM",
                remainingMins: 6,
                status: "EN_ROUTE"
            },
            {
                id: "SW-102",
                studentName: "Vikas Sethi",
                destination: "Main Gate Parking",
                startedAt: "10:18 PM",
                remainingMins: 11,
                status: "EN_ROUTE"
            }
        ],
        patrolZones: [
            { id: "Z-1", name: "North Campus & Hostels", status: "Active Patrol", officer: "Unit Alpha", lastCheckin: "5 mins ago" },
            { id: "Z-2", name: "Academic Blocks & Labs", status: "Active Patrol", officer: "Unit Beta", lastCheckin: "12 mins ago" },
            { id: "Z-3", name: "Main Gate & Visitor Checkpoint", status: "Stationary Guard", officer: "Officer Suresh", lastCheckin: "Just now" }
        ],
        incidentLogs: [
            { id: "INC-302", title: "Lost ID Badge Resolved", reporter: "Hostel Warden", time: "1 hour ago", status: "Resolved" },
            { id: "INC-301", title: "Unauthorized Parking at Gate 2", reporter: "Guard Ramesh", time: "3 hours ago", status: "Cleared" }
        ]
    },
    PLACEMENT: {
        summary: {
            placementRate: "88.4%",
            highestPackage: "44.5 LPA",
            averagePackage: "9.2 LPA",
            ongoingDrives: 3,
            totalOffers: 342
        },
        drives: [
            {
                id: "DRV-01",
                company: "Microsoft",
                role: "Software Development Engineer",
                ctc: "44.5 LPA",
                date: "25 Aug 2026",
                eligibleCount: 140,
                registeredCount: 128,
                stage: "Coding Assessment"
            },
            {
                id: "DRV-02",
                company: "Amazon",
                role: "Cloud Support Associate / SDE",
                ctc: "32.0 LPA",
                date: "28 Aug 2026",
                eligibleCount: 180,
                registeredCount: 165,
                stage: "Resume Shortlisting"
            },
            {
                id: "DRV-03",
                company: "Deloitte",
                role: "Technology Consultant",
                ctc: "12.5 LPA",
                date: "02 Sep 2026",
                eligibleCount: 310,
                registeredCount: 290,
                stage: "Applications Open"
            }
        ],
        upcomingInterviews: [
            { id: "INT-1", candidate: "Ananya Sharma", company: "Microsoft", role: "SDE 1", time: "Tomorrow, 10:00 AM", mode: "Technical Round 1" },
            { id: "INT-2", candidate: "Rahul Nair", company: "Goldman Sachs", role: "Analyst", time: "Tomorrow, 11:30 AM", mode: "HR Round" },
            { id: "INT-3", candidate: "Siddharth Jain", company: "Cisco", role: "Network Engineer", time: "Tomorrow, 02:00 PM", mode: "Technical Round 2" }
        ],
        topRecruiters: [
            { name: "Google", hires: 14, avgCtc: "38 LPA" },
            { name: "Microsoft", hires: 22, avgCtc: "42 LPA" },
            { name: "Amazon", hires: 31, avgCtc: "30 LPA" },
            { name: "Tata Consultancy Services", hires: 95, avgCtc: "7.5 LPA" }
        ]
    }
};

const normalizeRole = (role) => {
    if (!role) return "";
    const upper = role.toUpperCase();
    if (upper === "PLACEMENT_OFFICER") return "PLACEMENT";
    return upper;
};

const getDashboard = async (req, res) => {
    try {
        const rawRole = req.params.role;
        const requestedRole = normalizeRole(rawRole);
        const userRole = normalizeRole(req.user.role);

        const allowedRoles = ["STUDENT", "FACULTY", "PARENT", "ADMIN", "SECURITY", "PLACEMENT"];

        if (!allowedRoles.includes(requestedRole)) {
            return res.status(404).json({
                success: false,
                message: "Dashboard not found"
            });
        }

        if (userRole !== requestedRole && userRole !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied for this dashboard"
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found"
            });
        }

        return res.json({
            success: true,
            user: buildUserProfile(user),
            dashboard: dashboardPayloads[requestedRole]
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        });
    }
};

module.exports = {
    getDashboard
};
