export interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "nav.home", defaultLabel: "Home" },
  { href: "/my-story", labelKey: "nav.myStory", defaultLabel: "My Story" },
  { href: "/strategies", labelKey: "nav.strategies", defaultLabel: "Strategies", badge: "30+" },
  { href: "/mock-tests", labelKey: "nav.mockTests", defaultLabel: "Mock Tests", badge: "New" },
  { href: "/past-papers", labelKey: "nav.pastPapers", defaultLabel: "Past Papers" },
  { href: "/dashboard", labelKey: "nav.dashboard", defaultLabel: "Dashboard" },
  { href: "/leaderboard", labelKey: "nav.leaderboard", defaultLabel: "Leaderboard", badge: "Live" },
  { href: "/paper-hacks", labelKey: "nav.paperHacks", defaultLabel: "Paper Hacks" },
  { href: "/resources", labelKey: "nav.resources", defaultLabel: "Resources" },
  { href: "/about", labelKey: "nav.about", defaultLabel: "About" },
  { href: "/legal", labelKey: "nav.legal", defaultLabel: "Legal" },
];
