import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { ThemeProvider, oceanTheme, useTheme } from "../../themes";
import {
  Background,
  TerminalWindow,
  TitleBadge,
  CommandLine,
  StatusMessage,
  ThinkingDots,
  AgentRow,
  StepHeader,
  DataTable,
  Scanlines,
  Branding,
} from "../../components";
import { useSpringEntrance, calculateScroll } from "../../animations";
import { AGENTS, SEVERITY_DATA, CRITICAL_ISSUES, NEXT_STEPS, COMMAND, PHASE } from "./data";

const ClaudeHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ marginBottom: 24, opacity }}>
      <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.xl }}>
        <span style={{ color: theme.colors.text.brand }}>Claude Code</span>
        <span style={{ color: theme.colors.text.muted }}> v2.1.20</span>
      </div>
      <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.md, color: theme.colors.text.muted }}>
        Opus 4.5 · Claude Max · ~/project/agent-forge
      </div>
    </div>
  );
};

const UserQuestion: React.FC<{ delay: number }> = ({ delay }) => {
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);
  const answerOpacity = useSpringEntrance(delay + 15);

  return (
    <div style={{ marginBottom: 16, opacity }}>
      <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.lg, color: theme.colors.text.muted, marginBottom: 6 }}>
        <span style={{ color: theme.colors.bullet }}>*</span> User answered:
      </div>
      <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.lg, color: theme.colors.text.secondary, marginLeft: 20, opacity: answerOpacity }}>
        · Which validators? → <span style={{ color: theme.colors.status.info }}>--all</span>
      </div>
    </div>
  );
};

const RunningHeader: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const localFrame = Math.max(0, frame - delay);
  const dots = Math.floor((localFrame / 8) % 4);
  const dotString = ".".repeat(dots);
  const opacity = useSpringEntrance(delay);

  return (
    <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.lg, color: theme.colors.text.secondary, marginBottom: 16, opacity }}>
      <span style={{ color: theme.colors.bullet }}>*</span> Running 5 agents{dotString}
      <span style={{ color: theme.colors.text.muted, marginLeft: 16, fontSize: theme.typography.sizes.sm }}>(ctrl+o to expand)</span>
    </div>
  );
};

const ResultsVerdict: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);
  const verdictGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.7, 1]);

  return (
    <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.xl, marginBottom: 20, opacity }}>
      <span style={{ color: theme.colors.text.secondary }}>Verdict:</span>
      <span style={{ color: "#ff9f43", marginLeft: 16, fontWeight: 600, textShadow: `0 0 ${20 * verdictGlow}px rgba(255, 159, 67, 0.5)` }}>
        NEEDS_ATTENTION
      </span>
    </div>
  );
};

const CriticalIssuesTable: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);

  return (
    <div style={{ fontFamily: theme.typography.mono, fontSize: theme.typography.sizes.sm, opacity, flex: 1 }}>
      <div style={{ color: theme.colors.text.secondary, marginBottom: 12 }}>Critical Issues</div>
      <div style={{ border: "2px solid #333", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "flex", backgroundColor: "#1a1a1a", borderBottom: "2px solid #333" }}>
          <div style={{ width: 180, padding: "10px 16px", color: theme.colors.text.muted }}>Validator</div>
          <div style={{ flex: 1, padding: "10px 16px", color: theme.colors.text.muted, borderLeft: "2px solid #333" }}>Finding</div>
        </div>
        {CRITICAL_ISSUES.slice(0, 3).map((issue, i) => {
          const rowDelay = delay + 10 + i * 3;
          const rowOpacity = interpolate(frame - rowDelay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={issue.validator} style={{ display: "flex", borderBottom: i < 2 ? "2px solid #333" : "none", opacity: rowOpacity }}>
              <div style={{ width: 180, padding: "8px 16px", color: theme.colors.text.accent }}>{issue.validator}</div>
              <div style={{ flex: 1, padding: "8px 16px", color: theme.colors.text.secondary, borderLeft: "2px solid #333" }}>{issue.finding}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NextStepsSection: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);

  return (
    <div style={{ fontFamily: theme.typography.mono, fontSize: 28, marginTop: 24, opacity }}>
      <div style={{ color: theme.colors.text.secondary, marginBottom: 10 }}>Next Steps</div>
      {NEXT_STEPS.slice(0, 3).map((step, i) => {
        const stepDelay = delay + 10 + i * 4;
        const stepOpacity = interpolate(frame - stepDelay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ color: theme.colors.text.muted, marginBottom: 6, opacity: stepOpacity }}>
            <span style={{ color: theme.colors.status.info }}>{i + 1}.</span> {step}
          </div>
        );
      })}
    </div>
  );
};

const severityColumns = [
  { key: "label", label: "Severity", width: 180 },
  { key: "count", label: "Count", width: 100 },
];

const severityRows = SEVERITY_DATA.map((d) => ({
  label: d.label,
  count: d.count,
  _color: d.color,
}));

const MultiAgentShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();

  const scrollAmount = calculateScroll(frame, [
    { startFrame: PHASE.USER_QUESTION, endFrame: PHASE.AGENTS_START, distance: 120 },
    { startFrame: PHASE.AGENTS_START, endFrame: PHASE.LOADING + 80, distance: 280 },
    { startFrame: PHASE.RESULTS_START - 30, endFrame: 520, distance: 500, easing: Easing.inOut(Easing.quad) },
  ]);

  const showSetup = frame >= PHASE.SETUP_MSGS;
  const showAgents = frame >= PHASE.AGENTS_START;
  const showLoading = frame >= PHASE.LOADING;
  const showResults = frame >= PHASE.RESULTS_START;

  return (
    <Background>
      <TitleBadge accentText="Spec-Driven Development" mainText="How 5 AI Agents Review My Design" />

      <TerminalWindow>
        <div style={{ transform: `translateY(-${scrollAmount}px)` }}>
          <ClaudeHeader />
          <CommandLine command={COMMAND} startFrame={PHASE.COMMAND_START} hideCursorAfter={PHASE.SETUP_MSGS} />

          {showSetup && (
            <div>
              <StatusMessage delay={PHASE.SETUP_MSGS}>
                Using validate-design to run validation on agent-forge.
              </StatusMessage>
              <StatusMessage delay={PHASE.SETUP_MSGS + 15} color="#666">
                Read 2 files · Prerequisites verified
              </StatusMessage>
              <StepHeader step={1} title="Parse Arguments" delay={PHASE.STEP1} />
              <UserQuestion delay={PHASE.USER_QUESTION} />
              <StatusMessage delay={PHASE.USER_QUESTION + 25}>
                Running all 5 validators: security, architecture, performance, ux, devils-advocate
              </StatusMessage>
              <StepHeader step={2} title="Prerequisites Check" delay={PHASE.STEP2} />
              <StatusMessage delay={PHASE.STEP2 + 10} color="#666">
                Curated artifacts exist.
              </StatusMessage>
              <StepHeader step={3} title="Dispatch Validators (PARALLEL)" delay={PHASE.STEP3} />
            </div>
          )}

          {showAgents && (
            <div style={{ marginTop: 8 }}>
              <RunningHeader delay={PHASE.AGENTS_START} />
              <div style={{ marginLeft: 8 }}>
                {AGENTS.map((agent, i) => (
                  <AgentRow
                    key={agent.name}
                    agent={agent}
                    index={i}
                    isLast={i === AGENTS.length - 1}
                    startFrame={PHASE.AGENTS_START + 10}
                  />
                ))}
              </div>
            </div>
          )}

          {showLoading && (
            <ThinkingDots
              delay={PHASE.LOADING}
              label="Processing"
              icon="✢"
              showTimer
              fontSize={30}
            />
          )}

          {showResults && (
            <div style={{ marginTop: 20 }}>
              <StatusMessage delay={PHASE.RESULTS_START} color="#888">
                Validators run: security, architecture, performance, ux, devils-advocate
              </StatusMessage>
              <div style={{ marginTop: 16 }}>
                <ResultsVerdict delay={PHASE.RESULTS_START + 15} />
                <div style={{ display: "flex", alignItems: "flex-start", marginTop: 12 }}>
                  <div style={{ marginRight: 32 }}>
                    <DataTable
                      columns={severityColumns}
                      rows={severityRows}
                      delay={PHASE.TABLES_START}
                    />
                  </div>
                  <CriticalIssuesTable delay={PHASE.TABLES_START + 20} />
                </div>
                <NextStepsSection delay={PHASE.NEXT_STEPS} />
              </div>
            </div>
          )}
        </div>
      </TerminalWindow>

      <Scanlines />
      <Branding label="Claude Code" sublabel="~2 min for 5 expert reviews" />
    </Background>
  );
};

export const MultiAgentShowcase: React.FC = () => (
  <ThemeProvider theme={oceanTheme}>
    <MultiAgentShowcaseInner />
  </ThemeProvider>
);
