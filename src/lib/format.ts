export function formatDistanceToNow(date: Date | string): string {
  const then = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}

export function formatDuration(
  start: Date | string,
  end: Date | string | null,
): string {
  const startMs =
    typeof start === "string" ? new Date(start).getTime() : start.getTime();
  const endMs = end
    ? typeof end === "string"
      ? new Date(end).getTime()
      : end.getTime()
    : Date.now();
  const ms = Math.max(0, endMs - startMs);

  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}m ${remainder}s`;
}
