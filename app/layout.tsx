import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "Matric Mastery | Punjab Board Strategies & Paper Presentation",
  description:
    "Punjab Board 9th and 10th class exam strategies, paper presentation hacks, and real student guidance by Hamza from Multan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-[#0A0A0A] text-white selection:bg-[#FFD60A] selection:text-black min-h-screen flex flex-col font-sans antialiased">
        <ScrollProgress />
        <CursorGlow />
        <Background />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
