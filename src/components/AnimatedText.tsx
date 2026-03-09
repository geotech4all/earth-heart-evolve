import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const AnimatedText = ({ words, interval = 3000, className }: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={cn("inline-block relative", className)}>
      <span
        className={cn(
          "inline-block transition-all duration-500 animate-in",
          isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
        )}
      >
        {words[currentIndex]}
      </span>
    </span>
  );
};

export default AnimatedText;
