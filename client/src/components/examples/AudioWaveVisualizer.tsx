import AudioWaveVisualizer from "../AudioWaveVisualizer";

export default function AudioWaveVisualizerExample() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Playing</p>
        <AudioWaveVisualizer isPlaying={true} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Stopped</p>
        <AudioWaveVisualizer isPlaying={false} />
      </div>
    </div>
  );
}
