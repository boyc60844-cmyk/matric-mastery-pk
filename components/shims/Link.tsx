import React from "react";
import { useRouter } from "@/src/context/RouterContext";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
}

export default function Link({
  href,
  children,
  className,
  onClick,
  target,
  rel,
  ...props
}: LinkProps) {
  const router = useRouter();

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    target === "_blank";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Do not intercept if default was prevented, external link, or modifier keys are pressed
    if (
      e.defaultPrevented ||
      isExternal ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey
    ) {
      return;
    }

    e.preventDefault();
    router.push(href);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={isExternal ? target || "_blank" : target}
      rel={isExternal ? rel || "noopener noreferrer" : rel}
      {...props}
    >
      {children}
    </a>
  );
}
