import { Music } from "lucide-react";

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
  if (!trackInfo) {
    return null;
  }

  return (
    <div 
      className="mt-4 p-3 md:p-4 rounded-lg border border-[#c9c4c0] bg-white/50 max-w-md mx-auto"
      data-testid="container-now-playing-track"
    >
      <div className="flex items-center gap-3">
        {trackInfo.cover ? (
          <img 
            src={trackInfo.cover} 
            alt={trackInfo.title}
            className="w-12 h-12 md:w-16 md:h-16 rounded object-cover"
            data-testid="img-track-cover"
          />
        ) : (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded bg-[#c9c4c0]/20 flex items-center justify-center">
            <Music className="w-6 h-6 md:w-8 md:h-8 text-[#444444]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p 
            className="text-sm md:text-base font-semibold text-[#444444] truncate"
            data-testid="text-track-title"
          >
            {trackInfo.title}
          </p>
          <p 
            className="text-xs md:text-sm text-muted-foreground truncate"
            data-testid="text-track-artist"
          >
            {trackInfo.artist}
          </p>
          {trackInfo.album && (
            <p 
              className="text-xs text-muted-foreground/80 truncate"
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
