import { Shield } from "lucide-react";

export default function GuardsOnDutyPanel({ guards }) {
  const readyCount = guards.filter((g) => g.status === "On Duty").length;

  return (
    <div className="sec-panel">
      <div className="sec-panel-head">
        <div className="sec-panel-title">
          <Shield size={18} />
          <span>Guards on Duty</span>
        </div>
        <span className="sec-count-tag">{readyCount} Ready</span>
      </div>

      <div className="sec-guards-list">
        {guards.map((guard) => {
          const statusTagClass = guard.status === "On Duty" ? "OnDuty" : "Assisting";

          return (
            <div key={guard.id} className="sec-guard-item">
              <div className="sec-guard-info">
                <div className="sec-guard-avatar">{guard.initials}</div>
                <div>
                  <div className="sec-guard-name">{guard.name}</div>
                  <div className="sec-guard-loc">
                    {guard.location} • {guard.role}
                  </div>
                </div>
              </div>

              <span className={`sec-duty-tag ${statusTagClass}`}>
                {guard.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
