import { Clock, Calendar, Radio } from "lucide-react";

interface StatusIndicatorProps {
  isPlaying: boolean;
  isWeekday: boolean;
  isScheduledTime: boolean;
}

export default function StatusIndicator({ isPlaying, isWeekday, isScheduledTime }: StatusIndicatorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="status-indicator">
      <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#c9c4c0] shadow-sm">
        <div className={`p-3 rounded-xl ${isPlaying ? "bg-chart-3/20" : "bg-[#c9c4c0]/30"}`}>
          <Radio className={`w-6 h-6 ${isPlaying ? "text-chart-3" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Radio Status</p>
          <p className={`text-lg font-medium ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} data-testid="text-radio-status">
            {isPlaying ? "Aan" : "Uit"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#c9c4c0] shadow-sm">
        <div className={`p-3 rounded-xl ${isWeekday ? "bg-[#c9c4c0]/50" : "bg-[#c9c4c0]/30"}`}>
          <Calendar className={`w-6 h-6 ${isWeekday ? "text-[#444444]" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Dag Type</p>
          <p className={`text-lg font-medium ${isWeekday ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-day-type">
            {isWeekday ? "Werkdag" : "Weekend"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#c9c4c0] shadow-sm">
        <div className={`p-3 rounded-xl ${isScheduledTime ? "bg-[#c9c4c0]/50" : "bg-[#c9c4c0]/30"}`}>
          <Clock className={`w-6 h-6 ${isScheduledTime ? "text-[#444444]" : "text-[#444444]/60"}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Schema</p>
          <p className={`text-lg font-medium ${isScheduledTime ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-schedule-status">
            {isScheduledTime ? "Actief" : "Buiten tijden"}
          </p>
        </div>
      </div>
    </div>
  );
}
