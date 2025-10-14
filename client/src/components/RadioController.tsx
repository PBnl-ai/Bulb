import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TimeDisplay from "./TimeDisplay";
import StatusIndicator from "./StatusIndicator";
import AudioWaveVisualizer from "./AudioWaveVisualizer";

const STREAM_URL = "https://play.radioking.io/perfectmoods/104227";

export default function RadioController() {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-6 md:space-y-12">
        <div className="text-center space-y-3 md:space-y-6">
          <img 
            src="/perfectmoods-logo.png" 
            alt="Perfect Moods" 
            className="h-12 md:h-24 mx-auto"
            data-testid="img-logo"
          />
          <div>
            <h1 className="text-5xl md:text-8xl font-bold text-foreground">PerfectMoods</h1>
            <h2 className="text-base md:text-xl font-light text-muted-foreground mt-1">Lounge webradio</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">The Finest lounge, chillout & Nujazz music 24/7</p>
          </div>
        </div>

        <TimeDisplay />

        <div className="flex flex-col items-center gap-4 md:gap-8">
          <Button
            size="icon"
            onClick={handleToggle}
            className="w-48 h-48 md:w-72 md:h-72 rounded-full transition-all bg-[#c9c4c0] hover:bg-[#c9c4c0]/90 shadow-[0_8px_20px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.1),inset_0_-4px_8px_rgba(0,0,0,0.1)]"
            data-testid="button-toggle-radio"
          >
            {isPlaying ? (
              <Pause style={{ width: '98px', height: '98px' }} className="text-[#444444] md:w-48 md:h-48" strokeWidth={1.5} />
            ) : (
              <Play style={{ width: '98px', height: '98px', marginLeft: '8px' }} className="text-[#444444] md:w-48 md:h-48 md:ml-4" strokeWidth={1.5} />
            )}
          </Button>

          <div className="text-center flex flex-col gap-0.5 md:gap-1">
            <p className={`text-xl md:text-3xl ${isPlaying ? "font-light text-chart-3" : "font-bold text-muted-foreground"}`} data-testid="text-now-playing">
              {isPlaying ? "Nu aan het spelen" : "Gestopt"}
            </p>
            <AudioWaveVisualizer isPlaying={isPlaying} />
            <p className="text-xs md:text-sm text-muted-foreground">320kbps High Quality Sound</p>
          </div>
        </div>

        <StatusIndicator 
          isPlaying={isPlaying} 
          isWeekday={isWeekday()} 
          isScheduledTime={isScheduledTime()} 
        />

        <div className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#c9c4c0] shadow-lg space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-light text-foreground">Automatisch Schema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      </div>
    </div>
  );
}
