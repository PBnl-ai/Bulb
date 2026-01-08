import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function TimeDisplay() {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTech = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    return `${weekday} ${day}-${month}-${year}`;
  };

  const isDark = theme === "dark";
  
  return (
    <div className="text-center" data-testid="time-display">
      <h1 
        className={`font-mono-tech text-4xl md:text-6xl font-normal tracking-wider ${isDark ? "text-white" : "text-[#444444]"}`} 
        data-testid="text-current-time"
      >
        {formatTime(currentTime)}
      </h1>
      <p 
        className={`font-mono-tech text-[10px] uppercase tracking-widest -mt-1.5 ${isDark ? "text-neutral-500" : "text-[#444444]/50"}`} 
        data-testid="text-current-date"
      >
        {formatDateTech(currentTime)}
      </p>
    </div>
  );
}
