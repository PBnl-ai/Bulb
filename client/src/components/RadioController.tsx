import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeDisplay from "./TimeDisplay";
import StatusIndicator from "./StatusIndicator";
import AudioWaveVisualizer from "./AudioWaveVisualizer";

const STREAM_URL = "https://play.radioking.io/perfectmoods/104227";
const START_HOUR = 8;
const START_MINUTE = 0;
const END_HOUR = 17;
const END_MINUTE = 30;

export default function RadioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isWeekday = () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  };

  const isScheduledTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = START_HOUR * 60 + START_MINUTE;
    const endMinutes = END_HOUR * 60 + END_MINUTE;
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const shouldAutoPlay = () => {
    return isWeekday() && isScheduledTime();
  };

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.preload = "none";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
    const interval = setInterval(checkSchedule, 30000);

    return () => clearInterval(interval);
  }, [isPlaying, isManualOverride]);

  const playRadio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  };

  const stopRadio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggle = async () => {
    setIsManualOverride(true);
    
    if (isPlaying) {
      stopRadio();
    } else {
      await playRadio();
    }

    setTimeout(() => {
      setIsManualOverride(false);
    }, 60000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-6 py-2 rounded-full bg-primary/20 border border-primary/30">
            <p className="text-primary font-semibold text-lg" data-testid="text-brand">Perfect Moods Radio</p>
          </div>
        </div>

        <TimeDisplay />

        <div className="flex flex-col items-center gap-8">
          <Button
            size="icon"
            onClick={handleToggle}
            className={`w-48 h-48 md:w-64 md:h-64 rounded-full transition-all shadow-2xl ${
              isPlaying
                ? "bg-primary hover:bg-primary border-4 border-primary-border"
                : "bg-muted hover:bg-muted border-4 border-muted-border"
            }`}
            data-testid="button-toggle-radio"
          >
            {isPlaying ? (
              <Pause className="w-24 h-24 md:w-32 md:h-32 text-primary-foreground" />
            ) : (
              <Play className="w-24 h-24 md:w-32 md:h-32 text-muted-foreground ml-2" />
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className={`text-3xl font-bold ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} data-testid="text-now-playing">
              {isPlaying ? "Nu aan het spelen" : "Gestopt"}
            </p>
            <AudioWaveVisualizer isPlaying={isPlaying} />
          </div>
        </div>

        <StatusIndicator 
          isPlaying={isPlaying} 
          isWeekday={isWeekday()} 
          isScheduledTime={isScheduledTime()} 
        />

        <div className="p-8 rounded-2xl bg-card border border-card-border space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Automatisch Schema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Werkdagen (Ma - Vr)</p>
              <p>Start: 08:00</p>
              <p>Stop: 17:30</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Weekend (Za - Zo)</p>
              <p>Geen automatisch afspelen</p>
            </div>
          </div>
          {isManualOverride && (
            <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-primary font-medium" data-testid="text-manual-override">
                Handmatige bediening actief - automatisch schema hervat over 1 minuut
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
