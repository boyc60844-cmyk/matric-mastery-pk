"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/utils";

export default function NewsletterForm() {
  const [name, setName] = useState("");

  function handleJoin() {
    const message = name
      ? `Bhai Matric Mastery website se aya hun, mera naam ${name} hai`
      : undefined;
    window.open(whatsappLink(message), "_blank");
  }

  return (
    <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="w-full rounded-xl border border-white/15 bg-black/40 px-5 py-3 text-sm text-white placeholder:text-muted/60 outline-none transition-colors focus:border-accent"
      />
      <button
        onClick={handleJoin}
        className="whitespace-nowrap rounded-xl bg-accent px-6 py-3 font-heading text-sm font-extrabold text-black btn-3d-yellow transition-transform cursor-pointer"
      >
        Join on WhatsApp
      </button>
    </div>
  );
}
