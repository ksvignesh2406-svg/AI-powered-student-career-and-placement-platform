import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X } from "lucide-react";

export default function PublicAlertModal({
  isOpen,
  onClose,
  onSendAlert,
  operatorName = "Santhosh K. (Head Warden)",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="sec-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            className="sec-modal-box"
          >
            <button
              type="button"
              onClick={onClose}
              className="sec-modal-close"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div className="sec-modal-header">
              <div className="sec-modal-icon">
                <BellRing size={24} />
              </div>
              <div>
                <h2>Campus Public Alert</h2>
                <p>Send broadcast alert to all hostel student mobile apps</p>
              </div>
            </div>

            <div className="sec-modal-summary">
              <div className="sec-modal-row">
                <span>Target Audience:</span>
                <strong>All Hostel Residents</strong>
              </div>
              <div className="sec-modal-row">
                <span>Audio Alert Tone:</span>
                <strong>Advisory Chime</strong>
              </div>
              <div className="sec-modal-row">
                <span>Desk Operator:</span>
                <span style={{ color: "#0f172a", fontWeight: "700" }}>
                  {operatorName}
                </span>
              </div>
            </div>

            <div className="sec-modal-actions">
              <button
                type="button"
                onClick={() => {
                  if (onSendAlert) onSendAlert();
                  onClose();
                }}
                className="sec-btn-confirm"
              >
                Send Advisory Alert
              </button>
              <button
                type="button"
                onClick={onClose}
                className="sec-btn-cancel"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
