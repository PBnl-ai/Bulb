import { useEffect, useState } from "react";

export default function TimeDisplay() {
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
    return date.toLocaleDateString("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="text-center" data-testid="time-display">
      <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-2" data-testid="text-current-time">
        {formatTime(currentTime)}
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground capitalize" data-testid="text-current-date">
        {formatDate(currentTime)}
      </p>
    </div>
  );
}
