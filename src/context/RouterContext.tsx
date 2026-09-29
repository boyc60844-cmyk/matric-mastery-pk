import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

interface RouterContextType {
  pathname: string;
  search: string;
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: "/",
  search: "",
  push: () => {},
  replace: () => {},
  back: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentUrl, setCurrentUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (window.location.pathname || "/") + (window.location.search || "");
    }
    return "/";
  });

  const pathname = useMemo(() => {
    const withoutHash = currentUrl.split("#")[0];
    return withoutHash.split("?")[0] || "/";
  }, [currentUrl]);

  const search = useMemo(() => {
    const withoutHash = currentUrl.split("#")[0];
    const qIndex = withoutHash.indexOf("?");
    return qIndex !== -1 ? withoutHash.slice(qIndex) : "";
  }, [currentUrl]);

  const push = useCallback((url: string) => {
    if (typeof window === "undefined") return;
    const currentFull = window.location.pathname + window.location.search;
    if (url === currentFull) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.history.pushState(null, "", url);
    setCurrentUrl(url);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const replace = useCallback((url: string) => {
    if (typeof window === "undefined") return;
    window.history.replaceState(null, "", url);
    setCurrentUrl(url);
  }, []);

  const back = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentUrl((window.location.pathname || "/") + (window.location.search || ""));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, search, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function usePathname() {
  const { pathname } = useContext(RouterContext);
  return pathname;
}

export function useSearchParams(): URLSearchParams {
  const { search } = useContext(RouterContext);
  return useMemo(() => new URLSearchParams(search), [search]);
}
