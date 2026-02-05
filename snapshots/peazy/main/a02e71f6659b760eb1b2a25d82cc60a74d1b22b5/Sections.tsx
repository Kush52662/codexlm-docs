/**
 * Sections for the Peazy Labs Landing Page
 */
import React from "react";
import { ArrowRight } from "lucide-react";
import { DESIGN_SYSTEM, toolLogos } from "./constants";
import { ProficiencyDashboardMockup, IltWorkshopRolloutVisual, WorkshopCreationCard } from "./Visuals";

function CapabilitiesSection() {
  const secondaryCapabilities = [
    { 
      title: "Policy-aware coaching", 
      body: "Guardrails matching your rules: required fields and naming conventions. Peazy coaches users in real-time.", 
      tag: "GUARDRAILS"
    },
    { 
      title: "Sandbox-to-production training", 
      body: "Practice safely in a sandbox, then execute in production with confidence. The bridge between learning and doing is now shorter.", 
      tag: "SANDBOX MODE"
    },
    { 
      title: "Change management that sticks", 
      body: "Roll out new processes with targeted training and confirmation loops. Turn complex shifts into seamless transitions.", 
      tag: "CHANGE MGMT"
    }
  ];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-white">
      <div className={DESIGN_SYSTEM.spacing.container}>
        {/* Hero Feature - Deep Alignment with Synthesia Reference */}
        <div className="mb-8 fade-in-section group">
          <div className="relative bg-[#F9F8F6] overflow-hidden border border-black/[0.03]" style={{ borderRadius: DESIGN_SYSTEM.radius.xxl }}>
             <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
                {/* Content Side */}
                <div className="lg:col-span-5 p-10 md:p-14 flex flex-col justify-center relative">
                   {/* Tag at the TOP LEFT */}
                   <div className="mb-6">
                      <div className="inline-flex px-4 py-1.5 rounded-full bg-[#0A192F] text-[9px] font-bold text-white uppercase tracking-[0.2em] w-fit">
                         ADOPTION
                      </div>
                   </div>

                   <h3 className="text-3xl md:text-4xl font-medium text-[#0A192F] mb-6 leading-tight" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>
                      Employee Time to Proficiency Dashboard
                   </h3>
                   <p className={`${DESIGN_SYSTEM.textSizes.base} text-black/60 leading-relaxed max-w-sm mb-6`}>
                      Measure how fast your team masters new software (not just “watched the training video”).
                   </p>
                </div>
                
                {/* Visual Side */}
                <div className="lg:col-span-7 bg-white/10 relative overflow-hidden flex items-center justify-center p-8 border-l border-black/[0.03]">
                   <IltWorkshopRolloutVisual />
                </div>
             </div>
          </div>
        </div>

        <div className="mb-6 fade-in-section group">
          <div className="relative bg-[#F9F8F6] overflow-hidden border border-black/[0.03]" style={{ borderRadius: DESIGN_SYSTEM.radius.xxl }}>
             <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
                {/* Visual Side */}
                <div className="lg:col-span-7 bg-white/10 relative overflow-hidden flex items-center justify-center p-8 border-r border-black/[0.03]">
                   <WorkshopCreationCard />
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 p-10 md:p-14 flex flex-col justify-center relative">
                   {/* Tag at the TOP LEFT */}
                   <div className="mb-6">
                      <div className="inline-flex px-4 py-1.5 rounded-full bg-[#0A192F] text-[9px] font-bold text-white uppercase tracking-[0.2em] w-fit">
                         STUDIO
                      </div>
                   </div>

                   <h3 className="text-3xl md:text-4xl font-medium text-[#0A192F] mb-6 leading-tight" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>
                      Build agentic workshops with AI like PPTs, slide by slide
                   </h3>
                   <p className={`${DESIGN_SYSTEM.textSizes.base} text-black/60 leading-relaxed max-w-sm mb-6`}>
                      Our block-based authoring studio allows you to easily create, edit, and publish your training content in minutes.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-section">
          {secondaryCapabilities.map((cap, index) => (
            <div 
              key={index}
              className="group relative bg-white p-8 shadow-soft hover:shadow-medium transition-all duration-700 border border-black/[0.05] flex flex-col min-h-[220px]"
              style={{ borderRadius: DESIGN_SYSTEM.radius.xl }}
            >
              <div className="mb-4">
                <div className="inline-flex px-3 py-1 rounded-full bg-[#0A192F] text-[8px] font-bold text-white uppercase tracking-[0.15em]">
                  {cap.tag}
                </div>
              </div>

              <h3 className="text-xl font-medium text-[#0A192F] mb-4 leading-tight" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>
                {cap.title}
              </h3>
              
              <p className={`${DESIGN_SYSTEM.textSizes.base} text-black/60 leading-relaxed mb-6 flex-grow`}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function MarketFeedback() {
  const feedbackCardStyles = "p-8 md:p-10 border border-black/[0.05] hover:border-[#0A192F]/20 relative transition-all duration-500 group bg-white";
  return (
    <section id="feedback" className={`${DESIGN_SYSTEM.spacing.section} fade-in-section`}>
      <div className={DESIGN_SYSTEM.spacing.container}>
        <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-medium" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>The impact of learn-by-doing....is to be experienced</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
                className={`md:col-span-2 ${feedbackCardStyles}`}
                style={{ borderRadius: DESIGN_SYSTEM.radius.lg, boxShadow: DESIGN_SYSTEM.shadows.soft }}
            >
                 <blockquote className="font-['Newsreader'] italic text-xl md:text-2xl text-[#1A1A1A] leading-relaxed group-hover:-translate-y-1 transition-transform duration-500">
                    "We were seeing 40% adoption on our Salesforce rollout. Within three months of Peazy, we hit 85%. It’s the insurance we didn’t know we needed."
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100" alt="VP" className="w-10 h-10 rounded-full object-cover border border-black/10" />
                    <div className="text-xs font-bold uppercase tracking-widest text-black/60 font-sans">VP of Operations</div>
                </div>
            </div>
            <div 
                className={`md:col-span-1 ${feedbackCardStyles}`}
                style={{ borderRadius: DESIGN_SYSTEM.radius.lg, boxShadow: DESIGN_SYSTEM.shadows.soft }}
            >
                 <blockquote className="font-['Newsreader'] italic text-xl md:text-2xl text-[#1A1A1A] leading-relaxed group-hover:-translate-y-1 transition-transform duration-500">
                    "Finally, a tool that respects the user's intelligence."
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100" alt="Architect" className="w-10 h-10 rounded-full object-cover border border-black/10" />
                    <div className="text-xs font-bold uppercase tracking-widest text-black/60 font-sans">Systems Architect</div>
                </div>
            </div>
            <div 
                className={`md:col-span-3 ${feedbackCardStyles}`}
                style={{ borderRadius: DESIGN_SYSTEM.radius.lg, boxShadow: DESIGN_SYSTEM.shadows.soft }}
            >
                 <blockquote className="font-['Newsreader'] italic text-xl md:text-2xl text-[#1A1A1A] leading-relaxed group-hover:-translate-y-1 transition-transform duration-500">
                    "Peazy turned our SAP migration from a liability into a standardized asset."
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100" alt="Director" className="w-10 h-10 rounded-full object-cover border border-black/10" />
                    <div className="text-xs font-bold uppercase tracking-widest text-black/60 font-sans">Director of IT</div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}


function LogoCloud() {
  const doubledLogos = [...toolLogos, ...toolLogos];
  
  return (
    <div className="py-8 fade-in-section overflow-hidden">
      <div className={DESIGN_SYSTEM.spacing.container}>
        <div className="flex justify-center mb-8">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-white border border-black/5 text-[9px] font-bold text-black/40 uppercase tracking-[0.2em] w-fit">
            Works with your existing tools
          </div>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex w-max animate-infinite-scroll items-center gap-12 md:gap-24 px-12 md:px-24">
            {doubledLogos.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="flex-shrink-0 flex items-center justify-center py-2">
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="h-10 md:h-14 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110" 
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function DeploymentRoadmap() {
  const phase1 = [
    { number: "1", title: "Discovery workshop", active: true },
    { number: "2", title: "Convert decks to ILT blocks", active: false },
    { number: "3", title: "Pilot workshop in production", active: false },
    { number: "4", title: "Compare adoption lift", active: false },
    { number: "5", title: "Refine with feedback loops", active: false },
  ];

  const phase2 = [
    { number: "1", title: "Full rollout plan", active: true },
    { number: "2", title: "In-app guidance", active: false },
    { number: "3", title: "Time-to-proficiency tracking", active: false },
    { number: "4", title: "Policy-aware guardrails", active: false },
    { number: "5", title: "Ongoing optimization", active: false },
    { number: "6", title: "Executive reporting", active: false },
  ];

  return (
    <section id="roadmap" className="py-16 md:py-20 relative overflow-hidden">
      <div className={DESIGN_SYSTEM.spacing.container}>
        

        <div id="roadmap" className="fade-in-section bg-[#F9F8F6] text-[#0A192F] border border-black/[0.04] overflow-hidden shadow-soft" style={{ borderRadius: DESIGN_SYSTEM.radius.xxl }}>
          <div className="px-8 md:px-12 pt-6 md:pt-8 pb-4 md:pb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2 leading-[1.1]" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>
              Pilot and Adopt Seamlessly
            </h2>
            <p className="text-[13px] md:text-[14px] text-black/60 leading-relaxed max-w-3xl">
              Transition from static onboarding decks to interactive ILT workshops that drive adoption.
            </p>
          </div>

          <div className="px-8 md:px-12 pb-6 md:pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-4" style={{ fontFamily: DESIGN_SYSTEM.fonts.sans }}>
                  Phase 1: Pilot
                </h3>
                <div className="flex flex-col gap-0">
                  {phase1.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-lg px-3 py-1 border ${
                        step.active
                          ? "bg-white border-black/[0.08] shadow-sm"
                          : "border-transparent bg-transparent"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          step.active ? "bg-[#0A192F] text-white shadow-sm" : "bg-black/5 text-black/40"
                        }`}
                      >
                        {step.number}
                      </div>
                      <div>
                        <h4 className={`text-[13px] font-semibold ${step.active ? "text-[#0A192F]" : "text-black/60"}`}>
                          {step.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 mb-4" style={{ fontFamily: DESIGN_SYSTEM.fonts.sans }}>
                  Phase 2: Full Rollout
                </h3>
                <div className="flex flex-col gap-0">
                  {phase2.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-lg px-3 py-1 border ${
                        step.active
                          ? "bg-white border-black/[0.08] shadow-sm"
                          : "border-transparent bg-transparent"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          step.active ? "bg-[#0A192F] text-white shadow-sm" : "bg-black/5 text-black/40"
                        }`}
                      >
                        {step.number}
                      </div>
                      <div>
                        <h4 className={`text-[13px] font-semibold ${step.active ? "text-[#0A192F]" : "text-black/60"}`}>
                          {step.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black/[0.06] px-8 md:px-12 py-4 md:py-5">
          <button 
            onClick={() => window.open(DESIGN_SYSTEM.urls.booking, "_blank")}
            className="w-full py-3 bg-[#0A192F] hover:bg-[#1e2a4a] text-white text-[14px] font-bold flex items-center justify-center gap-3 transition-all group"
            style={{ borderRadius: DESIGN_SYSTEM.radius.sm }}
          >
              Talk to founders to kick off a pilot <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.03] pt-16 pb-12">
      <div className={DESIGN_SYSTEM.spacing.container}>
        <div className="mb-16 text-center">
           <h2 className="text-2xl md:text-3xl font-medium leading-[1.1] text-[#0A192F]" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif, letterSpacing: '-0.005em' }}>
              Helping employees go from <br className="md:hidden" />
              <span className="text-black/40 italic">oopsy-daisy</span> to <span className="italic">eazy-peazy.</span>
           </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-black/[0.05] pt-12 text-left">
          <div className="md:col-span-2">
            <span className="font-semibold tracking-tight text-lg" style={{ fontFamily: DESIGN_SYSTEM.fonts.serif }}>Peazy Labs</span>
            <p className="mt-4 text-black/50 text-sm max-w-xs font-sans">
              The Agentic Training layer for the modern enterprise. Making software adoption active, addictive, and effective.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-black/30 mb-6 font-sans">Connect</h4>
            <div className="flex flex-col gap-4 text-sm font-medium text-black/60 font-sans">
              <a href="https://linkedin.com/company/peazylabs" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
              <a href="mailto:hello@peazy.ai" className="hover:text-black transition-colors">Email</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-black/30 mb-6 font-sans">Legal</h4>
            <div className="flex flex-col gap-4 text-sm font-medium text-black/60 font-sans">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-black/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-black/30 text-xs font-medium font-sans">© {new Date().getFullYear()} Peazy Labs, Inc. All rights reserved.</div>
          <div className="text-black/30 text-xs font-medium italic font-sans">Designed for adoption.</div>
        </div>
      </div>
    </footer>
  );
}

export { 
  CapabilitiesSection, 
  MarketFeedback, 
  LogoCloud, 
  DeploymentRoadmap,
  Footer
};
