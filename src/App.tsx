import { useEffect } from "react";
import { usePathname, RouterProvider } from "@/src/context/RouterContext";
import { LanguageProvider, useLanguage } from "@/src/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import MotionProvider from "@/components/MotionProvider";
import Background from "@/components/Background";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import Cursor3D from "@/components/Cursor3D";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Pages
import HomePage from "@/app/page";
import MyStoryPage from "@/app/my-story/page";
import StrategiesPage from "@/app/strategies/page";
import StrategyDetailPage from "@/app/strategies/[slug]/page";
import PaperHacksPage from "@/app/paper-hacks/page";
import ResourcesPage from "@/app/resources/page";
import AboutPage from "@/app/about/page";
import LegalPage from "@/app/legal/page";
import MockTestsPage from "@/app/mock-tests/page";
import PastPapersPage from "@/app/past-papers/page";
import DashboardPage from "@/app/dashboard/page";
import LeaderboardPage from "@/app/leaderboard/page";
import LoginPage from "@/app/login/page";
import ExamDayGuidebookPage from "@/app/exam-day-guidebook/page";
import FloatingDoubtButton from "@/components/FloatingDoubtButton";
import Link from "next/link";
import Button from "@/components/Button";

function PageRenderer() {
  const pathname = usePathname();
  const { language, isRTL } = useLanguage();

  // Normalize path
  let cleanPath = pathname.split("?")[0].split("#")[0];
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (cleanPath === "/mock-tests") {
      document.title = "Matric Mastery Mock Tests Pakistan | Timed Exam Practice";
    } else if (cleanPath === "/past-papers") {
      document.title = "Matric Mastery Past Papers Practice | Punjab & Federal Boards";
    } else if (cleanPath === "/dashboard") {
      document.title = "Matric Mastery Student Dashboard | Progress & Analytics";
    } else if (cleanPath === "/leaderboard") {
      document.title = "Matric Mastery Leaderboard | Top Punjab Board Performers";
    } else if (cleanPath === "/login" || cleanPath === "/signin") {
      document.title = "Student Cloud Login | Matric Mastery PK";
    } else if (cleanPath === "/exam-day-guidebook" || cleanPath === "/guidebook" || cleanPath === "/exam-rules") {
      document.title = "Matric Mastery Exam Day Guidebook | Rules & Survival Tips";
    } else if (cleanPath === "/strategies" || cleanPath === "/strategy" || cleanPath.startsWith("/strategies/") || cleanPath.startsWith("/strategy/")) {
      document.title = "Matric Mastery Exam Strategies | 30+ Subject Playbooks";
    } else if (cleanPath === "/my-story") {
      document.title = "My Story & Verification | Matric Mastery PK";
    } else {
      document.title = "Matric Mastery | Punjab Board Strategies & Exam Platform";
    }
  }, [cleanPath]);

  let pageContent = null;

  if (cleanPath === "" || cleanPath === "/" || cleanPath === "/home") {
    pageContent = <HomePage />;
  } else if (cleanPath === "/my-story" || cleanPath === "/start-here" || cleanPath === "/results") {
    pageContent = <MyStoryPage />;
  } else if (cleanPath === "/strategies" || cleanPath === "/method") {
    pageContent = <StrategiesPage />;
  } else if (cleanPath === "/strategy") {
    pageContent = <StrategyDetailPage slug="" />;
  } else if (cleanPath.startsWith("/strategies/") || cleanPath.startsWith("/strategy/")) {
    const slug = cleanPath.replace("/strategies/", "").replace("/strategy/", "");
    pageContent = <StrategyDetailPage slug={slug} />;
  } else if (cleanPath === "/mock-tests" || cleanPath === "/test" || cleanPath === "/tests") {
    pageContent = <MockTestsPage />;
  } else if (cleanPath === "/past-papers" || cleanPath === "/papers") {
    pageContent = <PastPapersPage />;
  } else if (cleanPath === "/dashboard" || cleanPath === "/progress" || cleanPath === "/analytics") {
    pageContent = <DashboardPage />;
  } else if (cleanPath === "/leaderboard" || cleanPath === "/toppers") {
    pageContent = <LeaderboardPage />;
  } else if (cleanPath === "/login" || cleanPath === "/signin" || cleanPath === "/auth") {
    pageContent = <LoginPage />;
  } else if (cleanPath === "/exam-day-guidebook" || cleanPath === "/guidebook" || cleanPath === "/exam-rules") {
    pageContent = <ExamDayGuidebookPage />;
  } else if (cleanPath === "/paper-hacks") {
    pageContent = <PaperHacksPage />;
  } else if (cleanPath === "/resources") {
    pageContent = <ResourcesPage />;
  } else if (cleanPath === "/about" || cleanPath === "/contact") {
    pageContent = <AboutPage />;
  } else if (cleanPath === "/legal" || cleanPath === "/terms" || cleanPath === "/privacy") {
    pageContent = <LegalPage />;
  } else {
    // 404 Fallback
    pageContent = (
      <div className="mx-auto max-w-site px-5 py-32 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          404 &middot; Not Found
        </span>
        <h1 className="mt-4 type-title text-white">Page Not Found</h1>
        <p className="mt-4 text-muted">
          The page you are looking for doesn&apos;t exist or was moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="primary">
            Return Home
          </Button>
          <Button href="/strategies" variant="secondary">
            View Strategies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${cleanPath}-${language}`}
        initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isRTL ? -16 : 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[calc(100vh-72px-260px)]"
      >
        {pageContent}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <LanguageProvider>
        <MotionProvider>
          <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FFD60A] selection:text-black antialiased font-sans flex flex-col justify-between">
            <ScrollProgress />
            <CursorGlow />
            <Cursor3D />
            <Background />
            <Header />
            <main className="flex-1">
              <PageRenderer />
            </main>
            <FloatingDoubtButton />
            <Footer />
          </div>
        </MotionProvider>
      </LanguageProvider>
    </RouterProvider>
  );
}
