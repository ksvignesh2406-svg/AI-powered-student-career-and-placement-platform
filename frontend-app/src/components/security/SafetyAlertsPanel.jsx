import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, MapPin } from "lucide-react";

export default function SafetyAlertsPanel({
  alerts,
  filterPriority,
  onFilterChange,
  selectedAlert,
  onSelectAlert,
}) {
  return (
    <div className="sec-panel">
      {/* Panel Header */}
      <div className="sec-panel-head">
        <div className="sec-panel-title">
          <Activity size={18} />
          <span>Safety Alerts &amp; Reports</span>
        </div>

        {/* Filter Tabs */}
        <div className="sec-tabs">
          <button
            type="button"
            onClick={() => onFilterChange("ALL")}
            className={`sec-tab-btn ${filterPriority === "ALL" ? "active" : ""}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("URGENT")}
            className={`sec-tab-btn ${
              filterPriority === "URGENT" ? "active-urgent" : ""
            }`}
          >
            Urgent
          </button>
        </div>
      </div>

      {/* List Feed */}
      <div className="sec-alerts-feed">
        <AnimatePresence mode="popLayout">
          {alerts.map((item) => {
            const isSelected = selectedAlert?.id === item.id;
            const priorityClass = item.priority.toLowerCase();

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelectAlert(item)}
                className={`sec-alert-card ${isSelected ? "selected" : ""}`}
              >
                <div className="sec-alert-top">
                  <span className={`sec-priority-tag ${priorityClass}`}>
                    {item.priority === "URGENT"
                      ? "Needs Assistance"
                      : item.priority === "ATTENTION"
                      ? "Attention Needed"
                      : "Notice"}
                  </span>
                  <span className="sec-alert-time">
                    <Clock size={12} /> {item.time}
                  </span>
                </div>

                <h3 className="sec-alert-heading">{item.title}</h3>
                <p className="sec-alert-body">{item.description}</p>

                <div className="sec-alert-footer">
                  <span className="sec-alert-location">
                    <MapPin size={13} style={{ color: "#059669" }} />
                    <span>{item.location}</span>
                  </span>
                  <span className={`sec-status-pill ${item.status}`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
