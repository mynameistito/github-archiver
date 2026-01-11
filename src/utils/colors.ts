const RESET = "\x1b[0m";
const BRIGHT = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";

function success(text: string): string {
  return `${GREEN}${text}${RESET}`;
}

function error(text: string): string {
  return `${RED}${text}${RESET}`;
}

function warning(text: string): string {
  return `${YELLOW}${text}${RESET}`;
}

function info(text: string): string {
  return `${CYAN}${text}${RESET}`;
}

function dim(text: string): string {
  return `${DIM}${text}${RESET}`;
}

function bold(text: string): string {
  return `${BRIGHT}${text}${RESET}`;
}

function successBold(text: string): string {
  return `${GREEN}${BRIGHT}${text}${RESET}`;
}

function errorBold(text: string): string {
  return `${RED}${BRIGHT}${text}${RESET}`;
}

function warningBold(text: string): string {
  return `${YELLOW}${BRIGHT}${text}${RESET}`;
}

function table(rows: string[]): string {
  return rows.map((row) => `${DIM}│${RESET} ${row}`).join("\n");
}

function formatStatus(
  status: "success" | "error" | "warning" | "info"
): string {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️ ",
    info: "ℹ️ ",
  };
  const colors = {
    success,
    error,
    warning,
    info,
  };
  return colors[status](icons[status]);
}

export const Colors = {
  success,
  error,
  warning,
  info,
  dim,
  bold,
  successBold,
  errorBold,
  warningBold,
  table,
  formatStatus,
};
