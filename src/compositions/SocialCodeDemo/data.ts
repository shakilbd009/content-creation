import type { HighlightedChar } from "../../components";

export const CODE_TO_TYPE = `const Button = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={isHovered ? 'btn-hover' : 'btn'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {label}
    </button>
  );
};`;

export const PROMPT_TEXT = 'claude --code "Create a Button component"';

export function highlightCode(
  code: string,
  colors: {
    keyword: string;
    react: string;
    string: string;
    jsx: string;
    bracket: string;
    arrow: string;
    default: string;
  }
): HighlightedChar[] {
  const result: HighlightedChar[] = [];
  const keywords = ["const", "return", "true", "false"];
  const reactKeywords = [
    "useState",
    "onClick",
    "onMouseEnter",
    "onMouseLeave",
    "className",
  ];

  let i = 0;
  while (i < code.length) {
    let matched = false;

    for (const keyword of keywords) {
      if (code.slice(i, i + keyword.length) === keyword) {
        const nextChar = code[i + keyword.length];
        if (!nextChar || /[\s(,=]/.test(nextChar)) {
          for (const char of keyword) {
            result.push({ char, color: colors.keyword });
          }
          i += keyword.length;
          matched = true;
          break;
        }
      }
    }
    if (matched) continue;

    for (const keyword of reactKeywords) {
      if (code.slice(i, i + keyword.length) === keyword) {
        for (const char of keyword) {
          result.push({ char, color: colors.react });
        }
        i += keyword.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (code[i] === "'" || code[i] === '"') {
      const quote = code[i];
      result.push({ char: quote, color: colors.string });
      i++;
      while (i < code.length && code[i] !== quote) {
        result.push({ char: code[i], color: colors.string });
        i++;
      }
      if (i < code.length) {
        result.push({ char: code[i], color: colors.string });
        i++;
      }
      continue;
    }

    if (code[i] === "<" || code[i] === ">") {
      result.push({ char: code[i], color: colors.jsx });
      i++;
      continue;
    }

    if (/[{}()[\]]/.test(code[i])) {
      result.push({ char: code[i], color: colors.bracket });
      i++;
      continue;
    }

    if (code.slice(i, i + 2) === "=>") {
      result.push({ char: "=", color: colors.arrow });
      result.push({ char: ">", color: colors.arrow });
      i += 2;
      continue;
    }

    result.push({ char: code[i], color: colors.default });
    i++;
  }

  return result;
}

export const PHASE = {
  PROMPT: 0,
  THINKING_START: 25,
  THINKING_END: 60,
  CODE_START: 60,
  SUCCESS: 200,
} as const;
