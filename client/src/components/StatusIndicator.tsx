import { Clock, Calendar, Radio, Headphones } from "lucide-react";

interface StatusIndicatorProps {
  isPlaying: boolean;
  isWeekday: boolean;
  isScheduledTime: boolean;
}

export default function StatusIndicator({ isPlaying, isWeekday, isScheduledTime }: StatusIndicatorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" data-testid="status-indicator">
      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-background">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${isPlaying ? "bg-chart-3/20" : "bg-[#c9c4c0]/30"}`}>
          <Radio className={`w-5 h-5 md:w-6 md:h-6 ${isPlaying ? "text-chart-3" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Radio Status</p>
          <p className={`text-sm md:text-base font-medium ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} data-testid="text-radio-status">
            {isPlaying ? "On" : "Off"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-background">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${isWeekday ? "bg-[#c9c4c0]/50" : "bg-[#c9c4c0]/30"}`}>
          <Calendar className={`w-5 h-5 md:w-6 md:h-6 ${isWeekday ? "text-[#444444]" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Day Type</p>
          <p className={`text-sm md:text-base font-medium ${isWeekday ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-day-type">
            {isWeekday ? "Weekday" : "Weekend"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-background">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${isScheduledTime ? "bg-[#c9c4c0]/50" : "bg-[#c9c4c0]/30"}`}>
          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isScheduledTime ? "text-[#444444]" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Schedule</p>
          <p className={`text-sm md:text-base font-medium ${isScheduledTime ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-schedule-status">
            {isScheduledTime ? "Active" : "Outside working hours"}
          </p>
        </div>
      </div>

      <a 
        href="https://studio.pb.nl" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-background hover-elevate active-elevate-2 transition-all"
        data-testid="link-radio-maker"
      >
        <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[#c9c4c0]/50">
          <Headphones className="w-5 h-5 md:w-6 md:h-6 text-[#444444]" />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Radio Maker</p>
          <p className="text-sm md:text-base font-medium text-foreground">STUDIO PB.NL</p>
        </div>
      </a>
    </div>
  );
}
