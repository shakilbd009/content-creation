# Video Composition Rules

## Branding
- Never use "Powered by Claude Code" or any `Branding` component in videos.

## Social Media Thumbnails
- Every composition must have a bold, visually engaging first frame (frame 0) that works as a social media thumbnail/preview.
- Use a custom hero overlay (large text, glows, color accents) that is fully visible at frame 0 and fades out as the main content appears.
- The thumbnail should hook viewers to click — no blank or barely-visible opening frames.
- mobile friendly videos

---

# Project Architecture

## Creating a New Composition

Each composition lives in `src/compositions/<Name>/` with two files:
- `data.ts` — constants, PHASE timing, data structures, color palettes
- `index.tsx` — React components, animations, layout

Register in `src/Root.tsx`:
```tsx
import { MyComposition } from "./compositions/MyComposition";
// Then add <Composition id="MyComposition" component={MyComposition} durationInFrames={540} fps={30} {...HORIZONTAL_16_9} />
```

## Video Standards
- **Resolution**: 1920x1080 (HORIZONTAL_16_9) for most, 1080x1920 (VERTICAL_9_16) for reels
- **FPS**: Always 30
- **Duration**: 240–750 frames (8–25 seconds)
- **Presets**: Import from `src/presets/aspect-ratios.ts`

## Composition Structure Pattern
Every composition follows this pattern:
```
1. Theme variant (disable 3D perspective)
2. HeroOverlay component (visible at frame 0, fades out by HERO_END)
3. Inner component with all logic
4. Export wrapper with ThemeProvider
```

## Theme System (`src/themes/`)
- `modernTheme` — Purple gradient (most common)
- `oceanTheme` — Navy-to-teal gradient (cloud/infrastructure)
- `terminalTheme` — Dark retro CRT
- `telegramTheme` — Dark blue, minimal

Always create a flat variant to disable 3D:
```tsx
const flatTheme: Theme = { ...baseTheme, effects: { ...baseTheme.effects, perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 0 } } };
```

## Available Components (`src/components/`)
**Layout**: Background, TerminalWindow, Scanlines, Vignette, ScreenFlicker, TitleBadge
**Text**: CommandLine, StatusMessage, ThinkingDots, Typewriter, CodeBlock
**Data**: StepHeader, DataTable, ProgressBar, TaskListItem, AgentRow

## PHASE Timing Pattern
All timing is controlled via a `PHASE` const object in `data.ts`:
```ts
export const PHASE = { HERO_START: 0, HERO_END: 60, TERMINAL_APPEAR: 40, PROMPT_START: 55, ... } as const;
```

## Animation Patterns
- **Spring** (preferred): `spring({ frame: elapsed, fps, config: { damping: 12, stiffness: 150 } })`
- **Interpolate**: `interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })`
- **Pulsing glow**: `interpolate(Math.sin(frame * 0.15), [-1, 1], [0.5, 0.9])`
- **Stagger**: `PHASE.START + index * 6` for sequential item reveals

## Common Pitfalls
- `interpolate` inputRange MUST be strictly monotonically increasing — never `[x, x]`. Avoid dynamic frame-based ranges like `[frame - 10, frame]` when frame could equal the start constant.
- Don't use CSS `transition` in Remotion — it doesn't work frame-by-frame. Use `interpolate` or `spring` instead.

## Rendering Commands
```bash
# Preview in browser
npx remotion studio

# Render a specific frame as PNG
npx remotion still CompositionName output.png --frame=123

# Render full video
npx remotion render CompositionName out/CompositionName.mp4

# TypeScript check
npx tsc --noEmit
```

## Standard Layout
- Terminal on left: `left: 60, width: 750–830`
- Visualization on right: `right: 40–50, width: 880–960`
- Both vertically centered: `top: "50%", transform: "translateY(-50%)"`
