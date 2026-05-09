export function formatDate(
  iso: string,
  mode: "long" | "short" = "long",
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  if (mode === "short") {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDateShort(iso: string): string {
  return formatDate(iso, "short");
}

/** Valeur pour un input `datetime-local` (heure locale). */
export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day}T${h}:${min}`;
}

export function datetimeLocalToIso(local: string): string {
  const t = new Date(local).getTime();
  return new Date(t).toISOString();
}
