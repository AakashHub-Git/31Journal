"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNavigation } from "@/components/features/bottom-navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Routes that should hide the bottom navigation (e.g. creating new entries or auth)
  const hideNavigation = pathname.startsWith("/journal/") || pathname.startsWith("/login") || pathname.startsWith("/auth");

  // Determine active tab based on current route
  let activeTab: "explore" | "journal" | "camera" | "gallery" | "profile" = "explore";
  if (pathname === "/journal" || pathname.startsWith("/memories")) activeTab = "journal";
  else if (pathname.startsWith("/gallery")) activeTab = "gallery";
  else if (pathname.startsWith("/profile")) activeTab = "profile";

  const handleTabChange = (tab: string) => {
    if (tab === "explore") router.push("/");
    else if (tab === "camera") router.push("/journal/new");
    else if (tab === "journal") router.push("/memories"); // Journal tab goes to memories timeline
    else router.push(`/${tab}`);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-background relative shadow-sm overflow-hidden border-x border-border/30">
      {children}
      {!hideNavigation && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}
