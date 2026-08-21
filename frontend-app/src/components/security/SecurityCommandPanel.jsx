import { useState } from "react";
import { ChevronRight, Layers, MessageSquare, Radio, Send, Terminal, Video, X } from "lucide-react";

const routeGraph = {
  Gate_A: { Lib_Square: 5 },
  Lib_Square: { Gate_A: 5, Sci_Block: 10, Dorm_North: 8 },
  Sci_Block: { Lib_Square: 10, Admin_Bldg: 6 },
  Dorm_North: { Lib_Square: 8, Admin_Bldg: 15 },
  Admin_Bldg: { Sci_Block: 6, Dorm_North: 15 },
};

function findSafeRoute(start, end, hazards) {
  const distances = Object.fromEntries(Object.keys(routeGraph).map((node) => [node, Infinity]));
  const previous = {};
  const queue = [{ node: start, cost: 0 }];
  distances[start] = 0;

  while (queue.length) {
    queue.sort((left, right) => left.cost - right.cost);
    const current = queue.shift();
    if (current.node === end) break;
    Object.entries(routeGraph[current.node] || {}).forEach(([neighbor, weight]) => {
      const penalty = hazards.includes(neighbor) ? 1000 : 0;
      const cost = current.cost + weight + penalty;
      if (cost < distances[neighbor]) {
        distances[neighbor] = cost;
        previous[neighbor] = current.node;
        queue.push({ node: neighbor, cost });
      }
    });
  }

  const path = [];
  let node = end;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }
  return { path: path.length > 1 ? path : [], cost: distances[end] };
}

const cameras = [
  { id: "CAM-01", label: "North Quad", tone: "cyan" },
  { id: "CAM-02", label: "Science Block", tone: "red", glitch: true },
  { id: "CAM-03", label: "Gate A", tone: "emerald" },
  { id: "CAM-04", label: "Library Square", tone: "amber" },
];

function CCTVFeed({ camera }) {
  return (
    <div className={`sec-cctv-feed ${camera.glitch ? "glitch" : ""}`}>
      <div className={`sec-cctv-image ${camera.tone}`} />
      <div className="sec-cctv-scanlines" />
      <span className="sec-cctv-rec"><b /> REC</span>
      <span className="sec-cctv-time">LIVE</span>
      <span className="sec-cctv-label">{camera.id} · {camera.label}</span>
    </div>
  );
}

export default function SecurityCommandPanel({ layers, onLayerChange, onFocusIncident }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([{ role: "system", text: "Nexus AI Command online. Awaiting query." }]);

  const runCommand = (text) => {
    const normalized = text.toLowerCase();
    if (normalized.includes("route") || normalized.includes("safepath")) {
      const result = findSafeRoute("Lib_Square", "Admin_Bldg", ["Sci_Block"]);
      return `Hazard detected at Sci_Block. SafePath rerouted via ${result.path.join(" -> ")} (cost ${result.cost}).`;
    }
    if (normalized.includes("incident") || normalized.includes("alert")) {
      onFocusIncident?.();
      return "Incident focus locked to the highest-priority active alert.";
    }
    if (normalized.includes("camera") || normalized.includes("cctv")) {
      onLayerChange("cctv", true);
      return "CCTV coverage layer enabled. Four feeds are live.";
    }
    if (normalized.includes("timer") || normalized.includes("ghost")) {
      return "Two Ghost Timers are active. One escort is approaching check-in threshold.";
    }
    return "Query processed. Try route, incident, camera, or ghost timer.";
  };

  const submitCommand = (event) => {
    event.preventDefault();
    const command = query.trim();
    if (!command) return;
    setQuery("");
    setMessages((current) => [...current, { role: "user", text: command }, { role: "system", text: runCommand(command) }]);
  };

  return (
    <div className="sec-command-stack">
      <div className="sec-command-panel">
        <div className="sec-command-title"><Layers size={15} /><span>Tactical Layers</span><span className="sec-command-live">LIVE</span></div>
        {[{ id: "heatmap", label: "Incident heatmap" }, { id: "patrols", label: "Active patrol routes" }, { id: "cctv", label: "CCTV coverage" }].map((layer) => (
          <label className="sec-layer-toggle" key={layer.id}><span>{layer.label}</span><input type="checkbox" checked={layers[layer.id]} onChange={() => onLayerChange(layer.id)} /><i /></label>
        ))}
      </div>

      <div className="sec-cctv-panel">
        <div className="sec-command-title"><Video size={15} /><span>Active Telemetry</span><span className="sec-command-live">LIVE</span></div>
        {layers.cctv && <div className="sec-cctv-grid">{cameras.map((camera) => <CCTVFeed key={camera.id} camera={camera} />)}</div>}
        {!layers.cctv && <button type="button" className="sec-cctv-enable" onClick={() => onLayerChange("cctv", true)}><Radio size={15} /> Enable CCTV coverage</button>}
      </div>

      <div className="sec-command-ai">
        {isChatOpen && <div className="sec-command-chat"><div className="sec-chat-header"><span><Terminal size={14} /> Nexus Command AI</span><button type="button" onClick={() => setIsChatOpen(false)} aria-label="Close command AI"><X size={14} /></button></div><div className="sec-chat-messages">{messages.map((message, index) => <p key={`${message.role}-${index}`} className={message.role}>{message.role === "system" ? "sys> " : "usr> "}{message.text}</p>)}</div><form onSubmit={submitCommand}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter command..." aria-label="Enter command" /><button type="submit" aria-label="Send command"><Send size={14} /></button></form></div>}
        <button type="button" className="sec-command-button" onClick={() => setIsChatOpen((open) => !open)} aria-label={isChatOpen ? "Close command AI" : "Open command AI"}><MessageSquare size={18} /> <span>Nexus AI</span><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

