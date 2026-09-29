"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/utils";
import Button from "./Button";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [question, setQuestion] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = `Bhai Matric Mastery website se aya hun.
Name: ${name}
Class: ${studentClass}
Question: ${question}`;
    window.open(whatsappLink(message), "_blank");
  }

  const inputClasses =
    "w-full rounded-xl border border-border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="contact-name" className="sr-only">
          Your name
        </label>
        <input
          id="contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="contact-class" className="sr-only">
          Your class
        </label>
        <input
          id="contact-class"
          required
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          placeholder="Your class (9th / 10th)"
          className={inputClasses}
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="contact-question" className="sr-only">
          Your question
        </label>
        <textarea
          id="contact-question"
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Your question"
          rows={3}
          className={inputClasses}
        />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" variant="primary">
          Send On WhatsApp
        </Button>
      </div>
    </form>
  );
}
