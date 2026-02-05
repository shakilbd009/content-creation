# AWS Landing Zone Showcase Design

## Overview

A short, punchy video showcasing Claude Code's intelligence when building AWS infrastructure. The focus is on Claude as a **thoughtful collaborator** - asking smart clarifying questions before building, rather than just generating code fast.

**Target Audience:** General tech audience (broad appeal, minimal AWS jargon)

**Duration:** ~540 frames (18 seconds at 30fps)

**Theme:** Modern (purple gradient with AWS-style orange/blue accents)

**Format:** Horizontal 16:9 (1920x1080)

---

## Narrative Arc

1. **Hero hook** (frames 0-60) - Bold text with glowing cloud/org icon
2. **Prompt** (frames 50-120) - User types the command
3. **Claude thinks + asks** (frames 120-200) - Claude responds with quick-fire option pills
4. **User selects** (frames 200-260) - Pills animate as selection is made
5. **Claude builds** (frames 260-440) - Terminal shows progress, AWS org tree grows
6. **Resolution** (frames 440-540) - Clean org structure revealed

---

## Visual Components

### 1. HeroOverlay

- **Main text:** "AWS Landing Zone"
- **Subtext:** "From zero to enterprise-ready"
- **Effects:** Animated pulse glow (orange/blue AWS accent colors)
- **Behavior:** Fully visible at frame 0, fades out with subtle scale-down by frame 60

### 2. Terminal Window

- Claude Code style terminal (dark background, monospace font)
- Centered/slightly left in frame
- Shows:
  - User prompt with typewriter effect
  - Claude's thinking indicator
  - Claude's response text
  - Build progress with checkmarks

### 3. Option Pills UI

Floating pill buttons representing Claude's AskUserQuestion interface:

| Pill | Label | Icon |
|------|-------|------|
| 1 | Enterprise Multi-Region | 🏢 |
| 2 | SOC2 Compliant | 🔒 |
| 3 | Startup / Dev | 🚀 |

**Animation:**
- Stagger entrance (50ms apart)
- Hover glow effect
- Selected pill: scales up + color shift + checkmark

### 4. AWS Org Tree Visualization

Floating visualization to the right of terminal showing the account structure:

```
Root (Management)
├── Security OU
│   ├── Log Archive
│   └── Security Tooling
├── Workloads OU
│   ├── Production
│   └── Development
└── Sandbox OU
```

**Node Styling:**
- Rounded rectangles with 2px border
- Color coding by OU type:
  - Root: Orange (AWS brand)
  - Security OU: Red accent
  - Workloads OU: Blue accent
  - Sandbox OU: Green accent
- Simple AWS-style icons (building, shield, code, flask)

**Animation:**
- Nodes spring pop-in synced to terminal checkmarks
- Connection lines draw in with slight delay
- Subtle ambient glow on completed state

---

## Terminal Script

### User Prompt
```
build me an aws landing zone
```

### Claude Response
```
I'll set up your AWS Landing Zone. Quick question:
```

### After User Selects "SOC2 Compliant"

```
Setting up SOC2-compliant landing zone...

✓ Creating Organization structure
✓ Enabling AWS Control Tower
✓ Configuring Security OU
  → Log Archive account
  → Security Tooling account
✓ Configuring Workloads OU
  → Production account
  → Development account
✓ Applying SCPs for SOC2 compliance
✓ Enabling CloudTrail org-wide
✓ Setting up IAM Identity Center

Landing zone ready
```

Each checkmark triggers the corresponding node appearing in the org tree.

---

## Phase Timing

```typescript
export const PHASE = {
  // Hero
  HERO_START: 0,
  HERO_END: 60,

  // Terminal & Prompt
  TERMINAL_APPEAR: 40,
  PROMPT_START: 55,
  PROMPT_DONE: 110,

  // Claude Response
  CLAUDE_THINKING: 115,
  CLAUDE_RESPONSE: 130,

  // Option Pills
  PILLS_APPEAR: 160,
  PILL_SELECT: 210,

  // Build Phase
  BUILD_START: 240,
  BUILD_STEP_1: 260,   // Organization structure
  BUILD_STEP_2: 290,   // Control Tower
  BUILD_STEP_3: 320,   // Security OU + accounts
  BUILD_STEP_4: 360,   // Workloads OU + accounts
  BUILD_STEP_5: 400,   // SCPs, CloudTrail, IAM
  BUILD_DONE: 440,

  // Hold & End
  HOLD_END: 540,
} as const;
```

---

## Animation Specifications

| Element | Animation | Timing | Config |
|---------|-----------|--------|--------|
| Hero text | Pulse glow + fade out | 0-60 | Sin wave for glow |
| Terminal | Slide up | 40-70 | Spring gentle |
| Prompt | Typewriter | 55-110 | ~20 chars/sec |
| Thinking dots | Animate dots | 115-130 | 3-dot cycle |
| Claude response | Typewriter | 130-155 | ~25 chars/sec |
| Pills | Stagger pop-in | 160-190 | Spring snappy, 50ms stagger |
| Pill selection | Scale + color | 210-240 | Spring bouncy |
| Checkmarks | Fade in | Per step | 100ms each |
| Org nodes | Spring pop-in | Synced to ✓ | Spring smooth |
| Connection lines | Draw in | After node | 150ms delay |

---

## File Structure

```
src/compositions/AWSLandingZoneShowcase/
├── index.tsx      # Main composition
└── data.ts        # PHASE constants, terminal script, org tree data
```

---

## Component Breakdown

### New Components (in composition file)

1. **HeroOverlay** - Bold opening with AWS-style glows
2. **OptionPills** - Interactive-looking pill buttons
3. **OrgTreeViz** - AWS organization tree visualization
4. **OrgNode** - Individual node in the tree
5. **ConnectionLine** - Animated line between nodes

### Reused Components

- `Background` - Modern theme gradient
- `TerminalWindow` - Mac-style terminal frame
- `CommandLine` - Typewriter prompt
- `ThinkingDots` - Claude thinking indicator
- `StatusMessage` - Checkmark + text lines

---

## Registration

Add to `src/Root.tsx`:

```tsx
<Composition
  id="AWSLandingZoneShowcase"
  component={AWSLandingZoneShowcase}
  durationInFrames={540}
  fps={30}
  {...HORIZONTAL_16_9}
/>
```
