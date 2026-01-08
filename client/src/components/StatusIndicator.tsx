import { Clock, Calendar, Radio, Headphones } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface StatusIndicatorProps {
  isPlaying: boolean;
  isWeekday: boolean;
  isScheduledTime: boolean;
}

export default function StatusIndicator({ isPlaying, isWeekday, isScheduledTime }: StatusIndicatorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const cardClass = isDark 
    ? "rounded-sm bg-neutral-900/30 border border-white/[0.05]" 
    : "rounded-sm bg-black/[0.03] border border-[#c9c4c0]/20";
  
  const iconBgActive = isDark ? "bg-white/5" : "bg-[#c9c4c0]/30";
  const iconBgInactive = isDark ? "bg-white/[0.03]" : "bg-[#c9c4c0]/15";
  const iconColorActive = isDark ? "text-neutral-300" : "text-[#444444]";
  const iconColorInactive = isDark ? "text-neutral-600" : "text-[#444444]/50";
  
  const labelClass = `font-mono-tech text-[9px] uppercase tracking-widest ${isDark ? "text-neutral-600" : "text-[#444444]/50"}`;
  
  const valueActiveClass = isDark ? "text-neutral-300" : "text-[#444444]";
  const valueInactiveClass = isDark ? "text-neutral-600" : "text-[#444444]/50";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-testid="status-indicator">
      <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass}`}>
        <div className={`p-2 md:p-3 rounded-sm ${isPlaying ? (isDark ? "bg-green-500/10" : "bg-green-500/20") : iconBgInactive}`}>
          <Radio className={`w-5 h-5 md:w-6 md:h-6 ${isPlaying ? "text-green-500" : iconColorInactive}`} />
        </div>
        <div>
          <p className={labelClass}>STREAM_STATUS</p>
          <p className={`font-mono-tech text-xs uppercase tracking-wide ${isPlaying ? "text-green-500" : valueInactiveClass}`} data-testid="text-radio-status">
            {isPlaying ? "ONLINE" : "OFFLINE"}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass}`}>
        <div className={`p-2 md:p-3 rounded-sm ${isWeekday ? iconBgActive : iconBgInactive}`}>
          <Calendar className={`w-5 h-5 md:w-6 md:h-6 ${isWeekday ? iconColorActive : iconColorInactive}`} />
        </div>
        <div>
          <p className={labelClass}>DAY_TYPE</p>
          <p className={`font-mono-tech text-xs uppercase tracking-wide ${isWeekday ? valueActiveClass : valueInactiveClass}`} data-testid="text-day-type">
            {isWeekday ? "WEEKDAY" : "WEEKEND"}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 ${cardClass}`}>
        <div className={`p-2 md:p-3 rounded-sm ${isScheduledTime ? iconBgActive : iconBgInactive}`}>
          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isScheduledTime ? iconColorActive : iconColorInactive}`} />
        </div>
        <div>
          <p className={labelClass}>SCHEDULE</p>
          <p className={`font-mono-tech text-xs uppercase tracking-wide ${isScheduledTime ? valueActiveClass : valueInactiveClass}`} data-testid="text-schedule-status">
            {isScheduledTime ? "ACTIVE" : "INACTIVE"}
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
        <div className={`p-2 md:p-3 rounded-sm ${iconBgActive}`}>
          <Headphones className={`w-5 h-5 md:w-6 md:h-6 ${iconColorActive}`} />
        </div>
        <div>
          <p className={labelClass}>CREATOR</p>
          <p className={`font-mono-tech text-xs uppercase tracking-wide ${valueActiveClass}`}>STUDIO_PB.NL</p>
        </div>
      </a>
    </div>
  );
}
