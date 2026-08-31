"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNavigation } from "@/components/features/bottom-navigation";
import { TRAILER_MODE } from "@/config/app";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isComingSoon = TRAILER_MODE;

  // Routes that should hide the bottom navigation
  const hideNavigation = pathname.startsWith("/journal/") || pathname.startsWith("/design") || pathname.startsWith("/trailer");
  const isTrailer = pathname.startsWith("/trailer") || isComingSoon;

  // Determine active tab based on current route
  let activeTab: "explore" | "journal" | "camera" | "gallery" | "profile" = "explore";
  if (pathname.startsWith("/journal")) activeTab = "journal";
  else if (pathname.startsWith("/gallery")) activeTab = "gallery";
  else if (pathname.startsWith("/profile")) activeTab = "profile";

  const handleTabChange = (tab: string) => {
    if (tab === "explore") router.push("/");
    else if (tab === "camera") router.push("/journal/new");
    else router.push(`/${tab}`);
  };

  if (isTrailer) {
    return <>{children}</>;
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-background relative shadow-sm overflow-hidden border-x border-border/30">
      {children}
      {!hideNavigation && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}
