// lib/format.ts

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

export function ratingToStars(rating: number): number {
  return Math.round((rating / 10) * 10) / 10;
}

export function discountPercent(price: number, oldPrice?: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function formatDate(value: string | Date | number | null | undefined): string {
  // Если нет значения — показываем сегодня
  if (value === null || value === undefined) {
    return new Date().toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  try {
    let d: Date;
    
    if (typeof value === "number") {
      d = new Date(value);
    } else if (typeof value === "string") {
      d = new Date(value);
    } else {
      d = value;
    }
    
    // Если дата невалидная — показываем сегодня
    if (isNaN(d.getTime())) {
      return new Date().toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    // Если год странный — показываем сегодня
    const year = d.getFullYear();
    if (year > 2100 || year < 1900) {
      return new Date().toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    return d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date().toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export function formatDateTime(value: string | Date | number | null | undefined): string {
  if (value === null || value === undefined) {
    return new Date().toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  try {
    let d: Date;
    
    if (typeof value === "number") {
      d = new Date(value);
    } else if (typeof value === "string") {
      d = new Date(value);
    } else {
      d = value;
    }
    
    if (isNaN(d.getTime())) {
      return new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    const year = d.getFullYear();
    if (year > 2100 || year < 1900) {
      return new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date().toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}