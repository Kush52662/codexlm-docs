
import React, { useState, useEffect, useMemo, useRef } from "react";
import { MousePointer2, LayoutDashboard, BarChart2, Users, Settings, Briefcase, Search, Bell, Grid, ChevronDown, User, Star, Plus, CheckCircle2, Mic, Video, MonitorUp, PhoneOff, ChevronRight, Clock, Maximize2, Minimize2, Radio, Send, PlayCircle, PauseCircle, PictureInPicture, Mail, Split, GitFork, ArrowLeft, Bot, Sparkles, Database, Zap, Code2, Play, FileText, UploadCloud, Wand2, Layers, PenTool, LayoutTemplate, MoreHorizontal, ArrowUpRight, MousePointerClick } from "lucide-react";
import { DESIGN_SYSTEM } from "./constants";
import { MockField, MockWindow, GlassCard, BrowserShell, StatusBadge } from "./Primitives";
import { PeazyTrainerPanel } from "./Helpers";
import laptopFrame from "./assets/peazy-laptop-frame.svg";

export function InteractiveGridBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);
  const [squares, setSquares] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    const handleMouseMove = (e: globalThis.MouseEvent) => {
       document.documentElement.style.setProperty('--grid-mouse-x', `${e.clientX}px`);
       document.documentElement.style.setProperty('--grid-mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const triggerRipple = () => {
        const cols = Math.ceil(window.innerWidth / 40);
        const rows = Math.ceil(window.innerHeight / 40);
        const x = Math.floor(Math.random() * cols) * 40;
        const y = Math.floor(Math.random() * rows) * 40;
        const id = Date.now();
        setRipples(prev => [...prev, {x, y, id}]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 3000); 
    };
    let timeoutId: any;
    const scheduleNext = () => {
        const delay = 3000 + Math.random() * 1000;
        timeoutId = setTimeout(() => { triggerRipple(); scheduleNext(); }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const triggerHighlight = () => {
        const cols = Math.ceil(window.innerWidth / 40);
        const rows = Math.ceil(window.innerHeight / 40);
        const count = 5 + Math.floor(Math.random() * 2);
        const newSquares = Array.from({ length: count }).map((_, i) => ({
          x: Math.floor(Math.random() * cols) * 40,
          y: Math.floor(Math.random() * rows) * 40,
          id: Date.now() + i
        }));
        setSquares(prev => [...prev, ...newSquares]);
        setTimeout(() => {
             const ids = newSquares.map(s => s.id);
             setSquares(prev => prev.filter(s => !ids.includes(s.id)));
        }, 4000); 
    };
    const interval = setInterval(triggerHighlight, 2500);
    return () => clearInterval(interval);
  }, []);

  const offsetY = -(scrollY * 0.1);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#FAFAFA' }}>
        <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${offsetY}px)` }}>
            <div className="absolute inset-0" style={{
                backgroundSize: '40px 40px',
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)'
            }} />
            {squares.map(s => (
                <div key={s.id} className="absolute bg-[#F0F0F0] animate-square-fade" style={{ left: s.x, top: s.y, width: 39, height: 39, marginLeft: 1, marginTop: 1, borderRadius: DESIGN_SYSTEM.radius.xs }} />
            ))}
            {ripples.map(r => (
                <div key={r.id} className="animate-ripple" style={{ left: r.x, top: r.y }} />
            ))}
        </div>
        <div className="absolute inset-0 w-full h-full" style={{ 
                maskImage: 'radial-gradient(200px circle at var(--grid-mouse-x, 50%) var(--grid-mouse-y, 50%), black, transparent)',
                WebkitMaskImage: 'radial-gradient(200px circle at var(--grid-mouse-x, 50%) var(--grid-mouse-y, 50%), black, transparent)'
            }}>
            <div className="absolute inset-0" style={{
                    transform: `translateY(${offsetY}px)`,
                    backgroundSize: '40px 40px',
                    backgroundImage: `linear-gradient(to right, ${DESIGN_SYSTEM.colors.primary}15 1px, transparent 1px), linear-gradient(to bottom, ${DESIGN_SYSTEM.colors.primary}15 1px, transparent 1px)`
                }}
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA]/80 pointer-events-none" />
    </div>
  );
}

/**
 * AUTONOMOUS STUDIO CARD
 * Self-cycling animation: Upload -> Process -> Edit Blocks -> Publish
 */
export function WorkshopCreationCard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const BASE_WIDTH = 1000;
    const BASE_HEIGHT = 562.5;

// 0: Import, 1: Create, 2: Sandbox, 3: Publish
    const [phase, setPhase] = useState(0);
    const phases = ["Import with AI", "Create slide by slide", "Test in sandbox", "Publish to users"];
    const topTabs = ["Create", "Edit", "Collaborate", "Publish"];
    const activeTabIndex = [0, 1, 2, 3][phase] ?? 0;

    useEffect(() => {
        let animationFrameId: number;
        const updateScale = () => {
            if (!containerRef.current) return;
            const currentWidth = containerRef.current.offsetWidth;
            setScale(currentWidth / BASE_WIDTH);
        };
        updateScale();
        const observer = new ResizeObserver(() => {
            animationFrameId = requestAnimationFrame(updateScale);
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        let timer: any;
        
        const nextStep = () => {
            setPhase(prevPhase => {
                const next = (prevPhase + 1) % 4;
                const duration = next === 0 ? 2000 : 3500;
                timer = setTimeout(nextStep, duration);
                return next;
            });
        };

        timer = setTimeout(nextStep, 2000);
        return () => clearTimeout(timer);
    }, []);

    const renderMainPanel = () => {
        if (phase === 0) {
            return (
                <div className="w-full h-full flex flex-col">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Import with AI</div>
                    <p className="text-[12px] text-slate-500 mb-5">Select the file you'd like to transform.</p>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { title: "Upload a file", icon: UploadCloud, list: ["PDFs", "PPTX", "Videos"] },
                            { title: "Import from Drive", icon: Database, list: ["Google Slides", "Docs"] },
                            { title: "Import from URL", icon: Split, list: ["Web pages", "Articles"] },
                        ].map((card) => {
                            const Icon = card.icon;
                            return (
                                <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="text-[12px] font-semibold text-slate-800 mb-2">{card.title}</div>
                                    <div className="space-y-1.5 text-[10px] text-slate-500">
                                        {card.list.map(item => (
                                            <div key={item} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (phase === 1) {
            return (
                <div className="w-full h-full flex flex-col">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Create training slide by slide</div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] font-bold">
                                    {idx}
                                </div>
                                <div className="flex-grow">
                                    <div className="text-[12px] font-semibold text-slate-800">Slide {idx}</div>
                                    <div className="text-[10px] text-slate-400">Auto-generated outline</div>
                                </div>
                                <MoreHorizontal className="h-4 w-4 text-slate-300" />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (phase === 2) {
            return (
                <div className="w-full h-full flex flex-col">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Test in sandbox</div>
                    <div className="flex-grow rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="h-10 border-b border-slate-100 flex items-center px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Sandbox Preview
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 h-32 flex items-center justify-center text-[11px] text-slate-400">
                                Training session playback
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Play className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-[12px] font-semibold text-slate-800">Run simulation</div>
                                    <div className="text-[10px] text-slate-400">Validate user steps</div>
                                </div>
                                <div className="ml-auto text-[10px] text-emerald-600 font-bold">Ready</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex flex-col">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Publish to users</div>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="text-[12px] font-semibold text-slate-800 mb-3">Publish settings</div>
                    <div className="space-y-3 text-[10px] text-slate-500">
                        {["Enable in-app checklist", "Require confirmation", "Send completion summary"].map(item => (
                            <div key={item} className="flex items-center justify-between">
                                <span>{item}</span>
                                <div className="w-8 h-4 rounded-full bg-emerald-100 relative">
                                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-emerald-500 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 rounded-lg bg-[#0A192F] text-white text-[11px] font-bold">Publish to users</button>
                </div>
            </div>
        );
    };

    const renderRightPanel = () => {
        if (phase === 1) {
            return (
                <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settings</div>
                    {["Tone", "Length", "Language"].map(item => (
                        <div key={item} className="space-y-2">
                            <div className="text-[10px] font-semibold text-slate-500">{item}</div>
                            <div className="h-8 rounded-lg border border-slate-200 bg-slate-50" />
                        </div>
                    ))}
                </div>
            );
        }
        if (phase === 2) {
            return (
                <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulation</div>
                    {["Step 1: Open app", "Step 2: Run workflow", "Step 3: Confirm action"].map((item, idx) => (
                        <div key={item} className="flex items-center gap-3 text-[11px] text-slate-600">
                            <div className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-200"}`} />
                            {item}
                        </div>
                    ))}
                </div>
            );
        }
        if (phase === 3) {
            return (
                <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipients</div>
                    {["Sales Ops", "Field Enablement", "Customer Support"].map(item => (
                        <div key={item} className="flex items-center gap-3 text-[11px] text-slate-600">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold">
                                {item[0]}
                            </div>
                            {item}
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="space-y-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supported</div>
                {["PDF", "PPTX", "Video", "Docs"].map(item => (
                    <div key={item} className="text-[11px] text-slate-600">{item}</div>
                ))}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video select-none bg-white shadow-heavy border border-slate-100 overflow-hidden"
            style={{ borderRadius: DESIGN_SYSTEM.radius.lg }}
        >
            <div
                style={{
                    width: BASE_WIDTH,
                    height: BASE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left"
                }}
                className="absolute top-0 left-0 overflow-hidden flex flex-col"
            >
            {/* HEADER */}
            <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-white z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0A192F] text-white flex items-center justify-center font-bold shadow-sm">P</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">Workshop Studio</span>
                        <span className="text-[10px] text-slate-400">{phases[phase]}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-md bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100 flex items-center gap-1.5">
                        <Users className="h-3 w-3" /> Collaborate
                    </div>
                    <button className="px-4 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 bg-[#0A192F] text-white">
                        Publish <ArrowUpRight className="h-3 w-3 opacity-60" />
                    </button>
                </div>
            </div>

            {/* TOP NAV */}
            <div className="h-10 border-b border-slate-100 bg-white px-4 flex items-center relative">
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {topTabs.map((tab, index) => (
                        <div
                            key={tab}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                                index === activeTabIndex
                                    ? "bg-[#0A192F] text-white shadow-sm"
                                    : "bg-slate-50 text-slate-400"
                            }`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Autosave
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-grow flex relative bg-slate-50/60">
                {/* LEFT SIDEBAR */}
                <div className="w-12 border-r border-slate-100 bg-white flex flex-col items-center py-4 gap-4 z-10">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Layers className="h-5 w-5" /></div>
                    <div className="p-2 rounded-lg text-slate-400 hover:bg-slate-50"><PenTool className="h-5 w-5" /></div>
                    <div className="p-2 rounded-lg text-slate-400 hover:bg-slate-50"><LayoutTemplate className="h-5 w-5" /></div>
                    <div className="mt-auto p-2 rounded-lg text-slate-400"><Settings className="h-5 w-5" /></div>
                </div>

                {/* CANVAS */}
                <div className="flex-grow relative overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div 
                        key={phase} 
                        className="relative w-full h-full animate-fade-in"
                        style={{ animationDuration: '0.6s' }}
                    >
                        {renderMainPanel()}
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div key={phase} className="hidden md:flex w-44 border-l border-slate-100 bg-white flex-col p-4 z-10 animate-fade-in" style={{ animationDuration: '0.6s' }}>
                    {renderRightPanel()}
                </div>
            </div>
            </div>
        </div>
    );
}

export function PeazyLaptopHeroMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [scrollZoom, setScrollZoom] = useState(1);
  const BASE_WIDTH = 1200;
  const BASE_HEIGHT = 700;

  useEffect(() => {
    let animationFrameId: number;
    const updateScale = () => {
      if (!containerRef.current) return;
      const currentWidth = containerRef.current.offsetWidth;
      setBaseScale(currentWidth / BASE_WIDTH);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
      setScrollZoom(1 + (scrollProgress * 0.2));
    };

    updateScale();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const observer = new ResizeObserver(() => {
      animationFrameId = requestAnimationFrame(updateScale);
    });
    
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full px-4 md:px-8 max-w-[1400px] mx-auto">
      <div 
        ref={containerRef} 
        className="relative w-full bg-white border border-black/[0.05] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden" 
        style={{ 
          aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}`,
          borderRadius: '40px'
        }}
      >
        {/* BASE SCALED CONTENT WRAPPER (Scales with viewport) */}
        <div 
          style={{ 
            width: `${BASE_WIDTH}px`, 
            height: `${BASE_HEIGHT}px`, 
            transform: `scale(${baseScale})`, 
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            willChange: 'transform',
          }}
        >
          {/* IMAGE WITH ZOOM EFFECT (Only image zooms) */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={laptopFrame} 
              alt="Peazy AI laptop" 
              className="w-full h-full block object-cover" 
              style={{ 
                transform: `scale(${scrollZoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s cubic-bezier(0.2, 0, 0.2, 1)',
                willChange: 'transform'
              }}
            />
          </div>
          
          {/* TEXT OVERLAY (Proportional but not zooming) */}
          <div className="absolute top-[12%] left-0 w-full z-20 pointer-events-none text-center px-4">
            <div className="inline-block relative">
              <h2 
                className="text-[64px] font-medium tracking-tight mb-2 text-[#0A192F]" 
                style={{ 
                  fontFamily: DESIGN_SYSTEM.fonts.serif,
                }}
              >
                Introducing Peazy AI
              </h2>
              <div className="flex items-center justify-center gap-5">
                <div className="h-[1px] w-20 bg-black/10" />
                <p className="text-black/50 text-[13px] font-bold uppercase tracking-[0.2em] font-sans">
                  The Next Evolution of Enterprise Learning
                </p>
                <div className="h-[1px] w-20 bg-black/10" />
              </div>
            </div>
          </div>

          {/* Peazy Cursor - Continuous Loop Animation */}
          <div className="absolute top-1/2 left-1/3 animate-cursor-loop z-50 pointer-events-none">
             <div className="flex items-center gap-3">
                <div className="relative">
                    <MousePointer2 className="w-9 h-9 text-[#0A192F] fill-[#0A192F] drop-shadow-2xl" strokeWidth={2} />
                    <div className="absolute inset-0 bg-[#0A192F]/20 rounded-full animate-ping -z-10 scale-150" />
                </div>
                <div className="bg-[#0A192F] text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-2xl border border-white/20 whitespace-nowrap flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                   Peazy Instructor
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IltWorkshopRolloutVisual() {
  return (
    <div className="relative w-full max-w-[640px] min-h-[220px] md:min-h-[260px] mx-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/40 rounded-[2rem] border border-black/[0.04]" />

      <div className="relative z-10 w-full px-6 py-6 md:px-8 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-soft p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Workshop Conversion</div>
              <div className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</div>
            </div>
            <div className="space-y-3">
              {["Onboarding deck", "Go-live checklist", "Process guide"].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-grow">
                    <div className="text-[12px] font-semibold text-[#0A192F]">{item}</div>
                    <div className="text-[10px] text-black/40">Converted to ILT block</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-soft p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Adoption + Proficiency</div>
              <div className="text-[10px] font-bold text-[#0A192F]">82%</div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Workflow adoption", value: "78%", percent: "78%", color: "bg-blue-500" },
                { label: "Time-to-proficiency", value: "12d", percent: "85%", color: "bg-emerald-500" },
                { label: "In-app completion", value: "91%", percent: "91%", color: "bg-amber-400" }
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-[10px] font-semibold text-black/60 mb-1.5">
                    <span>{metric.label}</span>
                    <span>{metric.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color}`} style={{ width: metric.percent }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-600 font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Adoption velocity trending up
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 right-6 bg-white border border-black/[0.06] shadow-soft rounded-2xl px-4 py-3">
        <div className="text-[9px] font-bold uppercase tracking-widest text-black/40">ILT Sessions</div>
        <div className="text-[16px] font-bold text-[#0A192F]">24</div>
        <div className="text-[9px] text-black/40">this month</div>
      </div>
    </div>
  );
}

export function ProficiencyDashboardMockup() {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-4 overflow-visible">
      {/* Background Soft Glow to match Synthesia reference */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-white to-pink-50/30 rounded-[2rem] -z-10" />

      {/* Main Dashboard Window - Feature Adoption List */}
      <div className="relative z-10 w-[95%] bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-black/[0.04] overflow-hidden">
        <div className="p-4 border-b border-black/[0.03] bg-gray-50/30 flex items-center justify-between">
           <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-black/5" />
              <div className="w-2 h-2 rounded-full bg-black/5" />
              <div className="w-2 h-2 rounded-full bg-black/5" />
           </div>
           <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Software Mastery</div>
        </div>
        
        <div className="p-5 space-y-4">
           {[
             { name: 'Lead Management', score: '94%', color: 'bg-emerald-500' },
             { name: 'Pipeline Reporting', score: '82%', color: 'bg-blue-500' },
             { name: 'Custom Objects', score: '45%', color: 'bg-amber-400' }
           ].map((feature, i) => (
             <div key={i} className="flex items-center gap-4">
                <div className="w-7 h-7 rounded bg-gray-100 border border-black/5 flex items-center justify-center">
                   <div className="w-3 h-3 rounded-sm bg-black/10" />
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-gray-800">{feature.name}</span>
                      <span className="text-[10px] font-bold text-gray-400">{feature.score}</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className={`h-full ${feature.color}`} style={{ width: feature.score }} />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Floating Metric Card - Overall Adoption */}
      <div className="absolute -top-[5%] -right-[5%] z-20 w-[180px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-blue-100 p-5 transform rotate-3 animate-float">
         <div className="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">Team Adoption</div>
         <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#0A192F]">88</span>
            <span className="text-sm font-bold text-black/20">%</span>
         </div>
         <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-600">+12% mastery velocity</span>
         </div>
      </div>

      {/* Floating Detail Card - Mastery Timeline (Redesigned) */}
      <div className="absolute -bottom-[10%] -left-[5%] z-20 w-[240px] bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-black/[0.08] p-5 transform -rotate-2 overflow-hidden">
         {/* Grid Background for the card */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
         
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
               <div className="text-[10px] font-bold text-gray-900">Adoption Depth</div>
               <div className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Target: 14 Days</div>
            </div>

            <div className="flex gap-1.5 mb-5">
               {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className={`h-6 flex-grow rounded-sm transition-all duration-1000 ${i <= 5 ? 'bg-emerald-400' : 'bg-gray-100'}`} style={{ opacity: 0.3 + (i * 0.1) }} />
               ))}
            </div>

            <div className="flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#0A192F]">12.4</span>
                  <span className="text-[8px] text-gray-400 uppercase font-bold tracking-tighter">Avg days to mastery</span>
               </div>
               <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-500 flex items-center justify-center text-[9px] font-bold text-emerald-600">
                  82%
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// ... (Rest of existing visual components)

function SalesforceAppContent({ currentStep, industryValue }: { currentStep: number, industryValue: string }) {
  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#F3F3F3] min-w-[320px]">
      {/* Salesforce Utility Bar */}
      <header className="h-10 bg-[#16325C] text-white flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-3 h-full">
           <div className="h-full px-2 flex items-center hover:bg-white/10 cursor-pointer">
             <Grid className="h-4 w-4" />
           </div>
           <div className="flex items-center gap-4 h-full px-2 border-b-2 border-white/80">
             <span className="text-[10px] font-bold tracking-wide">Sales Cloud</span>
           </div>
           <div className="flex items-center gap-4 h-full px-2 text-white/70">
             <span className="text-[10px] font-medium">Home</span>
             <span className="text-[10px] font-medium border-b-2 border-transparent hover:border-white/40 cursor-pointer">Leads</span>
             <span className="text-[10px] font-medium">Accounts</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <Search className="h-3 w-3 text-white/60" />
          <div className="h-6 w-6 rounded-full bg-blue-400 border border-white/20 flex items-center justify-center text-[9px] font-bold">JD</div>
        </div>
      </header>

      {/* Record Header - Salesforce Style */}
      <div className="h-14 bg-white border-b border-black/5 flex items-center px-5 justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white shadow-sm">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-black/40 font-bold tracking-tight">Lead</span>
            <span className="text-[12px] font-bold text-[#080707]">New Lead Registration</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-1.5 bg-white border border-black/10 text-[10px] font-bold rounded shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
           <button 
             className={`px-4 py-1.5 text-white text-[10px] font-bold rounded shadow-md transition-all duration-300 ${currentStep === 3 ? 'bg-emerald-600' : 'bg-[#0070D2]'}`}
           >
             {currentStep === 3 ? 'Lead Created' : 'Save'}
           </button>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="bg-white rounded border border-black/5 shadow-sm p-6 max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between border-b border-black/5 pb-4">
            <div className="flex items-center gap-2">
               <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
               <h1 className="text-[11px] font-bold text-[#080707] uppercase tracking-wider">Lead Information</h1>
            </div>
            <StatusBadge type={currentStep >= 2 ? "success" : "neutral"} label={currentStep >= 2 ? "Validated" : "Draft"} />
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-medium text-black/50">Company</label>
               <div className="h-9 border border-black/10 rounded px-3 flex items-center text-[11px] bg-gray-50/50">Acme Global Inc</div>
            </div>
            
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-medium text-black/50">Lead Source</label>
               <div className="h-9 border border-black/10 rounded px-3 flex items-center text-[11px] bg-gray-50/50">Direct Outreach</div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
               <label className={`text-[10px] font-bold ${currentStep === 1 || currentStep === 2 ? 'text-blue-600' : 'text-black/50'}`}>Industry</label>
               <div className={`h-9 border-2 rounded px-3 flex items-center text-[11px] transition-all duration-500 ${
                 currentStep === 1 || currentStep === 2 ? 'border-blue-400 bg-blue-50/30 ring-2 ring-blue-100 shadow-sm' : 'border-black/10'
               }`}>
                 {industryValue || "--- None ---"}
               </div>
            </div>

            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-medium text-black/50">Website</label>
               <div className="h-9 border border-black/10 rounded px-3 flex items-center text-[11px] text-black/30 italic">www.acmeglobal.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChromeExtensionImage() {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: 85, y: 15 });
  
  // SCALING LOGIC FOR "TRUE VIDEO" BEHAVIOR
  // This allows us to layout the UI at a comfortable 1000px width, 
  // and simply scale it down for smaller screens, preserving aspect ratio and layout perfectly.
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const BASE_WIDTH = 1000;
  const BASE_HEIGHT = 562.5; // 16:9 of 1000

  useEffect(() => {
    let animationFrameId: number;
    const updateScale = () => {
        if (!containerRef.current) return;
        const currentWidth = containerRef.current.offsetWidth;
        // Calculate scale factor
        const newScale = currentWidth / BASE_WIDTH;
        setScale(newScale);
    };

    // Initial calcluation
    updateScale();

    const observer = new ResizeObserver(() => {
        // Debounce via requestAnimationFrame to prevent loop limit errors
        animationFrameId = requestAnimationFrame(updateScale);
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    let timeoutId: any;
    const cycle = async () => {
      // Step 0: Initial State
      setStep(0);
      setIndustry("");
      setCursorPos({ x: 80, y: 25 });
      await new Promise(r => timeoutId = setTimeout(r, 2000));

      // Step 1: Target Industry Field
      setStep(1);
      setCursorPos({ x: 28, y: 48 }); 
      await new Promise(r => timeoutId = setTimeout(r, 1500));

      // Step 2: Action - Fill Value
      setStep(2);
      setIndustry("Software & Technology");
      setCursorPos({ x: 29, y: 49 }); 
      await new Promise(r => timeoutId = setTimeout(r, 2000));

      // Step 3: Target Save Button
      setStep(3);
      setCursorPos({ x: 90, y: 12 }); 
      await new Promise(r => timeoutId = setTimeout(r, 2500));

      cycle();
    };
    cycle();
    return () => clearTimeout(timeoutId);
  }, []);

  const message = useMemo(() => {
    switch (step) {
      case 0: return "Waiting for a workflow. Log a lead into Salesforce?";
      case 1: return "Focus on the Industry segment. Accurate categorization drives our revenue routing.";
      case 2: return "Perfect. Choosing 'Software & Tech' automatically flags this for Enterprise Support.";
      case 3: return "Validation passed. Hit the 'Save' button in the top right to push to production.";
      default: return "...";
    }
  }, [step]);

  return (
    <div ref={containerRef} className="w-full aspect-video relative overflow-hidden bg-gray-50 border border-black/10 shadow-heavy rounded-xl">
      {/* 
        SCALED CONTAINER 
        The content inside thinks it is 1000px wide. 
        Transform scale shrinks it to fit the actual container width.
      */}
      <div 
        style={{ 
            width: BASE_WIDTH, 
            height: BASE_HEIGHT, 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left'
        }}
        className="absolute top-0 left-0 overflow-hidden"
      >
        <BrowserShell 
            url="salesforce.com/lightning/o/Lead/new" 
            className="w-full h-full shadow-none border-none rounded-none"
        >
            <div className="flex h-full w-full overflow-hidden">
                {/* Main Salesforce Application Space */}
                <div className="flex-grow relative h-full flex flex-col overflow-hidden">
                <SalesforceAppContent currentStep={step} industryValue={industry} />
                
                {/* Calibrated Human Cursor */}
                <div 
                    className="absolute z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                >
                    <MousePointer2 
                    className="h-4.5 w-4.5 text-[#0A192F] drop-shadow-lg" 
                    strokeWidth={2.5}
                    fill="#FFF"
                    />
                    {(step === 2 || step === 3) && (
                    <div className="absolute top-0 left-0 w-8 h-8 -ml-2 -mt-2 bg-blue-500/20 rounded-full animate-ping pointer-events-none" />
                    )}
                </div>
                </div>

                {/* Peazy Sidepanel */}
                <aside className="w-[220px] border-l border-black/10 bg-white h-full flex-shrink-0 z-10 flex flex-col shadow-[-15px_0_40px_rgba(0,0,0,0.04)]">
                <PeazyTrainerPanel 
                    typing={step !== 0} 
                    message={message} 
                    buttonLabel={step === 3 ? "Complete Session" : "Live Session"} 
                />
                </aside>
            </div>
            
            {/* Persistent Badge */}
            <div className="absolute bottom-4 left-4 z-20 bg-blue-600/90 text-white text-[8px] px-2 py-1 rounded shadow-md font-bold tracking-widest uppercase pointer-events-none flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Live Workshop Demo
            </div>
        </BrowserShell>
      </div>
    </div>
  );
}

export function InstructorLedImage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const BASE_WIDTH = 1000;
    const BASE_HEIGHT = 562.5; 
    
    // Animation States
    const [step, setStep] = useState(0);
    const [cursorPos, setCursorPos] = useState({ x: 110, y: 110 }); // Start off screen
    const [buttonClicked, setButtonClicked] = useState(false);
  
    useEffect(() => {
      let animationFrameId: number;
      const updateScale = () => {
          if (!containerRef.current) return;
          const currentWidth = containerRef.current.offsetWidth;
          setScale(currentWidth / BASE_WIDTH);
      };
      updateScale();
      const observer = new ResizeObserver(() => {
          animationFrameId = requestAnimationFrame(updateScale);
      });
      if (containerRef.current) observer.observe(containerRef.current);
      return () => {
          observer.disconnect();
          cancelAnimationFrame(animationFrameId);
      };
    }, []);

    useEffect(() => {
        let timer: any;
        const cycle = async () => {
            // Reset
            setStep(0);
            setCursorPos({ x: 90, y: 90 });
            setButtonClicked(false);
            
            // Wait
            await new Promise(r => timer = setTimeout(r, 1000));
            
            // Step 1: Agent Speaks (Transcript appears)
            setStep(1);
            await new Promise(r => timer = setTimeout(r, 2000));
            
            // Step 2: Active Prompt appears
            setStep(2);
            await new Promise(r => timer = setTimeout(r, 1000));

            // Step 3: Cursor Moves to "Test Agent" button (Approx coordinate on main canvas)
            setCursorPos({ x: 62, y: 22 });
            await new Promise(r => timer = setTimeout(r, 1500));

            // Step 4: Click
            setButtonClicked(true);
            await new Promise(r => timer = setTimeout(r, 3000));

            cycle();
        };
        cycle();
        return () => clearTimeout(timer);
    }, []);
  
    return (
      <div ref={containerRef} className="w-full aspect-video relative overflow-hidden bg-slate-50 border border-slate-200 shadow-heavy rounded-xl ring-1 ring-black/5">
        <div 
          style={{ 
              width: BASE_WIDTH, 
              height: BASE_HEIGHT, 
              transform: `scale(${scale})`, 
              transformOrigin: 'top left'
          }}
          className="absolute top-0 left-0 overflow-hidden flex bg-white"
        >
          {/* LEFT AREA: STAGE + CONTROLS (Flex Col) */}
          <div className="flex-grow flex flex-col h-full border-r border-slate-200 shadow-[inset_-4px_0_15px_rgba(0,0,0,0.02)]">
              
              {/* TOP: WORKSHOP STAGE */}
              <div className="flex-grow bg-[#E2E8F0] p-6 flex flex-col relative overflow-hidden">
                 {/* Stage Header */}
                 <div className="h-8 flex items-center justify-between mb-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                         <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">Peazy Workshop Stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1.5 animate-pulse">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            LIVE DEMO
                        </div>
                    </div>
                 </div>

                 {/* Stage Content: AGENTFORCE AGENT BUILDER MOCK */}
                 <div className="flex-grow bg-white border border-slate-300 rounded-lg shadow-xl relative overflow-hidden flex flex-col ring-1 ring-black/5">
                    
                    {/* App Header */}
                    <div className="h-10 border-b border-slate-200 flex items-center px-4 gap-4 bg-white flex-shrink-0">
                        <div className="p-1.5 bg-purple-100 rounded text-purple-700"><Bot className="h-4 w-4" /></div>
                        <span className="text-xs font-bold text-slate-700">Agentforce Service Agent</span>
                        <div className="flex gap-2 ml-auto text-xs font-semibold text-slate-400">
                           <span className="text-slate-800 border-b-2 border-purple-500 pb-2.5 translate-y-2.5">Topics</span>
                           <span className="ml-2">Actions</span>
                           <span className="ml-2">Channels</span>
                        </div>
                    </div>

                    <div className="flex-grow flex relative">
                         {/* Sidebar */}
                         <div className="w-40 border-r border-slate-100 flex flex-col py-2 bg-slate-50/50">
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Agent Topics</div>
                            <div className="px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Order Inquiry
                            </div>
                            <div className="px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 border-r-2 border-purple-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Returns Handling
                            </div>
                            <div className="px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Product QA
                            </div>
                         </div>

                         {/* Main Canvas */}
                         <div className="flex-grow relative bg-white p-6 flex flex-col gap-6">
                             {/* Header for Topic */}
                             <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                 <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Topic Configuration</div>
                                    <div className="text-sm font-bold text-slate-800">Returns Handling</div>
                                 </div>
                                 <button 
                                    className={`px-3 py-1 text-white text-[10px] font-bold rounded transition-all duration-300 ${buttonClicked ? 'bg-green-600 scale-105' : 'bg-slate-800'}`}
                                 >
                                    {buttonClicked ? 'Running...' : 'Test Agent'}
                                 </button>
                             </div>

                             {/* Instructions Section */}
                             <div className="flex flex-col gap-3 opacity-50">
                                 <div className="text-[10px] font-bold text-slate-500">INSTRUCTIONS</div>
                                 <div className="p-3 border border-slate-200 rounded bg-slate-50 text-[10px] text-slate-600">
                                     If customer asks for refund, check eligibility using OrderID.
                                 </div>
                             </div>

                             {/* Actions Section */}
                             <div className="flex flex-col gap-3">
                                 <div className="text-[10px] font-bold text-slate-500">AGENT ACTIONS</div>
                                 <div className="p-3 border border-slate-200 rounded flex items-center gap-3">
                                     <div className="p-1.5 bg-blue-100 text-blue-600 rounded"><Database className="h-3.5 w-3.5" /></div>
                                     <div className="text-[10px] font-bold text-slate-700">Check_Order_Status</div>
                                     <div className="ml-auto text-[9px] text-slate-400">Flow</div>
                                 </div>
                                 {/* Added new action to show completed state visually */}
                                 <div className="p-3 border border-slate-200 rounded flex items-center gap-3 animate-fade-in">
                                     <div className="p-1.5 bg-green-100 text-green-600 rounded"><Code2 className="h-3.5 w-3.5" /></div>
                                     <div className="text-[10px] font-bold text-slate-700">Process_Refund</div>
                                     <div className="ml-auto text-[9px] text-slate-400">Apex</div>
                                 </div>
                             </div>

                         </div>
                    </div>

                    {/* Cursor */}
                    <div 
                        className="absolute z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25, 1, 0.5, 1)]"
                        style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                    >
                        <MousePointer2 className="h-6 w-6 fill-black text-white drop-shadow-xl" />
                        {buttonClicked && (
                            <div className="absolute -left-2 -top-2 w-10 h-10 bg-green-500/30 rounded-full animate-ping" />
                        )}
                    </div>
                 </div>
              </div>

              {/* BOTTOM: CONTROL DECK */}
              <div className="h-[130px] bg-white border-t border-slate-200 flex relative z-20">
                  {/* AGENT STATUS */}
                  <div className="w-[35%] border-r border-slate-100 p-5 flex flex-col justify-between relative overflow-hidden bg-slate-50/50">
                       <div className="flex justify-between items-start z-10">
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">AI Instructor</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border ${step >= 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-white text-slate-400 border-slate-100'}`}>
                                {step >= 1 ? 'SPEAKING' : 'IDLE'}
                            </span>
                       </div>
                       <div className="flex items-center gap-4 mt-auto z-10 mb-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A192F] to-[#1e2a4a] text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                                P
                            </div>
                            {step >= 1 && (
                                <div className="flex gap-1 items-end h-5">
                                    <div className="w-1.5 bg-[#0A192F] rounded-full animate-audio-wave" style={{ height: '40%', animationDelay: '0ms' }} />
                                    <div className="w-1.5 bg-[#0A192F] rounded-full animate-audio-wave" style={{ height: '80%', animationDelay: '100ms' }} />
                                    <div className="w-1.5 bg-[#0A192F] rounded-full animate-audio-wave" style={{ height: '50%', animationDelay: '200ms' }} />
                                    <div className="w-1.5 bg-[#0A192F] rounded-full animate-audio-wave" style={{ height: '90%', animationDelay: '300ms' }} />
                                    <div className="w-1.5 bg-[#0A192F] rounded-full animate-audio-wave" style={{ height: '60%', animationDelay: '150ms' }} />
                                </div>
                            )}
                       </div>
                  </div>

                  {/* SESSION CONTROLS */}
                  <div className="w-[65%] p-5 flex flex-col justify-between bg-white">
                       <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Session Controls</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                <Clock className="h-3 w-3" /> 00:04:23
                           </span>
                       </div>
                       
                       <div className="flex items-center justify-center gap-8 mt-auto mb-1">
                           <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm transition-all group hover:border-slate-300">
                                    <Maximize2 className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-800" />
                                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Window</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm transition-all group hover:border-slate-300">
                                    <PictureInPicture className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-800" />
                                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800">Open PiP</span>
                                </button>
                           </div>
                           
                           <button className="flex items-center gap-2 px-5 py-2 bg-red-50 border border-red-100 rounded-full hover:bg-red-100 shadow-sm transition-all text-red-600 group">
                                <PhoneOff className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-bold">End Session</span>
                           </button>
                       </div>
                  </div>
              </div>
          </div>

          {/* RIGHT AREA: TRANSCRIPT (Fixed Width) */}
          <div className="w-[320px] bg-white flex flex-col h-full flex-shrink-0 z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] border-l border-slate-200">
             <div className="p-5 border-b border-slate-100 bg-white">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Session Transcript</h3>
             </div>
             
             {/* Transcript Content */}
             <div className="flex-grow p-5 flex flex-col gap-6 overflow-hidden relative">
                 <div className="flex gap-4">
                     <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-500 border border-slate-200">P</div>
                     <div className="flex flex-col gap-1.5">
                         <span className="text-[11px] font-bold text-slate-800">Peazy AI</span>
                         <p className="text-[12px] leading-relaxed text-slate-500">The return logic is configured. Let's verify the behavior.</p>
                     </div>
                 </div>

                 {step >= 1 && (
                    <div className="flex gap-4 animate-fade-in">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-500 border border-slate-200">i</div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold text-slate-800">Context</span>
                            <div className="text-[12px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                Task: Validate the 'Returns Handling' topic.
                            </div>
                        </div>
                    </div>
                 )}
                 
                 {/* The Active Instruction Card - Optimized for Light Theme Contrast */}
                 {step >= 2 && (
                     <div className="mt-2 bg-white rounded-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] animate-fade-in relative overflow-hidden group border border-blue-100 ring-1 ring-blue-500/20">
                        {/* Accent Bar */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        
                         <div className="flex justify-between items-start mb-4 pl-2">
                             <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <Play className="h-3.5 w-3.5 ml-0.5" />
                             </div>
                             <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                         </div>
                         <p className="text-[12px] font-medium text-slate-700 leading-relaxed mb-5 pl-2">
                            Click <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Test Agent</span> to run the simulator.
                         </p>
                         <button className="w-full py-2 bg-[#0A192F] hover:bg-[#1e2a4a] text-white text-[11px] font-bold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Done
                         </button>
                     </div>
                 )}
             </div>

             {/* Footer Input */}
             <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Type to chat with Peazy Instructor..." 
                        className="w-full bg-white border border-slate-200 rounded-lg h-10 pl-4 pr-10 text-[11px] font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none shadow-sm transition-all"
                    />
                    <div className="absolute right-2 top-2 p-1.5 bg-slate-100 rounded-md hover:bg-slate-200 cursor-pointer text-slate-500 transition-colors">
                        <Send className="h-3.5 w-3.5" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
}

export function NativeGuideImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const BASE_WIDTH = 1000;
  const BASE_HEIGHT = 562.5;

  // Animation Sequence State
  const [step, setStep] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const updateScale = () => {
        if (!containerRef.current) return;
        const currentWidth = containerRef.current.offsetWidth;
        setScale(currentWidth / BASE_WIDTH);
    };
    updateScale();
    const observer = new ResizeObserver(() => {
        animationFrameId = requestAnimationFrame(updateScale);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // Simple cycle loop
    const interval = setInterval(() => {
        setStep(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="w-full aspect-video relative overflow-hidden bg-white border border-gray-200 shadow-heavy rounded-xl">
      <div 
        style={{ 
            width: BASE_WIDTH, 
            height: BASE_HEIGHT, 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left'
        }}
        className="absolute top-0 left-0 overflow-hidden flex bg-[#F8F9FA]"
      >
        {/* Mock App Sidebar */}
        <div className="w-20 bg-[#2D3748] h-full flex flex-col items-center py-6 gap-6 shrink-0 z-10">
            <div className="w-10 h-10 rounded-lg bg-blue-500 mb-4 shadow-lg"></div>
            <div className="w-8 h-8 rounded-md bg-white/10"></div>
            <div className="w-8 h-8 rounded-md bg-white/10"></div>
            <div className="w-8 h-8 rounded-md bg-white/10"></div>
            <div className="mt-auto w-8 h-8 rounded-full bg-gray-400/20"></div>
        </div>

        {/* Mock App Content Area */}
        <div className="flex-grow flex flex-col h-full relative">
            <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-700">Journey Builder</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm text-gray-500">Q3 Customer Retention</span>
                </div>
                <div className="flex gap-3">
                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                    <div className="h-8 w-24 bg-blue-600 rounded shadow-sm text-white text-xs font-bold flex items-center justify-center">Activate</div>
                </div>
            </header>
            
            <div className="flex-grow relative overflow-hidden bg-[radial-gradient(#cbd5e0_1px,transparent_1px)] [background-size:20px_20px]">
                {/* Visual Flow Nodes */}
                {/* 
                   Fix: Removed absolute positioning and translate transform. 
                   Used flex container with full width and auto margins to center content safely.
                   Added padding to prevent edge clipping.
                */}
                <div className="w-full h-full flex items-center justify-center gap-8 px-8 overflow-x-auto">
                     <div className="w-36 h-24 bg-white rounded-lg border border-gray-300 shadow-sm flex flex-col items-center justify-center gap-2 relative z-10 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><User className="h-4 w-4"/></div>
                        <span className="text-xs font-bold text-gray-700">Segment Entry</span>
                     </div>
                     <div className="w-8 h-0.5 bg-gray-300 flex-shrink-0"></div>
                     <div className={`w-36 h-24 bg-white rounded-lg border shadow-sm flex flex-col items-center justify-center gap-2 relative z-10 flex-shrink-0 transition-all duration-500 ${step >= 1 ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-300'}`}>
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Mail className="h-4 w-4"/></div>
                        <span className="text-xs font-bold text-gray-700">Email: Offer</span>
                        {step >= 1 && <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm animate-bounce">1</div>}
                     </div>
                     <div className="w-8 h-0.5 bg-gray-300 flex-shrink-0"></div>
                     <div className="w-36 h-24 bg-white rounded-lg border border-gray-300 shadow-sm flex flex-col items-center justify-center gap-2 relative z-10 opacity-50 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Clock className="h-4 w-4"/></div>
                        <span className="text-xs font-bold text-gray-700">Wait: 2 Days</span>
                     </div>
                </div>
            </div>
        </div>

        {/* Peazy Sidebar */}
        <div className="w-[300px] bg-white border-l border-gray-200 h-full shrink-0 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.05)] z-20">
             <div className="h-14 border-b border-gray-100 flex items-center px-5 gap-3 bg-white">
                 <div className="w-8 h-8 rounded-lg bg-[#0A192F] text-white flex items-center justify-center font-bold font-serif shadow-sm">P</div>
                 <div>
                    <div className="text-xs font-bold text-[#0A192F]">Peazy Copilot</div>
                    <div className="text-[10px] text-gray-400">Context aware</div>
                 </div>
             </div>
             
             <div className="p-5 flex-grow overflow-y-auto flex flex-col gap-4">
                 <div className="flex gap-3">
                     <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-xs text-gray-600 leading-relaxed">
                         I've analyzed your "Q3 Customer Retention" flow. The email open rate for this segment is trending down.
                     </div>
                 </div>

                 {step >= 1 && (
                     <div className="flex gap-3 animate-fade-in">
                         <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl rounded-tl-none text-xs text-blue-800 leading-relaxed shadow-sm">
                             Suggestion: <strong>Personalize the Subject Line</strong>. <br/> adding the customer's first name typically increases open rates by 15% here.
                             <button className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] shadow-sm transition-colors">Apply Change</button>
                         </div>
                     </div>
                 )}

                 {step >= 2 && (
                    <div className="flex gap-3 justify-end animate-fade-in">
                        <div className="bg-[#0A192F] text-white p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-sm">
                            Apply change. Also, check if the wait time needs adjustment.
                        </div>
                    </div>
                 )}
                 
                 {step >= 3 && (
                     <div className="flex gap-3 animate-fade-in">
                         <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-xs text-gray-600 leading-relaxed">
                             Updated. I'm also seeing that a <strong>3-day wait</strong> performs better for this demographic. Shall I adjust?
                         </div>
                     </div>
                 )}
             </div>

             <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                 <div className="relative">
                     <input className="w-full h-9 pl-3 pr-8 rounded border border-gray-200 text-xs shadow-sm focus:border-blue-500 outline-none" placeholder="Ask Peazy..." />
                     <Send className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3" />
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
