import { useEffect, useState } from "react";
export function useClock(intervalMs = 30000) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
