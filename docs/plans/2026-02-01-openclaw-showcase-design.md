# OpenClaw Showcase Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 20-second horizontal 16:9 Remotion video showing a user messaging Hermes (OpenClaw AI assistant) on Telegram to run their test suite, with results streaming back — demonstrating "Claude from your phone" lifestyle.

**Architecture:** Phone-first layout with Telegram chat UI as the hero element. When Hermes starts executing, a terminal panel slides in from the right while the entire scene rotates into a 3D top-down angled perspective (as if the phone is laying on a desk). New `telegram` theme with Telegram-blue accent. New `PhoneMockup` and `ChatBubble` components.

**Tech Stack:** Remotion 4, React 18, TypeScript 5

---

### Task 1: Create the Telegram theme

**Files:**
- Create: `src/themes/telegram.ts`
- Modify: `src/themes/index.ts`

**Step 1: Create `src/themes/telegram.ts`**

```ts
import { Theme } from "./types";

export const telegramTheme: Theme = {
  name: "telegram",
  colors: {
    background: "#0F1923",
    backgroundGradient:
      "linear-gradient(180deg, #0F1923 0%, #0d1620 30%, #162230 60%, #1a2d42 100%)",
    ambientGlows: [
      "radial-gradient(ellipse at 50% 30%, rgba(42, 171, 238, 0.12) 0%, transparent 60%)",
      "radial-gradient(ellipse at 70% 70%, rgba(42, 171, 238, 0.06) 0%, transparent 40%)",
    ],
    terminal: {
      bg: "rgba(10, 15, 20, 0.65)",
      titleBarBg: "rgba(15, 20, 28, 0.6)",
      border: "1px solid rgba(42, 171, 238, 0.15)",
      titleBarBorder: "1px solid rgba(42, 171, 238, 0.08)",
      glow: "0 40px 100px rgba(0, 0, 0, 0.5), 0 0 1px rgba(42, 171, 238, 0.2)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#8B9DAF",
      muted: "#5A6A7A",
      accent: "#2AABEE",
      brand: "#2AABEE",
    },
    syntax: {
      keyword: "#2AABEE",
      react: "#34D058",
      string: "#FFD866",
      jsx: "#2AABEE",
      bracket: "#8B9DAF",
      arrow: "#FF4757",
      default: "#FFFFFF",
    },
    status: {
      success: "#34D058",
      error: "#FF4757",
      warning: "#FFD866",
      info: "#2AABEE",
    },
    severity: {
      critical: "#FF4757",
      high: "#FF6B6B",
      medium: "#FFD866",
      low: "#5A6A7A",
    },
    bullet: "#2AABEE",
    cursor: "#2AABEE",
    prompt: "#34D058",
  },
  effects: {
    scanlines: { opacity: 0, spacing: 0 },
    vignette: { enabled: false, opacity: 0 },
    flicker: { enabled: false, tint: "transparent", intensity: 0 },
    backdrop: { blur: 20 },
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 2000 },
  },
  typography: {
    mono: "Monaco, Consolas, monospace",
    system: "system-ui, -apple-system, sans-serif",
    sizes: { xs: 22, sm: 26, md: 30, lg: 34, xl: 38, xxl: 44 },
  },
  spacing: {
    terminal: {
      width: 960,
      height: 700,
      titleBarHeight: 48,
      padding: 36,
      borderRadius: 16,
      trafficLightSize: 16,
    },
  },
};
```

Note: Terminal is smaller (960x700) because it shares screen with the phone. Perspective disabled — the composition handles 3D transforms manually for the scene-level rotation.

**Step 2: Register the theme in `src/themes/index.ts`**

Add export and register in themes object:
```ts
export { telegramTheme } from "./telegram";
// ... in themes object:
telegram: telegramTheme,
```

**Step 3: Verify TypeScript compiles**

Run: `cd /Users/shakilakram/projects/remotion/content-creation && npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/themes/telegram.ts src/themes/index.ts
git commit -m "feat: add telegram theme for OpenClaw showcase"
```

---

### Task 2: Create composition data file

**Files:**
- Create: `src/compositions/OpenClawShowcase/data.ts`

**Step 1: Create `src/compositions/OpenClawShowcase/data.ts`**

```ts
export interface ChatMessage {
  id: string;
  from: "user" | "hermes";
  text: string;
  appearAt: number;
}

export interface TestResult {
  name: string;
  status: "pass" | "fail";
  testCount: number;
  failedTest?: string;
  appearAt: number;
}

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    from: "user",
    text: "Hey Hermes, can you run my test suite and tell me if anything broke?",
    appearAt: 80,
  },
  {
    id: "msg-2",
    from: "hermes",
    text: "On it! Running your test suite now...",
    appearAt: 155,
  },
  {
    id: "msg-3",
    from: "hermes",
    text: "Done! 23 passed, 1 failed",
    appearAt: 430,
  },
  {
    id: "msg-4",
    from: "hermes",
    text: "auth.test.ts \u2014 'should refresh expired tokens' is failing. Looks like the token TTL config changed. Want me to fix it?",
    appearAt: 470,
  },
];

export const TEST_RESULTS: TestResult[] = [
  { name: "user.test.ts", status: "pass", testCount: 4, appearAt: 230 },
  { name: "api.test.ts", status: "pass", testCount: 6, appearAt: 265 },
  { name: "auth.test.ts", status: "fail", testCount: 3, failedTest: "should refresh expired tokens", appearAt: 300 },
  { name: "database.test.ts", status: "pass", testCount: 5, appearAt: 335 },
  { name: "utils.test.ts", status: "pass", testCount: 5, appearAt: 370 },
];

export const TEST_COMMAND = "npm test";

export const PHASE = {
  // Hero overlay
  HERO_START: 0,
  HERO_END: 75,
  // Phone appears, first message
  PHONE_APPEAR: 40,
  CHAT_START: 80,
  // Hermes replies, terminal slides in + 3D tilt
  HERMES_REPLY: 155,
  TERMINAL_IN: 175,
  TILT_START: 175,
  TILT_END: 220,
  // Test output streams
  TESTS_START: 230,
  TESTS_END: 400,
  // Terminal fades, phone returns to center, results messages
  TERMINAL_OUT: 410,
  UNTILT_START: 410,
  UNTILT_END: 450,
  REPORT_START: 430,
  // End
  END: 600,
} as const;
```

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/shakilakram/projects/remotion/content-creation && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/compositions/OpenClawShowcase/data.ts
git commit -m "feat: add data file for OpenClaw showcase composition"
```

---

### Task 3: Build the composition (main file)

**Files:**
- Create: `src/compositions/OpenClawShowcase/index.tsx`
- Modify: `src/Root.tsx`

This is the core file. It contains:

1. **HeroOverlay** — "Claude From Your Phone" + "OpenClaw + Hermes" at frame 0, fades out by frame 75
2. **PhoneMockup** — Telegram-style chat interface with header ("Hermes" + green dot), chat bubbles with typing indicators
3. **ChatBubble** — Individual message (right-aligned blue for user, left-aligned dark gray for Hermes), with typewriter text reveal
4. **TypingIndicator** — Three bouncing dots shown before Hermes messages
5. **TestOutputPanel** — Terminal window showing `npm test` output streaming with green checkmarks / red X
6. **Scene orchestration** — The main component manages:
   - Phone centered initially
   - At TILT_START: entire scene applies `perspective(1800px) rotateX(12deg)` with spring animation (looking down at desk angle)
   - Phone shifts left + shrinks slightly
   - Terminal slides in from right
   - At UNTILT_START: reverse the tilt, terminal slides out, phone re-centers

**Step 1: Create `src/compositions/OpenClawShowcase/index.tsx`**

The full component implementation (~400 lines). Key architectural decisions:

- **3D tilt:** Applied at the scene wrapper level using `interpolate` on `TILT_START`→`TILT_END` for `rotateX` (0→12deg) and a subtle `rotateY` (0→-3deg). Reverse on `UNTILT_START`→`UNTILT_END`.
- **Phone mockup:** Pure CSS — rounded rect with notch, Telegram header bar, message list area. Dimensions ~420x780 to look like a real phone at 1920x1080.
- **Chat bubbles:** Use `interpolate` for slide-up entrance. User bubbles are Telegram-blue (#2AABEE), Hermes bubbles are dark gray (#1C2B3A). Text appears with a fast typewriter (3 chars/frame).
- **Terminal panel:** Reuse the existing `TerminalWindow` component with the telegram theme's smaller sizing. Test lines appear one by one at their `appearAt` frames.
- **No Branding component** (per CLAUDE.md rules).
- **No scanlines/CRT effects** — clean modern look.

```tsx
// Skeleton structure (full code to be written in implementation):

const HeroOverlay: React.FC  // "Claude From Your Phone" + "OpenClaw + Hermes"
const TypingIndicator: React.FC  // Three bouncing dots
const ChatBubble: React.FC<{message: ChatMessage}>  // Single chat message
const PhoneMockup: React.FC  // Full phone with Telegram UI
const TestOutputPanel: React.FC  // Terminal with streaming test results
const OpenClawShowcaseInner: React.FC  // Scene orchestration + 3D transforms
export const OpenClawShowcase: React.FC  // ThemeProvider wrapper
```

**Step 2: Register in `src/Root.tsx`**

Add import and Composition entry:
```tsx
import { OpenClawShowcase } from "./compositions/OpenClawShowcase";

<Composition
  id="OpenClawShowcase"
  component={OpenClawShowcase}
  durationInFrames={600}
  fps={30}
  {...HORIZONTAL_16_9}
/>
```

**Step 3: Verify it renders in Remotion Studio**

Run: `cd /Users/shakilakram/projects/remotion/content-creation && npx remotion studio`
Expected: OpenClawShowcase appears in composition list, renders without errors, first frame shows hero overlay

**Step 4: Commit**

```bash
git add src/compositions/OpenClawShowcase/index.tsx src/Root.tsx
git commit -m "feat: add OpenClaw showcase composition with phone + terminal 3D layout"
```

---

### Task 4: Polish and verify thumbnail

**Files:**
- Modify: `src/compositions/OpenClawShowcase/index.tsx` (if adjustments needed)

**Step 1: Verify frame 0 is a strong thumbnail**

Open Remotion Studio, scrub to frame 0. Verify:
- "Claude From Your Phone" is large, glowing, centered
- "OpenClaw + Hermes" subtitle is visible
- Telegram-blue accent glow visible
- Background is dark and rich, not blank

**Step 2: Scrub through full timeline**

Verify all 4 phases play correctly:
- Phase 1: Hero fades out revealing phone
- Phase 2: Chat messages appear with typing indicators
- Phase 3: 3D tilt + terminal slides in + test output streams
- Phase 4: Untilt + terminal out + Hermes summary messages

**Step 3: Fix any visual issues found**

Adjust timing, sizing, colors as needed.

**Step 4: Commit final adjustments**

```bash
git add -u
git commit -m "fix: polish OpenClaw showcase timing and visuals"
```
