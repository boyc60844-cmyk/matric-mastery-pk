import Image from "next/image";
import { Youtube, PenLine } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { youtubeChannels } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";

const timetables = [
  {
    title: "The 40-Day Final Prep Timetable",
    desc: "For when the papers are close and you need a subject-by-subject daily split.",
    image: "https://picsum.photos/seed/matric-timetable-1/700/400",
  },
  {
    title: "The Weekend Revision Template",
    desc: "A lighter two-day structure for regular weekend revision through the year.",
    image: "https://picsum.photos/seed/matric-timetable-2/700/400",
  },
];

const stationery = [
  "0.5mm black gel pen for main writing, it doesn't blot on cheap paper.",
  "A separate blue pen only for underlining headings, never for writing answers.",
  "A proper scale for diagrams, not the broken 6-inch one from your bag's side pocket.",
  "A sharp pencil for rough diagrams before you ink them in.",
];

export default function ResourcesPage() {
  return (
    <section className="mx-auto max-w-site px-5 py-16 md:py-24">
      <Reveal>
        <p className="font-heading text-xs font-black uppercase tracking-[0.15em] text-accent">
          Resources
        </p>
        <h1 className="mt-3 font-heading type-title text-white">
          My Personal Resource List
        </h1>
      </Reveal>

      {/* Past papers */}
      <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="font-heading text-2xl font-extrabold text-white">Past Papers</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Honestly, the fastest way in Multan is still the stationery shops
            near Lohari Gate and around your own school's market. Most of
            them keep the last 5 to 8 years sorted by subject, and they're
            usually cheaper than printing them yourself.
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            If you're not in Multan, ask your school stationery shop first,
            almost every board-city has an equivalent of Lohari Gate. Solved
            past papers from the board's own website work too, just less
            organised.
          </p>
          <div className="mt-7">
            <Button
              href={whatsappLink("Bhai past paper list chahiye")}
              variant="whatsapp"
            >
              Get Past Paper List on WhatsApp
            </Button>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-soft">
            <Image
              src="https://picsum.photos/seed/matric-past-papers/700/500"
              alt="Exam papers stacked on a desk"
              width={700}
              height={500}
              className="h-full w-full object-cover grayscale-[15%] contrast-[1.05]"
            />
          </div>
        </Reveal>
      </div>

      {/* Timetable templates */}
      <div className="mt-24">
        <SectionHeading title="Timetable Templates" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {timetables.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <Card depth="hover-yellow" className="overflow-hidden !p-0">
                <div className="relative h-44 w-full">
                  <Image
                    src={t.image}
                    alt={t.title}
                    fill
                    className="object-cover grayscale-[15%] contrast-[1.05]"
                  />
                </div>
                <div className="p-6">
                  <p className="font-heading text-lg font-bold text-white">{t.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{t.desc}</p>
                  <div className="mt-5">
                    <Button
                      href={whatsappLink(`Bhai ${t.title} chahiye`)}
                      variant="secondary"
                      className="text-xs !py-2.5"
                    >
                      Download on WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      {/* YouTube channels */}
      <div className="mt-24">
        <SectionHeading title="YouTube Channels I Actually Watch" />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {youtubeChannels.map((ch, i) => (
            <Reveal key={ch.name} delay={i * 80}>
              <Card depth="hover-yellow" className="h-full">
                <div className="inline-flex rounded-xl bg-accent/10 border border-accent/20 p-2.5 text-accent">
                  <Youtube size={24} strokeWidth={2} />
                </div>
                <p className="mt-4 font-heading text-lg font-bold text-white">{ch.name}</p>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{ch.why}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Stationery kit */}
      <div className="mt-24">
        <SectionHeading
          title="My Stationery Kit"
          description="Nothing expensive here. Just the stuff that actually keeps a paper looking neat for three hours straight."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stationery.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="flex gap-3.5 rounded-2xl border border-white/10 card-surface p-5 text-sm text-white/90 shadow-soft">
                <PenLine size={19} className="mt-0.5 shrink-0 text-accent" />
                <span className="leading-relaxed">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
