import { usePathname, RouterProvider } from "@/src/context/RouterContext";
import { motion, AnimatePresence } from "framer-motion";
import MotionProvider from "@/components/MotionProvider";
import Background from "@/components/Background";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
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
import Link from "next/link";
import Button from "@/components/Button";

function PageRenderer() {
  const pathname = usePathname();

  // Normalize path
  let cleanPath = pathname.split("?")[0].split("#")[0];
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  let pageContent = null;

  if (cleanPath === "" || cleanPath === "/" || cleanPath === "/home") {
    pageContent = <HomePage />;
  } else if (cleanPath === "/my-story" || cleanPath === "/start-here" || cleanPath === "/results") {
    pageContent = <MyStoryPage />;
  } else if (cleanPath === "/strategies" || cleanPath === "/method") {
    pageContent = <StrategiesPage />;
  } else if (cleanPath.startsWith("/strategies/")) {
    const slug = cleanPath.replace("/strategies/", "");
    pageContent = <StrategyDetailPage slug={slug} />;
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
        key={cleanPath}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
      <MotionProvider>
        <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FFD60A] selection:text-black antialiased font-sans flex flex-col justify-between">
          <ScrollProgress />
          <CursorGlow />
          <Background />
          <Header />
          <main className="flex-1">
            <PageRenderer />
          </main>
          <Footer />
        </div>
      </MotionProvider>
    </RouterProvider>
  );
}
