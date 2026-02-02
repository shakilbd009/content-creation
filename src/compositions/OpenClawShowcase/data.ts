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
  {
    name: "auth.test.ts",
    status: "fail",
    testCount: 3,
    failedTest: "should refresh expired tokens",
    appearAt: 300,
  },
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
