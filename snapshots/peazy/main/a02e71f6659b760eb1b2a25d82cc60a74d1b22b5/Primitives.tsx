
import React from "react";
import { Sparkles, ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, X } from "lucide-react";
import { DESIGN_SYSTEM } from "./constants";

export function Button({ 
  children, 
  variant = 'primary', 
  className = "", 
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'ghost'; 
  className?: string; 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-95";
  const variants = {
    primary: `text-white hover:bg-opacity-90 shadow-sm`,
    secondary: `bg-white text-[${DESIGN_SYSTEM.colors.primary}] border border-[${DESIGN_SYSTEM.colors.border}] hover:bg-gray-50 shadow-sm`,
    ghost: `bg-transparent text-[${DESIGN_SYSTEM.colors.textMuted}] hover:text-[${DESIGN_SYSTEM.colors.text}] hover:bg-black/5`
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      style={{ 
        backgroundColor: variant === 'primary' ? DESIGN_SYSTEM.colors.primary : undefined,
        borderRadius: DESIGN_SYSTEM.radius.sm
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function MockField({ 
  label = "", 
  value = "", 
  className = "", 
  highlighted = false 
}: { 
  label?: string; 
  value?: string; 
  className?: string; 
  highlighted?: boolean 
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[10px] font-bold uppercase tracking-wider text-black/40">{label}</label>}
      <div 
        className={`h-9 w-full flex items-center px-3 text-[11px] transition-all duration-500 overflow-hidden ${
          highlighted 
            ? `bg-[${DESIGN_SYSTEM.colors.primary}]/5 border-2 border-[${DESIGN_SYSTEM.colors.primary}] shadow-[0_0_15px_rgba(10,25,47,0.15)]` 
            : "bg-white border border-black/5 text-black/20"
        }`} 
        style={{ borderRadius: DESIGN_SYSTEM.radius.sm }}
      >
        {value || "..."}
      </div>
    </div>
  );
}

export function StatusBadge({ type = 'neutral', label = "" }: { type?: 'success' | 'warning' | 'neutral', label: string }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    neutral: "bg-gray-50 text-gray-500 border-gray-100"
  };
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-tight ${styles[type]}`}>
      {label}
    </span>
  );
}

export function BrowserShell({ children, url = "peazy-crm.io/leads/new", className = "" }: { children: React.ReactNode, url?: string, className?: string }) {
  return (
    <div className={`flex flex-col h-full bg-white border border-black/10 shadow-2xl overflow-hidden ${className}`} style={{ borderRadius: DESIGN_SYSTEM.radius.md }}>
      {/* Chrome Toolbar */}
      <div className="h-10 bg-[#F1F3F4] border-b border-black/5 flex items-center px-3 gap-4 flex-shrink-0">
        <div className="flex gap-1.5 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex items-center gap-3 text-black/30">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5" />
          <RotateCcw className="h-3.5 w-3.5" />
        </div>
        <div className="flex-grow bg-white h-7 rounded-md border border-black/5 flex items-center px-3 gap-2">
          <ShieldCheck className="h-3 w-3 text-emerald-500" />
          <span className="text-[10px] text-black/50 font-medium truncate">{url}</span>
        </div>
      </div>
      <div className="flex-grow overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}

export function MockWindow({ children, title = "", className = "" }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <div 
      className={`border border-[${DESIGN_SYSTEM.colors.border}] bg-[#F5F5F5] p-2 flex gap-2 overflow-hidden font-sans ${className}`}
      style={{ borderRadius: DESIGN_SYSTEM.radius.md, boxShadow: DESIGN_SYSTEM.shadows.soft }}
    >
      {children}
    </div>
  );
}

export function Tag({ children }: { children?: React.ReactNode }) {
  return (
    <span 
      className="inline-flex items-center gap-2 border border-black/10 bg-black/5 px-3 py-1 text-xs text-black/70 font-medium"
      style={{ borderRadius: DESIGN_SYSTEM.radius.full }}
    >
      {/* <Sparkles className="h-3.5 w-3.5" /> */}{children}
    </span>
  );
}

export function GlassCard({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      {...rest} 
      className={`group bg-white border border-gray-100 transition-all duration-300 ${className}`}
      style={{ borderRadius: DESIGN_SYSTEM.radius.md, boxShadow: DESIGN_SYSTEM.shadows.soft }}
    >
      {children}
    </div>
  );
}

export function VideoModal({ isOpen, onClose, videoUrl }: { isOpen: boolean; onClose: () => void; videoUrl: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="h-6 w-6" />
        </button>
        <iframe 
          src={videoUrl} 
          className="w-full h-full" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    </div>
  );
}
