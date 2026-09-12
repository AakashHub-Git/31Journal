"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithPin } from "@/app/actions/auth";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const PIN_LENGTH = 5;

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = React.useCallback(async (currentPin: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(false);

    try {
      await loginWithPin(currentPin);
      setIsSuccess(true);
      // Wait for the cute heart animation before redirecting
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch {
      setError(true);
      setTimeout(() => {
        setPin("");
        setError(false);
        setIsSubmitting(false);
      }, 500);
    }
  }, [isSubmitting, router]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleLogin(pin);
    }
  }, [pin, handleLogin]);

  const handleNumberClick = (num: number) => {
    if (pin.length < PIN_LENGTH && !isSubmitting && !isSuccess) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isSubmitting && !isSuccess) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const [confetti, setConfetti] = useState<Array<{x: string, y: string, scale: number, rotate: number}>>([]);
  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfetti(
        Array.from({ length: 15 }).map(() => ({
          x: `${Math.random() * 100}vw`,
          y: `${Math.random() * 100}vh`,
          scale: Math.random() * 1.5 + 0.5,
          rotate: Math.random() * 360,
        }))
      );
    }
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center justify-center text-primary z-10"
        >
          <Heart className="w-32 h-32 fill-primary animate-pulse" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 font-handwriting text-3xl text-foreground"
          >
            Welcome back...
          </motion.p>
        </motion.div>
        
        {/* Confetti hearts */}
        {confetti.map((props, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: "50vw", y: "50vh", scale: 0 
            }}
            animate={{ 
              x: props.x, 
              y: props.y, 
              scale: props.scale,
              opacity: [0, 1, 0],
              rotate: props.rotate
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Heart className="w-6 h-6 text-primary fill-primary/50" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center max-w-sm w-full">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
        </div>
        
        <h1 className="text-2xl font-medium mb-2 text-foreground">Enter Secret PIN</h1>
        <p className="text-muted-foreground text-sm mb-12">Just for us.</p>

        {/* PIN Indicators */}
        <motion.div 
          className="flex gap-4 mb-16 h-4"
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < pin.length 
                  ? "bg-primary scale-110" 
                  : "bg-muted border border-border"
              }`}
            />
          ))}
        </motion.div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full bg-card shadow-sm border border-border/50 text-2xl font-medium flex items-center justify-center hover:bg-muted active:scale-95 transition-all mx-auto text-foreground"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 rounded-full bg-card shadow-sm border border-border/50 text-2xl font-medium flex items-center justify-center hover:bg-muted active:scale-95 transition-all mx-auto text-foreground"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-transparent text-muted-foreground text-sm font-medium flex items-center justify-center hover:bg-muted active:scale-95 transition-all mx-auto"
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );
}
