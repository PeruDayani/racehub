import type { Address_DB } from "./types";

export function getInitials(
  name: string | undefined,
  email: string | undefined,
): string {
  if (name) {
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (email) {
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }

  return "??";
}

export function formatDate(date: string | null | undefined) {
  if (!date) return "TBD";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string | null | undefined) {
  if (!time) return "TBD";

  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatCurrency(cents: number): string {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return currencyFormatter.format(cents / 100);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculatePaymentRate(
  registrantCount: number,
  paidCount: number,
): number {
  return registrantCount > 0 ? ((paidCount ?? 0) / registrantCount) * 100 : 0;
}

export function formatRaceAddress(
  address: Address_DB | undefined | null,
): string {
  if (!address) return "TBD";
  return `${address.city}, ${address.state}`;
}
