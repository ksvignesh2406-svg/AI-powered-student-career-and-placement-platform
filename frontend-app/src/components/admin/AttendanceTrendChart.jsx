import { useState } from "react";

const attendanceData = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 87 },
  { day: "Wed", value: 86 },
  { day: "Thu", value: 89 },
  { day: "Fri", value: 88 },
  { day: "Sat", value: 91 },
  { day: "Sun", value: 92 },
];

export default function AttendanceTrendChart({ data = attendanceData }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const width = 320;
  const height = 64;
  const paddingX = 14;
  const paddingTop = 12;
  const paddingBottom = 12;

  const minVal = Math.min(...data.map((d) => d.value)) - 2;
  const maxVal = Math.max(...data.map((d) => d.value)) + 2;

  const getX = (index) =>
    paddingX + (index / (data.length - 1)) * (width - paddingX * 2);

  const getY = (value) =>
    height -
    paddingBottom -
    ((value - minVal) / (maxVal - minVal)) * (height - paddingTop - paddingBottom);

  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value), ...d }));

  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
    }
  }

  const areaD = `${pathD} L ${points[points.length - 1]?.x},${height} L ${points[0]?.x},${height} Z`;

  return (
    <div className="relative w-full h-12 flex items-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#attendanceGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p) => {
          const isHovered = hoveredPoint?.day === p.day;
          return (
            <g key={p.day}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 5.5 : 3.5}
                className={`transition-all duration-150 cursor-pointer ${
                  isHovered
                    ? "fill-emerald-500 stroke-white stroke-2"
                    : "fill-emerald-600"
                }`}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          );
        })}
      </svg>

      {hoveredPoint && (
        <div
          className="absolute pointer-events-none -top-7 px-2 py-0.5 bg-slate-900 text-white text-[11px] font-semibold rounded shadow-md transform -translate-x-1/2 whitespace-nowrap z-20 flex items-center gap-1"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
          }}
        >
          <span>{hoveredPoint.day}:</span>
          <span className="text-emerald-400 font-bold">{hoveredPoint.value}%</span>
        </div>
      )}
    </div>
  );
}

