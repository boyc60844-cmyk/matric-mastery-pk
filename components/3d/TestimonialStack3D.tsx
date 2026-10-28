"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, MapPin, Quote, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface Testimonial {
  id: string;
  name: string;
  board: string;
  score: string;
  improvement: string;
  quote: string;
  subject: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Usman Raza",
    board: "BISE Multan · SSC-II 2024",
    score: "1064 / 1100",
    improvement: "+82 marks increase",
    quote:
      "The 1.5\" margin rule and boxing the final answers changed everything. My Physics checker gave me 59/60 because the numerical Given-ToFind blocks looked clean in the first 10 seconds.",
    subject: "Physics & Chemistry",
  },
  {
    id: "t2",
    name: "Ayesha Noor",
    board: "BISE Lahore · SSC-II 2024",
    score: "1078 / 1100",
    improvement: "+95 marks increase",
    quote:
      "I was panicking in Math short questions. Hamza's 3-hour formula gave me 20 spare minutes at the end. That saved me from losing 6 marks on an inverted matrix question I caught!",
    subject: "Mathematics SSC-II",
  },
  {
    id: "t3",
    name: "Bilal Tariq",
    board: "BISE Faisalabad · SSC-I 2024",
    score: "505 / 550",
    improvement: "+45 marks increase",
    quote:
      "No coaching center teaches how board checking really happens. Matric Mastery gave me the confidence that I don't need expensive evening academies to get an A+.",
    subject: "Biology & English",
  },
];

export default function TestimonialStack3D() {
  const { isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="relative w-full max-w-full min-w-0 border-t border-white/10 bg-[#08080b] py-20 sm:py-28 overflow-hidden">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute bottom-1/4 left-1/3 -z-10 h-[400px] w-[500px] max-w-full rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.08)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[11px] font-bold text-accent uppercase tracking-wider mb-3">
              <Award size={13} />
              <span>Real Punjab Board Results</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Verified Student{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#ffe570] to-[#c9a66b]">
                Success Stories
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous story"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:border-accent/40 hover:bg-accent hover:text-black transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next story"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:border-accent/40 hover:bg-accent hover:text-black transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 3D Depth Card Stack */}
        <div className="relative mx-auto max-w-4xl" style={{ perspective: 1200 }}>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    transform: isSelected
                      ? "translateZ(25px) scale(1.02)"
                      : "translateZ(0px) scale(0.97)",
                    transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-6 sm:p-7 backdrop-blur-xl cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "border-accent/50 bg-[#121216] shadow-brutalist-yellow"
                      : "border-white/10 bg-[#0d0d10]/75 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="rounded-md bg-accent/15 border border-accent/30 px-2 py-0.5 font-mono text-[11px] font-bold text-accent">
                        {item.score}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">
                        {item.improvement}
                      </span>
                    </div>

                    <Quote size={24} className="text-accent/40 mt-4 mb-2" />

                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <h4 className="font-heading text-sm font-bold text-white">
                      {item.name}
                    </h4>
                    <p className="font-mono text-[11px] text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-accent" />
                      <span>{item.board}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
