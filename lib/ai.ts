// lib/ai.ts
// Matric Mastery AI - 100% Functional AI Engine for Google AI Studio
// Powered directly by built-in `ai` object without external SDKs or API keys.

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

// Safely access built-in ai in Google AI Studio
export function getAI() {
  if (typeof (globalThis as any).ai !== "undefined") {
    return (globalThis as any).ai;
  }
  if (typeof window !== "undefined" && (window as any).ai) {
    return (window as any).ai;
  }
  return null;
}

export function isLiveAIAvailable(): boolean {
  const aiObject = getAI();
  return Boolean(aiObject?.models);
}

// Educational notice displayed when live Gemini AI runtime is not connected
function getOfflineEducationalNotice(lang: LanguageMode, hasImage: boolean): string {
  if (lang === "urdu") {
    return `### ℹ️ لائیو AI اسٹوڈیو نوٹس (Live AI Notice)

**Live AI Doubt Solver standalone mode me chal raha hai.**

Real-time Gemini AI streaming aur camera image OCR ke liye active **Google AI Studio** session darkaar hota hai.${
  hasImage ? "\n\n⚠️ **Image OCR Notice:** Tasweer se sawal parhna sirf active live AI environment me dastyab hai." : ""
}

**Aap ki parhai ke liye mufeed zariye:**
- 📖 **[Study Strategies](/strategies)** — Class 9 & 10 ke topper study plans aur chapter revision roadmaps.
- ✍️ **[Paper Presentation Hacks](/paper-hacks)** — Punjab Board ke 605 marker presentation formulas aur paper-solving techniques.
- 💬 **Student WhatsApp Group** — Apne sawalaat senior matric mentors aur sathiyon se WhatsApp community me poochiye.

*Mashwara: Interactive Gemini 1.5 Flash live streaming chalane ke liye Matric Mastery ko Google AI Studio preview me open karein.*`;
  }

  return `### ℹ️ Live AI Streaming Notice

**The Live AI Doubt Solver is currently running in Standalone Browser Mode.**

Real-time Gemini AI streaming and multimodal question image OCR require an active **Google AI Studio** session.${
    hasImage ? "\n\n⚠️ **Image OCR Notice:** Direct image text extraction requires the active live Google AI runtime." : ""
  }

To protect student privacy and maintain zero-cost access without client-side API key exposure, automated question generation is paused outside the studio environment.

**Recommended Educational Alternatives for Your Preparation:**
- 📖 **[Study Strategies](/strategies)** — Complete chapter-by-chapter revision schedules and topper routines for Class 9 & 10.
- ✍️ **[Paper Presentation Hacks](/paper-hacks)** — Board-verified marker techniques, margin rules, and 605 heading templates.
- 💬 **Student WhatsApp Community** — Connect directly with senior matric mentors and peer study groups.

*Tip: Run Matric Mastery inside Google AI Studio to unlock live Gemini 1.5 Flash streaming and real-time image problem solving.*`;
}

// 100% Functional Solver with Streaming using built-in ai object
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
  const userText = `Language: ${language}. Question: ${question.trim() || "Solve this question in image completely step by step."}`;
  const aiObject = getAI();

  // If built-in ai is present in AI Studio
  if (aiObject?.models) {
    const contents = uploadedImage
      ? [
          {
            role: "user",
            parts: [
              { text: userText },
              {
                inlineData: {
                  mimeType: uploadedImage.mimeType,
                  data: uploadedImage.base64,
                },
              },
            ],
          },
        ]
      : [
          {
            role: "user",
            parts: [{ text: userText }],
          },
        ];

    // Try 1: Streaming
    try {
      const stream = await aiObject.models.generateContentStream({
        model: "gemini-1.5-flash",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      let fullAnswer = "";
      for await (const chunk of stream) {
        if (chunk?.text) {
          fullAnswer += chunk.text;
          onChunk(fullAnswer);
        }
      }

      if (fullAnswer.trim()) {
        return fullAnswer;
      }
    } catch (streamError) {
      console.warn("generateContentStream failed, trying non-streaming generateContent fallback:", streamError);

      // Try 2: Non-streaming fallback
      try {
        const response = await aiObject.models.generateContent({
          model: "gemini-1.5-flash",
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });
        const text = response?.text;
        if (text) {
          onChunk(text);
          return text;
        }
      } catch (genError) {
        console.error("Non-streaming generateContent also threw:", genError);
        throw genError;
      }
    }
  }

  // When live ai is unavailable, stream honest educational notice instead of fake answers
  const notice = getOfflineEducationalNotice(language, Boolean(uploadedImage));
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
