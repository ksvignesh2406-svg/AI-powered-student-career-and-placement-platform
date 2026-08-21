import { Shield } from "lucide-react";

export default function SecurityBanner({
  activeAlertsCount = 0,
  nightWalksCount = 0,
  guardsReadyCount = 0,
}) {
  return (
    <section className="sec-banner">
      <div className="sec-banner-content">
        <div className="sec-banner-pill">
          <Shield size={14} />
          <span>Security Workspace</span>
        </div>
        <h1>Hostel Guard &amp; Safety Command</h1>
        <p>
          Real-time campus incident triage, live night walk escort tracking, and
          automated warden dispatch system.
        </p>
      </div>

      <div className="sec-banner-chips" aria-label="Security summary chips">
        <div className="sec-stat-chip">
          <div className="sec-stat-num">{activeAlertsCount}</div>
          <div className="sec-stat-label">Active Alerts</div>
        </div>
        <div className="sec-stat-chip">
          <div className="sec-stat-num">{nightWalksCount}</div>
          <div className="sec-stat-label">Night Walks</div>
        </div>
        <div className="sec-stat-chip">
          <div className="sec-stat-num">{guardsReadyCount}</div>
          <div className="sec-stat-label">Guards Ready</div>
        </div>
      </div>
    </section>
  );
}
