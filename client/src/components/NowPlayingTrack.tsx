import { Music } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  cover?: string;
}

interface NowPlayingTrackProps {
  trackInfo: TrackInfo | null;
}

export default function NowPlayingTrack({ trackInfo }: NowPlayingTrackProps) {
  const { theme } = useTheme();
  
  if (!trackInfo) {
    return null;
  }

  return (
    <div 
      className={`mt-4 p-3 md:p-4 w-full ${
        theme === "light" 
          ? "rounded-lg border border-[#c9c4c0] bg-white/50" 
          : "rounded-sm border border-white/[0.08] bg-black/30"
      }`}
      data-testid="container-now-playing-track"
    >
      <div className="flex items-center gap-3">
        {trackInfo.cover ? (
          <img 
            src={trackInfo.cover} 
            alt={trackInfo.title}
            className={`w-12 h-12 md:w-16 md:h-16 object-cover ${theme === "light" ? "rounded" : "rounded-sm"}`}
            data-testid="img-track-cover"
          />
        ) : (
          <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center ${
            theme === "light" ? "rounded bg-[#c9c4c0]/20" : "rounded-sm bg-white/5"
          }`}>
            <Music className={`w-6 h-6 md:w-8 md:h-8 ${theme === "light" ? "text-[#444444]" : "text-neutral-500"}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p 
            className={`truncate ${
              theme === "light" 
                ? "text-sm md:text-base font-semibold text-[#444444]" 
                : "font-mono-tech text-xs text-white uppercase tracking-wide"
            }`}
            data-testid="text-track-title"
          >
            {trackInfo.title}
          </p>
          <p 
            className={`truncate ${
              theme === "light" 
                ? "text-xs md:text-sm text-muted-foreground" 
                : "font-mono-tech text-[10px] text-neutral-500"
            }`}
            data-testid="text-track-artist"
          >
            {trackInfo.artist}
          </p>
          {trackInfo.album && (
            <p 
              className={`truncate ${
                theme === "light" 
                  ? "text-xs text-muted-foreground/80" 
                  : "font-mono-tech text-[9px] text-neutral-600"
              }`}
              data-testid="text-track-album"
            >
              {trackInfo.album}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
