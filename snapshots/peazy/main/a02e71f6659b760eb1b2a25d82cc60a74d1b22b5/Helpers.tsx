
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronRight, ChevronDown, ArrowUp } from "lucide-react";
import { DESIGN_SYSTEM } from "./constants";
import { Button } from "./Primitives";

export function PeazyTrainerPanel({ 
  message = "Ready to start...", 
  buttonLabel = "Start Session",
  typing = false 
}: { 
  message?: string; 
  buttonLabel?: string; 
  typing?: boolean;
}) {
  return (
    <div 
      className="w-full h-full bg-white flex flex-col text-[#1A1A1A] overflow-hidden"
    >
      <div className="p-3 py-2.5 flex items-center border-b border-black/5 flex-shrink-0 bg-white">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A192F]">Peazy Trainer</p>
      </div>
      <div className="p-3 flex flex-col gap-3 flex-grow overflow-hidden">
        <button 
          className="text-[10px] font-bold py-2 transition-all hover:brightness-110 text-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: DESIGN_SYSTEM.colors.primary, borderRadius: DESIGN_SYSTEM.radius.sm }}
        >
          {buttonLabel}
        </button>
        <div className="text-[8px] text-center text-black/30 font-bold uppercase tracking-tighter flex-shrink-0">Extension Active</div>
        
        {/* Responsive message box with no cropping */}
        <div 
          className="p-3 bg-[#F8F9FB] border border-black/[0.03] min-h-[90px] flex flex-col justify-start overflow-y-auto"
          style={{ borderRadius: DESIGN_SYSTEM.radius.sm }}
        >
          <p 
            key={message}
            className="text-[10px] leading-relaxed font-medium text-[#1A1A1A] animate-fade-in" 
            style={{ color: DESIGN_SYSTEM.colors.primary }}
          >
            "{message}"
          </p>
        </div>
        
        <div className="mt-auto pt-2 flex flex-col gap-2 flex-shrink-0">
          <div className="h-[1px] bg-black/5 w-full" />
          <div className="relative">
            <input 
              type="text" 
              disabled
              placeholder="Ask a question..." 
              className="w-full text-[10px] bg-white p-2.5 placeholder:text-black/20 border border-black/10 outline-none" 
              style={{ borderRadius: DESIGN_SYSTEM.radius.sm }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Glow({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return <div className={`relative ${className}`}>{children}</div>;
}

export function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 md:hidden animate-fade-in">
      <Button 
        onClick={() => window.open(DESIGN_SYSTEM.urls.booking, '_blank')}
        className="w-full"
      >
        Join Waitlist <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const targetValue = parseFloat(value);
  const prefix = value.match(/^[^\d.]*/)?.[0] || '';
  const suffix = value.match(/[^\d.]*$/)?.[0] || '';
  
  const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);
  const animateValue = useCallback(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutQuint(progress);
      const currentNum = easedProgress * targetValue;
      setDisplayValue(Math.abs(targetValue % 1) > 0 ? currentNum.toFixed(1) : Math.floor(currentNum).toString());
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [targetValue]);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { animateValue(); observer.unobserve(e.target); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animateValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-semibold tabular-nums" style={{ color: DESIGN_SYSTEM.colors.primary }}>
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-xs md:text-sm text-black/60 mt-1">{label}</div>
    </div>
  );
}

export function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 py-5">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between text-left group">
        <span className="text-[#1A1A1A] font-medium pr-6 group-hover:text-black transition-colors">{q}</span>
        {open ? <ChevronDown className="h-5 w-5 text-black/40"/> : <ChevronRight className="h-5 w-5 text-black/40"/>}
      </button>
      {open && <div className="mt-3 text-black/70 leading-relaxed animate-fade-in">{a}</div>}
    </div>
  );
}

export function ScrollToTopButton({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
      className="fixed bottom-24 md:bottom-8 right-8 z-50 p-3 border border-black/5 bg-white hover:bg-gray-50 transition-all animate-fade-in"
      style={{ borderRadius: DESIGN_SYSTEM.radius.full, boxShadow: DESIGN_SYSTEM.shadows.medium }}
    >
      <ArrowUp className="h-5 w-5" style={{ color: DESIGN_SYSTEM.colors.primary }} />
    </button>
  );
}
