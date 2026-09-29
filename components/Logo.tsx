"use client";

import React from "react";

export interface LogoProps {
  size?: "sm" | "nav" | "lg" | "200";
  hideText?: boolean;
  inverted?: boolean; // for inverted theme (e.g., black block on yellow bg)
  className?: string;
  animate?: boolean;
}

export default function Logo({
  size = "nav",
  hideText = false,
  inverted = false,
  className = "",
  animate = true,
}: LogoProps) {
  const is200 = size === "200";
  const isSm = size === "sm";

  // 200px Large Display Dimensions vs Nav Dimensions
  const blockDimensions = is200
    ? "w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]"
    : isSm
    ? "w-7 h-7"
    : "w-8 h-8 md:w-10 md:h-10";

  const blockBorder = is200
    ? "border-[6px] rounded-[28px] sm:rounded-[34px]"
    : isSm
    ? "border-2 rounded-[8px]"
    : "border-[2.5px] md:border-[3px] rounded-[10px]";

  const fontSize = is200
    ? "text-8xl sm:text-9xl"
    : isSm
    ? "text-sm"
    : "text-base md:text-xl";

  const mainBg = inverted ? "bg-[#0A0A0A]" : "bg-[#FFD60A]";
  const textColor = inverted ? "text-[#FFD60A]" : "text-black";
  const rightBg = inverted ? "bg-[#181818]" : "bg-[#CCAA00]";
  const bottomBg = inverted ? "bg-[#101010]" : "bg-[#997F00]";
  const borderColor = inverted ? "border-black" : "border-black";

  // Box shadow with hard black brutalist cut + warm yellow ambient aura
  const boxShadow = is200
    ? "14px 14px 0px #000000, 0 0 50px rgba(255,214,10,0.55)"
    : "5px 5px 0px #000000, 0 0 30px rgba(255,214,10,0.45)";

  const rightThickness = is200 ? "w-[24px] sm:w-[28px]" : "w-[6px] md:w-[8px]";
  const bottomThickness = is200 ? "h-[24px] sm:h-[28px]" : "h-[6px] md:h-[8px]";

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Isometric M-Block */}
      <div
        className={`relative ${blockDimensions} preserve-3d transition-transform duration-150 active:scale-95 cursor-pointer will-change-transform ${
          animate ? "logo-float3d" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Right 3D Thickness Side */}
        <div
          className={`absolute top-0 -right-[6px] md:-right-[8px] h-full ${rightThickness} ${rightBg} border-y-2 border-r-2 md:border-y-[3px] md:border-r-[3px] ${borderColor} origin-left pointer-events-none`}
          style={{
            transform: "skewY(-45deg) translateZ(-6px)",
            borderRadius: is200 ? "0 14px 14px 0" : "0 4px 4px 0",
          }}
          aria-hidden="true"
        />

        {/* Bottom 3D Thickness Side */}
        <div
          className={`absolute -bottom-[6px] md:-bottom-[8px] left-0 w-full ${bottomThickness} ${bottomBg} border-x-2 border-b-2 md:border-x-[3px] md:border-b-[3px] ${borderColor} origin-top pointer-events-none`}
          style={{
            transform: "skewX(-45deg) translateZ(-6px)",
            borderRadius: is200 ? "0 0 14px 14px" : "0 0 4px 4px",
          }}
          aria-hidden="true"
        />

        {/* Main Face */}
        <div
          className={`relative z-10 flex h-full w-full items-center justify-center ${blockBorder} ${mainBg} ${borderColor} font-heading font-black ${textColor} ${fontSize} shadow-md`}
          style={{
            transform: is200 ? "translateZ(30px)" : "translateZ(20px)",
            boxShadow,
          }}
        >
          <span>M</span>

          {/* Micro 3D Top-Right Specular Flare */}
          <span
            className="absolute top-1 right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white opacity-80 pointer-events-none"
            style={{ transform: "translateZ(10px)" }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Brand Typography Beside Icon */}
      {!hideText && !is200 && (
        <div
          className="flex items-baseline gap-1.5 font-heading tracking-tight"
          style={{
            transform: "translateZ(10px)",
            transformStyle: "preserve-3d",
          }}
        >
          <span className="text-[15px] sm:text-[18px] font-medium text-white tracking-tight">
            Matric
          </span>
          <span
            className="text-[18px] sm:text-[22px] font-extrabold text-[#FFD60A] tracking-tight uppercase"
            style={{
              textShadow: "2px 2px 0px #000000",
            }}
          >
            MASTERY
          </span>
        </div>
      )}
    </div>
  );
}
