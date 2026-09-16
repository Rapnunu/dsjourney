/** Local calendar date helpers (avoid UTC toISOString() date shifts). */

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getMondayOfWeekLocal(date: Date = new Date()): Date {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = local.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  local.setDate(local.getDate() + diff);
  return local;
}

export function addDaysLocal(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

export function daysBetweenLocal(fromDateStr: string, toDate: Date = new Date()): number {
  const from = parseLocalDateString(fromDateStr);
  const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const diffMs = to.getTime() - from.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getCurrentWeekDayLabels(): string[] {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

export function getCurrentWeekDatesLocal(
  referenceDate: Date = new Date(),
): Array<{ day: string; date: string }> {
  const monday = getMondayOfWeekLocal(referenceDate);
  const dayLabels = getCurrentWeekDayLabels();

  return dayLabels.map((day, index) => {
    const date = addDaysLocal(monday, index);
    return { day, date: getLocalDateString(date) };
  });
}

export function computeStudyStreak(
  sessionDates: Set<string>,
  referenceDate: Date = new Date(),
): number {
  let streak = 0;
  let checkDate = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  const todayStr = getLocalDateString(checkDate);
  if (!sessionDates.has(todayStr)) {
    checkDate = addDaysLocal(checkDate, -1);
  }

  while (sessionDates.has(getLocalDateString(checkDate))) {
    streak++;
    checkDate = addDaysLocal(checkDate, -1);
  }

  return streak;
}
