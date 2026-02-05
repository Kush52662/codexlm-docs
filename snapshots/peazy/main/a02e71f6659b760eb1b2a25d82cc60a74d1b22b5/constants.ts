
import { Tv, Headphones, Bolt } from "lucide-react";

export const DESIGN_SYSTEM = {
  colors: {
    primary: "#0A192F",    // Deep Navy
    secondary: "#334155",  // Slate
    accent: "#475569",     // Slate Light
    bg: "#F9F8F6",         // Warm White
    surface: "#FFFFFF",    // Pure White
    muted: "#F0F0F0",      // Light Gray
    border: "rgba(0, 0, 0, 0.08)",
    text: "#1A1A1A",       // Ink Black
    textMuted: "rgba(26, 26, 26, 0.6)",
    white: "#FFFFFF",
    alert: "#EF4444"       // Red
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "40px",
    full: "9999px"
  },
  shadows: {
    soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.02)",
    medium: "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
    heavy: "0 20px 50px -12px rgba(0, 0, 0, 0.15)"
  },
  fonts: {
    serif: "'Playfair Display', serif",
    sans: "'Inter', sans-serif"
  },
  textSizes: {
    base: "text-[14px]",    // Reduced from default
    lg: "text-[16px]",      // Reduced from 20px
    xl: "text-[18px]",      // Reduced from 24px
    hero: "text-5xl md:text-7xl",
    heading: "text-3xl md:text-5xl"
  },
  spacing: {
    section: "py-24",
    container: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
  },
  urls: {
    booking: "https://calendly.com/kushal-ceo-sapientury/peazy-labs-discovery",
    demo: "https://peazy.ai/demo"
  }
};

export const toolLogos = [
  { name: 'QuickBooks', url: 'https://www.vectorlogo.zone/logos/intuit_quickbooks/intuit_quickbooks-ar21.svg' },
  { name: 'NetSuite', url: 'https://www.vectorlogo.zone/logos/netsuite/netsuite-ar21.svg' },
  { name: 'Salesforce', url: 'https://www.vectorlogo.zone/logos/salesforce/salesforce-ar21.svg' },
  { name: 'Workday', url: 'https://www.vectorlogo.zone/logos/workday/workday-ar21.svg' },
  { name: 'SAP', url: 'https://www.vectorlogo.zone/logos/sap/sap-ar21.svg' },
  { name: 'HubSpot', url: 'https://www.vectorlogo.zone/logos/hubspot/hubspot-ar21.svg' },
  { name: 'Zendesk', url: 'https://www.vectorlogo.zone/logos/zendesk/zendesk-ar21.svg' }
];
