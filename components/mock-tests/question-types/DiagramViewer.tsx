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

        {diagramId === "logic_gate_circuit" && (
          <g stroke="#E4E4E7" strokeWidth="1.6" fill="#141418">
            {/* Inputs A, B, C */}
            <text x="26" y="65" fill="#FFD60A" fontSize="11" fontFamily="monospace" fontWeight="bold" stroke="none">
              A
            </text>
            <line x1="42" y1="61" x2="108" y2="61" />
            <text x="26" y="90" fill="#FFD60A" fontSize="11" fontFamily="monospace" fontWeight="bold" stroke="none">
              B
            </text>
            <line x1="42" y1="86" x2="108" y2="86" />

            {/* AND Gate centered around x=135, y=74 */}
            <path d="M 108 50 L 136 50 A 24 24 0 0 1 136 98 L 108 98 Z" fill="#16161C" stroke="#38BDF8" strokeWidth="1.8" />
            <text x="128" y="59" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace" stroke="none">
              AND
            </text>

            {/* Input C -> NOT Gate centered around x=135, y=174 */}
            <text x="26" y="178" fill="#FFD60A" fontSize="11" fontFamily="monospace" fontWeight="bold" stroke="none">
              C
            </text>
            <line x1="42" y1="174" x2="112" y2="174" />
            <polygon points="112,154 112,194 150,174" fill="#16161C" stroke="#34D399" strokeWidth="1.8" />
            <circle cx="155" cy="174" r="4.5" fill="#0B0B0E" stroke="#34D399" strokeWidth="1.8" />

            {/* Connections into OR Gate at x=255, y=120 */}
            <polyline points="160,74 195,74 195,108 232,108" fill="none" />
            <polyline points="160,174 195,174 195,132 232,132" fill="none" />

            {/* OR Gate centered around x=255, y=120 */}
            <path d="M 226 92 Q 242 120 226 148 Q 266 148 286 120 Q 266 92 226 92 Z" fill="#16161C" stroke="#A78BFA" strokeWidth="1.8" />
            <text x="255" y="103" textAnchor="middle" fill="#C4B5FD" fontSize="8" fontFamily="monospace" stroke="none">
              OR
            </text>

            {/* Output F at x=350, y=120 */}
            <line x1="286" y1="120" x2="365" y2="120" />
            <text x="376" y="124" fill="#FFD60A" fontSize="11" fontFamily="monospace" fontWeight="bold" stroke="none">
              F
            </text>
          </g>
        )}

        {diagramId === "series_parallel_resistors" && (
          <g stroke="#E4E4E7" strokeWidth="1.6" fill="none">
            {/* Outer loop & battery */}
            <polyline points="60,185 60,70 110,70" />
            <polyline points="340,70 340,185 215,185" />
            <polyline points="185,185 60,185" />
            {/* Battery symbol */}
            <line x1="185" y1="172" x2="185" y2="198" stroke="#FFD60A" strokeWidth="2.4" />
            <line x1="215" y1="178" x2="215" y2="192" stroke="#FFD60A" strokeWidth="1.8" />
            <text x="200" y="216" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace" stroke="none">
              DC Source (V)
            </text>

            {/* Series resistor R1 */}
            <polyline points="110,70 118,58 128,82 138,58 148,82 158,58 166,70" stroke="#38BDF8" strokeWidth="1.8" />
            <text x="138" y="48" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" stroke="none">
              R₁ (Series)
            </text>

            {/* Parallel split junction */}
            <line x1="166" y1="70" x2="205" y2="70" />
            <circle cx="205" cy="70" r="3" fill="#FFD60A" stroke="none" />
            <line x1="205" y1="45" x2="205" y2="95" />
            <line x1="205" y1="45" x2="232" y2="45" />
            <line x1="205" y1="95" x2="232" y2="95" />

            {/* Top branch R2 */}
            <polyline points="232,45 240,35 250,55 260,35 270,55 280,35 288,45" stroke="#34D399" strokeWidth="1.8" />
            <text x="260" y="26" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" stroke="none">
              R₂
            </text>

            {/* Bottom branch R3 */}
            <polyline points="232,95 240,85 250,105 260,85 270,105 280,85 288,95" stroke="#34D399" strokeWidth="1.8" />
            <text x="260" y="122" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" stroke="none">
              R₃
            </text>

            {/* Rejoin junction */}
            <line x1="288" y1="45" x2="315" y2="45" />
            <line x1="288" y1="95" x2="315" y2="95" />
            <line x1="315" y1="45" x2="315" y2="95" />
            <circle cx="315" cy="70" r="3" fill="#FFD60A" stroke="none" />
            <line x1="315" y1="70" x2="340" y2="70" />
          </g>
        )}

        {diagramId === "concave_mirror_ray" && (
          <g fill="none">
            {/* Principal axis */}
            <line x1="30" y1="130" x2="365" y2="130" stroke="#71717A" strokeWidth="1.4" strokeDasharray="4 3" />
            {/* Concave spherical mirror curve */}
            <path d="M 315 35 Q 345 130 315 215" stroke="#38BDF8" strokeWidth="2.8" />
            {/* Back hatching */}
            <g stroke="#52525B" strokeWidth="1">
              {[50, 75, 100, 125, 150, 175, 200].map((y) => (
                <line key={y} x1="330" y1={y} x2="340" y2={y - 8} />
              ))}
            </g>
            {/* Optical markers C, F, P */}
            <circle cx="155" cy="130" r="3" fill="#FFD60A" />
            <text x="155" y="148" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace">
              C
            </text>
            <circle cx="242" cy="130" r="3" fill="#FFD60A" />
            <text x="242" y="148" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace">
              F
            </text>
            <text x="342" y="145" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="monospace">
              P
            </text>
            {/* Object beyond C */}
            <line x1="95" y1="130" x2="95" y2="72" stroke="#E4E4E7" strokeWidth="2" />
            <polygon points="95,66 90,76 100,76" fill="#E4E4E7" />
            {/* Parallel incident ray -> reflects through F */}
            <line x1="95" y1="72" x2="327" y2="72" stroke="#34D399" strokeWidth="1.6" />
            <line x1="327" y1="72" x2="185" y2="176" stroke="#34D399" strokeWidth="1.6" />
            {/* Ray through C reflects back */}
            <line x1="95" y1="72" x2="320" y2="180" stroke="#F59E0B" strokeWidth="1.4" strokeDasharray="3 2" />
            {/* Real inverted image between C and F */}
            <line x1="202" y1="130" x2="202" y2="164" stroke="#F87171" strokeWidth="2" />
            <polygon points="202,169 197,159 207,159" fill="#F87171" />
          </g>
        )}

        {diagramId === "plant_cell_organelles" && (
          <g fill="none">
            {/* Rigid hexagonal cell wall */}
            <polygon
              points="75,45 140,22 265,22 330,45 352,120 330,195 265,218 140,218 75,195 52,120"
              stroke="#34D399"
              strokeWidth="2.8"
              fill="#0E1712"
            />
            {/* Plasma membrane */}
            <polygon
              points="83,52 144,30 260,30 321,52 342,120 321,188 260,210 144,210 83,188 62,120"
              stroke="#6EE7B7"
              strokeWidth="1.1"
              strokeDasharray="3 2"
            />
            {/* Large central vacuole */}
            <path
              d="M 150 75 Q 210 62 275 82 Q 305 118 280 162 Q 215 178 155 155 Q 130 115 150 75 Z"
              fill="#111C28"
              stroke="#38BDF8"
              strokeWidth="1.6"
            />
            {/* Nucleus */}
            <circle cx="112" cy="112" r="24" fill="#1F162A" stroke="#A78BFA" strokeWidth="1.8" />
            <circle cx="112" cy="112" r="7" fill="#C4B5FD" />
            {/* Chloroplasts */}
            <ellipse cx="290" cy="60" rx="18" ry="9" fill="#14532D" stroke="#4ADE80" strokeWidth="1.5" />
            <ellipse cx="220" cy="190" rx="18" ry="9" fill="#14532D" stroke="#4ADE80" strokeWidth="1.5" />
            {/* Mitochondrion */}
            <ellipse cx="122" cy="176" rx="16" ry="8" fill="#431407" stroke="#FB923C" strokeWidth="1.5" />
          </g>
        )}

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
