import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { AlertTriangle, Camera, Flame, Map, Navigation, User, Users } from "lucide-react";
import * as THREE from "three";

const BUILDINGS = [
  { id: "admin", name: "Administrative Block", x: -15, z: -5, width: 14, depth: 8, height: 10, type: "academic" },
  { id: "it", name: "IT Block", x: -25, z: -25, width: 16, depth: 10, height: 12, type: "academic" },
  { id: "library", name: "International Library", x: 10, z: -5, width: 12, depth: 8, height: 9, type: "academic" },
  { id: "mechanical", name: "Mechanical Engg", x: 0, z: -22, width: 10, depth: 15, height: 10, type: "academic" },
  { id: "annapoorani", name: "Annapoorani Hostel", x: -30, z: 15, width: 18, depth: 10, height: 14, type: "hostel" },
  { id: "kamakshi", name: "Kamakshi Hostel", x: -5, z: 25, width: 8, depth: 16, height: 12, type: "hostel" },
  { id: "gate", name: "Main Gate", x: 45, z: 35, width: 4, depth: 2, height: 5, type: "utility" },
  { id: "community", name: "Students Community Centre", x: -15, z: 10, width: 8, depth: 6, height: 6, type: "utility" },
  { id: "ground", name: "Play Ground", x: 30, z: -25, width: 25, depth: 25, height: 0.2, type: "park", shape: "cylinder" },
];

const DEFAULT_INCIDENTS = [
  { id: "inc-1", title: "Unauthorized Access", x: -25, z: -20, severity: "high" },
  { id: "inc-2", title: "Crowd Gathering", x: -10, z: 5, severity: "medium" },
];
const GUARDS = [
  { id: "guard-1", name: "Officer M. Suren", x: 35, z: 25, status: "patrolling" },
  { id: "guard-2", name: "Officer J. Smith", x: -20, z: 5, status: "stationary" },
  { id: "guard-3", name: "Officer A. Chen", x: 15, z: -15, status: "patrolling" },
];
const CAMERAS = [
  { id: "camera-1", name: "Cam-Gate-01", x: 42, z: 32, status: "working", heading: Math.PI / 4 },
  { id: "camera-2", name: "Cam-Admin-02", x: -5, z: 0, status: "working", heading: -Math.PI / 2 },
  { id: "camera-3", name: "Cam-Hostel-03", x: -20, z: 25, status: "broken", heading: Math.PI },
  { id: "camera-4", name: "Cam-Play-04", x: 15, z: -20, status: "working", heading: Math.PI / 1.5 },
];
const PHYSICAL_ROADS = [
  [[45, 35], [15, 35]],
  [[15, 35], [15, -30]],
  [[25, 5], [-35, 5]],
  [[-22, 20], [-22, -30]],
  [[15, -25], [-25, -25]],
];
const DEFAULT_ROUTE = [[45, 35], [15, 35], [15, 5], [-22, 5], [-22, -25], [-25, -25]];
const POPULATION_ZONES = [
  { id: "library-density", x: 10, z: -5, radius: 18, intensity: 0.42, type: "population" },
  { id: "community-density", x: -15, z: 10, radius: 12, intensity: 0.34, type: "population" },
];

const labelStyle = {
  background: "rgba(255, 255, 255, 0.97)", border: "1px solid #94a3b8", borderRadius: "6px", boxShadow: "0 3px 12px rgba(15, 23, 42, 0.2)",
  color: "#0f172a", fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: 750, lineHeight: 1.2, padding: "5px 8px", pointerEvents: "none", textShadow: "0 1px 0 rgba(255,255,255,.8)", whiteSpace: "nowrap",
};

function Building({ building, showLabels }) {
  const color = { academic: "#f8fafc", hostel: "#fff1f2", utility: "#f0fdf4", park: "#dcfce7" }[building.type] || "#f1f5f9";
  return <group position={[building.x, building.height / 2, building.z]}>
    <mesh castShadow receiveShadow>
      {building.shape === "cylinder" ? <cylinderGeometry args={[building.width / 2, building.width / 2, building.height, 32]} /> : <boxGeometry args={[building.width, building.height, building.depth]} />}
      <meshStandardMaterial color={color} roughness={0.82} metalness={0.08} />
    </mesh>
    {showLabels && <Html position={[0, building.height / 2 + 1.2, 0]} center transform sprite distanceFactor={12} zIndexRange={[10, 0]}><div style={labelStyle}>{building.name}</div></Html>}
  </group>;
}

function RoadSegment({ start, end, width = 3 }) {
  const [startX, startZ] = start;
  const [endX, endZ] = end;
  const length = Math.hypot(endX - startX, endZ - startZ) + width;
  const angle = Math.atan2(endZ - startZ, endX - startX);
  return <mesh position={[(startX + endX) / 2, 0.015, (startZ + endZ) / 2]} rotation={[0, -angle, 0]} receiveShadow>
    <boxGeometry args={[length, 0.06, width]} />
    <meshStandardMaterial color="#cbd5e1" roughness={0.9} metalness={0.04} />
  </mesh>;
}

function SafePathRoute({ routePath }) {
  const points = useMemo(() => (routePath.length ? routePath : DEFAULT_ROUTE).map(([x, z]) => new THREE.Vector3(x, 0.16, z)), [routePath]);
  const curve = useMemo(() => {
    const path = new THREE.CurvePath();
    for (let index = 0; index < points.length - 1; index += 1) path.add(new THREE.LineCurve3(points[index], points[index + 1]));
    return path;
  }, [points]);
  const dotRef = useRef();
  useFrame(({ clock }) => { if (dotRef.current) dotRef.current.position.copy(curve.getPointAt((clock.getElapsedTime() * 0.12) % 1)); });
  return <group>
    <Line points={points} color="#2563eb" lineWidth={3} />
    <mesh ref={dotRef}><sphereGeometry args={[0.55, 16, 16]} /><meshBasicMaterial color="#2563eb" /></mesh>
  </group>;
}

function IncidentMarker({ incident, isSelected, onSelect, showLabel }) {
  const pulseRef = useRef();
  const color = incident.severity === "high" ? "#ef4444" : incident.severity === "medium" ? "#f59e0b" : "#eab308";
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 5 + incident.x) * 0.2;
      pulseRef.current.scale.setScalar(1 + pulse);
      pulseRef.current.material.opacity = 0.55 + pulse;
    }
  });
  return <group position={[incident.x, 0.28, incident.z]} onClick={(event) => { event.stopPropagation(); onSelect?.(incident.id); }}>
    <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[isSelected ? 1.25 : 1, isSelected ? 2.45 : 2, 32]} /><meshBasicMaterial color={color} transparent opacity={0.8} /></mesh>
    <mesh position={[0, 0.25, 0]}><sphereGeometry args={[isSelected ? 0.48 : 0.35, 16, 16]} /><meshBasicMaterial color={isSelected ? "#ffffff" : color} /></mesh>
    {showLabel && <Html position={[0, 2, 0]} center transform sprite distanceFactor={11} zIndexRange={[20, 0]}><div style={{ ...labelStyle, borderColor: color, color }}>{incident.title}</div></Html>}
  </group>;
}

function GuardMarker({ guard, showLabels }) {
  return <group position={[guard.x, 1, guard.z]}>
    <mesh><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} /></mesh>
    {showLabels && <Html position={[0, 1.5, 0]} center transform sprite distanceFactor={12} zIndexRange={[10, 0]}><div style={labelStyle}>{guard.name} · {guard.status}</div></Html>}
  </group>;
}

function CameraMarker({ camera, showLabels }) {
  const broken = camera.status === "broken";
  return <group position={[camera.x, 6, camera.z]}>
    <mesh position={[0, -3, 0]}><cylinderGeometry args={[0.1, 0.1, 6]} /><meshStandardMaterial color="#64748b" /></mesh>
    <mesh rotation={[0, camera.heading, 0]}><boxGeometry args={[0.6, 0.4, 0.8]} /><meshStandardMaterial color={broken ? "#ef4444" : "#1e293b"} /></mesh>
    {showLabels && <Html position={[0, 1.4, 0]} center transform sprite distanceFactor={12} zIndexRange={[10, 0]}><div style={{ ...labelStyle, color: broken ? "#dc2626" : "#334155" }}>{camera.name}{broken ? " · Offline" : ""}</div></Html>}
  </group>;
}

function HeatmapPlane({ type, zones }) {
  const uniforms = useMemo(() => {
    const positions = new Float32Array(40);
    const parameters = new Float32Array(40);
    const matchingZones = zones.filter((zone) => zone.type === type).slice(0, 20);
    matchingZones.forEach((zone, index) => {
      positions[index * 2] = zone.x;
      positions[index * 2 + 1] = zone.z;
      parameters[index * 2] = zone.radius;
      parameters[index * 2 + 1] = zone.intensity;
    });
    return {
      uPositions: { value: positions },
      uParameters: { value: parameters },
      uCount: { value: matchingZones.length },
      uColor: { value: new THREE.Color(type === "danger" ? "#ef4444" : "#2563eb") },
    };
  }, [type, zones]);
  const vertexShader = `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * viewMatrix * worldPosition; }`;
  const fragmentShader = `uniform float uPositions[40]; uniform float uParameters[40]; uniform int uCount; uniform vec3 uColor; varying vec3 vWorldPosition; void main() { float totalHeat = 0.0; for (int index = 0; index < 20; index++) { if (index >= uCount) break; vec2 position = vec2(uPositions[index * 2], uPositions[index * 2 + 1]); float radius = uParameters[index * 2]; float intensity = uParameters[index * 2 + 1]; float distanceToZone = distance(vWorldPosition.xz, position); totalHeat += smoothstep(radius, 0.0, distanceToZone) * intensity; } gl_FragColor = vec4(uColor, clamp(totalHeat, 0.0, 0.48)); }`;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, type === "danger" ? 0.035 : 0.045, 0]} renderOrder={1}>
    <planeGeometry args={[150, 150]} />
    <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
  </mesh>;
}

function CampusScene({ incidents, activeIncidentId, onIncidentSelect, routePath, layers, viewMode, heatZones }) {
  const isSecurity = viewMode === "security";
  return <>
    <ambientLight intensity={0.62} color="#ffffff" />
    <directionalLight position={[50, 80, 20]} intensity={1.2} color="#fdf8f6" castShadow shadow-mapSize={[1024, 1024]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow><planeGeometry args={[150, 150]} /><meshStandardMaterial color="#e2e8f0" roughness={1} /></mesh>
    {PHYSICAL_ROADS.map(([start, end], index) => <RoadSegment key={`road-${index}`} start={start} end={end} />)}
    {layers.heatmap && <><HeatmapPlane type="danger" zones={heatZones} /><HeatmapPlane type="population" zones={heatZones} /></>}
    {BUILDINGS.map((building) => <Building key={building.id} building={building} showLabels />)}
    {layers.heatmap && incidents.map((incident) => <IncidentMarker key={incident.id} incident={incident} isSelected={activeIncidentId === incident.id} onSelect={onIncidentSelect} showLabel={activeIncidentId === incident.id} />)}
    {isSecurity ? <>
      {layers.patrols && GUARDS.map((guard) => <GuardMarker key={guard.id} guard={guard} showLabels />)}
      {layers.cctv && CAMERAS.map((camera) => <CameraMarker key={camera.id} camera={camera} showLabels />)}
    </> : <SafePathRoute routePath={routePath} />}
    <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={20} maxDistance={140} maxPolarAngle={Math.PI / 2 - 0.1} />
  </>;
}

function severityOf(incident) {
  if (incident.severity) return incident.severity;
  if (typeof incident.intensity === "number") return incident.intensity > 3 ? "high" : incident.intensity > 2 ? "medium" : "low";
  return incident.priority === "URGENT" ? "high" : incident.priority === "ATTENTION" ? "medium" : "low";
}

function LegendRow({ color, label, outline = false, icon: Icon, muted = false }) {
  return <div className={`campus-map-legend-row${muted ? " is-muted" : ""}`}>
    {Icon ? <Icon size={14} color={color} strokeWidth={2.2} /> : <span className={`campus-map-legend-swatch${outline ? " is-outline" : ""}`} style={outline ? { borderColor: color } : { backgroundColor: color }} />}
    <span>{label}</span>
  </div>;
}

function MapLegend({ viewMode, layers }) {
  const isSecurity = viewMode === "security";
  return <aside className="campus-map-legend" aria-label="Campus map legend">
    <div className="campus-map-legend-title"><Map size={15} /><span>Map Legend</span></div>
    <div className="campus-map-legend-section">
      <LegendRow color="#94a3b8" label="Academic Zone" outline />
      <LegendRow color="#fecdd3" label="Hostel Zone" />
      <LegendRow color="#bbf7d0" label="Utility & Services" />
      <LegendRow color="#86efac" label="Parks & Grounds" />
      <LegendRow color="#cbd5e1" label="Campus Roads" />
    </div>
    <div className="campus-map-legend-section campus-map-legend-dynamic">
      {isSecurity ? <>
        <LegendRow icon={AlertTriangle} color="#ef4444" label="High Priority Alert" muted={!layers.heatmap} />
        <LegendRow icon={AlertTriangle} color="#f59e0b" label="Medium Priority Alert" muted={!layers.heatmap} />
        <LegendRow icon={User} color="#3b82f6" label="Active Security Guard" muted={!layers.patrols} />
        <LegendRow icon={Camera} color="#334155" label="Online CCTV" muted={!layers.cctv} />
        <LegendRow icon={Camera} color="#ef4444" label="Offline CCTV" muted={!layers.cctv} />
        <LegendRow icon={Flame} color="#ef4444" label="Dynamic danger zones" muted={!layers.heatmap} />
        <LegendRow icon={Users} color="#2563eb" label="Crowd-density zones" muted={!layers.heatmap} />
      </> : <>
        <LegendRow icon={Navigation} color="#2563eb" label="Active Safe Route" />
        <LegendRow icon={User} color="#94a3b8" label="You are here (Gate)" />
        <LegendRow icon={AlertTriangle} color="#f59e0b" label="Reported Hazard" muted={!layers.heatmap} />
      </>}
    </div>
  </aside>;
}

export default function CampusHeatmap3D({ incidents, activeIncidentId = null, onIncidentSelect, routePath = [], layers = { heatmap: true, patrols: false }, className = "", viewMode }) {
  const resolvedViewMode = viewMode || (Object.hasOwn(layers, "cctv") ? "security" : "student");
  const mapIncidents = useMemo(() => (incidents || DEFAULT_INCIDENTS).map((incident, index) => {
    const fallback = DEFAULT_INCIDENTS[index % DEFAULT_INCIDENTS.length];
    return { id: incident.id, title: incident.title || incident.type || "Campus incident", x: Number.isFinite(incident.x) ? incident.x : fallback.x, z: Number.isFinite(incident.z) ? incident.z : fallback.z, severity: severityOf(incident) };
  }), [incidents]);
  const heatZones = useMemo(() => [
    ...mapIncidents.map((incident) => ({
      id: `danger-${incident.id}`,
      x: incident.x,
      z: incident.z,
      radius: incident.severity === "high" ? 15 : incident.severity === "medium" ? 11 : 8,
      intensity: incident.severity === "high" ? 0.48 : incident.severity === "medium" ? 0.34 : 0.22,
      type: "danger",
    })),
    ...POPULATION_ZONES,
  ], [mapIncidents]);
  return <div className={`campus-heatmap ${className}`}>
    <Canvas shadows camera={{ position: [-30, 60, 80], fov: 40 }} gl={{ antialias: true }}>
      <color attach="background" args={["#f8fafc"]} />
      <CampusScene incidents={mapIncidents} activeIncidentId={activeIncidentId} onIncidentSelect={onIncidentSelect} routePath={routePath} layers={layers} viewMode={resolvedViewMode} heatZones={heatZones} />
    </Canvas>
    <MapLegend viewMode={resolvedViewMode} layers={layers} />
    <div className="campus-heatmap-vignette campus-heatmap-vignette--light" />
  </div>;
}
