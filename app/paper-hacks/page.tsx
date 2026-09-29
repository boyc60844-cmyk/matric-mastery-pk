import Reveal from "@/components/Reveal";
import Card from "@/components/Card";
import { paperHacks } from "@/lib/content";
import { CheckCircle2 } from "lucide-react";

export default function PaperHacksPage() {
  return (
    <section className="mx-auto max-w-site px-5 py-16 md:py-24">
      <header className="max-w-2xl">
        <Reveal>
          <span className="font-heading text-xs font-black uppercase tracking-[0.15em] text-accent">
            Presentation
          </span>
          <h1 className="mt-3 font-heading type-title text-white">
            Paper Hacks That Actually Add Marks
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            Checkers spend an average of 90 to 120 seconds on your entire
            sheet. Presentation isn&apos;t vanity &mdash; it is the filter through
            which your knowledge is evaluated.
          </p>
        </Reveal>
      </header>

      <div className="mt-16 space-y-12">
        {paperHacks.map((hack, index) => (
          <Reveal key={hack.number} delay={index * 40}>
            <Card
              tilt={true}
              depth="hover-yellow"
              className="p-6 md:p-10 transition-all duration-300"
            >
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-3xl font-black tabular-nums text-accent">
                      {hack.number}
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <h2 className="mt-4 font-heading text-2xl font-extrabold text-white md:text-3xl">
                    {hack.title}
                  </h2>

                  <p className="mt-3.5 text-base leading-relaxed text-muted">
                    {hack.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {hack.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        <p className="text-sm leading-relaxed text-white/90 font-medium">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dark Paper Sheet Mock Visual with 3D perspective */}
                <div className="flex flex-col items-center perspective-1000">
                  <div className="relative w-full max-w-sm rounded-xl border border-white/15 bg-[#0D0D10] exam-paper-pattern p-5 shadow-2xl transition-transform duration-300 hover:rotate-1">
                    {/* Top Board Sheet Simulation */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[10px] text-muted font-mono">
                      <span>ROLL: 482910</span>
                      <span className="text-accent font-bold font-heading">BISE MULTAN</span>
                      <span>SUB: SCI</span>
                    </div>

                    {/* Sheet visual variations depending on hack */}
                    <div className="mt-4 space-y-3 font-mono text-[11px]">
                      {hack.number === "01" && (
                        <div className="border border-dashed border-accent/40 p-3 rounded bg-black/40">
                          <div className="h-2 w-24 bg-accent/60 rounded mb-2"></div>
                          <div className="h-1.5 w-full bg-white/20 rounded mb-1.5"></div>
                          <div className="h-1.5 w-5/6 bg-white/20 rounded mb-1.5"></div>
                          <div className="h-1.5 w-4/6 bg-white/20 rounded"></div>
                          <div className="mt-3 text-[9px] text-accent/90">
                            &uarr; 1.5 inch margins left &amp; right intact
                          </div>
                        </div>
                      )}

                      {hack.number === "02" && (
                        <div className="space-y-2 p-2 rounded bg-black/40">
                          <div className="inline-block border-b-2 border-accent pb-0.5 font-bold text-white text-[12px]">
                            Q.2 (i) Electrolysis Definition
                          </div>
                          <div className="h-1.5 w-full bg-white/20 rounded"></div>
                          <div className="h-1.5 w-4/5 bg-white/20 rounded"></div>
                          <div className="inline-block border-b-2 border-accent pb-0.5 font-bold text-white text-[12px] mt-2">
                            Key Condition
                          </div>
                          <div className="h-1.5 w-3/4 bg-white/20 rounded"></div>
                        </div>
                      )}

                      {hack.number === "03" && (
                        <div className="space-y-2 p-3 rounded bg-black/40">
                          <div className="text-white/80">
                            The rate of <span className="line-through text-accent font-bold">reaction</span> velocity is constant.
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            &check; Clean single line cut (no whitener / scribble)
                          </div>
                          <div className="h-1.5 w-full bg-white/20 rounded mt-2"></div>
                        </div>
                      )}

                      {hack.number === "04" && (
                        <div className="space-y-2 p-2 rounded bg-black/40">
                          <div className="text-accent font-bold text-[11px]">
                            &rarr; HEADINGS SCANNED (3 sec)
                          </div>
                          <div className="border border-white/20 rounded p-2 text-center my-1 bg-white/5">
                            <span className="text-[10px] text-accent">[Labelled Diagram Box]</span>
                          </div>
                          <div className="text-white/60 text-[10px]">
                            &rarr; Closing summary checked
                          </div>
                        </div>
                      )}

                      {hack.number === "05" && (
                        <div className="space-y-2 p-3 rounded bg-red-950/20 border border-red-500/20">
                          <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold">
                            <span>&times; Mismatched Q#</span>
                            <span>&times; Crowded Edges</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded"></div>
                          <div className="text-emerald-400 text-[10px] font-semibold mt-1">
                            &check; Fixed: Follow 10-Mark Rule
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-muted">
                      <span>PAGE 1 OF 12</span>
                      <span className="text-accent font-bold">MARKS: 75/75</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs italic text-muted font-mono">
                    What a checker sees, roughly
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
