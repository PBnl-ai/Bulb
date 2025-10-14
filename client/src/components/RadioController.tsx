import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeDisplay from "./TimeDisplay";
import StatusIndicator from "./StatusIndicator";
import AudioWaveVisualizer from "./AudioWaveVisualizer";

const STREAM_URL = "https://play.radioking.io/perfectmoods/104227";

export default function RadioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(17);
  const [endMinute, setEndMinute] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isWeekday = () => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5;
  };

  const isScheduledTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-6">
          <img 
            src="/perfectmoods-logo.png" 
            alt="Perfect Moods" 
            className="h-16 md:h-24 mx-auto"
            data-testid="img-logo"
          />
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-foreground">Lounge Webradio</h2>
            <p className="text-muted-foreground mt-1">The Finest lounge, chillout & Nujazz music 24/7</p>
          </div>
        </div>

        <TimeDisplay />

        <div className="flex flex-col items-center gap-8">
          <Button
            size="icon"
            onClick={handleToggle}
            className="w-72 h-72 rounded-full transition-all bg-[#c9c4c0] hover:bg-[#c9c4c0]/90 shadow-[0_8px_20px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.1),inset_0_-4px_8px_rgba(0,0,0,0.1)]"
            data-testid="button-toggle-radio"
          >
            {isPlaying ? (
              <Pause style={{ width: '200px', height: '200px' }} className="text-[#444444]" strokeWidth={1.5} />
            ) : (
              <Play style={{ width: '200px', height: '200px', marginLeft: '16px' }} className="text-[#444444]" strokeWidth={1.5} />
            )}
          </Button>

          <div className="text-center space-y-3">
            <p className={`text-2xl md:text-3xl font-light ${isPlaying ? "text-chart-3" : "text-muted-foreground"}`} data-testid="text-now-playing">
              {isPlaying ? "Nu aan het spelen" : "Gestopt"}
            </p>
            <AudioWaveVisualizer isPlaying={isPlaying} />
            <p className="text-sm text-muted-foreground">320kbps High Quality Sound</p>
          </div>
        </div>

        <StatusIndicator 
          isPlaying={isPlaying} 
          isWeekday={isWeekday()} 
          isScheduledTime={isScheduledTime()} 
        />

        <div className="p-8 rounded-3xl bg-white border border-[#c9c4c0] shadow-lg space-y-6">
          <h3 className="text-xl font-light text-foreground">Automatisch Schema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="font-medium text-foreground">Werkdagen (Ma - Vr)</p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Start tijd</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={startHour}
                      onChange={(e) => setStartHour(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-start-hour"
                    />
                    <span className="flex items-center text-foreground">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={startMinute}
                      onChange={(e) => setStartMinute(parseInt(e.target.value) || 0)}
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
                      onChange={(e) => setEndHour(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-end-hour"
                    />
                    <span className="flex items-center text-foreground">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={endMinute}
                      onChange={(e) => setEndMinute(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-[#c9c4c0] rounded-lg text-center bg-white"
                      data-testid="input-end-minute"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1 flex items-center">
              <div>
                <p className="font-medium text-foreground">Weekend (Za - Zo)</p>
                <p className="text-sm text-muted-foreground">Geen automatisch afspelen</p>
              </div>
            </div>
          </div>
          {isManualOverride && (
            <div className="mt-4 p-4 rounded-2xl bg-[#c9c4c0]/20 border border-[#c9c4c0]">
              <p className="text-sm text-[#444444] font-medium" data-testid="text-manual-override">
                Handmatige bediening actief - automatisch schema hervat over 1 minuut
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
