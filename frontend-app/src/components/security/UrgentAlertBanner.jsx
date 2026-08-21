import { motion } from "framer-motion";
import { AlertCircle, UserCheck } from "lucide-react";

export default function UrgentAlertBanner({ alert, onAssignGuard }) {
  if (!alert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sec-urgent-bar"
    >
      <div className="sec-urgent-left">
        <div className="sec-urgent-icon">
          <AlertCircle size={22} />
        </div>
        <div>
          <div className="sec-urgent-title">Urgent Action Required</div>
          <div className="sec-urgent-desc">
            {alert.title} — <span>{alert.location} ({alert.reporter})</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAssignGuard(alert.id)}
        className="sec-btn-dispatch"
      >
        <UserCheck size={16} />
        <span>Dispatch Guard</span>
      </button>
    </motion.div>
  );
}
