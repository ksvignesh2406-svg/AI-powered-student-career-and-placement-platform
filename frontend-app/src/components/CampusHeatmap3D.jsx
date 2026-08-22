import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const MAX_INCIDENTS = 20;

const CAMPUS_INCIDENTS = [
  { id: 1, x: 12, z: -8, intensity: 3.5, type: "Unauthorized Access" },
  { id: 2, x: -18, z: 15, intensity: 2.1, type: "Perimeter Breach" },
  { id: 3, x: 5, z: 25, intensity: 1.8, type: "Suspicious Activity" },
  { id: 4, x: -22, z: -18, intensity: 4.2, type: "Fire Alarm" },
  { id: 5, x: 28, z: 10, intensity: 1.5, type: "Network Anomaly" },
  { id: 6, x: 2, z: -2, intensity: 2.8, type: "Access Denied" },
];

function generateCampusLayout() {
  const buildings = [{ x: 0, z: 0, w: 12, d: 12, h: 1.5, type: "core" }];
  const academicRadius = 20;

  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2;
    buildings.push({
      x: Math.cos(angle) * academicRadius,
      z: Math.sin(angle) * academicRadius,
      w: 4 + (index % 3),
      d: 4 + ((index + 1) % 3),
      h: 15 + Math.sin(index * 1.5) * 8,
      type: "academic",
    });
  }

  for (let index = 0; index < 25; index += 1) {
    const angle = (index / 25) * Math.PI * 2 * 3;
    const radius = 35 + (index % 15);
    buildings.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      w: 3,
      d: 3,
      h: 4 + (index % 6),
      type: "residential",
    });
  }

  return buildings;
}

function HeatmapMaterial({ incidents }) {
  const materialRef = useRef();
  const uniforms = useMemo(() => {
    const points = Array.from({ length: MAX_INCIDENTS }, (_, index) => {
      const incident = incidents[index];
      return new THREE.Vector3(incident?.x || 0, incident?.z || 0, incident?.intensity || 0);
    });
    return {
      uTime: { value: 0 },
      uPoints: { value: points },
      uPointCount: { value: Math.min(incidents.length, MAX_INCIDENTS) },
    };
  }, [incidents]);

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  const vertexShader = `
    varying vec2 vPosition;
    void main() {
      vPosition = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uPoints[${MAX_INCIDENTS}];
    uniform int uPointCount;
    varying vec2 vPosition;
    vec3 heatColor(float intensity) {
      vec3 cold = vec3(0.01, 0.08, 0.16);
      vec3 cyan = vec3(0.0, 0.72, 0.72);
      vec3 yellow = vec3(0.95, 0.72, 0.08);
      vec3 red = vec3(1.0, 0.12, 0.16);
      if (intensity < 0.4) return mix(cold, cyan, intensity / 0.4);
      if (intensity < 0.9) return mix(cyan, yellow, (intensity - 0.4) / 0.5);
      return mix(yellow, red, min((intensity - 0.9) / 1.5, 1.0));
    }
    void main() {
      float totalHeat = 0.0;
      for (int index = 0; index < ${MAX_INCIDENTS}; index++) {
        if (index >= uPointCount) break;
        vec3 point = uPoints[index];
        float distanceToPoint = distance(vPosition, point.xy);
        float pulse = 1.0 + 0.12 * sin(uTime * 3.0 + float(index));
        totalHeat += (point.z * pulse) / (pow(distanceToPoint * 0.4, 2.0) + 1.0);
      }
      float edgeFade = 1.0 - smoothstep(40.0, 60.0, length(vPosition));
      float alpha = smoothstep(0.05, 0.5, totalHeat) * 0.82 * edgeFade;
      gl_FragColor = vec4(heatColor(totalHeat), alpha);
    }
  `;

  return <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />;
}

function Building({ data }) {
  return (
    <group position={[data.x, data.h / 2, data.z]}>
      <mesh>
        <boxGeometry args={[data.w, data.h, data.d]} />
        <meshStandardMaterial color={data.type === "core" ? "#123b42" : "#10232f"} roughness={0.3} metalness={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <boxGeometry args={[data.w + 0.1, data.h + 0.1, data.d + 0.1]} />
        <meshBasicMaterial color={data.type === "core" ? "#f59e0b" : "#2dd4bf"} wireframe transparent opacity={0.24} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function IncidentMarker({ incident, isSelected, onClick }) {
  const markerRef = useRef();
  const height = incident.intensity * 4;
  const color = incident.intensity > 3 ? "#ef4444" : incident.intensity > 2 ? "#facc15" : "#22d3ee";

  useFrame(({ clock }) => {
    if (markerRef.current) {
      markerRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 4 + incident.x) * 0.1;
      markerRef.current.material.opacity = 0.45 + Math.sin(clock.elapsedTime * 6 + incident.z) * 0.25;
    }
  });

  return (
    <group position={[incident.x, height / 2, incident.z]}>
      <mesh ref={markerRef}>
        <cylinderGeometry args={[0.5, 0.5, height, 16]} />
        <meshBasicMaterial color={isSelected ? "#ffffff" : color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, height / 2 + 0.2, 0]} onClick={onClick}>
        <sphereGeometry args={[isSelected ? 0.8 : 0.65, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.95 : 0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, height * 1.1, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function SafeRouteLine({ routePath }) {
  if (!routePath?.length) return null;
  const points = routePath.map(([x, z]) => new THREE.Vector3(x, 0.18, z));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return <line geometry={geometry}><lineBasicMaterial color="#5eead4" linewidth={2} transparent opacity={0.95} /></line>;
}

function CampusControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useFrame(() => controlsRef.current?.update());

  return <primitive ref={controlsRef} object={new ThreeOrbitControls(camera, gl.domElement)} enablePan={false} enableDamping autoRotate autoRotateSpeed={0.3} minDistance={20} maxDistance={80} maxPolarAngle={Math.PI / 2 - 0.05} />;
}

function PatrolRoute() {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-28, 0.18, -18),
    new THREE.Vector3(-8, 0.18, -4),
    new THREE.Vector3(12, 0.18, 10),
    new THREE.Vector3(28, 0.18, 10),
  ]), []);
  return <line geometry={geometry}><lineBasicMaterial color="#34d399" transparent opacity={0.8} /></line>;
}

function CampusGrid() {
  const lines = [];
  for (let position = -50; position <= 50; position += 1) {
    const isSection = position % 5 === 0;
    lines.push(<line key={`x-${position}`}><bufferGeometry><bufferAttribute attach="attributes-position" count={2} array={new Float32Array([-50, 0, position, 50, 0, position])} itemSize={3} /></bufferGeometry><lineBasicMaterial color={isSection ? "#2dd4bf" : "#075e58"} transparent opacity={isSection ? 0.5 : 0.25} /></line>);
    lines.push(<line key={`z-${position}`}><bufferGeometry><bufferAttribute attach="attributes-position" count={2} array={new Float32Array([position, 0, -50, position, 0, 50])} itemSize={3} /></bufferGeometry><lineBasicMaterial color={isSection ? "#2dd4bf" : "#075e58"} transparent opacity={isSection ? 0.5 : 0.25} /></line>);
  }
  return <group position={[0, -0.01, 0]}>{lines}</group>;
}

function CampusScene({ incidents, activeIncidentId, onIncidentSelect, routePath, layers }) {
  const buildings = useMemo(() => generateCampusLayout(), []);
  return (
    <>
      <ambientLight intensity={0.35} color="#164e63" />
      <directionalLight position={[20, 30, -20]} intensity={1.3} color="#dffcf4" />
      <pointLight position={[0, 10, 0]} intensity={2} color="#10b981" distance={50} />
      <CampusGrid />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120, 64, 64]} />
        {layers.heatmap && <HeatmapMaterial incidents={incidents} />}
      </mesh>
      {buildings.map((building, index) => <Building key={`building-${index}`} data={building} />)}
      <SafeRouteLine routePath={routePath} />
      {incidents.map((incident) => <IncidentMarker key={incident.id} incident={incident} isSelected={activeIncidentId === incident.id} onClick={() => onIncidentSelect?.(incident.id)} />)}
      {layers.patrols && <PatrolRoute />}
      <CampusControls />
    </>
  );
}

export default function CampusHeatmap3D({ incidents = CAMPUS_INCIDENTS, activeIncidentId = null, onIncidentSelect, routePath = [], layers = { heatmap: true, patrols: false }, className = "" }) {
  return (
    <div className={`campus-heatmap ${className}`}>
      <Canvas shadows camera={{ position: [35, 30, 45], fov: 45 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <color attach="background" args={["#050b12"]} />
        <fog attach="fog" args={["#050b12", 30, 90]} />
        <CampusScene incidents={incidents} layers={layers} activeIncidentId={activeIncidentId} onIncidentSelect={onIncidentSelect} routePath={routePath} />
      </Canvas>
      <div className="campus-heatmap-vignette" />
    </div>
  );
}
