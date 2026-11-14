// lib/ai.ts
// Matric Mastery AI — Educational Doubt Solver Engine
// Powered by Cloudflare Workers AI with Free-First student safeguards.

import { AI_IMAGE_INPUT_ENABLED, sendAIMessage, getWorkerEndpoint } from "./aiClient";

export type LanguageMode = "english" | "urdu";

export interface AIHistoryEntry {
  q: string;
  a: string;
  time: number;
}

export interface UploadedImageData {
  mimeType: string;
  base64: string;
  previewUrl: string;
}

export const SYSTEM_PROMPT = `You are Matric Mastery AI - Pakistan's best teacher for Class 9-10 Punjab Boards (BISE Multan, Lahore, Gujranwala, Faisalabad, Sargodha, Rawalpindi, Bahawalpur, DG Khan, Sahiwal) & FBISE. MISSION: Answer LITERALLY EVERYTHING - Math, Physics, Chemistry, Biology, Computer, English, Urdu, Islamiyat, Pak Studies, Past Papers, Study Tips, Career Guidance, Motivation, Jokes, General Knowledge. RULES: 1. Language: Follow dropdown value. If English, simple English. If Urdu, Roman Urdu + English keywords like Beta, Ohm's Law ka matlab hai... 2. Format: Start with Direct Answer: in bold 1 line, then Explain Like I'm in Class 9: simple explanation, then Formula/Steps if needed with proper formatting, then Example, then Exam Tip: Yeh sawal me a chuka hai - ratta laga lo, end with 1 follow-up question. 3. If image uploaded, OCR and solve fully. 4. If non-study question, answer friendly then bring back: Haha... chalo ab wapas Physics pe aate hain! 5. Never say As an AI. You are Matric Mastery AI senior bhai. 6. Never refuse. Answer everything safe and educational. 7. Max 250 words unless derivation needed. 8. Use markdown bold, bullets, tables.`;

const HISTORY_KEY = "matric_ai_history";

// Educational notice displayed when Cloudflare Workers AI backend is awaiting deployment
function getOfflineEducationalNotice(lang: LanguageMode, hasImage: boolean): string {
  if (lang === "urdu") {
    return `### ℹ️ میٹرک ماسٹری AI نوٹس (Notice)

**Matric Mastery AI اسٹینڈ الون پریویو موڈ میں ہے۔**

لائیو کلاؤڈ فلائر ورکرز AI (Cloudflare Workers AI) ماڈل انفرینس اور کیمرہ امیج انالیسس کے لیے ایڈلٹ سپروائزڈ ڈپلائمنٹ درکار ہے۔${
  hasImage ? "\n\n⚠️ **Image OCR Notice:** کتاب کی تصویری ڈایاگرام سے سوال حل کرنے کے لیے ایکٹیو ورکر سروس ضروری ہے۔" : ""
}

**طلباء کے لیے فوری اور مفت تعلیمی ذرائع:**
- 📖 **[Study Strategies](/strategies)** — کلاس 9 اور 10 کے ٹاپرز کے منظور شدہ اسٹڈی پلینز اور چیپٹر ریویژن روڈ میپس۔
- ✍️ **[Paper Presentation Hacks](/paper-hacks)** — پنجاب بورڈ کے 605 مارکر پریزنٹیشن کے رہنما اصول اور پیپر حل کرنے کے طریقے کار۔
- 📚 **[Past Papers](/past-papers)** — تمام پنجاب بورڈز اور فیڈرل بورڈ کے حل شدہ سابقہ پرچہ جات۔
- 💬 **Student WhatsApp Group** — سینئر طلباء اور اساتذہ سے سوالات پوچھنے کے لیے واٹس ایپ کمیونٹی۔

*رہنمائی: مکمل ڈیسک ٹاپ ورک اسپیس کے لیے اوپر دیے گئے "Full Page" لنک سے [/ai](/ai) ملاحظہ کریں۔*`;
  }

  return `### ℹ️ Matric Mastery AI Notice

**Matric Mastery AI is currently running in Standalone Preview Mode.**

Live text problem solving via **Cloudflare Workers AI** (\`@cf/meta/llama-3.1-8b-instruct-fast\`) requires adult-supervised deployment with \`VITE_AI_WORKER_URL\`. Multimodal image analysis (\`@cf/meta/llama-3.2-11b-vision-instruct\`) remains separated and paused pending parent/guardian license acceptance.${
    hasImage ? "\n\n⚠️ **Image OCR Notice:** Direct textbook diagram analysis requires adult Meta license approval and active backend configuration." : ""
  }

To protect student privacy and ensure 100% free access without credit card requirements, automated inference is paused outside the connected worker.

**Recommended Free Educational Alternatives for Your Preparation:**
- 📖 **[Study Strategies](/strategies)** — Complete chapter-by-chapter revision schedules and topper routines for Class 9 & 10.
- ✍️ **[Paper Presentation Hacks](/paper-hacks)** — Board-verified marker techniques, margin rules, and 605 heading templates.
- 📚 **[Past Papers](/past-papers)** — Solved past papers across all Punjab Boards and FBISE.
- 💬 **Student WhatsApp Community** — Connect directly with senior matric mentors and peer study groups.

*Tip: Visit the dedicated [/ai](/ai) workspace to explore full infrastructure settings and export options.*`;
}

// 100% Truthful Solver: Connects to Workers AI backend when configured; streams educational guidance when unconfigured
export async function streamSolveWithAI({
  question,
  language,
  uploadedImage,
  onChunk,
}: {
  question: string;
  language: LanguageMode;
  uploadedImage?: UploadedImageData | null;
  onChunk: (text: string) => void;
}): Promise<string> {
  const activeImage = AI_IMAGE_INPUT_ENABLED ? uploadedImage || null : null;
  const userText =
    question.trim() ||
    (activeImage ? "Solve this question in image completely step by step." : "");
  if (!userText && !activeImage) {
    throw new Error("Please enter a text question.");
  }
  const workerUrl = getWorkerEndpoint();

  // If Cloudflare Worker backend is configured, invoke live streaming inference
  if (workerUrl) {
    try {
      const response = await sendAIMessage({
        messages: [
          {
            id: `doubt-${Date.now()}`,
            role: "user",
            content: userText,
            timestamp: Date.now(),
            image: activeImage
              ? {
                  previewUrl: activeImage.previewUrl,
                  mimeType: activeImage.mimeType,
                  base64: activeImage.base64,
                }
              : undefined,
          },
        ],
        image: activeImage
          ? { mimeType: activeImage.mimeType, base64: activeImage.base64 }
          : null,
        language: language === "urdu" ? "ur" : "en",
        onChunk,
      });

      return response;
    } catch (err: any) {
      // If error is other than UNCONFIGURED, rethrow so UI can offer retry
      if (err?.code !== "UNCONFIGURED") {
        throw err;
      }
    }
  }

  // When live worker is not yet configured, stream honest educational notice instead of fake answers
  const notice = getOfflineEducationalNotice(language, Boolean(activeImage));
  let accumulated = "";
  const tokens = notice.split(/(\s+)/);

  for (let i = 0; i < tokens.length; i++) {
    accumulated += tokens[i];
    onChunk(accumulated);
    const delay = Math.min(20, Math.max(8, Math.random() * 15));
    await new Promise((r) => setTimeout(r, delay));
  }

  return accumulated;
}

// -------------------------------------------------------------
// History Management (localStorage key: matric_ai_history)
// -------------------------------------------------------------

export function getHistory(): AIHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(userText: string, answerText: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getHistory();
    const newEntry: AIHistoryEntry = {
      q: userText,
      a: answerText,
      time: Date.now(),
    };
    const updated = [newEntry, ...existing.slice(0, 19)]; // Keep last 20
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("matric_ai_history_updated"));
  } catch (err) {
    console.error("Failed to save history", err);
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new Event("matric_ai_history_updated"));
  } catch (err) {
    console.error("Failed to clear history", err);
  }
}
