// Date utilities for StudyFlow

// Reference date for the app is September 2, 2026 (matching system timestamp)
export const TODAY_ISO = '2026-09-02';

export function getTodayDateString(): string {
  // Use today's date if user is running on or past 2026, or use 2026-09-02 as the anchor date
  const now = new Date();
  const year = now.getFullYear();
  if (year >= 2026) {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return TODAY_ISO;
}

export function parseDateOnly(dateStr: string): Date {
  const parts = dateStr.split('-');
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = parseDateOnly(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatFullDate(dateStr: string): string {
  try {
    const d = parseDateOnly(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function getDaysDifference(targetDateStr: string, baseDateStr = getTodayDateString()): number {
  const target = parseDateOnly(targetDateStr);
  const base = parseDateOnly(baseDateStr);
  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getCountdownBadge(dateStr: string): { label: string; days: number; status: 'overdue' | 'today' | 'tomorrow' | 'soon' | 'future' } {
  const days = getDaysDifference(dateStr);
  if (days < 0) {
    return { label: `${Math.abs(days)}d ago`, days, status: 'overdue' };
  }
  if (days === 0) {
    return { label: 'Today', days, status: 'today' };
  }
  if (days === 1) {
    return { label: 'Tomorrow', days, status: 'tomorrow' };
  }
  if (days <= 7) {
    return { label: `${days} days left`, days, status: 'soon' };
  }
  return { label: `${days} days left`, days, status: 'future' };
}

export function isTaskDueToday(taskDueDate: string): boolean {
  return taskDueDate === getTodayDateString();
}
