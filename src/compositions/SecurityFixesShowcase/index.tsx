import React from "react";
import { useCurrentFrame, Easing } from "remotion";
import { ThemeProvider, modernTheme, useTheme } from "../../themes";
import {
  Background,
  TerminalWindow,
  TitleBadge,
  CommandLine,
  StatusMessage,
  ThinkingDots,
  CodeBlock,
  TaskListItem,
  ProgressBar,
  Scanlines,
} from "../../components";
import { calculateScroll } from "../../animations";
import { interpolate } from "remotion";
import { TASKS, CODE_SNIPPETS, COMMAND, PHASE } from "./data";

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

const SecurityFixesShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();

  const getTaskCompleteFrame = (index: number) =>
    PHASE.FIRST_COMPLETE + index * PHASE.TASK_COMPLETE_INTERVAL;

  const completedCount = TASKS.filter((_, i) => frame >= getTaskCompleteFrame(i)).length;

  const activeTaskIndex = TASKS.findIndex((_, i) => {
    const completeFrame = getTaskCompleteFrame(i);
    return frame < completeFrame && frame >= completeFrame - PHASE.TASK_COMPLETE_INTERVAL;
  });

  const scrollAmount = calculateScroll(frame, [
    {
      startFrame: PHASE.TASK_LIST_START,
      endFrame: PHASE.TASK_LIST_START + 150,
      distance: 100,
      easing: Easing.out(Easing.quad),
    },
    {
      startFrame: PHASE.FIRST_COMPLETE + 200,
      endFrame: PHASE.FIRST_COMPLETE + 400,
      distance: 300,
      easing: Easing.out(Easing.quad),
    },
  ]);

  const showTasks = frame >= PHASE.TASK_LIST_START;

  return (
    <Background>
      <TitleBadge
        accentText="Addressing Critical Issues"
        mainText="10 Fixes in Agent-Forge"
      />

      <TerminalWindow>
        <div style={{ transform: `translateY(-${scrollAmount}px)` }}>
          <ClaudeHeader />
          <CommandLine
            command={COMMAND}
            startFrame={PHASE.COMMAND_START}
            charsPerSecond={30}
            hideCursorAfter={PHASE.INIT_MSG}
          />

          {frame >= PHASE.INIT_MSG && (
            <>
              <StatusMessage delay={PHASE.INIT_MSG}>
                I see 10 critical issues across Security (3), Performance (3), and Devils Advocate (4).
              </StatusMessage>
              <StatusMessage delay={PHASE.INIT_MSG + 20} color="#666">
                Read 6 files · Creating task list to track progress
              </StatusMessage>
            </>
          )}

          {showTasks && (
            <div style={{ marginTop: 20 }}>
              <ProgressBar
                delay={PHASE.TASK_LIST_START}
                completed={completedCount}
                total={TASKS.length}
              />

              {TASKS.map((task, i) => {
                const completeFrame = getTaskCompleteFrame(i);
                const isActive = i === activeTaskIndex;
                return (
                  <div key={`${task.category}-${task.id}`}>
                    <TaskListItem
                      task={task}
                      startFrame={PHASE.TASK_LIST_START + i * 8}
                      completeFrame={completeFrame}
                      isActive={isActive}
                    />
                    {CODE_SNIPPETS[i] &&
                      frame >= completeFrame &&
                      frame < completeFrame + 40 && (
                        <CodeBlock
                          code={CODE_SNIPPETS[i].code}
                          file={CODE_SNIPPETS[i].file}
                          delay={completeFrame}
                        />
                      )}
                  </div>
                );
              })}

              {activeTaskIndex >= 0 && (
                <ThinkingDots
                  delay={getTaskCompleteFrame(activeTaskIndex) - PHASE.TASK_COMPLETE_INTERVAL + 10}
                  label={`Addressing ${TASKS[activeTaskIndex].category} ${TASKS[activeTaskIndex].id}`}
                  hint="esc to interrupt"
                />
              )}

              {completedCount === TASKS.length && (
                <div style={{ marginTop: 24 }}>
                  <StatusMessage delay={getTaskCompleteFrame(TASKS.length - 1) + 20} color="#27ca3f">
                    All 10 critical issues have been addressed!
                  </StatusMessage>
                  <StatusMessage delay={getTaskCompleteFrame(TASKS.length - 1) + 40} color="#888">
                    Updated 6 files in ideas/agent-forge/07-curated/
                  </StatusMessage>
                </div>
              )}
            </div>
          )}
        </div>
      </TerminalWindow>

      <Scanlines />
    </Background>
  );
};

export const SecurityFixesShowcase: React.FC = () => (
  <ThemeProvider theme={modernTheme}>
    <SecurityFixesShowcaseInner />
  </ThemeProvider>
);
