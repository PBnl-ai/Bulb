import { Clock, Calendar, Radio } from "lucide-react";

interface StatusIndicatorProps {
  isPlaying: boolean;
  isWeekday: boolean;
  isScheduledTime: boolean;
}

export default function StatusIndicator({ isPlaying, isWeekday, isScheduledTime }: StatusIndicatorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4" data-testid="status-indicator">
      <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-[#c9c4c0] shadow-sm">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${isPlaying ? "bg-chart-3/20" : "bg-[#c9c4c0]/30"}`}>
          <Radio className={`w-5 h-5 md:w-6 md:h-6 ${isPlaying ? "text-chart-3" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Radio Status</p>
          <p className={`text-base md:text-lg font-medium ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} data-testid="text-radio-status">
            {isPlaying ? "Aan" : "Uit"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-[#c9c4c0] shadow-sm">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${isWeekday ? "bg-[#c9c4c0]/50" : "bg-[#c9c4c0]/30"}`}>
          <Calendar className={`w-5 h-5 md:w-6 md:h-6 ${isWeekday ? "text-[#444444]" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Dag Type</p>
          <p className={`text-base md:text-lg font-medium ${isWeekday ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-day-type">
            {isWeekday ? "Werkdag" : "Weekend"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-[#c9c4c0] shadow-sm">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${isScheduledTime ? "bg-[#c9c4c0]/50" : "bg-[#c9c4c0]/30"}`}>
          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isScheduledTime ? "text-[#444444]" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Schema</p>
          <p className={`text-base md:text-lg font-medium ${isScheduledTime ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-schedule-status">
            {isScheduledTime ? "Actief" : "Het is buiten werktijd"}
          </p>
        </div>
      </div>
    </div>
  );
}
