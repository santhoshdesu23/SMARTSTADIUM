"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StadiumMapProps {
  className?: string;
  highlightZone?: string;
}

const zones = [
  { id: "north", label: "North Stand", x: 25, y: 10, w: 50, h: 20, status: "busy" },
  { id: "south", label: "South Stand", x: 25, y: 70, w: 50, h: 20, status: "critical" },
  { id: "east", label: "East Stand", x: 75, y: 30, w: 20, h: 40, status: "normal" },
  { id: "west", label: "West Stand", x: 5, y: 30, w: 20, h: 40, status: "normal" },
  { id: "field", label: "Pitch", x: 30, y: 35, w: 40, h: 30, status: "normal" },
];

const statusFill: Record<string, string> = {
  normal: "rgba(34,197,94,0.3)",
  busy: "rgba(245,158,11,0.4)",
  critical: "rgba(239,68,68,0.5)",
};

export function StadiumMap({ className, highlightZone }: StadiumMapProps) {
  return (
    <Card className={cn("glass overflow-hidden", className)}>
      <CardContent className="p-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full"
          role="img"
          aria-labelledby="stadium-map-title stadium-map-desc"
          aria-describedby="stadium-map-legend"
        >
          <title id="stadium-map-title">Stadium occupancy map</title>
          <desc id="stadium-map-desc">A simplified map of stadium zones showing current occupancy and key gate locations.</desc>
          <rect x="2" y="2" width="96" height="96" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
          {zones.map((zone, i) => (
            <motion.g
              key={zone.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx="2"
                fill={zone.id === "field" ? "rgba(34,197,94,0.15)" : statusFill[zone.status]}
                stroke={highlightZone === zone.id ? "#3b82f6" : "rgba(255,255,255,0.15)"}
                strokeWidth={highlightZone === zone.id ? "0.8" : "0.3"}
              />
              <text
                x={zone.x + zone.w / 2}
                y={zone.y + zone.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="3"
              >
                {zone.label}
              </text>
            </motion.g>
          ))}
          {/* Gates */}
          {[
            { x: 50, y: 5, label: "A" },
            { x: 50, y: 95, label: "E" },
            { x: 95, y: 50, label: "C" },
            { x: 5, y: 50, label: "D" },
          ].map((gate) => (
            <circle
              key={gate.label}
              cx={gate.x}
              cy={gate.y}
              r="2"
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="0.3"
            />
          ))}
        </svg>
        <div id="stadium-map-legend" className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" /> Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warning" /> Busy
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Critical
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
