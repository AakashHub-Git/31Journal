"use client";

import * as React from "react";
import { Camera, Book, Compass, User, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: "explore" | "journal" | "camera" | "gallery" | "profile";
  onTabChange?: (tab: "explore" | "journal" | "camera" | "gallery" | "profile") => void;
}

export function BottomNavigation({ activeTab = "explore", onTabChange }: BottomNavigationProps) {
  type TabId = "explore" | "journal" | "camera" | "gallery" | "profile";
  const tabs: { id: TabId; icon: React.ElementType; label: string; isPrimary?: boolean }[] = [
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "journal", icon: Book, label: "Journal" },
    { id: "camera", icon: Camera, label: "Capture", isPrimary: true },
    { id: "gallery", icon: ImageIcon, label: "Gallery" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background/95 backdrop-blur-md border-t border-border pb-safe z-40">
      <div className="flex justify-around items-center h-20 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isPrimary) {
            return (
              <button 
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform -translate-y-6"
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <button 
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
