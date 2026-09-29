"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { StrategyArticle } from "@/lib/content";
import Card from "./Card";

interface ArticleCardProps {
  article: StrategyArticle;
  href: string;
  onTagClick?: (tag: string) => void;
  activeTag?: string;
}

export default function ArticleCard({ article, href, onTagClick, activeTag }: ArticleCardProps) {
  return (
    <Link href={href} className="group block h-full preserve-3d">
      <Card
        tilt={true}
        depth="hover-yellow"
        className="flex h-full flex-col overflow-hidden !p-0 transition-all duration-300 group-hover:border-accent/40"
      >
        {/* Card Visual Layer with Parallax on Hover */}
        <div className="relative h-44 w-full overflow-hidden bg-black/50 preserve-3d">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover grayscale-[15%] contrast-[1.05] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />

          {/* Floating Category and Time Badge (Z = 35) */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs"
          >
            <span className="rounded-lg bg-black/85 px-2.5 py-1 font-heading text-[11px] font-black tracking-wider text-accent border border-accent/40 shadow-sm backdrop-blur-md uppercase">
              {article.tag}
            </span>
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-white/80 font-mono text-[11px] backdrop-blur-sm">
              {article.readTime}
            </span>
          </div>

          {/* Micro paper sheet cue in corner */}
          <div
            style={{ transform: "translateZ(20px)" }}
            className="absolute top-3 right-3 rounded-md bg-black/70 p-1 text-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <BookOpen size={12} className="text-accent" />
          </div>
        </div>

        {/* Card Content Layer (Z = 20) */}
        <div
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
          className="flex flex-1 flex-col p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-bold leading-snug text-white transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5">
              {article.title}
            </h3>
            <div
              style={{ transform: "translateZ(30px)" }}
              className="shrink-0 rounded-lg p-1 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:bg-accent/10"
            >
              <ArrowUpRight size={17} />
            </div>
          </div>

          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
            {article.description}
          </p>

          {/* Tags list */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5" style={{ transform: "translateZ(25px)" }}>
              {article.tags.slice(0, 4).map((t) => {
                const isTagActive = activeTag && activeTag.toLowerCase() === t.toLowerCase();
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onTagClick) {
                        onTagClick(t);
                      } else if (typeof window !== "undefined") {
                        window.location.href = `/strategies?tag=${encodeURIComponent(t)}`;
                      }
                    }}
                    title={`Filter by #${t}`}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
                      isTagActive
                        ? "bg-accent text-black font-bold border border-accent shadow-sm"
                        : "bg-white/5 text-muted/80 hover:bg-accent/20 hover:text-accent hover:border-accent/30 border border-white/5"
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-muted font-mono">
            <span>By {article.author}</span>
            <span className="text-white/60">{article.date}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
