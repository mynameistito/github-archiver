function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60_000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const minutes = Math.floor(ms / 60_000);
  const seconds = ((ms % 60_000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
}

function formatPercent(value: number, total: number): string {
  if (total === 0) {
    return "0%";
  }
  return `${((value / total) * 100).toFixed(1)}%`;
}

function createProgressBar(
  completed: number,
  total: number,
  width = 30
): string {
  if (total === 0) {
    return "[ ]";
  }
  const filledWidth = Math.round((completed / total) * width);
  const emptyWidth = width - filledWidth;
  const filled = "=".repeat(filledWidth);
  const empty = " ".repeat(emptyWidth);
  const percentage = ((completed / total) * 100).toFixed(0);
  return `[${filled}${empty}] ${percentage}%`;
}

function centerText(text: string, width: number): string {
  const padding = Math.max(0, (width - text.length) / 2);
  return " ".repeat(Math.floor(padding)) + text;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength - 3)}...`;
}

export const Formatting = {
  formatDuration,
  formatBytes,
  formatPercent,
  createProgressBar,
  centerText,
  truncate,
};
