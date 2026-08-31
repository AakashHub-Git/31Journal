"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-paper border border-[#EAE4DB]"
      >
        <h1 className="text-3xl font-playfair text-[#3F3931] mb-2">Welcome back.</h1>
        <p className="text-[#8A8276] mb-8">Sign in to your private journal.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3F3931]">Email</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#F5F2ED] border-transparent focus-visible:ring-[#D47A6A]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3F3931]">Password</label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#F5F2ED] border-transparent focus-visible:ring-[#D47A6A]"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3F3931] hover:bg-[#3F3931]/90 text-white rounded-xl py-6 mt-6 shadow-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
