"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

interface AppSettings {
  imageShape: "rounded-sm" | "rounded-2xl" | "rounded-full";
  animationStyle: "none" | "gentle" | "bouncy";
  fontStyle: "default" | "serif" | "handwriting";
}

const defaultSettings: AppSettings = {
  imageShape: "rounded-2xl",
  animationStyle: "gentle",
  fontStyle: "default",
};

export const AppSettingsContext = React.createContext<{
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<AppSettings>(defaultSettings);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const updateSettings = React.useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("app-settings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Sync settings to document attributes so CSS can respond
  React.useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-image-shape", settings.imageShape);
    document.documentElement.setAttribute("data-animation", settings.animationStyle);
    document.documentElement.setAttribute("data-font-style", settings.fontStyle);
  }, [settings, mounted]);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="pastel" enableSystem={false}>
      <AppSettingsContext.Provider value={{ settings, updateSettings }}>
        {children}
      </AppSettingsContext.Provider>
    </ThemeProvider>
  );
}

export const useAppSettings = () => React.useContext(AppSettingsContext);
