interface AudioWaveVisualizerProps {
  isPlaying: boolean;
}

export default function AudioWaveVisualizer({ isPlaying }: AudioWaveVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-16" data-testid="audio-wave-visualizer">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-primary rounded-full transition-all ${
            isPlaying ? "animate-wave" : "h-4"
          }`}
          style={{
            height: isPlaying ? "100%" : "16px",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
