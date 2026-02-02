export function getTypewriterProgress(
  frame: number,
  startFrame: number,
  totalChars: number,
  charsPerFrame: number = 1.5
): number {
  const relativeFrame = Math.max(0, frame - startFrame);
  const charIndex = Math.floor(relativeFrame * charsPerFrame);
  return Math.min(charIndex, totalChars);
}

export function getTypewriterCommandProgress(
  frame: number,
  startFrame: number,
  commandLength: number,
  fps: number,
  charsPerSecond: number = 25
): number {
  const localFrame = Math.max(0, frame - startFrame);
  const framesPerChar = fps / charsPerSecond;
  const charsToShow = Math.floor(localFrame / framesPerChar);
  return Math.min(charsToShow, commandLength);
}

export function getCursorVisible(frame: number, speed: number = 0.4): boolean {
  return Math.sin(frame * speed) > 0;
}

export function getDotsString(frame: number, interval: number = 8): string {
  const dots = Math.floor((frame / interval) % 4);
  return ".".repeat(dots);
}
