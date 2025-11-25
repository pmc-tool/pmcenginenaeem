/**
 * Design Tokens - PMC Engine Design System
 *
 * Single source of truth for all design values.
 * Use these tokens throughout the application for consistency.
 *
 * @module styles/tokens
 */

/**
 * Color palette based on PMC Engine constitution
 */
export const colors = {
  // Brand
  primary: '#EA2724',
  primaryHover: '#D01F1C',
  primaryActive: '#B81A17',

  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#FAFAFA',

  // Text
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#CCCCCC',
    inverse: '#FFFFFF',
  },

  // Borders
  border: '#E5E5E5',
  borderHover: '#D0D0D0',
  borderFocus: '#EA2724',

  // Semantic Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#065F46',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',

  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#991B1B',

  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#1E40AF',

  // States
  hover: 'rgba(0, 0, 0, 0.05)',
  active: 'rgba(0, 0, 0, 0.1)',
  focus: 'rgba(234, 39, 36, 0.1)',
  disabled: 'rgba(0, 0, 0, 0.3)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
} as const;

/**
 * Spacing scale based on 4px grid
 */
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

/**
 * Typography scale
 */
export const typography = {
  fontFamily: {
    sans: 'Inter, Geist, SF Pro, system-ui, sans-serif',
    mono: 'JetBrains Mono, Fira Code, Consolas, monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.4,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/**
 * Border radius scale
 */
export const radii = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

/**
 * Shadow scale
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  focus: '0 0 0 3px rgba(234, 39, 36, 0.1)',
} as const;

/**
 * Z-index scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

/**
 * Animation duration and easing
 */
export const animation = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '250ms',
    slow: '300ms',
    slower: '400ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

/**
 * Breakpoints for responsive design
 * Mobile-first approach: styles default to mobile, use min-width media queries to override
 *
 * Usage:
 * - xs: Small mobile (≤480px) - iPhone SE, small Android phones
 * - sm: Large mobile/Portrait tablet (481-768px) - Most phones, small tablets
 * - md: Tablet landscape (769-1024px) - iPad, Android tablets
 * - lg: Desktop (≥1025px) - Laptops, desktops
 */
export const breakpoints = {
  xs: '480px',   // Small mobile breakpoint
  sm: '768px',   // Large mobile / portrait tablet
  md: '1024px',  // Tablet landscape
  lg: '1280px',  // Desktop
} as const;

/**
 * Common component sizes
 */
export const sizes = {
  input: {
    sm: '2rem',     // 32px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
  },

  button: {
    sm: '2rem',     // 32px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
  },

  icon: {
    xs: '1rem',     // 16px
    sm: '1.25rem',  // 20px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '2.5rem',   // 40px
  },
} as const;

/**
 * Touch target sizes for mobile accessibility
 * Based on WCAG 2.1 AAA standards and mobile platform guidelines
 */
export const touchTargets = {
  minimum: '44px',      // WCAG 2.1 AAA minimum (44x44px)
  comfortable: '48px',  // Recommended for primary actions
  spacing: '8px',       // Minimum spacing between touch targets
} as const;

/**
 * Responsive typography scale
 * Breakpoint-based sizing (not fluid) for predictable layouts
 */
export const responsiveTypography = {
  pageTitle: {
    mobile: '1.25rem',   // 20px - Mobile (xs, sm)
    tablet: '1.375rem',  // 22px - Tablet (md)
    desktop: '1.5rem',   // 24px - Desktop (lg+)
  },
  sectionTitle: {
    mobile: '1.125rem',  // 18px
    tablet: '1.25rem',   // 20px
    desktop: '1.375rem', // 22px
  },
  label: {
    all: '0.875rem',     // 14px - No scaling
  },
  body: {
    all: '0.875rem',     // 14px - Minimum for readability
  },
  helper: {
    all: '0.75rem',      // 12px - Helper text, captions
  },
  // Minimum font sizes to prevent browser zoom on mobile
  inputMinimum: '16px',  // Prevents iOS auto-zoom on input focus
} as const;

/**
 * Responsive spacing adjustments
 * Tighter spacing on mobile, comfortable on desktop
 */
export const responsiveSpacing = {
  section: {
    mobile: spacing[4],    // 16px
    tablet: spacing[6],    // 24px
    desktop: spacing[8],   // 32px
  },
  component: {
    mobile: spacing[3],    // 12px
    tablet: spacing[4],    // 16px
    desktop: spacing[5],   // 20px
  },
  inline: {
    mobile: spacing[2],    // 8px
    tablet: spacing[2.5],  // 10px
    desktop: spacing[3],   // 12px
  },
} as const;

/**
 * Complete design tokens export
 */
export const tokens = {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  zIndex,
  animation,
  breakpoints,
  sizes,
  touchTargets,
  responsiveTypography,
  responsiveSpacing,
} as const;

export type Tokens = typeof tokens;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Breakpoints = typeof breakpoints;
export type TouchTargets = typeof touchTargets;
export type ResponsiveTypography = typeof responsiveTypography;
export type ResponsiveSpacing = typeof responsiveSpacing;
