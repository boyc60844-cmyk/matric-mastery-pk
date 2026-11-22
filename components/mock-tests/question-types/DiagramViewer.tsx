"use client";

import React from "react";
import { DiagramPin, DiagramTemplateId } from "@/lib/mock-tests/types";

interface DiagramViewerProps {
  diagramId: DiagramTemplateId;
  caption: string;
  pins: DiagramPin[];
  selectedLabels?: Record<string, string>;
}

export function DiagramViewer({
  diagramId,
  caption,
  pins,
  selectedLabels,
}: DiagramViewerProps) {
  return (
    <figure className="rounded-xl border border-white/10 bg-[#09090B] p-3 sm:p-4">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-[520px] mx-auto h-auto select-none"
        role="img"
        aria-label={caption}
      >
        {/* Dark technical grid backdrop */}
        <rect x="0" y="0" width="400" height="240" rx="10" fill="#0B0B0E" />
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="240" />
          ))}
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} />
          ))}
        </g>

        {diagramId === "flowchart_loop" && (
          <g stroke="#E4E4E7" strokeWidth="1.6" fill="#141418">
            {/* Step 1 Box */}
            <rect x="135" y="18" width="130" height="32" rx="4" />
            <text x="200" y="38" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace" stroke="none">
              Step A: int i = 0;
            </text>
            <line x1="200" y1="50" x2="200" y2="70" />
            <polygon points="196,65 204,65 200,72" fill="#E4E4E7" stroke="none" />

            {/* Step 2 Diamond */}
            <polygon points="200,72 265,102 200,132 135,102" />
            <text x="200" y="105" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace" stroke="none">
              i &lt; 5 ?
            </text>

            {/* True Branch right -> Step 3 */}
            <line x1="265" y1="102" x2="315" y2="102" />
            <line x1="315" y1="102" x2="315" y2="136" />
            <text x="290" y="96" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace" stroke="none">
              TRUE
            </text>
            <rect x="255" y="138" width="120" height="40" rx="4" />
            <text x="315" y="162" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace" stroke="none">
              Statements + i++
            </text>
            {/* Loop back */}
            <line x1="315" y1="178" x2="315" y2="210" />
            <line x1="315" y1="210" x2="225" y2="210" />
            <line x1="225" y1="210" x2="225" y2="122" strokeDasharray="3 3" />

            {/* False Branch left -> Step 4 */}
            <line x1="135" y1="102" x2="92" y2="102" />
            <line x1="92" y1="102" x2="92" y2="180" />
            <text x="110" y="96" textAnchor="middle" fill="#F87171" fontSize="9" fontFamily="monospace" stroke="none">
              FALSE
            </text>
            <rect x="42" y="182" width="100" height="32" rx="16" />
            <text x="92" y="202" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace" stroke="none">
              Continue After
            </text>
          </g>
        )}

        {diagramId === "pendulum_shm" && (
          <g>
            {/* Ceiling */}
            <line x1="110" y1="26" x2="290" y2="26" stroke="#E4E4E7" strokeWidth="3" />
            {/* Vertical dashed center */}
            <line x1="200" y1="26" x2="200" y2="200" stroke="#71717A" strokeWidth="1.2" strokeDasharray="4 4" />
            {/* Extreme Left */}
            <line x1="200" y1="26" x2="112" y2="158" stroke="#A1A1AA" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="112" cy="158" r="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.8" />
            <text x="112" y="184" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
              A (Extreme)
            </text>
            {/* Mean Bottom */}
            <circle cx="200" cy="186" r="15" fill="#1C1917" stroke="#FFD60A" strokeWidth="2" />
            <text x="200" y="218" textAnchor="middle" fill="#FFD60A" fontSize="10" fontFamily="monospace">
              O (Mean)
            </text>
            {/* Extreme Right */}
            <line x1="200" y1="26" x2="288" y2="158" stroke="#E4E4E7" strokeWidth="2" />
            <circle cx="288" cy="158" r="14" fill="#1E293B" stroke="#E4E4E7" strokeWidth="1.8" />
            <text x="288" y="184" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
              B (Extreme)
            </text>
            {/* Force arrow pointing inward from right bob */}
            <line x1="274" y1="145" x2="235" y2="165" stroke="#34D399" strokeWidth="2" />
            <polygon points="233,166 242,167 238,159" fill="#34D399" />
          </g>
        )}

        {/* Render interactive numbered pins */}
        {pins.map((pin) => {
          const isLabeled = Boolean(selectedLabels?.[pin.id]);
          return (
            <g key={pin.id} transform={`translate(${pin.x}, ${pin.y})`}>
              <circle
                r="11"
                fill={isLabeled ? "#FFD60A" : "#18181B"}
                stroke={isLabeled ? "#FFD60A" : "#FFD60A"}
                strokeWidth="2"
              />
              <text
                y="3.5"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
                fill={isLabeled ? "#0A0A0A" : "#FFD60A"}
              >
                {pin.marker}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2.5 text-center text-xs font-mono text-zinc-400">
        {caption}
      </figcaption>
    </figure>
  );
}
