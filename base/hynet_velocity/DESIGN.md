---
name: Hynet Velocity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3e4850'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6f7881'
  outline-variant: '#bec8d1'
  surface-tint: '#006491'
  primary: '#00628d'
  on-primary: '#ffffff'
  primary-container: '#007cb2'
  on-primary-container: '#fcfcff'
  inverse-primary: '#89ceff'
  secondary: '#5d5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e5'
  on-secondary-container: '#636467'
  tertiary: '#4f5d70'
  on-tertiary: '#ffffff'
  tertiary-container: '#677689'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#e2e2e5'
  secondary-fixed-dim: '#c6c6c9'
  on-secondary-fixed: '#1a1c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#d4e4fa'
  tertiary-fixed-dim: '#b9c8de'
  on-tertiary-fixed: '#0d1c2d'
  on-tertiary-fixed-variant: '#39485a'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  section-gap: 80px
  container-padding: 24px
  element-gap: 16px
  grid-columns: '12'
  gutter: 16px
---

## Brand & Style

This design system reimagines a corporate technology core through the lens of high-growth fintech aesthetics. The brand personality is **authoritative yet agile**, bridging the gap between established enterprise reliability and the disruptive energy of modern digital finance.

The visual style is a fusion of **Corporate Modern** and **High-Contrast Bold**. It utilizes heavy, oversized typography and a stark, light/dark tonal foundation to create a sense of urgency and technical precision. By employing generous whitespace and a "scrolling-storyboard" layout inspired by Lemon.me, the UI transforms standard B2B information into a dynamic, high-impact narrative. The emotional response should be one of complete confidence in a forward-thinking, technically superior partner.

## Colors

The palette is anchored in **Professional Blue** (Primary) and a deep **Carbon Slate** (Secondary), derived directly from the corporate identity. 

- **Primary Blue:** Used for key actions, brand accents, and technical highlights.
- **Carbon Slate:** Used for high-impact backgrounds and primary text to provide a sophisticated, weighted feel.
- **Vibrant Accent:** A digital cyan (#00F0FF) is introduced to provide the "fintech spark," used sparingly for success states, active indicators, or small high-visibility labels.

The system relies on high-contrast "blocks." Sections should oscillate between pure white (#FFFFFF) and deep slate (#1A1C1E) backgrounds to maintain user engagement and define distinct content phases.

## Typography

The typography strategy focuses on scale and weight to convey power. 

- **Display & Headlines:** Using **Hanken Grotesk** at Extra Bold weights. Headlines should be tight-leaded and slightly tracked in to feel like a cohesive visual unit.
- **Body Text:** **Manrope** provides a modern, highly legible geometric sans-serif experience that maintains professionalism in dense service descriptions.
- **Technical Accents:** **JetBrains Mono** is used for labels, tags, and small data points to emphasize the company's technical and developer-centric capabilities.

On mobile, headlines should remain oversized relative to the screen to maintain the high-impact visual hierarchy.

## Layout & Spacing

This design system uses a **Fluid Grid** model with aggressive vertical rhythm. 

- **Mobile Layout:** A 4-column grid with 24px side margins. 
- **Verticality:** Instead of standard 24px or 32px gaps between sections, this system uses 80px+ gaps to create the "scrolling billboard" effect seen in modern fintech landing pages.
- **Safe Zones:** Content is strictly contained within safe margins, but background colors and high-quality photography must be **full-bleed** (edge-to-edge) to create an immersive experience.
- **Alignment:** Consistent left-alignment for all headlines and body copy to ensure a strong vertical "spine" for the user's eye to follow.

## Elevation & Depth

To maintain a crisp, modern feel, this system avoids traditional heavy shadows. Instead, it utilizes:

- **Tonal Tiers:** Depth is created by placing lighter cards (#F8FAFC) on slightly darker backgrounds (#F1F5F9), or dark cards on carbon backgrounds.
- **Soft Ambient Occlusion:** When shadows are necessary for cards, they are extremely diffused: `0px 10px 30px rgba(0, 0, 0, 0.04)`.
- **Glassmorphism:** Navigation bars and sticky elements use a heavy backdrop blur (20px) with 80% opacity white or slate to maintain context of the content beneath.

## Shapes

The shape language is dominated by **extreme roundedness (Pill-shaped)**. This softens the aggressive typography and creates an approachable, "app-like" feel for corporate content. 

- **Buttons:** Always fully pill-shaped.
- **Cards:** Large corner radii (24px or `rounded-xl`) are used to frame photography and content blocks.
- **Inputs:** Softened to match the card radius, creating a unified interactive language.

## Components

### Buttons
Primary buttons are large, pill-shaped, and high-contrast (e.g., White text on Carbon Slate, or Slate text on Primary Blue). Hover/Active states should involve a slight scale-up (1.02x) rather than a color change to maintain the "squishy" tactile feel.

### Cards
Cards are the primary container for services and case studies. They should use `rounded-xl` corners and include a subtle border (`1px solid rgba(0,0,0,0.05)`) to define edges on light backgrounds. Full-bleed images inside cards should have the top corners masked to match the card radius.

### Input Fields
Inputs follow the pill-shaped theme. Borders are minimal; focus states should be indicated by a 2px Primary Blue stroke. Labels should use the `label-caps` (JetBrains Mono) style above the field.

### Progress & Status
Use the Vibrant Accent (#00F0FF) for progress bars, status dots, and "Live" indicators to reinforce the tech-driven, real-time nature of the services.

### Chips/Tags
Small, pill-shaped containers with `label-caps` typography. Used for categorizing services or tech stacks. Use a low-contrast background (e.g., Primary Blue at 10% opacity) with Primary Blue text.