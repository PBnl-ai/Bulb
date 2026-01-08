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
  const isDark = theme === "dark";
  
  if (!trackInfo) {
    return null;
  }

  return (
    <div 
      className={`mt-4 p-3 md:p-4 w-full rounded-sm border ${
        isDark 
          ? "border-white/[0.08] bg-black/30" 
          : "border-[#c9c4c0]/30 bg-black/[0.03]"
      }`}
      data-testid="container-now-playing-track"
    >
      <div className="flex items-center gap-3">
        {trackInfo.cover ? (
          <img 
            src={trackInfo.cover} 
            alt={trackInfo.title}
            className={`w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border-2 ${isDark ? "border-[#c9c4c0]/30" : "border-[#c9c4c0]/50"}`}
            data-testid="img-track-cover"
          />
        ) : (
          <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border-2 ${
            isDark ? "border-[#c9c4c0]/30 bg-white/5" : "border-[#c9c4c0]/50 bg-[#c9c4c0]/20"
          }`}>
            <Music className={`w-6 h-6 md:w-8 md:h-8 ${isDark ? "text-neutral-500" : "text-[#444444]"}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p 
            className={`font-mono-tech text-xs uppercase tracking-wide truncate ${isDark ? "text-white" : "text-[#444444]"}`}
            data-testid="text-track-title"
          >
            {trackInfo.title}
          </p>
          <p 
            className={`font-mono-tech text-[10px] truncate ${isDark ? "text-neutral-500" : "text-[#444444]/60"}`}
            data-testid="text-track-artist"
          >
            {trackInfo.artist}
          </p>
          {trackInfo.album && (
            <p 
              className={`font-mono-tech text-[9px] truncate ${isDark ? "text-neutral-600" : "text-[#444444]/40"}`}
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
