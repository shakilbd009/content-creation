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

export interface TerminalLine {
  text: string;
  color?: "prompt" | "default" | "success" | "error" | "muted" | "accent";
  appearAt: number;
}

export interface CodeChange {
  filename: string;
  lines: { text: string; type: "context" | "removed" | "added" }[];
  appearAt: number;
}

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    from: "user",
    text: "Hey Hermes 👋 can you run my test suite and tell me if anything broke?",
    appearAt: 80,
  },
  {
    id: "msg-2",
    from: "hermes",
    text: "On it! 🏃 Heading to your project now.",
    appearAt: 155,
  },
  {
    id: "msg-3",
    from: "hermes",
    text: "1 test failed ❌ auth.test.ts. Fixing it now... 🔧",
    appearAt: 380,
  },
  {
    id: "msg-4",
    from: "hermes",
    text: "Fixed! ✅ Changed `const ttl = 3600` → `const ttl = this.config.tokenTTL` in refreshToken.ts. TTL config was updated to 7200 but the code had it hardcoded 🤦",
    appearAt: 510,
  },
];

export const TERMINAL_LINES: TerminalLine[] = [
  { text: "$ cd ~/project", color: "default", appearAt: 185 },
  { text: "$ npm test", color: "default", appearAt: 210 },
  { text: "", color: "default", appearAt: 225 },
  { text: "  \u2713 user.test.ts (4 tests)", color: "success", appearAt: 240 },
  { text: "  \u2713 api.test.ts (6 tests)", color: "success", appearAt: 260 },
  {
    text: "  \u2717 auth.test.ts (3 tests) — should refresh expired tokens",
    color: "error",
    appearAt: 280,
  },
  {
    text: "  \u2713 database.test.ts (5 tests)",
    color: "success",
    appearAt: 300,
  },
  { text: "  \u2713 utils.test.ts (5 tests)", color: "success", appearAt: 320 },
  { text: "", color: "default", appearAt: 335 },
  { text: "  23 passed, 1 failed", color: "muted", appearAt: 340 },
  { text: "", color: "default", appearAt: 395 },
  {
    text: '$ claude -p "fix the failing test in auth.test.ts" --allowedTools=Edit,Read',
    color: "default",
    appearAt: 400,
  },
  { text: "", color: "default", appearAt: 412 },
  {
    text: "  \u25CF Reading auth.test.ts and src/auth/refreshToken.ts",
    color: "accent",
    appearAt: 415,
  },
  {
    text: "  \u25CF Found issue: hardcoded TTL doesn't match config",
    color: "accent",
    appearAt: 430,
  },
  {
    text: "  \u25CF Editing src/auth/refreshToken.ts",
    color: "accent",
    appearAt: 442,
  },
];

export const CODE_CHANGE: CodeChange = {
  filename: "src/auth/refreshToken.ts",
  lines: [
    { text: "  async refreshToken(token: string) {", type: "context" },
    { text: "    const ttl = 3600;", type: "removed" },
    { text: "    const ttl = this.config.tokenTTL;", type: "added" },
    { text: "    const newToken = await this.sign({", type: "context" },
    { text: "      ...this.decode(token),", type: "context" },
    { text: "      exp: Date.now() + ttl * 1000,", type: "context" },
    { text: "    });", type: "context" },
  ],
  appearAt: 455,
};

export const PHASE = {
  // Hero overlay
  HERO_START: 0,
  HERO_END: 75,
  // Phone appears, first message
  PHONE_APPEAR: 40,
  CHAT_START: 80,
  // Hermes replies, terminal slides in (flat, no tilt)
  HERMES_REPLY: 155,
  TERMINAL_IN: 175,
  // Terminal: cd, npm test, results stream
  TESTS_START: 185,
  TESTS_END: 340,
  // Hermes reports failure on phone
  FAILURE_REPORT: 380,
  // Terminal: hermes fix, code change
  FIX_START: 400,
  CODE_CHANGE: 455,
  // Terminal fades, phone gets final message
  TERMINAL_OUT: 500,
  FIX_REPORT: 510,
  // End
  END: 600,
} as const;
