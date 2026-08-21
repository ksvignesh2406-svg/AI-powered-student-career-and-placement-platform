import { Sparkles, Clock, Volume2, VolumeX, BellRing, LogOut } from "lucide-react";

export default function SecurityHeader({
  user,
  formattedDate,
  formattedTime,
  audioMuted,
  onToggleAudio,
  onOpenBroadcast,
  onLogout,
}) {
  const userName = user?.name || "Santhosh Kumar";
  const userRole = user?.department || "Head Warden";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sec-header">
      {/* Brand Identity */}
      <div className="sec-brand">
        <div className="sec-brand-icon">
          <Sparkles size={20} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="sec-brand-title">Campus OS</span>
          <span className="sec-hub-pill">Security Hub</span>
        </div>
      </div>

      {/* Live Clock & Date */}
      <div className="sec-clock-pill">
        <Clock size={14} style={{ color: "#059669" }} />
        <span>{formattedDate}</span>
        <span>•</span>
        <span className="sec-clock-time">{formattedTime}</span>
      </div>

      {/* Nav Actions */}
      <div className="sec-nav-actions">
        <button
          type="button"
          onClick={onToggleAudio}
          className="sec-btn-icon"
          title={audioMuted ? "Unmute Chimes" : "Mute Chimes"}
        >
          {audioMuted ? (
            <VolumeX size={16} style={{ color: "#ef4444" }} />
          ) : (
            <Volume2 size={16} style={{ color: "#059669" }} />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenBroadcast}
          className="sec-btn-broadcast"
        >
          <BellRing size={16} />
          <span>Campus Public Alert</span>
        </button>

        {/* User Profile */}
        <div className="sec-profile">
          <div className="sec-profile-text">
            <div className="sec-profile-name">{userName}</div>
            <div className="sec-profile-role">{userRole}</div>
          </div>
          <div className="sec-avatar">{initials}</div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="sec-btn-icon"
              style={{ width: "32px", height: "32px", border: "none" }}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
