import Link from "next/link";
import { whatsappLink } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/my-story", label: "My Story" },
  { href: "/strategies", label: "Strategies" },
  { href: "/paper-hacks", label: "Paper Hacks" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/legal", label: "Legal" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#09090A]">
      <div className="mx-auto grid max-w-site gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <div className="flex items-center gap-1.5 font-heading text-xl font-extrabold tracking-tight text-white">
            Matric Mastery
            <span className="mb-4 h-2 w-2 rounded-full bg-accent shadow-glow" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Built for Matric, useful for all. Real strategies from a student
            who is actually sitting these papers &mdash; not a teacher, not
            an academy, just someone one paper ahead of you.
          </p>
        </div>

        <div>
          <p className="font-heading text-xs font-black uppercase tracking-wider text-muted">
            Navigation
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted transition-colors hover:text-white hover:underline underline-offset-4"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs font-black uppercase tracking-wider text-muted">
            Community
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="text-muted font-medium">Multan, Punjab</li>
            <li>
              <a
                href={whatsappLink()}
                className="text-muted transition-colors hover:text-accent font-semibold"
              >
                Message on WhatsApp &rarr;
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-muted font-mono">
        Built by a 10th Grader from Multan for Punjab Board.
      </div>
    </footer>
  );
}
