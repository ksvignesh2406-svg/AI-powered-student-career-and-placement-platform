import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ShieldAlert, Check, Clock, TrendingUp, X, Send } from "lucide-react";

const initialClusters = [
  {
    id: 1,
    title: "5 reports of broken lights at Hostel C.",
    status: "Awaiting Dispatch",
    statusType: "pending",
    icon: Wrench,
    time: "10 mins ago",
    location: "Hostel C Block",
  },
  {
    id: 2,
    title: "2 reports of unauthorized parking near Block B.",
    status: "Security Dispatched",
    statusType: "resolved",
    icon: ShieldAlert,
    time: "45 mins ago",
    location: "Block B Parking",
  },
];

export default function IncidentTriage({ itemVariants, onDispatchNotice }) {
  const [clusters, setClusters] = useState(initialClusters);
  const [showTriageCenter, setShowTriageCenter] = useState(false);

  const handleDispatch = (clusterId) => {
    setClusters((prev) =>
      prev.map((c) =>
        c.id === clusterId
          ? {
              ...c,
              status: "Dispatched",
              statusType: "resolved",
            }
          : c
      )
    );
    if (onDispatchNotice) {
      onDispatchNotice(`Action dispatched for Cluster #${clusterId}`);
    }
  };

  return (
    <motion.div variants={itemVariants} className="adm-panel">
      <div className="adm-panel-header" style={{ marginBottom: "12px" }}>
        <div>
          <h2 className="adm-panel-title">AI Incident Triage</h2>
          <p className="adm-panel-desc">
            Raw reports summarized into{" "}
            <span style={{ color: "#059669", fontWeight: "700" }}>Clusters</span>.
          </p>
        </div>
      </div>

      <div className="adm-timeline">
        {clusters.map((cluster, idx) => (
          <div key={idx} className="adm-timeline-item">
            <span className={`adm-timeline-dot ${cluster.statusType}`} />

            <span className="adm-cluster-tag">Cluster #{cluster.id}</span>
            <div className="adm-cluster-title">{cluster.title}</div>

            <div className="adm-cluster-footer">
              <span className={`adm-cluster-badge ${cluster.statusType}`}>
                {cluster.statusType === "resolved" ? (
                  <Check size={12} />
                ) : (
                  <Clock size={12} />
                )}
                {cluster.status}
              </span>
              <span className="adm-cluster-time">{cluster.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
        <button
          type="button"
          onClick={() => setShowTriageCenter(true)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: "750",
            color: "#475569",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <span>Open Triage Center</span>
          <TrendingUp size={15} style={{ color: "#059669" }} />
        </button>
      </div>

      {/* Triage Modal */}
      <AnimatePresence>
        {showTriageCenter && (
          <div
            className="sec-modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && setShowTriageCenter(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="sec-modal-box"
              style={{ maxWidth: "520px" }}
            >
              <button
                type="button"
                onClick={() => setShowTriageCenter(false)}
                className="sec-modal-close"
              >
                <X size={16} />
              </button>

              <div className="sec-modal-header">
                <div>
                  <h2>Active Incident Clusters &amp; Triage</h2>
                  <p>Live campus maintenance and security feed</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "14px 0" }}>
                {clusters.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          color: "#059669",
                          background: "#ecfdf5",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        Cluster #{c.id}
                      </span>
                      <div style={{ fontSize: "12px", fontWeight: "750", color: "#0f172a", marginTop: "4px" }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        📍 {c.location} • {c.time}
                      </div>
                    </div>

                    <div>
                      {c.statusType === "pending" ? (
                        <button
                          type="button"
                          onClick={() => handleDispatch(c.id)}
                          className="sec-btn-confirm"
                          style={{ padding: "6px 12px", fontSize: "11px", height: "auto" }}
                        >
                          <Send size={12} style={{ display: "inline", marginRight: "4px" }} /> Dispatch
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "750",
                            color: "#047857",
                            background: "#ecfdf5",
                            padding: "4px 8px",
                            borderRadius: "6px",
                          }}
                        >
                          Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowTriageCenter(false)}
                  className="sec-btn-cancel"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
