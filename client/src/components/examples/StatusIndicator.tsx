import StatusIndicator from "../StatusIndicator";

export default function StatusIndicatorExample() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Playing on weekday during schedule</p>
        <StatusIndicator isPlaying={true} isWeekday={true} isScheduledTime={true} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Stopped on weekend</p>
        <StatusIndicator isPlaying={false} isWeekday={false} isScheduledTime={false} />
      </div>
    </div>
  );
}
