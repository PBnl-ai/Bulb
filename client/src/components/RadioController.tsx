import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TimeDisplay from "./TimeDisplay";
import StatusIndicator from "./StatusIndicator";
import AudioWaveVisualizer from "./AudioWaveVisualizer";
import NowPlayingTrack from "./NowPlayingTrack";

const STREAM_URL = "https://play.radioking.io/perfectmoods/104227";

interface TrackInfo {
  title: string;
  artist: string;
  album?: string;
  cover?: string;
}

export default function RadioController() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
  const [startHour, setStartHour] = useState(() => {
    const saved = localStorage.getItem('radio-start-hour');
    return saved ? parseInt(saved) : 8;
  });
  const [startMinute, setStartMinute] = useState(() => {
    const saved = localStorage.getItem('radio-start-minute');
    return saved ? parseInt(saved) : 0;
  });
  const [endHour, setEndHour] = useState(() => {
    const saved = localStorage.getItem('radio-end-hour');
    return saved ? parseInt(saved) : 17;
  });
  const [endMinute, setEndMinute] = useState(() => {
    const saved = localStorage.getItem('radio-end-minute');
    return saved ? parseInt(saved) : 30;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const manualOverrideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isWeekday = () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  };

  const isScheduledTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Schema gaat over middernacht (bijvoorbeeld 22:00 - 02:00)
    if (endMinutes < startMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    
    // Normaal schema binnen dezelfde dag
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const shouldAutoPlay = () => {
    return isWeekday() && isScheduledTime();
  };

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.preload = "auto";
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };
    
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('error', handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (manualOverrideTimerRef.current) {
        clearTimeout(manualOverrideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('radio-start-hour', startHour.toString());
    localStorage.setItem('radio-start-minute', startMinute.toString());
    localStorage.setItem('radio-end-hour', endHour.toString());
    localStorage.setItem('radio-end-minute', endMinute.toString());
  }, [startHour, startMinute, endHour, endMinute]);

  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        const response = await fetch('https://api.radioking.io/widget/radio/perfectmoods/track/current');
        const data = await response.json();
        
        setTrackInfo({
          title: data.title || 'Onbekend',
          artist: data.artist || 'Onbekend',
          album: data.album,
          cover: data.cover
        });
      } catch (error) {
        console.error('Failed to fetch track info:', error);
      }
    };

    if (isPlaying) {
      fetchTrackInfo();
      const interval = setInterval(fetchTrackInfo, 30000);
      return () => clearInterval(interval);
    } else {
      setTrackInfo(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    const checkSchedule = () => {
      if (!isManualOverride) {
        if (shouldAutoPlay() && !isPlaying) {
          playRadio();
        } else if (!shouldAutoPlay() && isPlaying) {
          stopRadio();
        }
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, isManualOverride, startHour, startMinute, endHour, endMinute]);

  const playRadio = async (showError = false) => {
    if (audioRef.current) {
      try {
        audioRef.current.load();
        await audioRef.current.play();
      } catch (error) {
        console.error("Failed to play audio:", error);
        setIsPlaying(false);
        if (showError) {
          toast({
            title: "Audio fout",
            description: "Klik op de play knop om de radio te starten.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const stopRadio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleToggle = async () => {
    setIsManualOverride(true);
    
    if (isPlaying) {
      stopRadio();
    } else {
      await playRadio(true);
    }

    if (manualOverrideTimerRef.current) {
      clearTimeout(manualOverrideTimerRef.current);
    }
    
    manualOverrideTimerRef.current = setTimeout(() => {
      setIsManualOverride(false);
    }, 60000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-lg bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-6 md:p-10 space-y-4 md:space-y-5 overflow-hidden">
        <div className="text-center space-y-2 md:space-y-3">
          <img 
            src="/perfectmoods-logo.png" 
            alt="Perfect Moods" 
            className="h-12 md:h-24 mx-auto"
            data-testid="img-logo"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">
              <span className="text-[#c9c4c0]">PERFECT</span>
              <span className="text-[#444444]">MOODS</span>
            </h1>
            <h2 className="text-base md:text-xl font-light text-muted-foreground mt-1">Lounge webradio</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">The Finest lounge, chillout & Nujazz music 24/7</p>
          </div>
        </div>

        <TimeDisplay />

        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={handleToggle}
            className="relative w-58 h-58 md:w-68 md:h-68 cursor-pointer rounded-full border-6 md:border-8 border-[#c9c4c0] shadow-[0_8px_20px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.1)] overflow-hidden focus:outline-none focus:ring-4 focus:ring-[#c9c4c0]/50 transition-shadow"
            aria-label={isPlaying ? "Pauzeer radio" : "Start radio"}
            data-testid="button-toggle-radio"
          >
            <div 
              className={`absolute inset-0 ${isPlaying ? 'animate-spin-slow' : ''}`}
              style={{
                backgroundImage: trackInfo?.cover 
                  ? `url(${trackInfo.cover})` 
                  : 'linear-gradient(135deg, #c9c4c0 0%, #444444 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
              {isPlaying ? (
                <Pause 
                  style={{ width: '80px', height: '80px' }} 
                  className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:w-32 md:h-32" 
                  strokeWidth={1.5} 
                />
              ) : (
                <Play 
                  style={{ width: '80px', height: '80px', marginLeft: '8px' }} 
                  className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:w-32 md:h-32 md:ml-4 animate-play-bounce" 
                  strokeWidth={1.5} 
                />
              )}
            </div>
          </button>

          <div className="text-center flex flex-col gap-0.5 w-full">
            <p className={`text-xl md:text-2xl uppercase ${isPlaying ? "font-light text-[#c9c4c0] animate-sway" : "font-bold text-muted-foreground"}`} data-testid="text-now-playing">
              {isPlaying ? "Nu aan het spelen" : "Gestopt"}
            </p>
            <AudioWaveVisualizer isPlaying={isPlaying} />
            <p className="text-xs md:text-sm text-muted-foreground">320kbps High Quality Sound</p>
            <NowPlayingTrack trackInfo={trackInfo} />
          </div>
        </div>

        <StatusIndicator 
          isPlaying={isPlaying} 
          isWeekday={isWeekday()} 
          isScheduledTime={isScheduledTime()} 
        />

        <div className="p-4 md:p-6 rounded-2xl bg-background space-y-3">
          <h3 className="text-base md:text-lg font-medium text-foreground">Automatisch Schema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-3 md:space-y-4">
              <p className="text-sm md:text-base font-medium text-foreground">Werkdagen (Ma - Vr)</p>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Start tijd</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={startHour}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setStartHour(Math.min(23, Math.max(0, val)));
                      }}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-start-hour"
                    />
                    <span className="flex items-center text-foreground">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={startMinute}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setStartMinute(Math.min(59, Math.max(0, val)));
                      }}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-start-minute"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Stop tijd</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={endHour}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setEndHour(Math.min(23, Math.max(0, val)));
                      }}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-end-hour"
                    />
                    <span className="flex items-center text-foreground">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={endMinute}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setEndMinute(Math.min(59, Math.max(0, val)));
                      }}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-end-minute"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1 flex items-center">
              <div>
                <p className="text-sm md:text-base font-medium text-foreground">Weekend (Za - Zo)</p>
                <p className="text-xs md:text-sm text-muted-foreground">Geen automatisch afspelen</p>
              </div>
            </div>
          </div>
          {isManualOverride && (
            <div className="mt-3 md:mt-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-[#c9c4c0]/20 border border-[#c9c4c0]">
              <p className="text-xs md:text-sm text-[#444444] font-medium" data-testid="text-manual-override">
                Handmatige bediening actief - automatisch schema hervat over 1 minuut
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 font-light tracking-wide">
          COPYRIGHT STUDIO PB.NL 2025
        </p>
      </div>
    </div>
  );
}
