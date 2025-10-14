import { Clock, Calendar, Radio } from "lucide-react";

interface StatusIndicatorProps {
  isPlaying: boolean;
  isWeekday: boolean;
  isScheduledTime: boolean;
}

export default function StatusIndicator({ isPlaying, isWeekday, isScheduledTime }: StatusIndicatorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="status-indicator">
      <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-card-border">
        <div className={`p-3 rounded-xl ${isPlaying ? "bg-chart-3/20" : "bg-muted"}`}>
          <Radio className={`w-6 h-6 ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Radio Status</p>
          <p className={`text-lg font-semibold ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} data-testid="text-radio-status">
            {isPlaying ? "Aan" : "Uit"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-card-border">
        <div className={`p-3 rounded-xl ${isWeekday ? "bg-primary/20" : "bg-muted"}`}>
          <Calendar className={`w-6 h-6 ${isWeekday ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Dag Type</p>
          <p className={`text-lg font-semibold ${isWeekday ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-day-type">
            {isWeekday ? "Werkdag" : "Weekend"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-card-border">
        <div className={`p-3 rounded-xl ${isScheduledTime ? "bg-primary/20" : "bg-muted"}`}>
          <Clock className={`w-6 h-6 ${isScheduledTime ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Schema</p>
          <p className={`text-lg font-semibold ${isScheduledTime ? "text-foreground" : "text-muted-foreground"}`} data-testid="text-schedule-status">
            {isScheduledTime ? "08:00 - 17:30" : "Buiten tijden"}
          </p>
        </div>
      </div>
    </div>
  );
}
