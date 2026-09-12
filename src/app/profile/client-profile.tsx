"use client";

import * as React from "react";
import { Section } from "@/components/ui/section";
import { User, Bell, Shield, Palette, Sparkles, Type, Square, Play, ArrowLeft } from "lucide-react";
import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { IconButton } from "@/components/ui/icon-button";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useTheme } from "next-themes";
import { useAppSettings } from "@/components/layout/app-provider";

interface ClientProfileProps {
  displayName: string;
  joinedDate: string;
  memoriesCount: number;
  mediaCount: number;
}

export function ClientProfile({ displayName, joinedDate, memoriesCount, mediaCount }: ClientProfileProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useAppSettings();

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-background relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/10 rounded-b-[4rem] -z-10 animate-pulse" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl -z-10 hover-animate" />
      <div className="absolute top-40 left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10 hover-animate" />

      <header className="px-4 pt-12 pb-4 sticky top-0 bg-transparent z-10 flex items-center">
        <Link href="/">
          <IconButton variant="ghost" className="-ml-2 bg-background/50 backdrop-blur-md hover:bg-background/80">
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
        </Link>
      </header>

      <motion.main
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-6 flex flex-col gap-10 mt-2"
      >
        <motion.div variants={staggerItem} className="flex flex-col items-center text-center relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-28 h-28 rounded-full bg-card border-4 border-background shadow-xl flex items-center justify-center mb-5 relative z-10 hover-animate"
          >
            <img
              src="images/PXL_20250926_141541164.MP~2.jpg"  // replace with your actual image path
              alt="Profile picture"
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
            {displayName}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium tracking-wide text-sm">Started {joinedDate}</p>

          <div className="flex gap-12 mt-8 bg-card px-8 py-5 rounded-3xl shadow-sm border border-border/50">
            <div className="flex flex-col items-center hover-animate">
              <span className="font-handwriting text-5xl text-primary drop-shadow-sm">{memoriesCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Entries</span>
            </div>
            <div className="w-px h-12 bg-border/50 self-center" />
            <div className="flex flex-col items-center hover-animate">
              <span className="font-handwriting text-5xl text-primary drop-shadow-sm">{mediaCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Photos</span>
            </div>
          </div>
        </motion.div>

        {/* Customization Settings */}
        <motion.div variants={staggerItem}>
          <Section>
            <div className="flex items-center gap-2 mb-4 pl-1">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Magic Styling</h2>
            </div>

            <div className="flex flex-col gap-4">

              {/* Theme Pack */}
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Palette className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-semibold text-sm">Theme Pack</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setTheme("pastel")} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${theme === 'pastel' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Pastel Scrapbook</button>
                  <button onClick={() => setTheme("stranger-things")} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${theme === 'stranger-things' ? 'bg-red-600 text-white shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Stranger Things</button>
                  <button onClick={() => setTheme("dark-elegance")} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${theme === 'dark-elegance' ? 'bg-purple-600 text-white shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Dark Elegance</button>
                  <button onClick={() => setTheme("ocean")} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${theme === 'ocean' ? 'bg-blue-500 text-white shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Ocean Breeze</button>
                </div>
              </div>

              {/* Font Style */}
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Type className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-semibold text-sm">Typography</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateSettings({ fontStyle: 'default' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.fontStyle === 'default' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Modern</button>
                  <button onClick={() => updateSettings({ fontStyle: 'serif' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.fontStyle === 'serif' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Classic</button>
                  <button onClick={() => updateSettings({ fontStyle: 'handwriting' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.fontStyle === 'handwriting' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Cute</button>
                </div>
              </div>

              {/* Image Shapes */}
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Square className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-semibold text-sm">Image Shapes</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateSettings({ imageShape: 'rounded-sm' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.imageShape === 'rounded-sm' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Square</button>
                  <button onClick={() => updateSettings({ imageShape: 'rounded-2xl' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.imageShape === 'rounded-2xl' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Rounded</button>
                  <button onClick={() => updateSettings({ imageShape: 'rounded-full' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.imageShape === 'rounded-full' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Circles</button>
                </div>
              </div>

              {/* Animation Speed */}
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Play className="w-4 h-4 text-primary" /></div>
                  <h3 className="font-semibold text-sm">Animations</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateSettings({ animationStyle: 'none' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.animationStyle === 'none' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>None</button>
                  <button onClick={() => updateSettings({ animationStyle: 'gentle' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.animationStyle === 'gentle' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Gentle</button>
                  <button onClick={() => updateSettings({ animationStyle: 'bouncy' })} className={`flex-1 py-2 rounded-xl text-xs transition-all ${settings.animationStyle === 'bouncy' ? 'bg-primary text-primary-foreground font-bold shadow-md' : 'bg-muted/50 hover:bg-muted'}`}>Bouncy</button>
                </div>
              </div>

            </div>
          </Section>
        </motion.div>

        {/* Standard Settings */}
        <motion.div variants={staggerItem}>
          <Section>
            <div className="flex flex-col rounded-2xl bg-card border border-border/50 overflow-hidden shadow-sm">
              <button className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left w-full group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors"><Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary" /></div>
                  <span className="font-medium">Notifications</span>
                </div>
              </button>
              <div className="h-px w-full bg-border/50" />
              <button className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left w-full group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors"><Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary" /></div>
                  <span className="font-medium">Privacy & Data</span>
                </div>
              </button>
              <div className="h-px w-full bg-border/50" />
              <LogoutButton />
            </div>
          </Section>
        </motion.div>

      </motion.main>
    </div>
  );
}
