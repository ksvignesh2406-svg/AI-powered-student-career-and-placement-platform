import { HeartHandshake, PhoneCall } from "lucide-react";

export default function NightWalkPanel({ nightWalks }) {
  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="sec-panel">
      <div className="sec-panel-head">
        <div className="sec-panel-title">
          <HeartHandshake size={18} />
          <span>Night Walk Escorts</span>
        </div>
        <span className="sec-count-tag">{nightWalks.length} Active</span>
      </div>

      <div className="sec-walks-list">
        {nightWalks.map((nw) => {
          const isCheckInNeeded =
            nw.secondsRemaining <= 60 && nw.secondsRemaining > 0;
          const isOverdue = nw.secondsRemaining === 0;
          const statusClass = isOverdue
            ? "overdue"
            : isCheckInNeeded
            ? "check-in"
            : "normal";

          return (
            <div key={nw.id} className={`sec-walk-item ${statusClass}`}>
              <div className="sec-walk-top">
                <div>
                  <div className="sec-walk-name">{nw.name}</div>
                  <div className="sec-walk-room">{nw.hostelRoom}</div>
                </div>
                <div>
                  <div className={`sec-walk-timer ${statusClass}`}>
                    {formatSeconds(nw.secondsRemaining)}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      color: "#94a3b8",
                      fontWeight: "750",
                      textAlign: "right",
                    }}
                  >
                    {isOverdue ? "Overdue" : "Remaining"}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="sec-progress-track">
                <div
                  className={`sec-progress-bar ${statusClass}`}
                  style={{
                    width: `${(nw.secondsRemaining / nw.totalSeconds) * 100}%`,
                  }}
                />
              </div>

              <div className="sec-walk-footer">
                <span className="sec-walk-phone">{nw.phone}</span>
                <button
                  type="button"
                  className="sec-walk-call"
                  onClick={() =>
                    window.alert(`Dialing student: ${nw.name} (${nw.phone})`)
                  }
                >
                  <PhoneCall size={12} />
                  <span>Call</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
