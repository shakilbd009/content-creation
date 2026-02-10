# Security OU Showcase Design

## Overview

A short, punchy video showcasing Claude Code setting up a hardened Security OU within an AWS organization. This complements the AWS Landing Zone video by diving deep into the security layer — showing dedicated accounts and security controls being enabled.

**Target Audience:** General tech audience (security-conscious developers, DevOps, cloud architects)

**Duration:** ~540 frames (18 seconds at 30fps)

**Theme:** Modern (purple gradient with red/orange security accent colors)

**Format:** Horizontal 16:9 (1920x1080)

---

## Narrative Arc

1. **Hero hook** (frames 0-60) - "Security-First AWS" with shield icon
2. **Prompt** (frames 55-120) - User types the command
3. **Claude thinks + asks** (frames 125-170) - Claude responds with compliance options
4. **User selects** (frames 170-250) - SOC2 Compliant pill selected
5. **Claude builds** (frames 250-460) - Terminal shows progress, security tree expands
6. **Resolution** (frames 460-540) - Full Security OU with all controls active

---

## Visual Components

### 1. HeroOverlay

- **Main text:** "Security-First AWS"
- **Subtext:** "SOC2-ready in seconds"
- **Icon:** 🛡️ shield with red/orange glow
- **Effects:** Animated pulse glow (red/orange security accent colors)
- **Behavior:** Fully visible at frame 0, fades out by frame 60

### 2. Terminal Window

- Claude Code style terminal (dark background, monospace font)
- Positioned on the left side
- Shows:
  - User prompt with typewriter effect
  - Claude's thinking indicator
  - Claude's response text
  - Build progress with checkmarks and sub-items

### 3. Option Pills UI

Floating pill buttons representing compliance framework options:

| Pill | Label | Emoji |
|------|-------|-------|
| 1 | SOC2 Compliant | 🔒 |
| 2 | HIPAA Ready | 🏥 |
| 3 | PCI-DSS | 💳 |

**Animation:**
- Stagger entrance (50ms apart)
- Hover glow effect
- Selected pill: scales up + color shift + checkmark

### 4. Security OU Tree Visualization

Floating visualization to the right of terminal showing the Security OU structure:

```
Security OU
├── Log Archive Account
│   ├── CloudTrail Logs
│   ├── Config Logs
│   └── VPC Flow Logs
├── Security Tooling Account
│   ├── GuardDuty
│   ├── SecurityHub
│   └── IAM Access Analyzer
└── Audit Account
    ├── AWS Config Rules
    ├── CloudWatch Alarms
    └── SNS Alerts
```

**Node Styling:**
- Rounded rectangles with 2px border
- Color coding by account type:
  - Security OU (root): Red/crimson (#E02D4E) with 🛡️
  - Log Archive: Blue (#3B82F6) with 📋
  - Security Tooling: Orange (#FF9900) with 🔧
  - Audit: Green (#10B981) with ✅
- Sub-items (services): Smaller nodes, same color as parent account

**Animation:**
- Account nodes spring pop-in synced to terminal checkmarks
- Service nodes stagger in after parent account
- Connection lines draw in with slight delay
- Subtle ambient glow on completed state

---

## Terminal Script

### User Prompt
```
set up a security-hardened aws organization
```

### Claude Response
```
I'll configure your Security OU. What compliance framework?
```

### After User Selects "SOC2 Compliant"

```
Setting up SOC2-compliant Security OU...

✓ Creating Security OU
✓ Provisioning Log Archive account
  → CloudTrail Logs
  → Config Logs
  → VPC Flow Logs
✓ Provisioning Security Tooling account
  → GuardDuty enabled
  → SecurityHub enabled
  → IAM Access Analyzer enabled
✓ Provisioning Audit account
  → AWS Config Rules
  → CloudWatch Alarms
  → SNS Alerts
✓ Applying SOC2 SCPs

Security OU hardened ✓
```

Each checkmark triggers the corresponding node appearing in the tree.

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
  PROMPT_DONE: 120,

  // Claude Response
  CLAUDE_THINKING: 125,
  CLAUDE_RESPONSE: 140,

  // Option Pills
  PILLS_APPEAR: 170,
  PILL_SELECT: 220,
  PILLS_FADE: 250,

  // Build Phase
  BUILD_START: 250,
  BUILD_STEP_1: 270,   // Security OU
  BUILD_STEP_2: 300,   // Log Archive + services
  BUILD_STEP_3: 350,   // Security Tooling + services
  BUILD_STEP_4: 400,   // Audit + services
  BUILD_STEP_5: 440,   // SCPs
  BUILD_DONE: 460,

  // Final
  FINAL_MESSAGE: 470,
  HOLD_END: 540,
} as const;
```

---

## Animation Specifications

| Element | Animation | Timing | Config |
|---------|-----------|--------|--------|
| Hero text | Pulse glow + fade out | 0-60 | Sin wave for glow |
| Terminal | Slide up | 40-70 | Spring gentle |
| Prompt | Typewriter | 55-120 | ~18 chars/sec |
| Thinking dots | Animate dots | 125-140 | 3-dot cycle |
| Claude response | Typewriter | 140-165 | ~25 chars/sec |
| Pills | Stagger pop-in | 170-200 | Spring snappy, 50ms stagger |
| Pill selection | Scale + color | 220-250 | Spring bouncy |
| Checkmarks | Fade in | Per step | 100ms each |
| Account nodes | Spring pop-in | Synced to ✓ | Spring smooth |
| Service nodes | Stagger pop-in | After account | 80ms stagger |
| Connection lines | Draw in | After node | 150ms delay |

---

## File Structure

```
src/compositions/SecurityOUShowcase/
├── index.tsx      # Main composition
└── data.ts        # PHASE constants, terminal script, tree data
```

---

## Component Breakdown

### New Components (in composition file)

1. **HeroOverlay** - Bold opening with security-themed glows
2. **OptionPills** - Interactive-looking pill buttons (reuse from AWSLandingZone)
3. **SecurityTreeViz** - Security OU tree visualization
4. **AccountNode** - Account-level node (Log Archive, Security Tooling, Audit)
5. **ServiceNode** - Service-level node (smaller, child of account)
6. **ConnectionLine** - Animated line between nodes

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
  id="SecurityOUShowcase"
  component={SecurityOUShowcase}
  durationInFrames={540}
  fps={30}
  {...HORIZONTAL_16_9}
/>
```
