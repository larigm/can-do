const WEEKDAY_LETTERS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS_SHORT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export interface DateOption {
  iso: string;
  weekday: string;
  day: number;
}

export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function getDateOption(iso: string): DateOption {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return { iso, weekday: WEEKDAY_LETTERS[date.getDay()], day };
}

export function getNextDays(count: number): DateOption[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    return getDateOption(toISODate(d));
  });
}


export function formatDateLabel(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  const text = `${day} de ${MONTHS_SHORT[month - 1]}`;
  return iso === getTodayISO() ? `Hoje, ${text}` : text;
}
// Título de seção da lista: "Hoje", "Amanhã" ou "24 de nov"
export function formatSectionLabel(iso: string): string {
  const today = new Date();
  const tomorrow = toISODate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
  );
  if (iso === getTodayISO()) return "Hoje";
  if (iso === tomorrow) return "Amanhã";

  const [, month, day] = iso.split("-").map(Number);
  return `${day} de ${MONTHS_SHORT[month - 1]}`;
}
// Semana atual, de segunda a domingo
export function getCurrentWeek(): DateOption[] {
  const today = new Date();
  const daysSinceMonday = (today.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) =>
    getDateOption(
      toISODate(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysSinceMonday + i,
        ),
      ),
    ),
  );
}