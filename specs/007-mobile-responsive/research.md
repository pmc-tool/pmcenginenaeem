# Mobile Responsiveness Research Findings

**Feature**: 007-mobile-responsive
**Created**: 2025-11-19
**Purpose**: Research industry best practices for responsive web design to inform implementation decisions

---

## 1. Responsive Breakpoint Strategy

### Research Question
What are industry-standard breakpoints for modern responsive web applications?

### Findings

#### Common Device Viewport Sizes (2024)

**Mobile Devices**:
- iPhone SE (3rd gen): 375 x 667px
- iPhone 12/13: 390 x 844px
- iPhone 14 Pro Max: 430 x 932px
- Samsung Galaxy S21: 360 x 800px
- Google Pixel 5: 393 x 851px

**Tablets**:
- iPad Mini: 768 x 1024px (portrait), 1024 x 768px (landscape)
- iPad (10.2"): 810 x 1080px (portrait), 1080 x 810px (landscape)
- iPad Pro 11": 834 x 1194px (portrait)
- iPad Pro 12.9": 1024 x 1366px (portrait)
- Android tablets: 800 x 1280px typical

**Desktop**:
- 1366 x 768px (most common laptop)
- 1920 x 1080px (full HD desktop)
- 2560 x 1440px (2K monitors)

#### Industry Standard Breakpoints

**Tailwind CSS** (widely adopted standard):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Bootstrap 5**:
- xs: <576px
- sm: ≥576px
- md: ≥768px
- lg: ≥992px
- xl: ≥1200px
- xxl: ≥1400px

**Material Design**:
- xs: 0-599px
- sm: 600-959px
- md: 960-1279px
- lg: 1280-1919px
- xl: ≥1920px

### Decision: PMC Engine Breakpoints

**Rationale**: Chose 4 breakpoints to balance flexibility and maintainability. Fewer breakpoints = less CSS complexity, easier testing.

```typescript
export const breakpoints = {
  xs: '480px',   // Small mobile (covers iPhone SE at 375px + some margin)
  sm: '768px',   // Large mobile / portrait tablet (iPad portrait starts here)
  md: '1024px',  // Tablet landscape (iPad landscape width)
  lg: '1280px',  // Desktop and up
} as const;

// Media query usage:
// Mobile-first approach (default styles for mobile, add complexity for larger screens)
```

**Mobile-First vs Desktop-First**:
- **Chosen**: Mobile-first
- **Rationale**:
  - Encourages progressive enhancement
  - Forces focus on essential features first
  - Easier to add complexity than remove it
  - Better for performance (load mobile styles first, enhance for desktop)

**CSS Custom Properties for JS/CSS Sharing**:
```css
:root {
  --breakpoint-xs: 480px;
  --breakpoint-sm: 768px;
  --breakpoint-md: 1024px;
  --breakpoint-lg: 1280px;
}
```

### Alternatives Considered

- **5+ breakpoints** (Tailwind approach): Rejected due to maintenance burden
- **Desktop-first**: Rejected because harder to simplify than complexify
- **Container queries**: Too new, limited browser support (Safari 16+)

---

## 2. Mobile Navigation Patterns

### Research Question
How do modern web apps handle navigation on mobile vs desktop?

### Findings

#### Hamburger Menu Patterns

**Popular Implementations**:

1. **Overlay Drawer** (Most common for complex apps)
   - Slides in from left/right over content
   - Content dims with backdrop overlay
   - Drawer 280-320px wide
   - Examples: Gmail, Slack, Notion

2. **Push Menu**
   - Pushes content aside when opening
   - Less common (causes layout shift)
   - Examples: Old Facebook mobile

3. **Full-Screen Menu**
   - Takes entire viewport
   - Used for simple nav structures
   - Examples: Marketing sites

**Best Practices**:
- Hamburger icon: 44x44px minimum touch target
- Drawer width: 280-320px (75-85% of small mobile screen)
- Animation: 250ms ease-out
- Backdrop: rgba(0,0,0,0.5) overlay
- Close triggers: Backdrop tap, swipe-left, X button, ESC key

#### Bottom Navigation vs Top Hamburger

**Research Findings**:
- Bottom navigation preferred for **3-5 primary destinations** (mobile apps)
- Top hamburger preferred for **complex navigation structures** (PMC Engine has many options)
- Thumb zone research: Bottom 40% of screen easiest to reach on large phones

**Decision for PMC Engine**: Top hamburger menu
- **Rationale**: PMC Engine has complex navigation (Chat, Pages, Code, Settings, AI Training, etc.) that doesn't fit in bottom nav
- **Enhancement**: Place most-used actions (Save, Preview) in top bar even on mobile

#### Pages Sidebar Mobile Alternative

**Pattern Options**:

1. **Bottom Sheet** ✅ (Chosen)
   - Slides up from bottom
   - Partial overlay (60-80% screen height)
   - Swipe down to dismiss
   - Native mobile feel
   - Examples: Google Maps, Apple Maps

2. **Full-Screen List**
   - Navigates to separate page
   - Good for very long lists
   - Adds navigation depth

3. **Accordion in Drawer**
   - Pages list inside left rail drawer
   - Works but clutters main navigation

**Decision**: Bottom sheet for pages sidebar on mobile
- **Rationale**: Quick access without full navigation, native mobile pattern, maintains context

#### Drawer Component Best Practices

**Animation**:
- Duration: 250ms (constitutional limit: <400ms)
- Easing: ease-in-out or cubic-bezier(0.4, 0.0, 0.2, 1)
- Transform only (GPU-accelerated): `transform: translateX()`

**Accessibility**:
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  // Focus trap inside drawer
  // Return focus to trigger element on close
</div>
```

**Touch Gestures**:
- Swipe-to-close threshold: 50px drag distance
- Velocity consideration: Fast swipe = close even if <50px
- Edge swipe-to-open: Detect swipe from screen edge (0-20px from left)

### Decision Summary

**Left Rail on Mobile**:
- Hamburger icon in top bar (44x44px)
- Slide-in drawer overlay from left
- 280px width, backdrop dim, swipe-to-close

**Pages Sidebar on Mobile**:
- Bottom sheet pattern
- Swipe up to open, swipe down to close
- 70% screen height

**Inspector/Chat Panels on Mobile**:
- Full-screen overlay (maintains top bar)
- Slide in from right
- Close button top-right

### Alternatives Considered

- **Tab bar bottom navigation**: Rejected (too many navigation items for PMC Engine)
- **Mega menu**: Rejected (not suitable for touch, too complex for mobile)

---

## 3. Touch Interaction Patterns

### Research Question
How to make mouse-based interactions work with touch?

### Findings

#### Minimum Touch Target Sizes

**Standards Comparison**:

| Standard | Minimum Size | Recommended | Spacing |
|----------|--------------|-------------|---------|
| WCAG 2.1 Level AA | 24x24px | 44x44px | - |
| WCAG 2.1 Level AAA | 44x44px | 48x48px | - |
| Apple Human Interface Guidelines | 44x44pt | 48x48pt | 8pt |
| Material Design | 48x48dp | 48x48dp | 8dp |
| Microsoft | 44x44px | 48x48px | 8px |

**Research Consensus**: 44x44px minimum, 48x48px comfortable, 8px spacing

**Decision for PMC Engine**:
- **Minimum**: 44x44px (WCAG AAA)
- **Comfortable**: 48x48px for primary actions
- **Spacing**: 8px minimum between adjacent targets

#### Touch vs Hover States

**Problem**: Hover doesn't exist on touch devices

**Solutions**:

1. **Tooltips**:
   ```jsx
   // DON'T: Tooltip on hover only
   <button title="Save">💾</button>

   // DO: Tooltip on tap-to-show, tap-outside-to-dismiss
   <Tooltip content="Save" trigger="tap">
     <button>💾</button>
   </Tooltip>
   ```

2. **Dropdowns**:
   ```jsx
   // DON'T: Opens on hover
   <Dropdown trigger="hover">

   // DO: Opens on click/tap
   <Dropdown trigger="click">
   ```

3. **Long-Press for Context Menus**:
   ```typescript
   const handleTouchStart = (e) => {
     const timer = setTimeout(() => {
       // Show context menu after 500ms press
       showContextMenu();
     }, 500);

     e.target.addEventListener('touchend', () => clearTimeout(timer), { once: true });
   };
   ```

#### Drag-and-Drop on Touch

**Library Comparison**:

| Library | Touch Support | Bundle Size | React Native |
|---------|---------------|-------------|--------------|
| react-beautiful-dnd | ✅ Excellent | 33KB | ❌ No |
| dnd-kit | ✅ Excellent | 15KB | ✅ Yes |
| react-dnd | ⚠️ Via backend | 25KB | ❌ No |

**Decision**: Use `dnd-kit` for page reordering
- **Rationale**: Best touch support, smallest bundle, maintained

**Implementation Pattern**:
```typescript
// Visual drag handle (easy to grab on touch)
const DragHandle = styled.div`
  min-width: 44px;
  min-height: 44px;
  cursor: grab;
  touch-action: none; // Prevents scroll during drag
`;

// Use touch-action CSS
.draggable {
  touch-action: none; // Disable browser touch handling
}
```

#### Multi-Touch Gestures

**Pinch-to-Zoom on Canvas**:
```typescript
import { usePinch } from '@use-gesture/react';

const bind = usePinch(({ offset: [scale] }) => {
  setZoom(scale);
});

<div {...bind()}>Canvas content</div>
```

**Two-Finger Scroll**:
- Let browser handle natively
- Ensure no conflicts with gestures

#### Double-Tap Zoom Prevention

**Problem**: Double-tapping buttons can trigger browser zoom

**Solution**: CSS `touch-action`
```css
button, a, [role="button"] {
  touch-action: manipulation; // Prevents double-tap zoom
}
```

**Alternative** (for older browsers):
```typescript
let lastTap = 0;
element.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) {
    e.preventDefault(); // Prevent double-tap zoom
  }
  lastTap = now;
});
```

### Decision Summary

**Touch Target Enforcement**:
- Utility class `.touch-target` adds min 44x44px
- ESLint rule to check button sizes
- Design review checklist item

**Hover Alternatives**:
- Tooltips: Tap-to-show
- Dropdowns: Click-to-open
- Context menus: Long-press (500ms)

**Drag-and-Drop**:
- Use dnd-kit library
- Visual drag handles (44x44px minimum)
- `touch-action: none` to prevent scroll

**Gestures**:
- Pinch-to-zoom on canvas
- Swipe-to-close for drawers
- Double-tap zoom prevented on interactive elements

### Alternatives Considered

- **Pointer events polyfill**: Rejected (not needed for modern browsers)
- **react-beautiful-dnd**: Rejected (dnd-kit smaller and better touch support)
- **Custom touch handling**: Rejected (libraries are battle-tested)

---

## 4. Form UX on Mobile

### Research Question
What are best practices for forms on mobile devices?

### Findings

#### Mobile Keyboard Types

**HTML Input Type Attributes**:

| Input Type | Mobile Keyboard | Use Case |
|------------|-----------------|----------|
| `type="text"` | Standard QWERTY | Names, general text |
| `type="email"` | @ and .com keys | Email addresses |
| `type="tel"` | Number pad | Phone numbers |
| `type="number"` | Number pad + -/. | Numeric input |
| `type="url"` | .com and / keys | Website URLs |
| `type="search"` | Search button | Search inputs |
| `type="date"` | Date picker | Dates |

**Inputmode Attribute** (better control):
```html
<input type="text" inputmode="numeric" /> <!-- Number pad, no spinner controls -->
<input type="text" inputmode="decimal" /> <!-- Number pad with decimal -->
<input type="text" inputmode="email" />   <!-- Email keyboard -->
```

**Decision**: Use specific `type` attributes + `inputmode` where needed
- Email fields: `type="email"`
- Phone fields: `type="tel"`
- Numeric fields: `type="text" inputmode="numeric"` (avoids spinner controls)
- URLs: `type="url"`

#### Label Placement

**Research Findings**:
- **Inline labels** (label left, input right): Good for desktop, breaks on mobile (<480px)
- **Labels above inputs**: Industry standard for mobile
- **Floating labels** (Material Design): Elegant but accessibility concerns

**Decision**: Labels above inputs on mobile

```css
/* Mobile: vertical stacking */
@media (max-width: 768px) {
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 14px;
    font-weight: 500;
  }

  input {
    width: 100%;
    min-height: 44px;
    padding: 12px;
  }
}

/* Desktop: can use inline if desired */
@media (min-width: 769px) {
  .form-field {
    display: grid;
    grid-template-columns: 150px 1fr;
    align-items: center;
  }
}
```

#### Error Message Display

**Options**:

1. **Inline below field** ✅ (Chosen)
   - Always visible
   - Clear association with field
   - No hover required

2. **Tooltip on hover**
   - Doesn't work on touch
   - Can be hidden by keyboard

3. **Summary at top**
   - Good for overview
   - Doesn't pinpoint specific field

**Decision**: Inline errors below field

```html
<div class="form-field">
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="field-error" role="alert">
    Please enter a valid email address
  </span>
</div>
```

```css
.field-error {
  color: var(--color-error);
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
```

#### Sticky Submit Buttons

**Problem**: Mobile keyboard covers submit button at bottom of form

**Solutions**:

1. **Sticky Footer** ✅ (Chosen)
```css
.form-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 16px;
  border-top: 1px solid var(--color-border);
  z-index: 10;
}
```

2. **Floating Action Button** (FAB)
   - Mobile app pattern
   - Can obstruct content

3. **Submit at Top**
   - Unconventional
   - User expects it at bottom

**Decision**: Sticky footer with submit/save buttons

#### Field Auto-Scroll

**Problem**: Tapping input field causes keyboard to appear and cover field

**Solution**: Browser handles automatically, but can enhance:

```typescript
const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
  // Give keyboard time to appear
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center', // Center field in viewport
    });
  }, 300);
};

<input onFocus={handleFocus} />
```

**Better Approach**: Use `inputmode` to avoid scroll-blocking keyboards:
```html
<!-- iOS: Dismissible keyboard with done button -->
<input inputmode="text" enterkeyhint="done" />
```

#### Full-Width Inputs on Mobile

**Research Consensus**: Forms should be full-width on mobile

```css
@media (max-width: 768px) {
  input, textarea, select {
    width: 100%;
    box-sizing: border-box;
  }
}
```

**Decision**: All form fields 100% width on mobile

### Decision Summary

**Input Types**:
- Use semantic HTML input types (`email`, `tel`, `url`)
- Use `inputmode` for refined keyboard control
- Use `enterkeyhint` for keyboard "done" button

**Layout**:
- Labels above inputs (not inline) on mobile
- Full-width inputs (100% of container)
- Adequate spacing: 16px between fields

**Validation**:
- Inline error messages below field
- `aria-invalid` and `aria-describedby` for accessibility
- Red border + error text

**Submit Buttons**:
- Sticky footer on mobile forms
- Button always visible above keyboard
- Min 44x44px touch target

**Enhancement**:
- Auto-scroll field to center on focus
- Prevent zoom on input focus (font-size ≥16px)

### Alternatives Considered

- **Floating labels**: Rejected (accessibility concerns, animation complexity)
- **FAB submit button**: Rejected (can obstruct content)
- **Toast error messages**: Rejected (not persistent, user might miss them)

---

## 5. Responsive Typography

### Research Question
How should typography scale across breakpoints?

### Findings

#### Fluid Typography vs Breakpoint-Based

**Fluid Typography** (CSS clamp):
```css
h1 {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
}
```

**Pros**:
- Smoothly scales between breakpoints
- Fewer media queries

**Cons**:
- Harder to predict exact sizes
- Can result in awkward in-between sizes
- Difficult to maintain across team

**Breakpoint-Based Typography**:
```css
h1 {
  font-size: 20px; /* Mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 22px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 24px; /* Desktop */
  }
}
```

**Pros**:
- Predictable sizes
- Easier to design and maintain
- Clear design system

**Cons**:
- More media queries
- Abrupt changes at breakpoints

**Decision**: Breakpoint-based typography
- **Rationale**: Easier maintenance, predictable behavior, aligns with existing design token system

#### Minimum Readable Font Sizes

**Research Findings**:

| Element | Minimum | Recommended | Source |
|---------|---------|-------------|--------|
| Body text | 14px | 16px | WCAG, UX research |
| Labels | 12px | 14px | Apple HIG |
| Helper text | 11px | 12px | Material Design |
| Touch target labels | 14px | 16px | Usability studies |

**iOS Consideration**: Text <16px can trigger auto-zoom on focus
```css
input {
  font-size: 16px; /* Prevents iOS zoom on focus */
}
```

**Decision for PMC Engine**:
- Body text: 14px minimum (all breakpoints)
- Labels: 14px minimum
- Helper text: 12px minimum
- Headings: Scale down on mobile but maintain hierarchy

#### Line Length Optimization

**Typographic Golden Rule**: 45-75 characters per line for readability

**Implementation**:
```css
.content-text {
  max-width: 65ch; /* 65 characters */
  margin: 0 auto;
}
```

**Decision**: Enforce max-width on long-form content
- Forms: Full-width (utility, not reading)
- Help text / descriptions: 65ch max
- Blog-style content: 65ch max

#### Typography Scale

**Decision for PMC Engine**:

```typescript
export const typography = {
  responsive: {
    // Page titles
    pageTitle: {
      mobile: '20px',
      tablet: '22px',
      desktop: '24px',
    },

    // Section headings
    sectionHeading: {
      mobile: '16px',
      tablet: '17px',
      desktop: '18px',
    },

    // Subsection headings
    subsectionHeading: {
      mobile: '14px',
      tablet: '15px',
      desktop: '16px',
    },

    // Body text (no scaling - minimum readability)
    body: '14px',

    // Labels
    label: '14px',

    // Helper text
    helper: '12px',

    // Code/monospace
    code: {
      mobile: '13px',
      desktop: '14px',
    },
  },

  // Line heights
  lineHeight: {
    heading: 1.2,
    body: 1.5,
    helper: 1.4,
  },
};
```

#### Line Height Considerations

**Research Findings**:
- Headings: 1.1-1.3 (tight, emphasizes visual hierarchy)
- Body text: 1.4-1.6 (comfortable reading)
- Helper text: 1.3-1.5

**Decision**:
- Headings: 1.2
- Body: 1.5
- Helper text: 1.4
- Consistent across all breakpoints

### Decision Summary

**Approach**: Breakpoint-based typography scaling (not fluid)

**Typography Scale**:
- Page titles: 20px/22px/24px (mobile/tablet/desktop)
- Section headings: 16px/17px/18px
- Body text: 14px (all breakpoints)
- Helper text: 12px (all breakpoints)
- Labels: 14px (all breakpoints)

**Line Heights**:
- Headings: 1.2
- Body: 1.5
- Helper: 1.4

**Readability Rules**:
- Long-form content max-width: 65ch
- Minimum body text: 14px (never smaller)
- Input font-size: ≥16px (prevents iOS zoom)

### Alternatives Considered

- **Fluid typography (clamp)**: Rejected (harder to maintain, unpredictable)
- **Smaller mobile body text**: Rejected (14px is minimum for readability)
- **Variable font scales**: Rejected (adds complexity, limited browser support)

---

## 6. Performance Optimization for Mobile

### Research Question
How to maintain performance on mobile devices?

### Findings

#### Lazy Loading Strategies

**Image Lazy Loading**:
```html
<!-- Native lazy loading (supported in all modern browsers) -->
<img src="image.jpg" loading="lazy" alt="Description" />
```

**Component Lazy Loading** (React):
```typescript
import { lazy, Suspense } from 'react';

const AITrainingPanel = lazy(() => import('./AITrainingPanel'));

<Suspense fallback={<LoadingState />}>
  <AITrainingPanel />
</Suspense>
```

**Decision**:
- Images: Use `loading="lazy"` attribute
- Heavy components: Lazy load with React.lazy()
- Route-based code splitting: Load panels on demand

#### CSS Animation Performance

**Performance Research**:

| Property | GPU-Accelerated | Reflow/Repaint | 60fps Mobile |
|----------|-----------------|----------------|--------------|
| transform | ✅ Yes | ❌ No | ✅ Yes |
| opacity | ✅ Yes | ❌ No | ✅ Yes |
| left/top | ❌ No | ✅ Yes | ❌ Janky |
| width/height | ❌ No | ✅ Yes | ❌ Janky |
| background-color | ❌ No | ✅ Yes | ⚠️ Sometimes |

**Best Practices**:
```css
/* DO: Animate transform and opacity only */
.drawer {
  transform: translateX(-100%);
  transition: transform 250ms ease-out;
}

.drawer.open {
  transform: translateX(0);
}

/* DON'T: Animate left/width */
.drawer {
  left: -300px; /* Causes reflow */
  transition: left 250ms;
}
```

**will-change Optimization**:
```css
.drawer {
  will-change: transform; /* Hints browser to optimize */
}

/* Remove will-change after animation */
.drawer:not(.animating) {
  will-change: auto;
}
```

**Decision**:
- Animate `transform` and `opacity` only
- Use `will-change` sparingly (only during animation)
- Duration: 250ms max for mobile (constitutional limit: <400ms)

#### Bundle Size Optimization

**Code Splitting Strategies**:

1. **Route-based splitting**:
```typescript
const routes = [
  { path: '/themes', component: lazy(() => import('./ThemesPage')) },
  { path: '/settings', component: lazy(() => import('./SettingsPage')) },
];
```

2. **Feature-based splitting**:
```typescript
// Load chart library only when needed
const ChartView = lazy(() => import('./ChartView'));
```

3. **Third-party library optimization**:
```typescript
// DON'T: Import entire library
import _ from 'lodash';

// DO: Import specific functions
import debounce from 'lodash/debounce';
```

**Bundle Analysis**:
```bash
# Webpack Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer

# Vite Bundle Visualizer
npm install --save-dev rollup-plugin-visualizer
```

**Decision**:
- Route-based code splitting for all major pages
- Lazy load heavy components (charts, editors)
- Tree-shakeable imports only

#### 3G Performance Testing

**Chrome DevTools Throttling**:
- Network: Slow 3G (400ms latency, 400kb/s down, 400kb/s up)
- CPU: 4x slowdown (simulates slower mobile CPU)

**Performance Budget**:
- Initial load (3G): <3 seconds
- Time to Interactive: <5 seconds
- First Contentful Paint: <2 seconds
- Largest Contentful Paint: <2.5 seconds

**Lighthouse Mobile**:
```bash
lighthouse https://yoursite.com --preset=mobile --output=html
```

**Target Score**: >90 mobile performance

**Decision**:
- Test all PRs with 3G throttling
- Lighthouse mobile score >90 required
- Monitor Core Web Vitals

#### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5-4s | >4s |
| FID (First Input Delay) | ≤100ms | 100-300ms | >300ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

**Decision**: Target "Good" for all metrics
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

#### Image Optimization

**Responsive Images**:
```html
<picture>
  <source
    srcset="image-mobile.webp"
    media="(max-width: 768px)"
    type="image/webp"
  />
  <source
    srcset="image-desktop.webp"
    media="(min-width: 769px)"
    type="image/webp"
  />
  <img src="image.jpg" alt="Fallback" loading="lazy" />
</picture>
```

**Modern Formats**:
- WebP: 25-35% smaller than JPEG
- AVIF: 50% smaller than JPEG (newer, less support)

**Decision**:
- Serve WebP with JPEG fallback
- Use `loading="lazy"` for below-fold images
- Resize images to match display size

### Decision Summary

**Lazy Loading**:
- Native image lazy loading (`loading="lazy"`)
- React.lazy() for heavy components
- Route-based code splitting

**Animations**:
- Transform and opacity only (GPU-accelerated)
- 250ms duration
- `will-change` during animation only

**Bundle Optimization**:
- Code split by route
- Tree-shakeable imports
- Bundle size monitoring

**Performance Budget**:
- 3G load time: <3s
- Lighthouse mobile: >90
- LCP: <2.5s, FID: <100ms, CLS: <0.1

**Testing**:
- Chrome DevTools 3G throttling
- Lighthouse CI integration
- Real device testing

### Alternatives Considered

- **Intersection Observer for lazy loading**: Rejected (native loading="lazy" sufficient)
- **Service Worker caching**: Deferred to future enhancement
- **Prefetching**: Considered for future (adds complexity)

---

## 7. Testing Strategies for Responsive UI

### Research Question
How to comprehensively test responsive layouts?

### Findings

#### Viewport Testing Tools

**Chrome DevTools Device Emulation**:
- Pros: Free, built-in, fast iteration
- Cons: Not 100% accurate (doesn't simulate real touch, hardware differences)

**Standard Device Presets** (for testing):
- iPhone SE (375 x 667) - Small mobile
- iPhone 12 Pro (390 x 844) - Standard mobile
- Pixel 5 (393 x 851) - Android mobile
- iPad Air (820 x 1180) - Tablet portrait
- iPad Pro (1024 x 1366) - Tablet landscape

**BrowserStack / Sauce Labs**:
- Pros: Real device cloud, accurate testing
- Cons: Paid service, slower than emulation

**Real Devices**:
- Pros: 100% accurate, catches real-world issues
- Cons: Expensive to maintain device library

**Decision**: Multi-tier testing approach
1. **Development**: Chrome DevTools emulation
2. **Pre-release**: BrowserStack (optional, if available)
3. **Final QA**: Real devices (1 iOS + 1 Android minimum)

#### Automated Visual Regression Testing

**Tools Comparison**:

| Tool | Pricing | Features | CI Integration |
|------|---------|----------|----------------|
| Percy | $$ | Screenshots, diffs | ✅ Excellent |
| Chromatic | $$ | Storybook focus | ✅ Excellent |
| BackstopJS | Free | Local screenshots | ⚠️ Manual |
| Playwright | Free | Screenshots + testing | ✅ Good |

**Decision**: Use Playwright for screenshot testing
- **Rationale**: Free, integrates with existing Vitest setup, responsive testing built-in

```typescript
// Responsive screenshot test
import { test, expect } from '@playwright/test';

test('TopBar responsive layout', async ({ page }) => {
  await page.goto('/');

  // Test mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('topbar-mobile.png');

  // Test tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('topbar-tablet.png');

  // Test desktop
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page).toHaveScreenshot('topbar-desktop.png');
});
```

#### Touch Interaction Testing

**@testing-library/user-event** (supports touch):
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('drawer opens on hamburger tap', async () => {
  const user = userEvent.setup();
  render(<Shell />);

  const hamburger = screen.getByRole('button', { name: /menu/i });
  await user.click(hamburger); // Simulates tap on touch

  expect(screen.getByRole('navigation')).toBeVisible();
});
```

**Playwright Touch Events**:
```typescript
test('swipe to close drawer', async ({ page }) => {
  await page.goto('/');

  // Open drawer
  await page.click('[data-testid="hamburger"]');

  // Swipe left to close
  await page.locator('[data-testid="drawer"]').dispatchEvent('touchstart', {
    touches: [{ clientX: 200, clientY: 100 }]
  });
  await page.locator('[data-testid="drawer"]').dispatchEvent('touchmove', {
    touches: [{ clientX: 50, clientY: 100 }]
  });
  await page.locator('[data-testid="drawer"]').dispatchEvent('touchend');

  await expect(page.locator('[data-testid="drawer"]')).not.toBeVisible();
});
```

#### Accessibility Testing on Mobile

**axe-core with Mobile Viewports**:
```typescript
import { axe } from 'jest-axe';

test('mobile viewport has no a11y violations', async () => {
  const { container } = render(<App />);

  // Set viewport
  window.innerWidth = 375;
  window.innerHeight = 667;

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Mobile Screen Reader Testing**:
- iOS: VoiceOver
- Android: TalkBack

**Manual Testing Checklist**:
- [ ] All interactive elements announced
- [ ] Swipe navigation works
- [ ] Focus order logical
- [ ] No focus traps

#### Horizontal Scroll Detection (Automated)

**Playwright Test**:
```typescript
test('no horizontal scroll on mobile', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 375, height: 667 });

  // Check scroll width vs client width
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  expect(hasHorizontalScroll).toBe(false);
});
```

**Vitest Test** (component level):
```typescript
test('button does not overflow container on mobile', () => {
  const { container } = render(<Button>Long Button Text</Button>);

  const button = container.querySelector('button');
  const parent = button.parentElement;

  expect(button.offsetWidth).toBeLessThanOrEqual(parent.offsetWidth);
});
```

#### Touch Target Size Testing

**Automated Test**:
```typescript
test('all buttons meet 44x44px minimum', () => {
  const { container } = render(<App />);

  const buttons = container.querySelectorAll('button, a, [role="button"]');

  buttons.forEach((button) => {
    const rect = button.getBoundingClientRect();
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);
  });
});
```

**ESLint Rule** (custom):
```javascript
// .eslintrc.js
rules: {
  'custom/min-touch-target': ['error', { minSize: 44 }]
}
```

### Decision Summary

**Testing Devices**:
- **Development**: Chrome DevTools (iPhone SE, iPad Air, desktop)
- **CI**: Playwright with viewport testing
- **Pre-release**: BrowserStack (if available)
- **Final QA**: Real devices (1 iOS, 1 Android)

**Automated Tests**:
- Viewport rendering tests (Playwright screenshots)
- Touch target size verification
- Horizontal scroll detection
- Accessibility tests with axe-core

**Manual QA Checklist**:
- [ ] No horizontal scroll on core pages
- [ ] All touch targets ≥44x44px
- [ ] Gestures work (swipe, long-press)
- [ ] Mobile keyboards trigger correctly
- [ ] Screen reader navigation works
- [ ] Performance acceptable on real device

**CI Integration**:
```yaml
# .github/workflows/test.yml
- name: Run responsive tests
  run: |
    npm run test:responsive
    npm run lighthouse:mobile
```

### Alternatives Considered

- **Cypress**: Rejected (Playwright has better touch support)
- **Full BrowserStack suite**: Deferred (cost, use for final QA only)
- **Manual-only testing**: Rejected (too slow, misses regressions)

---

## Summary of Decisions

### Breakpoints
```typescript
xs: '480px',   // Small mobile
sm: '768px',   // Large mobile / portrait tablet
md: '1024px',  // Tablet landscape
lg: '1280px',  // Desktop
```

### Navigation Patterns
- **Left rail**: Hamburger → drawer overlay (280px, slide from left)
- **Pages sidebar**: Bottom sheet (70% screen height, swipe up/down)
- **Inspector/Chat**: Full-screen overlay on mobile (slide from right)

### Touch Interactions
- **Minimum touch target**: 44x44px
- **Spacing**: 8px between targets
- **Tooltips**: Tap-to-show
- **Drag-and-drop**: dnd-kit library
- **Gestures**: Swipe-to-close, pinch-to-zoom

### Form UX
- **Layout**: Labels above inputs, full-width fields
- **Keyboards**: Semantic input types (`email`, `tel`) + `inputmode`
- **Errors**: Inline below field
- **Submit**: Sticky footer

### Typography
- **Approach**: Breakpoint-based (not fluid)
- **Body text**: 14px (all breakpoints)
- **Headings**: 20px/22px/24px (mobile/tablet/desktop)
- **Line height**: 1.5 for body, 1.2 for headings

### Performance
- **Lazy loading**: Images + components
- **Animations**: Transform/opacity only
- **Budget**: <3s on 3G, >90 Lighthouse score
- **CLS**: <0.1

### Testing
- **Dev**: Chrome DevTools
- **CI**: Playwright viewport tests
- **QA**: Real devices (1 iOS, 1 Android)
- **Automated**: Touch target sizes, horizontal scroll, a11y

---

## Next Steps

1. **Phase 1**: Implement design tokens with breakpoints and responsive values
2. **Create responsive hooks**: useBreakpoint, useMediaQuery, useTouchDevice, useOrientation
3. **Build responsive utility CSS**: Touch targets, hide/show classes
4. **Generate quickstart.md**: Mobile testing guide for developers
5. **Proceed to Phase 2**: Component implementation via `/speckit.tasks`

---

**Research Complete**: 2025-11-19
**Ready for**: Phase 1 (Design & Implementation Setup)
