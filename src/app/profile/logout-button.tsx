"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-600 transition-colors text-left w-full"
    >
      <LogOut className="w-5 h-5" />
      <span className="font-medium">{loading ? "Logging out..." : "Log out"}</span>
    </button>
  );
}
