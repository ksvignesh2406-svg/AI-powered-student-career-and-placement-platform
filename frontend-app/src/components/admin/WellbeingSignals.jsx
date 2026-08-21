import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, UserCheck } from "lucide-react";

const initialWellbeingSignals = [
  {
    id: "26BCE1123",
    name: "Arjun Mehta",
    initials: "AM",
    alert: "Attendance dropped 30% over 2 weeks + 1 low exam score.",
    severity: "high",
    department: "Computer Science",
  },
  {
    id: "25MEC0041",
    name: "Priya Sharma",
    initials: "PS",
    alert: "Missed 3 consecutive lab sessions.",
    severity: "medium",
    department: "Mechanical Engg",
  },
  {
    id: "26ECE0089",
    name: "Dev Patel",
    initials: "DP",
    alert: "Flagged by faculty for sudden assignment submission drop.",
    severity: "medium",
    department: "Electronics Engg",
  },
  {
    id: "24BIO0012",
    name: "Ananya Rao",
    initials: "AR",
    alert: "Night curfew violation alert + missed counselor follow-up.",
    severity: "high",
    department: "Bio-Technology",
  },
];

export default function WellbeingSignals({ itemVariants, onScheduleNotice }) {
  const [signals] = useState(initialWellbeingSignals);
  const [scheduledIds, setScheduledIds] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [checkinStudent, setCheckinStudent] = useState(null);

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    if (!checkinStudent) return;
    setScheduledIds((prev) => [...prev, checkinStudent.id]);
    if (onScheduleNotice) {
      onScheduleNotice(`Check-in scheduled for ${checkinStudent.name}`);
    }
    setCheckinStudent(null);
  };

  const displayedSignals = showAll ? signals : signals.slice(0, 2);

  return (
    <motion.div variants={itemVariants} className="adm-panel">
      <div className="adm-panel-header">
        <div>
          <h2 className="adm-panel-title">Wellbeing &amp; Academic Signals</h2>
          <p className="adm-panel-desc">
            AI-flagged students requiring check-ins based on behavioral patterns.
          </p>
        </div>
        <span className="adm-badge-mint">Updated Just Now</span>
      </div>

      <div className="adm-signals-list">
        {displayedSignals.map((student, idx) => {
          const isScheduled = scheduledIds.includes(student.id);

          return (
            <div key={idx} className="adm-signal-card">
              <div className="adm-signal-left">
                <div className="adm-signal-avatar">{student.initials}</div>
                <div>
                  <div className="adm-signal-name-row">
                    <span className="adm-signal-name">{student.name}</span>
                    <span className="adm-signal-id">ID: {student.id}</span>
                  </div>
                  <div className="adm-signal-alert">
                    <span className={`adm-dot ${student.severity}`} />
                    <span>{student.alert}</span>
                  </div>
                </div>
              </div>

              {isScheduled ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    background: "#ecfdf5",
                    color: "#047857",
                    fontSize: "12px",
                    fontWeight: "800",
                  }}
                >
                  <Check size={14} /> Scheduled
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCheckinStudent(student)}
                  className="adm-btn-checkin"
                >
                  Schedule Check-in
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowAll((prev) => !prev)}
        className="adm-btn-view-all"
      >
        {showAll ? "Show Fewer Signals" : `View All ${signals.length} Signals`}
      </button>

      {/* Schedule Modal */}
      <AnimatePresence>
        {checkinStudent && (
          <div
            className="sec-modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && setCheckinStudent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="sec-modal-box"
            >
              <button
                type="button"
                onClick={() => setCheckinStudent(null)}
                className="sec-modal-close"
              >
                <X size={16} />
              </button>

              <div className="sec-modal-header">
                <div
                  className="sec-modal-icon"
                  style={{ background: "#ecfdf5", color: "#059669" }}
                >
                  <UserCheck size={24} />
                </div>
                <div>
                  <h2>Schedule Student Check-in</h2>
                  <p>Counselor &amp; Academic Advisor</p>
                </div>
              </div>

              <form onSubmit={handleConfirmSchedule}>
                <div className="sec-modal-summary">
                  <div className="sec-modal-row">
                    <span>Student:</span>
                    <strong style={{ color: "#0f172a" }}>
                      {checkinStudent.name} (ID: {checkinStudent.id})
                    </strong>
                  </div>
                  <div className="sec-modal-row">
                    <span>Trigger:</span>
                    <span style={{ color: "#d97706", fontWeight: "600" }}>
                      {checkinStudent.alert}
                    </span>
                  </div>
                </div>

                <div className="sec-modal-actions">
                  <button type="submit" className="sec-btn-confirm">
                    Confirm Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckinStudent(null)}
                    className="sec-btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
