import { Formatting } from "./formatting";

export interface ProgressUpdate {
  completed: number;
  current?: {
    owner: string;
    repo: string;
  };
  failed: number;
  total: number;
}

export class ProgressDisplay {
  private readonly startTime: number;
  private lastUpdate = 0;
  private readonly updateInterval = 500; // ms

  constructor() {
    this.startTime = Date.now();
  }

  shouldUpdate(): boolean {
    const now = Date.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      this.lastUpdate = now;
      return true;
    }
    return false;
  }

  getProgressBar(progress: ProgressUpdate): string {
    const { completed, total, current } = progress;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    const bar = Formatting.createProgressBar(completed, total, 25);

    let line = `${bar} ${completed}/${total} (${percent.toFixed(0)}%)`;

    if (current) {
      line += ` - ${current.owner}/${current.repo}`;
    }

    return line;
  }
  getSummaryBox(summary: {
    successful: number;
    failed: number;
    skipped: number;
    totalDuration: number;
  }): string {
    const { successful, failed, skipped, totalDuration } = summary;
    const total = successful + failed + skipped;
    const duration = Formatting.formatDuration(totalDuration);

    const createLine = (
      label: string,
      value: string,
      extraPadding = 0
    ): string => {
      const valueStr = String(value);
      const contentLength = label.length + valueStr.length;
      const padding = 31 - contentLength + extraPadding;
      return `║ ${label}${" ".repeat(Math.max(1, padding))}${valueStr} ║`;
    };

    const lines = [
      "╔════════════════════════════════════╗",
      "║       Archive Operation Summary    ║",
      "╠════════════════════════════════════╣",
      createLine("✅ Successful:", String(successful), 2),
      createLine("⚠️ Skipped:", String(skipped), 3),
      createLine("❌ Failed:", String(failed), 2),
      "╠════════════════════════════════════╣",
      createLine("Total:", String(total), 3),
      createLine("Duration:", duration, 3),
      "╚════════════════════════════════════╝",
    ];

    return lines.join("\n");
  }

  getElapsedTime(): string {
    const elapsed = Date.now() - this.startTime;
    return Formatting.formatDuration(elapsed);
  }

  getEstimatedTimeRemaining(completed: number, total: number): string | null {
    if (completed === 0) {
      return null;
    }

    const elapsed = Date.now() - this.startTime;
    const avgTime = elapsed / completed;
    const remaining = (total - completed) * avgTime;

    return remaining > 0 ? Formatting.formatDuration(remaining) : null;
  }
}
