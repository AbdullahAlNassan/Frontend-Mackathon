import { useState, useEffect } from "react";

export const useCountdown = (initialCount: number = 0) => {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
  };

  const resetCountdown = () => {
    setCountdown(0);
  };

  return {
    countdown,
    startCountdown,
    resetCountdown,
    isActive: countdown > 0
  };
};