# Feature Specification: PMC Engine – Basic Site AI Training Panel

**Feature Branch**: `005-basic-ai-training`
**Created**: 2025-01-18
**Status**: Draft
**Input**: User description: "PMC Engine – Basic Site AI Training Panel"

---

## Overview

The **Basic Site AI Training Panel** is a non-blocking, optional, per-site configuration interface within PMC Engine. It allows site owners to provide foundational brand and business information that helps the AI generate consistent, on-brand content while customizing pre-purchased PMC Engine–compatible themes.

**Key Principle**: This panel captures only the **minimum training data** the AI needs to avoid repeatedly asking the same questions. It is NOT a full website builder brief, blog planner, or SEO tool.

---

## Goals *(mandatory)*

The panel must accomplish these six objectives:

1. **Capture basic brand + business info**: Name, slogan, description, industry, location
2. **Capture basic visual identity**: Logos (light/dark), favicon, dark mode preference, primary/secondary colors
3. **Capture basic tone of voice**: Formality, playfulness, emoji usage, preferred/avoided words
4. **Capture simple offerings & primary CTA**: Services/products list, main call-to-action text
5. **Capture basic contact & social details**: Email, phone, address, preferred contact method, social links
6. **Capture simple AI behaviour rules**: Rewrite strength, sensitive content boundaries, always-keep instructions

---

## Non-Goals *(mandatory)*

Explicitly **OUT OF SCOPE**:
- Blog planning, content strategy, or editorial calendars
- Detailed SEO/competitor analysis or keyword research
- Complex legal policy management (beyond simple "don't touch" flags)
- Multi-user collaboration or version control for training data
- Advanced AI configuration (model selection, temperature tuning)
- Analytics, A/B testing, or performance reporting

---

## Optionality & Blocking Rules *(mandatory)*

### Critical Constraints

✅ **Optional & Skippable**: Panel completion is entirely optional
✅ **Never Blocks**: Users can access all PMC Engine features regardless of training panel state
✅ **Partial Completion OK**: Any section can be left empty; AI continues functioning with theme context
✅ **Per-Site Scope**: Each site has its own independent training profile

### AI Behavior with Incomplete Data

When training is empty or partial:
- AI works normally using theme context and user prompts
- AI may ask clarifying questions when needed (minimal, not overwhelming)
- AI generates more generic content initially but refines through iteration
- **No features are locked or disabled**

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial Training Setup (Priority: P1)

Site owner provides basic brand information so the AI generates appropriate content without repeated questions.

**Why P1**: Core value proposition - enables AI to understand the brand from the start.

**Independent Test**: Fill brand basics, generate AI content, verify it uses brand name and tone without asking.

**Acceptance Scenarios**:
1. **Given** new site without training, **When** owner navigates to Site Settings → AI Training, **Then** empty panel shows with 0/6 sections filled
2. **Given** training panel open, **When** owner fills brand name and description in Section 1, **Then** fields save and section shows partially complete
3. **Given** brand info entered, **When** owner uses AI for hero section, **Then** AI incorporates brand name without asking "What does your business do?"

---

### User Story 2 - Upload Visual Assets (Priority: P1)

Site owner uploads logo and sets brand colors so AI references correct visual identity.

**Why P1**: Visual identity is fundamental to brand consistency.

**Independent Test**: Upload logo, set colors, have AI reference them in generated content.

**Acceptance Scenarios**:
1. **Given** Section 2 Visual Identity, **When** owner uploads primary logo (PNG/SVG), **Then** file stores and preview displays
2. **Given** "Both" selected for dark mode, **When** owner uploads dark logo, **Then** additional default mode field appears
3. **Given** brand colors set, **When** AI discusses brand, **Then** it correctly references specified colors

---

### User Story 3 - Define Communication Tone (Priority: P2)

Site owner specifies how AI should write (formal vs casual, playful vs serious) for consistent brand voice.

**Why P2**: Important for consistency but can be refined iteratively.

**Independent Test**: Set tone sliders, generate multiple content pieces, verify consistent tone.

**Acceptance Scenarios**:
1. **Given** Voice & Tone section, **When** owner moves sliders toward Casual, **Then** selection saves
2. **Given** "Words to AVOID" includes "cheap", **When** AI generates descriptions, **Then** it avoids those words
3. **Given** emoji usage set to "Sometimes", **When** AI generates social content, **Then** occasional emojis appear

---

### User Story 4 - Specify Services and CTA (Priority: P2)

Site owner lists offerings and preferred CTA for relevant, specific content generation.

**Why P2**: Helps AI generate targeted content but can function with generic offerings.

**Independent Test**: Add services, set CTA, generate Services section, verify inclusion.

**Acceptance Scenarios**:
1. **Given** Offerings section, **When** owner adds three services with descriptions, **Then** list displays with edit/delete options
2. **Given** primary CTA "Book a consultation", **When** AI generates hero, **Then** CTA button uses this text
3. **Given** offerings include "Web Design", **When** AI generates content, **Then** it prioritizes these services

---

### User Story 5 - Set Contact Info (Priority: P2)

Site owner ensures AI-generated contact sections use correct email, phone, and social links.

**Why P2**: Contact accuracy matters but typically set once.

**Independent Test**: Enter contact details, generate footer, verify correctness.

**Acceptance Scenarios**:
1. **Given** Contact section, **When** owner enters email and phone, **Then** values save and section marks complete
2. **Given** social links for Facebook/Instagram, **When** AI generates footer, **Then** it includes these platforms
3. **Given** preferred contact "Email", **When** AI generates contact instructions, **Then** it emphasizes email

---

### User Story 6 - Control AI Boundaries (Priority: P3)

Site owner controls rewrite aggressiveness and marks sensitive areas AI shouldn't modify.

**Why P3**: Fine-tuning behavior after seeing initial outputs.

**Independent Test**: Mark "Pricing" sensitive, attempt AI modification, verify decline/warning.

**Acceptance Scenarios**:
1. **Given** AI Behaviour section, **When** owner sets "Light edits only", **Then** future modifications are conservative
2. **Given** "Pricing" marked sensitive, **When** AI asked to modify pricing, **Then** it warns or declines
3. **Given** "Always keep slogan" specified, **When** AI generates content, **Then** slogan consistently appears

---

### User Story 7 - Edit Existing Training (Priority: P2)

Site owner updates training data as business evolves.

**Why P2**: Essential for long-term use.

**Independent Test**: Change values, save, generate new content, verify updates.

**Acceptance Scenarios**:
1. **Given** brand name "Acme Corp", **When** changed to "Acme Solutions" and saved, **Then** future AI content uses new name
2. **Given** last updated timestamp, **When** any section saved, **Then** timestamp updates
3. **Given** unsaved edits, **When** "Discard changes" clicked, **Then** changes revert to last saved

---

### Edge Cases

- Invalid file format uploaded (JPEG instead of PNG/SVG)
- Text exceeding length limits
- "Both" dark mode selected but no dark logo uploaded
- Conflicting entries in "words to USE" vs "words to AVOID"
- Social link added without platform label
- Unsaved changes when navigating away
- Concurrent editing in multiple browser tabs
- "Other" sensitive area checked but no custom text provided

---

## Requirements *(mandatory)*

### Functional Requirements

**Panel Structure & Access**
- **FR-001**: System MUST provide access from Site Settings → AI Training (Basic)
- **FR-002**: System MUST provide optional entry from AI Change Timeline header ("Edit AI training" link)
- **FR-003**: Panel MUST load existing training profile for current site
- **FR-004**: Panel MUST never block access to other PMC Engine features

**Layout**
- **FR-005**: Panel MUST display header with: title, subtitle, completion indicator (X/6), timestamp, Save/Discard buttons
- **FR-006**: Panel MUST display left vertical stepper showing 6 sections with clickable navigation
- **FR-007**: Each stepper item MUST show completion state: not started / partially filled / completed
- **FR-008**: Panel MUST display scrollable right content area with section cards
- **FR-009**: Each section card MUST have title and 1-2 line purpose description

**Section 1: Brand & Business Basics**
- **FR-010**: Brand/site name (Required, text)
- **FR-011**: Tagline/slogan (Optional, text)
- **FR-012**: One-line elevator pitch (Required, text with prompt)
- **FR-013**: Short business description (Required, multi-line, 2-3 sentences)
- **FR-014**: Industry/category (Required, dropdown + free text: SaaS, Agency, Clinic, Shop, Other, etc.)
- **FR-015**: Location/service area (Optional, text: city, country, or "Global")

**Section 2: Visual Identity**
- **FR-016**: Primary logo for light background (Optional/Recommended, PNG/SVG upload)
- **FR-017**: Secondary/inverted logo for dark mode (Optional, PNG/SVG upload)
- **FR-018**: Favicon (Optional, ICO/PNG upload)
- **FR-019**: Theme dark mode support (Required, radio: Light only / Dark only / Both)
- **FR-020**: If "Both" selected, default mode field (Required, radio: Start in light / Start in dark)
- **FR-021**: Primary brand color (Optional, color picker with hex)
- **FR-022**: Secondary brand color (Optional, color picker with hex)
- **FR-023**: Logo files MUST be validated for format and size [NEEDS CLARIFICATION: Specific limits - recommend 5MB max for logos, 1MB for favicon?]

**Section 3: Voice & Tone**
- **FR-024**: Formal ↔ Casual tone slider (Optional/Recommended, 3-5 levels)
- **FR-025**: Playful ↔ Serious tone slider (Optional/Recommended, 3-5 levels)
- **FR-026**: Tone description (Optional, short text)
- **FR-027**: Emoji usage (Optional, radio: Never / Sometimes / Often)
- **FR-028**: Words/phrases to USE (Optional, multi-line list)
- **FR-029**: Words/phrases to AVOID (Optional, multi-line list)

**Section 4: Offerings & Primary CTA**
- **FR-030**: Repeatable services/products rows (name + short description)
- **FR-031**: System MUST allow add/edit/delete for service rows
- **FR-032**: Primary CTA text (Optional/Recommended, text with examples)

**Section 5: Contact & Social**
- **FR-033**: Business email (Optional/Recommended, email validation)
- **FR-034**: Phone/WhatsApp (Optional, phone input)
- **FR-035**: Address (Optional, multi-line text)
- **FR-036**: Preferred contact method (Optional, dropdown: Call / WhatsApp / Email / Form)
- **FR-037**: Repeatable social links (platform dropdown + URL)
- **FR-038**: System MUST allow add/edit/delete for social links

**Section 6: AI Behaviour**
- **FR-039**: Rewrite strength (Optional/Recommended, radio: Light edits / Balanced / Heavy rewrites)
- **FR-040**: Sensitive areas checkboxes (Pricing, Legal/policy, Testimonials, Other)
- **FR-041**: If "Other" checked, custom sensitive areas text field
- **FR-042**: Always-keep instructions (Optional, multi-line text)

**Data Management**
- **FR-043**: "Save changes" MUST persist all data
- **FR-044**: System MAY implement auto-save on field blur
- **FR-045**: "Last updated" timestamp MUST update on save
- **FR-046**: Section completion tracking (not started / partial / complete)
- **FR-047**: Overall completion indicator calculation (X/6 sections)
- **FR-048**: "Discard changes" MUST revert to last saved state
- **FR-049**: Data MUST persist across sessions

**Validation**
- **FR-050**: Required fields: Section 1 (brand name, elevator pitch, description, industry), Section 2 (dark mode)
- **FR-051**: Email format validation
- **FR-052**: URL format validation for social links
- **FR-053**: File format validation (PNG/SVG for logos, ICO/PNG for favicon)
- **FR-054**: File size enforcement
- **FR-055**: Clear error messages for validation failures

**AI Integration**
- **FR-056**: AI Change Timeline MUST load training profile when opened
- **FR-057**: AI system prompts MUST incorporate available training data (brand, tone, offerings, visual identity, contact, boundaries)
- **FR-058**: When profile empty/incomplete, AI MUST function using theme context and prompts
- **FR-059**: AI MUST respect sensitive areas and decline/warn on protected content modification
- **FR-060**: AI MUST use trained rewrite strength preference

**Summary Display**
- **FR-061**: Summary card MUST show: brand name, slogan (if set), tone summary, logo/favicon status, contact email status, completion (X/6)

### Key Entities

- **Training Profile**: Complete per-site training data with all 6 sections, last updated timestamp, completion status
- **Brand Identity** (Section 1): Brand name, slogan, elevator pitch, description, industry, location
- **Visual Identity** (Section 2): Logo files, dark mode preference, brand colors
- **Voice Guidelines** (Section 3): Tone settings, emoji preference, word lists
- **Offerings** (Section 4): Services/products array (name + description), primary CTA
- **Contact Info** (Section 5): Email, phone, address, preferred method, social links array
- **AI Rules** (Section 6): Rewrite strength, sensitive area flags, always-keep text

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Site owners complete all required fields in under 15 minutes
- **SC-002**: 80% of users who begin the panel save at least one section
- **SC-003**: AI incorporates training data in 95% of relevant content requests (when data available)
- **SC-004**: Users rate panel ease of use as 4/5 or higher
- **SC-005**: Panel loads existing data in under 2 seconds
- **SC-006**: Training updates reflect in AI behavior within 10 seconds of saving
- **SC-007**: File uploads complete in under 5 seconds for files under 2MB
- **SC-008**: Zero instances of users blocked from PMC Engine features due to incomplete panel

---

## Scope *(mandatory)*

### In Scope

**Panel Structure**: Header, left stepper, right content area, save/discard actions, completion tracking
**Section 1**: Brand name, tagline, elevator pitch, description, industry, location
**Section 2**: Logo uploads (primary/dark/favicon), dark mode selection, color pickers (primary/secondary only)
**Section 3**: Tone sliders (formal↔casual, playful↔serious), tone description, emoji preference, word lists
**Section 4**: Repeatable services/products, primary CTA
**Section 5**: Email, phone, address, preferred contact method, repeatable social links
**Section 6**: Rewrite strength, sensitive areas (pricing/legal/testimonials/other), always-keep instructions
**Data Management**: Save/discard, auto-save (optional), completion tracking, timestamp, persistence
**AI Integration**: Load profile into system prompts, use in content generation, respect boundaries
**Summary Display**: Key info card with completion indicator

### Out of Scope

Blog/content planning, SEO/keyword tools, competitor analysis, advanced policy management, full color palette builders, multi-user collaboration, version control, custom AI model training, analytics/reporting, mobile-specific flows (handled by responsive shell)

---

## Assumptions

**Environment**:
- PMC Engine shell (top bar, sidebar, main content area) exists and is functional
- File upload infrastructure supports logos/favicons with reasonable limits
- Color picker component available
- AI system has interface for receiving training data as context

**User Behavior**:
- Users have brand assets (logos, colors) available when filling panel
- Most complete panel in 1-2 sessions (not all at once)
- Users understand basic brand concepts (tone, target audience)
- Panel being optional is expected and appreciated

**Content & Data**:
- Most sites: 3-7 services, 2-5 social links
- Business descriptions: 50-150 words
- Logo files: typically under 2MB
- Most users select "Both" for dark mode

**AI Integration**:
- AI can use unstructured text (descriptions, word lists) effectively
- AI can respect sensitive content flags
- AI adjusts style based on tone sliders
- Training changes propagate to AI in near real-time (seconds)

**Design & UX**:
- PMC Engine visual system sufficient for all components
- Wizard-style stepper pattern familiar to users
- Section titles + brief descriptions provide adequate context

---

## Dependencies

- PMC Engine shell and navigation (top bar, sidebar, routing)
- File upload and storage infrastructure
- Image validation library/service
- Color picker UI component
- Form validation utilities
- AI assistant/chat infrastructure (002-chat-panel)
- AI context/prompt management system
- Persistent data storage for training profiles
- Authentication/authorization system (per-site scoping)

---

## Privacy & Security Considerations

**Data Sensitivity**: Training profiles contain business-sensitive info, contact details, strategies
**Access Control**: Only authorized site owners access their site's panel; no cross-site leakage
**File Security**: Uploaded files scanned for malware, stored securely with auth tokens
**Encryption**: Training data encrypted at rest; uploads over HTTPS
**Prompt Injection Prevention**: User input sanitized/escaped when passed to AI context
**Data Retention**: Profiles persist with site; deletion cascades; GDPR-compliant clearing available
**Audit Logging**: Track who created/modified training data

---

## Layout Overview

See detailed layout specifications in: [appendices/layout-specs.md](appendices/layout-specs.md)

**Summary**:
- **Header**: Title, subtitle, completion (X/6), timestamp, Save/Discard buttons
- **Left Stepper** (~250px): Vertical list of 6 sections, clickable, completion icons, sticky positioning
- **Right Content**: Scrollable section cards, each with title, purpose, stacked form fields
- **Visual Style**: Matches PMC Engine (accent #EA2724, consistent spacing, typography)
- **Responsive**: Stepper adapts to tabs/dropdown on mobile, single-column layout

---

## Completion Logic

See detailed completion rules in: [appendices/completion-logic.md](appendices/completion-logic.md)

**Summary**:
- **Not Started**: All fields empty
- **Partially Filled**: Some fields filled but not all required/recommended
- **Completed**: Key fields present (varies by section)
- **Overall**: Count of completed sections (X/6)

---

## Data Model

See detailed data model in: [appendices/data-model.md](appendices/data-model.md)

**Summary Structure**:
```
TrainingProfile {
  siteId, lastUpdated, completionStatus
  section1_brandBasics { brandName, tagline, elevatorPitch, description, industry, location }
  section2_visualIdentity { logos, darkMode, colors }
  section3_voiceTone { sliders, description, emojiUsage, wordLists }
  section4_offerings { services[], primaryCTA }
  section5_contact { email, phone, address, preferredMethod, socialLinks[] }
  section6_aiBehavior { rewriteStrength, sensitiveAreas, alwaysKeep }
}
```

---

## AI Integration Details

See detailed integration specs in: [appendices/ai-integration.md](appendices/ai-integration.md)

**Summary**:
- **Load Profile**: Retrieve on AI Change Timeline open
- **Build Context**: Include brand, visual, tone, offerings, contact, rules in system prompt
- **Adjust Behavior**: Style based on tone, vocabulary from word lists, respect boundaries
- **Handle Missing Data**: Use theme context, ask minimal questions, never block features

---

## Appendices

Detailed specifications available in:
- [appendices/layout-specs.md](appendices/layout-specs.md) - Complete UI/UX layout, visual design, responsive behavior
- [appendices/field-specs.md](appendices/field-specs.md) - Every field's label, type, validation, helper text
- [appendices/completion-logic.md](appendices/completion-logic.md) - Per-section completion determination
- [appendices/data-model.md](appendices/data-model.md) - Complete object structure, validation rules
- [appendices/ai-integration.md](appendices/ai-integration.md) - How AI uses training data, missing data handling
