import Image from "next/image";
import Reveal from "@/components/Reveal";
import Card from "@/components/Card";

const sections = [
  {
    heading: "The Start",
    body: "I used to write papers the way most of us do, fast, messy, and honestly kind of proud of how much I'd crammed onto one page. No margins, cut words everywhere, diagrams that looked like they were drawn during an earthquake. I genuinely thought content was the only thing that mattered.",
  },
  {
    heading: "The Reality Check",
    body: "Then my 9th class result came. Subjects I knew properly, subjects I could explain to my friends without even opening the book, came back with marks that didn't match what I actually knew. That gap between what I understood and what I scored is what got me thinking something else was going on.",
  },
  {
    heading: "What I Changed",
    body: "I started paying attention to presentation the way I used to only pay attention to content. Headings underlined properly. Diagrams given actual space and actual labels. Answers split into clear points instead of one giant paragraph. Nothing about my preparation changed. My papers just started looking like they belonged to someone who knew what they were doing.",
  },
  {
    heading: "Why I Made This Website",
    body: "Because I had to figure all of this out the hard way, mostly by comparing my checked papers with toppers' papers and asking a lot of annoying questions to seniors. If one junior reads this and skips even one of my mistakes, that's the whole point of Matric Mastery.",
  },
];

export default function MyStoryPage() {
  return (
    <section className="mx-auto max-w-site px-5 py-16 md:py-24">
      <Reveal>
        <p className="font-heading text-xs font-black uppercase tracking-[0.15em] text-accent">
          My Story
        </p>
        <h1 className="mt-3 max-w-2xl font-heading type-title text-white">
          I Am Not A Topper. I Just Stopped Making Silly Mistakes.
        </h1>
      </Reveal>

      <div className="mt-14 grid gap-14 md:grid-cols-[1fr_340px]">
        <div className="max-w-prose space-y-12">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 60}>
              <div className="border-l-2 border-accent/60 pl-5">
                <h2 className="font-heading text-xl font-bold text-white">
                  {s.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <aside className="space-y-6">
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-soft">
              <Image
                src="https://picsum.photos/seed/matric-my-story/700/800"
                alt="Student studying at a desk"
                width={700}
                height={800}
                className="h-full w-full object-cover grayscale-[20%] contrast-[1.05]"
              />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <Card tilt={false} depth="yellow" className="bg-[#121214] border-accent/40 p-6">
              <p className="font-heading text-base font-bold italic leading-relaxed text-white">
                &ldquo;I didn't need a new brain. I needed a checker's
                eyes.&rdquo;
              </p>
              <p className="mt-2 text-xs font-mono text-accent">
                &mdash; Hamza, Multan
              </p>
            </Card>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
