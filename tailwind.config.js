/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. EXTRACTED COLORS FROM STITCH
      colors: {
        primary: "#415f8c",
        "primary-container": "#9ebcee",
        "on-primary": "#ffffff",
        "on-primary-container": "#2c4b76",
        
        secondary: "#006a6a",
        "secondary-container": "#81f1f1",
        "on-secondary": "#ffffff",
        
        tertiary: "#7b5816",
        "tertiary-container": "#e1b369",
        "on-tertiary": "#ffffff",
        
        // Surface & Background
        surface: "#F8FFFF",
        "surface-bright": "#f9f9f9",
        "surface-container": "#eeeeee",
        "surface-container-low": "#f3f3f3",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-dim": "#dadada",
        "surface-variant": "#e2e2e2",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#43474f",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        
        // Status colors
        success: "#9EBCEE",
        warning: "#F2D07D",
        error: "#E99B9B",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        
        // Utilities
        background: "#f9f9f9",
        "on-background": "#1a1c1c",
        outline: "#747780",
        "outline-variant": "#c3c6d0",
        "focus-glow": "#00CFCC",
        
        // Shadows (for neumorphism)
        "shadow-light": "#FFFFFF",
        "shadow-dark": "#D1D9E6",
      },
      
      // 2. EXTRACTED FONT CONFIGURATION
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      
      fontSize: {
        "caption": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label": ["12px", { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.05em" }],
        "medium": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "pastin": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "hister": ["40px", { lineHeight: "52px", fontWeight: "700", letterSpacing: "-0.01em" }],
        "display": ["56px", { lineHeight: "72px", fontWeight: "800", letterSpacing: "-0.02em" }],
      },
      
      // 3. NEUMORPHIC SHADOW UTILITIES
      boxShadow: {
        "neu-flat": "6px 6px 12px #D1D9E6, -6px -6px 12px #FFFFFF",
        "neu-inset": "inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF",
        "neu-hover": "8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF",
        "neu-active": "inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF",
        "sidebar": "10px 0 20px -10px rgba(209,217,230,0.5)",
      },
      
      // 4. SPACING & LAYOUT
      spacing: {
        "gutter": "24px",
        "container-max": "1440px",
        "margin-desktop": "80px",
      },
      
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
      },
    },
  },
  plugins: [],
}