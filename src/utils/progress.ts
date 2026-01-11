import { Formatting } from "./formatting";

export interface ProgressUpdate {
  completed: number;
  failed: number;
  total: number;
  current?: {
    owner: string;
    repo: string;
  };
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

    const lines = [
      "╔════════════════════════════════════╗",
      "║       Archive Operation Summary    ║",
      "╠════════════════════════════════════╣",
      `║ ✅ Successful:  ${String(successful).padEnd(20)} ║`,
      `║ ⚠️  Skipped:     ${String(skipped).padEnd(20)} ║`,
      `║ ❌ Failed:      ${String(failed).padEnd(20)} ║`,
      "╠════════════════════════════════════╣",
      `║ Total:         ${String(total).padEnd(20)} ║`,
      `║ Duration:      ${String(duration).padEnd(20)} ║`,
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
