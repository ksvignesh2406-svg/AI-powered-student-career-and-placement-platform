import { Compass, Loader2, MapPin, UserCheck } from "lucide-react";

export default function CampusMapPanel({
  mapMode,
  onMapModeChange,
  selectedAlert,
  onAssignGuard,
}) {
  return (
    <div className="sec-map-panel">
      {/* Top Controls Header */}
      <div className="sec-panel-head" style={{ marginBottom: "0" }}>
        <div className="sec-panel-title">
          <Compass size={18} />
          <span>3D Campus Map Grid</span>
        </div>

        <div className="sec-tabs">
          {["3D Campus", "Night Lights", "Hostel Zones"].map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => onMapModeChange(mode)}
              className={`sec-tab-btn ${mapMode === mode ? "active" : ""}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Light Map Canvas Area */}
      <div className="sec-map-canvas">
        <div className="sec-map-icon-box">
          <Compass size={32} />
        </div>

        <div className="sec-map-badge">
          <strong>
            <Loader2 size={14} className="animate-spin" />
            Initializing {mapMode} Grid
          </strong>
          <p>
            Spatial camera &amp; live hostel pins with active illuminated night
            walk paths.
          </p>
        </div>
      </div>

      {/* Bottom Quick Action Drawer for Selected Alert */}
      {selectedAlert && (
        <div className="sec-map-drawer">
          <div className="sec-drawer-info">
            <span className="sec-drawer-kicker">Selected Incident</span>
            <span className="sec-drawer-title">{selectedAlert.title}</span>
            <span className="sec-drawer-loc">
              <MapPin size={12} style={{ color: "#059669" }} />
              {selectedAlert.location}
            </span>
          </div>

          {selectedAlert.status === "Pending" && (
            <button
              type="button"
              onClick={() => onAssignGuard(selectedAlert.id)}
              className="sec-btn-drawer-dispatch"
            >
              <UserCheck size={14} />
              <span>Dispatch</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
