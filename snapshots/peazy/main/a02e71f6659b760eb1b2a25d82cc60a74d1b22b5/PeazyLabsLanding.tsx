
import React, { useState, useEffect, useRef, MouseEvent, useMemo } from "react";
import { ArrowRight, ChevronDown, FileText, MousePointerClick, Mic, Hexagon, Tv, Headphones, Bolt, Users, Code2, UploadCloud, Sparkles } from "lucide-react";
import { Typewriter } from 'react-simple-typewriter';
import { DESIGN_SYSTEM } from "./constants";
import { Button, Tag, GlassCard, VideoModal } from "./Primitives";
import { Glow, FAQItem, ScrollToTopButton } from "./Helpers";
import { InteractiveGridBackground, ChromeExtensionImage, InstructorLedImage, NativeGuideImage, PeazyLaptopHeroMockup } from "./Visuals";
import { CapabilitiesSection, MarketFeedback, LogoCloud, DeploymentRoadmap, Footer } from "./Sections";

const deliveryModes = [
  { id: 'zoom', icon: Users, tab: 'Instructor Led Training Rooms', number: '01', title: 'Interactive Training Rooms', description: "Peazy takes the stage as an autonomous AI Instructor. It leads interactive training sessions, demonstrating workflows and validating trainee actions in real-time.", image: InstructorLedImage, animationClass: 'animate-sound-pulse' },
  { id: 'browser', icon: Tv, tab: 'In-Browser Guide', number: '02', title: 'In browser, any app', description: 'Our Chrome extension delivers voice-guided workshops on any web app. Coach users on CRMs, ERPs, and internal tools. No integration needed.', image: ChromeExtensionImage, animationClass: 'animate-screen-glow' },
  { id: 'inapp', icon: Bolt, tab: 'Native Integration', number: '03', title: 'Seamless In-App Experience', description: "Embed Peazy directly into your enterprise platform. It lives inside your application's sidebars and panels, guiding users through complex logic like Marketing Cloud Journeys.", image: NativeGuideImage, animationClass: 'animate-bolt-flash' },
];

export function PeazyLabsLanding() {
  const [activeDeliveryMode, setActiveDeliveryMode] = useState('zoom');
  const [showScroll, setShowScroll] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const activeData = deliveryModes.find(u => u.id === activeDeliveryMode);
  const heroRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const typingWords = ['Autonomy', 'Behavior', 'Competence'];

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    const targetElement = targetId ? document.getElementById(targetId) : null;
    if (targetElement) {
      window.scrollTo({ top: targetElement.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const checkScrollTop = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        heroRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        heroRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-section').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Calculate indicator position for the sliding tab background
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeButton = tabsRef.current.querySelector(`[data-id="${activeDeliveryMode}"]`) as HTMLElement;
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.clientWidth,
        opacity: 1
      });
    }
  }, [activeDeliveryMode]);

  return (
    <div className={`min-h-screen w-full select-text relative`} style={{ backgroundColor: DESIGN_SYSTEM.colors.bg, color: DESIGN_SYSTEM.colors.text }}>
      <InteractiveGridBackground />
      <Glow>
        <header className={`sticky top-0 z-40 backdrop-blur-md border-b border-gray-100 bg-[${DESIGN_SYSTEM.colors.bg}]/90`}>
          <div className={`${DESIGN_SYSTEM.spacing.container} h-16 flex items-center justify-between gap-4`}>
            <div className="flex items-center"><span className="font-semibold tracking-tight text-base sm:text-lg shrink-0" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>Peazy Labs</span></div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-black/60 font-medium">
              <a href="#method" onClick={handleNavClick} className="hover:text-[#0A192F] transition-colors">Approach</a>
              <a href="#platform" onClick={handleNavClick} className="hover:text-[#0A192F] transition-colors">Product</a>
              <a href="#feedback" onClick={handleNavClick} className="hover:text-[#0A192F] transition-colors">Impact</a>
              <a href="#roadmap" onClick={handleNavClick} className="hover:text-[#0A192F] transition-colors">Rollout</a>
            </nav>
            <Button onClick={() => window.open(DESIGN_SYSTEM.urls.booking, '_blank')} className="px-3 py-2 sm:px-5 whitespace-nowrap shrink-0 text-xs sm:text-sm">
              Book Discovery Call <ArrowRight className="h-4 w-4 shrink-0"/>
            </Button>
          </div>
        </header>

        <section ref={heroRef} className="relative overflow-hidden fade-in-section hero-bg-glow" id="product">
          <div className={`relative z-10 ${DESIGN_SYSTEM.spacing.container} pt-24 md:pt-32 pb-12 md:pb-16`}>
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* <Tag>Interactive AI Training</Tag> */}
              <h1 className="mt-8 text-5xl md:text-7xl font-medium leading-[1.1] [text-wrap:balance]" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif, letterSpacing: '-0.005em' }}>
                Software RoI defined by <br className="md:hidden" />
                <span className="inline-flex items-center gap-3">
                  User
                  <span className="italic inline-block text-[#0A192F] min-w-[300px] text-left">
                      <Typewriter
                          words={typingWords}
                          loop={0} // Infinite loop
                          cursor={false} // Disable cursor
                          typeSpeed={100}
                          deleteSpeed={60}
                          delaySpeed={1500}
                      />
                  </span>
                </span>
              </h1>
              <p className="mt-8 text-black/70 text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
                Make software adoption and user training active, addictive, & effective.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button onClick={() => window.open(DESIGN_SYSTEM.urls.booking, '_blank')} className="px-8 py-4 text-lg w-full sm:w-auto">
                  Book Discovery Call <ArrowRight className="h-5 w-5"/>
                </Button>
                <Button variant="ghost" onClick={() => setIsVideoOpen(true)} className="px-8 py-4 text-lg w-full sm:w-auto">
                  See demo video
                </Button>
              </div>
              {/* MARQUEE TICKER - Philosophy */}
              <div className="mt-20 w-full overflow-hidden relative z-20 border-y border-black/[0.05] bg-white/50 backdrop-blur-sm">
                <div className="flex w-max animate-infinite-scroll items-center gap-16 py-4">
                   {/* Doubled Content for Seamless Loop */}
                   {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-16 shrink-0">
                          <span className="text-sm md:text-lg font-medium tracking-wide font-serif italic text-[#1A1A1A]">
                            Employees don’t hate new software. They hate feeling lost.
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#0A192F] opacity-70">
                            63% Rollout Fail Rate
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                          <span className="text-sm md:text-lg font-medium tracking-wide font-serif italic text-[#1A1A1A]">
                             Concierge adoption journey for every user
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#0A192F] opacity-70">
                            Stop Managing Change
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                      </div>
                   ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="method" className="pt-24 pb-24 md:pt-40 md:pb-32 fade-in-section relative overflow-hidden bg-white">
          <div className="w-full flex flex-col items-center text-center">
            
            <div className="w-full relative z-10">
               <PeazyLaptopHeroMockup />
            </div>

            <div className="mt-16 flex flex-col items-center gap-8">
              <p className="text-black/70 text-lg md:text-xl max-w-2xl leading-relaxed font-sans italic px-4">
                Agentic Training layer that delivers instructor-led learn-by-doing workshops at scale
              </p>
              <Button 
                onClick={() => setIsVideoOpen(true)}
                className="px-10 py-4 bg-[#0A192F] text-white hover:bg-[#1A2A3F] transition-all text-sm font-bold shadow-soft rounded-full"
              >
                See demo video
              </Button>
            </div>
          </div>
        </section>

        <section id="platform" className="pt-8 pb-16 md:pt-12 md:pb-20 fade-in-section">
          <div className={DESIGN_SYSTEM.spacing.container}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>Workshops, delivered anywhere</h2>
              <p className="text-black/60 mt-4 mx-auto max-w-prose text-base">Contextual AI guidance across all your apps and workflows in multiple formats.</p>
            </div>
            
            <div className="hidden md:flex flex-wrap justify-center mb-16 relative" ref={tabsRef}>
              <div 
                className="flex p-1.5 bg-black/[0.03] border border-black/[0.05] relative"
                style={{ borderRadius: DESIGN_SYSTEM.radius.md }}
              >
                {/* The Sliding Pill Indicator */}
                <div 
                  className="absolute h-[calc(100%-12px)] top-[6px] bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
                  style={{ 
                    left: `${indicatorStyle.left + 6}px`, 
                    width: `${indicatorStyle.width - 12}px`,
                    opacity: indicatorStyle.opacity,
                    borderRadius: DESIGN_SYSTEM.radius.sm,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                />
                
                {deliveryModes.map((dm) => {
                  const Icon = dm.icon;
                  const isActive = activeDeliveryMode === dm.id;
                  return (
                    <button 
                      key={dm.id} 
                      data-id={dm.id}
                      onClick={() => setActiveDeliveryMode(dm.id)}
                      className={`relative z-10 inline-flex items-center gap-3 px-6 py-3 text-base transition-all active:scale-95 group ${
                        isActive ? 'text-[#0A192F]' : 'text-black/40 hover:text-black'
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? dm.animationClass : 'group-hover:scale-110'}`} />
                      <span className="font-semibold tracking-tight">{dm.tab}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {activeData && (
              <div key={activeData.id} className="hidden md:grid md:grid-cols-5 gap-12 md:gap-20 items-center animate-fade-in">
                <div className="md:col-span-3">
                  <GlassCard className="p-3" style={{ borderRadius: DESIGN_SYSTEM.radius.lg }}>
                    <activeData.image />
                  </GlassCard>
                </div>
                <div className="md:col-span-2">
                  <div className="relative">
                    <p className="text-7xl md:text-8xl font-bold text-black/[0.03] absolute -top-12 -left-6 select-none leading-none">{activeData.number}</p>
                    <h3 className="text-3xl md:text-4xl font-medium text-[#1A1A1A] relative leading-tight" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>{activeData.title}</h3>
                    <p className="mt-6 text-black/60 text-base leading-relaxed relative">{activeData.description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="md:hidden flex flex-col gap-5">
              {deliveryModes.map((dm) => {
                const isActive = activeDeliveryMode === dm.id;
                const Icon = dm.icon;
                return (
                  <GlassCard 
                    key={dm.id} 
                    className="p-0 overflow-hidden transition-all duration-300 border-black/[0.05]"
                    style={{ borderRadius: DESIGN_SYSTEM.radius.md }}
                  >
                    <button onClick={() => setActiveDeliveryMode(dm.id)} className="w-full p-5 flex justify-between items-center text-left active:bg-black/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <Icon className={`h-5 w-5 transition-transform ${isActive ? dm.animationClass : ''}`} style={{ color: isActive ? DESIGN_SYSTEM.colors.primary : '#1A1A1A' }} />
                        <span className={`font-semibold ${isActive ? 'text-[#0A192F]' : 'text-black/50'}`}>{dm.tab}</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-black/20 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                    {isActive && (
                      <div className="p-5 pt-0 animate-fade-in">
                        <div 
                          className="p-2 border border-black/[0.05] bg-[#FAFAFA]"
                          style={{ borderRadius: DESIGN_SYSTEM.radius.sm }}
                        ><dm.image /></div>
                        <div className="mt-6 relative">
                          <p className="text-6xl font-bold text-black/[0.03] absolute -top-10 -left-2 select-none leading-none">{dm.number}</p>
                          <h3 className="text-2xl font-medium text-[#1A1A1A] relative">{dm.title}</h3>
                          <p className="mt-4 text-black/60 text-base leading-relaxed relative">{dm.description}</p>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        <CapabilitiesSection />
        <LogoCloud />
        <MarketFeedback />
        <DeploymentRoadmap />

        <section id="faq" className="py-20 md:py-24 fade-in-section">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <GlassCard 
              className="p-8 md:p-14 text-left max-w-3xl mx-auto border-black/[0.05]"
              style={{ borderRadius: DESIGN_SYSTEM.radius.xxl }}
            >
              <h3 className="font-medium text-xl text-center text-[#1A1A1A] mb-10" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>Common questions</h3>
              <div className="flex flex-col">
                <FAQItem q="How does Peazy integrate with our tools?" a="Peazy works instantly on any web application via our Chrome extension. For native SaaS platforms, our React SDK allows you to embed the instructor directly into your codebase with just a few lines of code." />
                <FAQItem q="What about sensitive data in our ERP/CRM?" a="Security is our foundation. Peazy processes workflow metadata, not PII. We are SOC 2 Type II compliant and offer VPC deployment options for enterprise partners." />
                <FAQItem q="Does it support voice in multiple languages?" a="Yes. Our AI instructor supports over 25 languages with natural, localized accents to ensure global workforces learn in their native tongue." />
                <FAQItem q="How is this different from a standard product tour?" a="Product tours are passive overlays. Peazy is an active coach. It waits for you to perform actions, validates them, and provides correction only when you're stuck—mimicking a human trainer." />
                <FAQItem q="Can we white-label the trainer?" a="Design partners have full control over the AI trainer's personality, voice, and visual theme to match their brand identity perfectly." />
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="py-12 md:py-16 fade-in-section">
          <div className={`${DESIGN_SYSTEM.spacing.container}`}>
            <div 
              className="py-7 px-8 md:py-10 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10"
              style={{ backgroundColor: DESIGN_SYSTEM.colors.primary, borderRadius: DESIGN_SYSTEM.radius.xxl }}
            >
              <div className="max-w-2xl text-left">
                <h2 
                  className="text-3xl md:text-4xl font-medium text-white leading-tight" 
                  style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}
                >
                  Instructor-led training. Available 24/7.
                </h2>
                <p className="mt-2 text-white/50 text-sm md:text-base select-text">
                  See how your employees can go from oopsie-daisy to eazy peazy.
                </p>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <Button 
                  variant="ghost"
                  onClick={() => window.open(DESIGN_SYSTEM.urls.booking, '_blank')}
                  className="w-full md:w-auto px-8 py-3 bg-white text-[#1A1A1A] hover:bg-white/90 transition-all text-sm font-bold shadow-sm"
                >
                  Book Discovery Call
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </Glow>
      <ScrollToTopButton show={showScroll} />
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl="https://www.youtube.com/embed/WTjZFtyDv3Y?autoplay=1&rel=0" 
      />
    </div>
  );
}


// Auto-sync verification Thu Feb  5 12:13:28 PST 2026
