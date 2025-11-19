# Mobile Responsiveness Quickstart Guide

**Feature**: Mobile-Responsive PMC Engine UI
**Version**: 1.0
**Last Updated**: 2025-11-19

## Overview

This guide helps developers test and implement mobile-responsive features in the PMC Engine UI. All responsive utilities, hooks, and CSS are now available for use.

---

## 🚀 Quick Start

### 1. Import Responsive Hooks

```typescript
// In your component
import { useBreakpoint, useTouchDevice, useOrientation } from '@/hooks/responsive';

function ResponsiveComponent() {
  const { current, isMobile, isDesktop } = useBreakpoint();
  const isTouch = useTouchDevice();
  const { isPortrait } = useOrientation();

  return (
    <div>
      <p>Current breakpoint: {current}</p>
      {isMobile && <MobileMenu />}
      {isDesktop && <DesktopSidebar />}
    </div>
  );
}
```

### 2. Use Responsive Design Tokens

```typescript
// In your TypeScript/TSX files
import { breakpoints, touchTargets, responsiveTypography } from '@/styles/tokens';

const styles = {
  button: {
    minWidth: touchTargets.minimum, // 44px
    minHeight: touchTargets.minimum,
  },
  title: {
    fontSize: responsiveTypography.pageTitle.mobile, // 20px
  },
};
```

### 3. Apply Responsive CSS Classes

```tsx
// In your JSX
<div className="hide-on-mobile">Desktop-only content</div>
<button className="touch-target">Tap Me</button>
<div className="stack-mobile">Stacks vertically on mobile</div>
```

### 4. Import Mobile CSS (if needed)

```typescript
// In your App.tsx or main entry file
import './styles/responsive.css'; // Already imported by default
import './styles/mobile.css';     // Import for mobile-specific overrides
```

---

## 📱 Testing on Mobile

### Method 1: Chrome DevTools (Fastest)

1. **Open DevTools**: `Cmd+Option+I` (Mac) or `F12` (Windows/Linux)
2. **Toggle Device Mode**: Click device icon or press `Cmd+Shift+M`
3. **Select Device**: Choose from presets (iPhone 12, iPad, etc.)
4. **Test Interactions**: Enable "Show device frame" and "Rotate"

**Recommended Test Devices**:
- iPhone SE (375x667) - Small mobile
- iPhone 12 Pro (390x844) - Modern mobile
- iPad Air (820x1180) - Tablet
- Desktop (1280x720) - Default desktop

**Common Issues to Check**:
- ✅ No horizontal scroll
- ✅ Touch targets ≥44px
- ✅ Text readable (≥14px)
- ✅ Buttons not overlapping
- ✅ Modals fit viewport

### Method 2: Local Network Testing (Real Devices)

1. **Start Dev Server**:
   ```bash
   npm run dev
   ```

2. **Find Your IP Address**:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

3. **Access from Mobile Device**:
   - Connect phone/tablet to same WiFi network
   - Open browser and navigate to: `http://YOUR_IP:5173`
   - Example: `http://192.168.1.100:5173`

4. **Enable Remote Debugging**:
   - **iOS Safari**: Settings → Safari → Advanced → Web Inspector
   - **Android Chrome**: chrome://inspect

### Method 3: Automated Tests (CI/CD)

Run responsive viewport tests with Playwright:

```bash
# Run all responsive tests
npm test -- --grep "responsive"

# Run specific viewport tests
npm test -- tests/responsive/breakpoints.test.ts

# Generate visual regression screenshots
npm test -- --update-snapshots
```

---

## 🎯 Responsive Breakpoints

### Available Breakpoints

| Name | Size | Viewport Width | Common Devices |
|------|------|----------------|----------------|
| `xs` | Extra Small | ≤480px | iPhone SE, small Android |
| `sm` | Small | 481-768px | Most phones, small tablets |
| `md` | Medium | 769-1024px | iPad, Android tablets |
| `lg` | Large | ≥1025px | Laptops, desktops |

### Usage Examples

#### Option 1: Using Hooks (Recommended)

```typescript
const { isMobile, isTablet, isDesktop } = useBreakpoint();

// Conditional rendering
if (isMobile) {
  return <DrawerNavigation />;
}
return <SidebarNavigation />;
```

#### Option 2: Using Media Queries in CSS

```css
/* Mobile-first approach */
.container {
  padding: 16px; /* Default mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 24px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px; /* Desktop */
  }
}
```

#### Option 3: Using CSS Classes

```tsx
<div className="hide-on-mobile">Desktop navigation</div>
<div className="show-on-mobile-only">Hamburger menu</div>
```

---

## 🎨 Responsive Design Patterns

### Pattern 1: Responsive Navigation

```typescript
function Navigation() {
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <MobileDrawer>
      <NavItems />
    </MobileDrawer>
  ) : (
    <DesktopSidebar>
      <NavItems />
    </DesktopSidebar>
  );
}
```

### Pattern 2: Touch-Optimized Buttons

```tsx
<button className="touch-target" style={{ minWidth: '44px', minHeight: '44px' }}>
  <Icon size={20} />
</button>
```

### Pattern 3: Responsive Forms

```tsx
<form className="form-responsive">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    className="input-no-zoom" // Prevents iOS zoom
    placeholder="you@example.com"
  />
  <span className="error-message">Invalid email</span>
</form>
```

### Pattern 4: Stacked Layout on Mobile

```tsx
<div className="stack-mobile">
  <button>Cancel</button>
  <button>Save</button>
</div>
```

### Pattern 5: Orientation-Aware Layout

```typescript
function Gallery() {
  const { isPortrait, isLandscape } = useOrientation();

  return (
    <div className={isPortrait ? 'gallery-vertical' : 'gallery-horizontal'}>
      {images.map(img => <Image key={img.id} src={img.url} />)}
    </div>
  );
}
```

---

## ✅ Pre-Implementation Checklist

Before implementing responsive features, ensure:

- [ ] Responsive hooks are available: `useBreakpoint`, `useMediaQuery`, `useTouchDevice`, `useOrientation`
- [ ] Design tokens include: `breakpoints`, `touchTargets`, `responsiveTypography`, `responsiveSpacing`
- [ ] CSS files imported: `responsive.css`, `mobile.css`
- [ ] Chrome DevTools device mode tested with iPhone SE, iPad, Desktop
- [ ] No horizontal scroll on any breakpoint
- [ ] All interactive elements meet 44x44px minimum touch target
- [ ] Input fields use `font-size: 16px` to prevent iOS zoom
- [ ] Forms have labels above inputs on mobile
- [ ] Navigation collapses to drawer/hamburger on mobile
- [ ] Modals/dialogs are full-screen on mobile

---

## 🐛 Common Issues and Solutions

### Issue 1: Horizontal Scroll on Mobile

**Symptom**: Page scrolls horizontally, content overflows viewport

**Solution**:
```css
/* Add to problem container */
.container {
  max-width: 100%;
  overflow-x: hidden;
}
```

Or use utility class:
```tsx
<div className="no-horizontal-scroll">...</div>
```

### Issue 2: Text Too Small on Mobile

**Symptom**: Text is unreadable, requires pinch-to-zoom

**Solution**:
```css
/* Minimum 14px for body text */
body {
  font-size: 14px;
}

/* Use responsive typography tokens */
.title {
  font-size: var(--font-size-page-title-mobile); /* 20px */
}
```

### Issue 3: Buttons Too Small to Tap

**Symptom**: Mis-taps, frustration with small touch targets

**Solution**:
```tsx
<button className="touch-target" style={{
  minWidth: '44px',
  minHeight: '44px'
}}>
  Click me
</button>
```

### Issue 4: iOS Auto-Zoom on Input Focus

**Symptom**: Page zooms in when user taps input field

**Solution**:
```tsx
<input
  type="text"
  className="input-no-zoom" // Sets font-size: 16px
  placeholder="Enter text"
/>
```

### Issue 5: Layout Breaks on Specific Device

**Symptom**: Works in Chrome DevTools but breaks on real device

**Solution**:
1. Test on real device using local network (see Method 2 above)
2. Check safe area insets for notched devices:
   ```css
   .header {
     padding-top: env(safe-area-inset-top);
   }
   ```
3. Use `.safe-area-*` classes from `mobile.css`

---

## 🧪 Testing Checklist

### Manual Testing (Chrome DevTools)

- [ ] **iPhone SE (375px)**: Smallest mobile, no horizontal scroll
- [ ] **iPhone 12 Pro (390px)**: Modern mobile, touch targets work
- [ ] **iPad (820px)**: Tablet layout, navigation accessible
- [ ] **Desktop (1280px)**: Full layout, all features visible
- [ ] **Rotation**: Portrait ↔ Landscape transitions smoothly
- [ ] **Zoom**: Page works at 200% zoom (WCAG requirement)

### Interaction Testing

- [ ] All buttons have min 44x44px touch targets
- [ ] Touch targets have 8px spacing between them
- [ ] Forms: labels above inputs on mobile
- [ ] Forms: full-width inputs on mobile
- [ ] Navigation: collapses to drawer on mobile
- [ ] Modals: full-screen on mobile, overlay on desktop
- [ ] Tables: horizontal scroll or card layout on mobile
- [ ] No hover-dependent interactions (provide tap alternative)

### Performance Testing

- [ ] Lighthouse mobile score >90
- [ ] Load time <3s on 3G connection
- [ ] Animations run at 60fps (no jank)
- [ ] CLS (Cumulative Layout Shift) <0.1
- [ ] LCP (Largest Contentful Paint) <2.5s

### Accessibility Testing

- [ ] Screen reader announces touch targets correctly
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation works on mobile browsers
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Touch targets meet WCAG 2.1 AAA (44x44px)

---

## 📚 Additional Resources

### Responsive Hooks Documentation

- **`useBreakpoint()`**: Detects current breakpoint (xs/sm/md/lg)
- **`useMediaQuery(query)`**: Matches custom media query
- **`useTouchDevice()`**: Detects touch capability
- **`useOrientation()`**: Detects portrait/landscape

See `frontend/src/hooks/responsive/` for full documentation.

### Design Tokens Reference

All tokens are in `frontend/src/styles/tokens.ts`:

```typescript
import {
  breakpoints,       // xs/sm/md/lg breakpoint values
  touchTargets,      // minimum/comfortable touch sizes
  responsiveTypography, // breakpoint-based font sizes
  responsiveSpacing,    // breakpoint-based spacing
} from '@/styles/tokens';
```

### CSS Utilities Reference

All utility classes are in `frontend/src/styles/responsive.css` and `mobile.css`:

**Visibility**: `.hide-on-mobile`, `.show-on-mobile-only`, `.hide-on-desktop`
**Touch**: `.touch-target`, `.touch-target-comfortable`, `.touch-spacing`
**Layout**: `.stack-mobile`, `.full-width-mobile`, `.container-responsive`
**Typography**: `.text-page-title`, `.text-section-title`, `.input-no-zoom`
**Scrolling**: `.scroll-horizontal-mobile`, `.no-horizontal-scroll`
**Animation**: `.animate-slide-in-left`, `.animate-slide-in-up`, `.animate-fade-in`
**A11y**: `.sr-only`, `.focus-visible-ring`

---

## 🔄 Next Steps

After completing Phase 1 setup (design tokens + hooks + CSS):

1. **Phase 2**: Implement responsive shell layout (top bar, left rail, sidebar, inspector)
2. **Component Updates**: Make individual components responsive (forms, tables, navigation)
3. **Testing**: Run automated responsive tests in CI/CD
4. **Documentation**: Update component docs with responsive examples
5. **Performance**: Optimize images, lazy load components, code splitting

For detailed implementation tasks, run:

```bash
/speckit.tasks
```

This will generate the complete task breakdown for Phase 2 implementation.

---

## 📞 Need Help?

- **Design Tokens**: See `frontend/src/styles/tokens.ts`
- **Responsive Hooks**: See `frontend/src/hooks/responsive/`
- **CSS Utilities**: See `frontend/src/styles/responsive.css`, `mobile.css`
- **Research Findings**: See `specs/007-mobile-responsive/research.md`
- **Implementation Plan**: See `specs/007-mobile-responsive/plan.md`
- **Full Specification**: See `specs/007-mobile-responsive/spec.md`
