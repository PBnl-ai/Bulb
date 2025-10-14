interface AudioWaveVisualizerProps {
  isPlaying: boolean;
}

export default function AudioWaveVisualizer({ isPlaying }: AudioWaveVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-16 w-full max-w-xs mx-auto" data-testid="audio-wave-visualizer">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-primary rounded-full transition-all ${
            isPlaying ? "animate-wave" : "h-4"
          }`}
          style={{
            height: isPlaying ? "100%" : "16px",
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
