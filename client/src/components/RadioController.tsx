import { useEffect, useState, useRef } from "react";
import { Play, Pause, Info, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "./ThemeProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const { theme, toggleTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(false);
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

    // Audio unlock on first user interaction
    const unlockAudio = async () => {
      if (!audioRef.current || audioUnlocked) return;
      
      try {
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioUnlocked(true);
        console.log('Audio unlocked!');
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      }
    };

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

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
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, [audioUnlocked]);

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
      if (!isManualOverride && audioUnlocked) {
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
  }, [isPlaying, isManualOverride, audioUnlocked, startHour, startMinute, endHour, endMinute]);

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
            title: "Audio Error",
            description: "Click the play button to start the radio.",
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

  const isDark = theme === "dark";
  const cornerClass = isDark ? "dark" : "light";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 relative ${
      isDark ? "bg-[#050505] aura-tech-grid-dark" : "bg-[#fafafa] aura-tech-grid-light"
    }`}>
      <div className={`fixed inset-0 pointer-events-none ${isDark ? "bg-gradient-radial from-transparent to-black/60" : "bg-gradient-radial from-transparent to-white/40"}`} />
      <div className={`fixed inset-0 pointer-events-none ${isDark ? "aura-scanline-dark" : "aura-scanline-light"}`} />
      
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 transition-colors z-20 rounded-sm ${
          isDark 
            ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20" 
            : "bg-black/5 border border-[#c9c4c0]/40 hover:bg-black/10 hover:border-[#c9c4c0]/60"
        }`}
        aria-label="Toggle theme"
        data-testid="button-toggle-theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-neutral-400 hover:text-white" />
        ) : (
          <Moon className="w-5 h-5 text-[#444444]" />
        )}
      </button>
      
      <div className={`relative w-full max-w-[28.625rem] md:max-w-[32.625rem] p-6 md:p-10 space-y-4 md:space-y-5 z-10 backdrop-blur-xl rounded-sm border ${
        isDark 
          ? "bg-black/40 border-white/[0.08]" 
          : "bg-white/70 border-[#c9c4c0]/30"
      }`}>
        <div className={`aura-corner-tl-${cornerClass}`} />
        <div className={`aura-corner-tr-${cornerClass}`} />
        <div className={`aura-corner-bl-${cornerClass}`} />
        <div className={`aura-corner-br-${cornerClass}`} />
        
        <div className="text-center space-y-0.5 md:space-y-1">
          <img 
            src="/perfectmoods-logo.png" 
            alt="Perfect Moods" 
            className={`h-[3.6rem] md:h-[7.2rem] mx-auto ${isDark ? "brightness-150 opacity-90" : ""}`}
            data-testid="img-logo"
          />
          <div>
            <h1 className="text-[2.7rem] md:text-[3.6rem] uppercase tracking-wider leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              <span className="text-[#c9c4c0]">PERFECT</span>
              <span className={isDark ? "text-white" : "text-[#444444]"}>MOODS</span>
            </h1>
            <h2 className={`font-mono-tech text-[10px] uppercase tracking-[0.2em] mt-0 ${isDark ? "text-neutral-500" : "text-[#444444]/60"}`}>
              LOUNGE_WEBRADIO
            </h2>
            <p className={`font-mono-tech text-[9px] mt-1 ${isDark ? "text-neutral-600" : "text-[#444444]/50"}`}>
              The Finest lounge, chillout & Nujazz music 24/7
            </p>
          </div>
        </div>

        <TimeDisplay />

        {!audioUnlocked && (
          <div className={`p-3 text-center animate-pulse rounded-sm border border-dashed ${
            isDark ? "bg-white/5 border-white/20" : "bg-[#c9c4c0]/10 border-[#c9c4c0]/40"
          }`} data-testid="banner-unlock-audio">
            <p className={`font-mono-tech text-[10px] uppercase tracking-widest ${isDark ? "text-neutral-400" : "text-[#444444]/70"}`}>
              [ TAP_TO_UNLOCK_AUDIO ]
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={handleToggle}
            className={`relative w-[14.5rem] h-[14.5rem] md:w-[17rem] md:h-[17rem] cursor-pointer overflow-hidden focus:outline-none transition-all rounded-full border-2 ${
              isDark 
                ? "border-[#c9c4c0]/30 shadow-[0_0_40px_rgba(201,196,192,0.15)] hover:border-[#c9c4c0]/50 hover:shadow-[0_0_60px_rgba(201,196,192,0.25)]"
                : "border-[#c9c4c0]/50 shadow-[0_0_40px_rgba(201,196,192,0.2)] hover:border-[#c9c4c0]/70 hover:shadow-[0_0_60px_rgba(201,196,192,0.3)]"
            }`}
            aria-label={isPlaying ? "Pause radio" : "Start radio"}
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

          <div className="w-full">
            <div className="text-center flex flex-col gap-0.5">
              <p className={`font-mono-tech text-xs uppercase tracking-widest ${isPlaying ? "text-[#c9c4c0]" : (isDark ? "text-neutral-600" : "text-[#444444]/50")}`} data-testid="text-now-playing">
                {isPlaying ? "[ NOW_PLAYING ]" : "[ STREAM_IDLE ]"}
              </p>
              <AudioWaveVisualizer isPlaying={isPlaying} />
              <p className={`font-mono-tech text-[9px] uppercase tracking-wider ${isDark ? "text-neutral-600" : "text-[#444444]/50"}`}>
                320KBPS_HQ_STREAM
              </p>
            </div>
            <NowPlayingTrack trackInfo={trackInfo} />
          </div>
        </div>

        <StatusIndicator 
          isPlaying={isPlaying} 
          isWeekday={isWeekday()} 
          isScheduledTime={isScheduledTime()} 
        />

        <div className={`p-4 md:p-6 space-y-3 rounded-sm border ${
          isDark ? "bg-neutral-900/30 border-white/[0.05]" : "bg-black/[0.03] border-[#c9c4c0]/20"
        }`}>
          <div className="space-y-3">
            <p className={`font-mono-tech text-[10px] uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-[#444444]/60"}`}>
              SCHEDULE_CONFIG
            </p>
            <div className="space-y-3">
              <p className={`font-mono-tech text-[9px] uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-[#444444]/70"}`}>
                MON-FRI_ACTIVE
              </p>
              <div className="space-y-2">
                <div>
                  <label className={`block mb-1 font-mono-tech text-[9px] uppercase tracking-wider ${isDark ? "text-neutral-600" : "text-[#444444]/50"}`}>
                    START:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={startHour}
                      onChange={(e) => {
                        if (e.target.value === '') return;
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setStartHour(Math.min(23, Math.max(0, val)));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setStartHour(0);
                        }
                      }}
                      className={`w-20 px-3 py-2 border text-center rounded-sm font-mono-tech ${
                        isDark 
                          ? "border-white/10 bg-black/40 text-white" 
                          : "border-[#c9c4c0]/40 bg-white/50 text-[#444444]"
                      }`}
                      data-testid="input-start-hour"
                    />
                    <span className={`flex items-center ${isDark ? "text-neutral-500" : "text-[#444444]/50"}`}>:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={startMinute}
                      onChange={(e) => {
                        if (e.target.value === '') return;
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setStartMinute(Math.min(59, Math.max(0, val)));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setStartMinute(0);
                        }
                      }}
                      className={`w-20 px-3 py-2 border text-center rounded-sm font-mono-tech ${
                        isDark 
                          ? "border-white/10 bg-black/40 text-white" 
                          : "border-[#c9c4c0]/40 bg-white/50 text-[#444444]"
                      }`}
                      data-testid="input-start-minute"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1 font-mono-tech text-[9px] uppercase tracking-wider ${isDark ? "text-neutral-600" : "text-[#444444]/50"}`}>
                    STOP:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={endHour}
                      onChange={(e) => {
                        if (e.target.value === '') return;
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setEndHour(Math.min(23, Math.max(0, val)));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setEndHour(0);
                        }
                      }}
                      className={`w-20 px-3 py-2 border text-center rounded-sm font-mono-tech ${
                        isDark 
                          ? "border-white/10 bg-black/40 text-white" 
                          : "border-[#c9c4c0]/40 bg-white/50 text-[#444444]"
                      }`}
                      data-testid="input-end-hour"
                    />
                    <span className={`flex items-center ${isDark ? "text-neutral-500" : "text-[#444444]/50"}`}>:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={endMinute}
                      onChange={(e) => {
                        if (e.target.value === '') return;
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setEndMinute(Math.min(59, Math.max(0, val)));
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setEndMinute(0);
                        }
                      }}
                      className={`w-20 px-3 py-2 border text-center rounded-sm font-mono-tech ${
                        isDark 
                          ? "border-white/10 bg-black/40 text-white" 
                          : "border-[#c9c4c0]/40 bg-white/50 text-[#444444]"
                      }`}
                      data-testid="input-end-minute"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className={`font-mono-tech text-[9px] uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-[#444444]/70"}`}>
                SAT-SUN_INACTIVE
              </p>
              <p className={`font-mono-tech text-[8px] ${isDark ? "text-neutral-600" : "text-[#444444]/50"}`}>
                // NO_AUTO_PLAY
              </p>
            </div>
          </div>
          {isManualOverride && (
            <div className={`mt-3 md:mt-4 p-3 md:p-4 rounded-sm border border-dashed ${
              isDark ? "bg-[#c9c4c0]/10 border-[#c9c4c0]/40" : "bg-[#c9c4c0]/15 border-[#c9c4c0]/50"
            }`}>
              <p className={`font-mono-tech text-[10px] uppercase tracking-widest text-[#c9c4c0]`} data-testid="text-manual-override">
                [ MANUAL_OVERRIDE_ACTIVE ] // RESUME: 60s
              </p>
            </div>
          )}
        </div>

        <div className="text-center space-y-1">
          <Dialog>
            <DialogTrigger asChild>
              <button 
                className={`text-xs transition-colors underline flex items-center gap-1 mx-auto ${
                  theme === "light" ? "text-[#c9c4c0] hover:text-[#444444]" : "text-[#c9c4c0] hover:text-white"
                }`}
                data-testid="button-autostart-instructions"
              >
                <Info className="w-3 h-3" />
                Autostart Instructions
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className={`text-2xl ${theme === "light" ? "text-[#444444]" : "text-white"}`}>Automatic Radio Playback Setup</DialogTitle>
                <DialogDescription className="text-base">
                  Choose the best method for your canteen to enable automatic radio control
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-[#c9c4c0]/10 rounded-lg border border-[#c9c4c0]/30">
                    <div className="w-8 h-8 rounded-full bg-[#c9c4c0] text-white flex items-center justify-center font-bold shrink-0">1</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-[#444444] text-lg">Safari Settings (Recommended)</h3>
                      <p className="text-sm text-muted-foreground">Easiest option for iPad - one-time setup, works forever:</p>
                      <ol className="text-sm space-y-1 list-decimal list-inside ml-2 text-foreground">
                        <li>Open <strong>Settings</strong> app on iPad</li>
                        <li>Scroll down to <strong>Safari</strong></li>
                        <li>Tap <strong>Settings for Websites</strong></li>
                        <li>Select <strong>Auto-Play</strong></li>
                        <li>Find this website and select <strong>"Allow All Auto-Play"</strong></li>
                      </ol>
                      <p className="text-sm font-medium text-[#c9c4c0] mt-2">✓ After this, radio starts automatically every day!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#c9c4c0]/10 rounded-lg border border-[#c9c4c0]/30">
                    <div className="w-8 h-8 rounded-full bg-[#c9c4c0] text-white flex items-center justify-center font-bold shrink-0">2</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-[#444444] text-lg">Keep Page Open 24/7</h3>
                      <p className="text-sm text-muted-foreground">Leave iPad on with this page open:</p>
                      <ol className="text-sm space-y-1 list-decimal list-inside ml-2 text-foreground">
                        <li>Tap anywhere on the page <strong>once</strong> (unlocks audio)</li>
                        <li>Leave page open - <strong>do NOT refresh/reload</strong></li>
                        <li>Enable <strong>"Prevent Auto-Lock"</strong> in iPad settings</li>
                        <li>Keep iPad plugged in to power</li>
                      </ol>
                      <p className="text-sm font-medium text-[#c9c4c0] mt-2">✓ Radio works automatically as long as page stays open</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#c9c4c0]/10 rounded-lg border border-[#c9c4c0]/30">
                    <div className="w-8 h-8 rounded-full bg-[#c9c4c0] text-white flex items-center justify-center font-bold shrink-0">3</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-[#444444] text-lg">Kiosk Browser App</h3>
                      <p className="text-sm text-muted-foreground">Professional solution for dedicated displays:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside ml-2 text-foreground">
                        <li>Install kiosk browser from App Store (e.g., "Kiosk Pro", "Fully Kiosk Browser")</li>
                        <li>Configure to auto-load this website</li>
                        <li>Enable auto-play permissions in kiosk settings</li>
                        <li>Set to prevent sleep/lock</li>
                      </ul>
                      <p className="text-sm font-medium text-[#c9c4c0] mt-2">✓ Best for permanent canteen displays</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[#c9c4c0]/10 rounded-lg border border-[#c9c4c0]/30">
                    <div className="w-8 h-8 rounded-full bg-[#c9c4c0] text-white flex items-center justify-center font-bold shrink-0">4</div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-[#444444] text-lg">Guided Access Mode (iOS)</h3>
                      <p className="text-sm text-muted-foreground">Lock iPad to this app only:</p>
                      <ol className="text-sm space-y-1 list-decimal list-inside ml-2 text-foreground">
                        <li>Go to <strong>Settings → Accessibility → Guided Access</strong></li>
                        <li>Enable Guided Access and set a passcode</li>
                        <li>Open this page in Safari</li>
                        <li>Triple-click home/side button to start Guided Access</li>
                      </ol>
                      <p className="text-sm font-medium text-[#c9c4c0] mt-2">✓ Prevents accidental app switching</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Browser security prevents automatic audio without user interaction. 
                    Choose one of the methods above for the best experience in your canteen.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <p className="text-xs text-muted-foreground/60 font-light tracking-wide">
            COPYRIGHT STUDIO PB.NL 2025
          </p>
        </div>
      </div>
    </div>
  );
}
