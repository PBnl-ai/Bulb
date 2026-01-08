import { Clock, Calendar, Radio, Headphones } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface StatusIndicatorProps {
  isPlaying: boolean;
  isWeekday: boolean;
  isScheduledTime: boolean;
}

export default function StatusIndicator({ isPlaying, isWeekday, isScheduledTime }: StatusIndicatorProps) {
  const { theme } = useTheme();
  
  const cardClass = theme === "light" 
    ? "rounded-xl bg-background" 
    : "rounded-sm bg-neutral-900/30 border border-white/[0.05]";
  
  const iconBgActive = theme === "light" ? "bg-[#c9c4c0]/50" : "bg-white/5";
  const iconBgInactive = theme === "light" ? "bg-[#c9c4c0]/30" : "bg-white/[0.03]";
  const iconColorActive = theme === "light" ? "text-[#444444]" : "text-neutral-300";
  const iconColorInactive = theme === "light" ? "text-[#444444]/60" : "text-neutral-600";
  
  const labelClass = theme === "light" 
    ? "text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide" 
    : "font-mono-tech text-[9px] text-neutral-600 uppercase tracking-widest";
  
  const valueActiveClass = theme === "light" ? "text-foreground" : "text-neutral-300";
  const valueInactiveClass = "text-muted-foreground";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-testid="status-indicator">
      <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass}`}>
        <div className={`p-2 md:p-3 ${theme === "light" ? "rounded-lg md:rounded-xl" : "rounded-sm"} ${isPlaying ? (theme === "light" ? "bg-chart-3/20" : "bg-green-500/10") : iconBgInactive}`}>
          <Radio className={`w-5 h-5 md:w-6 md:h-6 ${isPlaying ? (theme === "light" ? "text-chart-3" : "text-green-500") : iconColorInactive}`} />
        </div>
        <div>
          <p className={labelClass}>{theme === "light" ? "Radio Status" : "STREAM_STATUS"}</p>
          <p className={`text-sm md:text-base font-medium ${isPlaying ? (theme === "light" ? "text-chart-3" : "text-green-500") : valueInactiveClass}`} data-testid="text-radio-status">
            {theme === "light" ? (isPlaying ? "On" : "Off") : (isPlaying ? "ONLINE" : "OFFLINE")}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass}`}>
        <div className={`p-2 md:p-3 ${theme === "light" ? "rounded-lg md:rounded-xl" : "rounded-sm"} ${isWeekday ? iconBgActive : iconBgInactive}`}>
          <Calendar className={`w-5 h-5 md:w-6 md:h-6 ${isWeekday ? iconColorActive : iconColorInactive}`} />
        </div>
        <div>
          <p className={labelClass}>{theme === "light" ? "Day Type" : "DAY_TYPE"}</p>
          <p className={`text-sm md:text-base font-medium ${isWeekday ? valueActiveClass : valueInactiveClass}`} data-testid="text-day-type">
            {theme === "light" ? (isWeekday ? "Weekday" : "Weekend") : (isWeekday ? "WEEKDAY" : "WEEKEND")}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass}`}>
        <div className={`p-2 md:p-3 ${theme === "light" ? "rounded-lg md:rounded-xl" : "rounded-sm"} ${isScheduledTime ? iconBgActive : iconBgInactive}`}>
          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isScheduledTime ? iconColorActive : iconColorInactive}`} />
        </div>
        <div>
          <p className={labelClass}>{theme === "light" ? "Schedule" : "SCHEDULE"}</p>
          <p className={`text-sm md:text-base font-medium ${isScheduledTime ? valueActiveClass : valueInactiveClass}`} data-testid="text-schedule-status">
            {theme === "light" 
              ? (isScheduledTime ? "Active" : "Outside working hours") 
              : (isScheduledTime ? "ACTIVE" : "INACTIVE")
            }
          </p>
        </div>
      </div>

      <a 
        href="https://studio.pb.nl" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass} hover-elevate active-elevate-2 transition-all`}
        data-testid="link-radio-maker"
      >
        <div className={`p-2 md:p-3 ${theme === "light" ? "rounded-lg md:rounded-xl" : "rounded-sm"} ${iconBgActive}`}>
          <Headphones className={`w-5 h-5 md:w-6 md:h-6 ${iconColorActive}`} />
        </div>
        <div>
          <p className={labelClass}>{theme === "light" ? "Radio Maker" : "CREATOR"}</p>
          <p className={`text-sm md:text-base font-medium ${valueActiveClass}`}>STUDIO PB.NL</p>
        </div>
      </a>
    </div>
  );
}
