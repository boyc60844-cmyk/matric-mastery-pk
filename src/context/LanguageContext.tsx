import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.pastPapers": "Past Papers",
    "nav.mockTests": "Mock Tests",
    "nav.strategies": "Strategies",
    "nav.paperHacks": "Paper Hacks",
    "nav.dashboard": "Dashboard",
    "nav.leaderboard": "Leaderboard",
    "nav.myStory": "My Story",
    "nav.login": "Cloud Login",
    "nav.signOut": "Sign Out",
    "nav.resources": "Resources",

    // Hero
    "hero.badge": "MATRIC MASTERY PAKISTAN",
    "hero.titlePre": "Master Punjab Board",
    "hero.titleHighlight": "1050+ Marks",
    "hero.titlePost": "with Topper-Proven Strategies",
    "hero.desc": "Practical, subject-wise blueprints, paper presentation hacks, and chapter-wise timed mock tests built specifically for 9th and 10th class Punjab & Federal Board students.",
    "hero.ctaPractice": "Start Free Mock Test",
    "hero.ctaStrategies": "Explore Subject Playbooks",
    "hero.statMarks": "1050+ Marks",
    "hero.statMarksDesc": "Target score blueprint",
    "hero.statBoards": "9 Punjab Boards",
    "hero.statBoardsDesc": "Lahore, Multan, FBISE & more",
    "hero.statFree": "100% Free",
    "hero.statFreeDesc": "Made for every Pakistani student",

    // Features
    "features.badge": "WHY STUDENTS TRUST US",
    "features.title": "Everything You Need To Top Your Board",
    "features.subtitle": "No generic advice. Real exam strategies refined by board position holders.",
    "features.mockTitle": "Real Board Mock Tests",
    "features.mockDesc": "Timed chapter-wise MCQ practice with instant scoring, timer control, and full explanation review.",
    "features.papersTitle": "5-Year Solved Past Papers",
    "features.papersDesc": "Analyzed past papers for Lahore, Gujranwala, Multan, and Federal boards with repeated questions marked.",
    "features.presentationTitle": "Paper Presentation Hacks",
    "features.presentationDesc": "605 cut-marker heading templates, margin rules, and diagrams that win high examiner marks.",
    "features.leaderboardTitle": "Punjab Board Leaderboard",
    "features.leaderboardDesc": "Compete with serious students across Pakistan, earn study XP, and protect your streak.",

    // Login
    "auth.badge": "MATRIC MASTERY CLOUD",
    "auth.headline": "Student Cloud Login",
    "auth.subheadline": "Login with Google to save your progress, secure your preparation, and compete on the Punjab Board leaderboard.",
    "auth.f1": "Keep your study streak safe - switch between mobile and laptop anytime",
    "auth.f2": "Smart Revision for wrong answers - we remind you after 24 hours",
    "auth.f3": "Live Leaderboard - Compete with Lahore, Multan & FBISE toppers",
    "auth.button": "Continue with Google",
    "auth.connecting": "Connecting to Google...",
    "auth.footer": "100% Free for Matric Students • No password needed",
    "auth.welcome": "Welcome back",
    "auth.active": "Cloud Synced & Active",
    "auth.dashboardBtn": "Go to Student Dashboard",
    "auth.leaderboardBtn": "Weekly Leaderboard",
    "auth.logout": "Sign out from this device",
    "auth.synced": "Your progress, past papers history, and leaderboard score are secured.",

    // Mock Tests
    "mock.title": "Timed Mock Tests",
    "mock.subtitle": "Experience real exam pressure. Master timing and accuracy with board-pattern questions.",
    "mock.start": "Start Test",
    "mock.time": "Time Limit",
    "mock.questions": "Questions",
    "mock.difficulty": "Difficulty",

    // Common
    "common.lang": "Language",
    "common.english": "English",
    "common.urdu": "اردو",
    "common.switchUrdu": "Switch to Urdu",
    "common.switchEng": "Switch to English",
    "common.menu": "Menu",
    "common.close": "Close",
    "common.boardNotice": "For BISE Lahore, Rawalpindi, Gujranwala, Multan, Faisalabad, Sargodha, Sahiwal, Bahawalpur, DG Khan & FBISE.",
    "common.copyright": "© 2026 Matric Mastery Pakistan. Built for Pakistani Students.",
  },
  ur: {
    // Nav
    "nav.home": "ہوم",
    "nav.pastPapers": "ماضی کے پرچے",
    "nav.mockTests": "ماک ٹیسٹ",
    "nav.strategies": "امتحانی حکمت عملی",
    "nav.paperHacks": "پیپر ہیکس",
    "nav.dashboard": "ڈیش بورڈ",
    "nav.leaderboard": "لیڈر بورڈ",
    "nav.myStory": "میری کہانی",
    "nav.login": "کلاؤڈ لاگ ان",
    "nav.signOut": "لاگ آؤٹ",
    "nav.resources": "امدادی مواد",

    // Hero
    "hero.badge": "میٹرک ماسٹری پاکستان",
    "hero.titlePre": "پنجاب بورڈ میں پائیں",
    "hero.titleHighlight": "1050+ نمبر",
    "hero.titlePost": "ٹاپرز کی آزمودہ حکمت عملی کے ساتھ",
    "hero.desc": "نویں اور دسویں جماعت کے پنجاب اور فیڈرل بورڈ کے طلباء کے لیے مضامین کے مکمل روڈ میپس، 605 مارکر پریزنٹیشن ہیکس اور ٹائمر کے ساتھ چیپٹر وائز ماک ٹیسٹس۔",
    "hero.ctaPractice": "مفت ماک ٹیسٹ شروع کریں",
    "hero.ctaStrategies": "مضامین کی حکمت عملیاں دیکھیں",
    "hero.statMarks": "1050+ نمبر",
    "hero.statMarksDesc": "ٹارگٹ اسکور کا لائحہ عمل",
    "hero.statBoards": "9 پنجاب بورڈز",
    "hero.statBoardsDesc": "لاہور، ملتان، اسلام آباد اور تمام بورڈز",
    "hero.statFree": "100٪ مفت",
    "hero.statFreeDesc": "ہر پاکستانی طالب علم کے لیے دستیاب",

    // Features
    "features.badge": "طلباء کا ہم پر اعتماد کیوں ہے",
    "features.title": "بورڈ میں ٹاپ کرنے کے لیے تمام ضروری رہنمائی",
    "features.subtitle": "کوئی فرضی مشورہ نہیں۔ بورڈ پوزیشن ہولڈرز کی اصل اور آزمودہ حکمت عملیاں۔",
    "features.mockTitle": "اصلی بورڈ پیٹرن ماک ٹیسٹ",
    "features.mockDesc": "فوری اسکورنگ، ٹائمر اور مکمل سوالاتی وضاحت کے ساتھ چیپٹر وائز ایم سی کیوز پریکٹس۔",
    "features.papersTitle": "5 سالہ حل شدہ ماضی کے پرچے",
    "features.papersDesc": "لاہور، گوجرانوالہ، ملتان اور فیڈرل بورڈ کے پرچوں کا تجزیہ اور بار بار آنے والے اہم سوالات۔",
    "features.presentationTitle": "پیپر پریزنٹیشن کے کمال ہیکس",
    "features.presentationDesc": "605 کٹ مارکر سرخیاں، حاشیے اور خاکہ سازی جو ممتحن سے پورے نمبر دلواتی ہے۔",
    "features.leaderboardTitle": "پنجاب بورڈ لائیو مقابلہ",
    "features.leaderboardDesc": "پاکستان بھر کے محنتی طلباء سے مقابلہ کریں، اسٹڈی ایکس پی حاصل کریں اور تسلسل برقرار رکھیں۔",

    // Login
    "auth.badge": "میٹرک ماسٹری کلاؤڈ",
    "auth.headline": "طالب علم کلاؤڈ لاگ ان",
    "auth.subheadline": "گوگل سے لاگ ان کریں تاکہ آپ کی پڑھائی کا ریکارڈ محفوظ رہے اور آپ پنجاب بورڈ مقابلے میں شامل ہو سکیں۔",
    "auth.f1": "مطالعے کا تسلسل محفوظ رکھیں - موبائل اور لیپ ٹاپ پر کبھی بھی پڑھیں",
    "auth.f2": "غلط سوالات کی اسمارٹ دہرائی - 24 گھنٹے بعد خودکار یاد دہانی",
    "auth.f3": "لائیو لیڈر بورڈ - لاہور، ملتان اور اسلام آباد کے ٹاپرز سے مقابلہ کریں",
    "auth.button": "گوگل کے ساتھ لاگ ان کریں",
    "auth.connecting": "گوگل سے رابطہ ہو رہا ہے...",
    "auth.footer": "میٹرک کے تمام طلباء کے لیے 100٪ مفت • کسی پاس ورڈ کی ضرورت نہیں",
    "auth.welcome": "خوش آمدید",
    "auth.active": "کلاؤڈ سے منسلک اور فعال",
    "auth.dashboardBtn": "طالب علم ڈیش بورڈ پر جائیں",
    "auth.leaderboardBtn": "ہفتہ وار لیڈر بورڈ",
    "auth.logout": "اس ڈیوائس سے لاگ آؤٹ کریں",
    "auth.synced": "آپ کی پیش رفت، ماضی کے پرچوں کی ہسٹری اور لیڈر بورڈ اسکور محفوظ ہیں۔",

    // Mock Tests
    "mock.title": "ٹائمڈ ماک ٹیسٹس",
    "mock.subtitle": "اصلی امتحانی دباؤ کا تجربہ کریں۔ بورڈ پیٹرن کے مطابق وقت اور درستگی پر قابو پائیں۔",
    "mock.start": "ٹیسٹ شروع کریں",
    "mock.time": "وقت کی حد",
    "mock.questions": "کل سوالات",
    "mock.difficulty": "مشکل کا درجہ",

    // Common
    "common.lang": "زبان",
    "common.english": "English",
    "common.urdu": "اردو",
    "common.switchUrdu": "اردو میں دیکھیں",
    "common.switchEng": "Switch to English",
    "common.menu": "مینو",
    "common.close": "بند کریں",
    "common.boardNotice": "لاہور، ملتان، فیصل آباد، راولپنڈی، گوجرانوالہ، سرگودھا، ساہیوال، بہاولپور، ڈیرہ غازی خان اور فیڈرل بورڈ کے طلباء کے لیے۔",
    "common.copyright": "© 2026 میٹرک ماسٹری پاکستان • پاکستانی طلباء کی خدمت میں۔",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  isRTL: false,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

const STORAGE_KEY = "mm_language_preference";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "en" || saved === "ur") {
        return saved;
      }
    }
    return "en";
  });

  const isRTL = language === "ur";

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  // Sync HTML tag attributes: lang, dir, and font classes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.lang = language;
    html.dir = isRTL ? "rtl" : "ltr";

    if (isRTL) {
      document.body.classList.add("lang-urdu");
    } else {
      document.body.classList.remove("lang-urdu");
    }
  }, [language, isRTL]);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = translations.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  const contextValue = useMemo(
    () => ({
      language,
      isRTL,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, isRTL]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
