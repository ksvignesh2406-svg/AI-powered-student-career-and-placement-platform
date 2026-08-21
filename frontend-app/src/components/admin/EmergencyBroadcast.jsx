import { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Radio, Check } from "lucide-react";

export default function EmergencyBroadcast({ itemVariants, onBroadcastNotice }) {
  const [broadcastText, setBroadcastText] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [toggles, setToggles] = useState({
    hindi: true,
    tamil: true,
    mobileApp: true,
    parentPortal: false,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastText("");
      if (onBroadcastNotice) {
        onBroadcastNotice("Emergency broadcast dispatched to all channels.");
      }
    }, 800);
  };

  return (
    <motion.div variants={itemVariants} className="adm-broadcast-panel">
      <div className="adm-broadcast-head">
        <div className="adm-broadcast-icon">
          <Megaphone size={20} />
        </div>
        <div>
          <h2 className="adm-panel-title">Quick Emergency Broadcast</h2>
          <p className="adm-panel-desc">
            Draft in English. AI translates and dispatches instantly.
          </p>
        </div>
      </div>

      <form onSubmit={handleBroadcast}>
        <textarea
          rows={3}
          className="adm-broadcast-textarea"
          placeholder="Enter broadcast message (e.g., 'Heavy rain expected. All evening labs are cancelled and campus shuttles are active.'..."
          value={broadcastText}
          onChange={(e) => setBroadcastText(e.target.value)}
        />

        <div className="adm-broadcast-actions">
          {/* Toggles */}
          <div className="adm-broadcast-toggles">
            {[
              { id: "hindi", label: "Translate to Hindi" },
              { id: "tamil", label: "Translate to Tamil" },
              { id: "mobileApp", label: "Send to Mobile App" },
              { id: "parentPortal", label: "Send to Parent Portal" },
            ].map((toggle) => (
              <button
                type="button"
                key={toggle.id}
                onClick={() => handleToggle(toggle.id)}
                className={`adm-toggle-pill ${
                  toggles[toggle.id] ? "active" : ""
                }`}
              >
                <div className="adm-toggle-box">
                  {toggles[toggle.id] && <Check size={10} strokeWidth={3.5} />}
                </div>
                <span>{toggle.label}</span>
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={!broadcastText.trim() || isBroadcasting}
            className="adm-btn-broadcast"
          >
            <Radio size={16} />
            <span>
              {isBroadcasting ? "Broadcasting..." : "Generate & Broadcast"}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
